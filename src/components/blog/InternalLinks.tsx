import Link from "next/link";
import type { BlogInternalLink } from "@/lib/blog/types";

type Props = {
  links: BlogInternalLink[];
  heading: string;
};

export default function InternalLinks({ links, heading }: Props) {
  if (!links.length) return null;
  return (
    <section className="mt-10 rounded-xl border border-indigo-100 bg-indigo-50/40 p-6">
      <h2 className="text-lg font-bold text-gray-900">{heading}</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-indigo-700">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
