/**
 * File compliance checker module.
 * Checks uploaded files against user-defined requirements.
 * Supports images (via loadImage) and basic PDF checks.
 * All processing happens in the browser — no upload to any server.
 */

import {
  loadImage,
  isSupportedImage,
  readMetadata,
  type ImageMeta,
} from "@/lib/image";
import { formatBytes, formatAspectRatio } from "@/lib/utils";

// ============================================================
// Types
// ============================================================

export type CheckStatus = "pass" | "fail" | "warning" | "unknown";

export interface CheckItem {
  label: string;
  status: CheckStatus;
  detail: string;
  /** Optional link to a recommended tool */
  toolHref?: string;
  toolLabel?: string;
}

export interface CheckResult {
  items: CheckItem[];
  passCount: number;
  failCount: number;
  warningCount: number;
  unknownCount: number;
  /** Whether all critical (fail) checks passed */
  allPassed: boolean;
  /** Specific recommended actions for failed items */
  recommendations: Recommendation[];
}

export interface Recommendation {
  message: string;
  toolHref: string;
  toolLabel: string;
}

export type FileType = "image" | "pdf";

export interface CheckRequirements {
  /** Allowed file types */
  allowedTypes: FileType[];
  /** Max file size in bytes */
  maxSizeBytes: number;
  /** Max width in pixels (images only) */
  maxWidth: number;
  /** Max height in pixels (images only) */
  maxHeight: number;
  /** Min width in pixels (images only) */
  minWidth: number;
  /** Min height in pixels (images only) */
  minHeight: number;
  /** Required orientation */
  orientation: "any" | "portrait" | "landscape";
  /** Allowed aspect ratios (empty = any) */
  allowedAspectRatios: string[];
  /** Filename must not contain spaces */
  noSpacesInFilename: boolean;
  /** Filename must not contain special characters */
  noSpecialCharsInFilename: boolean;
}

export const DEFAULT_REQUIREMENTS: CheckRequirements = {
  allowedTypes: ["image"],
  maxSizeBytes: 500 * 1024,
  maxWidth: 2000,
  maxHeight: 2000,
  minWidth: 0,
  minHeight: 0,
  orientation: "portrait",
  allowedAspectRatios: [],
  noSpacesInFilename: true,
  noSpecialCharsInFilename: true,
};

// ============================================================
// File type detection
// ============================================================

/**
 * Detect whether a file is an image or a PDF.
 */
export function detectFileType(file: File): FileType | null {
  if (isSupportedImage(file)) return "image";
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }
  return null;
}

/**
 * Check if a filename contains spaces.
 */
export function filenameHasSpaces(name: string): boolean {
  return /\s/.test(name);
}

/**
 * Check if a filename contains special characters.
 * Allows letters, digits, hyphens, underscores, and dots.
 */
export function filenameHasSpecialChars(name: string): boolean {
  // Remove extension first
  const baseName = name.replace(/\.[^.]+$/, "");
  return /[^a-zA-Z0-9\-_]/.test(baseName);
}

// ============================================================
// Core check logic
// ============================================================

/**
 * Run a full compliance check on a file against given requirements.
 */
