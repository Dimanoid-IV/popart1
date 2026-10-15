"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { localizePath } from "@/lib/locales";
import { cookieCopy } from "@/lib/cookie-copy";
import { getConsentSnapshot, setConsent, subscribeConsent, watchConsent } from "@/lib/cookie-consent.mjs";

type Choice = { version: number; necessary: boolean; analytics: boolean; chosenAt: number; expiresAt: number } | null;
const ConsentContext = createContext<Choice>(null);
export const useCookieConsent = () => useContext(ConsentContext);
const button = "rounded-lg border border-indigo-600 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

export function CookieSettingsButton() {
  const { language } = useLanguage();
  return <button type="button" className="cursor-pointer text-left hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => window.dispatchEvent(new Event("popart:cookie-settings"))}>{cookieCopy[language].settings}</button>;
}

export default function CookieConsent({ initialConsent, children }: { initialConsent: Choice; children: React.ReactNode }) {
  const choice: Choice = useSyncExternalStore(subscribeConsent, getConsentSnapshot, () => initialConsent);
  const { language } = useLanguage();
  const copy = cookieCopy[language];
  const dialog = useRef<HTMLDialogElement>(null);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => watchConsent(), []);
  useEffect(() => {
    const open = () => { setAnalytics(getConsentSnapshot()?.analytics === true); dialog.current?.showModal(); };
    window.addEventListener("popart:cookie-settings", open);
    return () => window.removeEventListener("popart:cookie-settings", open);
  }, []);

  const choose = (allowed: boolean) => { setConsent(allowed); dialog.current?.close(); };
  return <ConsentContext.Provider value={choice}>
    {choice === null ? <section aria-label={copy.settings} className="border-b border-indigo-100 bg-indigo-50 px-4 py-5 sm:px-6" data-cookie-banner>
      <div className="mx-auto max-w-7xl lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 font-bold text-gray-900"><Cookie aria-hidden="true" className="h-5 w-5 shrink-0 text-indigo-600" />{copy.title}</p>
          <p className="mt-2 text-sm leading-6 text-gray-700">{copy.message} <Link className="font-medium text-indigo-700 underline underline-offset-2" href={`${localizePath("/privacy", language)}#cookies`}>{copy.policy}</Link></p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 lg:mt-0 lg:max-w-md lg:shrink-0">
          <button type="button" className={button} onClick={() => choose(true)}>{copy.accept}</button>
          <button type="button" className={button} onClick={() => choose(false)}>{copy.reject}</button>
          <button type="button" className={button} onClick={() => window.dispatchEvent(new Event("popart:cookie-settings"))}>{copy.configure}</button>
        </div>
      </div>
    </section> : null}
    {children}
    <dialog ref={dialog} aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-description" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 text-gray-900 shadow-xl backdrop:bg-gray-900/40 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h2 id="cookie-settings-title" className="text-xl font-bold">{copy.settings}</h2>
        <button type="button" aria-label={copy.close} className="rounded-md p-1 focus-visible:outline-2 focus-visible:outline-indigo-600" onClick={() => dialog.current?.close()}><X className="h-5 w-5" aria-hidden="true" /></button>
      </div>
      <p id="cookie-settings-description" className="mt-3 text-sm leading-6 text-gray-600">{copy.details}</p>
      <div className="mt-5 space-y-5">
        <section className="rounded-xl border border-gray-200 p-4"><h3 className="font-semibold">{copy.necessary}</h3><p className="mt-1 text-xs font-medium text-indigo-700">{copy.always}</p><p className="mt-2 text-sm leading-6 text-gray-600">{copy.necessaryText}</p></section>
        <section className="rounded-xl border border-gray-200 p-4"><label className="flex cursor-pointer items-center justify-between gap-4 font-semibold"><span>{copy.analytics}</span><input type="checkbox" checked={analytics} onChange={event => setAnalytics(event.target.checked)} className="h-5 w-5 shrink-0 accent-indigo-600" aria-describedby="cookie-analytics-description" /></label><p id="cookie-analytics-description" className="mt-2 text-sm leading-6 text-gray-600">{copy.analyticsText}</p></section>
      </div>
      <p className="mt-4 text-xs leading-5 text-gray-500">{copy.storageNote}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className={button} onClick={() => choose(analytics)}>{copy.save}</button>
        <button type="button" className={button} onClick={() => choose(false)}>{copy.reject}</button>
      </div>
      <Link className="mt-4 inline-block text-sm text-indigo-700 underline underline-offset-2" href={`${localizePath("/privacy", language)}#cookies`} onClick={() => dialog.current?.close()}>{copy.policy}</Link>
    </dialog>
  </ConsentContext.Provider>;
}
