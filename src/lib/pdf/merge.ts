/**
 * PDF merge module.
 * Merges multiple PDF files into a single PDF using pdf-lib.
 * All processing happens in the browser — no upload to any server.
 */

import { PDFDocument } from "pdf-lib";

// ============================================================
// Types
// ============================================================

export interface PdfFileInfo {
  file: File;
  pageCount: number | null;
  id: string;
}

export interface MergeResult {
  blob: Blob;
  sizeBytes: number;
  pageCount: number;
  durationMs: number;
}

// ============================================================
// PDF info reading
// ============================================================

/**
 * Get the page count of a PDF file.
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer, {
    ignoreEncryption: true,
  });
  return pdfDoc.getPageCount();
}

/**
 * Read basic info for multiple PDF files in parallel.
 */
export async function readPdfFilesInfo(
  files: File[]
): Promise<PdfFileInfo[]> {
  const results = await Promise.allSettled(
    files.map(async (file, idx) => {
      try {
        const pageCount = await getPdfPageCount(file);
        return {
          file,
          pageCount,
          id: `file-${idx}-${Date.now()}`,
        };
      } catch {
        return {
          file,
          pageCount: null,
          id: `file-${idx}-${Date.now()}`,
        };
      }
    })
  );

  return results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : {
          file: files[0], // fallback, won't happen
          pageCount: null,
          id: "",
        }
  );
}

// ============================================================
// Core merge
// ============================================================

/**
 * Merge multiple PDF files into a single PDF.
 * Preserves page order based on the input files array.
 */
export async function mergePdfs(
  pdfInfos: PdfFileInfo[],
  signal?: AbortSignal
): Promise<MergeResult> {
  const startTime = performance.now();

  const mergedDoc = await PDFDocument.create();
  let totalPages = 0;

  for (const info of pdfInfos) {
    if (signal?.aborted) {
      throw new Error("Merge cancelled");
    }

    const buffer = await info.file.arrayBuffer();
    const sourceDoc = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
    });

    const pageCount = sourceDoc.getPageCount();
    const copiedPages = await mergedDoc.copyPages(
      sourceDoc,
      sourceDoc.getPageIndices()
    );

    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }

    totalPages += pageCount;
  }

  if (signal?.aborted) {
    throw new Error("Merge cancelled");
  }

  const pdfBytes = await mergedDoc.save();
  const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });

  return {
    blob,
    sizeBytes: blob.size,
    pageCount: totalPages,
    durationMs: Math.round(performance.now() - startTime),
  };
}
