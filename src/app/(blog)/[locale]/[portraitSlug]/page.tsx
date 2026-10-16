import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortraitLanding from "@/components/commercial/PortraitLanding";
import { portraitCopy, type PortraitLocale } from "@/lib/commercial/portrait-copy";
import { PORTRAIT_PATHS } from "@/lib/locales";
import { SITE_ORIGIN, SITE_NAME } from "@/lib/seo/site-config";

type Props = { params: Promise<{ locale: string; portraitSlug: string }> };

function resolveLocale(locale: string, slug: string): PortraitLocale {
  if ((locale !== "et" && locale !== "ru") || PORTRAIT_PATHS[locale] !== `/${locale}/${slug}`) notFound();
  return locale;
}

export function generateStaticParams() {
  return [{ locale: "et", portraitSlug: "portree-fotost" }, { locale: "ru", portraitSlug: "portret-po-foto" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, portraitSlug } = await params;
  const language = resolveLocale(locale, portraitSlug);
  const copy = portraitCopy[language];
  const canonical = `${SITE_ORIGIN}${PORTRAIT_PATHS[language]}`;
  return {
    title: { absolute: copy.title }, description: copy.description,
    alternates: { canonical, languages: {
      et: `${SITE_ORIGIN}${PORTRAIT_PATHS.et}`, ru: `${SITE_ORIGIN}${PORTRAIT_PATHS.ru}`, "x-default": `${SITE_ORIGIN}${PORTRAIT_PATHS.et}`,
    } },
    openGraph: { type: "website", url: canonical, title: copy.title, description: copy.description, siteName: SITE_NAME, locale: language === "et" ? "et_EE" : "ru_RU", images: [{ url: `${SITE_ORIGIN}/pic1.jpg`, alt: copy.heroCaption }] },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [`${SITE_ORIGIN}/pic1.jpg`] },
    robots: { index: true, follow: true },
  };
}

export default async function PortraitPage({ params }: Props) {
  const { locale, portraitSlug } = await params;
  return <PortraitLanding locale={resolveLocale(locale, portraitSlug)} />;
}
