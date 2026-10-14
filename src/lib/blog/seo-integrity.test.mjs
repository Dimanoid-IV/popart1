import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  BLOG_EDITORIAL_REDIRECTS,
  BLOG_REMOVED_ARTICLE_REDIRECTS,
  getBlogRedirects,
} from "./editorial-policy.ts";

const DATA_ROOT = path.join(process.cwd(), "src", "data", "blog");
const locales = ["et", "ru", "en"];
const archived = new Set(
  BLOG_EDITORIAL_REDIRECTS.map(({ locale, slug }) => `${locale}:${slug}`)
);
const legacyRedirects = new Set([
  ...archived,
  ...BLOG_REMOVED_ARTICLE_REDIRECTS.map(({ slug }) => `ru:${slug}`),
]);
const expectedRedirects = [
  ["/ru/blog/sonbrapaeva-kingitus-paarile", "/ru/blog/portret-po-foto-podarok-na-svadbu"],
  ["/ru/blog/emadepaeva-kingitus", "/ru/blog/portret-mame-po-foto-na-holste"],
  ["/ru/blog/isadepaeva-kingitus", "/ru/blog/portret-pape-po-foto-podarok"],
  ["/ru/blog/tellimus-tallinnas-tarne", "/ru/blog/portree-fotost-tallinn"],
  ["/ru/blog/interjoor-portree-sein", "/ru/blog/portree-suurus-ja-paigutus-interjooris"],
  ["/ru/blog/canvas-gift-tallinn", "/ru/blog/portret-na-holste-podarok-na-yubiley"],
  ["/ru/blog/seinapilt-tellimine", "/ru/blog/portree-suurus-ja-paigutus-interjooris"],
  ["/ru/blog/pilt-louendil", "/ru/blog/portree-suurus-ja-paigutus-interjooris"],
  ["/ru/blog/kingitus-mehele", "/ru/blog/portret-pape-po-foto-podarok"],
  ["/ru/blog/kingitus-naisele", "/ru/blog/personalnyy-podarok-zhenshchine-estonia"],
  ["/ru/blog/personaalne-kingitus", "/ru/blog/personalnyy-podarok-zhenshchine-estonia"],
  ["/ru/blog/kingitus-synnipaevaks", "/ru/blog/portret-na-holste-podarok-na-yubiley"],
  ["/ru/blog/pulmakingitus-idee", "/ru/blog/portret-po-foto-podarok-na-svadbu"],
  ["/ru/blog/kunstiline-portree", "/ru/blog/portree-fotost-tallinn"],
  ["/ru/blog/custom-portrait-estonia", "/ru/blog/portree-fotost-tallinn"],
  ["/ru/blog/custom-art-portrait-estonia", "/ru/blog/portree-fotost-tallinn"],
  ["/ru/blog/dream-art-portree", "/ru/blog/portree-fotost-tallinn"],
  ["/ru/blog/dream-art-portree-fotost", "/ru/blog/portree-fotost-tallinn"],
  ["/ru/blog/digitaalne-kunstiline-portree", "/ru/blog/portree-fotost-tallinn"],
  ["/ru/blog/fantaasia-portree-fotost", "/ru/blog/portree-fotost-tallinn"],
  ["/ru/blog/dream-art-pilt-louendil", "/ru/blog/portree-suurus-ja-paigutus-interjooris"],
  ["/ru/blog/joulukingitus-2026", "/ru/blog/portret-na-holste-podarok-roditelyam"],
  ["/ru/blog/joulukingitus-mehele", "/ru/blog/portret-pape-po-foto-podarok"],
  ["/ru/blog/joulukingitus-naisele", "/ru/blog/personalnyy-podarok-zhenshchine-estonia"],
  [
    "/ru/blog/polnoe-rukovodstvo-popart-ee-v-podarok-kak-vybrat-luchshii-variant",
    "/ru/blog/personalnyy-podarok-zhenshchine-estonia",
  ],
  [
    "/blog/polnoe-rukovodstvo-popart-ee-v-podarok-kak-vybrat-luchshii-variant",
    "/ru/blog/personalnyy-podarok-zhenshchine-estonia",
  ],
  [
    "/ru/blog/polnoe-rukovodstvo-portret-po-foto-na-holste",
    "/ru/blog/portree-fotost-tallinn",
  ],
  [
    "/blog/polnoe-rukovodstvo-portret-po-foto-na-holste",
    "/ru/blog/portree-fotost-tallinn",
  ],
  [
    "/ru/blog/polnoe-rukovodstvo-cifrovaya-zhivopis-iz-fotografii",
    "/ru/blog/portree-fotost-tallinn",
  ],
  [
    "/blog/polnoe-rukovodstvo-cifrovaya-zhivopis-iz-fotografii",
    "/ru/blog/portree-fotost-tallinn",
  ],
  [
    "/ru/blog/polnoe-rukovodstvo-portret-po-foto-v-podarok",
    "/ru/blog/personalnyy-podarok-zhenshchine-estonia",
  ],
  [
    "/blog/polnoe-rukovodstvo-portret-po-foto-v-podarok",
    "/ru/blog/personalnyy-podarok-zhenshchine-estonia",
  ],
  ["/blog", "/et/blog"],
  ["/blog/:slug", "/ru/blog/:slug"],
  ["/en", "/"],
  ["/en/privacy", "/privacy"],
  ["/en/terms", "/terms"],
  ["/en/delivery", "/delivery"],
].map(([source, destination]) => ({ source, destination, permanent: true }));

