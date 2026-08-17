import Link from "next/link";
import type { BlogCategoryId, BlogLocale } from "@/lib/blog/types";
import { BLOG_CATEGORY_IDS, getCategoryCopy } from "@/lib/blog/categories";
import { blogCategoryPath } from "@/lib/blog/paths";

type Props = {
  locale: BlogLocale;
  heading: string;
  categoryIds?: BlogCategoryId[];
};

export default function BlogCategoryChips({
  locale,
  heading,
  categoryIds = BLOG_CATEGORY_IDS,
}: Props) {
  return (
    <nav aria-label={heading} className="mt-8">
      <p className="text-sm font-semibold text-gray-700">{heading}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {categoryIds.map((id) => {
          const { short } = getCategoryCopy(id, locale);
          return (
            <li key={id}>
              <Link
                href={blogCategoryPath(locale, id)}
                className="inline-block rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:border-indigo-400 hover:text-indigo-700"
              >
                {short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
