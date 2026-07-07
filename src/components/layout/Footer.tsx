import Link from "next/link";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const footerGroups: FooterLinkGroup[] = [
  {
    title: "Tools",
    links: [
      { label: "File Compliance Checker", href: "/en/check-file" },
      { label: "Image Compressor", href: "/en/tools/image-compressor" },
      { label: "Image Resizer", href: "/en/tools/image-resizer" },
      { label: "Image Converter", href: "/en/tools/image-converter" },
      { label: "Signature Processor", href: "/en/tools/signature-resizer" },
      { label: "Image to PDF", href: "/en/tools/image-to-pdf" },
      { label: "Merge PDF", href: "/en/tools/merge-pdf" },
      { label: "Split PDF", href: "/en/tools/split-pdf" },
      { label: "DPI Calculator", href: "/en/tools/dpi-calculator" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "Job Applications", href: "/en/use-cases/job-applications" },
      { label: "School Applications", href: "/en/use-cases/school-applications" },
      { label: "Exam Registration", href: "/en/use-cases/exam-registration" },
      { label: "Visa & Passport", href: "/en/use-cases/visa-passport" },
      { label: "Government Forms", href: "/en/use-cases/government-forms" },
      { label: "Everyday Office", href: "/en/use-cases/everyday-office" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/en/guides" },
      { label: "About", href: "/en/about" },
      { label: "Contact", href: "/en/contact" },
      { label: "Accessibility", href: "/en/accessibility" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/en/privacy" },
      { label: "Cookie Policy", href: "/en/cookies" },
      { label: "Terms of Use", href: "/en/terms" },
      { label: "Disclaimer", href: "/en/disclaimer" },
      { label: "Advertising Disclosure", href: "/en/advertising-disclosure" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-default bg-surface-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Link groups */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border-default pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-text-tertiary">
              &copy; {new Date().getFullYear()} File Upload Assistant. All tools
              process files locally in your browser.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/en/privacy"
                className="text-sm text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
              >
                Privacy &amp; Cookie Settings
              </Link>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-tertiary">
            Disclaimer: Tools can only inspect and process readable file
            properties. Final requirements are determined by the institution or
            platform receiving your files. This site is not affiliated with any
            government agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
