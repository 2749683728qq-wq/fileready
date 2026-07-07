/**
 * Signature image processing module.
 * Auto-crop whitespace, remove background, grayscale/B&W, contrast adjustment.
 * All processing happens in the browser — no upload to any server.
 */

import { createCanvas, getCanvasContext, canvasToBlob, loadImageFromFile } from "./canvas";
import { ImageError } from "./compress";

// ============================================================
// Types
// ============================================================

export type ColorMode = "original" | "grayscale" | "black-and-white";

export interface SignatureOptions {
  /** Auto-crop whitespace around signature */
  autoCrop: boolean;
  /** Padding in pixels added after auto-crop */
  cropPadding: number;

  /** Make white/near-white background transparent */
  removeBackground: boolean;
  /** Luminance threshold for background removal (0-255, default 240) */
  backgroundThreshold: number;

  /** Color processing mode */
  colorMode: ColorMode;
  /** Contrast adjustment factor (0-200%, 100% = no change) */
  contrast: number;
  /** Threshold for black-and-white conversion (0-255, default 128) */
  bwThreshold: number;

  /** Output dimensions (0 = keep auto-cropped size) */
  outputWidth: number;
  outputHeight: number;
  maintainAspectRatio: boolean;

  signal?: AbortSignal;
}

export interface SignatureResult {
  blob: Blob;
  width: number;
  height: number;
  sizeBytes: number;
  originalWidth: number;
  originalHeight: number;
  originalSizeBytes: number;
  /** Bounding box of auto-cropped content */
  cropRect: { x: number; y: number; width: number; height: number } | null;
  durationMs: number;
}

// ============================================================
// Preset sizes for common use cases
// ============================================================

export const SIGNATURE_PRESETS = [
  { label: "Custom", width: 0, height: 0 },
  { label: "Passport Photo (600×600)", width: 600, height: 600 },
  { label: "Visa Application (800×400)", width: 800, height: 400 },
  { label: "Exam Form (400×200)", width: 400, height: 200 },
];

// ============================================================
// Core processing
// ============================================================

/**
 * Process a signature image with auto-crop, background removal,
 * and color adjustments.
 *
 * Always outputs PNG to preserve transparency.
 */
