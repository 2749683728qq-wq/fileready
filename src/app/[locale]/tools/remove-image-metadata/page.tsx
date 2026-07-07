"use client";

import Link from "next/link";
import {
  FileImage,
  Download,
  RotateCcw,
  X,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  EyeOff,
} from "lucide-react";
import {
  Button,
  FileDropzone,
  Alert,
  Progress,
  ErrorState,
  BeforeAfterComparison,
  MetadataTable,
  AdContainer,
} from "@/components/ui";
import { useImageMetadata } from "@/hooks/useImageMetadata";
import { formatBytes, formatDimensions } from "@/lib/utils";
import { getPrivacyRiskLabel } from "@/lib/image";
import { useT, useLocale } from "@/i18n";

export default function MetadataRemoverPage() {
  const t = useT();
  const locale = useLocale();
  const remover = useImageMetadata();
  const {
    appState,
    meta,
    metadata,
    result,
    error,
    progress,
    selectFile,
    startStripping,
    cancelStripping,
    downloadResult,
    reset,
    changeFile,
    retry,
    MAX_FILE_SIZE,
  } = remover;

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
            {t("metadata.title")}
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {t("metadata.title")}
      </h1>
      <p className="mt-2 text-text-secondary">
        {t("metadata.desc")}
      </p>

      {/* Privacy Warning */}
      <div className="mt-4 rounded-lg border border-warning-200 bg-warning-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning-600" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {t("metadata.privacyWarning")}
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              {t("metadata.privacyWarningDesc")}
            </p>
          </div>
        </div>
      </div>

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
              {t("state.readingFile")}
            </span>
          </div>
        )}

        {/* File Ready */}
        {appState === "file-ready" && meta && metadata && (
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

            {/* Privacy Risk Summary */}
            {metadata.privacyRiskLevel !== "none" && (
              <Alert variant="warning" title={t("metadata.privacyRisk")}>
                {getPrivacyRiskLabel(metadata.privacyRiskLevel)}.{" "}
                {metadata.totalEntries} metadata{" "}
                {metadata.totalEntries === 1 ? "entry" : "entries"} found.
              </Alert>
            )}

            {/* Metadata Display */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                {t("metadata.found")}
              </h2>
              <MetadataTable
                categories={metadata.categories}
                showPrivacyBadge={true}
              />
            </div>

            {/* Strip Button */}
            <div className="flex justify-center">
              <Button
                variant="danger"
                size="lg"
                onClick={startStripping}
                disabled={metadata.totalEntries === 0}
              >
                <EyeOff className="mr-2 h-4 w-4" />
                {metadata.totalEntries === 0
                  ? t("metadata.noMetadata")
                  : t("metadata.removeCount").replace("{n}", String(metadata.totalEntries))}
              </Button>
            </div>
          </div>
        )}

        {/* Processing */}
        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <Progress value={Math.round(progress)} label={t("metadata.removing")} />
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={cancelStripping}>
                {t("button.cancel")}
              </Button>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {appState === "processing-cancelled" && (
          <Alert variant="warning" title={t("state.cancelled")}>
            {t("state.cancelled")}
            <div className="mt-3">
              <Button variant="primary" size="sm" onClick={retry}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("button.retry")}
              </Button>
            </div>
          </Alert>
        )}

        {/* Failed */}
        {appState === "processing-failed" && (
          <ErrorState
            title={t("metadata.failed")}
            message={error || "An unexpected error occurred."}
            onRetry={retry}
          />
        )}

        {/* Done */}
        {appState === "processing-done" && result && meta && (
          <div className="space-y-6">
            <Alert variant="success" title={t("metadata.removed")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              All {result.metadataBefore.totalEntries} metadata{" "}
              {result.metadataBefore.totalEntries === 1 ? "entry" : "entries"}{" "}
              removed successfully.
            </Alert>

            <BeforeAfterComparison
              rows={[
                {
                  label: "Metadata Entries",
                  before: String(result.metadataBefore.totalEntries),
                  after: String(result.metadataAfter.totalEntries),
                  improved: result.metadataAfter.totalEntries === 0,
                },
                {
                  label: "GPS Location",
                  before: result.metadataBefore.hasLocation ? "Present" : "None",
                  after: "Removed",
                  improved: result.metadataBefore.hasLocation,
                },
                {
                  label: "Camera Info",
                  before: result.metadataBefore.hasCameraInfo
                    ? "Present"
                    : "None",
                  after: "Removed",
                  improved: result.metadataBefore.hasCameraInfo,
                },
                {
                  label: "Timestamps",
                  before: result.metadataBefore.hasTimestamp
                    ? "Present"
                    : "None",
                  after: "Removed",
                  improved: result.metadataBefore.hasTimestamp,
                },
                {
                  label: "File Size",
                  before: formatBytes(meta.sizeBytes),
                  after: formatBytes(result.sizeBytes),
                  improved: result.sizeBytes < meta.sizeBytes,
                },
              ]}
            />

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" onClick={downloadResult}>
                <Download className="mr-2 h-4 w-4" />
                {t("metadata.downloadClean")}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("metadata.removeAnother")}
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
              {t("privacy.allLocal")}
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
          {t("metadata.aboutTitle")}
        </h2>
        <div className="mt-4 space-y-4 text-sm text-text-secondary">
          <div>
            <h3 className="font-medium text-text-primary">
              {t("metadata.help.what")}
            </h3>
            <p className="mt-1">
              Metadata (also called EXIF data) is hidden information embedded in
              image files by cameras and phones. It can include GPS coordinates,
              camera make and model, serial numbers, date and time the photo was
              taken, and software used to edit it.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">
              {t("metadata.help.how")}
            </h3>
            <p className="mt-1">
              We redraw your image on a Canvas element in your browser and
              export it as a new file. This process naturally strips all
              embedded metadata without modifying the image content. The visual
              quality of your image remains unchanged.
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
              href={`/${locale}/tools/image-converter`}
              className="text-sm text-text-link hover:underline"
            >
              Image Format Converter
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
        </ul>
      </section>

      {/* Last updated */}
      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}</p>
    </div>
  );
}
