import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  BLOG_EDITORIAL_REDIRECTS,
  BLOG_REMOVED_ARTICLE_REDIRECTS,
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