export async function processSignature(
  file: File,
  options: SignatureOptions
): Promise<SignatureResult> {
  const startTime = performance.now();
  const { signal } = options;

  // Load image
  const { img, objectUrl } = await loadImageFromFile(file);

  try {
    if (signal?.aborted) {
      throw new ImageError("Processing cancelled", "cancelled");
    }

    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;
    const originalSizeBytes = file.size;

    // Step 1: Render source image to a working canvas
    const srcCanvas = createCanvas(originalWidth, originalHeight);
    if (srcCanvas instanceof HTMLCanvasElement) {
      srcCanvas.width = originalWidth;
      srcCanvas.height = originalHeight;
    }
    const srcCtx = getCanvasContext(srcCanvas);
    if (!srcCtx) {
      throw new ImageError("Failed to create canvas context", "canvas_error");
    }
    srcCtx.drawImage(img, 0, 0);

    // Step 2: Get image data for processing
    const srcImageData = srcCtx.getImageData(0, 0, originalWidth, originalHeight);

    // Step 3: Auto-crop whitespace
    let cropRect: { x: number; y: number; width: number; height: number } | null = null;
    let cropWidth = originalWidth;
    let cropHeight = originalHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (options.autoCrop) {
      cropRect = autoCropWhitespace(srcImageData, options.cropPadding);
      cropWidth = cropRect.width;
      cropHeight = cropRect.height;
      offsetX = cropRect.x;
      offsetY = cropRect.y;
    }

    if (signal?.aborted) {
      throw new ImageError("Processing cancelled", "cancelled");
    }

    // Step 4: Calculate output size
    let outWidth = cropWidth;
    let outHeight = cropHeight;

    if (options.outputWidth > 0 && options.outputHeight > 0) {
      if (options.maintainAspectRatio) {
        const cropRatio = cropWidth / cropHeight;
        const targetRatio = options.outputWidth / options.outputHeight;
        if (cropRatio > targetRatio) {
          // Fit to width
          outWidth = options.outputWidth;
          outHeight = Math.round(options.outputWidth / cropRatio);
        } else {
          // Fit to height
          outHeight = options.outputHeight;
          outWidth = Math.round(options.outputHeight * cropRatio);
        }
      } else {
        outWidth = options.outputWidth;
        outHeight = options.outputHeight;
      }
    }

    // Step 5: Create output canvas
    const outCanvas = createCanvas(outWidth, outHeight);
    if (outCanvas instanceof HTMLCanvasElement) {
      outCanvas.width = outWidth;
      outCanvas.height = outHeight;
    }
    const outCtx = getCanvasContext(outCanvas);
    if (!outCtx) {
      throw new ImageError("Failed to create output canvas context", "canvas_error");
    }

    // Step 6: Draw cropped region to output canvas (with scaling)
    outCtx.drawImage(
      img,
      offsetX, offsetY, cropWidth, cropHeight,  // source rect
      0, 0, outWidth, outHeight                  // dest rect
    );

    // Step 7: Get output image data for pixel processing
    const outImageData = outCtx.getImageData(0, 0, outWidth, outHeight);

    // Step 8: Apply background removal
    if (options.removeBackground) {
      removeBackground(outImageData, options.backgroundThreshold);
    }

    if (signal?.aborted) {
      throw new ImageError("Processing cancelled", "cancelled");
    }

    // Step 9: Apply color processing
    switch (options.colorMode) {
      case "grayscale":
        applyGrayscale(outImageData);
        break;
      case "black-and-white":
        applyBlackAndWhite(outImageData, options.bwThreshold);
        break;
    }

    // Step 10: Apply contrast
    if (options.contrast !== 100) {
      applyContrast(outImageData, options.contrast);
    }

    // Step 11: Write processed data back
    outCtx.putImageData(outImageData, 0, 0);

    if (signal?.aborted) {
      throw new ImageError("Processing cancelled", "cancelled");
    }

    // Step 12: Export as PNG (always, for transparency support)
    const blob = await canvasToBlob(outCanvas, "image/png", 1.0);

    return {
      blob,
      width: outWidth,
      height: outHeight,
      sizeBytes: blob.size,
      originalWidth,
      originalHeight,
      originalSizeBytes,
      cropRect,
      durationMs: Math.round(performance.now() - startTime),
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// ============================================================
// Preview generation (for live preview, uses downscaled version)
// ============================================================

/**
 * Generate a quick preview of what the processed signature will look like.
 * Uses a smaller canvas for performance (max 800px on longest side).
 */
export async function generateSignaturePreview(
  file: File,
  options: SignatureOptions,
  maxPreviewSize = 800
): Promise<string> {
  const { img, objectUrl } = await loadImageFromFile(file);

  try {
    const scale = Math.min(1, maxPreviewSize / Math.max(img.naturalWidth, img.naturalHeight));
    const previewWidth = Math.round(img.naturalWidth * scale);
    const previewHeight = Math.round(img.naturalHeight * scale);

    const canvas = createCanvas(previewWidth, previewHeight);
    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = previewWidth;
      canvas.height = previewHeight;
    }
    const ctx = getCanvasContext(canvas);
    if (!ctx) return "";

    ctx.drawImage(img, 0, 0, previewWidth, previewHeight);
    const imageData = ctx.getImageData(0, 0, previewWidth, previewHeight);

    // Apply same processing
    if (options.removeBackground) {
      removeBackground(imageData, options.backgroundThreshold);
    }

    switch (options.colorMode) {
      case "grayscale":
        applyGrayscale(imageData);
        break;
      case "black-and-white":
        applyBlackAndWhite(imageData, options.bwThreshold);
        break;
    }

    if (options.contrast !== 100) {
      applyContrast(imageData, options.contrast);
    }

    ctx.putImageData(imageData, 0, 0);

    if (canvas instanceof OffscreenCanvas) {
      const blob = await canvas.convertToBlob({ type: "image/png" });
      return URL.createObjectURL(blob);
    }
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// ============================================================
// Pixel-level algorithms
// ============================================================

/**
 * Find the bounding box of non-white content.
 * Scans from all four edges inward.
 */
export function autoCropWhitespace(
  imageData: ImageData,
  padding = 10
): { x: number; y: number; width: number; height: number } {
  const { data, width, height } = imageData;
  const threshold = 250; // near-white threshold

  let top = 0;
  let bottom = height - 1;
  let left = 0;
  let right = width - 1;

  // Scan from top
  topLoop: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      // Consider non-white and non-transparent pixels
      if ((r < threshold || g < threshold || b < threshold) && a > 10) {
        top = y;
        break topLoop;
      }
    }
  }

  // Scan from bottom
  bottomLoop: for (let y = height - 1; y >= top; y--) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      if ((r < threshold || g < threshold || b < threshold) && a > 10) {
        bottom = y;
        break bottomLoop;
      }
    }
  }

  // Scan from left
  leftLoop: for (let x = 0; x < width; x++) {
    for (let y = top; y <= bottom; y++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      if ((r < threshold || g < threshold || b < threshold) && a > 10) {
        left = x;
        break leftLoop;
      }
    }
  }

  // Scan from right
  rightLoop: for (let x = width - 1; x >= left; x--) {
    for (let y = top; y <= bottom; y++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      if ((r < threshold || g < threshold || b < threshold) && a > 10) {
        right = x;
        break rightLoop;
      }
    }
  }

  // Add padding (clamped to image bounds)
  const padX = Math.min(padding, left, width - 1 - right);
  const padY = Math.min(padding, top, height - 1 - bottom);

  return {
    x: Math.max(0, left - padX),
    y: Math.max(0, top - padY),
    width: Math.min(width - left, right - left + 1 + padX * 2),
    height: Math.min(height - top, bottom - top + 1 + padY * 2),
  };
}

/**
 * Make near-white pixels transparent.
 * Uses luminance threshold: if all RGB channels > threshold, set alpha to 0.
 */
export function removeBackground(
  imageData: ImageData,
  threshold: number
): void {
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // All channels above threshold → make transparent
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    }
  }
}

/**
 * Convert image to grayscale (preserves alpha).
 */
export function applyGrayscale(imageData: ImageData): void {
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Luminance formula
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    // Alpha unchanged
  }
}

/**
 * Convert to black and white using a threshold.
 * Pixels above threshold → white, below → black.
 */
export function applyBlackAndWhite(
  imageData: ImageData,
  threshold: number
): void {
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip fully transparent pixels
    if (a === 0) continue;

    // Luminance
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    if (gray >= threshold) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
    // Alpha unchanged
  }
}

/**
 * Adjust contrast.
 * factor = 100 means no change, 0 = all gray, 200 = doubled.
 */
export function applyContrast(imageData: ImageData, factor: number): void {
  const { data } = imageData;
  const contrastFactor = factor / 100;

  for (let i = 0; i < data.length; i += 4) {
    // Skip fully transparent
    if (data[i + 3] === 0) continue;

    for (let channel = 0; channel < 3; channel++) {
      const idx = i + channel;
      const value = data[idx];
      const adjusted = (value - 128) * contrastFactor + 128;
      data[idx] = Math.max(0, Math.min(255, Math.round(adjusted)));
    }
  }
}
