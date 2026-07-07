/**
 * PDF split, extract, and rotate module.
 * Uses pdf-lib for all operations.
 * All processing happens in the browser — no upload to any server.
 */

import { PDFDocument, degrees } from "pdf-lib";

// ============================================================
// Types
// ============================================================

export type RotationAngle = 0 | 90 | 180 | 270;

export interface SplitOptions {
  /** Extract specific pages (1-based). Overrides range. */
  extractPages?: number[];
  /** Extract a range of pages (1-based, inclusive). */
  range?: { start: number; end: number };
  /** Remove specific pages (1-based). Applied after extraction. */
  removePages?: number[];
  /** Rotate specific pages: { [pageNumber]: degrees } */
  rotations?: Record<number, RotationAngle>;
  signal?: AbortSignal;
}

export interface SplitResult {
  blob: Blob;
  sizeBytes: number;
  pageCount: number;
  /** Pages that were kept (1-based) */
  keptPages: number[];
  durationMs: number;
}

// ============================================================
// Core split/extract
// ============================================================

/**
 * Extract, remove, and/or rotate pages from a PDF.
 *
 * Process:
 * 1. If extractPages specified → only those pages are kept
 * 2. If range specified → only pages in range are kept
 * 3. If removePages specified → those pages are removed from the kept set
 * 4. If rotations specified → rotate specified pages
 */
export async function splitPdf(
  file: File,
  options: SplitOptions
): Promise<SplitResult> {
  const startTime = performance.now();
  const { extractPages, range, removePages, rotations, signal } = options;

  // Load source PDF
  const buffer = await file.arrayBuffer();
  const sourceDoc = await PDFDocument.load(buffer, {
    ignoreEncryption: true,
  });

  const totalPages = sourceDoc.getPageCount();

  // Determine which pages to keep (0-based indices)
  let keepIndices: number[];

  if (extractPages && extractPages.length > 0) {
    // Keep only explicitly listed pages
    keepIndices = extractPages
      .filter((p) => p >= 1 && p <= totalPages)
      .map((p) => p - 1);
  } else if (range) {
    // Keep pages in range
    const start = Math.max(1, range.start);
    const end = Math.min(totalPages, range.end);
    keepIndices = [];
    for (let i = start - 1; i < end; i++) {
      keepIndices.push(i);
    }
  } else {
    // Keep all pages
    keepIndices = sourceDoc.getPageIndices();
  }

  // Remove pages specified for removal
  if (removePages && removePages.length > 0) {
    const removeSet = new Set(
      removePages.filter((p) => p >= 1 && p <= totalPages).map((p) => p - 1)
    );
    keepIndices = keepIndices.filter((i) => !removeSet.has(i));
  }

  if (keepIndices.length === 0) {
    throw new Error("No pages selected. Please select at least one page.");
  }

  if (signal?.aborted) {
    throw new Error("Split cancelled");
  }

  // Create new PDF with kept pages
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(sourceDoc, keepIndices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  // Apply rotations (now on the new doc, page indices have changed)
  if (rotations) {
    for (const [origPageNum, angle] of Object.entries(rotations)) {
      const origIdx = parseInt(origPageNum) - 1;
      const newIdx = keepIndices.indexOf(origIdx);
      if (newIdx >= 0 && angle !== 0) {
        const page = newDoc.getPage(newIdx);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      }
    }
  }

  if (signal?.aborted) {
    throw new Error("Split cancelled");
  }

  const pdfBytes = await newDoc.save();
  const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });

  return {
    blob,
    sizeBytes: blob.size,
    pageCount: keepIndices.length,
    keptPages: keepIndices.map((i) => i + 1),
    durationMs: Math.round(performance.now() - startTime),
  };
}

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
 * Parse a page range string like "1-5" or "1,3,5" or "1-5,8,10-12".
 * Returns an array of 1-based page numbers.
 */
export function parsePageRange(input: string, totalPages: number): number[] {
  const pages = new Set<number>();

  const parts = input.split(",").map((p) => p.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = Math.max(1, parseInt(startStr, 10) || 1);
      const end = Math.min(totalPages, parseInt(endStr, 10) || totalPages);
      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      const num = parseInt(part, 10);
      if (num >= 1 && num <= totalPages) {
        pages.add(num);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
