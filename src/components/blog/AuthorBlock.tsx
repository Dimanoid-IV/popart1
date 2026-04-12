import type { BlogAuthor } from "@/lib/blog/types";

type Props = {
  author: BlogAuthor;
  sectionTitle?: string;
};

export default function AuthorBlock({ author, sectionTitle = "Author" }: Props) {
  return (
    <aside className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {sectionTitle}
      </p>
      {author.url ? (
        <a
          href={author.url}
          className="mt-1 block text-lg font-semibold text-indigo-600 hover:underline"
          rel="author noopener noreferrer"
        >
          {author.name}
        </a>
      ) : (
        <p className="mt-1 text-lg font-semibold text-gray-900">{author.name}</p>
      )}
      {author.jobTitle ? (
        <p className="mt-1 text-sm text-gray-600">{author.jobTitle}</p>
      ) : null}
    </aside>
  );
}
