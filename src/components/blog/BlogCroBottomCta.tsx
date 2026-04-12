import Link from "next/link";
import type { BlogCroLabels } from "@/lib/blog/cro-labels";

type Props = { cro: BlogCroLabels };

export default function BlogCroBottomCta({ cro }: Props) {
  return (
    <section
      className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      aria-labelledby="blog-cta-bottom-title"
    >
      <h2
        id="blog-cta-bottom-title"
        className="text-base font-bold text-gray-900 sm:text-lg"
      >
        {cro.ctaBottomTitle}
      </h2>
      <p className="mt-2 text-sm text-gray-600">{cro.ctaBottomBody}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#order-now"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          {cro.ctaBottomPrimary}
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-indigo-300"
        >
          {cro.ctaBottomSecondary}
        </Link>
      </div>
    </section>
  );
}
