import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BlogLocale } from "@/lib/blog/types";
import {
  BLOG_LOCALES,
  SITE_URL,
  blogArticlePath,
  blogIndexUrl,
  isValidBlogLocale,
  listArticlesForLocale,
} from "@/lib/blog";
import { getBlogUiLabels } from "@/lib/blog/ui-labels";

export async function generateStaticParams() {
  return BLOG_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: loc } = await params;
  if (!isValidBlogLocale(loc)) return {};
  const locale = loc as BlogLocale;
  const labels = getBlogUiLabels(locale);
  const canonical = blogIndexUrl(locale);
  return {
    title: `${labels.blogTitle} | PopArt.ee`,
    description: labels.blogIntro,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        BLOG_LOCALES.map((l) => [l, blogIndexUrl(l)])
      ) as Record<string, string>,
    },
    openGraph: {
      url: canonical,
      title: labels.blogTitle,
      description: labels.blogIntro,
      siteName: "PopArt.ee",
      locale: locale === "et" ? "et_EE" : locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: labels.blogTitle,
      description: labels.blogIntro,
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: loc } = await params;
  if (!isValidBlogLocale(loc)) notFound();
  const locale = loc as BlogLocale;
  const articles = listArticlesForLocale(locale);
  const labels = getBlogUiLabels(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${blogIndexUrl(locale)}#collection`,
        name: labels.blogTitle,
        description: labels.blogIntro,
        url: blogIndexUrl(locale),
        inLanguage:
          locale === "et" ? "et-EE" : locale === "ru" ? "ru-EE" : "en-EE",
        isPartOf: { "@type": "WebSite", name: "PopArt.ee", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
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
            name: labels.breadcrumbBlog,
            item: blogIndexUrl(locale),
          },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
        {labels.blogTitle}
      </h1>
      <p className="mt-4 text-lg text-gray-600">{labels.blogIntro}</p>
      <ul className="mt-10 space-y-6">
        {articles.map((a) => (
          <li
            key={a.slug}
            className="rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
          >
            <Link
              href={blogArticlePath(locale, a.slug)}
              className="text-xl font-semibold text-indigo-600 hover:underline"
            >
              {a.title}
            </Link>
            <p className="mt-2 text-gray-600">{a.description}</p>
            <p className="mt-3 text-sm text-gray-500">{a.publishedAt}</p>
            <Link
              href={blogArticlePath(locale, a.slug)}
              className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
            >
              {labels.readMore} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
