"use client";

import { useState, useCallback } from "react";
import { useT } from "@/i18n";

/**
 * A small footer link that opens the cookie consent banner again,
 * allowing users to change their preferences.
 */
export function CookieSettings() {
  const t = useT();
  const [showBanner, setShowBanner] = useState(false);

  const handleOpen = useCallback(() => {
    // Clear consent and reload to show banner again
    localStorage.removeItem("fua-cookie-consent");
    window.location.reload();
  }, []);

  return (
    <button
      onClick={handleOpen}
      className="text-sm text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
      type="button"
    >
      {t("cookie.settings") || "Cookie Settings"}
    </button>
  );
}
