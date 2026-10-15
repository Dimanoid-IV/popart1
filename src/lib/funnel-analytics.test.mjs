import assert from 'node:assert/strict';
import test from 'node:test';

const analytics = await import('./funnel-analytics.mjs').catch(() => ({}));
const purchase = await import('./purchase-analytics.mjs').catch(() => ({}));

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
  currency: 'eur', amount_total: 4201, metadata: { size: '45x30 cm', fullName: 'Must not be exposed' },
  customer_details: { email: 'private@example.com' },
};

test('purchase uses verified Stripe payment amount and an opaque transaction id', () => {
  assert.equal(typeof purchase.verifiedPurchase, 'function');
  const event = purchase.verifiedPurchase(paid);
  assert.equal(event.value, 42.01);
  assert.equal(event.currency, 'EUR');
  assert.match(event.transaction_id, /^[a-f0-9]{32}$/);
  assert.deepEqual(Object.keys(event).sort(), ['currency', 'items', 'transaction_id', 'value']);
  assert.equal(event.items[0].item_variant, '45x30 cm');
  assert.doesNotMatch(JSON.stringify(event), /private|Must not|cs_test/);
  assert.equal(purchase.verifiedPurchase(paid).transaction_id, event.transaction_id);
});

test('success visits, unpaid sessions and credit top-ups never count as canvas purchases', () => {
  assert.equal(typeof purchase.verifiedPurchase, 'function');
  for (const session of [null, {}, { ...paid, payment_status: 'unpaid' }, { ...paid, status: 'open' }, { ...paid, currency: 'usd' }, { ...paid, amount_total: null }, { ...paid, metadata: { purchaseType: 'generation_credits' } }]) {
    assert.equal(purchase.verifiedPurchase(session), null);
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
    const event = purchase.verifiedPurchase(paid);
    analytics.trackPurchase(event);
    analytics.trackPurchase({ ...event });
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
