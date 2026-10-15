/* No dependencies installed by this test. Point POPART_PLAYWRIGHT_PATH at an existing Playwright.
   The only allowed network is the local test server and Google's actual tag JavaScript.
   Every analytics/advertising collector is aborted; no test hits reach GA reports. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.POPART_PLAYWRIGHT_PATH ? pathToFileURL(path.join(process.env.POPART_PLAYWRIGHT_PATH, 'index.mjs')).href : 'playwright');
const origin = process.env.SEO_TEST_ORIGIN || 'http://127.0.0.1:32148';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(origin).hostname), 'Browser suite may only use a local test server');
const languages = {
  et: { path: '/et/portree-fotost', accept: 'Nõustu kõigiga', reject: 'Keeldu valikulistest', configure: 'Kohanda', settings: 'Küpsiste seaded', save: 'Salvesta valikud', close: 'Sulge seaded' },
  ru: { path: '/ru/portret-po-foto', accept: 'Принять все', reject: 'Отклонить необязательные', configure: 'Настроить', settings: 'Настройки cookies', save: 'Сохранить выбор', close: 'Закрыть настройки' },
  en: { path: '/', accept: 'Accept all', reject: 'Reject optional', configure: 'Customize', settings: 'Cookie settings', save: 'Save choices', close: 'Close settings' },
};
const results = [];
const choice = allowed => { const chosenAt = Date.now() - 120000; return { version: 1, necessary: true, analytics: allowed, chosenAt, expiresAt: chosenAt + 180 * 86400000 }; };
const gaCookies = cookies => cookies.filter(x => /^_ga(?:_|$)|^_gid$|^_gat/.test(x.name));
const events = page => page.evaluate(() => (window.dataLayer || []).filter(x => x[0] === 'event').map(x => ({ name: x[1], data: x[2] })));
async function until(check, label) {
  const end = Date.now() + 15000;
  while (Date.now() < end) { if (await check()) return; await new Promise(resolve => setTimeout(resolve, 100)); }
  throw Error(`Timed out: ${label}`);
}
async function setup(browser, width = 390, blockTag = false) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
  const requests = [], collects = [], errors = [];
  context.on('page', page => page.on('pageerror', e => errors.push(e.message)));
  await context.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url());
    if (url.origin === origin) {
      if (url.pathname === '/api/generation-credits') return route.fulfill({ json: { freeRemaining: 2, paidRemaining: 0, totalRemaining: 2 } });
      if (url.pathname.startsWith('/api/')) throw Error('Unexpected API: ' + url.pathname);
      return route.continue();
    }
    requests.push(req.url());
    if (url.hostname === 'www.googletagmanager.com' && url.pathname.startsWith('/gtag/')) {
      if (blockTag) return route.abort();
      return route.fulfill({ response: await route.fetch() });
    }
    if (/google-analytics\.com$/.test(url.hostname) || /\/collect/.test(url.pathname)) {
      collects.push({ url: req.url(), body: req.postData() });
    }
    return route.abort();
  });
  const page = await context.newPage();
  return { context, page, requests, collects, errors };
}
function hitCount(data, event) { return data.collects.filter(x => new URL(x.url).searchParams.get('en') === event || x.body?.includes(`en=${event}`)).length; }
async function addChoice(context, allowed, visitor) {
  const cookies = [{ name: 'popart_consent', value: encodeURIComponent(JSON.stringify(choice(allowed))), url: origin }];
  if (visitor) cookies.push({ name: 'popart_visitor', value: visitor, url: origin, httpOnly: true });
  await context.addCookies(cookies);
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    if (process.env.CONSENT_TEST_SCOPE !== 'purchase') {
    for (const width of [375, 390, 768, 1440]) for (const [lang, labels] of Object.entries(languages)) {
      const data = await setup(browser, width), { page, context } = data;
      await page.addInitScript(() => { window.consentShifts = []; new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.consentShifts.push(e.value); }).observe({ type: 'layout-shift', buffered: true }); });
      await page.goto(origin + labels.path);
      await page.locator('[data-cookie-banner]').waitFor();
      await page.waitForTimeout(350);
      assert.equal(data.requests.length, 0, 'No third-party tag or ping on first visit');
      assert.deepEqual(gaCookies(await context.cookies()), []);
      assert.equal(await page.evaluate(() => Object.keys(sessionStorage).length + Object.keys(localStorage).length), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator('[data-cookie-banner]').evaluate(el => getComputedStyle(el).position), 'static');
      await page.getByRole('button', { name: labels.configure, exact: true }).click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor({ state: 'visible' });
      assert.equal(await dialog.getByRole('checkbox').isChecked(), false);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (process.env.CONSENT_SCREENSHOT_DIR && lang === 'et' && width === 375) await page.screenshot({ path: `${process.env.CONSENT_SCREENSHOT_DIR}/consent-settings-et-375.png` });
      await dialog.getByRole('checkbox').focus();
      await page.keyboard.press('Space');
      assert.equal(await dialog.getByRole('checkbox').isChecked(), true);
      await page.keyboard.press('Space');
      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: labels.reject, exact: true }).first().click();
      await page.reload();
      await page.waitForTimeout(250);
      assert.equal(await page.locator('[data-cookie-banner]').count(), 0);
      assert.equal(data.requests.length, 0);
      assert.deepEqual(gaCookies(await context.cookies()), []);
      const other = await context.newPage(); await other.goto(origin + labels.path);
      await other.getByRole('button', { name: labels.settings, exact: true }).click();
      assert.equal(await other.getByRole('dialog').getByRole('checkbox').isChecked(), false);
      await other.keyboard.press('Escape');
      if (process.env.CONSENT_SCREENSHOT_DIR && [375, 1440].includes(width)) {
        await context.clearCookies(); await page.reload(); await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator("[data-cookie-banner]").waitFor();
        await page.screenshot({ path: `${process.env.CONSENT_SCREENSHOT_DIR}/consent-${lang}-${width}.png`, fullPage: false });
      }
      assert.deepEqual(data.errors, []);
      console.log('PASS', results.length + 1); results.push({ case: 'first visit / refusal / refresh / new tab / keyboard', lang, width, observedShift: await page.evaluate(() => window.consentShifts?.reduce((a, b) => a + b, 0) || 0) });
      await context.close();
    }

    // Real gtag.js; all collection requests are intercepted above, including consent pings.
    {
      const data = await setup(browser), { context, page } = data, labels = languages.et;
      await page.goto(origin + labels.path + '?utm_source=consent_audit&utm_medium=cpc&email=private@example.invalid&session_id=secret');
      assert.equal(data.requests.length, 0);
      await page.getByRole('button', { name: labels.accept, exact: true }).click();
      await until(() => hitCount(data, 'page_view') === 1, 'accepted current page view');
      await page.waitForTimeout(500);
      assert.equal(hitCount(data, 'page_view'), 1);
      assert.ok(gaCookies(await context.cookies()).length >= 1);
      assert.ok(data.requests.some(url => url.includes('/gtag/js')));
      assert.ok(data.collects.some(x => new URL(x.url).searchParams.get('cs') === 'consent_audit'));
      for (const hit of data.collects) {
        const url = new URL(hit.url);
        assert.doesNotMatch(url.searchParams.get('dl') || '', /email|session_id|private|secret/);
      }
      const commands = await page.evaluate(() => window.dataLayer.filter(x => x[0] === 'consent').map(x => Array.from(x)));
      assert.equal(commands[0][1], 'default');
      assert.deepEqual(commands[0][2], { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', security_storage: 'granted' });
      assert.ok(commands.every(x => ['ad_storage', 'ad_user_data', 'ad_personalization'].every(key => x[2][key] === 'denied')));
      await page.locator('a[href="/et/blog/pilt-louendil"]').first().click();
      await until(() => hitCount(data, 'page_view') >= 2, 'SPA view');
      await page.waitForTimeout(700); assert.equal(hitCount(data, 'page_view'), 2);
      await page.reload(); await until(() => hitCount(data, 'page_view') >= 3, 'restored consent view');
      await page.waitForTimeout(500); assert.equal(hitCount(data, 'page_view'), 3);
      const other = await context.newPage(); await other.goto(origin + '/et');
      await until(() => hitCount(data, 'page_view') >= 4, 'new tab restored consent');
      await page.waitForTimeout(500); assert.equal(hitCount(data, 'page_view'), 4);
      await context.addCookies([{ name: 'popart_visitor', value: 'preserve-fixture', url: origin, httpOnly: true }]);
      await page.getByRole('button', { name: labels.settings, exact: true }).click();
      const beforeRevoke = data.collects.length;
      await page.getByRole('dialog').getByRole('button', { name: labels.reject, exact: true }).click();
      await until(() => other.evaluate(() => window['ga-disable-G-H52TSV34MX'] === true), 'other tab revocation');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
      assert.equal(data.collects.length, beforeRevoke, 'No denied-state/cookieless events after withdrawal');
      assert.deepEqual(gaCookies(await context.cookies()), []);
      assert.ok((await context.cookies()).some(x => x.name === 'popart_visitor'));
      assert.equal(await page.evaluate(() => Object.keys(sessionStorage).length + Object.keys(localStorage).length), 0);
      await other.close();
      await page.getByRole('button', { name: labels.settings, exact: true }).click();
      await page.getByRole('dialog').getByRole('checkbox').check();
      await page.getByRole('dialog').getByRole('button', { name: labels.save, exact: true }).click();
      await until(() => hitCount(data, 'page_view') === 5, 'same-document re-consent');
      await page.getByRole('button', { name: labels.settings, exact: true }).click();
      await page.getByRole('dialog').getByRole('button', { name: labels.reject, exact: true }).click();
      await page.reload(); await page.waitForTimeout(300);
      assert.equal(await page.locator('#popart-ga').count(), 0);
      await page.getByRole('button', { name: labels.settings, exact: true }).click();
      await page.getByRole('dialog').getByRole('checkbox').check();
      await page.getByRole('dialog').getByRole('button', { name: labels.save, exact: true }).click();
      await until(() => hitCount(data, 'page_view') === 6, 're-consent current page');
      assert.deepEqual(data.errors, []);
      console.log('PASS', results.length + 1); results.push({ case: 'real tag: acceptance, UTM, SPA, refresh, new tab, revoke across tabs, re-consent', collectedRequestsAborted: data.collects.length });
      await context.close();
    }

    // A script requested after acceptance can finish downloading after withdrawal.
    // It must not replay the now-withdrawn page_view or create analytics cookies.
    {
      const data = await setup(browser), { page, context } = data;
      let release, requested = false;
      const held = new Promise(resolve => { release = resolve; });
      await context.route('https://www.googletagmanager.com/gtag/js**', async route => {
        requested = true; await held; await route.fulfill({ response: await route.fetch() });
      });
      await page.goto(origin + '/et');
      await page.getByRole('button', { name: languages.et.accept, exact: true }).click();
      await until(() => requested, 'delayed script requested after acceptance');
      await page.getByRole('button', { name: languages.et.settings, exact: true }).click();
      await page.getByRole('dialog').getByRole('button', { name: languages.et.reject, exact: true }).click();
      release();
      await until(() => page.evaluate(() => typeof window.google_tag_manager === 'object'), 'delayed real tag executed');
      await page.waitForTimeout(1000);
      assert.equal(data.collects.length, 0);
      assert.deepEqual(gaCookies(await context.cookies()), []);
      await page.getByRole('button', { name: languages.et.settings, exact: true }).click();
      await page.getByRole('dialog').getByRole('checkbox').check();
      await page.getByRole('dialog').getByRole('button', { name: languages.et.save, exact: true }).click();
      await until(() => hitCount(data, 'page_view') === 1, 'delayed tag re-consent without replay');
      await page.waitForTimeout(500); assert.equal(hitCount(data, 'page_view'), 1);
      assert.deepEqual(data.errors, []);
      console.log('PASS', results.length + 1); results.push({ case: 'real tag downloaded after withdrawal: no cookies, no pings, no stale event replay' });
      await context.close();
    }

    // Real DOM with unavailable persistence. Explicit consent remains valid in this document only.
    {
      const data = await setup(browser, 375, true), { context, page } = data;
      await page.addInitScript(() => {
        Object.defineProperty(document, 'cookie', { get() { throw Error('storage blocked'); }, set() { throw Error('storage blocked'); } });
        for (const key of ['localStorage', 'sessionStorage']) Object.defineProperty(window, key, { get() { throw Error('storage blocked'); } });
      });
      await page.goto(origin + '/ru'); await page.waitForTimeout(250);
      assert.equal(data.requests.length, 0);
      await page.getByRole('button', { name: languages.ru.accept, exact: true }).click();
      await until(() => page.locator('#popart-ga').count(), 'tag only after explicit consent despite blocked storage');
      await page.reload(); await page.waitForTimeout(250);
      assert.equal(await page.locator('#popart-ga').count(), 0);
      assert.deepEqual(data.errors, []);
      console.log('PASS', results.length + 1); results.push({ case: 'unavailable cookie, localStorage and sessionStorage; explicit consent and refresh' });
      await context.close();
    }

    // Existing order flow with fixture APIs; Google tag deliberately blocked to test redirect fallback.
    for (const lang of ['et', 'ru']) {
      const data = await setup(browser, lang === 'et' ? 390 : 1440, true), { context, page } = data;
      let checkout;
      await page.route('**/api/**', async route => {
        const req = route.request(), url = new URL(req.url()); let json;
        if (url.pathname === '/api/generation-credits') json = { freeRemaining: 2, paidRemaining: 0, totalRemaining: 2 };
        else if (url.pathname === '/api/generate') json = { taskIds: ['fixture1', 'fixture2'], credits: { freeRemaining: 1, totalRemaining: 1 } };
        else if (url.pathname === '/api/generate/status') json = { code: 200, successFlag: 1, response: { resultImageUrl: '/pic1.jpg', portraitId: url.searchParams.get('taskId') } };
        else if (url.pathname === '/api/checkout') { checkout = req.postDataJSON(); json = { url: '#checkout-test-completed' }; }
        else throw Error('Unexpected order API');
        await route.fulfill({ json });
      });
      const et = lang === 'et', labels = languages[lang];
      await page.goto(origin + labels.path);
      await page.getByRole('button', { name: et ? labels.accept : labels.reject, exact: true }).click();
      await page.locator('main a[href$="#order-now"]').first().click();
      await page.waitForURL(`**/${lang}#order-now`);
      const [chooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.getByRole('button', { name: et ? 'Vali fail' : 'Выбрать файл', exact: true }).click(),
      ]);
      await chooser.setFiles(path.resolve('public/pic1.jpg'));
      await page.getByRole('button', { name: et ? 'Töötle' : 'Обработать', exact: true }).click();
      await page.locator('img[alt="Result 1"]').click();
      await page.getByRole('button', { name: et ? 'Jätka maksmisega' : 'Перейти к оплате', exact: true }).click();
      const placeholders = et ? ['Täisnimi', 'E-posti aadress', 'Tarneaadress (Tänav, maja, korter)', 'Postiindeks', 'Telefoninumber'] : ['Имя и Фамилия', 'Электронная почта', 'Адрес доставки (Улица, дом, кв.)', 'Почтовый индекс', 'Номер телефона'];
      for (const [i, value] of ['Test Person', 'qa@example.invalid', 'Test street 1', '10111', '00000000'].entries()) await page.getByPlaceholder(placeholders[i], { exact: true }).fill(value);
      await page.locator('#order-now button').filter({ hasText: /Maksa|Оплатить/ }).click();
      await page.waitForURL('**#checkout-test-completed');
      const queued = (await events(page)).filter(x => x.name !== 'page_view');
      assert.deepEqual(queued.map(x => x.name), et ? ['upload_start', 'checkout_start'] : []);
      assert.doesNotMatch(JSON.stringify(queued), /qa@example|Test Person|00000000|data:image|portraitId/);
      assert.equal(checkout.size, '45x30 cm'); assert.equal(checkout.price, 45); assert.equal(checkout.portraitId, 'fixture1');
      assert.deepEqual(data.errors, []);
      console.log('PASS', results.length + 1); results.push({ case: 'upload → generation fixtures → preview → checkout with blocked tag', lang, consent: et, events: queued.map(x => x.name) });
      await context.close();
    }

    }
    if (process.env.POPART_CONSENT_TEST_FIXTURES === '1') {
      for (const scenario of ['paid', 'refused', 'unpaid', 'other-owner', 'late-consent']) {
        const data = await setup(browser), { context, page } = data;
        if (scenario !== 'refused') await addChoice(context, true, scenario === 'other-owner' ? 'not-the-owner' : 'consent-fixture-owner');
        else await context.addCookies([{ name: 'popart_visitor', value: 'consent-fixture-owner', url: origin, httpOnly: true }]);
        if (scenario === 'late-consent') {
          const chosenAt = Date.now(); const recent = { ...choice(true), chosenAt, expiresAt: chosenAt + 180 * 86400000 };
          await context.addCookies([{ name: 'popart_consent', value: encodeURIComponent(JSON.stringify(recent)), url: origin }]);
        }
        const path = `/success?session_id=${scenario === 'unpaid' ? 'cs_test_consentUnpaid' : 'cs_test_consentPaid'}`;
        await page.goto(origin + path);
        if (scenario === 'paid') {
          await until(() => hitCount(data, 'purchase') >= 1, 'verified purchase');
          await until(() => page.evaluate(() => Object.keys(localStorage).some(key => key.startsWith('popart.purchase.v1.'))), 'purchase callback dedup');
          const hit = data.collects.find(x => new URL(x.url).searchParams.get('en') === 'purchase');
          assert.doesNotMatch(JSON.stringify(hit), /cs_test_consentPaid|session_id|email/);
          await page.reload(); await page.waitForTimeout(1500);
          const tab = await context.newPage(); await tab.goto(origin + path); await tab.waitForTimeout(1500);
          assert.equal(hitCount(data, 'purchase'), 1);
        } else {
          await page.waitForTimeout(1200);
          assert.equal(hitCount(data, 'purchase'), 0);
          if (scenario === 'refused') {
            assert.equal(data.requests.length, 0);
            await page.getByRole('button', { name: languages.en.accept, exact: true }).click();
            await page.waitForTimeout(1500); assert.equal(hitCount(data, 'purchase'), 0);
            await page.reload(); await page.waitForTimeout(1500); assert.equal(hitCount(data, 'purchase'), 0, 'Never backfill pre-consent payment');
          }
        }
        assert.deepEqual(data.errors, []);
        console.log('PASS', results.length + 1); results.push({ case: 'server-verified success with local Stripe fixture', scenario, purchases: hitCount(data, 'purchase') });
        await context.close();
      }
    }
    console.log(JSON.stringify({ passed: results.length, results }, null, 2));
    if (process.env.CONSENT_RESULT_PATH) fs.writeFileSync(process.env.CONSENT_RESULT_PATH, JSON.stringify({ passed: results.length, results }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
