"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Loads Google Analytics (GA4) script.
 * Only runs when NEXT_PUBLIC_GA_ENABLED=true and user accepted cookies.
 */
export function GoogleAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_GA_ENABLED === "true";
    if (!enabled) return;

    const consent = localStorage.getItem("fua-cookie-consent");
    if (consent === "accepted") {
      setShouldLoad(true);
    }
  }, []);

  if (!shouldLoad) return null;

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
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
