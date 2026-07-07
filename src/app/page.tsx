"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  ImageIcon,
  FileImage,
  FileSignature,
  FileText,
  Combine,
  Scissors,
  ShieldCheck,
  Zap,
  Lock,
  Monitor,
  AlertCircle,
  Maximize,
  FileQuestion,
} from "lucide-react";
import { useT, useLocale } from "@/i18n";

export default function HomePage() {
  const t = useT();
  const locale = useLocale();

  const toolCategories = [
    {
      title: t("home.categories.imageTools"),
      description: t("home.categories.imageToolsDesc"),
      icon: ImageIcon,
      tools: [
        { label: t("compressor.title"), href: `/${locale}/tools/image-compressor` },
        { label: t("resizer.title"), href: `/${locale}/tools/image-resizer` },
        { label: t("converter.title"), href: `/${locale}/tools/image-converter` },
        { label: t("signature.title"), href: `/${locale}/tools/signature-resizer` },
        { label: t("metadata.title"), href: `/${locale}/tools/remove-image-metadata` },
      ],
    },
    {
      title: t("home.categories.pdfTools"),
      description: t("home.categories.pdfToolsDesc"),
      icon: FileText,
      tools: [
        { label: t("img2pdf.title"), href: `/${locale}/tools/image-to-pdf` },
        { label: t("merge.title"), href: `/${locale}/tools/merge-pdf` },
        { label: t("split.title"), href: `/${locale}/tools/split-pdf` },
      ],
    },
    {
      title: t("home.categories.checkCalc"),
      description: t("home.categories.checkCalcDesc"),
      icon: FileCheck,
      tools: [
        { label: t("check.title"), href: `/${locale}/check-file` },
        { label: t("dpi.title"), href: `/${locale}/tools/dpi-calculator` },
      ],
    },
  ];

  const useCases = [
    { title: t("usecase.job.title"), description: t("usecase.job.desc"), href: `/${locale}/use-cases/job-applications` },
    { title: t("usecase.school.title"), description: t("usecase.school.desc"), href: `/${locale}/use-cases/school-applications` },
    { title: t("usecase.exam.title"), description: t("usecase.exam.desc"), href: `/${locale}/use-cases/exam-registration` },
    { title: t("usecase.visa.title"), description: t("usecase.visa.desc"), href: `/${locale}/use-cases/visa-passport` },
    { title: t("usecase.gov.title"), description: t("usecase.gov.desc"), href: `/${locale}/use-cases/government-forms` },
    { title: t("usecase.office.title"), description: t("usecase.office.desc"), href: `/${locale}/use-cases/everyday-office` },
  ];

  const steps = [
    { icon: FileCheck, title: t("home.step1.title"), description: t("home.step1.desc") },
    { icon: Zap, title: t("home.step2.title"), description: t("home.step2.desc") },
    { icon: ShieldCheck, title: t("home.step3.title"), description: t("home.step3.desc") },
  ];

  const problemLinks = [
    { label: t("home.problems.tooLarge"), href: `/${locale}/tools/image-compressor`, icon: FileImage },
    { label: t("home.problems.wrongDimensions"), href: `/${locale}/tools/image-resizer`, icon: Maximize },
    { label: t("home.problems.unsupportedFormat"), href: `/${locale}/tools/image-converter`, icon: FileQuestion },
    { label: t("home.problems.signature"), href: `/${locale}/tools/signature-resizer`, icon: FileSignature },
    { label: t("home.problems.mergePdf"), href: `/${locale}/tools/merge-pdf`, icon: Combine },
    { label: t("home.problems.splitPdf"), href: `/${locale}/tools/split-pdf`, icon: Scissors },
    { label: t("home.problems.uploadFails"), href: `/${locale}/check-file`, icon: AlertCircle },
    { label: t("home.problems.notSure"), href: `/${locale}/check-file`, icon: FileCheck },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pb-12 pt-8 text-center md:pb-16 md:pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
          {t("home.hero.title")}
          <br />
          <span className="text-primary-600">{t("home.hero.subtitle")}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
          {t("home.hero.desc")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/check-file`}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all duration-150 hover:bg-primary-700 active:bg-primary-800"
          >
            <FileCheck className="h-5 w-5" />
            {t("home.hero.cta")}
          </Link>
          <span className="text-sm text-text-tertiary">{t("home.hero.hint")}</span>
        </div>
      </section>

      {/* Problem Quick Links */}
      <section className="pb-12 md:pb-16">
        <h2 className="mb-6 text-center text-lg font-semibold text-text-primary">
          {t("home.problems.title")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {problemLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-lg border border-border-default bg-surface-card p-4 text-center transition-all duration-150 hover:border-primary-300 hover:bg-primary-50/50"
            >
              <item.icon className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tool Categories */}
      <section className="pb-12 md:pb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text-primary">
          {t("home.categories.title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {toolCategories.map((category) => (
            <div key={category.title} className="rounded-lg border border-border-default bg-surface-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                <category.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-text-primary">{category.title}</h3>
              <p className="mb-4 text-sm text-text-secondary">{category.description}</p>
              <ul className="space-y-1.5">
                {category.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="inline-flex items-center gap-1 text-sm text-text-link hover:underline">
                      {tool.label}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="pb-12 md:pb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text-primary">
          {t("home.useCases.title")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <Link key={useCase.href} href={useCase.href} className="rounded-lg border border-border-default bg-surface-card p-5 transition-all duration-150 hover:border-primary-300">
              <h3 className="font-semibold text-text-primary">{useCase.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{useCase.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="rounded-xl border border-success-100 bg-success-50 px-6 py-8 text-center md:py-10">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-600">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">{t("home.privacy.title")}</h2>
          <p className="text-sm text-text-secondary">{t("home.privacy.desc")}</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text-primary">
          {t("home.howItWorks.title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browser compatibility */}
      <section className="border-t border-border-default pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-text-tertiary">
          <Monitor className="h-4 w-4" />
          <span>{t("home.browser.title")}</span>
        </div>
      </section>
    </>
  );
}
