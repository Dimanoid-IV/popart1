import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { rootMetadata } from "@/lib/seo/root-metadata";
import RootJsonLd from "@/components/seo/RootJsonLd";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getLocaleFromPath, htmlLang } from "@/lib/locales";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = rootMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const localeHeader = headerList.get("x-locale");
  const locale = localeHeader ?? getLocaleFromPath("/");
  return (
    <html lang={htmlLang(locale === "et" || locale === "ru" ? locale : "en")}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootJsonLd />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
      <GoogleAnalytics gaId="G-H52TSV34MX" />
    </html>
  );
}
