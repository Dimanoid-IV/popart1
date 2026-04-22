import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BlogArticle, BlogCategoryId, BlogLocale } from "@/lib/blog/types";
import {
  BLOG_LOCALES,
  SITE_URL,
  blogArticlePath,
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
import BlogArticleImage from "@/components/blog/BlogArticleImage";

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
      locale: locale === "et" ? "et_EE" : locale === "ru" ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
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
      <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-4 text-lg text-gray-600">{copy.description}</p>
      <ul className="mt-10 space-y-6">
        {articles.map((a: BlogArticle) => (
          <li
            key={a.slug}
            className="rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md"
          >
            <div className="overflow-hidden">
              <BlogArticleImage
                src={a.coverImage}
                alt={a.title}
                width={800}
                height={420}
              />
            </div>
            <div className="p-5">
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
            </div>
          </li>
        ))}
      </ul>
      {articles.length === 0 ? (
        <p className="mt-8 text-gray-500">{labels.emptyCategory}</p>
      ) : null}
      <BlogListCroBanner cro={cro} />
    </div>
  );
}
