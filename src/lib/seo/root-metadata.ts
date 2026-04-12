import type { Metadata } from "next";
import { LOCALE_ALTERNATES, SITE_NAME, SITE_ORIGIN } from "./site-config";

const ogImage = "/og-image.jpg";

/**
 * Root layout metadata: canonical, OG, Twitter, hreflang hints via blog hubs.
 * Homepage remains single URL; localized blog indexes serve as language alternates.
 */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${SITE_NAME} - Custom Digital Painting Portraits`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Turn your photos into stunning digital art portraits. Unique backgrounds, high-quality canvas prints, and fast delivery. Professional AI-powered art editor.",
  keywords: [
    "popart",
    "digital painting",
    "custom portrait",
    "canvas print",
    "gift idea",
    "photo to art",
    "Estonia",
    "Tallinn",
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: SITE_ORIGIN,
    languages: {
      "x-default": SITE_ORIGIN,
      en: LOCALE_ALTERNATES.en,
      et: LOCALE_ALTERNATES.et,
      ru: LOCALE_ALTERNATES.ru,
    },
  },
  openGraph: {
    title: "PopArt.ee - Your Photos, Pure Art",
    description:
      "Create stunning digital painting portraits from your photos in seconds.",
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PopArt.ee - Custom Digital Painting Portraits",
    description: "Turn your photos into stunning digital art portraits.",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
