import type { BlogArticle } from "./types";
import { SITE_URL } from "./constants";
import { blogArticleUrl, blogIndexPath } from "./paths";

function absoluteImageUrl(coverImage: string): string {
  if (coverImage.startsWith("http")) return coverImage;
  return `${SITE_URL}${coverImage.startsWith("/") ? coverImage : `/${coverImage}`}`;
}

export function buildArticleGraphLd(article: BlogArticle, slug: string) {
  const url = blogArticleUrl(article.locale, slug);
  const imageUrl = absoluteImageUrl(article.coverImage);
  const dateModified = article.updatedAt ?? article.publishedAt;

  const articleEntity = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    image: [imageUrl],
    datePublished: article.publishedAt,
    dateModified,
    author: {
      "@type": "Person",
      name: article.author.name,
      ...(article.author.url ? { url: article.author.url } : {}),
      ...(article.author.jobTitle
        ? { jobTitle: article.author.jobTitle }
        : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "PopArt.ee",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: article.locale === "et" ? "et-EE" : article.locale === "ru" ? "ru-EE" : "en-EE",
    keywords: article.keywords.join(", "),
  };

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "PopArt.ee",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}${blogIndexPath(article.locale)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  const graph: Record<string, unknown>[] = [articleEntity, breadcrumbList];

  if (article.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
