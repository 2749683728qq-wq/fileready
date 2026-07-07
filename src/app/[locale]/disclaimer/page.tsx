"use client";
import Link from "next/link";
import { useT, useLocale } from "@/i18n";

export default function DisclaimerPage() {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">{t("disclaimer.title")}</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{t("disclaimer.title")}</h1>
      <div className="mt-6 space-y-4 text-sm text-text-secondary">
        <p>{t("disclaimer.body1")}</p>
        <p>{t("disclaimer.body2")}</p>
        <p>{t("disclaimer.body3")}</p>
      </div>
      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}: July 2026</p>
    </div>
  );
}
