import type { BlogCategoryId, BlogLocale } from "./types";
import { SITE_URL } from "./constants";

export function blogArticlePath(locale: BlogLocale, slug: string): string {
  return `/${locale}/blog/${slug}`;
}

export function blogArticleUrl(locale: BlogLocale, slug: string): string {
  return `${SITE_URL}${blogArticlePath(locale, slug)}`;
}

export function blogIndexPath(locale: BlogLocale): string {
  return `/${locale}/blog`;
}

export function blogIndexUrl(locale: BlogLocale): string {
  return `${SITE_URL}${blogIndexPath(locale)}`;
}

export function blogCategoryPath(
  locale: BlogLocale,
  category: BlogCategoryId
): string {
  return `/${locale}/blog/category/${category}`;
}

export function blogCategoryUrl(
  locale: BlogLocale,
  category: BlogCategoryId
): string {
  return `${SITE_URL}${blogCategoryPath(locale, category)}`;
}
