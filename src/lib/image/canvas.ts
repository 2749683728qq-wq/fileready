/**
 * Shared Canvas utilities for image processing.
 * Extracted from compress.ts so all image tools can reuse.
 * All processing happens in the browser — no upload to any server.
 */

import { ImageError, type SupportedFormat, type ImageMeta } from "./compress";

/**
 * Create a Canvas from an HTMLImageElement with given dimensions.
 * Uses OffscreenCanvas if available, falls back to HTMLCanvasElement (Safari).
 */
export function createCanvas(
  width: number,
  height: number
): HTMLCanvasElement | OffscreenCanvas {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Get a 2D rendering context from a Canvas or OffscreenCanvas.
 */
export function getCanvasContext(
  canvas: HTMLCanvasElement | OffscreenCanvas
): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
  return canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;
}

/**
 * Export a Canvas to a Blob in the specified format.
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  format: SupportedFormat,
  quality: number
): Promise<Blob> {
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: format, quality });
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new ImageError("Failed to encode image", "encode_failed"));
      },
      format,
      quality
    );
  });
}

/**
 * Render an image from its meta to a Blob via Canvas with given quality and scale.
 * This is the primary function used by the compressor — kept for backward compatibility.
 */
export async function renderImageToBlob(
  meta: ImageMeta,
  format: SupportedFormat,
  quality: number,
  scaleX: number,
  scaleY: number,
  signal?: AbortSignal
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(meta.file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (signal?.aborted) {
        reject(new ImageError("Compression cancelled", "cancelled"));
        return;
      }

      const w = Math.round(meta.width * scaleX);
      const h = Math.round(meta.height * scaleY);

      const canvas = createCanvas(w, h);
      if (canvas instanceof HTMLCanvasElement) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = getCanvasContext(canvas);
      if (!ctx) {
        reject(new ImageError("Failed to create canvas context", "canvas_error"));
        return;
      }

      // White background for JPEG (no transparency support)
      if (format === "image/jpeg" && meta.hasTransparency) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(img, 0, 0, w, h);

      canvasToBlob(canvas, format, quality)
        .then(resolve)
        .catch(() => reject(new ImageError("Failed to encode image", "encode_failed")));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageError("Failed to load image", "load_failed"));
    };

    img.src = url;
  });
}

/**
 * Load an image from a File and return both the Image element and the
 * object URL (caller must revoke it).
 */
export function loadImageFromFile(
  file: File
): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      resolve({ img, objectUrl });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new ImageError("Failed to load image", "load_failed"));
    };

    img.src = objectUrl;
  });
}
