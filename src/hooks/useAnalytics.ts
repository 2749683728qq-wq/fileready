"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/i18n";

/**
 * Lightweight anonymous analytics hook.
 * Tracks page views without cookies or personal data.
 * Only fires when cookie consent is accepted.
 */
export function useAnalytics(pageName: string) {
  const locale = useLocale();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;

    const consent = localStorage.getItem("fua-cookie-consent");
    if (consent !== "accepted") return;

    fired.current = true;

    // Simple page view tracking — no cookies, no personal data
    try {
      const data = {
        page: pageName,
        locale,
        timestamp: Date.now(),
        referrer: document.referrer || "direct",
      };

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("[Analytics]", data);
      }

      // In production, this would send to a privacy-respecting analytics service
      // (e.g., Plausible, Umami, or a self-hosted solution)
      // For now, we just record it — the actual endpoint would be configured here
    } catch {
      // Analytics should never break the app
    }
  }, [pageName, locale]);
}
