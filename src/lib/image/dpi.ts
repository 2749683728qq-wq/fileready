import { pixelsToUnits, unitsToPixels, type ResizeUnit } from "./resize";
import { formatAspectRatio } from "../utils";

// ============================================================
// Types
// ============================================================

export type LengthUnit = "px" | "mm" | "cm" | "in";

/** Standard DPI values used in common conversion tables */
export const STANDARD_DPIS = [72, 96, 150, 300, 600] as const;

export interface DpiInput {
  width: number;
  height: number;
  unit: LengthUnit;
  dpi: number;
}

export interface DpiRow {
  dpi: number;
  widthPx: number;
  heightPx: number;
  widthMm: number;
  heightMm: number;
  widthCm: number;
  heightCm: number;
  widthIn: number;
  heightIn: number;
}

export interface DpiCalculation {
  /** Pixel dimensions (always the base representation) */
  widthPx: number;
  heightPx: number;
  /** Physical dimensions at input DPI */
  widthMm: number;
  heightMm: number;
  widthCm: number;
  heightCm: number;
  widthIn: number;
  heightIn: number;
  /** Standard DPI comparison table */
  table: DpiRow[];
  /** Megapixels */
  megapixels: number;
  /** Simplified aspect ratio (e.g. "4:3") */
  aspectRatio: string;
}

// ============================================================
// Core calculation
// ============================================================

/**
 * Calculate DPI conversions from user input.
 *
 * All internal calculations use pixels as the base unit, then convert
 * to physical units at various DPI values.
 */
export function calculateDpi(input: DpiInput): DpiCalculation {
  const { width, height, unit, dpi } = input;

  // Step 1: Normalize input to pixels
  let widthPx: number;
  let heightPx: number;

  if (unit === "px") {
    widthPx = width;
    heightPx = height;
  } else {
    // Convert physical units to pixels at the given DPI
    const resizeUnit: ResizeUnit = unit;
    widthPx = unitsToPixels(width, resizeUnit, dpi);
    heightPx = unitsToPixels(height, resizeUnit, dpi);
  }

  // Step 2: Compute physical dimensions at input DPI
  const widthMm = pixelsToUnits(widthPx, "mm", dpi);
  const heightMm = pixelsToUnits(heightPx, "mm", dpi);
  const widthCm = pixelsToUnits(widthPx, "cm", dpi);
  const heightCm = pixelsToUnits(heightPx, "cm", dpi);
  const widthIn = pixelsToUnits(widthPx, "in", dpi);
  const heightIn = pixelsToUnits(heightPx, "in", dpi);

  // Step 3: Build comparison table at standard DPIs
  const table: DpiRow[] = STANDARD_DPIS.map((stdDpi) => ({
    dpi: stdDpi,
    widthPx: Math.round(widthPx * (stdDpi / dpi)),
    heightPx: Math.round(heightPx * (stdDpi / dpi)),
    widthMm: pixelsToUnits(widthPx, "mm", stdDpi),
    heightMm: pixelsToUnits(heightPx, "mm", stdDpi),
    widthCm: pixelsToUnits(widthPx, "cm", stdDpi),
    heightCm: pixelsToUnits(heightPx, "cm", stdDpi),
    widthIn: pixelsToUnits(widthPx, "in", stdDpi),
    heightIn: pixelsToUnits(heightPx, "in", stdDpi),
  }));

  // Step 4: Megapixels and aspect ratio
  const megapixels = (widthPx * heightPx) / 1_000_000;
  const aspectRatio = formatAspectRatio(widthPx, heightPx);

  return {
    widthPx: Math.round(widthPx),
    heightPx: Math.round(heightPx),
    widthMm,
    heightMm,
    widthCm,
    heightCm,
    widthIn,
    heightIn,
    table,
    megapixels,
    aspectRatio,
  };
}

/**
 * Format a number for display. Shows up to 2 decimal places,
 * removes trailing zeros.
 */
export function formatDpiNumber(value: number, decimals = 2): string {
  const fixed = value.toFixed(decimals);
  // Remove trailing zeros after decimal point
  return fixed.replace(/\.?0+$/, "");
}

/**
 * Get the display label for a length unit.
 */
export function getUnitLabel(unit: LengthUnit): string {
  switch (unit) {
    case "px":
      return "px";
    case "mm":
      return "mm";
    case "cm":
      return "cm";
    case "in":
      return "in";
  }
}

/**
 * Get a human-readable name for a length unit.
 */
export function getUnitName(unit: LengthUnit): string {
  switch (unit) {
    case "px":
      return "Pixels";
    case "mm":
      return "Millimeters";
    case "cm":
      return "Centimeters";
    case "in":
      return "Inches";
  }
}
