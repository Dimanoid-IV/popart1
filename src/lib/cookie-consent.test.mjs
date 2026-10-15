import assert from 'node:assert/strict';
import test from 'node:test';
import * as analytics from './funnel-analytics.mjs';

// This catches a missing consent gate at the real public event boundary.
test('first visit and refusal cannot queue events or write analytics storage; checkout still continues', () => {
  const writes = [];
  globalThis.document = { cookie: '' };
  globalThis.window = { location: { pathname: '/et' }, dataLayer: [], sessionStorage: { getItem: () => null, setItem: (...args) => writes.push(args) }, localStorage: { getItem: () => null, setItem: (...args) => writes.push(args) } };
  try {
    analytics.trackFunnelEvent('upload_start', 'et');
    let redirects = 0;
    analytics.trackFunnelEvent('checkout_start', 'et', () => { redirects++; });
    analytics.trackPurchase({ transaction_id: 'without-consent', value: 45, currency: 'EUR', items: [] });
    assert.equal(window.dataLayer.filter(x => x[0] === 'event').length, 0);
    assert.deepEqual(writes, []);
    assert.equal(redirects, 1);
  } finally { delete globalThis.window; delete globalThis.document; }
});

const consent = await import('./cookie-consent.mjs');

test('choices expire, reject obsolete policy versions and cannot authorize a pre-consent payment', () => {
  assert.equal(typeof consent.createConsent, 'function');
  const choice = consent.createConsent(true, 1000000);
  assert.equal(consent.parseConsent(JSON.stringify(choice), 1000001).analytics, true);
  for (const invalid of [{ ...choice, version: 0 }, { ...choice, analytics: 'yes' }, { ...choice, chosenAt: 2000000 }, { ...choice, expiresAt: 1000000 }, { ...choice, expiresAt: choice.expiresAt + 1 }]) {
    assert.equal(consent.parseConsent(JSON.stringify(invalid), 1000001), null);
  }
  assert.equal(consent.parseConsent(JSON.stringify(choice), choice.expiresAt), null);
  assert.equal(consent.consentAllowsPurchase(choice, 999), false);
  assert.equal(consent.consentAllowsPurchase(choice, 1001), true);
  assert.equal(consent.consentAllowsPurchase({ ...choice, analytics: false }, 1001), false);
});

function environment(cookie = '') {
  const memory = new Map();
  const storage = { get length() { return memory.size; }, key: i => [...memory.keys()][i] ?? null, getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) };
  const deleted = [];
  const cookies = new Map(cookie.split(';').map(x => x.trim()).filter(Boolean).map(x => { const i = x.indexOf('='); return [x.slice(0, i), x.slice(i + 1)]; }));
  globalThis.document = { get cookie() { return [...cookies].map(([k, v]) => `${k}=${v}`).join('; '); }, set cookie(value) { const pair = value.split(';')[0]; const i = pair.indexOf('='); if (value.includes('Max-Age=0')) { deleted.push(value); cookies.delete(pair.slice(0, i)); } else cookies.set(pair.slice(0, i), pair.slice(i + 1)); } };
  document.createElement = () => ({});
  document.head = { appendChild() {} };
  globalThis.window = { location: { pathname: '/et', hostname: 'www.popart.ee', protocol: 'https:' }, dataLayer: [], sessionStorage: storage, localStorage: storage };
  return { memory, deleted, cleanup() { delete globalThis.window; delete globalThis.document; } };
}

test('acceptance grants only analytics; withdrawal disables the tag before consent update and clears only analytics', () => {
  assert.equal(typeof consent.setConsent, 'function');
  const env = environment();
  try {
    consent.setConsent(true);
    assert.equal(consent.hasAnalyticsConsent(), true);
    assert.equal(window['ga-disable-G-H52TSV34MX'], false);
    const commands = window.dataLayer.map(x => Array.from(x));
    assert.deepEqual(commands[0], ['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', security_storage: 'granted' }]);
    assert.equal(commands.at(-1)[2].analytics_storage, 'granted');
    assert.equal(commands.at(-1)[2].ad_user_data, 'denied');
    env.memory.set('popart.landing.v1', '/et');
    env.memory.set('popart.purchase.v1.abc', '1');
    env.memory.set('necessary-order', 'preserve');
    document.cookie = '_ga=abc; _ga_H52TSV34MX=def; popart_visitor=preserve';
    analytics.trackFunnelEvent('upload_start', 'et');
    consent.setConsent(false);
    assert.equal(consent.hasAnalyticsConsent(), false);
    assert.equal(window['ga-disable-G-H52TSV34MX'], true);
    assert.equal(window.dataLayer.filter(x => x[0] === 'event').length, 0, 'a late tag may not replay withdrawn queued events');
    assert.deepEqual([...env.memory.entries()], [['necessary-order', 'preserve']]);
    assert.ok(env.deleted.some(x => x.startsWith('_ga=')));
    assert.ok(env.deleted.every(x => !x.startsWith('popart_visitor=')));
    consent.setConsent(true);
    analytics.trackFunnelEvent('upload_start', 'et');
    assert.equal(window.dataLayer.filter(x => x[0] === 'event').length, 1);
  } finally { env.cleanup(); }
});

