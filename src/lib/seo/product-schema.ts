import type { Language } from "@/lib/translations";
import { homeSectionPath } from "@/lib/locales";
import { CANVAS_OFFERS } from "./canvas-offers";
import { OG_IMAGE, SITE_NAME, SITE_ORIGIN, storefrontUrl } from "./site-config";

const PRODUCT_COPY: Record<
  Language,
  { name: string; description: string; offerName: (size: string) => string }
> = {
  en: {
    name: "Custom canvas portrait from a photo",
    description:
      "Painted canvas portraits from your photo. Digital preview in seconds. Prices from €45. Free delivery across Estonia. Ships the next working day after the portrait is generated.",
    offerName: (size) => `${size} cm canvas portrait`,
  },
  et: {
    name: "Portree fotost lõuendil",
    description:
      "Maalitud lõuendiportree sinu fotost. Digitaalne eelvaade sekunditega. Hinnad alates 45 €. Tasuta tarne üle Eesti. Saadame järgmisel tööpäeval pärast portree genereerimist.",
    offerName: (size) => `${size} cm lõuendiportree`,
  },
  ru: {
    name: "Портрет по фото на холсте",
    description:
      "Художественный портрет на холсте по вашей фотографии. Предпросмотр за секунды. Цены от 45 €. Бесплатная доставка по Эстонии. Отправка на следующий рабочий день после генерации портрета.",
    offerName: (size) => `Портрет на холсте ${size} см`,
  },
};

function freeEstoniaShipping() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: "0",
      currency: "EUR",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "EE",
    },
  };
}

export function buildStorefrontProductJsonLd(locale: Language) {
  const copy = PRODUCT_COPY[locale];
  const pageUrl = storefrontUrl(locale);
  const orderUrl = `${SITE_ORIGIN}${homeSectionPath(locale, "#order-now")}`;
  const prices = CANVAS_OFFERS.map((offer) => offer.price);
  const shipping = freeEstoniaShipping();

  const product: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: copy.name,
    description: copy.description,
    image: `${SITE_ORIGIN}${OG_IMAGE}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    url: pageUrl,
    offers: {
      "@type": "AggregateOffer",
      url: orderUrl,
      priceCurrency: "EUR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: CANVAS_OFFERS.length,
      availability: "https://schema.org/InStock",
      offers: CANVAS_OFFERS.map((offer) => ({
        "@type": "Offer",
        name: copy.offerName(offer.size),
        price: offer.price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: orderUrl,
        shippingDetails: shipping,
      })),
    },
  };

  return {
    "@context": "https://schema.org",
    ...product,
  };
}
