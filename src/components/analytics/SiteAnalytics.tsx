"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/components/consent/CookieConsent";
import { startGoogleAnalytics } from "@/lib/cookie-consent.mjs";
import { getLandingPage, safeCampaignParameters, safePagePath, sendAnalyticsEvent } from "@/lib/funnel-analytics.mjs";

export default function SiteAnalytics() {
  const pathname = usePathname();
  const choice = useCookieConsent();
  const previousPath = useRef<string | null>(null);
  const previousChoice = useRef<number | null>(null);

  useEffect(() => {
    if (!choice?.analytics) { previousPath.current = null; previousChoice.current = null; return; }
    if (previousPath.current === pathname && previousChoice.current === choice.chosenAt) return;
    const previous = previousPath.current;
    previousPath.current = pathname;
    previousChoice.current = choice.chosenAt;
    getLandingPage();
    const location = `${window.location.origin}${safePagePath(pathname)}`;
    let referrer = "";
    try {
      if (previous) referrer = `${window.location.origin}${safePagePath(previous)}`;
      else if (document.referrer) { const url = new URL(document.referrer); referrer = `${url.origin}${safePagePath(url.href)}`; }
    } catch {}
    const parameters = { ...safeCampaignParameters(window.location.search), page_location: location, page_referrer: referrer };
    startGoogleAnalytics(parameters);
    sendAnalyticsEvent("page_view", { page_location: location, page_referrer: referrer });
  }, [pathname, choice]);
  return null;
}
