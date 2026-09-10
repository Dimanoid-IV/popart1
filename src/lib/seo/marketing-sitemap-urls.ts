import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./site-config";

/** Static marketing URLs merged into sitemap (no thank-you /success page). */
export function getMarketingSitemapEntries(): MetadataRoute.Sitemap {
  const paths = [
    "/et",
    "/ru",
    "/privacy",
    "/terms",
    "/delivery",
    "/et/privacy",
    "/et/terms",
    "/et/delivery",
    "/ru/privacy",
    "/ru/terms",
    "/ru/delivery",
  ];

  return paths.map((path) => ({
    url: `${SITE_ORIGIN}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "/et" || path === "/ru" ? 0.95 : 0.4,
  }));
}
