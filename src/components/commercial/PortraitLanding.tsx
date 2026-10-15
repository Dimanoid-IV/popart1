import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import JsonLdScript from "@/components/seo/JsonLdScript";
import CanvasOffer from "./CanvasOffer";
import { portraitCopy, type PortraitLocale } from "@/lib/commercial/portrait-copy";
import { homePath, homeSectionPath, portraitPath } from "@/lib/locales";
import { SITE_ORIGIN } from "@/lib/seo/site-config";
import { BACKGROUND_PALETTE_IDS } from "@/lib/background-options";

const examples = [
  "/interiors/couple-portrait-soft-neutral-interior.jpg",
  "/interiors/woman-portrait-modern-teal-interior.jpg",
  "/interiors/blue-dream-art-man-home-office.jpg",
];
const paletteColors = [
  "conic-gradient(#4f46e5, #c026d3, #f59e0b, #0891b2, #4f46e5)",
  "linear-gradient(135deg, #0f766e, #4338ca, #6d28d9)",
  "linear-gradient(135deg, #db2777, #a78bfa, #2563eb)",
  "linear-gradient(135deg, #0d9488, #67e8f9, #d1d5db)",
  "linear-gradient(135deg, #fb7185, #a855f7, #f59e0b)",
  "linear-gradient(135deg, #1d4ed8, #7c3aed, #f8fafc)",
];
const container = "mx-auto max-w-6xl px-5 sm:px-8";
const button = "inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200/60 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600";

export default function PortraitLanding({ locale }: { locale: PortraitLocale }) {
  const copy = portraitCopy[locale];
  const createHref = homeSectionPath(locale, "#order-now");
  const path = portraitPath(locale)!;
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <section className="overflow-hidden bg-gradient-to-b from-indigo-50/80 to-white pb-14 pt-6 sm:pb-20 sm:pt-10">
          <div className={container}>
            <Breadcrumbs items={[{ label: copy.home, href: homePath(locale) }, { label: locale === "et" ? "Portree fotost" : "Портрет по фото" }]} />
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div>
                <p className="mb-5 text-sm font-bold tracking-wide text-indigo-700">{copy.eyebrow}</p>
                <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{copy.h1}</h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{copy.intro}</p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a href={createHref} className={button}>{copy.cta}<ArrowUpRight className="h-5 w-5" aria-hidden="true" /></a>
                  <a href="#examples" className="rounded-md py-3 font-semibold text-indigo-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{copy.secondary}</a>
                </div>
                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-slate-700">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" aria-hidden="true" />{copy.preview}</li>
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-indigo-600" aria-hidden="true" />{copy.deliveryBadge}</li>
                </ul>
              </div>
              <figure className="mx-auto w-full max-w-md">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-indigo-100 shadow-2xl shadow-indigo-200/60">
                  <Image src="/pic1.jpg" alt={copy.heroCaption} fill priority sizes="(max-width: 768px) 90vw, 448px" className="object-cover" />
                </div>
                <figcaption className="mt-4 text-center text-xs leading-5 text-slate-500">{copy.heroCaption}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="examples" className="scroll-mt-32 bg-slate-950 py-14 text-white sm:py-20">
          <div className={container}>
            <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">{copy.examplesTitle}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">{copy.examplesIntro}</p>
            <div className="mt-9 grid gap-5 sm:grid-cols-3">
              {examples.map((src, index) => <figure key={src} className="overflow-hidden rounded-2xl bg-white/5">
                <div className="relative aspect-[3/2]"><Image src={src} alt={copy.examples[index]} fill sizes="(max-width: 640px) 90vw, 33vw" className="object-cover" /></div>
                <figcaption className="p-4 text-sm text-slate-200">{copy.examples[index]}</figcaption>
              </figure>)}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className={container}>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.howTitle}</h2>
            <ol className="mt-9 grid gap-8 md:grid-cols-3">
              {copy.steps.map((step, index) => <li key={step.title} className="border-t border-indigo-200 pt-6">
                <span aria-hidden="true" className="text-sm font-bold text-indigo-600">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
              </li>)}
            </ol>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50 py-14 sm:py-20">
          <div className={container}>
            <div className="grid gap-8 lg:grid-cols-2">
              <div><h2 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.stylesTitle}</h2><p className="mt-5 max-w-xl leading-7 text-slate-600">{copy.stylesIntro}</p></div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {BACKGROUND_PALETTE_IDS.map((id, index) => <li key={id} className="rounded-2xl border border-slate-200 bg-white p-4"><span aria-hidden="true" className="mb-3 block h-12 w-12 rounded-full" style={{ background: paletteColors[index] }} /><span className="text-sm font-semibold">{copy.paletteNames[index]}</span></li>)}
              </ul>
            </div>
          </div>
        </section>

        <div className={`${container} py-14 sm:py-20`}><CanvasOffer locale={locale} /></div>

        <section className="pb-14 sm:pb-20">
          <div className={`${container} grid gap-8 lg:grid-cols-[0.7fr_1.3fr]`}>
            <h2 className="text-3xl font-black tracking-tight">{copy.deliveryTitle}</h2>
            <div className="space-y-4 leading-7 text-slate-600"><p>{copy.deliveryText}</p><p>{copy.deliveryTiming}</p><Link href={`/${locale}/delivery`} className="inline-block font-semibold text-indigo-700 underline underline-offset-4">{copy.deliveryLink}</Link></div>
          </div>
        </section>

        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="mb-7 text-3xl font-black tracking-tight sm:text-4xl">{copy.faqTitle}</h2>
            {copy.faqs.map(faq => <details key={faq.question} className="group border-b border-slate-200 py-5"><summary className="cursor-pointer rounded text-lg font-bold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">{faq.question}</summary><p className="mt-4 leading-7 text-slate-600">{faq.answer}</p></details>)}
          </div>
        </section>

        <section className="py-14 sm:py-20"><div className={container}><h2 className="text-2xl font-bold">{copy.relatedTitle}</h2><ul className="mt-5 grid gap-3 md:grid-cols-3">{copy.related.map(link => <li key={link.href}><Link href={link.href} className="block rounded-xl border border-slate-200 p-5 font-semibold text-indigo-700 underline-offset-4 hover:underline">{link.label}</Link></li>)}</ul></div></section>
        <section className="bg-indigo-50 py-14 text-center sm:py-20"><div className="mx-auto max-w-2xl px-5"><h2 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.finalTitle}</h2><p className="mb-7 mt-5 leading-7 text-slate-600">{copy.finalText}</p><a href={createHref} className={button}>{copy.cta}<ArrowUpRight className="h-5 w-5" aria-hidden="true" /></a></div></section>
      </main>
      <Footer />
      <JsonLdScript data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: copy.home, item: `${SITE_ORIGIN}${homePath(locale)}` },
        { "@type": "ListItem", position: 2, name: copy.h1, item: `${SITE_ORIGIN}${path}` },
      ] }} />
    </div>
  );
}
