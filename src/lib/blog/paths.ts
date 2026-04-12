import type { BlogLocale } from "./types";
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
