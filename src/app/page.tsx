import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  ImageIcon,
  FileImage,
  FileSignature,
  FileText,
  Combine,
  Scissors,
  ShieldCheck,
  Zap,
  Lock,
  Monitor,
  AlertCircle,
  Maximize,
  FileQuestion,
} from "lucide-react";
import { PageLayout } from "@/components/layout";

const toolCategories = [
  {
    title: "Image Tools",
    description: "Compress, resize, crop, convert, and clean image files for any upload requirement.",
    icon: ImageIcon,
    tools: [
      { label: "Image Compressor", href: "/en/tools/image-compressor" },
      { label: "Image Resizer & Cropper", href: "/en/tools/image-resizer" },
      { label: "Format Converter", href: "/en/tools/image-converter" },
      { label: "Signature Processor", href: "/en/tools/signature-resizer" },
      { label: "Metadata Remover", href: "/en/tools/remove-image-metadata" },
    ],
  },
  {
    title: "PDF Tools",
    description: "Convert images to PDF, merge multiple PDFs, split pages, and organize documents.",
    icon: FileText,
    tools: [
      { label: "Image to PDF", href: "/en/tools/image-to-pdf" },
      { label: "Merge PDFs", href: "/en/tools/merge-pdf" },
      { label: "Split & Extract PDF", href: "/en/tools/split-pdf" },
    ],
  },
  {
    title: "Check & Calculate",
    description: "Verify your files meet requirements and convert between measurement units.",
    icon: FileCheck,
    tools: [
      { label: "File Compliance Checker", href: "/en/check-file" },
      { label: "DPI & Size Calculator", href: "/en/tools/dpi-calculator" },
    ],
  },
];

const useCases = [
  {
    title: "Job Applications",
    description: "Compress resumes, merge cover letters, and adjust photos for job portals.",
    href: "/en/use-cases/job-applications",
  },
  {
    title: "School & University",
    description: "Process application photos, signatures, and documents for admissions.",
    href: "/en/use-cases/school-applications",
  },
  {
    title: "Exam Registration",
    description: "Meet strict photo and signature requirements for test registration.",
    href: "/en/use-cases/exam-registration",
  },
  {
    title: "Visa & Passport",
    description: "Check photo dimensions, file sizes, and format requirements.",
    href: "/en/use-cases/visa-passport",
  },
  {
    title: "Government Forms",
    description: "Adjust scans, fix orientations, and prepare attachments for online services.",
    href: "/en/use-cases/government-forms",
  },
  {
    title: "Everyday Office",
    description: "Compress email attachments, convert HEIC, and merge documents.",
    href: "/en/use-cases/everyday-office",
  },
];

const steps = [
  {
    icon: FileCheck,
    title: "1. Check your file",
    description: "Upload your file and see what's wrong — wrong size, format, dimensions, or orientation.",
  },
  {
    icon: Zap,
    title: "2. Fix it in one click",
    description: "Our tools recommend the right fix. Compress, resize, convert, or merge with a single action.",
  },
  {
    icon: ShieldCheck,
    title: "3. Compare and download",
    description: "See before-and-after results. Download your processed file — ready to upload.",
  },
];

export default function HomePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pb-12 pt-8 text-center md:pb-16 md:pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
          Your file won&apos;t upload?
          <br />
          <span className="text-primary-600">Let&apos;s fix that.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
          Check, compress, resize, and convert images, PDFs, and signatures —
          all processed directly in your browser. No upload to any server.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/en/check-file"
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all duration-150 hover:bg-primary-700 active:bg-primary-800"
          >
            <FileCheck className="h-5 w-5" />
            Check My File
          </Link>
          <span className="text-sm text-text-tertiary">or choose a tool below</span>
        </div>
      </section>

      {/* Problem Quick Links */}
      <section className="pb-12 md:pb-16">
        <h2 className="mb-6 text-center text-lg font-semibold text-text-primary">
          What&apos;s the problem with your file?
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "File too large", href: "/en/tools/image-compressor", icon: FileImage },
            { label: "Wrong dimensions", href: "/en/tools/image-resizer", icon: Maximize },
            { label: "Unsupported format", href: "/en/tools/image-converter", icon: FileQuestion },
            { label: "Signature issue", href: "/en/tools/signature-resizer", icon: FileSignature },
            { label: "Need to merge PDFs", href: "/en/tools/merge-pdf", icon: Combine },
            { label: "Need to split PDF", href: "/en/tools/split-pdf", icon: Scissors },
            { label: "Upload keeps failing", href: "/en/check-file", icon: AlertCircle },
            { label: "Not sure what\'s wrong", href: "/en/check-file", icon: FileCheck },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-lg border border-border-default bg-surface-card p-4 text-center transition-all duration-150 hover:border-primary-300 hover:bg-primary-50/50"
            >
              <item.icon className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tool Categories */}
      <section className="pb-12 md:pb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text-primary">
          Everything you need to prepare your files
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {toolCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-lg border border-border-default bg-surface-card p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                <category.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-text-primary">
                {category.title}
              </h3>
              <p className="mb-4 text-sm text-text-secondary">{category.description}</p>
              <ul className="space-y-1.5">
                {category.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-1 text-sm text-text-link hover:underline"
                    >
                      {tool.label}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="pb-12 md:pb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text-primary">
          Tools for every situation
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <Link
              key={useCase.href}
              href={useCase.href}
              className="rounded-lg border border-border-default bg-surface-card p-5 transition-all duration-150 hover:border-primary-300"
            >
              <h3 className="font-semibold text-text-primary">{useCase.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{useCase.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy & Local Processing */}
      <section className="rounded-xl border border-success-100 bg-success-50 px-6 py-8 text-center md:py-10">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-600">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">
            Your files never leave your device
          </h2>
          <p className="text-sm text-text-secondary">
            All image and PDF processing happens directly in your browser using
            local processing. Your files are not uploaded to any server. We
            cannot see, access, or store your documents.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text-primary">
          How it works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browser compatibility note */}
      <section className="border-t border-border-default pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-text-tertiary">
          <Monitor className="h-4 w-4" />
          <span>
            Works in Chrome, Firefox, Safari, and Edge. Best on desktop or tablet.
          </span>
        </div>
      </section>
    </PageLayout>
  );
}
