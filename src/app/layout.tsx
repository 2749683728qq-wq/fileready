import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "File Upload Assistant — Check, Compress & Convert Files for Online Uploads",
  description:
    "Free online tools to check, compress, resize, and convert images, PDFs, and signatures. Process files directly in your browser — no upload to our servers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
