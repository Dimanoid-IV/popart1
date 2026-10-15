import assert from 'node:assert/strict';
import test from 'node:test';

import * as analytics from './funnel-analytics.mjs';
import * as purchase from './purchase-analytics.mjs';

test('analytics excludes query strings, hashes and personal data from page context', () => {
  assert.equal(typeof analytics.safePagePath, 'function');
  assert.equal(analytics.safePagePath('https://www.popart.ee/success?session_id=secret#email'), '/success');
  assert.equal(analytics.safePagePath('/et/portree-fotost?email=a@b.ee'), '/et/portree-fotost');
  assert.equal(analytics.safePagePath('not a URL'), '/');
  assert.deepEqual(analytics.funnelParameters({ pathname: '/ru?email=secret', landingPage: '/ru/portret-po-foto?token=secret', language: 'ru', email: 'secret' }), {
    landing_page: '/ru/portret-po-foto', language: 'ru', page_path: '/ru',
  });
});

const paid = {
  id: 'cs_test_example', mode: 'payment', status: 'complete', payment_status: 'paid',
  currency: 'eur', amount_total: 4201, metadata: { size: '45x30 cm', visitorId: 'owner', depositDiscountCents: '299', depositReservationId: 'reservation', fullName: 'Must not be exposed' },
  customer_details: { email: 'private@example.com' },
};

test('purchase uses verified Stripe payment amount and an opaque transaction id', () => {
  assert.equal(typeof purchase.verifiedPurchase, 'function');
  const event = purchase.verifiedPurchase(paid, 'owner');
  assert.equal(event.value, 42.01);
  assert.equal(event.currency, 'EUR');
  assert.match(event.transaction_id, /^[a-f0-9]{32}$/);
  assert.deepEqual(Object.keys(event).sort(), ['currency', 'items', 'transaction_id', 'value']);
  assert.equal(event.items[0].item_variant, '45x30 cm');
  assert.doesNotMatch(JSON.stringify(event), /private|Must not|cs_test/);
  assert.equal(purchase.verifiedPurchase(paid, 'owner').transaction_id, event.transaction_id);
});

test('success visits, unpaid sessions and credit top-ups never count as canvas purchases', () => {
  assert.equal(typeof purchase.verifiedPurchase, 'function');
  for (const session of [null, {}, { ...paid, payment_status: 'unpaid' }, { ...paid, status: 'open' }, { ...paid, currency: 'usd' }, { ...paid, amount_total: null }, { ...paid, metadata: { purchaseType: 'generation_credits' } }]) {
    assert.equal(purchase.verifiedPurchase(session, 'owner'), null);
  }
});

test('purchase tracking preserves landing context, strips PII and suppresses repeat visits', async () => {
  assert.equal(typeof analytics.trackPurchase, 'function');
  const memory = new Map();
  const storage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
  globalThis.window = {
    location: { pathname: '/success' }, dataLayer: [], localStorage: storage, sessionStorage: storage,
  };
  storage.setItem('popart.checkout-context.v1', JSON.stringify({ landing_page: '/ru/portret-po-foto?email=secret', language: 'ru', email: 'secret' }));
  try {
    const event = purchase.verifiedPurchase(paid, 'owner');
    analytics.trackPurchase(event);
    analytics.trackPurchase({ ...event });
    window.dataLayer[0][2].event_callback();
    // Simulate a fresh JS module on a repeat visit while keeping browser storage.
    const reloaded = await import(`./funnel-analytics.mjs?reload=1`);
    reloaded.trackPurchase(event);
    assert.equal(window.dataLayer.length, 1);
    const [command, name, parameters] = Array.from(window.dataLayer[0]);
    assert.equal(command, 'event');
    assert.equal(name, 'purchase');
    assert.equal(parameters.landing_page, '/ru/portret-po-foto');
    assert.equal(parameters.language, 'ru');
    assert.doesNotMatch(JSON.stringify(parameters), /secret|email|session_id/);
  } finally { delete globalThis.window; }
});

