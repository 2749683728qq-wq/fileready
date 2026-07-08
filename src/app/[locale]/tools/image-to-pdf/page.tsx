"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FileImage,
  Download,
  RotateCcw,
  X,
  CheckCircle2,
  ShieldCheck,
  FileText,
  GripVertical,
} from "lucide-react";
import {
  Button,
  FileDropzone,
  Alert,
  Progress,
  ErrorState,
  Select,
  AdContainer,
} from "@/components/ui";
import { imagesToPdf } from "@/lib/pdf";
import type { PageSize, PageOrientation } from "@/lib/pdf";
import { isSupportedImage } from "@/lib/image";
import { formatBytes } from "@/lib/utils";
import { useT, useLocale } from "@/i18n";

type AppState =
  | "initial"
  | "files-ready"
  | "processing"
  | "processing-done"
  | "processing-failed";

interface FileEntry {
  file: File;
  id: string;
}

export default function ImageToPdfPage() {
  const t = useT();
  const locale = useLocale();
  const [appState, setAppState] = useState<AppState>("initial");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [imageFit, setImageFit] = useState<"contain" | "cover" | "fill">("contain");
  const [margin, setMargin] = useState(20);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; sizeBytes: number; pageCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const nextIdRef = useRef(0);

  const cleanup = useCallback(() => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  }, []);

  const handleFilesAdded = useCallback((newFiles: FileList | File[]) => {
    const fileArr = Array.from(newFiles);
    const validFiles = fileArr.filter((f) => isSupportedImage(f));
    if (validFiles.length === 0) return;

    setFiles((prev) => [
      ...prev,
      ...validFiles.map((f) => ({
        file: f,
        id: `img-${nextIdRef.current++}-${Date.now()}`,
      })),
    ]);
    setAppState("files-ready");
    setResult(null);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (next.length === 0) setAppState("initial");
      return next;
    });
  }, []);

  const moveFile = useCallback((id: string, direction: "up" | "down") => {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }, []);

  const startConversion = useCallback(async () => {
    if (files.length === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAppState("processing");
    setProgress(0);
    setError(null);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 15, 90));
    }, 300);

    try {
      const res = await imagesToPdf(
        files.map((f) => f.file),
        { pageSize, orientation, margin, imageFit, signal: controller.signal }
      );

      clearInterval(progressTimer);
      cleanup();
      resultUrlRef.current = URL.createObjectURL(res.blob);
      setResult(res);
      setProgress(100);
      setAppState("processing-done");
    } catch (err) {
      clearInterval(progressTimer);
      if (err instanceof Error && err.message === "Conversion cancelled") return;
      setError(err instanceof Error ? err.message : t("img2pdf.failed"));
      setAppState("processing-failed");
    }
  }, [files, pageSize, orientation, margin, imageFit, cleanup, t]);

  const cancelConversion = useCallback(() => {
    abortRef.current?.abort();
    setAppState("files-ready");
    setProgress(0);
  }, []);

  const downloadResult = useCallback(() => {
    if (!resultUrlRef.current) return;
    const a = document.createElement("a");
    a.href = resultUrlRef.current;
    a.download = "images-to-pdf.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    cleanup();
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
    setAppState("initial");
  }, [cleanup]);

  return (
    <div className="mx-auto max-w-3xl" translate="no">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.tools")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">{t("img2pdf.title")}</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t("img2pdf.title")}</h1>
      <p className="mt-2 text-text-secondary">
        {t("img2pdf.desc")}
      </p>

      <section className="mt-8 space-y-6">
        {(appState === "initial" || appState === "files-ready") && (
          <>
            {/* Settings */}
            <div className="rounded-lg border border-border-default bg-surface-card p-5">
              <h2 className="mb-4 text-base font-semibold text-text-primary">{t("img2pdf.pageSettings")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label={t("img2pdf.pageSize")}
                  options={[
                    { value: "A4", label: "A4" },
                    { value: "Letter", label: "Letter" },
                    { value: "Fit", label: t("img2pdf.fitToImage") },
                  ]}
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSize)}
                />
                <Select
                  label={t("img2pdf.orientation")}
                  options={[
                    { value: "portrait", label: t("img2pdf.portrait") },
                    { value: "landscape", label: t("img2pdf.landscape") },
                  ]}
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as PageOrientation)}
                />
                <Select
                  label={t("img2pdf.imageFit")}
                  options={[
                    { value: "contain", label: t("img2pdf.contain") },
                    { value: "cover", label: t("img2pdf.cover") },
                    { value: "fill", label: t("img2pdf.fill") },
                  ]}
                  value={imageFit}
                  onChange={(e) => setImageFit(e.target.value as "contain" | "cover" | "fill")}
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary">
                    {t("img2pdf.marginPt").replace("{n}", String(margin))}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={72}
                    step={4}
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                    className="w-full accent-primary-600"
                  />
                  <p className="text-xs text-text-tertiary">{t("img2pdf.ptHint")}</p>
                </div>
              </div>
            </div>

            {/* File list or upload */}
            {files.length > 0 && (
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <h2 className="mb-3 text-base font-semibold text-text-primary">
                  {files.length} image{files.length !== 1 ? "s" : ""}
                </h2>
                <ul className="space-y-2">
                  {files.map((entry, idx) => (
                    <li key={entry.id} className="flex items-center gap-2 rounded border border-border-default bg-surface-secondary/50 px-3 py-2">
                      <span className="text-xs text-text-tertiary w-6">{idx + 1}.</span>
                      <FileImage className="h-4 w-4 shrink-0 text-text-tertiary" />
                      <span className="flex-1 truncate text-sm text-text-primary">{entry.file.name}</span>
                      <span className="text-xs text-text-tertiary">{formatBytes(entry.file.size)}</span>
                      <button
                        type="button"
                        onClick={() => moveFile(entry.id, "up")}
                        disabled={idx === 0}
                        className="rounded p-1 text-text-tertiary hover:text-text-secondary disabled:opacity-30"
                        aria-label={t("img2pdf.moveUp")}
                      >
                        <GripVertical className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(entry.id)}
                        className="rounded p-1 text-text-tertiary hover:text-text-secondary"
                        aria-label={t("button.remove")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <FileDropzone
                    onFileSelect={(f) => handleFilesAdded([f])}
                    accept="image/jpeg,image/png,image/webp"
                    maxSize={20 * 1024 * 1024}
                    className="flex-1"
                  />
                  <Button variant="primary" size="lg" onClick={startConversion}>
                    <FileText className="mr-2 h-4 w-4" />
                    {t("img2pdf.convert")}
                  </Button>
                </div>
              </div>
            )}

            {files.length === 0 && (
              <FileDropzone
                onFileSelect={(f) => handleFilesAdded([f])}
                accept="image/jpeg,image/png,image/webp"
                maxSize={20 * 1024 * 1024}
              />
            )}
          </>
        )}

        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <Progress value={Math.round(progress)} label={t("img2pdf.creating")} />
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={cancelConversion}>{t("button.cancel")}</Button>
            </div>
          </div>
        )}

        {appState === "processing-failed" && (
          <ErrorState title={t("img2pdf.failed")} message={error || t("error.unexpectedConvert")} onRetry={startConversion} />
        )}

        {appState === "processing-done" && result && (
          <div className="space-y-6">
            <Alert variant="success" title={t("img2pdf.success")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {result.pageCount} page{result.pageCount !== 1 ? "s" : ""} · {formatBytes(result.sizeBytes)}
            </Alert>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" onClick={downloadResult}>
                <Download className="mr-2 h-4 w-4" /> {t("img2pdf.downloadPdf")}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" /> {t("img2pdf.convertMore")}
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-12 rounded-lg border border-success-100 bg-success-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{t("privacy.staysOnDevice")}</h3>
            <p className="mt-1 text-xs text-text-secondary">{t("privacy.allLocal")}</p>
          </div>
        </div>
      </section>

      <div className="mt-12"><AdContainer slotHeight="sm" /></div>

      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">{t("img2pdf.aboutTitle")}</h2>
        <div className="mt-4 space-y-4 text-sm text-text-secondary">
          <div>
            <h3 className="font-medium text-text-primary">{t("img2pdf.about1Q")}</h3>
            <p className="mt-1">{t("img2pdf.about1A")}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">{t("img2pdf.about2Q")}</h3>
            <p className="mt-1">{t("img2pdf.about2A")}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">{t("related.title")}</h2>
        <ul className="mt-3 space-y-1.5">
          <li><Link href={`/${locale}/tools/merge-pdf`} className="text-sm text-text-link hover:underline">Merge PDFs</Link></li>
          <li><Link href={`/${locale}/tools/split-pdf`} className="text-sm text-text-link hover:underline">Split & Extract PDF</Link></li>
          <li><Link href={`/${locale}/tools/image-compressor`} className="text-sm text-text-link hover:underline">Image Compressor</Link></li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}</p>
    </div>
  );
}
