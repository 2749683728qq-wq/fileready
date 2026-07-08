"use client";

import Link from "next/link";
import {
  Download,
  RotateCcw,
  X,
  CheckCircle2,
  ShieldCheck,
  FileSignature,
} from "lucide-react";
import {
  Button,
  FileDropzone,
  Alert,
  Progress,
  ErrorState,
  BeforeAfterComparison,
  RadioGroup,
  Input,
  Select,
  AdContainer,
} from "@/components/ui";
import { SignaturePreview } from "@/components/tools/SignaturePreview";
import { useSignatureProcessor } from "@/hooks/useSignatureProcessor";
import { formatBytes, formatDimensions } from "@/lib/utils";
import { SIGNATURE_PRESETS } from "@/lib/image";
import type { ColorMode } from "@/lib/image";
import { useT, useLocale } from "@/i18n";

const SIGNATURE_PRESET_KEY_MAP: Record<string, string> = {
  custom: "preset.custom",
  passport: "preset.passport",
  visa: "preset.visa",
  exam: "preset.exam",
};

export default function SignatureProcessorPage() {
  const t = useT();
  const locale = useLocale();

  const PRESET_OPTIONS = SIGNATURE_PRESETS.map((p) => ({
    value: `${p.width}x${p.height}`,
    label: t(SIGNATURE_PRESET_KEY_MAP[p.label] || p.label),
  }));
  const processor = useSignatureProcessor();
  const {
    appState,
    meta,
    result,
    error,
    progress,
    options,
    selectFile,
    updateOptions,
    setPreset,
    startProcessing,
    cancelProcessing,
    downloadResult,
    reset,
    changeFile,
    retry,
    MAX_FILE_SIZE,
  } = processor;

  const currentPresetKey = `${options.outputWidth}x${options.outputHeight}`;
  const isCustomPreset = options.outputWidth === 0 && options.outputHeight === 0;

  return (
    <div className="mx-auto max-w-5xl" translate="no">
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
            {t("signature.title")}
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {t("signature.title")}
      </h1>
      <p className="mt-2 text-text-secondary">
        {t("signature.desc")}
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
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: Preview */}
            <div className="lg:col-span-2">
              <SignaturePreview
                file={meta.file}
                options={options}
                className="sticky top-4"
              />
            </div>

            {/* Right: Options */}
            <div className="lg:col-span-3 space-y-6">
              {/* File Info Card */}
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FileSignature className="mt-0.5 h-8 w-8 text-primary-500" />
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

              {/* Auto-crop */}
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">
                  {t("signature.autoCrop")}
                </h3>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.autoCrop}
                    onChange={(e) => updateOptions({ autoCrop: e.target.checked })}
                    className="h-4 w-4 rounded border-border-default text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-secondary">
                    {t("signature.autoCropDesc")}
                  </span>
                </label>
                {options.autoCrop && (
                  <div className="mt-3 ml-7">
                    <label className="mb-1 block text-xs text-text-tertiary">
                      {t("signature.padding")}: {options.cropPadding}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={5}
                      value={options.cropPadding}
                      onChange={(e) =>
                        updateOptions({ cropPadding: parseInt(e.target.value, 10) })
                      }
                      className="w-full max-w-xs accent-primary-600"
                    />
                  </div>
                )}
              </div>

              {/* Background Removal */}
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">
                  {t("signature.bgRemove")}
                </h3>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.removeBackground}
                    onChange={(e) =>
                      updateOptions({ removeBackground: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border-default text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-secondary">
                    {t("signature.bgRemoveDesc")}
                  </span>
                </label>
                {options.removeBackground && (
                  <div className="mt-3 ml-7">
                    <label className="mb-1 block text-xs text-text-tertiary">
                      {t("signature.threshold")}: {options.backgroundThreshold}
                    </label>
                    <input
                      type="range"
                      min={180}
                      max={255}
                      step={5}
                      value={options.backgroundThreshold}
                      onChange={(e) =>
                        updateOptions({
                          backgroundThreshold: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full max-w-xs accent-primary-600"
                    />
                    <div className="mt-1 flex max-w-xs justify-between text-xs text-text-tertiary">
                      <span>{t("signature.moreAggressive")}</span>
                      <span>{t("signature.lessAggressive")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Color Mode */}
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">
                  {t("signature.colorMode")}
                </h3>
                <RadioGroup
                  label={t("signature.colorModeLabel")}
                  name="colorMode"
                  value={options.colorMode}
                  onChange={(e) =>
                    updateOptions({ colorMode: e.target.value as ColorMode })
                  }
                  options={[
                    { value: "original", label: t("signature.original"), hint: t("signature.originalHint") },
                    { value: "grayscale", label: t("signature.grayscale"), hint: t("signature.grayscaleHint") },
                    { value: "black-and-white", label: t("signature.bw"), hint: t("signature.bwHint") },
                  ]}
                />

                {options.colorMode === "black-and-white" && (
                  <div className="mt-4">
                    <label className="mb-1 block text-xs text-text-tertiary">
                      {t("signature.bwThreshold")}: {options.bwThreshold}
                    </label>
                    <input
                      type="range"
                      min={64}
                      max={220}
                      step={1}
                      value={options.bwThreshold}
                      onChange={(e) =>
                        updateOptions({
                          bwThreshold: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full max-w-xs accent-primary-600"
                    />
                    <div className="mt-1 flex max-w-xs justify-between text-xs text-text-tertiary">
                      <span>{t("signature.darker")}</span>
                      <span>{t("signature.lighter")}</span>
                    </div>
                  </div>
                )}

                {(options.colorMode === "grayscale" ||
                  options.colorMode === "original") && (
                  <div className="mt-4">
                    <label className="mb-1 block text-xs text-text-tertiary">
                      {t("signature.contrast")}: {options.contrast}%
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={200}
                      step={10}
                      value={options.contrast}
                      onChange={(e) =>
                        updateOptions({ contrast: parseInt(e.target.value, 10) })
                      }
                      className="w-full max-w-xs accent-primary-600"
                    />
                  </div>
                )}
              </div>

              {/* Output Size */}
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">
                  {t("signature.outputSize")}
                </h3>

                <Select
                  label={t("signature.preset")}
                  options={PRESET_OPTIONS}
                  value={currentPresetKey}
                  onChange={(e) => {
                    const preset = SIGNATURE_PRESETS.find(
                      (p) => `${p.width}x${p.height}` === e.target.value
                    );
                    if (preset) {
                      setPreset(preset.width, preset.height);
                    }
                  }}
                />

                {isCustomPreset && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <Input
                      label={t("signature.widthPx")}
                      type="number"
                      min={1}
                      value={options.outputWidth || ""}
                      onChange={(e) =>
                        updateOptions({
                          outputWidth: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                    <Input
                      label={t("signature.heightPx")}
                      type="number"
                      min={1}
                      value={options.outputHeight || ""}
                      onChange={(e) =>
                        updateOptions({
                          outputHeight: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </div>
                )}

                {(options.outputWidth > 0 || options.outputHeight > 0) && (
                  <label className="mt-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={options.maintainAspectRatio}
                      onChange={(e) =>
                        updateOptions({
                          maintainAspectRatio: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-border-default text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-text-secondary">
                      {t("signature.maintainAspect")}
                    </span>
                  </label>
                )}
              </div>

              {/* Process Button */}
              <div className="flex justify-center">
                <Button variant="primary" size="lg" onClick={startProcessing}>
                  <FileSignature className="mr-2 h-4 w-4" />
                  {t("signature.process")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Processing */}
        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <Progress value={Math.round(progress)} label={t("signature.processing")} />
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={cancelProcessing}>
                {t("button.cancel")}
              </Button>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {appState === "processing-cancelled" && (
          <Alert variant="warning" title={t("signature.cancelled")}>
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
            title={t("signature.failed")}
            message={error || t("error.unexpectedConvert")}
            onRetry={retry}
          />
        )}

        {/* Done */}
        {appState === "processing-done" && result && meta && (
          <div className="space-y-6">
            <Alert variant="success" title={t("signature.success")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("signature.success")}
            </Alert>

            <BeforeAfterComparison
              rows={[
                {
                  label: t("ui.dimensions"),
                  before: formatDimensions(meta.width, meta.height),
                  after: formatDimensions(result.width, result.height),
                  improved: result.cropRect !== null,
                },
                {
                  label: t("ui.fileSize"),
                  before: formatBytes(meta.sizeBytes),
                  after: formatBytes(result.sizeBytes),
                  improved: result.sizeBytes < meta.sizeBytes,
                },
                {
                  label: t("ui.background"),
                  before: options.removeBackground ? t("ui.whiteColored") : t("ui.original"),
                  after: options.removeBackground ? t("ui.transparent") : t("ui.original"),
                  improved: options.removeBackground,
                },
                {
                  label: t("ui.colorMode"),
                  before: t("ui.original"),
                  after:
                    options.colorMode === "black-and-white"
                      ? t("signature.bw")
                      : options.colorMode === "grayscale"
                        ? t("signature.grayscale")
                        : t("signature.original"),
                  improved: options.colorMode !== "original",
                },
                ...(result.cropRect
                  ? [
                      {
                        label: t("ui.autoCropped"),
                        before: t("ui.no"),
                        after: t("ui.yes"),
                        improved: true,
                      },
                    ]
                  : []),
              ]}
            />

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" onClick={downloadResult}>
                <Download className="mr-2 h-4 w-4" />
                {t("signature.downloadPng")}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("signature.processAnother")}
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
          {t("signature.tipsTitle")}
        </h2>
        <div className="mt-4 space-y-4 text-sm text-text-secondary">
          <div>
            <h3 className="font-medium text-text-primary">
              {t("signature.tips.whiteBg")}
            </h3>
            <p className="mt-1">
              {t("signature.tips.whiteBg")}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">
              {t("signature.tips.lighting")}
            </h3>
            <p className="mt-1">
              {t("signature.tips.lighting")}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">
              {t("signature.tips.format")}
            </h3>
            <p className="mt-1">
              {t("signature.tips.format")}{" "}
              <Link
                href={`/${locale}/tools/image-compressor`}
                className="text-text-link hover:underline"
              >
                {t("compressor.title")}
              </Link>
              .
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
              href={`/${locale}/tools/image-resizer`}
              className="text-sm text-text-link hover:underline"
            >
              {t("resizer.title")}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/tools/image-compressor`}
              className="text-sm text-text-link hover:underline"
            >
              {t("compressor.title")}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/tools/remove-image-metadata`}
              className="text-sm text-text-link hover:underline"
            >
              {t("metadata.title")}
            </Link>
          </li>
        </ul>
      </section>

      {/* Last updated */}
      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}</p>
    </div>
  );
}
