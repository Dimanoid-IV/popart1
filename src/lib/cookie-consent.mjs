export const GA_ID = 'G-H52TSV34MX';
export const CONSENT_COOKIE = 'popart_consent';
export const CONSENT_VERSION = 1;
export const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
const states = new WeakMap();

export function createConsent(analytics, now = Date.now()) {
  return { version: CONSENT_VERSION, necessary: true, analytics: analytics === true, chosenAt: now, expiresAt: now + CONSENT_LIFETIME };
}

export function parseConsent(value, now = Date.now()) {
  try {
    const data = JSON.parse(value);
    if (data?.version !== CONSENT_VERSION || data.necessary !== true || typeof data.analytics !== 'boolean' || !Number.isSafeInteger(data.chosenAt) || data.chosenAt > now || data.chosenAt < 0 || data.expiresAt !== data.chosenAt + CONSENT_LIFETIME || data.expiresAt <= now) return null;
    return { version: data.version, necessary: true, analytics: data.analytics, chosenAt: data.chosenAt, expiresAt: data.expiresAt };
  } catch { return null; }
}

/** Stripe timestamps are seconds. Be conservative: never backfill a payment predating consent. */
export function consentAllowsPurchase(choice, sessionCreated) {
  return choice?.analytics === true && Number.isSafeInteger(sessionCreated) && choice.chosenAt <= sessionCreated * 1000;
}

export function readConsentCookie() {
  try {
    const value = document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith(`${CONSENT_COOKIE}=`));
    return value ? parseConsent(decodeURIComponent(value.slice(CONSENT_COOKIE.length + 1))) : null;
  } catch { return null; }
}

// This local queue does not load a tag or send consent/cookieless pings.
function command(...args) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push((function () { return arguments; })(...args));
  } catch { /* Blocked analytics must never affect the storefront. */ }
}

function consentValues(allowed) {
  return { analytics_storage: allowed ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', security_storage: 'granted' };
}

export function clearAnalyticsStorage() {
  try {
    window.sessionStorage.removeItem('popart.landing.v1');
    window.sessionStorage.removeItem('popart.checkout-context.v1');
  } catch {}
  try {
    const storage = window.localStorage;
    for (let i = storage.length - 1; i >= 0; i--) {
      const key = storage.key(i);
      if (key?.startsWith('popart.purchase.v1.')) storage.removeItem(key);
    }
  } catch {}
  try {
    const names = document.cookie.split(';').map(x => x.trim().split('=')[0]).filter(x => /^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(x));
    const labels = window.location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < labels.length - 1; i++) domains.push(labels.slice(i).join('.'));
    const segments = window.location.pathname.split('/').filter(Boolean);
    const paths = new Set(['/']);
    for (let i = 1; i <= segments.length; i++) paths.add(`/${segments.slice(0, i).join('/')}`);
    for (const name of names) for (const domain of domains) for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; Path=${path}${domain ? `; Domain=${domain}` : ''}; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    }
  } catch {}
}

function apply(state, choice) {
  state.choice = choice;
  state.revision++;
  const allowed = choice?.analytics === true;
  // Disable before issuing denied update: an already loaded tag must not send cookieless pings.
  window[`ga-disable-${GA_ID}`] = !allowed;
  if (!allowed) {
    try {
      const queue = window.dataLayer;
      for (let i = queue.length - 1; i >= 0; i--) if (queue[i]?.[0] === 'event') queue.splice(i, 1);
    } catch {}
    clearAnalyticsStorage();
  }
  command('consent', 'update', consentValues(allowed));
  for (const listener of state.listeners) listener();
}

function state() {
  if (typeof window === 'undefined') return null;
  if (!states.has(window)) {
    const current = { choice: readConsentCookie(), revision: 0, listeners: new Set(), configured: false, channel: null, persisted: true };
    states.set(window, current);
    window[`ga-disable-${GA_ID}`] = true;
    command('consent', 'default', consentValues(false));
    apply(current, current.choice);
  }
  return states.get(window);
}

export function getConsentSnapshot() { return state()?.choice ?? null; }
export function consentRevision() { return state()?.revision ?? 0; }
export function hasAnalyticsConsent() {
  const current = state();
  if (current?.choice && current.choice.expiresAt <= Date.now()) apply(current, null);
  return current?.choice?.analytics === true;
}

export function setConsent(analytics) {
  const current = state();
  if (!current) return;
  const choice = current.choice?.analytics === (analytics === true) && current.choice.expiresAt > Date.now() ? current.choice : createConsent(analytics);
  try {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(choice))}; Max-Age=${Math.max(0, Math.floor((choice.expiresAt - Date.now()) / 1000))}; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    current.persisted = JSON.stringify(readConsentCookie()) === JSON.stringify(choice);
  } catch { current.persisted = false; /* Explicit consent applies to this document only. */ }
  if (choice !== current.choice) apply(current, choice);
  try { current.channel?.postMessage('changed'); } catch {}
}

export function subscribeConsent(listener) {
  const current = state();
  current.listeners.add(listener);
  return () => current.listeners.delete(listener);
}

/** Cookie changes in other tabs are checked on broadcast, focus and page restoration. */
export function watchConsent() {
  const current = state();
  const sync = () => {
    const choice = readConsentCookie();
    if (!current.persisted && choice === null) return;
    if (JSON.stringify(choice) !== JSON.stringify(current.choice)) apply(current, choice);
  };
  const expire = () => { if (current.choice?.expiresAt <= Date.now()) apply(current, null); };
  let channel;
  try { channel = new BroadcastChannel('popart.consent.v1'); channel.onmessage = sync; current.channel = channel; } catch {}
  window.addEventListener('focus', sync);
  window.addEventListener('pageshow', sync);
  document.addEventListener('visibilitychange', sync);
  const timer = setInterval(expire, 1000);
  return () => { clearInterval(timer); channel?.close(); current.channel = null; window.removeEventListener('focus', sync); window.removeEventListener('pageshow', sync); document.removeEventListener('visibilitychange', sync); };
}

/** Consent default/update and safe config are queued before the external script is even created. */
export function startGoogleAnalytics(parameters, update = true) {
  if (!hasAnalyticsConsent()) return;
  const current = state();
  if (current.configured && !update) return;
  command('set', { ...parameters, allow_google_signals: false, allow_ad_personalization_signals: false });
  if (!current.configured) {
    current.configured = true;
    command('js', new Date());
    command('config', GA_ID, { ...parameters, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 34560000 });
    try {
      const script = document.createElement('script');
      script.id = 'popart-ga';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
    } catch { /* A blocked tag must not throw into a page effect. */ }
  }
}
