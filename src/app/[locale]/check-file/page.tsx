"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  FileImage,
  Info,
  ArrowRight,
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
  BeforeAfterComparison,
  AdContainer,
} from "@/components/ui";
import { formatBytes, formatDimensions } from "@/lib/utils";

// --- Mock data for static prototype ---
type AppState =
  | "initial"
  | "file-selected"
  | "checking"
  | "results"
  | "error";

const mockFileInfo = {
  name: "passport-photo.jpg",
  size: 2456789,
  type: "image/jpeg",
  width: 1200,
  height: 1600,
  dpi: 72,
  exifOrientation: "Normal",
  hasMetadata: true,
};

const mockResults = [
  { label: "File format (JPEG)", status: "pass" as const, detail: "Required: JPG/JPEG" },
  { label: "File extension (.jpg)", status: "pass" as const, detail: "Required: .jpg/.jpeg" },
  { label: "File size", status: "fail" as const, detail: "2.3 MB > 500 KB max" },
  { label: "Image width", status: "pass" as const, detail: "1200 px (max 2000 px)" },
  { label: "Image height", status: "pass" as const, detail: "1600 px (max 2000 px)" },
  { label: "Aspect ratio", status: "warning" as const, detail: "3:4 (recommended 3:4)" },
  { label: "Orientation", status: "pass" as const, detail: "Portrait (required)" },
  { label: "DPI information", status: "unknown" as const, detail: "72 DPI — digital uploads typically ignore DPI" },
  { label: "Location metadata", status: "warning" as const, detail: "GPS data found — consider removing" },
];

const comparisonData = [
  { label: "File size", before: "2.3 MB", after: "—", improved: false },
  { label: "Dimensions", before: "1200 × 1600 px", after: "—", improved: false },
  { label: "Format", before: "JPEG", after: "—", improved: false },
];

