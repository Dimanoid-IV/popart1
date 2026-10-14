import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test, { after, before } from "node:test";

const port = 32147;
const origin = process.env.SEO_TEST_ORIGIN ?? `http://127.0.0.1:${port}`;
const bypassToken = process.env.SEO_TEST_BYPASS_TOKEN;
const startsLocalServer = !process.env.SEO_TEST_ORIGIN;
let server;
let output = "";

async function request(input, init = {}) {
  const headers = new Headers(init.headers);
  if (bypassToken) {
    headers.set("x-vercel-protection-bypass", bypassToken);
  }
  return fetch(input, { ...init, headers });
}

async function waitForServer() {
  const deadline = Date.now() + 300_000;
  while (Date.now() < deadline) {
    try {
      const response = await request(`${origin}/robots.txt`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Next.js did not start.\n${output.slice(-4000)}`);
}

before(async () => {
  if (!startsLocalServer) return;
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  server.stdout.on("data", (chunk) => (output += chunk));
  server.stderr.on("data", (chunk) => (output += chunk));
  await waitForServer();
});

after(() => {
  if (server && !server.killed) server.kill("SIGTERM");
});

async function page(pathname, options) {
  const response = await request(`${origin}${pathname}`, options);
  return { response, html: await response.text() };
}

function linkTags(html, rel) {
  return Array.from(html.matchAll(/<link\s+[^>]*>/gi), ([tag]) => tag)
    .filter((tag) => new RegExp(`rel=["']${rel}["']`, "i").test(tag))
    .map((tag) => ({
      href: tag.match(/href=["']([^"']+)["']/i)?.[1],
      hreflang: tag.match(/hreflang=["']([^"']+)["']/i)?.[1],
    }));
}

function sitemapRecords(xml) {
  return Array.from(xml.matchAll(/<url>([\s\S]*?)<\/url>/g), (match) => ({
    loc: match[1].match(/<loc>(.*?)<\/loc>/)?.[1],
    lastmod: match[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
  }));
}

async function inBatches(values, size, operation) {
  for (let index = 0; index < values.length; index += size) {
    await Promise.all(values.slice(index, index + size).map(operation));
  }
}

async function assertAlternatesResolve(pathname) {
  const { response, html } = await page(pathname);
  assert.equal(response.status, 200);
  const alternates = linkTags(html, "alternate").filter(({ hreflang }) => hreflang);
  assert.ok(alternates.length > 0, `${pathname} should expose language alternates`);
  for (const alternate of alternates) {
    const target = new URL(alternate.href);
    const targetResponse = await request(`${origin}${target.pathname}`);
    assert.equal(
      targetResponse.status,
      200,
      `${pathname} ${alternate.hreflang} points to ${target.pathname}`
    );
  }
  return alternates;
}

test("article hreflang uses only real translations and remains reciprocal", async () => {
  const sourcePath = "/ru/blog/personalnyy-podarok-zhenshchine-estonia";
  const alternates = await assertAlternatesResolve(sourcePath);
  const english = alternates.find(({ hreflang }) => hreflang === "en");
  assert.equal(
    new URL(english.href).pathname,
    "/en/blog/personal-gift-for-her-estonia"
  );
  const { html: englishHtml } = await page(new URL(english.href).pathname);
  const englishAlternates = linkTags(englishHtml, "alternate");
  assert.ok(
    englishAlternates.some(
      ({ hreflang, href }) =>
        hreflang === "ru" && new URL(href).pathname === sourcePath
    ),
    "English translation should link back to the Russian article"
  );
});

test("category hreflang omits locales with no published category page", async () => {
  const alternates = await assertAlternatesResolve("/en/blog/category/dream-art");
  assert.equal(alternates.some(({ hreflang }) => hreflang === "ru"), false);
});

test("success can be crawled to read noindex and has no canonical", async () => {
  const { response, html } = await page("/success");
  assert.equal(response.status, 200);
  assert.match(html, /<meta[^>]+name=["']robots["'][^>]+noindex[^>]+nofollow/i);
  assert.equal(linkTags(html, "canonical").length, 0);
  const robots = await (await request(`${origin}/robots.txt`)).text();
  assert.doesNotMatch(robots, /Disallow:\s*\/success/i);
});

test("test email UI and API are unavailable without an explicit development flag", async () => {
  assert.equal((await request(`${origin}/test-email`)).status, 404);
  assert.equal((await request(`${origin}/api/test-email`)).status, 404);
});

test("global JSON-LD contains the site entities without an invisible FAQ", async () => {
  const { html } = await page("/");
  const scripts = Array.from(
    html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    (match) => JSON.parse(match[1])
  );
  const types = scripts.flatMap((script) =>
    (script["@graph"] ?? [script]).map((entry) => entry["@type"])
  );
  assert.ok(types.includes("Organization"));
  assert.ok(types.includes("WebSite"));
  assert.equal(types.includes("FAQPage"), false);
});

test("sitemap URLs are unique HTTPS pages and synthetic lastmod values are absent", async () => {
  const { response, html: xml } = await page("/sitemap.xml");
  assert.equal(response.status, 200);
  const records = sitemapRecords(xml);
  const urls = records.map(({ loc }) => loc);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.every((url) => url.startsWith("https://www.popart.ee")));
  assert.equal(records.find(({ loc }) => loc === "https://www.popart.ee").lastmod, undefined);
  assert.equal(
    records.find(({ loc }) => loc === "https://www.popart.ee/et/blog").lastmod,
    undefined
  );
  assert.equal(
    records.find(({ loc }) => loc === "https://www.popart.ee/en/blog/category/dream-art").lastmod,
    undefined
  );
  assert.ok(
    records.find(({ loc }) => loc.includes("/blog/") && !loc.includes("/category/"))
      .lastmod,
    "articles retain a real publication or update date"
  );
});

test("every sitemap page returns 200 with a self-canonical and matching HTML language", async () => {
  const xml = await (await request(`${origin}/sitemap.xml`)).text();
  const records = sitemapRecords(xml);
  await inBatches(records, 8, async ({ loc }) => {
    const expected = new URL(loc);
    const { response, html } = await page(expected.pathname);
    assert.equal(response.status, 200, expected.pathname);
    const canonical = linkTags(html, "canonical")[0]?.href;
    assert.equal(canonical, loc, `${expected.pathname} canonical`);
    const firstSegment = expected.pathname.split("/").filter(Boolean)[0];
    const expectedLang = firstSegment === "et" || firstSegment === "ru" ? firstSegment : "en";
    assert.match(
      html,
      new RegExp(`<html[^>]+lang=["']${expectedLang}["']`, "i"),
      `${expected.pathname} lang`
    );
  });
});

test("all emitted hreflang targets return 200 and link back", async () => {
  const xml = await (await request(`${origin}/sitemap.xml`)).text();
  const records = sitemapRecords(xml);
  const htmlCache = new Map();
  async function htmlFor(pathname) {
    if (!htmlCache.has(pathname)) htmlCache.set(pathname, page(pathname));
    return htmlCache.get(pathname);
  }
  await inBatches(records, 6, async ({ loc }) => {
    const source = new URL(loc);
    const { html } = await htmlFor(source.pathname);
    const sourceLang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1];
    for (const alternate of linkTags(html, "alternate").filter(({ hreflang }) => hreflang)) {
      const target = new URL(alternate.href);
      const { response, html: targetHtml } = await htmlFor(target.pathname);
      assert.equal(response.status, 200, `${source.pathname} -> ${target.pathname}`);
      if (alternate.hreflang === "x-default") continue;
      const reciprocal = linkTags(targetHtml, "alternate").some(
        ({ hreflang, href }) =>
          hreflang === sourceLang && new URL(href).pathname === source.pathname
      );
      assert.ok(reciprocal, `${target.pathname} should link back to ${source.pathname}`);
    }
  });
});

test("internal links emitted by sitemap pages do not end on HTTP errors", async () => {
  const xml = await (await request(`${origin}/sitemap.xml`)).text();
  const records = sitemapRecords(xml);
  const targets = new Set();
  await inBatches(records, 8, async ({ loc }) => {
    const source = new URL(loc);
    const { html } = await page(source.pathname);
    for (const match of html.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)) {
      const href = match[1];
      if (/^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
      const target = new URL(href, "https://www.popart.ee");
      if (target.hostname !== "www.popart.ee") continue;
      if (target.pathname.startsWith("/api/")) continue;
      targets.add(`${target.pathname}${target.search}`);
    }
  });
  await inBatches([...targets], 8, async (target) => {
    const response = await request(`${origin}${target}`);
    assert.ok(response.status < 400, `${target} returned ${response.status}`);
  });
});

test("representative permanent redirects terminate without loops", async () => {
  for (const start of ["/blog", "/en", "/ru/blog/dream-art-portree"]) {
    const visited = new Set();
    let pathname = start;
    let finalStatus = 0;
    for (let hop = 0; hop < 6; hop += 1) {
      assert.equal(visited.has(pathname), false, `${start} redirect loop at ${pathname}`);
      visited.add(pathname);
      const response = await request(`${origin}${pathname}`, { redirect: "manual" });
      finalStatus = response.status;
      if (![301, 302, 307, 308].includes(response.status)) break;
      pathname = new URL(response.headers.get("location"), origin).pathname;
    }
    assert.equal(finalStatus, 200, `${start} should end at a 200 page`);
  }
});

test("category title contains the brand once and canonical/lang match the URL", async () => {
  const pathname = "/et/blog/category/gifts";
  const { html } = await page(pathname);
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1] ?? "";
  assert.equal((title.match(/PopArt\.ee/g) ?? []).length, 1);
  assert.equal(
    new URL(linkTags(html, "canonical")[0].href).pathname,
    pathname
  );
  assert.match(html, /<html[^>]+lang=["']et["']/i);
});
