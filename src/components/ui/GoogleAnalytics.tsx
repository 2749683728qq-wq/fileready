"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const DEFAULT_GA_ID = "G-V396LK6VZ3";

/**
 * Loads Google Analytics (GA4) script.
 * Runs when user accepted cookies. Falls back to DEFAULT_GA_ID if env var is not set.
 */
export function GoogleAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("fua-cookie-consent");
    if (consent === "accepted") {
      setShouldLoad(true);
    }
  }, []);

  if (!shouldLoad) return null;

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_ID;
  if (!measurementId) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
          gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
        `}
      </Script>
    </>
  );
}
