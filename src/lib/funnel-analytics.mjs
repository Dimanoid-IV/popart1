const BASE = 'https://www.popart.ee';
const LANDING_KEY = 'popart.landing.v1';
const sentPurchases = new Set();

/** Campaign labels are explicitly allowed; arbitrary URL values never enter GA. */
export function safeCampaignParameters(search) {
  const query = new URLSearchParams(search);
  const result = {};
  for (const [key, field] of [['utm_source', 'campaign_source'], ['utm_medium', 'campaign_medium'], ['utm_campaign', 'campaign_name']]) {
    const value = query.get(key);
    if (value && /^[\p{L}\p{N} _.-]{1,100}$/u.test(value)) result[field] = value;
  }
  return result;
}

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
  if (typeof window === 'undefined') return false;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push((function () { return arguments; })(...args));
    return true;
  } catch { return false; }
}

export function sendAnalyticsEvent(name, parameters) {
  return sendAnalyticsCommand('event', name, parameters);
}

export function trackFunnelEvent(name, language, onProcessed) {
  if (!['upload_start', 'checkout_start'].includes(name) || typeof window === 'undefined') return;
  const parameters = funnelParameters({ pathname: window.location.pathname, landingPage: getLandingPage(), language });
  if (name === 'checkout_start') {
    try { window.sessionStorage.setItem('popart.checkout-context.v1', JSON.stringify(parameters)); } catch {}
  }
  if (typeof onProcessed !== 'function') return sendAnalyticsEvent(name, parameters);
  let done = false;
  let timer;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    onProcessed();
  };
  // Redirect even if GA is blocked, slow, or its tag throws.
  timer = setTimeout(finish, 1200);
  if (!sendAnalyticsEvent(name, { ...parameters, event_callback: finish, event_timeout: 1000 })) finish();
}

export function trackPurchase(purchase) {
  if (!purchase || typeof window === 'undefined' || sentPurchases.has(purchase.transaction_id)) return;
  const key = `popart.purchase.v1.${purchase.transaction_id}`;
  let context = { page_path: '/success' };
  try {
    if (window.localStorage.getItem(key)) return;
    const stored = JSON.parse(window.sessionStorage.getItem('popart.checkout-context.v1') || 'null');
    if (stored && typeof stored.landing_page === 'string' && ['et', 'ru', 'en'].includes(stored.language)) {
      context = funnelParameters({ pathname: '/success', landingPage: stored.landing_page, language: stored.language });
    }
  } catch { /* Blocked storage must not interrupt the success page. */ }
  sentPurchases.add(purchase.transaction_id);
  const processed = () => {
    try { window.localStorage.setItem(key, '1'); } catch {}
  };
  if (!sendAnalyticsEvent('purchase', { ...context, ...purchase, event_callback: processed })) {
    sentPurchases.delete(purchase.transaction_id);
  }
}
