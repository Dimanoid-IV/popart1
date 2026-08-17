import Link from "next/link";
import type { BlogArticle, BlogLocale } from "@/lib/blog/types";
import { blogArticlePath } from "@/lib/blog/paths";
import BlogArticleImage from "./BlogArticleImage";

type Props = {
  article: BlogArticle;
  locale: BlogLocale;
  readMoreLabel: string;
  priority?: boolean;
};

export default function BlogArticleCard({
  article,
  locale,
  readMoreLabel,
  priority = false,
}: Props) {
  const href = blogArticlePath(locale, article.slug);

  return (
    <li className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
      <Link href={href} className="block overflow-hidden" tabIndex={-1}>
        <BlogArticleImage
          src={article.coverImage}
          alt={article.title}
          width={720}
          height={450}
          priority={priority}
          className="aspect-[16/10] w-full rounded-none object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time
          dateTime={article.publishedAt}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
        >
          {new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(`${article.publishedAt}T00:00:00Z`))}
        </time>
        <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900">
          <Link href={href} className="transition hover:text-indigo-700">
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {article.description}
        </p>
        <Link
          href={href}
          className="mt-auto pt-5 text-sm font-bold text-indigo-700 transition hover:text-indigo-900"
          aria-label={`${readMoreLabel}: ${article.title}`}
        >
          {readMoreLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </li>
  );
}