export default function CheckFilePage() {
  const [appState, setAppState] = useState<AppState>("initial");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    setAppState("file-selected");
  };

  const handleStartCheck = () => {
    setAppState("checking");
    // Simulate checking delay
    setTimeout(() => setAppState("results"), 1500);
  };

  const handleReset = () => {
    setFileName(null);
    setAppState("initial");
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-text-tertiary" aria-label="Breadcrumb">
        <Link href="/en" className="hover:text-text-secondary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">File Compliance Checker</span>
      </nav>

      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
        File Compliance Checker
      </h1>
      <p className="mt-2 text-text-secondary">
        Upload your file and set your requirements. We&apos;ll check if your file
        meets the specifications and tell you exactly what needs to be fixed.
      </p>

      {/* Requirements Section */}
      <section className="mt-8 rounded-lg border border-border-default bg-surface-card p-5">
        <h2 className="mb-4 text-base font-semibold text-text-primary">
          Upload Requirements
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Allowed file type"
            options={[
              { value: "image", label: "Images only (JPG, PNG, WebP)" },
              { value: "pdf", label: "PDF only" },
              { value: "image-pdf", label: "Images and PDF" },
            ]}
            defaultValue="image"
          />
          <Input
            label="Maximum file size"
            type="number"
            defaultValue="500"
            hint="in KB"
          />
          <Input
            label="Maximum width"
            type="number"
            defaultValue="2000"
            hint="in pixels"
          />
          <Input
            label="Maximum height"
            type="number"
            defaultValue="2000"
            hint="in pixels"
          />
          <Select
            label="Orientation"
            options={[
              { value: "any", label: "Any orientation" },
              { value: "portrait", label: "Portrait only" },
              { value: "landscape", label: "Landscape only" },
            ]}
            defaultValue="portrait"
          />
          <Select
            label="Aspect ratio"
            options={[
              { value: "any", label: "Any ratio" },
              { value: "3:4", label: "3:4" },
              { value: "4:3", label: "4:3" },
              { value: "1:1", label: "1:1 (Square)" },
              { value: "custom", label: "Custom" },
            ]}
            defaultValue="3:4"
          />
        </div>
        <div className="mt-4 space-y-2">
          <Checkbox
            label="Filename must not contain spaces"
            defaultChecked
          />
          <Checkbox
            label="Filename must not contain special characters"
            defaultChecked
          />
        </div>
      </section>

      {/* File Upload Area */}
      <section className="mt-6">
        {appState === "initial" && (
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            maxSize={30 * 1024 * 1024}
          />
        )}

        {/* File selected */}
        {appState === "file-selected" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                  <FileImage className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {fileName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {formatBytes(mockFileInfo.size)} ·{" "}
                    {formatDimensions(mockFileInfo.width, mockFileInfo.height)} ·{" "}
                    JPEG
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Remove
                </Button>
                <Button size="sm" onClick={handleStartCheck}>
                  <FileCheck className="h-4 w-4" />
                  Check File
                </Button>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-tertiary">
              Files are processed in your browser and are not uploaded to any server.
            </p>
          </div>
        )}

        {/* Checking */}
        {appState === "checking" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-text-primary">
              Checking your file...
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              Analyzing format, dimensions, size, and metadata
            </p>
          </div>
        )}

        {/* Results */}
        {appState === "results" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="rounded-lg border border-border-default bg-surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                    <FileImage className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{fileName}</p>
                    <p className="text-xs text-text-tertiary">
                      {formatBytes(mockFileInfo.size)} ·{" "}
                      {formatDimensions(mockFileInfo.width, mockFileInfo.height)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Change file
                </Button>
              </div>

              <Alert variant="warning" title="2 issues found">
                Your file does not meet all requirements. See details below for
                recommended fixes.
              </Alert>
            </div>

            {/* Detailed Results */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-text-primary">
                Detailed Check Results
              </h3>
              <ResultSummary items={mockResults} />
            </div>

            {/* Before/After (placeholder for when processing is done) */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-text-primary">
                File Summary
              </h3>
              <BeforeAfterComparison rows={comparisonData} />
            </div>

            {/* Recommended Actions */}
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-primary-800">
                <Info className="h-4 w-4" />
                Recommended Actions
              </h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2 text-sm text-primary-700">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>File too large:</strong> Compress to 500 KB or less
                    using our{" "}
                    <Link href="/en/tools/image-compressor" className="underline">
                      Image Compressor
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-primary-700">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>GPS metadata found:</strong> Remove location data
                    using{" "}
                    <Link
                      href="/en/tools/remove-image-metadata"
                      className="underline"
                    >
                      Metadata Remover
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </div>

            {/* Processing notice */}
            <Alert variant="info">
              <p>
                <strong>Important:</strong> These tools can only inspect and
                process readable file properties. Final requirements are
                determined by the institution or platform receiving your files.
                This site is not affiliated with any government agency.
              </p>
            </Alert>
          </div>
        )}

        {/* Error State */}
        {appState === "error" && (
          <ErrorState
            message="We couldn't read this file. It may be corrupted or in an unsupported format."
            onRetry={handleReset}
          />
        )}
      </section>

      {/* Ad space — away from upload area */}
      <div className="mt-12">
        <AdContainer slotHeight="sm" />
      </div>

      {/* Help content below */}
      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          How to use this tool
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary">
          <li>1. Set your upload requirements (format, size, dimensions, etc.).</li>
          <li>2. Upload or drag and drop your file.</li>
          <li>3. Click &quot;Check File&quot; to run the compliance check.</li>
          <li>4. Review the results — each item shows Passed, Failed, or Needs Review.</li>
          <li>5. Use the recommended tools to fix any issues.</li>
          <li>6. Re-check your file after making changes.</li>
        </ol>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">
          Common issues and solutions
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
          <li>
            <strong>File too large:</strong> Use the Image Compressor to reduce file size.
          </li>
          <li>
            <strong>Wrong dimensions:</strong> Use the Image Resizer to adjust width and height.
          </li>
          <li>
            <strong>Unsupported format:</strong> Use the Format Converter to change file type.
          </li>
          <li>
            <strong>Metadata privacy:</strong> Use Metadata Remover to strip EXIF and GPS data.
          </li>
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-text-primary">FAQ</h3>
        <dl className="mt-2 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-text-primary">
              Are my files uploaded to a server?
            </dt>
            <dd className="text-text-secondary">
              No. All checks and processing happen entirely in your browser.
              Your files never leave your device.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">
              What does &quot;Cannot determine&quot; mean?
            </dt>
            <dd className="text-text-secondary">
              Some file properties (like DPI for digital images) cannot be
              reliably determined or may not apply to online uploads. These
              items are marked for your awareness.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">
              Does passing all checks guarantee my file will be accepted?
            </dt>
            <dd className="text-text-secondary">
              No. Our tools check technical file properties only. Final
              acceptance depends on the receiving institution&apos;s review.
              Always verify requirements with the official source.
            </dd>
          </div>
        </dl>
      </section>

      {/* Related tools */}
      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Related tools</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "Image Compressor", href: "/en/tools/image-compressor" },
            { label: "Image Resizer", href: "/en/tools/image-resizer" },
            { label: "Format Converter", href: "/en/tools/image-converter" },
            { label: "Metadata Remover", href: "/en/tools/remove-image-metadata" },
          ].map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              {tool.label}
            </a>
          ))}
        </div>
      </section>

      {/* Last updated */}
      <p className="mt-8 text-xs text-text-tertiary">
        Last updated: {new Date().toISOString().split("T")[0]}
      </p>
    </div>
  );
}
