"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

interface AdContainerProps {
  className?: string;
  /** AdSense ad slot ID (data-ad-slot) */
  adSlot?: string;
  /** Ad format: "auto" | "horizontal" | "vertical" | "rectangle" */
  adFormat?: "auto" | "horizontal" | "vertical" | "rectangle";
  /** Fallback min-height when ad is loading */
  slotHeight?: "sm" | "md" | "lg";
}

const formatMap: Record<string, string> = {
  auto: "",
  horizontal: "horizontal",
  vertical: "vertical",
  rectangle: "rectangle",
};

const heightMap: Record<string, string> = {
  sm: "min-h-[90px]",
  md: "min-h-[250px]",
  lg: "min-h-[400px]",
};

function getStoredConsent(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("fua-cookie-consent");
  } catch {
    return null;
  }
}

/**
 * AdSense ad unit container.
 *
 * When NEXT_PUBLIC_ADSENSE_ENABLED is "true" and user has accepted cookies,
 * renders a real AdSense `<ins>` element. Otherwise shows nothing (ads disabled
 * or user rejected cookies).
 *
 * AdSense policy compliance:
 * - Max 3 ads per page (caller must ensure)
 * - Not placed near download buttons
 * - Clearly distinguished from content
 */
export function AdContainer({
  className,
  adSlot,
  adFormat = "auto",
  slotHeight = "md",
}: AdContainerProps) {
  const t = useT();
  const insRef = useRef<HTMLModElement>(null);
  const [consent] = useState<string | null>(getStoredConsent);

  const adsEnabled =
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
    !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Push the ad unit to AdSense after mount
  useEffect(() => {
    if (!adsEnabled || consent !== "accepted" || !adSlot || !insRef.current) return;

    try {
      // AdSense auto-ads handles most placements, but for manual units:
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch {
      // AdSense push may fail — ignore
    }
  }, [adsEnabled, consent, adSlot]);

  // Don't render if ads disabled or user rejected
  if (!adsEnabled) return null;
  if (consent === "rejected") return null;

  // If consent not yet given (pending), show nothing (banner is showing)
  if (consent !== "accepted") return null;

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-lg",
        heightMap[slotHeight],
        className
      )}
      aria-label={t("ad.placeholder")}
      role="complementary"
    >
      <ins
        ref={insRef}
        className="adsbygoogle block"
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat ? formatMap[adFormat] || "auto" : "auto"}
        data-full-width-responsive="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
