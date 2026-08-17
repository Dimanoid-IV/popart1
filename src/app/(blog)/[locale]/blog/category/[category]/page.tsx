import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BlogCategoryId, BlogLocale } from "@/lib/blog/types";
import {
  BLOG_LOCALES,
  SITE_URL,
  blogArticleUrl,
  blogCategoryUrl,
  blogIndexPath,
  blogIndexUrl,
  getCategoryCopy,
  isValidBlogCategory,
  isValidBlogLocale,
  listArticlesByCategory,
  getAllCategoryPageParams,
} from "@/lib/blog";
import { getBlogUiLabels } from "@/lib/blog/ui-labels";
import BlogListCroBanner from "@/components/blog/BlogListCroBanner";
import { getBlogCroLabels } from "@/lib/blog/cro-labels";
import BlogArticleCard from "@/components/blog/BlogArticleCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllCategoryPageParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale: loc, category: cat } = await params;
  if (!isValidBlogLocale(loc) || !isValidBlogCategory(cat)) return {};
  const locale = loc as BlogLocale;
  const category = cat as BlogCategoryId;
  const copy = getCategoryCopy(category, locale);
  const canonical = blogCategoryUrl(locale, category);
  const languages = Object.fromEntries(
    BLOG_LOCALES.map((l) => [l, blogCategoryUrl(l, category)])
  ) as Record<string, string>;
  languages["x-default"] = blogCategoryUrl("et", category);

  return {
    title: `${copy.title} | ${getBlogUiLabels(locale).blogTitle} | PopArt.ee`,
    description: copy.description,
    alternates: { canonical, languages },
    openGraph: {
      url: canonical,
      title: copy.title,
      description: copy.description,
      siteName: "PopArt.ee",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/pic1.jpg`,
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
      locale: locale === "et" ? "et_EE" : locale === "ru" ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [`${SITE_URL}/pic1.jpg`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: loc, category: cat } = await params;
  if (!isValidBlogLocale(loc) || !isValidBlogCategory(cat)) notFound();
  const locale = loc as BlogLocale;
  const category = cat as BlogCategoryId;
  const articles = listArticlesByCategory(locale, category);
  const labels = getBlogUiLabels(locale);
  const cro = getBlogCroLabels(locale);
  const copy = getCategoryCopy(category, locale);
  const canonical = blogCategoryUrl(locale, category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#collection`,
        name: copy.title,
        description: copy.description,
        url: canonical,
        inLanguage:
          locale === "et" ? "et-EE" : locale === "ru" ? "ru-EE" : "en-EE",
        isPartOf: { "@type": "WebSite", name: "PopArt.ee", url: SITE_URL },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: articles.length,
          itemListElement: articles.map((article, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: blogArticleUrl(locale, article.slug),
            name: article.title,
          })),
        },
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
          {
            "@type": "ListItem",
            position: 3,
            name: copy.title,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-indigo-600">
              PopArt.ee
            </Link>
          </li>
          <span className="text-gray-400">/</span>
          <li>
            <Link href={blogIndexPath(locale)} className="hover:text-indigo-600">
              {labels.breadcrumbBlog}
            </Link>
          </li>
          <span className="text-gray-400">/</span>
          <li className="font-medium text-gray-900">{copy.title}</li>
        </ol>
      </nav>
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{copy.description}</p>
      </div>
      <ul className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, index) => (
          <BlogArticleCard
            key={a.slug}
            article={a}
            locale={locale}
            readMoreLabel={labels.readMore}
            priority={index === 0}
          />
        ))}
      </ul>
      {articles.length === 0 ? (
        <p className="mt-8 text-gray-500">{labels.emptyCategory}</p>
      ) : null}
      <BlogListCroBanner cro={cro} />
    </main>
  );
}
