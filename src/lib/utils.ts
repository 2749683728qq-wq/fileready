type ClassValue = string | number | boolean | undefined | null;

/**
 * Merges class names, filtering out falsy values.
 * Lightweight replacement for clsx + tailwind-merge for our needs.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format bytes to human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Format image dimensions.
 */
export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height} px`;
}

/**
 * Format aspect ratio as a ratio string.
 */
export function formatAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(width, height);
  const w = width / d;
  const h = height / d;
  // Simplify common ratios
  if (w === 4 && h === 3) return "4:3";
  if (w === 3 && h === 4) return "3:4";
  if (w === 16 && h === 9) return "16:9";
  if (w === 1 && h === 1) return "1:1 (Square)";
  return `${w}:${h}`;
}

/**
 * Get file extension from filename.
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * Truncate filename for display, keeping extension visible.
 */
export function truncateFilename(filename: string, maxLen = 40): string {
  if (filename.length <= maxLen) return filename;
  const ext = getFileExtension(filename);
  const name = filename.slice(0, filename.lastIndexOf("."));
  const extPart = ext ? `.${ext}` : "";
  const available = maxLen - extPart.length - 3; // 3 for "..."
  if (available <= 0) return `...${extPart}`;
  return `${name.slice(0, available)}...${extPart}`;
}

/**
 * Check if we're running in a browser environment.
 */
export const isBrowser = typeof window !== "undefined";
