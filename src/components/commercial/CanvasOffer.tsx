import Link from "next/link";
import { getCanvasOptions } from "@/lib/canvas-pricing.mjs";
import { portraitCopy, type PortraitLocale } from "@/lib/commercial/portrait-copy";
import { homeSectionPath, portraitPath } from "@/lib/locales";

export default function CanvasOffer({ locale, compact = false }: { locale: PortraitLocale; compact?: boolean }) {
  const copy = portraitCopy[locale];
  return (
    <section aria-label={copy.priceTitle} className={`rounded-3xl border border-indigo-100 bg-indigo-50/60 ${compact ? "my-10 p-6 sm:p-8" : "p-6 sm:p-10"}`}>
      <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{copy.priceTitle}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-700">{copy.priceIntro}</p>
      <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {getCanvasOptions().map(({ size, cents }) => (
          <div key={size} className="rounded-2xl border border-indigo-100 bg-white p-4 sm:p-5">
            <dt className="text-sm font-medium text-slate-600">{size}</dt>
            <dd className="mt-2 text-2xl font-black text-indigo-700">{new Intl.NumberFormat(locale === "et" ? "et-EE" : "ru-RU", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-sm leading-6 text-slate-600">{copy.priceNote}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{copy.creditNote}</p>
      <div className="mt-7 flex flex-wrap items-center gap-5">
        <a href={homeSectionPath(locale, "#order-now")} className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-600 px-7 py-3 font-bold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">{copy.cta}</a>
        {compact && <Link href={portraitPath(locale)!} className="font-semibold text-indigo-700 underline underline-offset-4">{locale === "et" ? "Portree fotost: näited ja tellimine" : "Портрет по фото: примеры и заказ"}</Link>}
      </div>
    </section>
  );
}
