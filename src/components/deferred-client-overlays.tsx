"use client";

import dynamic from "next/dynamic";

const CookieConsentBanner = dynamic(
  () => import("@/components/cookie-consent-banner").then((mod) => mod.CookieConsentBanner),
  { ssr: false },
);
const AnalyticsLoader = dynamic(
  () => import("@/components/analytics-loader").then((mod) => mod.AnalyticsLoader),
  { ssr: false },
);

export function DeferredClientOverlays() {
  return (
    <>
      <CookieConsentBanner />
      <AnalyticsLoader />
    </>
  );
}
