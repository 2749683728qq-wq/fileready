"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useT, useLocale } from "@/i18n";
import { AdContainer } from "@/components/ui";

interface UseCasePageProps {
  titleKey: string;
  descKey: string;
  tools: string[];
  tips: { titleKey: string; descKey: string }[];
}

export function UseCasePage({ titleKey, descKey, tools, tips }: UseCasePageProps) {
  const t = useT();
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-3xl" translate="no">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("nav.useCases")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">{t(titleKey)}</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t(titleKey)}</h1>
      <p className="mt-2 text-text-secondary">{t(descKey)}</p>

      <section className="mt-8 space-y-6">
        <div className="rounded-lg border border-border-default bg-surface-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("related.title")}</h2>
          <ul className="space-y-2">
            {tools.map((toolKey) => (
              <li key={toolKey}>
                <Link
                  href={`/${locale}/tools/${getToolHref(toolKey)}`}
                  className="inline-flex items-center gap-1.5 text-sm text-text-link hover:underline"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  {t(toolKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border-default bg-surface-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("ui.tips")}</h2>
          <div className="space-y-4">
            {tips.map((tip, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-medium text-text-primary">{t(tip.titleKey)}</h3>
                <p className="mt-1 text-sm text-text-secondary">{t(tip.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-success-100 bg-success-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{t("privacy.local")}</h3>
            <p className="mt-1 text-xs text-text-secondary">{t("privacy.localDesc")}</p>
          </div>
        </div>
      </section>

      <div className="mt-12"><AdContainer slotHeight="sm" /></div>

      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}: July 2026</p>
    </div>
  );
}

function getToolHref(key: string): string {
  const map: Record<string, string> = {
    "compressor.title": "image-compressor",
    "resizer.title": "image-resizer",
    "converter.title": "image-converter",
    "signature.title": "signature-resizer",
    "metadata.title": "remove-image-metadata",
    "dpi.title": "dpi-calculator",
    "img2pdf.title": "image-to-pdf",
    "merge.title": "merge-pdf",
    "split.title": "split-pdf",
    "check.title": "../check-file",
  };
  return map[key] || "";
}
