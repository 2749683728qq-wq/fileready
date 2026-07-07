"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Tools",
    children: [
      { label: "File Compliance Checker", href: "/en/check-file" },
      { label: "Image Compressor", href: "/en/tools/image-compressor" },
      { label: "Image Resizer & Cropper", href: "/en/tools/image-resizer" },
      { label: "Image Format Converter", href: "/en/tools/image-converter" },
      { label: "Signature Processor", href: "/en/tools/signature-resizer" },
      { label: "Image to PDF", href: "/en/tools/image-to-pdf" },
      { label: "Merge PDF", href: "/en/tools/merge-pdf" },
      { label: "Split & Extract PDF", href: "/en/tools/split-pdf" },
      { label: "Remove Image Metadata", href: "/en/tools/remove-image-metadata" },
      { label: "DPI & Size Calculator", href: "/en/tools/dpi-calculator" },
    ],
  },
  {
    label: "Use Cases",
    children: [
      { label: "Job Applications", href: "/en/use-cases/job-applications" },
      { label: "School Applications", href: "/en/use-cases/school-applications" },
      { label: "Exam Registration", href: "/en/use-cases/exam-registration" },
      { label: "Visa & Passport", href: "/en/use-cases/visa-passport" },
      { label: "Government Forms", href: "/en/use-cases/government-forms" },
      { label: "Everyday Office", href: "/en/use-cases/everyday-office" },
    ],
  },
  { label: "Guides", href: "/en/guides" },
  { label: "About", href: "/en/about" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-surface-card/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/en"
          className="flex items-center gap-2 text-lg font-semibold text-text-primary no-underline"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-sm font-bold text-white">
            FU
          </span>
          <span className="hidden sm:inline">File Upload Assistant</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === item.label ? null : item.label
                    )
                  }
                  aria-expanded={activeDropdown === item.label}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-0 top-full mt-1 min-w-[220px] rounded-lg border border-border-default bg-surface-card py-1 shadow-md">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="rounded-md p-2 text-text-secondary hover:bg-surface-hover md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border-default bg-surface-card md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <p className="px-3 py-1 text-xs font-semibold uppercase text-text-tertiary">
                      {item.label}
                    </p>
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-6 py-2 text-sm text-text-secondary hover:bg-surface-hover"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
