import Link from "next/link";
import type { BlogArticle } from "@/lib/blog/types";
import { estimateReadingMinutes } from "@/lib/blog/reading-time";
import JsonLd from "./JsonLd";
import BlogArticleImage from "./BlogArticleImage";
import Breadcrumbs from "./Breadcrumbs";
import AuthorBlock from "./AuthorBlock";
import FaqSection from "./FaqSection";
import InternalLinks from "./InternalLinks";
import RelatedArticles from "./RelatedArticles";
import { buildArticleGraphLd } from "@/lib/blog/schema";
import { getBlogCroLabels } from "@/lib/blog/cro-labels";
import BlogCroTrustStrip from "./BlogCroTrustStrip";
import BlogCroMidCta from "./BlogCroMidCta";
import BlogCroBottomCta from "./BlogCroBottomCta";

type Labels = {
  authorTitle: string;
  faqHeading: string;
  internalLinksHeading: string;
  relatedHeading: string;
  readingTime: (minutes: number) => string;
};

type Props = {
  article: BlogArticle;
  slug: string;
  related: BlogArticle[];
  labels: Labels;
  breadcrumbItems: { label: string; href?: string }[];
  /** Optional category hub link (same visual scale as blog, no new layout system). */
  categoryNav?: { label: string; href: string };
};

export default function ArticleTemplate({
  article,
  slug,
  related,
  labels,
  breadcrumbItems,
  categoryNav,
}: Props) {
  const minutes = estimateReadingMinutes(article.bodyHtml);
  const graphLd = buildArticleGraphLd(article, slug);
  const cro = getBlogCroLabels(article.locale);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={graphLd as unknown as Record<string, unknown>} />
      <Breadcrumbs items={breadcrumbItems} />
      {categoryNav ? (
        <p className="mb-4 text-sm text-gray-600">
          <Link
            href={categoryNav.href}
            className="font-medium text-indigo-600 hover:underline"
          >
            {categoryNav.label}
          </Link>
        </p>
      ) : null}
      <header>
        <p className="text-sm text-gray-500">
          {article.publishedAt}
          <span aria-hidden="true"> · </span>
          {labels.readingTime(minutes)}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-gray-600">{article.description}</p>
        <div className="mt-8 overflow-hidden rounded-xl">
          <BlogArticleImage
            src={article.coverImage}
            alt={article.title}
            width={1200}
            height={630}
            priority
          />
        </div>
      </header>
      <BlogCroTrustStrip cro={cro} />
      <div
        className="blog-content mt-10 max-w-none space-y-4 text-gray-800 [&_a]:text-indigo-600 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_img]:max-w-full [&_img]:rounded-lg [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
      />
      <BlogCroMidCta cro={cro} />
      <InternalLinks
        links={article.internalLinks ?? []}
        heading={labels.internalLinksHeading}
      />
      <FaqSection faqs={article.faqs ?? []} heading={labels.faqHeading} />
      <BlogCroBottomCta cro={cro} />
      <AuthorBlock author={article.author} sectionTitle={labels.authorTitle} />
      <RelatedArticles
        locale={article.locale}
        articles={related}
        heading={labels.relatedHeading}
      />
    </article>
  );
}
