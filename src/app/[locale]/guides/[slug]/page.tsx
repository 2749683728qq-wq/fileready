"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { getGuideBySlug } from "@/lib/guides";
import { useLocale, useT } from "@/i18n";
import { AdContainer } from "@/components/ui";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default function GuidePage({ params }: Props) {
  const { slug } = use(params);
  const locale = useLocale();
  const t = useT();

  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href={`/${locale}`} className="hover:text-text-link">
              {t("breadcrumb.home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${locale}/guides`} className="hover:text-text-link">
              {t("nav.guides")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">
            {guide.title[locale]}
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {guide.title[locale]}
      </h1>
      <p className="mt-2 text-text-secondary">{guide.description[locale]}</p>

      <div className="mt-8 space-y-8">
        {guide.sections.map((section, idx) => (
          <section
            key={idx}
            className="rounded-lg border border-border-default bg-surface-card p-5 sm:p-6"
          >
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              {section.heading[locale]}
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary">
              {section.paragraphs[locale].map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href={`/${locale}/guides`}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-link hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("breadcrumb.backToGuides") || "Back to guides"}
        </Link>
      </div>

      <div className="mt-12">
        <AdContainer slotHeight="sm" />
      </div>

      <p className="mt-8 flex items-center gap-1.5 text-xs text-text-tertiary">
        <Calendar className="h-3.5 w-3.5" />
        {t("lastUpdated")}: July 2026
      </p>
    </div>
  );
}
