"use client";

import { useState, useRef, useCallback, useEffect, type MouseEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { CropRect, AspectRatioPreset } from "@/lib/image";
import { constrainCropRect, parseAspectRatio } from "@/lib/image";
import { useT } from "@/i18n";

interface CropEditorProps {
  /** Image source URL (blob URL) */
  src: string;
  /** Original image dimensions */
  imageWidth: number;
  imageHeight: number;
  /** Current crop rect (in image coordinates) */
  crop: CropRect;
  /** Called when crop changes */
  onCropChange: (crop: CropRect) => void;
  /** Aspect ratio constraint */
  aspectRatio: AspectRatioPreset;
  /** Custom aspect ratio w:h (only when aspectRatio === "custom") */
  customRatio?: { w: number; h: number };
  /** Display size of the editor */
  editorWidth?: number;
  editorHeight?: number;
  className?: string;
}

type DragHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | "center" | null;

const MIN_CROP = 20;

export function CropEditor({
  src,
  imageWidth,
  imageHeight,
  crop,
  onCropChange,
  aspectRatio,
  customRatio,
  editorWidth = 600,
  editorHeight = 450,
  className,
}: CropEditorProps) {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<DragHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartCrop, setDragStartCrop] = useState<CropRect>(crop);

  // Calculate scale to fit image in editor
  const scaleX = editorWidth / imageWidth;
  const scaleY = editorHeight / imageHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
  const displayWidth = Math.round(imageWidth * scale);
  const displayHeight = Math.round(imageHeight * scale);

  // Convert crop (image coords) to display coords
  const toDisplay = useCallback(
    (c: CropRect): CropRect => ({
      x: Math.round(c.x * scale),
      y: Math.round(c.y * scale),
      width: Math.round(c.width * scale),
      height: Math.round(c.height * scale),
    }),
    [scale]
  );

  // Convert display coords to image coords (used in future keyboard adjustments)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toImage = useCallback(
    (d: CropRect): CropRect => ({
      x: Math.round(d.x / scale),
      y: Math.round(d.y / scale),
      width: Math.round(d.width / scale),
      height: Math.round(d.height / scale),
    }),
    [scale]
  );

  const ratio = aspectRatio === "custom" && customRatio
    ? customRatio
    : parseAspectRatio(aspectRatio);

  // Handle mouse down on a drag handle
  const handleMouseDown = (e: MouseEvent, handle: DragHandle) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartCrop({ ...crop });
  };

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isDragging || !dragHandle) return;

      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;

      let newCrop = { ...dragStartCrop };

      switch (dragHandle) {
        case "center":
          newCrop.x = Math.max(0, Math.min(dragStartCrop.x + dx, imageWidth - dragStartCrop.width));
          newCrop.y = Math.max(0, Math.min(dragStartCrop.y + dy, imageHeight - dragStartCrop.height));
          break;
        case "nw":
          newCrop.x = dragStartCrop.x + dx;
          newCrop.y = dragStartCrop.y + dy;
          newCrop.width = dragStartCrop.width - dx;
          newCrop.height = dragStartCrop.height - dy;
          break;
        case "ne":
          newCrop.y = dragStartCrop.y + dy;
          newCrop.width = dragStartCrop.width + dx;
          newCrop.height = dragStartCrop.height - dy;
          break;
        case "sw":
          newCrop.x = dragStartCrop.x + dx;
          newCrop.width = dragStartCrop.width - dx;
          newCrop.height = dragStartCrop.height + dy;
          break;
        case "se":
          newCrop.width = dragStartCrop.width + dx;
          newCrop.height = dragStartCrop.height + dy;
          break;
        case "n":
          newCrop.y = dragStartCrop.y + dy;
          newCrop.height = dragStartCrop.height - dy;
          break;
        case "s":
          newCrop.height = dragStartCrop.height + dy;
          break;
        case "e":
          newCrop.width = dragStartCrop.width + dx;
          break;
        case "w":
          newCrop.x = dragStartCrop.x + dx;
          newCrop.width = dragStartCrop.width - dx;
          break;
      }

      newCrop = constrainCropRect(newCrop, imageWidth, imageHeight, ratio, MIN_CROP);
      onCropChange(newCrop);
    },
    [isDragging, dragHandle, dragStart, dragStartCrop, scale, imageWidth, imageHeight, ratio, onCropChange]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

  // Global mouse listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Keyboard nudging
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isDragging) return;
    const step = e.shiftKey ? 10 : 1;
    const nudged: CropRect = { ...crop };

    switch (e.key) {
      case "ArrowUp":
        nudged.y = Math.max(0, crop.y - step);
        break;
      case "ArrowDown":
        nudged.y = Math.min(imageHeight - crop.height, crop.y + step);
        break;
      case "ArrowLeft":
        nudged.x = Math.max(0, crop.x - step);
        break;
      case "ArrowRight":
        nudged.x = Math.min(imageWidth - crop.width, crop.x + step);
        break;
      default:
        return;
    }
    e.preventDefault();
    onCropChange(constrainCropRect(nudged, imageWidth, imageHeight, ratio, MIN_CROP));
  };

  const displayCrop = toDisplay(crop);

  // Cursor styles for handles
  const handleCursors: Record<string, string> = {
    nw: "cursor-nw-resize",
    ne: "cursor-ne-resize",
    sw: "cursor-sw-resize",
    se: "cursor-se-resize",
    n: "cursor-n-resize",
    s: "cursor-s-resize",
    e: "cursor-e-resize",
    w: "cursor-w-resize",
    center: "cursor-move",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-lg bg-black/5 select-none", className)}
      style={{ width: displayWidth, height: displayHeight }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={t("ui.cropEditorHint")}
      role="img"
    >
      {/* Image — blob URL, cannot use next/image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={t("ui.cropPreview")}
        className="absolute inset-0 max-w-none"
        style={{ width: displayWidth, height: displayHeight }}
        draggable={false}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0">
        {/* Top */}
        <div
          className="absolute bg-black/50"
          style={{ top: 0, left: 0, right: 0, height: displayCrop.y }}
        />
        {/* Bottom */}
        <div
          className="absolute bg-black/50"
          style={{
            top: displayCrop.y + displayCrop.height,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        {/* Left */}
        <div
          className="absolute bg-black/50"
          style={{
            top: displayCrop.y,
            left: 0,
            width: displayCrop.x,
            height: displayCrop.height,
          }}
        />
        {/* Right */}
        <div
          className="absolute bg-black/50"
          style={{
            top: displayCrop.y,
            left: displayCrop.x + displayCrop.width,
            right: 0,
            height: displayCrop.height,
          }}
        />
      </div>

      {/* Crop border */}
      <div
        className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0)]"
        style={{
          left: displayCrop.x,
          top: displayCrop.y,
          width: displayCrop.width,
          height: displayCrop.height,
        }}
      >
        {/* Rule of thirds grid */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 border-t border-white/30" />
          <div className="absolute top-2/3 left-0 right-0 border-t border-white/30" />
          <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/30" />
          <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/30" />
        </div>

        {/* Size indicator */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-black/70 px-2 py-0.5 text-xs text-white whitespace-nowrap">
          {crop.width} × {crop.height} px
        </div>

        {/* Corner handles */}
        {(["nw", "ne", "sw", "se"] as const).map((h) => (
          <div
            key={h}
            className={cn(
              "absolute h-3 w-3 rounded-sm border-2 border-white bg-primary-600",
              handleCursors[h],
              h.includes("n") ? "-top-1.5" : "-bottom-1.5",
              h.includes("w") ? "-left-1.5" : "-right-1.5"
            )}
            onMouseDown={(e) => handleMouseDown(e, h)}
          />
        ))}

        {/* Edge handles */}
        {(["n", "s", "e", "w"] as const).map((h) => (
          <div
            key={h}
            className={cn(
              "absolute bg-white/0",
              handleCursors[h],
              h === "n" && "top-0 left-4 right-4 h-2 -mt-1",
              h === "s" && "bottom-0 left-4 right-4 h-2 -mb-1",
              h === "e" && "right-0 top-4 bottom-4 w-2 -mr-1",
              h === "w" && "left-0 top-4 bottom-4 w-2 -ml-1"
            )}
            onMouseDown={(e) => handleMouseDown(e, h)}
          />
        ))}

        {/* Center drag area */}
        <div
          className="absolute inset-4 cursor-move"
          onMouseDown={(e) => handleMouseDown(e, "center")}
        />
      </div>
    </div>
  );
}

/**
 * Simple preview component showing the crop result.
 */
export function CropPreview({
  src,
  crop,
  width,
  height,
  className,
}: {
  src: string;
  crop: CropRect;
  width: number;
  height: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);
    };
    img.src = src;
  }, [src, crop, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("rounded-md border border-border-default", className)}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
