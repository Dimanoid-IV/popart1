import fs from "fs";
import path from "path";
import type { BlogArticle, BlogCategoryId, BlogLocale } from "./types";
import { BLOG_LOCALES } from "./constants";
import { BLOG_CATEGORY_IDS } from "./categories";

const DATA_ROOT = path.join(process.cwd(), "src", "data", "blog");

export function listSlugsForLocale(locale: BlogLocale): string[] {
  const dir = path.join(DATA_ROOT, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getArticle(
  locale: BlogLocale,
  slug: string
): BlogArticle | null {
  const file = path.join(DATA_ROOT, locale, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = JSON.parse(fs.readFileSync(file, "utf-8")) as Omit<
    BlogArticle,
    "locale" | "slug"
  > & { slug?: string };
  return {
    ...raw,
    locale,
    slug: raw.slug ?? slug,
  };
}

export function getAllArticleParams(): { locale: BlogLocale; slug: string }[] {
  const params: { locale: BlogLocale; slug: string }[] = [];
  for (const locale of BLOG_LOCALES) {
    for (const slug of listSlugsForLocale(locale)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export function listArticlesForLocale(locale: BlogLocale): BlogArticle[] {
  const articles = listSlugsForLocale(locale)
    .map((slug) => getArticle(locale, slug))
    .filter((a): a is BlogArticle => a !== null);
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function isValidBlogLocale(s: string): s is BlogLocale {
  return BLOG_LOCALES.includes(s as BlogLocale);
}

export function listArticlesByCategory(
  locale: BlogLocale,
  category: BlogCategoryId
): BlogArticle[] {
  return listArticlesForLocale(locale).filter((a) => a.category === category);
}

export function getAllCategoryPageParams(): {
  locale: BlogLocale;
  category: BlogCategoryId;
}[] {
  const params: { locale: BlogLocale; category: BlogCategoryId }[] = [];
  for (const locale of BLOG_LOCALES) {
    for (const category of BLOG_CATEGORY_IDS) {
      params.push({ locale, category });
    }
  }
  return params;
}
