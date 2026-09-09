import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { isValidBlogLocale } from "@/lib/blog";
import { isStorefrontLocale } from "@/lib/locales";
import { buildLegalMetadata } from "@/lib/seo/storefront-metadata";
import type { Language } from "@/lib/translations";

export function generateStaticParams() {
  return [{ locale: "et" }, { locale: "ru" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isStorefrontLocale(locale) || locale === "en") return {};
  return buildLegalMetadata(locale, "privacy");
}

export default async function LocalePrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidBlogLocale(locale)) notFound();
  if (locale === "en") redirect("/privacy");
  return <LegalPage locale={locale as Language} doc="privacy" />;
}
