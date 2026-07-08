"use client";

import Link from "next/link";
import {
  FileImage,
  Download,
  RotateCcw,
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRightLeft,
} from "lucide-react";
import {
  Button,
  FileDropzone,
  Alert,
  Progress,
  ErrorState,
  BeforeAfterComparison,
  RadioGroup,
  AdContainer,
} from "@/components/ui";
import { useImageConverter } from "@/hooks/useImageConverter";
import { formatBytes, formatDimensions } from "@/lib/utils";
import {
  OUTPUT_FORMATS,
  getFormatLabel,
  formatSupportsQuality,
} from "@/lib/image/format-convert";
import { useT, useLocale } from "@/i18n";

export default function ImageConverterPage() {
  const t = useT();
  const locale = useLocale();
  const converter = useImageConverter();
  const {
    appState,
    meta,
    result,
    error,
    progress,
    outputFormat,
    quality,
    selectFile,
    setOutputFormat,
    setQuality,
    startConversion,
    cancelConversion,
    downloadResult,
    reset,
    changeFile,
    retry,
    MAX_FILE_SIZE,
  } = converter;

  const currentFormat = meta?.format;
  const isSameFormat = currentFormat === outputFormat;
  const showQuality = formatSupportsQuality(outputFormat);

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
            <Link href={`/${locale}`} className="hover:text-text-link">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">
            {t("converter.title")}
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {t("converter.title")}
      </h1>
      <p className="mt-2 text-text-secondary">
        {t("converter.desc")}
      </p>

      <section className="mt-8 space-y-6">
        {/* Initial & Error States */}
        {(appState === "initial" ||
          appState === "file-too-large" ||
          appState === "format-unsupported") && (
          <FileDropzone
            onFileSelect={selectFile}
            accept="image/jpeg,image/png,image/webp"
            maxSize={MAX_FILE_SIZE}
            disabled={false}
          />
        )}

        {/* Error feedback */}
        {appState === "file-too-large" && (
          <Alert variant="error" title={t("error.fileTooLarge")}>
            {error}
          </Alert>
        )}
        {appState === "format-unsupported" && (
          <Alert variant="error" title={t("error.unsupportedFormat")}>
            {error}
          </Alert>
        )}

        {/* Reading file */}
        {appState === "reading-file" && (
          <div className="flex items-center gap-3 rounded-lg border border-border-default bg-surface-card p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <span className="text-sm text-text-secondary">
              {t("state.reading")}
            </span>
          </div>
        )}

        {/* File Ready */}
        {appState === "file-ready" && meta && (
          <div className="space-y-6">
            {/* File Info Card */}
            <div className="rounded-lg border border-border-default bg-surface-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileImage className="mt-0.5 h-8 w-8 text-primary-500" />
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {meta.file.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                      <span>{getFormatLabel(meta.format)}</span>
                      <span>{formatBytes(meta.sizeBytes)}</span>
                      <span>{formatDimensions(meta.width, meta.height)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={changeFile}
                  className="rounded p-1 text-text-tertiary hover:text-text-secondary"
                  aria-label={t("button.removeFile")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversion Options */}
            <div className="rounded-lg border border-border-default bg-surface-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">
                {t("converter.convertTo")}
              </h2>

              <RadioGroup
                label={t("converter.outputFormat")}
                name="outputFormat"
                value={outputFormat}
                onChange={(e) =>
                  setOutputFormat(e.target.value as typeof outputFormat)
                }
                options={OUTPUT_FORMATS.map((f) => ({
                  value: f.value,
                  label: f.label,
                  hint:
                    f.value === currentFormat
                      ? t("converter.sameFormatHint")
                      : undefined,
                }))}
              />

              {isSameFormat && (
                <p className="mt-3 text-xs text-text-tertiary">
                  {t("converter.sameFormatHint")}
                </p>
              )}

              {showQuality && (
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {t("converter.quality")}: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={Math.round(quality * 100)}
                    onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                    className="w-full accent-primary-600"
                  />
                  <div className="mt-1 flex justify-between text-xs text-text-tertiary">
                    <span>{t("converter.smaller")}</span>
                    <span>{t("converter.better")}</span>
                  </div>
                </div>
              )}

              {!showQuality && (
                <p className="mt-3 text-xs text-text-tertiary">
                  {t("converter.sameFormatHint")}
                </p>
              )}

              <div className="mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={startConversion}
                  className="w-full sm:w-auto"
                >
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  {t("converter.convert")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Processing */}
        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <Progress value={Math.round(progress)} label={t("converter.converting")} />
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={cancelConversion}>
                {t("button.cancel")}
              </Button>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {appState === "processing-cancelled" && (
          <Alert variant="warning" title={t("converter.cancelled")}>
            {t("converter.cancelledDesc")}
            <div className="mt-3">
              <Button variant="primary" size="sm" onClick={retry}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("button.retry")}
              </Button>
            </div>
          </Alert>
        )}

        {/* Processing Failed */}
        {appState === "processing-failed" && (
          <ErrorState
            title={t("converter.failed")}
            message={error || t("error.unexpectedConvert")}
            onRetry={retry}
          />
        )}

        {/* Done */}
        {appState === "processing-done" && result && meta && (
          <div className="space-y-6">
            <Alert variant="success" title={t("converter.complete")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("converter.complete")}
            </Alert>

            <BeforeAfterComparison
              rows={[
                {
                  label: t("ui.format"),
                  before: getFormatLabel(meta.format),
                  after: getFormatLabel(result.format),
                  improved: meta.format !== result.format,
                },
                {
                  label: t("ui.fileSize"),
                  before: formatBytes(meta.sizeBytes),
                  after: formatBytes(result.sizeBytes),
                  improved: result.sizeBytes < meta.sizeBytes,
                },
                {
                  label: t("ui.dimensions"),
                  before: formatDimensions(meta.width, meta.height),
                  after: formatDimensions(result.width, result.height),
                  improved: false,
                },
                ...(result.format !== "image/png"
                  ? [
                      {
                        label: t("ui.quality"),
                        before: "100%",
                        after: `${Math.round(result.quality * 100)}%`,
                        improved: false,
                      },
                    ]
                  : []),
              ]}
            />

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={downloadResult}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("converter.downloadConverted")}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("converter.convertAnother")}
              </Button>
            </div>
          </div>
        )}

        {/* Download Ready */}
        {appState === "download-ready" && result && (
          <Alert variant="info" title={t("state.downloadStarted")}>
            {t("state.downloadNotStarted")}{" "}
            <button
              type="button"
              onClick={downloadResult}
              className="font-medium underline hover:no-underline"
            >
              {t("state.clickHereDownload")}
            </button>
            .
          </Alert>
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
              {t("privacy.localBrief")}
            </p>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="mt-12">
        <AdContainer slotHeight="sm" />
      </div>

      {/* Help Section */}
      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("converter.aboutTitle")}
        </h2>
        <div className="mt-4 space-y-4 text-sm text-text-secondary">
          <div>
            <h3 className="font-medium text-text-primary">
              {t("converter.about1Q")}
            </h3>
            <p className="mt-1">
              {t("converter.about1A")}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">
              {t("converter.about2Q")}
            </h3>
            <p className="mt-1">
              {t("converter.about2A")}
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("related.title")}
        </h2>
        <ul className="mt-3 space-y-1.5">
          <li>
            <Link
              href={`/${locale}/tools/image-compressor`}
              className="text-sm text-text-link hover:underline"
            >
              Image Compressor
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/tools/image-resizer`}
              className="text-sm text-text-link hover:underline"
            >
              Image Resizer &amp; Cropper
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/tools/remove-image-metadata`}
              className="text-sm text-text-link hover:underline"
            >
              Remove Image Metadata
            </Link>
          </li>
        </ul>
      </section>

      {/* Last updated */}
      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}</p>
    </div>
  );
}
