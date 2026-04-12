import type { MetadataRoute } from "next";
import {
  BLOG_LOCALES,
  SITE_URL,
  blogArticleUrl,
  blogIndexUrl,
  getAllArticleParams,
  getArticle,
} from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const locale of BLOG_LOCALES) {
    entries.push({
      url: blogIndexUrl(locale),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  for (const { locale, slug } of getAllArticleParams()) {
    const article = getArticle(locale, slug);
    entries.push({
      url: blogArticleUrl(locale, slug),
      lastModified: article
        ? new Date(article.updatedAt ?? article.publishedAt)
        : new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return entries;
}
