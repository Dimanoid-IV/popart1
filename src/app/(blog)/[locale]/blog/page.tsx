import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BlogLocale } from "@/lib/blog/types";
import {
  BLOG_LOCALES,
  BLOG_CATEGORY_IDS,
  SITE_URL,
  blogArticleUrl,
  blogIndexUrl,
  isValidBlogLocale,
  listArticlesForLocale,
} from "@/lib/blog";
import { getBlogUiLabels } from "@/lib/blog/ui-labels";
import BlogCategoryChips from "@/components/blog/BlogCategoryChips";
import BlogListCroBanner from "@/components/blog/BlogListCroBanner";
import { getBlogCroLabels } from "@/lib/blog/cro-labels";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { storefrontUrl } from "@/lib/seo/site-config";

export const revalidate = 3600;

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
    title: labels.blogTitle,
    description: labels.blogIntro,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(BLOG_LOCALES.map((l) => [l, blogIndexUrl(l)])),
        "x-default": blogIndexUrl("et"),
      },
    },
    openGraph: {
      url: canonical,
      title: labels.blogTitle,
      description: labels.blogIntro,
      siteName: "PopArt.ee",
      locale: locale === "et" ? "et_EE" : locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/pic1.jpg`,
          width: 1200,
          height: 630,
          alt: labels.blogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: labels.blogTitle,
      description: labels.blogIntro,
      images: [`${SITE_URL}/pic1.jpg`],
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
  const visibleCategories = BLOG_CATEGORY_IDS.filter((category) =>
    articles.some((article) => article.category === category)
  );
  const labels = getBlogUiLabels(locale);
  const cro = getBlogCroLabels(locale);

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
            item: storefrontUrl(locale),
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
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {labels.blogTitle}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{labels.blogIntro}</p>
      </div>
      <BlogCategoryChips
        locale={locale}
        heading={labels.categoriesHeading}
        categoryIds={visibleCategories}
      />
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
      <BlogListCroBanner cro={cro} locale={locale} />
    </main>
  );
}
