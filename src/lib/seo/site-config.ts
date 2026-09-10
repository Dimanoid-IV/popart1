/** Canonical production origin (www aligned with blog + Stripe success URLs). */
export const SITE_ORIGIN = "https://www.popart.ee";

export const SITE_NAME = "PopArt.ee";

/** Storefront language alternates (real locale landing pages). */
export const LOCALE_ALTERNATES = {
  "x-default": SITE_ORIGIN,
  en: SITE_ORIGIN,
  et: `${SITE_ORIGIN}/et`,
  ru: `${SITE_ORIGIN}/ru`,
} as const;

export const OG_IMAGE = "/pic1.jpg";
