import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers, cookies } from "next/headers";
import CookieConsent from "@/components/consent/CookieConsent";
import { CONSENT_COOKIE, parseConsent } from "@/lib/cookie-consent.mjs";
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

function decodeConsent(value?: string) {
  try { return decodeURIComponent(value ?? ""); } catch { return ""; }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const consent = parseConsent(decodeConsent((await cookies()).get(CONSENT_COOKIE)?.value));
  const localeHeader = headerList.get("x-locale");
  const locale = localeHeader ?? getLocaleFromPath("/");
  return (
    <html lang={htmlLang(locale === "et" || locale === "ru" ? locale : "en")}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootJsonLd />
        <LanguageProvider
          initialLanguage={
            locale === "et" || locale === "ru" || locale === "en"
              ? locale
              : "en"
          }
        >
          <CookieConsent initialConsent={consent}>
            {children}
            <SiteAnalytics />
          </CookieConsent>
        </LanguageProvider>
      </body>
    </html>
  );
}
