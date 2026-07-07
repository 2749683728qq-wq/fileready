"use client";
import Link from "next/link";
import { useT, useLocale } from "@/i18n";

export default function ContactPage() {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">{t("contact.title")}</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{t("contact.title")}</h1>
      <p className="mt-4 text-text-secondary">{t("contact.desc")}</p>
      <div className="mt-6 rounded-lg border border-border-default bg-surface-card p-6">
        <p className="text-sm text-text-secondary">{t("contact.body")}</p>
        <p className="mt-3 text-sm text-text-secondary">{t("contact.noFiles")}</p>
      </div>
      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}: July 2026</p>
    </div>
  );
}
