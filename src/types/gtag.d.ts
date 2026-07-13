/// <reference types="google.analytics" />

interface Window {
  gtag?: (
    command: "config" | "consent" | "event" | "js" | "set" | "get",
    targetOrParams: string | Date | Record<string, unknown>,
    params?: Record<string, unknown>
  ) => void;
  dataLayer?: unknown[];
  /** Google AdSense */
  adsbygoogle?: Array<Record<string, unknown>>;
}
