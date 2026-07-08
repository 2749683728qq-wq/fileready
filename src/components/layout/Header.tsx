"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useT, useLocale } from "@/i18n";
import type { Locale } from "@/i18n";
import { Logo } from "./Logo";

/** Get the switch-to URL based on current browser pathname. */
function getSwitchHref(currentLocale: Locale): string {
  const targetLocale: Locale = currentLocale === "zh-CN" ? "en" : "zh-CN";

  if (typeof window === "undefined") {
    return `/${targetLocale}/`;
  }

  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  const currentPrefix = currentLocale === "zh-CN" ? "/zh-CN" : "/en";

  // Find the current locale prefix in the pathname
  const idx = pathname.indexOf(currentPrefix);
  if (idx !== -1) {
    const rest = pathname.slice(idx + currentPrefix.length);
    return `/${targetLocale}${rest}/`;
  }

  // Fallback: go to homepage of target locale
  return `/${targetLocale}/`;
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [switchHref, setSwitchHref] = useState<string>("");
  const t = useT();
  const locale = useLocale();

  // Compute the switch href on mount and when locale changes.
  // We use useEffect + useState instead of direct DOM manipulation
  // so both desktop and mobile buttons get the same correct href.
  useEffect(() => {
    setSwitchHref(getSwitchHref(locale));
  }, [locale]);

  const navItems = [
    {
      label: t("nav.tools"),
      children: [
        { label: t("check.title"), href: `/${locale}/check-file` },
        { label: t("compressor.title"), href: `/${locale}/tools/image-compressor` },
        { label: t("resizer.title"), href: `/${locale}/tools/image-resizer` },
        { label: t("converter.title"), href: `/${locale}/tools/image-converter` },
        { label: t("signature.title"), href: `/${locale}/tools/signature-resizer` },
        { label: t("img2pdf.title"), href: `/${locale}/tools/image-to-pdf` },
        { label: t("merge.title"), href: `/${locale}/tools/merge-pdf` },
        { label: t("split.title"), href: `/${locale}/tools/split-pdf` },
        { label: t("metadata.title"), href: `/${locale}/tools/remove-image-metadata` },
        { label: t("dpi.title"), href: `/${locale}/tools/dpi-calculator` },
      ],
    },
    {
      label: t("nav.useCases"),
      children: [
        { label: t("usecase.job.title"), href: `/${locale}/use-cases/job-applications` },
        { label: t("usecase.school.title"), href: `/${locale}/use-cases/school-applications` },
        { label: t("usecase.exam.title"), href: `/${locale}/use-cases/exam-registration` },
        { label: t("usecase.visa.title"), href: `/${locale}/use-cases/visa-passport` },
        { label: t("usecase.gov.title"), href: `/${locale}/use-cases/government-forms` },
        { label: t("usecase.office.title"), href: `/${locale}/use-cases/everyday-office` },
      ],
    },
    { label: t("nav.guides"), href: `/${locale}/guides` },
    { label: t("nav.about"), href: `/${locale}/about` },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-surface-card/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Logo locale={locale} />

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === item.label ? null : item.label)
                  }
                  aria-expanded={activeDropdown === item.label}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              )}
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-0 top-full mt-1 min-w-[220px] rounded-lg border border-border-default bg-surface-card py-1 shadow-md">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Language switcher - desktop */}
          <a
            href={switchHref}
            className="ml-2 rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            aria-label={t("nav.switchLang")}
          >
            {t("nav.switchLang")}
          </a>
        </div>

        <button
          className="rounded-md p-2 text-text-secondary hover:bg-surface-hover md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border-default bg-surface-card md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <p className="px-3 py-1 text-xs font-semibold uppercase text-text-tertiary">
                      {item.label}
                    </p>
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-6 py-2 text-sm text-text-secondary hover:bg-surface-hover"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-border-default mt-2">
              <a
                href={switchHref}
                className="block rounded-md px-3 py-2 text-sm font-medium text-text-link hover:bg-surface-hover"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.switchLang")}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
