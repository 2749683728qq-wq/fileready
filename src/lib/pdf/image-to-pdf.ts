/**
 * Image to PDF conversion module.
 * Converts one or more images to a PDF document using pdf-lib.
 * All processing happens in the browser — no upload to any server.
 */

import { PDFDocument, PageSizes } from "pdf-lib";
import { loadImageFromFile, createCanvas, getCanvasContext } from "@/lib/image/canvas";
import { ImageError } from "@/lib/image/compress";

// ============================================================
// Types
// ============================================================

export type PageSize = "A4" | "Letter" | "Fit";
export type PageOrientation = "portrait" | "landscape";

export interface ImageToPdfOptions {
  /** Page size: A4, Letter, or fit to image */
  pageSize: PageSize;
  /** Page orientation */
  orientation: PageOrientation;
  /** Margin in points (1 point = 1/72 inch) */
  margin: number;
  /** Image fit mode */
  imageFit: "contain" | "cover" | "fill";
  signal?: AbortSignal;
}

export interface ImageToPdfResult {
  blob: Blob;
  sizeBytes: number;
  pageCount: number;
  durationMs: number;
}

// ============================================================
// Page size helpers
// ============================================================

/** Get page dimensions in points (1 point = 1/72 inch) */
export function getPageDimensions(
  size: PageSize,
  orientation: PageOrientation
): { width: number; height: number } {
  let width: number;
  let height: number;

  switch (size) {
    case "A4":
      width = PageSizes.A4[0];
      height = PageSizes.A4[1];
      break;
    case "Letter":
      width = PageSizes.Letter[0];
      height = PageSizes.Letter[1];
      break;
    case "Fit":
      // Will be determined per-image
      return { width: 0, height: 0 };
    default:
      width = PageSizes.A4[0];
      height = PageSizes.A4[1];
  }

  // Swap for landscape
  if (orientation === "landscape") {
    return { width: height, height: width };
  }

  return { width, height };
}

// ============================================================
// Core conversion
// ============================================================

/**
 * Convert one or more image files to a single PDF.
 *
 * For "Fit" page size, each image gets its own page size matching
 * the image dimensions (at 72 DPI).
 */
export async function imagesToPdf(
  files: File[],
  options: ImageToPdfOptions
): Promise<ImageToPdfResult> {
  const startTime = performance.now();
  const { pageSize, orientation, margin, imageFit, signal } = options;

  if (files.length === 0) {
    throw new ImageError("No files provided", "no_files");
  }

  // Create PDF document
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    if (signal?.aborted) {
      throw new ImageError("Conversion cancelled", "cancelled");
    }

    const file = files[i];
    const { img, objectUrl } = await loadImageFromFile(file);

    try {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      // Determine page dimensions
      let pageWidth: number;
      let pageHeight: number;

      if (pageSize === "Fit") {
        // 72 DPI: 1 pixel = 1 point
        pageWidth = imgWidth;
        pageHeight = imgHeight;

        if (orientation === "landscape" && imgHeight > imgWidth) {
          // Force landscape even for portrait images
          pageWidth = imgHeight;
          pageHeight = imgWidth;
        }
      } else {
        const dims = getPageDimensions(pageSize, orientation);
        pageWidth = dims.width;
        pageHeight = dims.height;
      }

      // Add page
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Calculate image placement within page
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      let drawWidth: number;
      let drawHeight: number;
      let x: number;
      let y: number;

      if (imageFit === "fill" || pageSize === "Fit") {
        drawWidth = availableWidth;
        drawHeight = availableHeight;
        x = margin;
        y = margin;
      } else {
        // "contain" or "cover"
        const imgRatio = imgWidth / imgHeight;
        const pageRatio = availableWidth / availableHeight;

        if (imageFit === "contain") {
          // Fit entire image within available area
          if (imgRatio > pageRatio) {
            drawWidth = availableWidth;
            drawHeight = availableWidth / imgRatio;
          } else {
            drawHeight = availableHeight;
            drawWidth = availableHeight * imgRatio;
          }
        } else {
          // "cover" - fill available area, crop excess
          if (imgRatio > pageRatio) {
            drawHeight = availableHeight;
            drawWidth = availableHeight * imgRatio;
          } else {
            drawWidth = availableWidth;
            drawHeight = availableWidth / imgRatio;
          }
        }

        // Center the image
        x = margin + (availableWidth - drawWidth) / 2;
        y = margin + (availableHeight - drawHeight) / 2;
      }

      // Convert image to PNG bytes for embedding
      const pngBytes = await imageToPngBytes(img);

      // Embed image in PDF
      const embeddedImage = await pdfDoc.embedPng(pngBytes);

      // PDF coordinates: origin at bottom-left
      // Our y is from top, so flip: PDF y = pageHeight - y - drawHeight
      const pdfY = pageHeight - y - drawHeight;

      page.drawImage(embeddedImage, {
        x,
        y: pdfY,
        width: drawWidth,
        height: drawHeight,
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  if (signal?.aborted) {
    throw new ImageError("Conversion cancelled", "cancelled");
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });

  return {
    blob,
    sizeBytes: blob.size,
    pageCount: files.length,
    durationMs: Math.round(performance.now() - startTime),
  };
}

/**
 * Convert an HTMLImageElement to PNG bytes for PDF embedding.
 */
async function imageToPngBytes(img: HTMLImageElement): Promise<Uint8Array> {
  const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
  if (canvas instanceof HTMLCanvasElement) {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  }

  const ctx = getCanvasContext(canvas);
  if (!ctx) {
    throw new ImageError("Failed to create canvas context", "canvas_error");
  }

  ctx.drawImage(img, 0, 0);

  // Export as PNG blob, then convert to bytes
  if (canvas instanceof OffscreenCanvas) {
    const blob = await canvas.convertToBlob({ type: "image/png" });
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new ImageError("Failed to encode image", "encode_failed"));
        return;
      }
      const buffer = await blob.arrayBuffer();
      resolve(new Uint8Array(buffer));
    }, "image/png");
  });
}
