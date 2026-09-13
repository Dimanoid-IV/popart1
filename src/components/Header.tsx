"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Truck, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Language } from "@/lib/translations";
import { homePath, homeSectionPath, localizePath } from "@/lib/locales";
import { usePathname } from "next/navigation";
import { getShippingBanner } from "@/lib/shipping-banner";

export default function Header() {
  const { language, t } = useLanguage();
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const links = [
    { href: homeSectionPath(language, "#how-it-works"), label: t.nav.howItWorks },
    { href: homeSectionPath(language, "#pricing"), label: t.nav.pricing },
    { href: homeSectionPath(language, "#gallery"), label: t.nav.gallery },
    { href: `/${language}/blog`, label: t.nav.blog },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="bg-indigo-600 px-4 py-2 text-center text-sm font-bold text-white shadow-sm">
        <span className="inline-flex items-center justify-center gap-2">
          <Truck aria-hidden="true" className="h-4 w-4" />
          {getShippingBanner(language)}
        </span>
      </div>
      <div className="container mx-auto flex h-16 items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href={homePath(language)}
          className="flex shrink-0 items-center space-x-2"
        >
          <span className="text-xl font-bold tracking-tighter text-indigo-600 sm:text-2xl">
            PopArt.ee
          </span>
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-indigo-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex rounded-lg bg-gray-100 p-1" role="group" aria-label="Language">
            {(["en", "et", "ru"] as Language[]).map((lang) => (
              <Link
                key={lang}
                href={localizePath(pathname, lang)}
                hrefLang={lang}
                className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
                  language === lang
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link
            href={homeSectionPath(language, "#order-now")}
            className="hidden h-9 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 sm:inline-flex"
          >
            {t.nav.orderNow}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 md:hidden"
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-white px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-base font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-gray-800"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={homeSectionPath(language, "#order-now")}
                className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-white"
                onClick={() => setOpen(false)}
              >
                {t.nav.orderNow}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
