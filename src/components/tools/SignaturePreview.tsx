"use client";

import { useEffect, useRef } from "react";
import type { SignatureOptions } from "@/lib/image";
import { generateSignaturePreview } from "@/lib/image";
import { useT } from "@/i18n";

interface SignaturePreviewProps {
  file: File | null;
  options: SignatureOptions;
  className?: string;
}

/**
 * Live preview of the signature processing result.
 * Renders on a Canvas with checkerboard background to show transparency.
 */
export function SignaturePreview({
  file,
  options,
  className = "",
}: SignaturePreviewProps) {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas || !file) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Debounce preview generation
    const timer = setTimeout(async () => {
      if (cancelled) return;

      try {
        // Clean up previous preview URL
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
        }

        const dataUrl = await generateSignaturePreview(file, options, 600);

        if (cancelled) return;

        // Load the preview image
        const img = new Image();
        img.onload = () => {
          if (cancelled) return;

          canvas.width = img.width;
          canvas.height = img.height;

          // Draw checkerboard background
          const checkerSize = 8;
          for (let y = 0; y < canvas.height; y += checkerSize) {
            for (let x = 0; x < canvas.width; x += checkerSize) {
              ctx.fillStyle =
                ((x / checkerSize + y / checkerSize) % 2 === 0)
                  ? "#f0f0f0"
                  : "#ffffff";
              ctx.fillRect(x, y, checkerSize, checkerSize);
            }
          }

          // Draw the preview on top
          ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
      } catch {
        // Preview generation failed — silently ignore
      }
    }, 200); // 200ms debounce

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [file, options]);

  // Cleanup on unmount
  useEffect(() => {
    const url = previewUrlRef.current;
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  if (!file) {
    return (
      <div className={`flex items-center justify-center rounded-lg border border-dashed border-border-default bg-surface-secondary/50 ${className}`} style={{ minHeight: 200 }}>
        <p className="text-sm text-text-tertiary">{t("ui.uploadToPreview")}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-border-default bg-surface-card p-3 ${className}`}>
      <p className="mb-2 text-xs font-medium text-text-tertiary">{t("ui.preview")}</p>
      <canvas
        ref={canvasRef}
        className="mx-auto max-h-80 max-w-full rounded object-contain"
        style={{ imageRendering: "auto" }}
      />
      <p className="mt-2 text-xs text-text-tertiary text-center">
        {t("ui.checkerboard")}
      </p>
    </div>
  );
}
