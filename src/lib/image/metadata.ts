/**
 * Image metadata reading and stripping module.
 * Uses exifr to read EXIF/XMP/IPTC tags, Canvas API to strip them.
 * All processing happens in the browser — no upload to any server.
 */

import { createCanvas, getCanvasContext, canvasToBlob, loadImageFromFile } from "./canvas";
import { ImageError, type SupportedFormat } from "./compress";

// ============================================================
// Types
// ============================================================

export type PrivacyRisk = "none" | "low" | "medium" | "high";

export interface MetadataEntry {
  key: string;
  label: string;
  value: string;
  privacyRisk: PrivacyRisk;
}

export interface MetadataCategory {
  name: string;
  entries: MetadataEntry[];
}

export interface MetadataReport {
  categories: MetadataCategory[];
  totalEntries: number;
  hasLocation: boolean;
  hasCameraInfo: boolean;
  hasTimestamp: boolean;
  privacyRiskLevel: PrivacyRisk;
}

export interface StrippedResult {
  blob: Blob;
  sizeBytes: number;
  originalSizeBytes: number;
  bytesRemoved: number;
  metadataBefore: MetadataReport;
  metadataAfter: MetadataReport;
  durationMs: number;
}

// ============================================================
// EXIF tag mapping
// ============================================================

/** Map EXIF tag names to human-readable labels and privacy risk levels. */
const TAG_MAP: Record<string, { label: string; risk: PrivacyRisk; category: string }> = {
  // GPS — HIGH risk
  GPSLatitude: { label: "GPS Latitude", risk: "high", category: "GPS Location" },
  GPSLongitude: { label: "GPS Longitude", risk: "high", category: "GPS Location" },
  GPSAltitude: { label: "GPS Altitude", risk: "high", category: "GPS Location" },
  GPSLatitudeRef: { label: "Latitude Ref", risk: "high", category: "GPS Location" },
  GPSLongitudeRef: { label: "Longitude Ref", risk: "high", category: "GPS Location" },
  GPSAltitudeRef: { label: "Altitude Ref", risk: "high", category: "GPS Location" },
  GPSDateStamp: { label: "GPS Date", risk: "high", category: "GPS Location" },
  GPSTimeStamp: { label: "GPS Time", risk: "high", category: "GPS Location" },
  GPSProcessingMethod: { label: "GPS Method", risk: "high", category: "GPS Location" },

  // Camera — MEDIUM risk
  Make: { label: "Camera Make", risk: "medium", category: "Camera Info" },
  Model: { label: "Camera Model", risk: "medium", category: "Camera Info" },
  Software: { label: "Software", risk: "medium", category: "Camera Info" },
  HostComputer: { label: "Host Computer", risk: "medium", category: "Camera Info" },
  SerialNumber: { label: "Serial Number", risk: "high", category: "Camera Info" },
  LensMake: { label: "Lens Make", risk: "medium", category: "Camera Info" },
  LensModel: { label: "Lens Model", risk: "medium", category: "Camera Info" },

  // Timestamps — MEDIUM risk
  DateTimeOriginal: { label: "Date Taken", risk: "medium", category: "Timestamps" },
  CreateDate: { label: "Create Date", risk: "medium", category: "Timestamps" },
  ModifyDate: { label: "Modify Date", risk: "medium", category: "Timestamps" },
  DateTimeDigitized: { label: "Date Digitized", risk: "medium", category: "Timestamps" },
  DateTime: { label: "Date Time", risk: "medium", category: "Timestamps" },

  // Image properties — LOW risk
  ImageWidth: { label: "Image Width", risk: "low", category: "Image Properties" },
  ImageHeight: { label: "Image Height", risk: "low", category: "Image Properties" },
  Orientation: { label: "Orientation", risk: "low", category: "Image Properties" },
  ColorSpace: { label: "Color Space", risk: "low", category: "Image Properties" },
  XResolution: { label: "X Resolution", risk: "low", category: "Image Properties" },
  YResolution: { label: "Y Resolution", risk: "low", category: "Image Properties" },
  ResolutionUnit: { label: "Resolution Unit", risk: "low", category: "Image Properties" },
  Flash: { label: "Flash", risk: "low", category: "Image Properties" },
  WhiteBalance: { label: "White Balance", risk: "low", category: "Image Properties" },
  ExposureTime: { label: "Exposure Time", risk: "low", category: "Image Properties" },
  FNumber: { label: "F-Number", risk: "low", category: "Image Properties" },
  ISO: { label: "ISO", risk: "low", category: "Image Properties" },
  FocalLength: { label: "Focal Length", risk: "low", category: "Image Properties" },
  ApertureValue: { label: "Aperture", risk: "low", category: "Image Properties" },
  ShutterSpeedValue: { label: "Shutter Speed", risk: "low", category: "Image Properties" },
  BrightnessValue: { label: "Brightness", risk: "low", category: "Image Properties" },
  ExifImageWidth: { label: "EXIF Image Width", risk: "low", category: "Image Properties" },
  ExifImageHeight: { label: "EXIF Image Height", risk: "low", category: "Image Properties" },
  PixelXDimension: { label: "Pixel X Dimension", risk: "low", category: "Image Properties" },
  PixelYDimension: { label: "Pixel Y Dimension", risk: "low", category: "Image Properties" },
  YCbCrPositioning: { label: "YCbCr Positioning", risk: "low", category: "Image Properties" },
  BitsPerSample: { label: "Bits Per Sample", risk: "low", category: "Image Properties" },
  SamplesPerPixel: { label: "Samples Per Pixel", risk: "low", category: "Image Properties" },

  // File info — NONE risk
  MIMEType: { label: "MIME Type", risk: "none", category: "File Info" },
};

