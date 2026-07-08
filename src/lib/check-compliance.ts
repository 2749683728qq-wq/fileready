/**
 * File compliance checker module.
 * Checks uploaded files against user-defined requirements.
 * Supports images (via loadImage) and basic PDF checks.
 * All processing happens in the browser — no upload to any server.
 *
 * NOTE: All user-facing strings in this module are translation keys.
 * The UI layer must call t(key) to get the localized text, and substitute
 * any {placeholders} using detailParams / messageParams.
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
  /** Translation key for the item label */
  label: string;
  status: CheckStatus;
  /** Translation key for the item detail. May contain {placeholders}. */
  detail: string;
  /** Values to interpolate into detail placeholders */
  detailParams?: Record<string, string>;
  /** Optional link to a recommended tool */
  toolHref?: string;
  /** Translation key for the tool button label */
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
  /** Translation key for the recommendation message. May contain {placeholders}. */
  message: string;
  /** Values to interpolate into message placeholders */
  messageParams?: Record<string, string>;
  toolHref: string;
  /** Translation key for the recommended tool name */
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
      label: "check.item.fileType",
      status: "fail",
      detail: "check.detail.unsupportedType",
      detailParams: { type: file.type || "unknown" },
    });
    return buildResult(items, recommendations);
  }

  const typeLabel = fileType === "image" ? "Image" : "PDF";

  if (!requirements.allowedTypes.includes(fileType)) {
    items.push({
      label: "check.item.fileType",
      status: "fail",
      detail: "check.detail.typeNotAllowed",
      detailParams: {
        type: typeLabel,
        required: requirements.allowedTypes.join(" / "),
      },
    });
    return buildResult(items, recommendations);
  }

  items.push({
    label: "check.item.fileType",
    status: "pass",
    detail: "check.detail.typeAllowed",
    detailParams: { type: typeLabel },
  });

  // ---- File extension check ----
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  items.push({
    label: "check.item.fileExtension",
    status: "pass",
    detail: "check.detail.ext",
    detailParams: { ext },
  });

  // ---- File size check ----
  if (file.size > requirements.maxSizeBytes) {
    items.push({
      label: "check.item.fileSize",
      status: "fail",
      detail: "check.detail.sizeExceeds",
      detailParams: {
        size: formatBytes(file.size),
        max: formatBytes(requirements.maxSizeBytes),
      },
      toolHref: "/en/tools/image-compressor",
      toolLabel: "check.tool.compressImage",
    });
    recommendations.push({
      message: "check.rec.size",
      messageParams: { max: formatBytes(requirements.maxSizeBytes) },
      toolHref: "/en/tools/image-compressor",
      toolLabel: "check.tool.imageCompressor",
    });
  } else {
    items.push({
      label: "check.item.fileSize",
      status: "pass",
      detail: "check.detail.sizeOk",
      detailParams: {
        size: formatBytes(file.size),
        max: formatBytes(requirements.maxSizeBytes),
      },
    });
  }

  // ---- Filename checks ----
  if (requirements.noSpacesInFilename && filenameHasSpaces(file.name)) {
    items.push({
      label: "check.item.filenameSpaces",
      status: "warning",
      detail: "check.detail.filenameHasSpaces",
    });
  } else {
    items.push({
      label: "check.item.filenameSpaces",
      status: "pass",
      detail: "check.detail.filenameNoSpaces",
    });
  }

  if (requirements.noSpecialCharsInFilename && filenameHasSpecialChars(file.name)) {
    items.push({
      label: "check.item.filenameSpecial",
      status: "warning",
      detail: "check.detail.filenameHasSpecial",
    });
  } else {
    items.push({
      label: "check.item.filenameSpecial",
      status: "pass",
      detail: "check.detail.filenameNoSpecial",
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
          label: "check.item.orientation",
          status: "fail",
          detail: "check.detail.orientationWrongLandscape",
          toolHref: "/en/tools/image-resizer",
          toolLabel: "check.tool.resizeCrop",
        });
        recommendations.push({
          message: "check.rec.rotatePortrait",
          toolHref: "/en/tools/image-resizer",
          toolLabel: "check.tool.imageResizer",
        });
      } else if (requirements.orientation === "landscape" && isPortrait) {
        items.push({
          label: "check.item.orientation",
          status: "fail",
          detail: "check.detail.orientationWrongPortrait",
          toolHref: "/en/tools/image-resizer",
          toolLabel: "check.tool.resizeCrop",
        });
        recommendations.push({
          message: "check.rec.rotateLandscape",
          toolHref: "/en/tools/image-resizer",
          toolLabel: "check.tool.imageResizer",
        });
      } else {
        items.push({
          label: "check.item.orientation",
          status: "pass",
          detail: isPortrait ? "check.detail.portrait" : "check.detail.landscape",
        });
      }

      // Aspect ratio
      if (requirements.allowedAspectRatios.length > 0) {
        const currentRatio = formatAspectRatio(meta.width, meta.height);
        if (!requirements.allowedAspectRatios.includes(currentRatio)) {
          items.push({
            label: "check.item.aspectRatio",
            status: "warning",
            detail: "check.detail.ratioNotAllowed",
            detailParams: {
              ratio: currentRatio,
              allowed: requirements.allowedAspectRatios.join(", "),
            },
            toolHref: "/en/tools/image-resizer",
            toolLabel: "check.tool.resizeCrop",
          });
        } else {
          items.push({
            label: "check.item.aspectRatio",
            status: "pass",
            detail: "check.detail.ratioMatches",
            detailParams: { ratio: currentRatio },
          });
        }
      } else {
        items.push({
          label: "check.item.aspectRatio",
          status: "pass",
          detail: "check.detail.ratioNoRestriction",
          detailParams: { ratio: formatAspectRatio(meta.width, meta.height) },
        });
      }

      // DPI
      if (meta.dpi) {
        items.push({
          label: "check.item.dpi",
          status: "unknown",
          detail: "check.detail.dpi",
          detailParams: { dpi: String(meta.dpi) },
        });
      } else {
        items.push({
          label: "check.item.dpi",
          status: "unknown",
          detail: "check.detail.noDpi",
        });
      }

      // Metadata / privacy
      if (metadataReport && metadataReport.totalEntries > 0) {
        const hasLocation = metadataReport.hasLocation;
        items.push({
          label: "check.item.locationMetadata",
          status: hasLocation ? "warning" : "pass",
          detail: hasLocation
            ? "check.detail.locationFound"
            : "check.detail.locationEntries",
          detailParams: hasLocation ? undefined : { n: String(metadataReport.totalEntries) },
          ...(hasLocation
            ? {
                toolHref: "/en/tools/remove-image-metadata",
                toolLabel: "check.tool.removeMetadata",
              }
            : {}),
        });
        if (hasLocation) {
          recommendations.push({
            message: "check.rec.removeGps",
            toolHref: "/en/tools/remove-image-metadata",
            toolLabel: "check.tool.metadataRemover",
          });
        }
      } else {
        items.push({
          label: "check.item.locationMetadata",
          status: "pass",
          detail: "check.detail.locationNone",
        });
      }
    } catch {
      items.push({
        label: "check.item.imageAnalysis",
        status: "fail",
        detail: "check.detail.imageCorrupt",
      });
    }
  }

  // ---- PDF-specific checks ----
  if (fileType === "pdf") {
    items.push({
      label: "check.item.pdfAnalysis",
      status: "unknown",
      detail: "check.detail.pdfBasic",
    });

    items.push({
      label: "check.item.orientation",
      status: "unknown",
      detail: "check.detail.pdfOrientationUnknown",
    });

    items.push({
      label: "check.item.dimensions",
      status: "unknown",
      detail: "check.detail.pdfDimensionsUnknown",
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
      label: "check.item.imageWidth",
      status: "fail",
      detail: "check.detail.widthExceeds",
      detailParams: { width: String(meta.width), max: String(req.maxWidth) },
      toolHref: "/en/tools/image-resizer",
      toolLabel: "check.tool.resizeCrop",
    });
    recommendations.push({
      message: "check.rec.width",
      messageParams: { max: String(req.maxWidth) },
      toolHref: "/en/tools/image-resizer",
      toolLabel: "check.tool.imageResizer",
    });
  } else if (req.minWidth > 0 && meta.width < req.minWidth) {
    items.push({
      label: "check.item.imageWidth",
      status: "fail",
      detail: "check.detail.widthBelow",
      detailParams: { width: String(meta.width), min: String(req.minWidth) },
    });
    recommendations.push({
      message: "check.rec.widthMin",
      messageParams: { min: String(req.minWidth) },
      toolHref: "/en/tools/image-resizer",
      toolLabel: "check.tool.imageResizer",
    });
  } else {
    items.push({
      label: "check.item.imageWidth",
      status: "pass",
      detail: "check.detail.widthOk",
      detailParams: { width: String(meta.width) },
    });
  }

  // Height
  if (req.maxHeight > 0 && meta.height > req.maxHeight) {
    items.push({
      label: "check.item.imageHeight",
      status: "fail",
      detail: "check.detail.heightExceeds",
      detailParams: { height: String(meta.height), max: String(req.maxHeight) },
      toolHref: "/en/tools/image-resizer",
      toolLabel: "check.tool.resizeCrop",
    });
    recommendations.push({
      message: "check.rec.height",
      messageParams: { max: String(req.maxHeight) },
      toolHref: "/en/tools/image-resizer",
      toolLabel: "check.tool.imageResizer",
    });
  } else if (req.minHeight > 0 && meta.height < req.minHeight) {
    items.push({
      label: "check.item.imageHeight",
      status: "fail",
      detail: "check.detail.heightBelow",
      detailParams: { height: String(meta.height), min: String(req.minHeight) },
    });
    recommendations.push({
      message: "check.rec.heightMin",
      messageParams: { min: String(req.minHeight) },
      toolHref: "/en/tools/image-resizer",
      toolLabel: "check.tool.imageResizer",
    });
  } else {
    items.push({
      label: "check.item.imageHeight",
      status: "pass",
      detail: "check.detail.heightOk",
      detailParams: { height: String(meta.height) },
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
