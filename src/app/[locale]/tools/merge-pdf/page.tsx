"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  RotateCcw,
  X,
  CheckCircle2,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Button,
  FileDropzone,
  Alert,
  Progress,
  ErrorState,
  AdContainer,
} from "@/components/ui";
import { mergePdfs, readPdfFilesInfo, type PdfFileInfo } from "@/lib/pdf";
import { formatBytes } from "@/lib/utils";
import { useT, useLocale } from "@/i18n";

type AppState = "initial" | "reading-files" | "files-ready" | "processing" | "processing-done" | "processing-failed";

export default function MergePdfPage() {
  const t = useT();
  const locale = useLocale();
  const [appState, setAppState] = useState<AppState>("initial");
  const [pdfInfos, setPdfInfos] = useState<PdfFileInfo[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; sizeBytes: number; pageCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
  }, []);

  const handleFilesAdded = useCallback(async (newFiles: FileList | File[]) => {
    const pdfFiles = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfFiles.length === 0) return;

    setAppState("reading-files");
    setError(null);

    try {
      const infos = await readPdfFilesInfo(pdfFiles);
      setPdfInfos((prev) => [...prev, ...infos]);
      setAppState("files-ready");
    } catch {
      setError("Failed to read one or more PDF files. They may be corrupted or encrypted.");
      setAppState("processing-failed");
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setPdfInfos((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (next.length === 0) setAppState("initial");
      return next;
    });
  }, []);

  const moveFile = useCallback((id: string, direction: "up" | "down") => {
    setPdfInfos((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }, []);

  const startMerge = useCallback(async () => {
    if (pdfInfos.length < 2) return;

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
      const res = await mergePdfs(pdfInfos, controller.signal);
      clearInterval(progressTimer);
      cleanup();
      resultUrlRef.current = URL.createObjectURL(res.blob);
      setResult(res);
      setProgress(100);
      setAppState("processing-done");
    } catch (err) {
      clearInterval(progressTimer);
      if (err instanceof Error && err.message === "Merge cancelled") return;
      setError(err instanceof Error ? err.message : t("merge.failed"));
      setAppState("processing-failed");
    }
  }, [pdfInfos, cleanup, t]);

  const cancelMerge = useCallback(() => {
    abortRef.current?.abort();
    setAppState("files-ready");
    setProgress(0);
  }, []);

  const downloadResult = useCallback(() => {
    if (!resultUrlRef.current) return;
    const a = document.createElement("a");
    a.href = resultUrlRef.current;
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    cleanup();
    setPdfInfos([]);
    setResult(null);
    setError(null);
    setProgress(0);
    setAppState("initial");
  }, [cleanup]);

  const totalPages = pdfInfos.reduce((sum, info) => sum + (info.pageCount || 0), 0);

  return (
    <div className="mx-auto max-w-3xl" translate="no">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.tools")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">{t("merge.title")}</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t("merge.title")}</h1>
      <p className="mt-2 text-text-secondary">
        {t("merge.desc")}
      </p>

      <section className="mt-8 space-y-6">
        {(appState === "initial" || appState === "files-ready") && (
          <>
            {pdfInfos.length > 0 && (
              <div className="rounded-lg border border-border-default bg-surface-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-text-primary">
                    {pdfInfos.length} file{pdfInfos.length !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""} total
                  </h2>
                </div>
                <ul className="space-y-2">
                  {pdfInfos.map((info, idx) => (
                    <li key={info.id} className="flex items-center gap-2 rounded border border-border-default bg-surface-secondary/50 px-3 py-2">
                      <span className="text-xs text-text-tertiary w-6">{idx + 1}.</span>
                      <FileText className="h-4 w-4 shrink-0 text-text-tertiary" />
                      <span className="flex-1 truncate text-sm text-text-primary">{info.file.name}</span>
                      <span className="text-xs text-text-tertiary">
                        {info.pageCount !== null ? `${info.pageCount} p.` : "?"} · {formatBytes(info.file.size)}
                      </span>
                      <button type="button" onClick={() => moveFile(info.id, "up")} disabled={idx === 0}
                        className="rounded p-1 text-text-tertiary hover:text-text-secondary disabled:opacity-30" aria-label={t("merge.moveUp")}>
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => moveFile(info.id, "down")} disabled={idx === pdfInfos.length - 1}
                        className="rounded p-1 text-text-tertiary hover:text-text-secondary disabled:opacity-30" aria-label={t("merge.moveDown")}>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => removeFile(info.id)}
                        className="rounded p-1 text-text-tertiary hover:text-text-secondary" aria-label={t("button.remove")}>
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                {pdfInfos.length >= 2 && (
                  <div className="mt-4">
                    <Button variant="primary" size="lg" onClick={startMerge}>
                      <FileText className="mr-2 h-4 w-4" /> {t("merge.mergeBtn").replace("{n}", String(pdfInfos.length))}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <FileDropzone
              onFileSelect={(f) => handleFilesAdded([f])}
              accept=".pdf"
              maxSize={30 * 1024 * 1024}
            />
          </>
        )}

        {appState === "reading-files" && (
          <div className="flex items-center gap-3 rounded-lg border border-border-default bg-surface-card p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <span className="text-sm text-text-secondary">{t("merge.reading")}</span>
          </div>
        )}

        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <Progress value={Math.round(progress)} label={t("merge.merging")} />
            <div className="mt-4 text-center"><Button variant="ghost" size="sm" onClick={cancelMerge}>{t("button.cancel")}</Button></div>
          </div>
        )}

        {appState === "processing-failed" && (
          <ErrorState title={t("merge.failed")} message={error || "An unexpected error occurred."} onRetry={startMerge} />
        )}

        {appState === "processing-done" && result && (
          <div className="space-y-6">
            <Alert variant="success" title={t("merge.success")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {result.pageCount} pages · {formatBytes(result.sizeBytes)}
            </Alert>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" onClick={downloadResult}>
                <Download className="mr-2 h-4 w-4" /> {t("merge.downloadMerged")}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" /> {t("button.mergeMore")}
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
        <h2 className="text-lg font-semibold text-text-primary">{t("merge.aboutTitle")}</h2>
        <div className="mt-4 space-y-4 text-sm text-text-secondary">
          <div>
            <h3 className="font-medium text-text-primary">{t("merge.about1Q")}</h3>
            <p className="mt-1">{t("merge.about1A")}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">{t("merge.about2Q")}</h3>
            <p className="mt-1">{t("merge.about2A")}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">{t("related.title")}</h2>
        <ul className="mt-3 space-y-1.5">
          <li><Link href={`/${locale}/tools/split-pdf`} className="text-sm text-text-link hover:underline">Split & Extract PDF</Link></li>
          <li><Link href={`/${locale}/tools/image-to-pdf`} className="text-sm text-text-link hover:underline">Image to PDF</Link></li>
          <li><Link href={`/${locale}/tools/image-compressor`} className="text-sm text-text-link hover:underline">Image Compressor</Link></li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}</p>
    </div>
  );
}
