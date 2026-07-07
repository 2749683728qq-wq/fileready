/**
 * Image resize, crop, rotate, and flip operations.
 * All processing happens in-browser via Canvas API.
 */

export type ResizeUnit = "px" | "mm" | "cm" | "in";
export type FlipMode = "none" | "horizontal" | "vertical" | "both";
export type AspectRatioPreset = "free" | "1:1" | "3:4" | "4:3" | "16:9" | "9:16" | "3:2" | "2:3" | "custom";

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeOptions {
  /** Output width in pixels */
  width: number;
  /** Output height in pixels */
  height: number;
  /** Rotation in degrees (0/90/180/270) */
  rotation?: number;
  /** Flip mode */
  flip?: FlipMode;
  /** Crop region (in original image coordinates) */
  crop?: CropRect;
  /** Output format */
  format?: "image/jpeg" | "image/png" | "image/webp";
  /** JPEG/WebP quality 0-1 */
  quality?: number;
  /** Signal for cancellation */
  signal?: AbortSignal;
}

export interface ResizeResult {
  blob: Blob;
  width: number;
  height: number;
  sizeBytes: number;
  format: string;
  durationMs: number;
}

/**
 * Convert physical units to pixels at a given DPI.
 */
export function unitsToPixels(value: number, unit: ResizeUnit, dpi: number): number {
  switch (unit) {
    case "mm": return (value / 25.4) * dpi;
    case "cm": return (value / 2.54) * dpi;
    case "in": return value * dpi;
    default: return value;
  }
}

/**
 * Convert pixels to physical units at a given DPI.
 */
export function pixelsToUnits(px: number, unit: ResizeUnit, dpi: number): number {
  switch (unit) {
    case "mm": return (px / dpi) * 25.4;
    case "cm": return (px / dpi) * 2.54;
    case "in": return px / dpi;
    default: return px;
  }
}

/**
 * Parse an aspect ratio preset string into width/height ratio.
 */
export function parseAspectRatio(preset: AspectRatioPreset): { w: number; h: number } | null {
  if (preset === "free" || preset === "custom") return null;
  const [w, h] = preset.split(":").map(Number);
  return { w, h };
}

/**
 * Constrain a crop rect to fit within image bounds and match aspect ratio.
 */
export function constrainCropRect(
  rect: CropRect,
  imageWidth: number,
  imageHeight: number,
  aspectRatio: { w: number; h: number } | null,
  minSize: number = 10
): CropRect {
  let { x, y, width, height } = rect;

  // Clamp position
  x = Math.max(0, Math.min(x, imageWidth - minSize));
  y = Math.max(0, Math.min(y, imageHeight - minSize));

  // Clamp size
  width = Math.max(minSize, Math.min(width, imageWidth - x));
  height = Math.max(minSize, Math.min(height, imageHeight - y));

  // Enforce aspect ratio
  if (aspectRatio) {
    const targetRatio = aspectRatio.w / aspectRatio.h;

    // Adjust height to match width
    const calcHeight = width / targetRatio;
    if (calcHeight <= imageHeight - y) {
      height = calcHeight;
    } else {
      // Adjust width to match height
      height = Math.min(height, imageHeight - y);
      width = height * targetRatio;
      if (width > imageWidth - x) {
        width = imageWidth - x;
        height = width / targetRatio;
      }
    }
  }

  return { x, y, width, height };
}

/**
 * Compute dimensions after applying rotation.
 */
function rotatedDimensions(w: number, h: number, rotation: number): { w: number; h: number } {
  if (rotation === 90 || rotation === 270) {
    return { w: h, h: w };
  }
  return { w, h };
}

/**
 * Process an image: crop, resize, rotate, flip, and export.
 */
export async function processImage(
  file: File,
  options: ResizeOptions
): Promise<ResizeResult> {
  const startTime = performance.now();
  const { width, height, rotation = 0, flip = "none", crop, format = file.type || "image/jpeg", quality = 0.92, signal } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (signal?.aborted) {
        reject(new ResizeError("Operation cancelled", "cancelled"));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new ResizeError("Failed to create canvas context", "canvas_error"));
        return;
      }

      // Calculate source region
      const srcX = crop ? crop.x : 0;
      const srcY = crop ? crop.y : 0;
      const srcW = crop ? crop.width : img.naturalWidth;
      const srcH = crop ? crop.height : img.naturalHeight;

      // Apply rotation to determine output canvas size
      const { w: rotatedW, h: rotatedH } = rotatedDimensions(width, height, rotation);
      canvas.width = rotatedW;
      canvas.height = rotatedH;

      // White background for JPEG
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Apply rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      if (rotation === 90) ctx.rotate(Math.PI / 2);
      else if (rotation === 180) ctx.rotate(Math.PI);
      else if (rotation === 270) ctx.rotate(-Math.PI / 2);

      // Apply flip
      let flipScaleX = 1;
      let flipScaleY = 1;
      if (flip === "horizontal" || flip === "both") flipScaleX = -1;
      if (flip === "vertical" || flip === "both") flipScaleY = -1;

      ctx.scale(flipScaleX, flipScaleY);

      // Draw image centered and scaled
      ctx.drawImage(
        img,
        srcX, srcY, srcW, srcH,
        -width / 2, -height / 2, width, height
      );

      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              blob,
              width: rotatedW,
              height: rotatedH,
              sizeBytes: blob.size,
              format,
              durationMs: Math.round(performance.now() - startTime),
            });
          } else {
            reject(new ResizeError("Failed to encode image", "encode_failed"));
          }
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ResizeError("Failed to load image", "load_failed"));
    };

    img.src = url;
  });
}

/**
 * Create a preview URL from a File (for showing the original image in crop UI).
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export const ASPECT_RATIO_PRESETS: { label: string; value: AspectRatioPreset }[] = [
  { label: "Free", value: "free" },
  { label: "1:1 (Square)", value: "1:1" },
  { label: "3:4 (Portrait)", value: "3:4" },
  { label: "4:3 (Landscape)", value: "4:3" },
  { label: "16:9 (Widescreen)", value: "16:9" },
  { label: "9:16 (Story)", value: "9:16" },
  { label: "3:2 (Photo)", value: "3:2" },
  { label: "2:3 (Portrait Photo)", value: "2:3" },
  { label: "Custom", value: "custom" },
];

export const SIZE_UNITS: { label: string; value: ResizeUnit }[] = [
  { label: "Pixels (px)", value: "px" },
  { label: "Millimeters (mm)", value: "mm" },
  { label: "Centimeters (cm)", value: "cm" },
  { label: "Inches (in)", value: "in" },
];

export class ResizeError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ResizeError";
    this.code = code;
  }
}
