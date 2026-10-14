import type { MetadataRoute } from "next";
import {
  BLOG_LOCALES,
  SITE_URL,
  blogArticleUrl,
  blogCategoryUrl,
  blogIndexUrl,
  getAllArticleParams,
  getAllCategoryPageParams,
  getArticle,
} from "@/lib/blog";
import { getMarketingSitemapEntries } from "@/lib/seo/marketing-sitemap-urls";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...getMarketingSitemapEntries(),
  ];

  for (const locale of BLOG_LOCALES) {
    entries.push({
      url: blogIndexUrl(locale),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  for (const { locale, category } of getAllCategoryPageParams()) {
    entries.push({
      url: blogCategoryUrl(locale, category),
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const { locale, slug } of getAllArticleParams()) {
    const article = getArticle(locale, slug);
    if (!article) continue;
    entries.push({
      url: blogArticleUrl(locale, slug),
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return entries;
}
