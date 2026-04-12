/** Canonical production origin (www aligned with blog + Stripe success URLs). */
export const SITE_ORIGIN = "https://www.popart.ee";

export const SITE_NAME = "PopArt.ee";

export const LOCALE_ALTERNATES = {
  et: `${SITE_ORIGIN}/et/blog`,
  ru: `${SITE_ORIGIN}/ru/blog`,
  en: `${SITE_ORIGIN}/en/blog`,
} as const;
