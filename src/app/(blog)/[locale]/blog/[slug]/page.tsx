import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BlogArticle, BlogLocale } from "@/lib/blog/types";
import {
  BLOG_LOCALES,
  SITE_URL,
  blogArticleUrl,
  blogIndexPath,
  getAllArticleParams,
  getArticle,
  isValidBlogLocale,
} from "@/lib/blog";
import { getBlogUiLabels } from "@/lib/blog/ui-labels";
import ArticleTemplate from "@/components/blog/ArticleTemplate";

export async function generateStaticParams() {
  return getAllArticleParams();
}

function ogImageUrl(coverImage: string): string {
  if (coverImage.startsWith("http")) return coverImage;
  return `${SITE_URL}${coverImage.startsWith("/") ? coverImage : `/${coverImage}`}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: loc, slug } = await params;
  if (!isValidBlogLocale(loc)) return {};
  const article = getArticle(loc as BlogLocale, slug);
  if (!article) return {};
  const canonical = blogArticleUrl(article.locale, slug);
  const image = ogImageUrl(article.coverImage);
  const alternatesLang: Record<string, string> = {};
  for (const l of BLOG_LOCALES) {
    const sibling = getArticle(l, slug);
    if (sibling) alternatesLang[l] = blogArticleUrl(l, slug);
  }
  alternatesLang["x-default"] = blogArticleUrl("et", slug);

  return {
    title: `${article.title} | PopArt.ee`,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical,
      languages: alternatesLang,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description: article.description,
      siteName: "PopArt.ee",
      locale:
        article.locale === "et"
          ? "et_EE"
          : article.locale === "ru"
            ? "ru_RU"
            : "en_US",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: loc, slug } = await params;
  if (!isValidBlogLocale(loc)) notFound();
  const locale = loc as BlogLocale;
  const article = getArticle(locale, slug);
  if (!article) notFound();

  const labels = getBlogUiLabels(locale);
  const related = (article.relatedSlugs ?? [])
    .map((s) => getArticle(locale, s))
    .filter((a): a is BlogArticle => a !== null);

  const breadcrumbItems = [
    { label: "PopArt.ee", href: "/" },
    { label: labels.breadcrumbBlog, href: blogIndexPath(locale) },
    { label: article.title },
  ];

  return (
    <ArticleTemplate
      article={article}
      slug={slug}
      related={related}
      labels={{
        authorTitle: labels.authorTitle,
        faqHeading: labels.faqHeading,
        internalLinksHeading: labels.internalLinksHeading,
        relatedHeading: labels.relatedHeading,
        readingTime: labels.readingTime,
      }}
      breadcrumbItems={breadcrumbItems}
    />
  );
}
