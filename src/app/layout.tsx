import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { rootMetadata } from "@/lib/seo/root-metadata";
import RootJsonLd from "@/components/seo/RootJsonLd";
import SiteAnalytics from "@/components/analytics/SiteAnalytics";
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
        <Script id="popart-ga-init" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H52TSV34MX', {
            send_page_view: false,
            page_location: location.origin + location.pathname,
            page_referrer: document.referrer ? new URL(document.referrer).origin + new URL(document.referrer).pathname : ''
          });
        `}</Script>
        <RootJsonLd />
        <LanguageProvider
          initialLanguage={
            locale === "et" || locale === "ru" || locale === "en"
              ? locale
              : "en"
          }
        >
          {children}
          <SiteAnalytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
