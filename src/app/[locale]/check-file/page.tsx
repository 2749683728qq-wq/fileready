"use client";

import Link from "next/link";
import {
  FileCheck,
  FileImage,
  FileText,
  Info,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  Checkbox,
  FileDropzone,
  Alert,
  ErrorState,
  ResultSummary,
  AdContainer,
} from "@/components/ui";
import { useFileChecker } from "@/hooks/useFileChecker";
import { formatBytes } from "@/lib/utils";
import { useT, useTArray, useLocale } from "@/i18n";

export default function CheckFilePage() {
  const t = useT();
  const ta = useTArray();
  const locale = useLocale();
  const checker = useFileChecker();
  const {
    appState,
    file,
    fileName,
    fileSize,
    fileType,
    result,
    error,
    requirements,
    selectFile,
    updateRequirements,
    startCheck,
    reset,
    MAX_FILE_SIZE,
  } = checker;

  const howToSteps = ta("check.howToSteps");
  const commonIssues = ta("check.commonIssuesItems");

  const relatedTools = [
    { label: t("compressor.title"), href: `/${locale}/tools/image-compressor` },
    { label: t("resizer.title"), href: `/${locale}/tools/image-resizer` },
    { label: t("converter.title"), href: `/${locale}/tools/image-converter` },
    { label: t("metadata.title"), href: `/${locale}/tools/remove-image-metadata` },
    { label: t("signature.title"), href: `/${locale}/tools/signature-resizer` },
  ];

  return (
    <div className="mx-auto max-w-3xl" translate="no">
      {/* Breadcrumb */}
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href={`/${locale}`} className="hover:text-text-link">
              {t("breadcrumb.home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${locale}/tools`} className="hover:text-text-link">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">
            {t("check.title")}
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {t("check.title")}
      </h1>
      <p className="mt-2 text-text-secondary">{t("check.desc")}</p>

      {/* Requirements Section */}
      {(appState === "initial" || appState === "file-selected") && (
        <section className="mt-8 rounded-lg border border-border-default bg-surface-card p-5">
          <h2 className="mb-4 text-base font-semibold text-text-primary">
            {t("check.requirements")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label={t("check.allowedType")}
              options={[
                { value: "image", label: t("check.typeImages") },
                { value: "pdf", label: t("check.typePdf") },
                { value: "image-pdf", label: t("check.typeAll") },
              ]}
              value={
                requirements.allowedTypes.includes("pdf") &&
                requirements.allowedTypes.includes("image")
                  ? "image-pdf"
                  : requirements.allowedTypes[0] === "pdf"
                    ? "pdf"
                    : "image"
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === "image-pdf") {
                  updateRequirements({ allowedTypes: ["image", "pdf"] });
                } else if (val === "pdf") {
                  updateRequirements({ allowedTypes: ["pdf"] });
                } else {
                  updateRequirements({ allowedTypes: ["image"] });
                }
              }}
            />
            <Input
              label={t("check.maxSize")}
              type="number"
              value={String(requirements.maxSizeBytes / 1024)}
              onChange={(e) => {
                const kb = parseInt(e.target.value, 10) || 0;
                updateRequirements({ maxSizeBytes: kb * 1024 });
              }}
              hint={t("check.sizeHint")}
            />
            <Input
              label={t("check.maxWidth")}
              type="number"
              value={String(requirements.maxWidth)}
              onChange={(e) =>
                updateRequirements({
                  maxWidth: parseInt(e.target.value, 10) || 0,
                })
              }
              hint={t("check.dimHint")}
            />
            <Input
              label={t("check.maxHeight")}
              type="number"
              value={String(requirements.maxHeight)}
              onChange={(e) =>
                updateRequirements({
                  maxHeight: parseInt(e.target.value, 10) || 0,
                })
              }
              hint={t("check.dimHint")}
            />
            <Select
              label={t("check.orientation")}
              options={[
                { value: "any", label: t("check.anyOrientation") },
                { value: "portrait", label: t("check.portraitOnly") },
                { value: "landscape", label: t("check.landscapeOnly") },
              ]}
              value={requirements.orientation}
              onChange={(e) =>
                updateRequirements({
                  orientation: e.target.value as "any" | "portrait" | "landscape",
                })
              }
            />
            <Select
              label={t("check.aspectRatio")}
              options={[
                { value: "any", label: t("check.anyRatio") },
                { value: "1:1", label: t("check.ratioSquare") },
                { value: "4:3", label: t("check.ratio43") },
                { value: "3:2", label: t("check.ratio32") },
                { value: "16:9", label: t("check.ratio169") },
              ]}
              value={
                requirements.allowedAspectRatios.length === 0
                  ? "any"
                  : requirements.allowedAspectRatios[0]
              }
              onChange={(e) => {
                const val = e.target.value;
                updateRequirements({
                  allowedAspectRatios: val === "any" ? [] : [val],
                });
              }}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Checkbox
              label={t("check.noSpaces")}
              checked={requirements.noSpacesInFilename}
              onChange={(e) =>
                updateRequirements({
                  noSpacesInFilename: e.target.checked,
                })
              }
            />
            <Checkbox
              label={t("check.noSpecialChars")}
              checked={requirements.noSpecialCharsInFilename}
              onChange={(e) =>
                updateRequirements({
                  noSpecialCharsInFilename: e.target.checked,
                })
              }
            />
          </div>
        </section>
      )}

      {/* File Upload Area */}
      <section className="mt-6">
        {appState === "initial" && (
          <FileDropzone
            onFileSelect={selectFile}
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            maxSize={MAX_FILE_SIZE}
          />
        )}

        {/* File selected */}
        {appState === "file-selected" && file && (
          <div className="rounded-lg border border-border-default bg-surface-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                  {fileType === "pdf" ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <FileImage className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {fileName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {formatBytes(fileSize ?? 0)} ·{" "}
                    {fileType === "pdf" ? "PDF" : t("check.typeImages")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={reset}>
                  {t("button.remove")}
                </Button>
                <Button size="sm" onClick={startCheck}>
                  <FileCheck className="mr-1.5 h-4 w-4" />
                  {t("check.check")}
                </Button>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-tertiary">
              {t("privacy.localNotice")}
            </p>
          </div>
        )}

        {/* Checking */}
        {appState === "checking" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-text-primary">
              {t("check.checking")}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              {t("check.analyzing")}
            </p>
          </div>
        )}

        {/* Results */}
        {appState === "results" && result && file && (
          <div className="space-y-6">
            {/* File Summary */}
            <div className="rounded-lg border border-border-default bg-surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                    {fileType === "pdf" ? (
                      <FileText className="h-5 w-5" />
                    ) : (
                      <FileImage className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {fileName}
                    </p>
                  <p className="text-xs text-text-tertiary">
                    {formatBytes(fileSize ?? file.size)} ·{" "}
                    {fileType === "pdf" ? "PDF" : t("check.typeImages")}
                  </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={reset}>
                  {t("button.changeFile")}
                </Button>
              </div>

              {result.allPassed ? (
                <Alert variant="success" title={t("check.allPassed")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t("check.allPassedDesc")}
                  {result.warningCount > 0 &&
                    ` ${t("check.minorSuggestions").replace("{n}", String(result.warningCount))}`}
                </Alert>
              ) : (
                <Alert variant="warning" title={`${t("check.issuesFound")}${result.failCount}`}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {t("check.issuesFoundDesc")}
                </Alert>
              )}
            </div>

            {/* Detailed Results */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-text-primary">
                {t("check.results")}
              </h3>
              <ResultSummary items={result.items} />
            </div>

            {/* Recommended Actions */}
            {result.recommendations.length > 0 && (
              <div className="rounded-lg border border-primary-100 bg-primary-50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-primary-800">
                  <Info className="h-4 w-4" />
                  {t("check.recommendations")}
                </h3>
                <ul className="mt-3 space-y-2">
                  {result.recommendations.map((rec, idx) => {
                    const toolLabel = t(rec.toolLabel);
                    const message = t(rec.message).replace(
                      /\{(\w+)\}/g,
                      (_, key) => rec.messageParams?.[key] ?? `{${key}}`
                    );
                    return (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-primary-700"
                      >
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          <strong>{toolLabel}:</strong> {message}{" "}
                          <Link
                            href={rec.toolHref}
                            className="underline hover:no-underline"
                          >
                            {t("check.openTool").replace("{tool}", toolLabel)}
                          </Link>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Processing notice */}
            <Alert variant="info">
              <p>
                <strong>{t("check.important")}:</strong>{" "}
                {t("check.notAffiliated")}
              </p>
            </Alert>
          </div>
        )}

        {/* Error State */}
        {appState === "error" && (
          <ErrorState
            title={t("check.failed")}
            message={error || t("check.failedDesc")}
            onRetry={reset}
          />
        )}
      </section>

      {/* Privacy Notice */}
      <section className="mt-12 rounded-lg border border-success-100 bg-success-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {t("privacy.staysOnDevice")}
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              {t("privacy.localNotice")}
            </p>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="mt-12">
        <AdContainer slotHeight="sm" />
      </div>

      {/* Help content */}
      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("check.howToTitle")}
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary">
          {howToSteps.map((step, idx) => (
            <li key={idx}>{idx + 1}. {step}</li>
          ))}
        </ol>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">
          {t("check.commonIssuesTitle")}
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
          {commonIssues.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">
          {t("check.faqTitle")}
        </h3>
        <dl className="mt-2 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-text-primary">
              {t("check.faq1Q")}
            </dt>
            <dd className="text-text-secondary">
              {t("check.faq1A")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">
              {t("check.faq2Q")}
            </dt>
            <dd className="text-text-secondary">
              {t("check.faq2A")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">
              {t("check.faq3Q")}
            </dt>
            <dd className="text-text-secondary">
              {t("check.faq3A")}
            </dd>
          </div>
        </dl>
      </section>

      {/* Related tools */}
      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("check.relatedTitle")}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Last updated */}
      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}</p>
    </div>
  );
}
