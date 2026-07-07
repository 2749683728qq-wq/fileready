"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Loads the Google AdSense script globally.
 * Only runs in production when NEXT_PUBLIC_ADSENSE_ENABLED=true
 * and the user has accepted cookies.
 */
export function AdSenseScript() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
    if (!enabled) return;

    const consent = localStorage.getItem("fua-cookie-consent");
    if (consent === "accepted") {
      setShouldLoad(true);
    }
  }, []);

  if (!shouldLoad) return null;

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <>
      {/* Google AdSense */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* AdSense auto-ads setup */}
      <Script id="adsense-init" strategy="afterInteractive">
        {`
          (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "${clientId}",
            enable_page_level_ads: true
          });
        `}
      </Script>
    </>
  );
}
