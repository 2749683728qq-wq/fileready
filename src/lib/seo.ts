import type { Metadata } from "next";

const SITE_NAME = "FileReady";
const SITE_URL = "https://fileready.vip";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface PageMeta {
  title: string;
  description: string;
  path: string;
  locale?: "en" | "zh-CN";
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Generate consistent SEO metadata for any page.
 */
export function generatePageMeta({
  title,
  description,
  path,
  locale = "en",
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const titleTemplate = locale === "zh-CN" ? `%s | ${SITE_NAME}` : `%s | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}${path.replace(/^\/zh-CN/, "/en")}`,
        "zh-CN": `${SITE_URL}${path.replace(/^\/en/, "/zh-CN")}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "zh-CN" ? "zh_CN" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/**
 * Tool page descriptions (bilingual).
 */
export const toolMeta: Record<
  string,
  { en: { title: string; desc: string }; "zh-CN": { title: string; desc: string } }
> = {
  "image-compressor": {
    en: {
      title: "Image Compressor — Reduce File Size Online",
      desc: "Compress JPG, PNG, and WebP images to a target file size. Free, private — all processing happens in your browser.",
    },
    "zh-CN": {
      title: "图片压缩 — 在线减小文件大小",
      desc: "将 JPG、PNG 和 WebP 图片压缩到目标文件大小。免费、私密——所有处理都在浏览器中完成。",
    },
  },
  "image-resizer": {
    en: {
      title: "Image Resizer & Cropper — Resize Images Online",
      desc: "Crop, resize, rotate, and flip your images. Set exact dimensions in pixels, mm, cm, or inches. Free and private.",
    },
    "zh-CN": {
      title: "图片调整与裁剪 — 在线调整图片尺寸",
      desc: "裁剪、调整大小、旋转和翻转图片。以像素、毫米、厘米或英寸设置精确尺寸。免费且私密。",
    },
  },
  "image-converter": {
    en: {
      title: "Image Format Converter — Convert JPG, PNG, WebP Online",
      desc: "Convert images between JPEG, PNG, and WebP formats. Free, private browser-based conversion.",
    },
    "zh-CN": {
      title: "图片格式转换 — 在线转换 JPG、PNG、WebP",
      desc: "在 JPEG、PNG 和 WebP 格式之间转换图片。免费、私密的浏览器端转换。",
    },
  },
  "image-to-pdf": {
    en: {
      title: "Image to PDF Converter — Convert Images to PDF Online",
      desc: "Convert one or more images into a single PDF. Choose page size, orientation, and margins. Free and private.",
    },
    "zh-CN": {
      title: "图片转 PDF — 在线将图片转换为 PDF",
      desc: "将一张或多张图片转换为单个 PDF。选择页面大小、方向和边距。免费且私密。",
    },
  },
  "merge-pdf": {
    en: {
      title: "Merge PDF — Combine PDF Files Online",
      desc: "Combine multiple PDF files into a single document. Drag to reorder. All processing happens in your browser.",
    },
    "zh-CN": {
      title: "合并 PDF — 在线合并 PDF 文件",
      desc: "将多个 PDF 文件合并为一个文档。拖拽排序。所有处理都在浏览器中完成。",
    },
  },
  "split-pdf": {
    en: {
      title: "Split & Extract PDF — Split PDF Pages Online",
      desc: "Extract specific pages from a PDF or split by page range. Free, private browser-based tool.",
    },
    "zh-CN": {
      title: "拆分与提取 PDF — 在线拆分 PDF 页面",
      desc: "从 PDF 中提取特定页面或按页码范围拆分。免费、私密的浏览器端工具。",
    },
  },
  "signature-resizer": {
    en: {
      title: "Signature Processor — Clean & Resize Signatures Online",
      desc: "Upload a signature photo, remove background, convert to B&W, and resize for forms. Free and private.",
    },
    "zh-CN": {
      title: "签名处理 — 在线清理与调整签名",
      desc: "上传签名照片，去除背景、转为黑白、调整为表单所需尺寸。免费且私密。",
    },
  },
  "remove-image-metadata": {
    en: {
      title: "Remove Image Metadata — Strip EXIF Data Online",
      desc: "Remove GPS location, camera details, and timestamps from your images before sharing. Free and private.",
    },
    "zh-CN": {
      title: "移除图片元数据 — 在线清除 EXIF 数据",
      desc: "在分享前移除图片中的 GPS 位置、相机详情和时间戳。免费且私密。",
    },
  },
  "dpi-calculator": {
    en: {
      title: "DPI & Size Calculator — Convert Pixels to Print Sizes",
      desc: "Convert between pixels and physical dimensions (mm, cm, inches) at any DPI. Free online tool.",
    },
    "zh-CN": {
      title: "DPI 与尺寸换算器 — 像素与打印尺寸转换",
      desc: "在任何 DPI 下转换像素与物理尺寸（毫米、厘米、英寸）。免费在线工具。",
    },
  },
};

export const infoMeta: Record<
  string,
  { en: { title: string; desc: string }; "zh-CN": { title: string; desc: string } }
> = {
  about: {
    en: { title: "About FileReady", desc: "Free, private online tools to prepare files for upload. All processing happens in your browser." },
    "zh-CN": { title: "关于文件就绪", desc: "免费、私密的在线文件准备工具。所有处理都在浏览器中完成。" },
  },
  privacy: {
    en: { title: "Privacy Policy", desc: "FileReady processes all files locally in your browser. No upload to any server. Your files stay private." },
    "zh-CN": { title: "隐私政策", desc: "文件就绪完全在浏览器中本地处理文件。不会上传到任何服务器。您的文件保持私密。" },
  },
  terms: {
    en: { title: "Terms of Use", desc: "Terms and conditions for using FileReady's free online file preparation tools." },
    "zh-CN": { title: "使用条款", desc: "使用文件就绪免费在线文件准备工具的条款与条件。" },
  },
  disclaimer: {
    en: { title: "Disclaimer", desc: "FileReady is an independent tool not affiliated with any government agency or institution." },
    "zh-CN": { title: "免责声明", desc: "文件就绪是一个独立工具，与任何政府机构或组织无关。" },
  },
  contact: {
    en: { title: "Contact Us", desc: "Get in touch with the FileReady team. Questions, suggestions, or feedback welcome." },
    "zh-CN": { title: "联系我们", desc: "与文件就绪团队取得联系。欢迎提出问题、建议或反馈。" },
  },
  guides: {
    en: { title: "Guides — File Preparation Tips", desc: "Step-by-step guides to help you prepare files for online uploads. Compress, resize, convert, and more." },
    "zh-CN": { title: "指南 — 文件准备技巧", desc: "逐步指南，帮助您为在线上传准备文件。压缩、调整大小、转换等。" },
  },
};

export const useCaseMeta: Record<
  string,
  { en: { title: string; desc: string }; "zh-CN": { title: string; desc: string } }
> = {
  "job-applications": {
    en: { title: "Job Application File Tools", desc: "Compress resumes, merge cover letters, and adjust photos for job portals. Free and private." },
    "zh-CN": { title: "求职申请文件工具", desc: "压缩简历、合并求职信、调整照片以符合求职平台要求。免费且私密。" },
  },
  "school-applications": {
    en: { title: "School Application File Tools", desc: "Process application photos, signatures, and documents for university admissions." },
    "zh-CN": { title: "学校申请文件工具", desc: "处理申请照片、签名和文件以符合大学入学要求。" },
  },
  "exam-registration": {
    en: { title: "Exam Registration File Tools", desc: "Meet strict photo and signature requirements for test registration. Free and private." },
    "zh-CN": { title: "考试报名文件工具", desc: "满足考试报名严格的照片和签名要求。免费且私密。" },
  },
  "visa-passport": {
    en: { title: "Visa & Passport Photo Tools", desc: "Check and adjust photo dimensions, file sizes, and format requirements for visa applications." },
    "zh-CN": { title: "签证与护照照片工具", desc: "检查和调整签证申请的照片尺寸、文件大小和格式要求。" },
  },
  "government-forms": {
    en: { title: "Government Form File Tools", desc: "Adjust scans, fix orientations, and prepare attachments for online government services." },
    "zh-CN": { title: "政府表格文件工具", desc: "调整扫描件、修正方向、准备在线政府服务的附件。" },
  },
  "everyday-office": {
    en: { title: "Everyday Office File Tools", desc: "Compress email attachments, convert HEIC, merge documents. Free daily file tools." },
    "zh-CN": { title: "日常办公文件工具", desc: "压缩邮件附件、转换 HEIC、合并文档。免费的日常文件工具。" },
  },
};

export const checkFileMeta = {
  en: {
    title: "File Compliance Checker — Check Upload Requirements",
    desc: "Upload your file and check if it meets size, format, and dimension requirements. Free, private, browser-based.",
  },
  "zh-CN": {
    title: "文件合规检查器 — 检查上传要求",
    desc: "上传文件，检查是否满足大小、格式和尺寸要求。免费、私密、浏览器端。",
  },
};
