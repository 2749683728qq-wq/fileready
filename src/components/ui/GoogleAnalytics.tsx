"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const DEFAULT_GA_ID = "G-V396LK6VZ3";

/**
 * Google Analytics (GA4) with Consent Mode v2.
 *
 * Always loads the gtag script so Google can detect it. Defaults analytics_storage
 * to "denied" until the user accepts cookies — at which point we update consent to
 * "granted". This keeps us privacy-compliant while still being verifiable by Google.
 */
export function GoogleAnalytics() {
  const [consentReady, setConsentReady] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("fua-cookie-consent");
    setHasConsent(consent === "accepted");
    setConsentReady(true);
  }, []);

  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_ID;
  if (!measurementId) return null;

  return (
    <>
      {/* Always load gtag — consent defaults to denied */}
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

          // Default consent: analytics denied until user accepts cookies
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });

          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>

      {/* If user already accepted cookies, update consent to granted */}
      {consentReady && hasConsent && (
        <Script id="ga-consent-grant">
          {`
            gtag('consent', 'update', {
              'analytics_storage': 'granted'
            });
          `}
        </Script>
      )}
    </>
  );
}
