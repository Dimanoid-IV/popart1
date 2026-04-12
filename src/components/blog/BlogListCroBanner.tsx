import Link from "next/link";
import type { BlogCroLabels } from "@/lib/blog/cro-labels";

type Props = {
  cro: BlogCroLabels;
};

/** Compact conversion banner for blog index & category listing pages. */
export default function BlogListCroBanner({ cro }: Props) {
  return (
    <aside
      className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 sm:p-8"
      aria-label="Service call to action"
    >
      <h2 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
        {cro.listBannerTitle}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-700 sm:text-base">
        {cro.listBannerBody}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/#order-now"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700"
        >
          {cro.listBannerButton}
        </Link>
        <Link
          href="/"
          className="text-center text-sm font-semibold text-indigo-700 underline-offset-2 hover:underline sm:text-left"
        >
          {cro.ctaBottomSecondary}
        </Link>
      </div>
    </aside>
  );
}
