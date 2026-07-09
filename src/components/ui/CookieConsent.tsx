"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/i18n";
import { Button } from "@/components/ui";

type ConsentStatus = "pending" | "accepted" | "rejected";

const STORAGE_KEY = "fua-cookie-consent";

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [mounted, setMounted] = useState(false);
  const t = useT();

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "rejected") {
        setStatus(stored);
      }
    } catch {
      // localStorage may be unavailable in some browsers
    }
  }, []);

  const updateConsent = (value: "granted" | "denied") => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      try {
        window.gtag("consent", "update", { analytics_storage: value });
      } catch {
        // ignore gtag errors
      }
    }
  };

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setStatus("accepted");
    updateConsent("granted");
  };

  const handleReject = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "rejected");
    } catch {
      // ignore
    }
    setStatus("rejected");
    updateConsent("denied");
  };

  // Prevent hydration mismatch: don't render until mounted
  if (!mounted || status !== "pending") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-default bg-surface-card p-4 shadow-lg sm:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
          <div>
            <p className="text-sm font-medium text-text-primary">
              {t("cookie.title")}
            </p>
            <p className="mt-1 text-xs text-text-secondary max-w-xl">
              {t("cookie.desc")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={handleReject}>
            {t("cookie.reject")}
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleAccept}>
            {t("cookie.accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
