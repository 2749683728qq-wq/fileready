import type { Metadata } from "next";
import { PageLayout } from "@/components/layout";
import {
  ToastContainer,
  CookieConsent,
  AdSenseScript,
  GoogleAnalytics,
} from "@/components/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "FileReady — Make Every File Upload-Ready",
  description:
    "Free online tools to check, compress, resize, and convert images, PDFs, and signatures. Your files, upload-ready — all processed privately in your browser.",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fileready.vip"
  ),
  alternates: {
    languages: {
      en: "/en",
      "zh-CN": "/zh-CN",
    },
  },
  openGraph: {
    title: "FileReady — Make Every File Upload-Ready",
    description:
      "Free online tools to check, compress, resize, and convert images, PDFs, and signatures. All processed privately in your browser.",
    siteName: "FileReady",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileReady — Make Every File Upload-Ready",
    description:
      "Free online tools to check, compress, resize, and convert images, PDFs, and signatures. All processed privately in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <PageLayout>{children}</PageLayout>
        <ToastContainer />
        <CookieConsent />
        <AdSenseScript />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
