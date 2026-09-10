"use client";

import React, { createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Language, translations } from "./translations";
import { getLocaleFromPath, localizePath } from "./locales";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  initialLanguage = "en",
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const language = pathname ? getLocaleFromPath(pathname) : initialLanguage;

  const setLanguage = (lang: Language) => {
    const next = localizePath(pathname, lang);
    if (next !== pathname) {
      router.push(next);
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
