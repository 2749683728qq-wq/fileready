"use client";

import Link from "next/link";
import {
  FileImage,
  Download,
  RotateCcw,
  X,
  CheckCircle2,
  Zap,
  ShieldCheck,
} from "lucide-react";
import {
  Button,
  FileDropzone,
  Alert,
  Progress,
  ErrorState,
  BeforeAfterComparison,
  AdContainer,
} from "@/components/ui";
import { useImageCompressor } from "@/hooks/useImageCompressor";
import { formatBytes, formatDimensions } from "@/lib/utils";
import { TARGET_SIZE_PRESETS } from "@/lib/image";
import { useT, useTArray, useLocale } from "@/i18n";

export default function ImageCompressorPage() {
  const t = useT();
  const ta = useTArray();
  const locale = useLocale();
  const compressor = useImageCompressor();
  const {
    appState,
    meta,
    result,
    error,
    progress,
    targetSizeBytes,
    selectFile,
    setTargetSize,
    startCompression,
    cancelCompression,
    downloadResult,
    reset,
    changeFile,
    retry,
    MAX_FILE_SIZE,
  } = compressor;

  const howToSteps = ta("compressor.howToSteps");
  const whatHappensItems = ta("compressor.whatHappensItems");
  const commonIssuesItems = ta("compressor.commonIssuesItems");

  return (
    <div className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-text-tertiary" aria-label={t("breadcrumb.label")}>
        <Link href={`/${locale}`} className="hover:text-text-secondary">{t("breadcrumb.home")}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}`} className="hover:text-text-secondary">{t("breadcrumb.tools")}</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{t("compressor.title")}</span>
      </nav>

      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
        {t("compressor.title")}
      </h1>
      <p className="mt-2 text-text-secondary">
        {t("compressor.desc")}
      </p>

      {/* === TOOL OPERATION AREA === */}
      <section className="mt-8 space-y-6">
        {/* File Dropzone / File Info */}
        {(appState === "initial" ||
          appState === "file-too-large" ||
          appState === "format-unsupported") && (
          <FileDropzone
            onFileSelect={selectFile}
            accept=".jpg,.jpeg,.png,.webp"
            maxSize={MAX_FILE_SIZE}
          />
        )}

        {/* Reading file */}
        {appState === "reading-file" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-text-primary">{t("state.readingFile")}</p>
          </div>
        )}

        {/* File ready — show info + target size selector */}
        {(appState === "file-ready" ||
          appState === "processing" ||
          appState === "processing-done" ||
          appState === "download-ready") && (
          <div className="space-y-6">
            {/* File info card */}
            {meta && (
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                      <FileImage className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary" title={meta.file.name}>
                        {meta.file.name}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {formatBytes(meta.sizeBytes)} ·{" "}
                        {formatDimensions(meta.width, meta.height)} ·{" "}
                        {meta.format.split("/")[1]?.toUpperCase()}
                        {meta.hasTransparency && ` · ${t("compressor.transparency")}`}
                        {meta.dpi && ` · ${meta.dpi} DPI`}
                      </p>
                    </div>
                  </div>
                  {appState === "file-ready" && (
                    <Button variant="ghost" size="sm" onClick={changeFile}>
                      <X className="h-4 w-4" />
                      {t("button.change")}
                    </Button>
                  )}
                </div>

                {/* Already small enough? */}
                {meta.sizeBytes <= targetSizeBytes && appState === "file-ready" && (
                  <Alert variant="info" className="mt-3">
                    {t("compressor.alreadySmall")}
                  </Alert>
                )}
              </div>
            )}

            {/* Target size selector */}
            {appState === "file-ready" && (
              <div className="rounded-lg border border-border-default bg-surface-card p-5" translate="no">
                <h2 className="mb-3 text-sm font-semibold text-text-primary">
                  {t("compressor.targetSize")}
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {TARGET_SIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.bytes}
                      type="button"
                      onClick={() => setTargetSize(preset.bytes)}
                      aria-pressed={targetSizeBytes === preset.bytes}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 ${
                        targetSizeBytes === preset.bytes
                          ? "bg-primary-600 text-white shadow-sm"
                          : "border border-border-default text-text-secondary hover:bg-surface-hover"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-tertiary">{t("compressor.custom")}:</span>
                  <input
                    type="number"
                    min="1"
                    max="20000"
                    placeholder="KB"
                    className="w-24 rounded-md border border-border-default px-2 py-1 text-sm focus:border-border-focus focus:outline-none"
                    onBlur={(e) => {
                      const kb = parseInt(e.target.value, 10);
                      if (kb > 0) setTargetSize(kb * 1024);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const kb = parseInt((e.target as HTMLInputElement).value, 10);
                        if (kb > 0) setTargetSize(kb * 1024);
                      }
                    }}
                  />
                  <span className="text-sm text-text-tertiary">KB</span>
                </div>

                <Button
                  size="lg"
                  className="mt-4 w-full sm:w-auto"
                  onClick={startCompression}
                >
                  <Zap className="h-4 w-4" />
                  {t("compressor.compressTo")} {formatBytes(targetSizeBytes)} {t("compressor.orLess")}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Processing */}
        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <Progress value={progress} label={t("compressor.compressing")} className="mb-4" />
            <p className="text-xs text-text-tertiary text-center">
              {t("compressor.findingQuality")}
            </p>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" onClick={cancelCompression}>
                {t("button.cancel")}
              </Button>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {appState === "processing-cancelled" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-5">
            <Alert variant="warning" title={t("compressor.cancelled")}>
              {t("compressor.cancelledDesc")}
            </Alert>
            <div className="mt-4">
              <Button variant="primary" onClick={startCompression}>
                <RotateCcw className="h-4 w-4" />
                {t("button.retry")}
              </Button>
            </div>
          </div>
        )}

        {/* Done! */}
        {appState === "processing-done" && result && meta && (
          <div className="space-y-6">
            {/* Success banner */}
            <Alert variant="success" title={t("compressor.complete")}>
              {t("compressor.completeDesc")
                .replace("{before}", formatBytes(meta.sizeBytes))
                .replace("{after}", formatBytes(result.sizeBytes))}
              {result.sizeBytes > targetSizeBytes
                ? ` (${t("compressor.closeToTarget").replace("{target}", formatBytes(targetSizeBytes))})`
                : ` (${t("compressor.withinTarget").replace("{target}", formatBytes(targetSizeBytes))})`}
              .
            </Alert>

            {/* Before / After */}
            <BeforeAfterComparison
              rows={[
                {
                  label: t("compressor.fileSize"),
                  before: formatBytes(meta.sizeBytes),
                  after: formatBytes(result.sizeBytes),
                  improved: true,
                },
                {
                  label: t("compressor.dimensions"),
                  before: formatDimensions(meta.width, meta.height),
                  after: formatDimensions(result.width, result.height),
                  improved: result.width !== meta.width || result.height !== meta.height,
                },
                {
                  label: t("compressor.format"),
                  before: meta.format.split("/")[1]?.toUpperCase() || "—",
                  after: result.format.split("/")[1]?.toUpperCase() || "—",
                },
                {
                  label: t("compressor.qualityLevel"),
                  before: "100%",
                  after: `${result.quality}%`,
                  improved: true,
                },
                {
                  label: t("compressor.processingTime"),
                  before: "—",
                  after: `${(result.durationMs / 1000).toFixed(1)}s`,
                },
              ]}
            />

            {/* Compression ratio */}
            <div className="rounded-lg border border-success-100 bg-success-50 p-4 text-center">
              <p className="text-sm text-success-700">
                {t("compressor.reducedBy").replace(
                  "{percent}",
                  Math.round(
                    ((meta.sizeBytes - result.sizeBytes) / meta.sizeBytes) * 100
                  ).toString()
                )}
                {result.iterations > 1 &&
                  ` ${t("compressor.iterations").replace("{n}", result.iterations.toString())}`}
              </p>
            </div>

            {/* Transparency warning */}
            {meta.hasTransparency && result.format === "image/jpeg" && (
              <Alert variant="warning">
                {t("compressor.transparencyWarning")}
              </Alert>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={downloadResult}>
                <Download className="h-5 w-5" />
                {t("compressor.downloadCompressed")}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                {t("compressor.compressAnother")}
              </Button>
            </div>
          </div>
        )}

        {/* Download ready */}
        {appState === "download-ready" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-success-600" />
            <p className="mt-2 text-sm font-medium text-text-primary">
              {t("state.downloadStarted")}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              {t("state.downloadNotStarted")}{" "}
              <button onClick={downloadResult} className="text-text-link underline">
                {t("state.clickHere")}
              </button>
              .
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                {t("compressor.compressAnother")}
              </Button>
            </div>
          </div>
        )}

        {/* Error states */}
        {appState === "processing-failed" && (
          <ErrorState
            message={error || "An unexpected error occurred during compression."}
            onRetry={retry}
          />
        )}

        {appState === "file-too-large" && (
          <Alert variant="error" title={t("error.fileTooLarge")}>
            {error}
          </Alert>
        )}

        {appState === "format-unsupported" && (
          <Alert variant="error" title={t("error.unsupportedFormat")}>
            {error}
            <p className="mt-2">{t("compressor.unsupportedHint")}</p>
          </Alert>
        )}
      </section>

      {/* Processing notice */}
      <div className="mt-8 rounded-lg border border-info-100 bg-info-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-info-600" />
          <div className="text-sm text-info-700">
            <p className="font-medium">{t("privacy.private")}</p>
            <p className="mt-1">{t("privacy.privateDesc")}</p>
          </div>
        </div>
      </div>

      {/* Ad space — far from action area */}
      <div className="mt-12">
        <AdContainer slotHeight="sm" />
      </div>

      {/* Help content */}
      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("compressor.howToTitle")}
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary">
          {howToSteps.map((step, i) => (
            <li key={i}>{i + 1}. {step}</li>
          ))}
        </ol>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">
          {t("compressor.whatHappensTitle")}
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
          {whatHappensItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">
          {t("compressor.commonIssuesTitle")}
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
          {commonIssuesItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">{t("compressor.faqTitle")}</h3>
        <dl className="mt-2 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-text-primary">
              {t("compressor.faq1Q")}
            </dt>
            <dd className="text-text-secondary">
              {t("compressor.faq1A")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">
              {t("compressor.faq2Q")}
            </dt>
            <dd className="text-text-secondary">
              {t("compressor.faq2A")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">
              {t("compressor.faq3Q")}
            </dt>
            <dd className="text-text-secondary">
              {t("compressor.faq3A")}
            </dd>
          </div>
        </dl>
      </section>

      {/* Related tools */}
      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">{t("related.title")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: t("resizer.title"), href: `/${locale}/tools/image-resizer` },
            { label: t("converter.title"), href: `/${locale}/tools/image-converter` },
            { label: t("signature.title"), href: `/${locale}/tools/signature-resizer` },
            { label: t("check.title"), href: `/${locale}/check-file` },
          ].map((tool) => (
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

      <p className="mt-8 text-xs text-text-tertiary">
        {t("lastUpdated")}: {new Date().toISOString().split("T")[0]}
      </p>
    </div>
  );
}
