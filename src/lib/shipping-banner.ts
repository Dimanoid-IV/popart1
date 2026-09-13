import type { Language } from "./translations";

const SHIPPING_BANNER: Record<Language, string> = {
  en: "Free delivery across Estonia",
  ru: "Бесплатная доставка по всей Эстонии",
  et: "Tasuta kohaletoimetamine üle Eesti",
};

export function getShippingBanner(language: Language): string {
  return SHIPPING_BANNER[language];
}
