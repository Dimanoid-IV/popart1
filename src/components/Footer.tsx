"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { homePath, localizePath } from "@/lib/locales";
import { CONTACT_EMAIL } from "@/lib/site-contact";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-indigo-600 mb-4">
              <Link href={homePath(language)}>PopArt.ee</Link>
            </h3>
            <p className="text-sm text-gray-600">{t.footer.desc}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t.footer.contact}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                {t.footer.emailLabel}:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-indigo-600 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>{t.footer.location}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href={`/${language}/blog`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.footer.blog}
                </Link>
              </li>
              <li>
                <Link
                  href={localizePath("/delivery", language)}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.footer.delivery}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href={localizePath("/terms", language)}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link
                  href={localizePath("/privacy", language)}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.footer.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PopArt.ee. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
