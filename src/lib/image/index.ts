export {
  loadImage,
  compressImage,
  isSupportedImage,
  TARGET_SIZE_PRESETS,
  ImageError,
} from "./compress";
export type {
  SupportedFormat,
  CompressionStatus,
  ImageMeta,
  CompressionOptions,
  CompressionResult,
} from "./compress";

export {
  processImage,
  createPreviewUrl,
  constrainCropRect,
  parseAspectRatio,
  unitsToPixels,
  pixelsToUnits,
  ASPECT_RATIO_PRESETS,
  SIZE_UNITS,
  ResizeError,
} from "./resize";
export type {
  ResizeUnit,
  FlipMode,
  AspectRatioPreset,
  CropRect,
  ResizeOptions,
  ResizeResult,
} from "./resize";

export {
  calculateDpi,
  formatDpiNumber,
  getUnitLabel,
  getUnitName,
  STANDARD_DPIS,
} from "./dpi";
export type { LengthUnit, DpiInput, DpiRow, DpiCalculation } from "./dpi";

export {
  createCanvas,
  getCanvasContext,
  canvasToBlob,
  renderImageToBlob,
  loadImageFromFile,
} from "./canvas";

export {
  readMetadata,
  stripMetadata,
  getPrivacyRiskLabel,
  getPrivacyRiskColor,
} from "./metadata";
export type {
  PrivacyRisk,
  MetadataEntry,
  MetadataCategory,
  MetadataReport,
  StrippedResult,
} from "./metadata";

export {
  processSignature,
  generateSignaturePreview,
  autoCropWhitespace,
  SIGNATURE_PRESETS,
} from "./signature";
export type {
  ColorMode,
  SignatureOptions,
  SignatureResult,
} from "./signature";
