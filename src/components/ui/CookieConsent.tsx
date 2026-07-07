"use client";

import { useState, useCallback } from "react";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/i18n";
import { Button } from "@/components/ui";

type ConsentStatus = "pending" | "accepted" | "rejected";

const STORAGE_KEY = "fua-cookie-consent";

function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return "pending";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "accepted" || stored === "rejected") return stored;
  return "pending";
}

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(getStoredConsent);
  const t = useT();

  const accept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setStatus("accepted");
  }, []);

  const reject = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setStatus("rejected");
  }, []);

  if (status !== "pending") return null;

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
          <Button variant="outline" size="sm" onClick={reject}>
            {t("cookie.reject")}
          </Button>
          <Button variant="primary" size="sm" onClick={accept}>
            {t("cookie.accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
