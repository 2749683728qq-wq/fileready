import Script from "next/script";

/**
 * Injects JSON-LD structured data for better SEO.
 * - WebSite schema on all pages
 * - Organization schema with brand info
 * - BreadcrumbList is handled per-page
 */
export function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FileReady",
    alternateName: "文件就绪",
    url: "https://fileready.io",
    description:
      "Free online tools to check, compress, resize, and convert images, PDFs, and signatures. All processed privately in your browser.",
    inLanguage: ["en", "zh-CN"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://fileready.io/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FileReady",
    alternateName: "文件就绪",
    url: "https://fileready.io",
    logo: "https://fileready.io/favicon.svg",
    description:
      "Free online tools to help you prepare files for upload — compress, resize, convert, and check files in your browser.",
    knowsAbout: [
      "File Compression",
      "Image Resizing",
      "Format Conversion",
      "PDF Manipulation",
      "Metadata Removal",
      "Online Forms",
    ],
  };

  return (
    <>
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}
