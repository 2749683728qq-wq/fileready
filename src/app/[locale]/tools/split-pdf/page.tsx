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
  Scissors,
} from "lucide-react";
import {
  Button,
  FileDropzone,
  Alert,
  Progress,
  ErrorState,
  Input,
  RadioGroup,
  AdContainer,
} from "@/components/ui";
import { splitPdf, getPdfPageCount, parsePageRange } from "@/lib/pdf";
import { formatBytes } from "@/lib/utils";
import { useT, useTArray, useLocale } from "@/i18n";

type AppState = "initial" | "reading-file" | "file-ready" | "processing" | "processing-done" | "processing-failed";
type SplitMode = "range" | "extract" | "all";

export default function SplitPdfPage() {
  const t = useT();
  const ta = useTArray();
  const locale = useLocale();
  const [appState, setAppState] = useState<AppState>("initial");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitMode, setSplitMode] = useState<SplitMode>("all");
  const [rangeInput, setRangeInput] = useState("");
  const [removeInput, setRemoveInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; sizeBytes: number; pageCount: number; keptPages: number[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
  }, []);

  const handleFileSelect = useCallback(async (pdfFile: File) => {
    cleanup();
    setAppState("reading-file");
    setError(null);

    try {
      const pages = await getPdfPageCount(pdfFile);
      setFile(pdfFile);
      setFileName(pdfFile.name);
      setTotalPages(pages);
      setRangeInput("");
      setRemoveInput("");
      setSplitMode("all");
      setAppState("file-ready");
    } catch {
      setError("Failed to read PDF. It may be corrupted or encrypted.");
      setAppState("processing-failed");
    }
  }, [cleanup]);

  const startSplit = useCallback(async () => {
    if (!file) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAppState("processing");
    setProgress(0);
    setError(null);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 20, 90));
    }, 250);

    try {
      let extractPages: number[] | undefined;
      let range: { start: number; end: number } | undefined;

      if (splitMode === "extract" && rangeInput) {
        extractPages = parsePageRange(rangeInput, totalPages);
      } else if (splitMode === "range" && rangeInput) {
        const parts = rangeInput.split("-");
        range = { start: parseInt(parts[0], 10) || 1, end: parseInt(parts[1], 10) || totalPages };
      }
      // "all" mode: no extract/range → keeps all pages

      const removePages = removeInput
        ? parsePageRange(removeInput, totalPages)
        : undefined;

      const res = await splitPdf(file, {
        extractPages,
        range,
        removePages,
        signal: controller.signal,
      });

      clearInterval(progressTimer);
      cleanup();
      resultUrlRef.current = URL.createObjectURL(res.blob);
      setResult(res);
      setProgress(100);
      setAppState("processing-done");
    } catch (err) {
      clearInterval(progressTimer);
      if (err instanceof Error && err.message === "Split cancelled") return;
      setError(err instanceof Error ? err.message : t("split.failed"));
      setAppState("processing-failed");
    }
  }, [file, splitMode, rangeInput, removeInput, totalPages, cleanup, t]);

  const cancelSplit = useCallback(() => {
    abortRef.current?.abort();
    setAppState("file-ready");
    setProgress(0);
  }, []);

  const downloadResult = useCallback(() => {
    if (!resultUrlRef.current) return;
    const a = document.createElement("a");
    a.href = resultUrlRef.current;
    a.download = "extracted.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    cleanup();
    setFile(null);
    setFileName(null);
    setTotalPages(0);
    setResult(null);
    setError(null);
    setProgress(0);
    setRangeInput("");
    setRemoveInput("");
    setSplitMode("all");
    setAppState("initial");
  }, [cleanup]);

  const howToItems = ta("split.howToItems");

  return (
    <div className="mx-auto max-w-3xl" translate="no">
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/${locale}`} className="hover:text-text-link">{t("breadcrumb.tools")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">{t("split.title")}</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t("split.title")}</h1>
      <p className="mt-2 text-text-secondary">
        {t("split.desc")}
      </p>

      <section className="mt-8 space-y-6">
        {appState === "initial" && (
          <FileDropzone onFileSelect={handleFileSelect} accept=".pdf" maxSize={30 * 1024 * 1024} />
        )}

        {appState === "reading-file" && (
          <div className="flex items-center gap-3 rounded-lg border border-border-default bg-surface-card p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <span className="text-sm text-text-secondary">{t("split.reading")}</span>
          </div>
        )}

        {appState === "file-ready" && file && (
          <div className="space-y-6">
            {/* File info */}
            <div className="rounded-lg border border-border-default bg-surface-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-8 w-8 text-primary-500" />
                  <div>
                    <h3 className="font-semibold text-text-primary">{fileName}</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {totalPages} page{totalPages !== 1 ? "s" : ""} · {formatBytes(file.size)}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={reset} className="rounded p-1 text-text-tertiary hover:text-text-secondary" aria-label={t("button.remove")}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Split options */}
            <div className="rounded-lg border border-border-default bg-surface-card p-5">
              <h2 className="mb-4 text-base font-semibold text-text-primary">{t("split.extractPages")}</h2>

              <RadioGroup
                label={t("split.mode")}
                name="splitMode"
                value={splitMode}
                onChange={(e) => setSplitMode(e.target.value as SplitMode)}
                options={[
                  { value: "all", label: t("split.allPages"), hint: t("split.removePages") },
                  { value: "range", label: t("split.pageRange"), hint: t("split.rangeHint") },
                  { value: "extract", label: t("split.specificPages"), hint: t("split.pickHint") },
                ]}
              />

              {(splitMode === "range" || splitMode === "extract") && (
                <div className="mt-4">
                  <Input
                    label={splitMode === "range" ? t("split.pageRangeLabel") : t("split.specificPagesLabel")}
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    hint={`PDF has ${totalPages} page${totalPages !== 1 ? "s" : ""}`}
                    placeholder={splitMode === "range" ? `1-${totalPages}` : "1,3,5"}
                  />
                </div>
              )}

              <div className="mt-4">
                <Input
                  label={t("split.removePages")}
                  value={removeInput}
                  onChange={(e) => setRemoveInput(e.target.value)}
                  hint={t("split.removePagesHint")}
                  placeholder={t("split.removePagesPlaceholder")}
                />
              </div>

              <div className="mt-6">
                <Button variant="primary" size="lg" onClick={startSplit}>
                  <Scissors className="mr-2 h-4 w-4" /> {t("split.extract")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {appState === "processing" && (
          <div className="rounded-lg border border-border-default bg-surface-card p-6">
            <Progress value={Math.round(progress)} label={t("split.extracting")} />
            <div className="mt-4 text-center"><Button variant="ghost" size="sm" onClick={cancelSplit}>{t("button.cancel")}</Button></div>
          </div>
        )}

        {appState === "processing-failed" && (
          <ErrorState title={t("split.failed")} message={error || t("error.unexpectedConvert")} onRetry={startSplit} />
        )}

        {appState === "processing-done" && result && (
          <div className="space-y-6">
            <Alert variant="success" title={t("split.success")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {result.pageCount} page{result.pageCount !== 1 ? "s" : ""} kept · {formatBytes(result.sizeBytes)}
              <span className="ml-2 text-xs">(pages {result.keptPages.join(", ")})</span>
            </Alert>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" onClick={downloadResult}>
                <Download className="mr-2 h-4 w-4" /> {t("split.downloadExtracted")}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" /> {t("button.extractMore")}
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
        <h2 className="text-lg font-semibold text-text-primary">{t("split.howToTitle")}</h2>
        <div className="mt-4 space-y-4 text-sm text-text-secondary">
          {howToItems.map((item, idx) => (
            <div key={idx}>
              <h3 className="font-medium text-text-primary">{item}</h3>
              <p className="mt-1">
                {idx === 0
                  ? `Use commas to separate pages and hyphens for ranges. Example: ${"`"}1,3,5-8,12${"`"} extracts pages 1, 3, 5 through 8, and 12.`
                  : t("split.pageNumberNote")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">{t("related.title")}</h2>
        <ul className="mt-3 space-y-1.5">
          <li><Link href={`/${locale}/tools/merge-pdf`} className="text-sm text-text-link hover:underline">Merge PDFs</Link></li>
          <li><Link href={`/${locale}/tools/image-to-pdf`} className="text-sm text-text-link hover:underline">Image to PDF</Link></li>
          <li><Link href={`/${locale}/check-file`} className="text-sm text-text-link hover:underline">File Compliance Checker</Link></li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-text-tertiary">{t("lastUpdated")}</p>
    </div>
  );
}