test('a failed analytics queue does not permanently suppress a purchase retry', async () => {
  const memory = new Map();
  globalThis.window = { location: { pathname: '/success' }, sessionStorage: { getItem: () => null, setItem: () => {} }, localStorage: { getItem: key => memory.get(key), setItem: (key, value) => memory.set(key, value) }, dataLayer: { push() { throw Error('tag failed'); } } };
  try {
    const event = purchase.verifiedPurchase({ ...paid, id: 'cs_test_retry' }, 'owner');
    analytics.trackPurchase(event);
    assert.equal(memory.size, 0);
    window.dataLayer = [];
    analytics.trackPurchase(event);
    assert.equal(window.dataLayer.length, 1);
    assert.equal(memory.size, 0, 'queueing is not confirmation of processing');
    window.dataLayer[0][2].event_callback();
    assert.equal(memory.size, 1);
  } finally { delete globalThis.window; }
});

test('another browser cannot retrieve or attribute a paid canvas purchase', () => {
  assert.equal(purchase.verifiedPurchase(paid, 'attacker'), null);
  assert.equal(purchase.verifiedPurchase(paid, undefined), null);
  assert.equal(purchase.verifiedPurchase({ ...paid, metadata: { ...paid.metadata, visitorId: undefined } }, 'owner'), null);
});

test('purchase amounts match server pricing and the recorded generation deposit', () => {
  assert.equal(purchase.verifiedPurchase({ ...paid, amount_total: 50 }, 'owner'), null);
  assert.equal(purchase.verifiedPurchase({ ...paid, metadata: { ...paid.metadata, depositDiscountCents: '-1' } }, 'owner'), null);
  assert.equal(purchase.verifiedPurchase({ ...paid, amount_total: 4500, metadata: { ...paid.metadata, depositDiscountCents: '0' } }, 'owner').value, 45);
  assert.equal(purchase.verifiedPurchase({ ...paid, amount_total: 50, metadata: { ...paid.metadata, depositDiscountCents: '4500' } }, 'owner').value, 0.5);
});

test('analytics exceptions cannot block a user action', () => {
  globalThis.window = { location: { pathname: '/ru' }, sessionStorage: { getItem: () => { throw Error('blocked'); } }, dataLayer: { push() { throw Error('broken tag'); } } };
  try { assert.doesNotThrow(() => analytics.trackFunnelEvent('upload_start', 'ru')); }
  finally { delete globalThis.window; }
});

test('only safe UTM campaign labels survive URL cleanup', () => {
  assert.equal(typeof analytics.safeCampaignParameters, 'function');
  assert.deepEqual(analytics.safeCampaignParameters('?utm_source=google&utm_medium=cpc&utm_campaign=portrait_ee&email=private&session_id=secret'), {
    campaign_source: 'google', campaign_medium: 'cpc', campaign_name: 'portrait_ee',
  });
  assert.deepEqual(analytics.safeCampaignParameters('?utm_source=person%40example.com&utm_campaign=https%3A%2F%2Fexample.com%2Ftoken'), {});
});

test('checkout waits for analytics processing with an independent fallback and only redirects once', async () => {
  globalThis.window = { location: { pathname: '/et' }, sessionStorage: { getItem: () => null, setItem: () => {} }, dataLayer: [] };
  try {
    let redirects = 0;
    analytics.trackFunnelEvent('checkout_start', 'et', () => { redirects++; });
    const event = window.dataLayer[0][2];
    assert.equal(typeof event.event_callback, 'function');
    assert.equal(redirects, 0);
    event.event_callback(); event.event_callback();
    assert.equal(redirects, 1);
    window.dataLayer = { push() { throw Error('blocked'); } };
    analytics.trackFunnelEvent('checkout_start', 'et', () => { redirects++; });
    assert.equal(redirects, 2);
  } finally { delete globalThis.window; }
});

test('a new success tab does not invent an English language or a landing page', () => {
  globalThis.window = { location: { pathname: '/success' }, sessionStorage: { getItem: () => null, setItem: () => {} }, localStorage: { getItem: () => null, setItem: () => {} }, dataLayer: [] };
  try {
    analytics.trackPurchase(purchase.verifiedPurchase({ ...paid, id: 'cs_test_newtab' }, 'owner'));
    const parameters = window.dataLayer[0][2];
    assert.equal(parameters.language, undefined);
    assert.equal(parameters.landing_page, undefined);
    assert.equal(parameters.page_path, '/success');
  } finally { delete globalThis.window; }
});
