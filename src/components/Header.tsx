"use client";

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { Language } from '@/lib/translations';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter text-indigo-600">PopArt.ee</span>
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link href="#how-it-works" className="text-gray-600 hover:text-indigo-600">{t.nav.howItWorks}</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-indigo-600">{t.nav.pricing}</Link>
          <Link href="#gallery" className="text-gray-600 hover:text-indigo-600">{t.nav.gallery}</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['en', 'ru', 'et'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  language === lang 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <Link
            href="#order-now"
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700"
          >
            {t.nav.orderNow}
          </Link>
        </div>
      </div>
    </header>
  );
}