export async function checkFileCompliance(
  file: File,
  requirements: CheckRequirements
): Promise<CheckResult> {
  const items: CheckItem[] = [];
  const recommendations: Recommendation[] = [];

  // Detect file type
  const fileType = detectFileType(file);

  // ---- File type check ----
  if (!fileType) {
    items.push({
      label: "File type",
      status: "fail",
      detail: `Unsupported file type (${file.type || "unknown"}). Only JPG, PNG, WebP, and PDF are supported.`,
    });
    return buildResult(items, recommendations);
  }

  const typeLabel = fileType === "image" ? "Image" : "PDF";

  if (!requirements.allowedTypes.includes(fileType)) {
    items.push({
      label: "File type",
      status: "fail",
      detail: `${typeLabel} files are not allowed. Required: ${requirements.allowedTypes.join(" or ")}.`,
    });
    return buildResult(items, recommendations);
  }

  items.push({
    label: "File type",
    status: "pass",
    detail: `${typeLabel} — allowed`,
  });

  // ---- File extension check ----
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  items.push({
    label: "File extension",
    status: "pass",
    detail: `.${ext}`,
  });

  // ---- File size check ----
  if (file.size > requirements.maxSizeBytes) {
    items.push({
      label: "File size",
      status: "fail",
      detail: `${formatBytes(file.size)} exceeds maximum ${formatBytes(requirements.maxSizeBytes)}`,
      toolHref: "/en/tools/image-compressor",
      toolLabel: "Compress image",
    });
    recommendations.push({
      message: `Reduce file size to ${formatBytes(requirements.maxSizeBytes)} or less`,
      toolHref: "/en/tools/image-compressor",
      toolLabel: "Image Compressor",
    });
  } else {
    items.push({
      label: "File size",
      status: "pass",
      detail: `${formatBytes(file.size)} — within ${formatBytes(requirements.maxSizeBytes)} limit`,
    });
  }

  // ---- Filename checks ----
  if (requirements.noSpacesInFilename && filenameHasSpaces(file.name)) {
    items.push({
      label: "Filename (no spaces)",
      status: "warning",
      detail: "Filename contains spaces. Some systems may reject it.",
    });
  } else {
    items.push({
      label: "Filename (no spaces)",
      status: "pass",
      detail: "No spaces in filename",
    });
  }

  if (requirements.noSpecialCharsInFilename && filenameHasSpecialChars(file.name)) {
    items.push({
      label: "Filename (no special chars)",
      status: "warning",
      detail: "Filename contains special characters. Rename to use only letters, numbers, hyphens, and underscores.",
    });
  } else {
    items.push({
      label: "Filename (no special chars)",
      status: "pass",
      detail: "No special characters in filename",
    });
  }

  // ---- Image-specific checks ----
  if (fileType === "image") {
    try {
      const [meta, metadataReport] = await Promise.all([
        loadImage(file),
        readMetadata(file).catch(() => null),
      ]);

      // Dimensions
      const dimensionResults = checkDimensions(meta, requirements);
      items.push(...dimensionResults.items);
      recommendations.push(...dimensionResults.recommendations);

      // Orientation
      const isPortrait = meta.height >= meta.width;
      if (requirements.orientation === "portrait" && !isPortrait) {
        items.push({
          label: "Orientation",
          status: "fail",
          detail: `Landscape orientation detected — portrait required`,
          toolHref: "/en/tools/image-resizer",
          toolLabel: "Resize & crop",
        });
        recommendations.push({
          message: "Rotate or crop to portrait orientation",
          toolHref: "/en/tools/image-resizer",
          toolLabel: "Image Resizer",
        });
      } else if (requirements.orientation === "landscape" && isPortrait) {
        items.push({
          label: "Orientation",
          status: "fail",
          detail: `Portrait orientation detected — landscape required`,
          toolHref: "/en/tools/image-resizer",
          toolLabel: "Resize & crop",
        });
        recommendations.push({
          message: "Rotate or crop to landscape orientation",
          toolHref: "/en/tools/image-resizer",
          toolLabel: "Image Resizer",
        });
      } else {
        items.push({
          label: "Orientation",
          status: "pass",
          detail: isPortrait ? "Portrait" : "Landscape",
        });
      }

      // Aspect ratio
      if (requirements.allowedAspectRatios.length > 0) {
        const currentRatio = formatAspectRatio(meta.width, meta.height);
        if (!requirements.allowedAspectRatios.includes(currentRatio)) {
          items.push({
            label: "Aspect ratio",
            status: "warning",
            detail: `${currentRatio} — not in allowed ratios: ${requirements.allowedAspectRatios.join(", ")}`,
            toolHref: "/en/tools/image-resizer",
            toolLabel: "Resize & crop",
          });
        } else {
          items.push({
            label: "Aspect ratio",
            status: "pass",
            detail: `${currentRatio} — matches requirement`,
          });
        }
      } else {
        items.push({
          label: "Aspect ratio",
          status: "pass",
          detail: `${formatAspectRatio(meta.width, meta.height)} (no restriction)`,
        });
      }

      // DPI
      if (meta.dpi) {
        items.push({
          label: "DPI information",
          status: "unknown",
          detail: `${meta.dpi} DPI — most online uploads ignore DPI for digital images`,
        });
      } else {
        items.push({
          label: "DPI information",
          status: "unknown",
          detail: "No DPI data — typical for digital images",
        });
      }

      // Metadata / privacy
      if (metadataReport && metadataReport.totalEntries > 0) {
        const hasLocation = metadataReport.hasLocation;
        items.push({
          label: "Location metadata",
          status: hasLocation ? "warning" : "pass",
          detail: hasLocation
            ? "GPS location data found — consider removing for privacy"
            : `${metadataReport.totalEntries} metadata entries found (no GPS)`,
          ...(hasLocation
            ? {
                toolHref: "/en/tools/remove-image-metadata",
                toolLabel: "Remove metadata",
              }
            : {}),
        });
        if (hasLocation) {
          recommendations.push({
            message: "Remove GPS location data from image",
            toolHref: "/en/tools/remove-image-metadata",
            toolLabel: "Metadata Remover",
          });
        }
      } else {
        items.push({
          label: "Location metadata",
          status: "pass",
          detail: "No metadata found",
        });
      }
    } catch {
      items.push({
        label: "Image analysis",
        status: "fail",
        detail: "Could not read image properties. The file may be corrupted.",
      });
    }
  }

  // ---- PDF-specific checks ----
  if (fileType === "pdf") {
    items.push({
      label: "PDF analysis",
      status: "unknown",
      detail: "Basic PDF checking: format and file size verified. Advanced PDF analysis (page count, dimensions) is coming in Phase 5.",
    });

    items.push({
      label: "Orientation",
      status: "unknown",
      detail: "PDF page orientation cannot be determined in this version",
    });

    items.push({
      label: "Dimensions",
      status: "unknown",
      detail: "PDF page dimensions require advanced parsing (coming in Phase 5)",
    });
  }

  return buildResult(items, recommendations);
}

