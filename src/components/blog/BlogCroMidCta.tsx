import Link from "next/link";
import type { BlogCroLabels } from "@/lib/blog/cro-labels";

type Props = { cro: BlogCroLabels };

export default function BlogCroMidCta({ cro }: Props) {
  return (
    <section
      className="my-10 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm"
      aria-labelledby="blog-cta-mid-title"
    >
      <h2
        id="blog-cta-mid-title"
        className="text-lg font-bold text-gray-900 sm:text-xl"
      >
        {cro.ctaMidTitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
        {cro.ctaMidBody}
      </p>
      <p className="mt-2 text-xs font-medium text-amber-800 sm:text-sm">
        {cro.urgencyLine}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/#order-now"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-center text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700"
        >
          {cro.ctaMidButton}
        </Link>
        <Link
          href="/"
          className="text-center text-sm font-semibold text-indigo-600 underline-offset-2 hover:underline sm:text-left"
        >
          {cro.ctaBottomSecondary}
        </Link>
      </div>
    </section>
  );
}
