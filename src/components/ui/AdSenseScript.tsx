"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Google AdSense script loader.
 *
 * Only loads when NEXT_PUBLIC_ADSENSE_ENABLED="true" and user has accepted cookies.
 * Uses the publisher ID from NEXT_PUBLIC_ADSENSE_CLIENT_ID.
 *
 * AdSense policy: no ads on pages with sensitive/restricted content.
 * See: https://support.google.com/adsense/answer/1346295
 */
export function AdSenseScript() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
    if (!enabled) return;

    try {
      const consent = localStorage.getItem("fua-cookie-consent");
      if (consent === "accepted") {
        setShouldLoad(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  if (!shouldLoad) return null;

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <>
      {/* AdSense main script */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onError={() => {
          // Silently ignore AdSense load failures
        }}
      />
      {/* Initialize ad units — auto ads handles placements */}
      <Script id="adsense-init" strategy="afterInteractive">
        {`
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch(e) {}
        `}
      </Script>
    </>
  );
}
