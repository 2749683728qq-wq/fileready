"use client";

import Link from "next/link";
import { useT, useLocale } from "@/i18n";
import { CookieSettings } from "@/components/ui/CookieSettings";

export function Footer() {
  const t = useT();
  const locale = useLocale();

  const footerGroups = [
    {
      title: t("footer.tools"),
      links: [
        { label: t("check.title"), href: `/${locale}/check-file` },
        { label: t("compressor.title"), href: `/${locale}/tools/image-compressor` },
        { label: t("resizer.title"), href: `/${locale}/tools/image-resizer` },
        { label: t("converter.title"), href: `/${locale}/tools/image-converter` },
        { label: t("signature.title"), href: `/${locale}/tools/signature-resizer` },
        { label: t("img2pdf.title"), href: `/${locale}/tools/image-to-pdf` },
        { label: t("merge.title"), href: `/${locale}/tools/merge-pdf` },
        { label: t("split.title"), href: `/${locale}/tools/split-pdf` },
        { label: t("dpi.title"), href: `/${locale}/tools/dpi-calculator` },
      ],
    },
    {
      title: t("footer.useCases"),
      links: [
        { label: t("usecase.job.title"), href: `/${locale}/use-cases/job-applications` },
        { label: t("usecase.school.title"), href: `/${locale}/use-cases/school-applications` },
        { label: t("usecase.exam.title"), href: `/${locale}/use-cases/exam-registration` },
        { label: t("usecase.visa.title"), href: `/${locale}/use-cases/visa-passport` },
        { label: t("usecase.gov.title"), href: `/${locale}/use-cases/government-forms` },
        { label: t("usecase.office.title"), href: `/${locale}/use-cases/everyday-office` },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("nav.guides"), href: `/${locale}/guides` },
        { label: t("nav.about"), href: `/${locale}/about` },
        { label: t("contact.title"), href: `/${locale}/contact` },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("privacy.title"), href: `/${locale}/privacy` },
        { label: t("terms.title"), href: `/${locale}/terms` },
        { label: t("disclaimer.title"), href: `/${locale}/disclaimer` },
      ],
    },
  ];

  return (
    <footer className="border-t border-border-default bg-surface-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border-default pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-text-tertiary">
              &copy; {new Date().getFullYear()} FileReady.{" "}
              {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-4">
              <CookieSettings />
              <Link
                href={`/${locale}/privacy`}
                className="text-sm text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
              >
                {t("privacy.title")}
              </Link>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-tertiary">
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
