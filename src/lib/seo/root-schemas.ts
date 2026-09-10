import { CONTACT_EMAIL } from "@/lib/site-contact";
import { OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "./site-config";

const ogImageUrl = `${SITE_ORIGIN}${OG_IMAGE}`;

/** Organization + LocalBusiness + WebSite + delivery FAQ. */
export function buildRootJsonLd() {
  const sameAs: string[] = [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}#organization`,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        email: CONTACT_EMAIL,
        logo: {
          "@type": "ImageObject",
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_ORIGIN}#localbusiness`,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        email: CONTACT_EMAIL,
        image: ogImageUrl,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tallinn",
          addressCountry: "EE",
        },
        areaServed: {
          "@type": "Country",
          name: "Estonia",
        },
        priceRange: "€€",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_ORIGIN}#rankboost-faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I order a portrait from a photo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Upload your photo, choose a canvas size, review the digital preview, and pay. The preview is ready in seconds.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use the portrait as a gift?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. PopArt.ee portraits are designed for birthdays, weddings, holidays, and personal wall art gifts.",
            },
          },
          {
            "@type": "Question",
            name: "Do you deliver in Estonia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Shipping to the customer is free across all of Estonia. Dispatch is the next working day after the portrait is generated.",
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}#website`,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        publisher: { "@id": `${SITE_ORIGIN}#organization` },
        inLanguage: ["en", "et", "ru"],
      },
    ],
  };
}

/**
 * Reusable Article JSON-LD for blog or landing pages (call site with article fields).
 */
export function buildArticleJsonLd(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  imageUrls: string[];
  authorName: string;
  authorUrl?: string;
  inLanguage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.imageUrls,
    author: {
      "@type": "Person",
      name: input.authorName,
      ...(input.authorUrl ? { url: input.authorUrl } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: ogImageUrl,
      },
    },
    inLanguage: input.inLanguage,
  };
}

/** BreadcrumbList for any path segments. */
export function buildBreadcrumbJsonLd(
  items: { name: string; url?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
