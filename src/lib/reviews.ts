import type { Language } from "@/lib/translations";

/**
 * Owner: replace placeholders with real reviews from Facebook (or elsewhere).
 * Needed per review: first name, city in EE, quote, rating.
 * Set `isPlaceholder: false` only for genuine customer quotes you have permission to publish.
 *
 * Paste the Facebook page or post URL here when available:
 *   FACEBOOK_REVIEWS_URL
 *
 * AggregateRating / Review JSON-LD is emitted only for non-placeholder reviews.
 * Do not publish invented testimonials as if they were real customers.
 */
export const FACEBOOK_REVIEWS_URL: string | null = null;

export type StorefrontReview = {
  name: string;
  city: string;
  rating: number;
  isPlaceholder: boolean;
  quote: Record<Language, string>;
};

export const REVIEWS: StorefrontReview[] = [
  {
    name: "",
    city: "Tallinn",
    rating: 5,
    isPlaceholder: true,
    quote: {
      et: "Näidis: portree fotost emale sünnipäevaks — eelvaade on kohe olemas ja lõuend jõuab tasuta üle Eesti.",
      en: "Sample: a portrait from a photo as a birthday gift — preview first, then free delivery across Estonia.",
      ru: "Пример: портрет по фото на день рождения — сначала предпросмотр, затем бесплатная доставка по Эстонии.",
    },
  },
  {
    name: "",
    city: "Tartu",
    rating: 5,
    isPlaceholder: true,
    quote: {
      et: "Näidis: aastapäevakingitus — ühine foto, valitud lõuendi suurus ja midagi, mis sobib koju seinale.",
      en: "Sample: an anniversary gift from a shared photo, chosen canvas size, made to hang at home.",
      ru: "Пример: подарок на годовщину с общего фото, выбранный размер холста, чтобы повесить дома.",
    },
  },
  {
    name: "",
    city: "Pärnu",
    rating: 5,
    isPlaceholder: true,
    quote: {
      et: "Näidis: üllatuskingitus Eestis — tasuta tarne ja selge eelvaade, portree fotost kingituseks.",
      en: "Sample: a surprise gift in Estonia — free delivery, a clear preview, a portrait from a photo.",
      ru: "Пример: сюрприз в Эстонии — бесплатная доставка, понятный предпросмотр, портрет по фото.",
    },
  },
];

export function getVerifiedReviews(): StorefrontReview[] {
  return REVIEWS.filter((review) => !review.isPlaceholder);
}
