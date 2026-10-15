"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { getLandingPage, safeCampaignParameters, safePagePath, sendAnalyticsCommand, sendAnalyticsEvent } from "@/lib/funnel-analytics.mjs";

const GA_ID = "G-H52TSV34MX";

export default function SiteAnalytics() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    const previous = previousPath.current;
    previousPath.current = pathname;
    getLandingPage();
    // Overrides apply to automatic measurement too; URLs never contain checkout parameters.
    const location = `${window.location.origin}${safePagePath(pathname)}`;
    let referrer = "";
    try { if (previous) referrer = `${window.location.origin}${safePagePath(previous)}`;
      else if (document.referrer) { const url = new URL(document.referrer); referrer = `${url.origin}${safePagePath(url.href)}`; } } catch {}
    sendAnalyticsCommand("set", { ...safeCampaignParameters(window.location.search), page_location: location, page_referrer: referrer });
    sendAnalyticsEvent("page_view", { page_location: location, page_referrer: referrer });
  }, [pathname]);

  return <Script id="popart-ga" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />;
}
