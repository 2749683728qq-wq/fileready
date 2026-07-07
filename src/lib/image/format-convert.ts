/**
 * Image format conversion module.
 * Converts between JPEG, PNG, and WebP using Canvas API.
 * All processing happens in the browser — no upload to any server.
 */

import {
  createCanvas,
  getCanvasContext,
  canvasToBlob,
  loadImageFromFile,
} from "./canvas";
import { ImageError, type SupportedFormat } from "./compress";

// ============================================================
// Types
// ============================================================

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export interface ConvertOptions {
  outputFormat: OutputFormat;
  quality: number; // 0.1–1.0, ignored for PNG
  signal?: AbortSignal;
}

export interface ConvertResult {
  blob: Blob;
  sizeBytes: number;
  width: number;
  height: number;
  format: OutputFormat;
  quality: number; // actual quality used (1.0 for PNG)
  durationMs: number;
}

// ============================================================
// Format utilities
// ============================================================

export const OUTPUT_FORMATS: {
  value: OutputFormat;
  label: string;
  extension: string;
}[] = [
  { value: "image/jpeg", label: "JPEG", extension: ".jpg" },
  { value: "image/png", label: "PNG", extension: ".png" },
  { value: "image/webp", label: "WebP", extension: ".webp" },
];

export function getFormatLabel(format: SupportedFormat | OutputFormat): string {
  const entry = OUTPUT_FORMATS.find((f) => f.value === format);
  return entry?.label ?? format;
}

export function getFormatExtension(format: SupportedFormat | OutputFormat): string {
  const entry = OUTPUT_FORMATS.find((f) => f.value === format);
  return entry?.extension ?? ".bin";
}

/**
 * Check if the format supports quality control.
 * PNG is lossless — quality parameter is ignored.
 */
export function formatSupportsQuality(format: OutputFormat): boolean {
  return format !== "image/png";
}

/**
 * Check if the format supports transparency.
 * JPEG does NOT support transparency.
 */
export function formatSupportsTransparency(format: OutputFormat): boolean {
  return format !== "image/jpeg";
}

// ============================================================
// Core conversion
// ============================================================

/**
 * Convert an image file to a different format.
 *
 * Algorithm:
 * 1. Load image via Image element
 * 2. Draw to Canvas at original size
 * 3. If output is JPEG and source has transparency → fill white bg
 * 4. Export via canvasToBlob with target format and quality
 */
export async function convertImage(
  file: File,
  options: ConvertOptions
): Promise<ConvertResult> {
  const startTime = performance.now();
  const { outputFormat, quality, signal } = options;

  // Load image
  const { img, objectUrl } = await loadImageFromFile(file);

  try {
    if (signal?.aborted) {
      throw new ImageError("Conversion cancelled", "cancelled");
    }

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    // Create canvas at original size
    const canvas = createCanvas(width, height);
    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = getCanvasContext(canvas);
    if (!ctx) {
      throw new ImageError("Failed to create canvas context", "canvas_error");
    }

    // White background for JPEG output (no transparency support)
    if (outputFormat === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    if (signal?.aborted) {
      throw new ImageError("Conversion cancelled", "cancelled");
    }

    // Export with target format
    const blob = await canvasToBlob(
      canvas,
      outputFormat,
      outputFormat === "image/png" ? 1.0 : quality
    );

    return {
      blob,
      sizeBytes: blob.size,
      width,
      height,
      format: outputFormat,
      quality: outputFormat === "image/png" ? 1.0 : quality,
      durationMs: Math.round(performance.now() - startTime),
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
