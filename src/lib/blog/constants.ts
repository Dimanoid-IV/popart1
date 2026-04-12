import type { BlogLocale } from "./types";

export const SITE_URL = "https://www.popart.ee";

export const BLOG_LOCALES: BlogLocale[] = ["et", "ru", "en"];

export const BLOG_LOCALE_LABELS: Record<BlogLocale, string> = {
  et: "Eesti",
  ru: "Русский",
  en: "English",
};