// ============================================================
// Helpers
// ============================================================

function checkDimensions(
  meta: ImageMeta,
  req: CheckRequirements
): { items: CheckItem[]; recommendations: Recommendation[] } {
  const items: CheckItem[] = [];
  const recommendations: Recommendation[] = [];

  // Width
  if (req.maxWidth > 0 && meta.width > req.maxWidth) {
    items.push({
      label: "Image width",
      status: "fail",
      detail: `${meta.width} px exceeds maximum ${req.maxWidth} px`,
      toolHref: "/en/tools/image-resizer",
      toolLabel: "Resize image",
    });
    recommendations.push({
      message: `Resize image width to ${req.maxWidth} px or less`,
      toolHref: "/en/tools/image-resizer",
      toolLabel: "Image Resizer",
    });
  } else if (req.minWidth > 0 && meta.width < req.minWidth) {
    items.push({
      label: "Image width",
      status: "fail",
      detail: `${meta.width} px is below minimum ${req.minWidth} px`,
    });
    recommendations.push({
      message: `Image width must be at least ${req.minWidth} px`,
      toolHref: "/en/tools/image-resizer",
      toolLabel: "Image Resizer",
    });
  } else {
    items.push({
      label: "Image width",
      status: "pass",
      detail: `${meta.width} px`,
    });
  }

  // Height
  if (req.maxHeight > 0 && meta.height > req.maxHeight) {
    items.push({
      label: "Image height",
      status: "fail",
      detail: `${meta.height} px exceeds maximum ${req.maxHeight} px`,
      toolHref: "/en/tools/image-resizer",
      toolLabel: "Resize image",
    });
    recommendations.push({
      message: `Resize image height to ${req.maxHeight} px or less`,
      toolHref: "/en/tools/image-resizer",
      toolLabel: "Image Resizer",
    });
  } else if (req.minHeight > 0 && meta.height < req.minHeight) {
    items.push({
      label: "Image height",
      status: "fail",
      detail: `${meta.height} px is below minimum ${req.minHeight} px`,
    });
    recommendations.push({
      message: `Image height must be at least ${req.minHeight} px`,
      toolHref: "/en/tools/image-resizer",
      toolLabel: "Image Resizer",
    });
  } else {
    items.push({
      label: "Image height",
      status: "pass",
      detail: `${meta.height} px`,
    });
  }

  return { items, recommendations };
}

function buildResult(
  items: CheckItem[],
  recommendations: Recommendation[]
): CheckResult {
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;
  let unknownCount = 0;

  for (const item of items) {
    switch (item.status) {
      case "pass":
        passCount++;
        break;
      case "fail":
        failCount++;
        break;
      case "warning":
        warningCount++;
        break;
      case "unknown":
        unknownCount++;
        break;
    }
  }

  return {
    items,
    passCount,
    failCount,
    warningCount,
    unknownCount,
    allPassed: failCount === 0,
    recommendations,
  };
}