function publishedArticleKeys() {
  const keys = new Set();
  for (const locale of locales) {
    const localeRoot = path.join(DATA_ROOT, locale);
    for (const filename of fs.readdirSync(localeRoot)) {
      if (!filename.endsWith(".json")) continue;
      const slug = filename.slice(0, -5);
      const key = `${locale}:${slug}`;
      if (archived.has(key)) continue;
      const article = JSON.parse(
        fs.readFileSync(path.join(localeRoot, filename), "utf8")
      );
      if (new Date(`${article.publishedAt}T00:00:00.000Z`) <= new Date()) {
        keys.add(key);
      }
    }
  }
  return keys;
}

function articleRecords() {
  const published = publishedArticleKeys();
  const records = [];
  for (const key of published) {
    const [locale, slug] = key.split(":");
    const article = JSON.parse(
      fs.readFileSync(path.join(DATA_ROOT, locale, `${slug}.json`), "utf8")
    );
    records.push({ locale, slug, article });
  }
  return { published, records };
}

function localArticleTargets(locale, article) {
  const values = [
    ...(article.internalLinks ?? []).map(({ href }) => href),
    ...Array.from(article.bodyHtml.matchAll(/href=["']([^"']+)["']/gi), (match) =>
      match[1]
    ),
  ];
  const targets = [];
  for (const value of values) {
    let pathname;
    try {
      pathname = new URL(value, "https://www.popart.ee").pathname;
    } catch {
      continue;
    }
    const match = pathname.match(/^\/(et|ru|en)\/blog\/([^/]+)\/?$/);
    if (match) targets.push(`${match[1]}:${match[2]}`);
    const unprefixed = pathname.match(/^\/blog\/([^/]+)\/?$/);
    if (unprefixed) targets.push(`${locale}:${unprefixed[1]}`);
  }
  return targets;
}

test("redirect table preserves every pre-PR source and destination", () => {
  assert.deepEqual(getBlogRedirects(), expectedRedirects);
});

test("redirects are unique, permanent, acyclic and target published articles", () => {
  const redirects = getBlogRedirects();
  const bySource = new Map(redirects.map(({ source, destination }) => [source, destination]));
  assert.equal(bySource.size, redirects.length, "redirect sources must be unique");
  assert.ok(redirects.every(({ permanent }) => permanent === true));

  for (const { source, destination } of redirects) {
    const visited = new Set([source]);
    let current = destination;
    while (bySource.has(current)) {
      assert.equal(visited.has(current), false, `redirect cycle at ${current}`);
      visited.add(current);
      current = bySource.get(current);
    }
  }

  const published = publishedArticleKeys();
  const missingDestinations = redirects
    .map(({ destination }) => destination.match(/^\/(et|ru|en)\/blog\/([^/:]+)$/))
    .filter(Boolean)
    .map((match) => `${match[1]}:${match[2]}`)
    .filter((target) => !published.has(target));
  assert.deepEqual(missingDestinations, []);
});

test("related article references resolve to published articles", () => {
  const { published, records } = articleRecords();
  const broken = [];
  for (const { locale, slug, article } of records) {
    for (const relatedSlug of article.relatedSlugs ?? []) {
      const target = `${locale}:${relatedSlug}`;
      if (!published.has(target) && !legacyRedirects.has(target)) {
        broken.push(`${locale}:${slug} -> ${target}`);
      }
    }
  }
  assert.deepEqual(broken, []);
});

test("article body and curated links resolve to published article routes", () => {
  const { published, records } = articleRecords();
  const broken = [];
  for (const { locale, slug, article } of records) {
    for (const target of localArticleTargets(locale, article)) {
      if (!published.has(target) && !legacyRedirects.has(target)) {
        broken.push(`${locale}:${slug} -> ${target}`);
      }
    }
  }
  assert.deepEqual([...new Set(broken)].sort(), []);
});
