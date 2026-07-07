"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

interface AdContainerProps {
  className?: string;
  slotHeight?: "sm" | "md" | "lg";
}

const heightMap: Record<string, string> = {
  sm: "min-h-[90px]",
  md: "min-h-[250px]",
  lg: "min-h-[400px]",
};

function getStoredConsent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fua-cookie-consent");
}

export function AdContainer({ className, slotHeight = "md" }: AdContainerProps) {
  const t = useT();
  const [consent] = useState<string | null>(getStoredConsent);

  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  if (!adsEnabled) return null;
  if (consent === "rejected") return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed border-border-default bg-surface-hover/30",
        heightMap[slotHeight],
        className
      )}
      aria-label={t("ad.placeholder")}
      role="complementary"
    >
      <span className="text-xs text-text-tertiary">{t("ad.placeholder")}</span>
    </div>
  );
}
