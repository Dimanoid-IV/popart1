import { homePath, homeSectionPath } from "@/lib/locales";
import type { BlogLocale } from "./types";

const ORIGIN_RE = /^https?:\/\/(?:www\.)?popart\.ee/i;

function splitPathAndHash(value: string): { path: string; hash: string } {
  const hashIndex = value.indexOf("#");
  if (hashIndex === -1) {
    return { path: value || "/", hash: "" };
  }
  return {
    path: value.slice(0, hashIndex) || "/",
    hash: value.slice(hashIndex),
  };
}

/**
 * Point blog CTAs and homepage links at the matching locale storefront
 * (`/et#order-now`, `/ru#order-now`, `/#order-now`) instead of English `/`.
 */
export function localizeStorefrontHref(href: string, locale: BlogLocale): string {
  const raw = href.trim();
  if (!raw) return raw;

  let remainder = raw;
  if (ORIGIN_RE.test(raw)) {
    remainder = raw.replace(ORIGIN_RE, "") || "/";
  }

  const { path, hash } = splitPathAndHash(remainder);
  const normalizedPath = path.replace(/\/+$/, "") || "/";

  if (hash === "#order-now" && (normalizedPath === "/" || normalizedPath === "/en")) {
    return homeSectionPath(locale, "#order-now");
  }

  if ((normalizedPath === "/" || normalizedPath === "/en") && !hash) {
    return homePath(locale);
  }

  if (ORIGIN_RE.test(raw)) {
    return `${normalizedPath === "/" ? "" : normalizedPath}${hash}`;
  }

  return href;
}

export function localizeStorefrontHrefsInHtml(
  html: string,
  locale: BlogLocale
): string {
  return html.replace(/href=(["'])([^"']+)\1/gi, (_match, quote: string, href: string) => {
    return `href=${quote}${localizeStorefrontHref(href, locale)}${quote}`;
  });
}
