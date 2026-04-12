import type { BlogCategoryId, BlogLocale } from "./types";

export const BLOG_CATEGORY_IDS: BlogCategoryId[] = [
  "gifts",
  "portrait-guide",
  "interior",
  "local-estonia",
];

export function isValidBlogCategory(s: string): s is BlogCategoryId {
  return BLOG_CATEGORY_IDS.includes(s as BlogCategoryId);
}

/** Localized display titles for category hub pages and chips. */
export function getCategoryCopy(
  id: BlogCategoryId,
  locale: BlogLocale
): { title: string; description: string; short: string } {
  const table: Record<
    BlogCategoryId,
    Record<BlogLocale, { title: string; description: string; short: string }>
  > = {
    gifts: {
      et: {
        title: "Kingitused",
        short: "Kingitused",
        description:
          "Ideid ja juhendid portreedest kingituseks — sünnipäevad, tähtpäevad ja personaalsed üllatused.",
      },
      ru: {
        title: "Подарки",
        short: "Подарки",
        description:
          "Идеи и советы по портретам в подарок: дни рождения, праздники и персональные сюрпризы.",
      },
      en: {
        title: "Gifts",
        short: "Gifts",
        description:
          "Ideas and guides for portrait gifts—birthdays, milestones, and personal surprises.",
      },
    },
    "portrait-guide": {
      et: {
        title: "Portree juhend",
        short: "Portree juhend",
        description:
          "Kuidas valida fotot, suurust ja stiili kunstilise portree tellimiseks Eestis.",
      },
      ru: {
        title: "Гид по портретам",
        short: "Гид по портретам",
        description:
          "Как выбрать фото, размер и стиль для заказа художественного портрета в Эстонии.",
      },
      en: {
        title: "Portrait guide",
        short: "Portrait guide",
        description:
          "How to choose photos, sizes, and style when ordering an artistic portrait in Estonia.",
      },
    },
    interior: {
      et: {
        title: "Interjöör",
        short: "Interjöör",
        description:
          "Portree ja lõuend elamus- ja magamistoas — mõõdud, valgus ja paigutus.",
      },
      ru: {
        title: "Интерьер",
        short: "Интерьер",
        description:
          "Портрет и холст в гостиной и спальне: размеры, свет и композиция.",
      },
      en: {
        title: "Interior",
        short: "Interior",
        description:
          "Portraits and canvas in living rooms and bedrooms—sizes, light, and placement.",
      },
    },
    "local-estonia": {
      et: {
        title: "Eesti ja Tallinn",
        short: "Eesti",
        description:
          "Tellimine, tarne ja praktika kohalikele klientidele Eestis ja Tallinnas.",
      },
      ru: {
        title: "Эстония и Таллин",
        short: "Эстония",
        description:
          "Заказ, доставка и практические советы для клиентов в Эстонии и Таллине.",
      },
      en: {
        title: "Local Estonia",
        short: "Estonia",
        description:
          "Ordering, delivery, and practical notes for customers in Estonia and Tallinn.",
      },
    },
  };
  return table[id][locale];
}
