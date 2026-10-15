const BASE = 'https://www.popart.ee';
const LANDING_KEY = 'popart.landing.v1';
const sentPurchases = new Set();

/** Only route paths are stored or sent; never query strings or fragments. */
export function safePagePath(value) {
  if (typeof value !== 'string' || (!value.startsWith('/') && !/^https?:\/\//.test(value))) return '/';
  try {
    const path = new URL(value, BASE).pathname;
    return /^\/(?:[a-zA-Z0-9_/-]|%[0-9a-fA-F]{2})*$/.test(path) ? path : '/';
  } catch { return '/'; }
}

export function funnelParameters({ pathname, landingPage, language }) {
  return {
    landing_page: safePagePath(landingPage),
    language: ['et', 'ru', 'en'].includes(language) ? language : 'en',
    page_path: safePagePath(pathname),
  };
}

export function getLandingPage() {
  if (typeof window === 'undefined') return '/';
  const path = safePagePath(window.location.pathname);
  try {
    const stored = window.sessionStorage.getItem(LANDING_KEY);
    if (stored) return safePagePath(stored);
    window.sessionStorage.setItem(LANDING_KEY, path);
  } catch { /* Analytics storage must not block an order. */ }
  return path;
}

export function sendAnalyticsCommand(...args) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push((function () { return arguments; })(...args));
}

export function sendAnalyticsEvent(name, parameters) {
  sendAnalyticsCommand('event', name, parameters);
}

export function trackFunnelEvent(name, language) {
  if (!['upload_start', 'checkout_start'].includes(name) || typeof window === 'undefined') return;
  const parameters = funnelParameters({ pathname: window.location.pathname, landingPage: getLandingPage(), language });
  if (name === 'checkout_start') {
    try { window.sessionStorage.setItem('popart.checkout-context.v1', JSON.stringify(parameters)); } catch {}
  }
  sendAnalyticsEvent(name, parameters);
}

export function trackPurchase(purchase) {
  if (!purchase || typeof window === 'undefined' || sentPurchases.has(purchase.transaction_id)) return;
  const key = `popart.purchase.v1.${purchase.transaction_id}`;
  let context = { landingPage: getLandingPage(), language: 'en' };
  try {
    if (window.localStorage.getItem(key)) return;
    const stored = JSON.parse(window.sessionStorage.getItem('popart.checkout-context.v1') || 'null');
    if (stored) context = { landingPage: stored.landing_page, language: stored.language };
  } catch { /* Blocked storage must not interrupt the success page. */ }
  sentPurchases.add(purchase.transaction_id);
  sendAnalyticsEvent('purchase', { ...funnelParameters({ pathname: '/success', ...context }), ...purchase });
  try { window.localStorage.setItem(key, '1'); } catch {}
}
