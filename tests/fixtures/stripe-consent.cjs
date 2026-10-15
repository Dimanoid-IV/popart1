/* eslint-disable @typescript-eslint/no-require-imports -- Node --require preload patches native transport before the bundled Stripe SDK imports it. */
// Local browser-test server only. Never imported by the application or production build.
if (process.env.POPART_CONSENT_TEST_FIXTURES !== '1' || process.env.STRIPE_SECRET_KEY !== 'sk_test_local_fixture') {
  throw new Error('Consent Stripe fixtures require explicit local-test environment');
}
const { EventEmitter } = require('node:events');
const { Readable } = require('node:stream');
const https = require('node:https');
const originalRequest = https.request;
function payload(url, method) {
  if (method !== 'GET' || !/^\/v1\/checkout\/sessions\/cs_test_consent(?:Paid|Unpaid)$/.test(url.pathname)) throw Error('Unapproved Stripe fixture request; network is blocked');
  const id = url.pathname.split('/').at(-1);
  return { id, created: Math.floor(Date.now() / 1000) - 60, mode: 'payment', status: 'complete', payment_status: id.endsWith('Unpaid') ? 'unpaid' : 'paid', currency: 'eur', amount_total: 4500, metadata: { size: '45x30 cm', visitorId: 'consent-fixture-owner', depositDiscountCents: '0' } };
}
https.request = function (options, ...args) {
  const host = options.hostname || options.host || '';
  if (host !== 'api.stripe.com') return originalRequest.call(this, options, ...args);
  const body = payload(new URL(options.path, 'https://api.stripe.com'), options.method);
  const request = new EventEmitter();
  request.setTimeout = () => request;
  request.write = () => true;
  request.destroy = error => { if (error) request.emit('error', error); };
  request.end = () => {
    const response = Readable.from([JSON.stringify(body)]);
    response.statusCode = 200; response.headers = { 'content-type': 'application/json', 'request-id': 'local-consent-fixture' };
    queueMicrotask(() => request.emit('response', response));
  };
  queueMicrotask(() => request.emit('socket', { connecting: false }));
  return request;
};
const originalFetch = globalThis.fetch;
globalThis.fetch = async function (input, options = {}) {
  const url = new URL(typeof input === 'string' ? input : input.url || input.href);
  if (url.hostname === 'api.stripe.com') return Response.json(payload(url, options.method || 'GET'));
  return originalFetch(input, options);
};
