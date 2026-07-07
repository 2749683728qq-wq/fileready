"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translations, type Locale } from "./translations";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext);
  // Fallback: detect from URL if context not set (edge case in static export)
  if (typeof window !== "undefined" && ctx === "en") {
    if (window.location.pathname.startsWith("/zh-CN")) return "zh-CN";
  }
  return ctx;
}

/**
 * Translate a key to the current locale.
 * Returns string for string values, string[] for array values.
 * Usage: const t = useT(); t("nav.home")
 */
export function useT() {
  const locale = useLocale();

  return function t(key: string, fallback?: string): string {
    const entry = translations[key];
    if (!entry) return fallback ?? key;
    const val = entry[locale] ?? entry["en"];
    if (val === undefined || val === null) return fallback ?? key;
    return String(val);
  };
}

/**
 * Translate a key that holds a string array (e.g. steps, FAQ items).
 */
export function useTArray() {
  const locale = useLocale();

  return function ta(key: string, fallback?: string[]): string[] {
    const entry = translations[key];
    if (!entry) return fallback ?? [key];
    const val = entry[locale] ?? entry["en"];
    if (Array.isArray(val)) return val as string[];
    if (typeof val === "string") return [val];
    return fallback ?? [String(val)];
  };
}

/**
 * Get all available translations (for server-side use).
 */
export { translations };
export type { Locale };
