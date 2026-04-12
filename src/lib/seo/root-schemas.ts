import { SITE_NAME, SITE_ORIGIN } from "./site-config";

/** Organization + LocalBusiness + WebSite (SearchAction optional). */
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
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}/og-image.jpg`,
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
        image: `${SITE_ORIGIN}/og-image.jpg`,
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
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}#website`,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        publisher: { "@id": `${SITE_ORIGIN}#organization` },
        inLanguage: ["en-US", "et-EE", "ru-RU"],
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
        url: `${SITE_ORIGIN}/og-image.jpg`,
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
