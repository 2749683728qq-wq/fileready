"use client";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useT, useLocale } from "@/i18n";
import { AdContainer } from "@/components/ui";

export default function PrivacyPage() {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">{t("privacy.title")}</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{t("privacy.title")}</h1>
      <div className="mt-6 space-y-4 text-sm text-text-secondary">
        <p><strong>{t("privacy.effectiveDate")}:</strong> July 2026</p>
        <h2 className="text-lg font-semibold text-text-primary">{t("privacy.commitment")}</h2>
        <p>{t("privacy.commitmentDesc")}</p>
        <h2 className="text-lg font-semibold text-text-primary">{t("privacy.dataCollection")}</h2>
        <p>{t("privacy.dataCollectionDesc")}</p>
        <h2 className="text-lg font-semibold text-text-primary">{t("privacy.advertising")}</h2>
        <p>{t("privacy.advertisingDesc")}</p>
        <h2 className="text-lg font-semibold text-text-primary">{t("privacy.contact")}</h2>
        <p>{t("privacy.contactDesc")}</p>
      </div>
      <section className="mt-12 rounded-lg border border-success-100 bg-success-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
          <div><h3 className="text-sm font-semibold text-text-primary">{t("privacy.local")}</h3><p className="mt-1 text-xs text-text-secondary">{t("privacy.localDesc")}</p></div>
        </div>
      </section>
      <div className="mt-12"><AdContainer slotHeight="sm" /></div>
      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}: July 2026</p>
    </div>
  );
}
