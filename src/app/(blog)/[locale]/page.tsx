import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { isValidBlogLocale } from "@/lib/blog";
import { isStorefrontLocale } from "@/lib/locales";
import { buildStorefrontMetadata } from "@/lib/seo/storefront-metadata";

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
  return buildStorefrontMetadata(locale, `/${locale}`);
}

export default async function LocaleStorefrontPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidBlogLocale(locale)) notFound();
  if (locale === "en") redirect("/");
  return <HomePage />;
}
