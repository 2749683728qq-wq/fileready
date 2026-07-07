import Link from "next/link";
import type { Locale } from "@/i18n";

interface LogoProps {
  locale: Locale;
  /** Show only the icon, hide text (for mobile or small spaces) */
  iconOnly?: boolean;
}

/**
 * FileReady brand logo.
 * SVG icon: a document/file shape with a checkmark in the corner,
 * symbolizing "file ready for upload".
 */
export function Logo({ locale, iconOnly = false }: LogoProps) {
  const brandName = locale === "zh-CN" ? "文件就绪" : "FileReady";

  return (
    <Link
      href={`/${locale}`}
      className="flex items-center gap-2 text-lg font-semibold text-text-primary no-underline"
      aria-label={brandName}
    >
      {/* Icon: Document + Checkmark */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Document body */}
        <rect
          x="3"
          y="2"
          width="20"
          height="26"
          rx="3"
          fill="#2563EB"
          opacity="0.12"
        />
        <rect
          x="3"
          y="2"
          width="20"
          height="26"
          rx="3"
          stroke="#2563EB"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Document fold corner */}
        <path
          d="M18 2V7C18 8.10457 18.8954 9 20 9H25"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M18 2L18.1 6.9C18.155 7.298 18.702 7.845 19.1 7.9L24 8"
          fill="#2563EB"
          opacity="0.15"
        />
        {/* Text lines (abstract) */}
        <rect x="7" y="12" width="10" height="1.5" rx="0.75" fill="#2563EB" opacity="0.4" />
        <rect x="7" y="16" width="12" height="1.5" rx="0.75" fill="#2563EB" opacity="0.4" />
        <rect x="7" y="20" width="8" height="1.5" rx="0.75" fill="#2563EB" opacity="0.4" />

        {/* Checkmark badge */}
        <circle cx="26" cy="24" r="6" fill="#14B8A6" />
        <path
          d="M23.5 24L25 25.5L28.5 22"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Brand name text */}
      {!iconOnly && (
        <span className="hidden sm:inline">{brandName}</span>
      )}
    </Link>
  );
}
