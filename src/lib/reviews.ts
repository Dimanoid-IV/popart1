import type { Language } from "@/lib/translations";

/**
 * Owner: replace these with real reviews (name, city in EE, quote, rating).
 * Set `isPlaceholder: false` only for genuine customer quotes.
 * AggregateRating JSON-LD is emitted only when at least one non-placeholder review exists.
 */
export type StorefrontReview = {
  name: string;
  city: string;
  rating: number;
  isPlaceholder: boolean;
  quote: Record<Language, string>;
};

export const REVIEWS: StorefrontReview[] = [
  {
    name: "Mari",
    city: "Tallinn",
    rating: 5,
    isPlaceholder: true,
    quote: {
      et: "Tellisin emale sünnipäevaks portree fotost. Eelvaade oli kohe olemas ja lõuend jõudis kohale kenasti pakituna — täpselt selline kingitus, nagu tahtsin.",
      en: "I ordered a portrait from a photo for my mum’s birthday. The preview was ready right away and the canvas arrived well packed — exactly the kind of gift I wanted.",
      ru: "Заказала маме на день рождения портрет по фото. Предпросмотр появился сразу, холст пришёл аккуратно упакованным — именно такой подарок я хотела.",
    },
  },
  {
    name: "Andres",
    city: "Tartu",
    rating: 5,
    isPlaceholder: true,
    quote: {
      et: "Aastapäevakingitus naisele: laadisime ühise foto üles, valisime 60×40 ja saime seinale midagi, mis tundub meie oma, mitte poest ostetud.",
      en: "Anniversary gift for my wife: we uploaded a shared photo, chose 60×40, and ended up with something that feels ours — not bought off a shelf.",
      ru: "Подарок жене на годовщину: загрузили общее фото, выбрали 60×40 и получили на стену то, что кажется нашим, а не купленным в магазине.",
    },
  },
  {
    name: "Kati",
    city: "Pärnu",
    rating: 5,
    isPlaceholder: true,
    quote: {
      et: "Üllatuskingitus õele Eestis. Tasuta tarne ja selge eelvaade tegid otsuse lihtsaks — portree fotost sobis koju palju paremini kui järjekordne vidin.",
      en: "A surprise gift for my sister in Estonia. Free delivery and a clear preview made the decision easy — a portrait from a photo suited her home far better than another gadget.",
      ru: "Сюрприз сестре в Эстонии. Бесплатная доставка и понятный предпросмотр упростили выбор — портрет по фото гораздо лучше смотрится дома, чем очередной гаджет.",
    },
  },
];

export function getVerifiedReviews(): StorefrontReview[] {
  return REVIEWS.filter((review) => !review.isPlaceholder);
}
