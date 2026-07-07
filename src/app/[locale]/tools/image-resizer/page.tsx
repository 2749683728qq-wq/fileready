"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  FileImage,
  Download,
  RotateCcw,
  X,
  CheckCircle2,
  ShieldCheck,
  Crop,
  Maximize,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Lock,
  Unlock,
} from "lucide-react";
import {
  Button,
  FileDropzone,
  Alert,
  ErrorState,
  BeforeAfterComparison,
  AdContainer,
  Select,
} from "@/components/ui";
import { CropEditor } from "@/components/tools/CropEditor";
import {
  processImage,
  createPreviewUrl,
  constrainCropRect,
  parseAspectRatio,
  ASPECT_RATIO_PRESETS,
  SIZE_UNITS,
  isSupportedImage,
  ResizeError,
  type CropRect,
  type AspectRatioPreset,
  type FlipMode,
  type ResizeUnit,
} from "@/lib/image";
import { formatBytes, formatDimensions } from "@/lib/utils";
import { useT, useTArray, useLocale } from "@/i18n";

type AppState =
  | "initial"
  | "reading-file"
  | "file-ready"
  | "format-unsupported"
  | "file-too-large"
  | "processing"
  | "processing-done"
  | "processing-failed"
  | "download-ready";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export default function ImageResizerPage() {
  const t = useT();
  const ta = useTArray();
  const locale = useLocale();

  const [appState, setAppState] = useState<AppState>("initial");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Crop state
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 0, height: 0 });
  const [aspectPreset, setAspectPreset] = useState<AspectRatioPreset>("free");
  const [customRatioW, setCustomRatioW] = useState(1);
  const [customRatioH, setCustomRatioH] = useState(1);

  // Resize state
  const [outWidth, setOutWidth] = useState(0);
  const [outHeight, setOutHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [unit, setUnit] = useState<ResizeUnit>("px");
  const [dpi, setDpi] = useState(96);

  // Transform state
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState<FlipMode>("none");

  // Result
  const [result, setResult] = useState<{
    blob: Blob;
    width: number;
    height: number;
    sizeBytes: number;
    durationMs: number;
  } | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup URLs
  const cleanup = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [previewUrl, resultUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on unmount
  }, []);

  // Handle file selection
  const handleFile = useCallback(async (f: File) => {
    cleanup();
    if (f.size > MAX_FILE_SIZE) {
      setAppState("file-too-large");
      setError(t("error.fileTooLargeWithMax") + " " + formatBytes(MAX_FILE_SIZE));
      return;
    }
    if (!isSupportedImage(f)) {
      setAppState("format-unsupported");
      setError(t("error.unsupportedFormatHint"));
      return;
    }

    setAppState("reading-file");
    setFile(f);

    const url = createPreviewUrl(f);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setPreviewUrl(url);
      setImgWidth(w);
      setImgHeight(h);
      setOutWidth(w);
      setOutHeight(h);
      setCrop({ x: 0, y: 0, width: w, height: h });
      setAppState("file-ready");
    };
    img.onerror = () => {
      setAppState("processing-failed");
      setError(t("error.failedToLoad"));
    };
    img.src = url;
  }, [cleanup, t]);

  // Handle crop change
  const handleCropChange = useCallback((newCrop: CropRect) => {
    setCrop(newCrop);
    if (lockAspect || aspectPreset !== "free") {
      setOutWidth(newCrop.width);
      setOutHeight(newCrop.height);
    }
  }, [lockAspect, aspectPreset]);

  // Handle aspect ratio change
  const handleAspectChange = useCallback((preset: AspectRatioPreset) => {
    setAspectPreset(preset);
    const ratio = parseAspectRatio(preset);
    const newCrop = constrainCropRect(
      { ...crop, width: crop.height * (ratio?.w || 1) / (ratio?.h || 1) },
      imgWidth, imgHeight, ratio
    );
    setCrop(newCrop);
    setOutWidth(newCrop.width);
    setOutHeight(newCrop.height);
    setLockAspect(true);
  }, [crop, imgWidth, imgHeight]);

  // Handle width change with lock
  const handleWidthChange = useCallback((w: number) => {
    setOutWidth(w);
    if (lockAspect) {
      const ratio = outWidth / outHeight || imgWidth / imgHeight;
      setOutHeight(Math.round(w / ratio));
    }
  }, [lockAspect, outWidth, outHeight, imgWidth, imgHeight]);

  // Handle height change with lock
  const handleHeightChange = useCallback((h: number) => {
    setOutHeight(h);
    if (lockAspect) {
      const ratio = outWidth / outHeight || imgWidth / imgHeight;
      setOutWidth(Math.round(h * ratio));
    }
  }, [lockAspect, outWidth, outHeight, imgWidth, imgHeight]);

  // Reset crop to full image
  const resetCrop = useCallback(() => {
    const newCrop = { x: 0, y: 0, width: imgWidth, height: imgHeight };
    setCrop(newCrop);
    setOutWidth(imgWidth);
    setOutHeight(imgHeight);
    setAspectPreset("free");
    setRotation(0);
    setFlip("none");
  }, [imgWidth, imgHeight]);

  // Process
  const handleProcess = useCallback(async () => {
    if (!file) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAppState("processing");

    try {
      const res = await processImage(file, {
        width: outWidth,
        height: outHeight,
        crop: aspectPreset === "free" && crop.width === imgWidth && crop.height === imgHeight
          ? undefined
          : crop,
        rotation,
        flip: flip === "none" ? undefined : flip,
        signal: controller.signal,
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(res.blob);
      setResultUrl(url);
      setResult({
        blob: res.blob,
        width: res.width,
        height: res.height,
        sizeBytes: res.sizeBytes,
        durationMs: res.durationMs,
      });
      setAppState("processing-done");
    } catch (err) {
      if (err instanceof ResizeError && err.code === "cancelled") return;
      setAppState("processing-failed");
      setError(err instanceof Error ? err.message : "Processing failed");
    }
  }, [file, outWidth, outHeight, crop, aspectPreset, imgWidth, imgHeight, rotation, flip, resultUrl]);

  // Download
  const handleDownload = useCallback(() => {
    if (!resultUrl || !result) return;
    const a = document.createElement("a");
    const baseName = file?.name?.replace(/\.[^.]+$/, "") || "image";
    a.href = resultUrl;
    a.download = `${baseName}-resized.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setAppState("download-ready");
  }, [resultUrl, result, file]);

  // Change file
  const handleChangeFile = useCallback(() => {
    cleanup();
    setAppState("initial");
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setResultUrl(null);
  }, [cleanup]);

  const howToSteps = ta("resizer.howToSteps");
  const keyboardItems = ta("resizer.keyboardItems");

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-text-tertiary" aria-label={t("breadcrumb.label")}>
        <Link href={`/${locale}`} className="hover:text-text-secondary">{t("breadcrumb.home")}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}`} className="hover:text-text-secondary">{t("breadcrumb.tools")}</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{t("resizer.title")}</span>
      </nav>

      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
        {t("resizer.title")}
      </h1>
      <p className="mt-2 text-text-secondary">
        {t("resizer.desc")}
      </p>

      <section className="mt-8 space-y-6">
        {/* File selection */}
        {(appState === "initial" || appState === "file-too-large" || appState === "format-unsupported") && (
          <FileDropzone
            onFileSelect={handleFile}
            accept=".jpg,.jpeg,.png,.webp"
            maxSize={MAX_FILE_SIZE}
          />
        )}

        {/* Reading */}
        {appState === "reading-file" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-text-primary">{t("state.readingFile")}</p>
          </div>
        )}

        {/* File ready — show editor */}
        {(appState === "file-ready" || appState === "processing") && previewUrl && (
          <div className="space-y-6">
            {/* File info bar */}
            <div className="flex items-center justify-between rounded-lg border border-border-default bg-surface-card p-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileImage className="h-5 w-5 shrink-0 text-primary-600" />
                <span className="truncate text-sm font-medium" title={file?.name}>
                  {file?.name}
                </span>
                <span className="text-xs text-text-tertiary">
                  {formatDimensions(imgWidth, imgHeight)}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleChangeFile}>
                <X className="h-4 w-4" /> {t("button.change")}
              </Button>
            </div>

            {/* Crop Editor */}
            <div className="rounded-lg border border-border-default bg-surface-card p-4">
              <h2 className="mb-3 text-sm font-semibold text-text-primary">
                <Crop className="inline h-4 w-4 mr-1" />
                {t("resizer.crop")}
              </h2>
              <div className="flex flex-col gap-4 lg:flex-row">
                {/* Editor */}
                <div className="flex justify-center overflow-auto">
                  <CropEditor
                    src={previewUrl}
                    imageWidth={imgWidth}
                    imageHeight={imgHeight}
                    crop={crop}
                    onCropChange={handleCropChange}
                    aspectRatio={aspectPreset}
                    customRatio={aspectPreset === "custom" ? { w: customRatioW, h: customRatioH } : undefined}
                    editorWidth={Math.min(600, imgWidth)}
                    editorHeight={400}
                  />
                </div>

                {/* Controls sidebar */}
                <div className="w-full lg:w-64 shrink-0 space-y-4">
                  {/* Aspect ratio */}
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-text-secondary">
                      {t("resizer.aspectRatio")}
                    </label>
                    <Select
                      label=""
                      options={ASPECT_RATIO_PRESETS.map(p => ({ value: p.value, label: p.label }))}
                      value={aspectPreset}
                      onChange={(e) => handleAspectChange(e.target.value as AspectRatioPreset)}
                    />
                    {aspectPreset === "custom" && (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="number"
                          min="1"
                          value={customRatioW}
                          onChange={(e) => setCustomRatioW(Number(e.target.value) || 1)}
                          className="w-16 rounded-md border border-border-default px-2 py-1 text-sm"
                        />
                        <span className="text-text-tertiary">:</span>
                        <input
                          type="number"
                          min="1"
                          value={customRatioH}
                          onChange={(e) => setCustomRatioH(Number(e.target.value) || 1)}
                          className="w-16 rounded-md border border-border-default px-2 py-1 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Crop dimensions */}
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-text-secondary">
                      {t("resizer.cropSize")}
                    </label>
                    <div className="text-xs text-text-tertiary">
                      {crop.width} × {crop.height} {t("resizer.pixels")}
                    </div>
                  </div>

                  {/* Rotate & Flip */}
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-text-secondary">
                      {t("resizer.rotateFlip")}
                    </label>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setRotation((rotation + 90) % 360)}
                        className="rounded-md border border-border-default p-2 hover:bg-surface-hover"
                        title={t("resizer.rotate90")}
                        aria-label={t("resizer.rotate90")}
                      >
                        <RotateCw className="h-4 w-4 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => setFlip(flip === "horizontal" ? "none" : "horizontal")}
                        className={`rounded-md border p-2 ${
                          flip === "horizontal"
                            ? "border-primary-500 bg-primary-50 text-primary-600"
                            : "border-border-default text-text-secondary hover:bg-surface-hover"
                        }`}
                        title={t("resizer.flipHorizontal")}
                        aria-label={t("resizer.flipHorizontal")}
                      >
                        <FlipHorizontal className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setFlip(flip === "vertical" ? "none" : "vertical")}
                        className={`rounded-md border p-2 ${
                          flip === "vertical"
                            ? "border-primary-500 bg-primary-50 text-primary-600"
                            : "border-border-default text-text-secondary hover:bg-surface-hover"
                        }`}
                        title={t("resizer.flipVertical")}
                        aria-label={t("resizer.flipVertical")}
                      >
                        <FlipVertical className="h-4 w-4" />
                      </button>
                      <button
                        onClick={resetCrop}
                        className="rounded-md border border-border-default p-2 text-text-secondary hover:bg-surface-hover"
                        title={t("resizer.resetCrop")}
                        aria-label={t("resizer.resetCrop")}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Dimensions */}
            <div className="rounded-lg border border-border-default bg-surface-card p-5">
              <h2 className="mb-3 text-sm font-semibold text-text-primary">
                <Maximize className="inline h-4 w-4 mr-1" />
                {t("resizer.outputDims")}
              </h2>

              {/* Unit selector */}
              <div className="mb-3">
                <Select
                  label=""
                  options={SIZE_UNITS.map(u => ({ value: u.value, label: u.label }))}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as ResizeUnit)}
                />
              </div>

              {/* DPI input (when not px) */}
              {unit !== "px" && (
                <div className="mb-3 flex items-center gap-2">
                  <label className="text-xs text-text-secondary">{t("resizer.dpiLabel")}</label>
                  <input
                    type="number"
                    value={dpi}
                    onChange={(e) => setDpi(Number(e.target.value) || 96)}
                    className="w-20 rounded-md border border-border-default px-2 py-1 text-sm"
                    min="1"
                    max="1200"
                  />
                </div>
              )}

              {/* Width & Height */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block mb-1 text-xs text-text-tertiary">{t("resizer.width")}</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={unit === "px" ? outWidth : Math.round(outWidth / dpi * 2.54 * 10) / 10}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (unit === "px") handleWidthChange(v);
                      else handleWidthChange(Math.round(v / 2.54 * dpi));
                    }}
                    className="w-full rounded-md border border-border-default px-2 py-1.5 text-sm focus:border-border-focus focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setLockAspect(!lockAspect)}
                  className="mt-4 rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
                  title={lockAspect ? t("resizer.unlockAspect") : t("resizer.lockAspect")}
                  aria-label={lockAspect ? t("resizer.unlockAspect") : t("resizer.lockAspect")}
                >
                  {lockAspect ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </button>

                <div className="flex-1">
                  <label className="block mb-1 text-xs text-text-tertiary">{t("resizer.height")}</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={unit === "px" ? outHeight : Math.round(outHeight / dpi * 2.54 * 10) / 10}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (unit === "px") handleHeightChange(v);
                      else handleHeightChange(Math.round(v / 2.54 * dpi));
                    }}
                    className="w-full rounded-md border border-border-default px-2 py-1.5 text-sm focus:border-border-focus focus:outline-none"
                  />
                </div>
              </div>

              {/* Dimensions info */}
              <div className="mt-3 text-xs text-text-tertiary">
                {unit === "px" ? (
                  <>{t("resizer.original")} {formatDimensions(imgWidth, imgHeight)}</>
                ) : (
                  <>{t("resizer.atDpi").replace("{dpi}", String(dpi)).replace("{px}", String(outWidth)).replace("{mm}", (outWidth / dpi * 25.4).toFixed(1))}</>
                )}
              </div>

              {/* Process button */}
              <Button size="lg" className="mt-4 w-full sm:w-auto" onClick={handleProcess}>
                <Maximize className="h-4 w-4" />
                {t("resizer.process")}
              </Button>
            </div>
          </div>
        )}

        {/* Processing */}
        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-text-primary">{t("state.processing")}</p>
            <p className="mt-1 text-xs text-text-tertiary">
              {t("resizer.applying")}
            </p>
          </div>
        )}

        {/* Done */}
        {appState === "processing-done" && result && (
          <div className="space-y-6">
            <Alert variant="success" title={t("resizer.success")}>
              {t("resizer.successDesc")}
            </Alert>

            <BeforeAfterComparison
              rows={[
                { label: "File size", before: formatBytes(file?.size || 0), after: formatBytes(result.sizeBytes), improved: result.sizeBytes < (file?.size || 0) },
                { label: "Dimensions", before: formatDimensions(imgWidth, imgHeight), after: formatDimensions(result.width, result.height), improved: true },
                { label: "Processing time", before: "—", after: `${(result.durationMs / 1000).toFixed(1)}s` },
              ]}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={handleDownload}>
                <Download className="h-5 w-5" />
                {t("resizer.downloadResized")}
              </Button>
              <Button variant="outline" size="lg" onClick={handleChangeFile}>
                <RotateCcw className="h-4 w-4" />
                {t("button.processAnother")}
              </Button>
            </div>
          </div>
        )}

        {/* Error */}
        {appState === "processing-failed" && (
          <ErrorState message={error || "An error occurred"} onRetry={() => setAppState("file-ready")} />
        )}

        {appState === "download-ready" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-success-600" />
            <p className="mt-2 text-sm font-medium">{t("state.downloadStarted")}</p>
            <Button variant="outline" className="mt-4" onClick={handleChangeFile}>{t("button.processAnotherShort")}</Button>
          </div>
        )}
      </section>

      {/* Privacy notice */}
      <div className="mt-8 rounded-lg border border-info-100 bg-info-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-info-600" />
          <div className="text-sm text-info-700">
            <p className="font-medium">{t("privacy.private")}</p>
            <p className="mt-1">{t("privacy.allLocal")}</p>
          </div>
        </div>
      </div>

      <div className="mt-12"><AdContainer slotHeight="sm" /></div>

      {/* Help content */}
      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">{t("resizer.howToTitle")}</h2>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary">
          {howToSteps.map((step, i) => (
            <li key={i}>{i + 1}. {step}</li>
          ))}
        </ol>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">{t("resizer.keyboardTitle")}</h3>
        <ul className="mt-2 space-y-1 text-sm text-text-secondary">
          {keyboardItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">{t("compressor.faqTitle")}</h3>
        <dl className="mt-2 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-text-primary">{t("resizer.faq1Q")}</dt>
            <dd className="text-text-secondary">
              {t("resizer.faq1A")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">{t("resizer.faq2Q")}</dt>
            <dd className="text-text-secondary">
              {t("resizer.faq2A")}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">{t("related.title")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: t("compressor.title"), href: `/${locale}/tools/image-compressor` },
            { label: t("converter.title"), href: `/${locale}/tools/image-converter` },
            { label: t("signature.title"), href: `/${locale}/tools/signature-resizer` },
            { label: t("dpi.title"), href: `/${locale}/tools/dpi-calculator` },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href} className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover">
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
