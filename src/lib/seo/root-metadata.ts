import type { Metadata } from "next";
import { buildStorefrontMetadata } from "./storefront-metadata";
import { SITE_NAME, SITE_ORIGIN } from "./site-config";

/**
 * Root layout metadata for the English homepage.
 * Locale landings override title/description/canonical via generateMetadata.
 */
export const rootMetadata: Metadata = {
  ...buildStorefrontMetadata("en", "/"),
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${SITE_NAME} - Custom Digital Painting Portraits`,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  category: "art",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "popart",
    "digital painting",
    "custom portrait",
    "canvas print",
    "gift idea",
    "photo to art",
    "Estonia",
    "Tallinn",
    "tasuta tarne",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
