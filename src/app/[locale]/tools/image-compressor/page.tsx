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

export default function ImageCompressorPage() {
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

  return (
    <div className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-text-tertiary" aria-label="Breadcrumb">
        <Link href="/en" className="hover:text-text-secondary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/en" className="hover:text-text-secondary">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Image Compressor</span>
      </nav>

      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
        Image Compressor
      </h1>
      <p className="mt-2 text-text-secondary">
        Compress JPG, PNG, and WebP images to a target file size. Processing
        happens entirely in your browser — your files are never uploaded.
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
            <p className="text-sm font-medium text-text-primary">Reading file...</p>
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
                        {meta.hasTransparency && " · Transparency"}
                        {meta.dpi && ` · ${meta.dpi} DPI`}
                      </p>
                    </div>
                  </div>
                  {appState === "file-ready" && (
                    <Button variant="ghost" size="sm" onClick={changeFile}>
                      <X className="h-4 w-4" />
                      Change
                    </Button>
                  )}
                </div>

                {/* Already small enough? */}
                {meta.sizeBytes <= targetSizeBytes && appState === "file-ready" && (
                  <Alert variant="info" className="mt-3">
                    This file is already smaller than the target size. No
                    compression needed. You can still compress to a smaller
                    target if needed.
                  </Alert>
                )}
              </div>
            )}

            {/* Target size selector */}
            {appState === "file-ready" && (
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <h2 className="mb-3 text-sm font-semibold text-text-primary">
                  Target file size
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {TARGET_SIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.bytes}
                      onClick={() => setTargetSize(preset.bytes)}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        targetSizeBytes === preset.bytes
                          ? "bg-primary-600 text-white"
                          : "border border-border-default text-text-secondary hover:bg-surface-hover"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-tertiary">Custom:</span>
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
                  Compress to {formatBytes(targetSizeBytes)} or less
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Processing */}
        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <Progress value={progress} label="Compressing..." className="mb-4" />
            <p className="text-xs text-text-tertiary text-center">
              Finding optimal quality settings... This usually takes a few seconds.
            </p>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" onClick={cancelCompression}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {appState === "processing-cancelled" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-5">
            <Alert variant="warning" title="Compression cancelled">
              Your original file is unchanged. You can adjust settings and try
              again.
            </Alert>
            <div className="mt-4">
              <Button variant="primary" onClick={startCompression}>
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Done! */}
        {appState === "processing-done" && result && meta && (
          <div className="space-y-6">
            {/* Success banner */}
            <Alert variant="success" title="Compression complete!">
              Your image has been compressed from{" "}
              <strong>{formatBytes(meta.sizeBytes)}</strong> to{" "}
              <strong>{formatBytes(result.sizeBytes)}</strong>
              {result.sizeBytes > targetSizeBytes
                ? ` (close to target of ${formatBytes(targetSizeBytes)})`
                : ` (within target of ${formatBytes(targetSizeBytes)})`}
              .
            </Alert>

            {/* Before / After */}
            <BeforeAfterComparison
              rows={[
                {
                  label: "File size",
                  before: formatBytes(meta.sizeBytes),
                  after: formatBytes(result.sizeBytes),
                  improved: true,
                },
                {
                  label: "Dimensions",
                  before: formatDimensions(meta.width, meta.height),
                  after: formatDimensions(result.width, result.height),
                  improved: result.width !== meta.width || result.height !== meta.height,
                },
                {
                  label: "Format",
                  before: meta.format.split("/")[1]?.toUpperCase() || "—",
                  after: result.format.split("/")[1]?.toUpperCase() || "—",
                },
                {
                  label: "Quality level",
                  before: "100%",
                  after: `${result.quality}%`,
                  improved: true,
                },
                {
                  label: "Processing time",
                  before: "—",
                  after: `${(result.durationMs / 1000).toFixed(1)}s`,
                },
              ]}
            />

            {/* Compression ratio */}
            <div className="rounded-lg border border-success-100 bg-success-50 p-4 text-center">
              <p className="text-sm text-success-700">
                Reduced by{" "}
                <strong>
                  {Math.round(
                    ((meta.sizeBytes - result.sizeBytes) / meta.sizeBytes) * 100
                  )}
                  %
                </strong>
                {result.iterations > 1 &&
                  ` after ${result.iterations} quality iterations`}
              </p>
            </div>

            {/* Transparency warning */}
            {meta.hasTransparency && result.format === "image/jpeg" && (
              <Alert variant="warning">
                The original image had transparent areas. JPEG does not support
                transparency — transparent areas have been filled with white.
                Export as PNG to preserve transparency.
              </Alert>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={downloadResult}>
                <Download className="h-5 w-5" />
                Download Compressed Image
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Compress Another File
              </Button>
            </div>
          </div>
        )}

        {/* Download ready */}
        {appState === "download-ready" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-success-600" />
            <p className="mt-2 text-sm font-medium text-text-primary">
              Download started
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              If the download didn&apos;t start,{" "}
              <button onClick={downloadResult} className="text-text-link underline">
                click here
              </button>
              .
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Compress Another File
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
          <Alert variant="error" title="File too large">
            {error}
          </Alert>
        )}

        {appState === "format-unsupported" && (
          <Alert variant="error" title="Unsupported format">
            {error}
            <p className="mt-2">
              Supported formats: JPG, JPEG, PNG, WebP. For HEIC files, please
              convert them first using another tool.
            </p>
          </Alert>
        )}
      </section>

      {/* Processing notice */}
      <div className="mt-8 rounded-lg border border-info-100 bg-info-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-info-600" />
          <div className="text-sm text-info-700">
            <p className="font-medium">Your files stay private</p>
            <p className="mt-1">
              All compression happens directly in your browser. Your images are
              never uploaded to any server. We cannot see, access, or store your
              files.
            </p>
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
          How to compress your image
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary">
          <li>1. Upload or drag and drop your JPG, PNG, or WebP image.</li>
          <li>2. Choose a target size from the presets or enter a custom size in KB.</li>
          <li>3. Click &quot;Compress&quot; — the tool finds the best quality setting automatically.</li>
          <li>4. Review the before-and-after comparison.</li>
          <li>5. Download your compressed image.</li>
        </ol>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">
          What happens during compression?
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
          <li>
            <strong>Quality reduction:</strong> The tool gradually reduces JPEG/WebP
            quality until the file is within the target size.
          </li>
          <li>
            <strong>Dimension reduction (if needed):</strong> If quality alone
            isn&apos;t enough, the image dimensions are slightly reduced.
          </li>
          <li>
            <strong>Smart optimization:</strong> The algorithm finds the best
            balance between file size and visual quality.
          </li>
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">
          Common issues
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
          <li>
            <strong>Can&apos;t reach target size:</strong> Very large images may not
            compress to extremely small targets without significant quality loss.
            Try a larger target size.
          </li>
          <li>
            <strong>Transparency lost:</strong> If you convert a PNG with
            transparency to JPEG, transparent areas become white. Use PNG output
            to keep transparency.
          </li>
          <li>
            <strong>PNG compression limits:</strong> PNG uses lossless
            compression. Size reduction for PNGs is limited compared to JPEG/WebP.
          </li>
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">FAQ</h3>
        <dl className="mt-2 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-text-primary">
              Will compression reduce image quality?
            </dt>
            <dd className="text-text-secondary">
              Yes, some quality reduction is necessary to reduce file size. The
              tool tries to find the best balance. For most online uploads
              (forms, portals, emails), the quality difference is barely
              noticeable.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">
              Why is the result slightly above the target size?
            </dt>
            <dd className="text-text-secondary">
              For some images, the tool may not be able to hit the exact target
              without unacceptable quality loss. The result will be as close as
              possible to your target.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">
              Is my file uploaded to a server?
            </dt>
            <dd className="text-text-secondary">
              No. All processing happens in your browser using the Canvas API.
              Your file never leaves your device.
            </dd>
          </div>
        </dl>
      </section>

      {/* Related tools */}
      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Related tools</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "Image Resizer", href: "/en/tools/image-resizer" },
            { label: "Format Converter", href: "/en/tools/image-converter" },
            { label: "Signature Processor", href: "/en/tools/signature-resizer" },
            { label: "File Compliance Checker", href: "/en/check-file" },
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
        Last updated: {new Date().toISOString().split("T")[0]}
      </p>
    </div>
  );
}
