/**
 * Real Facebook recommendations for the storefront.
 * First names only — never store or display last names.
 *
 * These are Recommend Yes/No reviews (not star ratings).
 * Do NOT invent extra reviews. Do NOT emit AggregateRating JSON-LD
 * (the Facebook page has no star average).
 *
 * Source: https://www.facebook.com/DreamArtTallinn/reviews
 */
export const FACEBOOK_REVIEWS_URL =
  "https://www.facebook.com/DreamArtTallinn/reviews";

export const FACEBOOK_PAGE_NAME = "DreamArt Portree";

export type StorefrontReview = {
  name: string;
  quote: string;
  recommends: boolean;
  publishedMonth: string;
  sourceUrl: string;
  isPlaceholder: boolean;
};

export const REVIEWS: StorefrontReview[] = [
  {
    name: "Елена",
    quote:
      "Работа выполнена быстро и очень красиво 🙏 Обязательно буду заказывать ещё 🤗",
    recommends: true,
    publishedMonth: "2020-07",
    sourceUrl: FACEBOOK_REVIEWS_URL,
    isPlaceholder: false,
  },
  {
    name: "Моника",
    quote:
      "По любым вопросам отвечают быстро. Работа выполнена в срок, портрет очень красивый 🥳 . Советую ! 😉",
    recommends: true,
    publishedMonth: "2020-07",
    sourceUrl: FACEBOOK_REVIEWS_URL,
    isPlaceholder: false,
  },
];
