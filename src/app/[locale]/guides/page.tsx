"use client";
import Link from "next/link";
import { useT, useLocale } from "@/i18n";
import { AdContainer } from "@/components/ui";
import { guides } from "@/lib/guides";

export default function GuidesPage() {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">{t("nav.guides")}</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{t("guides.title")}</h1>
      <p className="mt-2 text-text-secondary">{t("guides.desc")}</p>
      <div className="mt-8 grid gap-4">
        {guides.map((g) => (
          <Link key={g.slug} href={`/${locale}/guides/${g.slug}`} className="block rounded-lg border border-border-default bg-surface-card p-5 transition-all hover:border-primary-300">
            <h3 className="font-semibold text-text-primary">{g.title[locale]}</h3>
            <p className="mt-1 text-sm text-text-secondary">{t("guides.readGuide")} →</p>
          </Link>
        ))}
      </div>
      <div className="mt-12"><AdContainer slotHeight="sm" /></div>
      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}: July 2026</p>
    </div>
  );
}
