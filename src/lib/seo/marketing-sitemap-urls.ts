import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./site-config";

/** Static marketing URLs merged into sitemap (no dynamic discovery). */
export function getMarketingSitemapEntries(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_ORIGIN}/success`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