// ============================================================
// Metadata reading
// ============================================================

/**
 * Read all available metadata from an image file using exifr.
 * Returns a structured report with privacy risk classification.
 */
export async function readMetadata(file: File): Promise<MetadataReport> {
  // Dynamic import so exifr is only loaded when needed
  const exifr = await import("exifr");

  const rawTags = await exifr.parse(file, {
    // Parse all available tags
    gps: true,
    xmp: true,
    iptc: true,
    icc: false,
  });

  if (!rawTags || Object.keys(rawTags).length === 0) {
    return {
      categories: [],
      totalEntries: 0,
      hasLocation: false,
      hasCameraInfo: false,
      hasTimestamp: false,
      privacyRiskLevel: "none",
    };
  }

  // Group tags by category
  const categoryMap = new Map<string, MetadataEntry[]>();

  for (const [key, rawValue] of Object.entries(rawTags)) {
    const mapping = TAG_MAP[key];
    if (!mapping) continue; // Skip unmapped tags

    const value = formatTagValue(key, rawValue);

    const entry: MetadataEntry = {
      key,
      label: mapping.label,
      value,
      privacyRisk: mapping.risk,
    };

    const existing = categoryMap.get(mapping.category);
    if (existing) {
      existing.push(entry);
    } else {
      categoryMap.set(mapping.category, [entry]);
    }
  }

  // Build categories array (preserve order)
  const categoryOrder = ["GPS Location", "Camera Info", "Timestamps", "Image Properties", "File Info"];
  const categories: MetadataCategory[] = [];

  for (const name of categoryOrder) {
    const entries = categoryMap.get(name);
    if (entries && entries.length > 0) {
      categories.push({ name, entries });
    }
  }

  // Add any remaining categories
  for (const [name, entries] of categoryMap) {
    if (!categoryOrder.includes(name)) {
      categories.push({ name, entries });
    }
  }

  const totalEntries = categories.reduce((sum, c) => sum + c.entries.length, 0);
  const hasLocation = categories.some((c) => c.name === "GPS Location");
  const hasCameraInfo = categories.some((c) => c.name === "Camera Info");
  const hasTimestamp = categories.some((c) => c.name === "Timestamps");

  // Determine overall risk level
  let privacyRiskLevel: PrivacyRisk = "none";
  for (const cat of categories) {
    for (const entry of cat.entries) {
      if (entry.privacyRisk === "high") {
        privacyRiskLevel = "high";
        break;
      }
      if (entry.privacyRisk === "medium" && privacyRiskLevel !== "high") {
        privacyRiskLevel = "medium";
      }
      if (entry.privacyRisk === "low" && privacyRiskLevel === "none") {
        privacyRiskLevel = "low";
      }
    }
  }

  return {
    categories,
    totalEntries,
    hasLocation,
    hasCameraInfo,
    hasTimestamp,
    privacyRiskLevel,
  };
}

/**
 * Format a raw EXIF tag value into a human-readable string.
 */
function formatTagValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    // Handle GPS coordinates (arrays of numbers)
    if (Array.isArray(value)) {
      return (value as number[]).map((v) => v.toFixed(4)).join(", ");
    }
    return String(Math.round(value * 100) / 100);
  }
  if (Array.isArray(value)) {
    return value.map((v) => String(v)).join(", ");
  }
  return String(value);
}

// ============================================================
// Metadata stripping
// ============================================================

/**
 * Strip all metadata from an image by redrawing it on a Canvas.
 * This is the most reliable method — no EXIF manipulation needed.
 */
export async function stripMetadata(file: File): Promise<StrippedResult> {
  const startTime = performance.now();

  // Read metadata before stripping
  const metadataBefore = await readMetadata(file);

  // Load image
  const { img, objectUrl } = await loadImageFromFile(file);

  try {
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    // Draw to Canvas (this strips all EXIF/XMP/IPTC)
    const canvas = createCanvas(width, height);
    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = getCanvasContext(canvas);
    if (!ctx) {
      throw new ImageError("Failed to create canvas context", "canvas_error");
    }

    ctx.drawImage(img, 0, 0, width, height);

    // Export as the same format
    const originalFormat = file.type as SupportedFormat;
    const blob = await canvasToBlob(canvas, originalFormat, 0.95);

    // Verify metadata was stripped by reading the blob
    const strippedFile = new File([blob], "stripped." + blob.type.split("/")[1], {
      type: blob.type,
    });
    const metadataAfter = await readMetadata(strippedFile);

    return {
      blob,
      sizeBytes: blob.size,
      originalSizeBytes: file.size,
      bytesRemoved: file.size - blob.size,
      metadataBefore,
      metadataAfter,
      durationMs: Math.round(performance.now() - startTime),
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// ============================================================
// Helpers
// ============================================================

/** Get a colored label for a privacy risk level. */
export function getPrivacyRiskLabel(risk: PrivacyRisk): string {
  switch (risk) {
    case "high":
      return "High — contains location data";
    case "medium":
      return "Medium — contains device info";
    case "low":
      return "Low — basic image properties";
    case "none":
      return "None — no identifying data";
  }
}

/** Get the CSS color class for a privacy risk level. */
export function getPrivacyRiskColor(risk: PrivacyRisk): string {
  switch (risk) {
    case "high":
      return "text-error-600 bg-error-50";
    case "medium":
      return "text-warning-600 bg-warning-50";
    case "low":
      return "text-text-secondary bg-surface-secondary";
    case "none":
      return "text-success-600 bg-success-50";
  }
}
