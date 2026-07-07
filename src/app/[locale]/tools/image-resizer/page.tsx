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
      setError("File too large. Maximum is 20 MB.");
      return;
    }
    if (!isSupportedImage(f)) {
      setAppState("format-unsupported");
      setError("Unsupported format. Use JPG, PNG, or WebP.");
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
      setError("Failed to load image. The file may be corrupted.");
    };
    img.src = url;
  }, [cleanup]);

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

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-text-tertiary" aria-label="Breadcrumb">
        <Link href="/en" className="hover:text-text-secondary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/en" className="hover:text-text-secondary">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Image Resizer &amp; Cropper</span>
      </nav>

      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
        Image Resizer &amp; Cropper
      </h1>
      <p className="mt-2 text-text-secondary">
        Crop, resize, rotate, and flip your images. Adjust dimensions in pixels,
        millimeters, centimeters, or inches. All processing happens in your browser.
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
            <p className="text-sm font-medium text-text-primary">Reading file...</p>
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
                <X className="h-4 w-4" /> Change
              </Button>
            </div>

            {/* Crop Editor */}
            <div className="rounded-lg border border-border-default bg-surface-card p-4">
              <h2 className="mb-3 text-sm font-semibold text-text-primary">
                <Crop className="inline h-4 w-4 mr-1" />
                Crop
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
                      Aspect Ratio
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
                      Crop Size
                    </label>
                    <div className="text-xs text-text-tertiary">
                      {crop.width} × {crop.height} px
                    </div>
                  </div>

                  {/* Rotate & Flip */}
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-text-secondary">
                      Rotate &amp; Flip
                    </label>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setRotation((rotation + 90) % 360)}
                        className="rounded-md border border-border-default p-2 hover:bg-surface-hover"
                        title="Rotate 90° clockwise"
                        aria-label="Rotate 90 degrees clockwise"
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
                        title="Flip horizontal"
                        aria-label="Flip horizontal"
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
                        title="Flip vertical"
                        aria-label="Flip vertical"
                      >
                        <FlipVertical className="h-4 w-4" />
                      </button>
                      <button
                        onClick={resetCrop}
                        className="rounded-md border border-border-default p-2 text-text-secondary hover:bg-surface-hover"
                        title="Reset crop"
                        aria-label="Reset crop"
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
                Output Dimensions
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
                  <label className="text-xs text-text-secondary">DPI:</label>
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
                  <label className="block mb-1 text-xs text-text-tertiary">Width</label>
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
                  title={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                  aria-label={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                >
                  {lockAspect ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </button>

                <div className="flex-1">
                  <label className="block mb-1 text-xs text-text-tertiary">Height</label>
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
                  <>Original: {formatDimensions(imgWidth, imgHeight)}</>
                ) : (
                  <>At {dpi} DPI, {outWidth}px ≈ {(outWidth / dpi * 25.4).toFixed(1)}mm</>
                )}
              </div>

              {/* Process button */}
              <Button size="lg" className="mt-4 w-full sm:w-auto" onClick={handleProcess}>
                <Maximize className="h-4 w-4" />
                Resize Image
              </Button>
            </div>
          </div>
        )}

        {/* Processing */}
        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-text-primary">Processing...</p>
            <p className="mt-1 text-xs text-text-tertiary">
              Applying crop, resize, and transformations
            </p>
          </div>
        )}

        {/* Done */}
        {appState === "processing-done" && result && (
          <div className="space-y-6">
            <Alert variant="success" title="Image resized successfully!">
              Your image has been processed.
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
                Download Resized Image
              </Button>
              <Button variant="outline" size="lg" onClick={handleChangeFile}>
                <RotateCcw className="h-4 w-4" />
                Process Another File
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
            <p className="mt-2 text-sm font-medium">Download started</p>
            <Button variant="outline" className="mt-4" onClick={handleChangeFile}>Process Another</Button>
          </div>
        )}
      </section>

      {/* Privacy notice */}
      <div className="mt-8 rounded-lg border border-info-100 bg-info-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-info-600" />
          <div className="text-sm text-info-700">
            <p className="font-medium">Your files stay private</p>
            <p className="mt-1">All processing happens in your browser. No upload to any server.</p>
          </div>
        </div>
      </div>

      <div className="mt-12"><AdContainer slotHeight="sm" /></div>

      {/* Help content */}
      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">How to use</h2>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary">
          <li>1. Upload your image.</li>
          <li>2. Drag the crop handles or choose a preset aspect ratio.</li>
          <li>3. Set output dimensions in pixels, mm, cm, or inches.</li>
          <li>4. Rotate or flip if needed.</li>
          <li>5. Click &quot;Resize Image&quot; to process.</li>
          <li>6. Download the result.</li>
        </ol>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">Keyboard shortcuts</h3>
        <ul className="mt-2 space-y-1 text-sm text-text-secondary">
          <li><strong>Arrow keys</strong>: Nudge crop by 1 pixel</li>
          <li><strong>Shift + Arrow keys</strong>: Nudge crop by 10 pixels</li>
          <li><strong>Tab</strong>: Focus the crop editor first</li>
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">FAQ</h3>
        <dl className="mt-2 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-text-primary">What DPI should I use?</dt>
            <dd className="text-text-secondary">
              For digital uploads, DPI is typically ignored — websites care about
              pixel dimensions. Use 96 DPI for screen display or 300 DPI for print.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">Will quality be lost?</dt>
            <dd className="text-text-secondary">
              Downscaling (making smaller) generally preserves quality. Upscaling
              (making larger) may reduce sharpness.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Related tools</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "Image Compressor", href: "/en/tools/image-compressor" },
            { label: "Format Converter", href: "/en/tools/image-converter" },
            { label: "Signature Processor", href: "/en/tools/signature-resizer" },
            { label: "DPI Calculator", href: "/en/tools/dpi-calculator" },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover">
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs text-text-tertiary">
        Last updated: {new Date().toISOString().split("T")[0]}
      </p>
    </div>
  );
}