test('stored consent restores in a new document; failed cookie storage grants only current document', () => {
  assert.equal(typeof consent.createConsent, 'function');
  const choice = consent.createConsent(true);
  const env = environment(`popart_consent=${encodeURIComponent(JSON.stringify(choice))}`);
  try { assert.equal(consent.hasAnalyticsConsent(), true); }
  finally { env.cleanup(); }
  const blocked = environment();
  Object.defineProperty(document, 'cookie', { configurable: true, get() { throw Error('blocked'); }, set() { throw Error('blocked'); } });
  try {
    assert.equal(consent.hasAnalyticsConsent(), false);
    assert.doesNotThrow(() => consent.setConsent(true));
    assert.equal(consent.hasAnalyticsConsent(), true);
  } finally { blocked.cleanup(); }
  const fresh = environment();
  try { assert.equal(consent.hasAnalyticsConsent(), false); }
  finally { fresh.cleanup(); }
});

test('withdrawal before purchase callback cannot recreate tracking storage', () => {
  assert.equal(typeof consent.setConsent, 'function');
  const env = environment();
  try {
    consent.setConsent(true);
    analytics.trackPurchase({ transaction_id: 'revoke-before-callback', value: 45, currency: 'EUR', items: [] });
    const callback = window.dataLayer.find(x => x[1] === 'purchase')[2].event_callback;
    consent.setConsent(false);
    callback();
    assert.equal(env.memory.size, 0);
  } finally { env.cleanup(); }
});

test('a purchase effect before the page-view effect initializes GA with safe URLs before the event', () => {
  const env = environment();
  document.createElement = () => ({});
  document.head = { appendChild() {} };
  window.location.origin = 'https://www.popart.ee';
  window.location.search = '?session_id=private';
  try {
    consent.setConsent(true);
    analytics.trackPurchase({ transaction_id: 'first-hydration-event', value: 45, currency: 'EUR', items: [] });
    const queue = window.dataLayer.map(x => Array.from(x));
    const configIndex = queue.findIndex(x => x[0] === 'config');
    const purchaseIndex = queue.findIndex(x => x[1] === 'purchase');
    assert.ok(configIndex >= 0 && configIndex < purchaseIndex);
    assert.equal(queue[configIndex][2].send_page_view, false);
    assert.doesNotMatch(JSON.stringify(queue), /session_id|private/);
  } finally { env.cleanup(); }
});

test('saving an unchanged accepted choice does not invalidate purchase acknowledgement', () => {
  const env = environment();
  try {
    consent.setConsent(true);
    analytics.trackPurchase({ transaction_id: 'unchanged-settings-callback', value: 45, currency: 'EUR', items: [] });
    const callback = window.dataLayer.find(x => x[1] === 'purchase')[2].event_callback;
    consent.setConsent(true);
    callback();
    assert.equal(env.memory.get('popart.purchase.v1.unchanged-settings-callback'), '1');
  } finally { env.cleanup(); }
});

test('unavailable sessionStorage does not prevent removal of available local analytics storage', () => {
  const env = environment();
  try {
    consent.setConsent(true);
    env.memory.set('popart.purchase.v1.available', '1');
    window.sessionStorage = { removeItem() { throw Error('blocked session storage'); } };
    consent.setConsent(false);
    assert.equal(env.memory.has('popart.purchase.v1.available'), false);
  } finally { env.cleanup(); }
});

test('a blocked script insertion cannot throw into a page effect or storefront action', () => {
  const env = environment();
  try {
    consent.setConsent(true);
    document.createElement = () => { throw Error('script insertion blocked'); };
    assert.doesNotThrow(() => consent.startGoogleAnalytics({ page_location: 'https://www.popart.ee/et' }));
  } finally { env.cleanup(); }
});

test('saving an unchanged choice does not extend its cookie beyond the recorded expiry', () => {
  const env = environment();
  const choice = consent.createConsent(true, Date.now() - 120000);
  let value = `popart_consent=${encodeURIComponent(JSON.stringify(choice))}`, lastWrite = '';
  Object.defineProperty(document, 'cookie', { configurable: true, get: () => value, set: input => { lastWrite = input; value = input.split(';')[0]; } });
  try {
    consent.setConsent(true);
    const maxAge = Number(lastWrite.match(/Max-Age=(\d+)/)[1]);
    assert.ok(maxAge <= 15551880, 'Two elapsed minutes must not be restored to the consent lifetime');
  } finally { env.cleanup(); }
});
