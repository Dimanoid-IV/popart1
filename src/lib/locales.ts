import type { Language } from "./translations";

export const STOREFRONT_LOCALES: Language[] = ["en", "et", "ru"];

export const PORTRAIT_PATHS = {
  et: "/et/portree-fotost",
  ru: "/ru/portret-po-foto",
} as const;

export function portraitPath(locale: Language): string | undefined {
  return locale === "en" ? undefined : PORTRAIT_PATHS[locale];
}

export function isStorefrontLocale(value: string): value is Language {
  return value === "en" || value === "et" || value === "ru";
}

/** Locale from the first URL segment. Unprefixed routes are English. */
export function getLocaleFromPath(pathname: string): Language {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first === "et" || first === "ru" || first === "en") return first;
  return "en";
}

/** Path without a leading /en|/et|/ru locale prefix. */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|et|ru)(?=\/|$)/, "");
  return stripped || "/";
}

/** Localized storefront href. English stays unprefixed (`/`, `/privacy`). */
export function localizePath(pathname: string, locale: Language): string {
  if (Object.values(PORTRAIT_PATHS).some((path) => path === pathname.replace(/\/$/, ""))) {
    return portraitPath(locale) ?? homePath(locale);
  }
  const rest = stripLocalePrefix(pathname);
  if (locale === "en") return rest;
  return rest === "/" ? `/${locale}` : `/${locale}${rest}`;
}

export function homePath(locale: Language): string {
  return locale === "en" ? "/" : `/${locale}`;
}

export function homeSectionPath(locale: Language, hash: string): string {
  const id = hash.startsWith("#") ? hash : `#${hash}`;
  return `${homePath(locale)}${id}`;
}

export function htmlLang(locale: Language): string {
  if (locale === "et") return "et";
  if (locale === "ru") return "ru";
  return "en";
}
