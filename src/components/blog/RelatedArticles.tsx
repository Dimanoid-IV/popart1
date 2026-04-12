import Link from "next/link";
import type { BlogArticle, BlogLocale } from "@/lib/blog/types";
import { blogArticlePath } from "@/lib/blog/paths";

type Props = {
  locale: BlogLocale;
  articles: BlogArticle[];
  heading: string;
};

export default function RelatedArticles({ locale, articles, heading }: Props) {
  if (!articles.length) return null;
  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold text-gray-900">{heading}</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={blogArticlePath(locale, a.slug)}
              className="block rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
            >
              <span className="font-semibold text-indigo-600 hover:underline">
                {a.title}
              </span>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {a.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
