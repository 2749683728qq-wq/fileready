/**
 * Image compression module.
 * Uses Canvas API + binary search on quality to hit target file size.
 * All processing happens in the browser — no upload to any server.
 */

import { renderImageToBlob } from "./canvas";

export type SupportedFormat = "image/jpeg" | "image/png" | "image/webp";
export type CompressionStatus = "idle" | "processing" | "done" | "cancelled" | "error";

export interface ImageMeta {
  file: File;
  width: number;
  height: number;
  format: SupportedFormat;
  sizeBytes: number;
  hasTransparency: boolean;
  hasMetadata: boolean;
  dpi: number | null;
}

export interface CompressionOptions {
  targetSizeBytes: number;
  outputFormat?: SupportedFormat;
  maxWidth?: number;
  maxHeight?: number;
  signal?: AbortSignal;
}

export interface CompressionResult {
  blob: Blob;
  sizeBytes: number;
  width: number;
  height: number;
  format: SupportedFormat;
  quality: number;
  iterations: number;
  durationMs: number;
  originalMeta: ImageMeta;
}

/**
 * Load an image from a File and extract metadata.
 */
export async function loadImage(file: File): Promise<ImageMeta> {
  if (!isSupportedImage(file)) {
    throw new ImageError("Unsupported file format", "format_unsupported");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);
      const format = (file.type || "image/jpeg") as SupportedFormat;

      // Check for transparency (only PNG supports it)
      let hasTransparency = false;
      let hasMetadata = false;
      let dpi: number | null = null;

      if (format === "image/png") {
        hasTransparency = await checkTransparency(img);
      }

      // Try to read EXIF data for DPI
      try {
        const { parse } = await import("exifr");
        const exif = await parse(file, ["XResolution", "YResolution", "GPSLatitude", "GPSLongitude"]);
        if (exif) {
          hasMetadata = true;
          if (exif.XResolution) {
            dpi = Math.round(exif.XResolution);
          }
        }
      } catch {
        // exifr may fail on some files; just skip metadata
      }

      resolve({
        file,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format,
        sizeBytes: file.size,
        hasTransparency,
        hasMetadata,
        dpi,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageError("Failed to load image. The file may be corrupted.", "load_failed"));
    };

    img.src = url;
  });
}

/**
 * Compress an image to target size using binary search on quality.
 * Falls back to dimension reduction if quality alone is insufficient.
 */
export async function compressImage(
  meta: ImageMeta,
  options: CompressionOptions
): Promise<CompressionResult> {
  const startTime = performance.now();
  const { targetSizeBytes, outputFormat, maxWidth, maxHeight, signal } = options;
  const format = outputFormat || meta.format;

  // Check if already small enough
  if (meta.sizeBytes <= targetSizeBytes) {
    const blob = await renderImageToBlob(meta, format, 0.95, 1, 1, signal);
    return {
      blob,
      sizeBytes: blob.size,
      width: meta.width,
      height: meta.height,
      format,
      quality: 0.95,
      iterations: 1,
      durationMs: performance.now() - startTime,
      originalMeta: meta,
    };
  }

  let bestBlob: Blob | null = null;
  let bestResult: { blob: Blob | null; quality: number; scale: number } = { blob: null, quality: 0, scale: 1 };
  let iterations = 0;

  // Phase 1: Try quality reduction only
  let lo = 0.05;
  let hi = 0.95;
  let scale = 1.0;

  for (let pass = 0; pass < 2; pass++) {
    // Reset binary search bounds for each pass
    if (pass === 0) {
      lo = 0.05;
      hi = 0.95;
      scale = 1.0;
    } else {
      // Phase 2: Also reduce dimensions
      lo = 0.1;
      hi = 0.85;
      scale = Math.min(
        maxWidth ? maxWidth / meta.width : 1,
        maxHeight ? maxHeight / meta.height : 1,
        0.9 // Start with 10% reduction
      );
    }

    for (let i = 0; i < 15; i++) {
      if (signal?.aborted) {
        throw new ImageError("Compression cancelled", "cancelled");
      }

      const quality = (lo + hi) / 2;
      iterations++;

      const blob = await renderImageToBlob(meta, format, quality, scale, scale, signal);
      const size = blob.size;

      // Track best result
      if (!bestBlob || Math.abs(size - targetSizeBytes) < Math.abs((bestBlob?.size || Infinity) - targetSizeBytes)) {
        if (bestBlob) URL.revokeObjectURL(URL.createObjectURL(bestBlob));
        bestBlob = blob;
        bestResult = { blob, quality, scale };
      } else {
        URL.revokeObjectURL(URL.createObjectURL(blob));
      }

      if (size <= targetSizeBytes && size > targetSizeBytes * 0.7) {
        // Close enough — stop
        break;
      }

      if (size > targetSizeBytes) {
        hi = quality;
      } else {
        lo = quality;
      }

      // Convergence check
      if (hi - lo < 0.02) break;
    }

    // If we got close enough, stop
    if (bestBlob && bestBlob.size <= targetSizeBytes) {
      break;
    }

    // Phase 2: scale down more aggressively
    scale *= 0.75;
  }

  // Ensure we have a result
  if (!bestBlob) {
    bestBlob = await renderImageToBlob(meta, format, 0.3, scale, scale, signal);
    bestResult = { blob: bestBlob, quality: 0.3, scale };
  }

  const newWidth = Math.round(meta.width * bestResult.scale);
  const newHeight = Math.round(meta.height * bestResult.scale);

  return {
    blob: bestBlob,
    sizeBytes: bestBlob.size,
    width: newWidth,
    height: newHeight,
    format,
    quality: Math.round(bestResult.quality * 100),
    iterations,
    durationMs: Math.round(performance.now() - startTime),
    originalMeta: meta,
  };
}

/**
 * Check if a PNG image has transparent pixels.
 */
async function checkTransparency(img: HTMLImageElement): Promise<boolean> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(img.naturalWidth, 100);
  canvas.height = Math.min(img.naturalHeight, 100);
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

/**
 * Check if a file is a supported image format.
 */
export function isSupportedImage(file: File): boolean {
  const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
  const supportedExts = [".jpg", ".jpeg", ".png", ".webp"];

  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
  return supportedTypes.includes(file.type) || supportedExts.includes(ext);
}

/**
 * Get recommended target sizes for common use cases.
 */
export const TARGET_SIZE_PRESETS = [
  { label: "50 KB", bytes: 50 * 1024 },
  { label: "100 KB", bytes: 100 * 1024 },
  { label: "200 KB", bytes: 200 * 1024 },
  { label: "500 KB", bytes: 500 * 1024 },
  { label: "1 MB", bytes: 1024 * 1024 },
];

export class ImageError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ImageError";
    this.code = code;
  }
}
