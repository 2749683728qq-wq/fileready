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
      desc: "Compress JPG, PNG, and WebP images to a target file size online. Free, private, browser-based tool. Reduce image size without losing quality. Start compressing now.",
    },
    "zh-CN": {
      title: "图片压缩 — 在线减小文件大小",
      desc: "在线将 JPG、PNG、WebP 图片压缩到目标大小，不损失画质。完全免费，所有处理在浏览器本地完成，文件不上传服务器。立即压缩您的图片。",
    },
  },
  "image-resizer": {
    en: {
      title: "Image Resizer & Cropper — Resize Online",
      desc: "Crop, resize, rotate, and flip images online. Set exact dimensions in pixels, mm, cm, or inches. Free, private, all processing happens in your browser. Try it now.",
    },
    "zh-CN": {
      title: "图片调整与裁剪 — 在线调整尺寸",
      desc: "在线裁剪、调整大小、旋转和翻转图片。支持像素、毫米、厘米、英寸精确设置尺寸。免费、私密，所有处理在浏览器中完成。立即试用。",
    },
  },
  "image-converter": {
    en: {
      title: "Image Format Converter — JPG, PNG, WebP Online",
      desc: "Convert images between JPEG, PNG, and WebP formats instantly. Free, private browser-based conversion — your files never leave your device. Convert your image now.",
    },
    "zh-CN": {
      title: "图片格式转换 — JPG、PNG、WebP 在线互转",
      desc: "在 JPEG、PNG、WebP 格式之间快速互转图片。完全免费，私密安全——所有转换在浏览器中完成，文件不会离开您的设备。立即转换。",
    },
  },
  "image-to-pdf": {
    en: {
      title: "Image to PDF Converter — Convert Online Free",
      desc: "Convert one or more images into a single PDF online. Choose page size, orientation, and margins. Free, private — all processing happens in your browser. Start now.",
    },
    "zh-CN": {
      title: "图片转 PDF — 在线免费转换",
      desc: "将一张或多张图片在线转换为单个 PDF 文件。自定义页面大小、方向和边距。免费、私密，所有处理在浏览器中完成，无需上传。立即转换。",
    },
  },
  "merge-pdf": {
    en: {
      title: "Merge PDF — Combine PDF Files Online Free",
      desc: "Combine multiple PDF files into a single document online. Drag to reorder pages. Free, private — all processing happens in your browser. Merge your PDFs now.",
    },
    "zh-CN": {
      title: "合并 PDF — 在线免费合并 PDF 文件",
      desc: "在线将多个 PDF 文件合并为一个文档，拖拽即可排序页面。完全免费，私密安全——所有处理在浏览器中完成。立即合并您的 PDF。",
    },
  },
  "split-pdf": {
    en: {
      title: "Split PDF — Extract Pages Online Free",
      desc: "Extract specific pages from a PDF or split by page range online. Free, private browser-based tool — your PDF stays on your device. Split your PDF now.",
    },
    "zh-CN": {
      title: "拆分 PDF — 在线免费提取页面",
      desc: "在线从 PDF 中提取特定页面或按页码范围拆分。完全免费，私密安全——您的 PDF 不会离开设备。立即拆分您的 PDF。",
    },
  },
  "signature-resizer": {
    en: {
      title: "Signature Processor — Clean & Resize Online",
      desc: "Upload a signature photo, remove background, convert to black & white, and resize for forms. Free, private — all processing happens in your browser. Try it now.",
    },
    "zh-CN": {
      title: "签名处理 — 在线清理与调整签名",
      desc: "上传签名照片，自动去除背景、转为黑白、调整为表单所需尺寸。完全免费，私密安全——所有处理在浏览器中完成。立即处理您的签名。",
    },
  },
  "remove-image-metadata": {
    en: {
      title: "Remove Image Metadata — Strip EXIF Online",
      desc: "Remove GPS location, camera details, and timestamps from your images before sharing online. Free, private — all processing in your browser. Clean your image now.",
    },
    "zh-CN": {
      title: "移除图片元数据 — 在线清除 EXIF 信息",
      desc: "在分享前移除图片中的 GPS 位置、相机详情和时间戳等隐私信息。完全免费，私密安全——所有处理在浏览器中完成。立即清理您的图片。",
    },
  },
  "dpi-calculator": {
    en: {
      title: "DPI Calculator — Convert Pixels to Print Size",
      desc: "Convert between pixels and physical dimensions (mm, cm, inches) at any DPI. Free online tool for photographers and designers. Calculate your image size now.",
    },
    "zh-CN": {
      title: "DPI 换算器 — 像素与打印尺寸互转",
      desc: "在任何 DPI 下将像素与物理尺寸（毫米、厘米、英寸）互相转换。免费在线工具，适合摄影师和设计师使用。立即计算您的图片尺寸。",
    },
  },
};

export const infoMeta: Record<
  string,
  { en: { title: string; desc: string }; "zh-CN": { title: string; desc: string } }
> = {
  about: {
    en: { title: "About FileReady — Free Online File Tools", desc: "FileReady helps you check, compress, resize, and convert images, PDFs, and signatures — all processed privately in your browser. No upload to any server. Learn more about our free tools." },
    "zh-CN": { title: "关于文件就绪 — 免费在线文件工具", desc: "文件就绪帮您检查、压缩、调整、转换图片、PDF 和签名——全部在浏览器中私密处理，无需上传。了解更多关于我们的免费工具。" },
  },
  privacy: {
    en: { title: "Privacy Policy — Your Files Stay on Your Device", desc: "FileReady processes all files locally in your browser. No upload to any server. No cookies that track you. No personal data collection. Read our full privacy policy." },
    "zh-CN": { title: "隐私政策 — 您的文件不会离开设备", desc: "文件就绪完全在浏览器中本地处理文件。不会上传到任何服务器。无跟踪性 Cookie。不收集个人数据。阅读我们的完整隐私政策。" },
  },
  terms: {
    en: { title: "Terms of Use — FileReady Free Online Tools", desc: "Terms and conditions for using FileReady's free online file preparation tools. Read about acceptable use, disclaimers, and your rights as a user of our services." },
    "zh-CN": { title: "使用条款 — 文件就绪免费在线工具", desc: "使用文件就绪免费在线文件准备工具的条款与条件。了解可接受的使用方式、免责声明以及您作为用户的权利。" },
  },
  disclaimer: {
    en: { title: "Disclaimer — FileReady Independent Online Tools", desc: "FileReady is an independent tool not affiliated with any government agency or institution. We do not guarantee that processed files will be accepted by any third-party system." },
    "zh-CN": { title: "免责声明 — 文件就绪独立在线工具", desc: "文件就绪是一个独立工具，与任何政府机构或组织无关。我们不保证处理后的文件会被任何第三方系统接受。" },
  },
  contact: {
    en: { title: "Contact Us — FileReady Support & Feedback", desc: "Get in touch with the FileReady team. We welcome your questions, suggestions, and feedback about our free online file tools. Reach out and we'll respond promptly." },
    "zh-CN": { title: "联系我们 — 文件就绪支持与反馈", desc: "与文件就绪团队取得联系。欢迎您对我们的免费在线文件工具提出问题、建议和反馈。联系我们，我们会及时回复。" },
  },
  guides: {
    en: { title: "Guides — File Preparation Tips & Tutorials", desc: "Step-by-step guides to help you prepare files for online uploads. Learn how to compress images, convert formats, merge PDFs, remove metadata, and more. Free tutorials." },
    "zh-CN": { title: "指南 — 文件准备技巧与教程", desc: "逐步指南，帮您为在线上传准备文件。学习如何压缩图片、转换格式、合并 PDF、移除元数据等。免费教程。" },
  },
};

export const useCaseMeta: Record<
  string,
  { en: { title: string; desc: string }; "zh-CN": { title: string; desc: string } }
> = {
  "job-applications": {
    en: { title: "Job Application File Tools — Resumes & Photos", desc: "Compress resumes, merge cover letters, and adjust photos for job portals. Free, private file tools for job seekers — all processing happens in your browser." },
    "zh-CN": { title: "求职申请文件工具 — 简历与照片处理", desc: "压缩简历、合并求职信、调整照片以符合求职平台要求。免费、私密的求职文件工具——所有处理在浏览器中完成。" },
  },
  "school-applications": {
    en: { title: "School Application File Tools — Admissions Ready", desc: "Process application photos, signatures, and documents for university admissions. Free, private tools to help you meet school application file requirements." },
    "zh-CN": { title: "学校申请文件工具 — 入学材料准备", desc: "处理申请照片、签名和文件以符合大学入学要求。免费、私密的工具，帮您满足学校申请的文件要求。" },
  },
  "exam-registration": {
    en: { title: "Exam Registration File Tools — Photos & Signatures", desc: "Meet strict photo and signature requirements for test registration. Free, private file tools for exam candidates — all processing in your browser." },
    "zh-CN": { title: "考试报名文件工具 — 照片与签名处理", desc: "满足考试报名严格的照片和签名要求。免费、私密的考生文件工具——所有处理在浏览器中完成。" },
  },
  "visa-passport": {
    en: { title: "Visa & Passport Photo Tools — Application Ready", desc: "Check and adjust photo dimensions, file sizes, and format requirements for visa and passport applications. Free, private browser-based tools for travelers." },
    "zh-CN": { title: "签证与护照照片工具 — 申请材料准备", desc: "检查和调整签证与护照申请的照片尺寸、文件大小和格式要求。免费、私密的浏览器端工具，为出行者准备。" },
  },
  "government-forms": {
    en: { title: "Government Form File Tools — Documents Ready", desc: "Adjust scans, fix orientations, and prepare attachments for online government services. Free, private tools to help you submit forms correctly." },
    "zh-CN": { title: "政府表格文件工具 — 文档准备就绪", desc: "调整扫描件、修正方向、准备在线政府服务的附件。免费、私密的工具，帮您正确提交表格文件。" },
  },
  "everyday-office": {
    en: { title: "Everyday Office File Tools — Daily Productivity", desc: "Compress email attachments, convert HEIC, merge documents. Free daily file tools for office workers — all processing happens privately in your browser." },
    "zh-CN": { title: "日常办公文件工具 — 每日效率提升", desc: "压缩邮件附件、转换 HEIC、合并文档。免费的日常办公文件工具——所有处理在浏览器中私密完成。" },
  },
};

export const checkFileMeta = {
  en: {
    title: "File Compliance Checker — Check Upload Requirements",
    desc: "Upload your file and check if it meets size, format, and dimension requirements. Free, private, browser-based compliance checker. Verify your file before uploading to any online system.",
  },
  "zh-CN": {
    title: "文件合规检查器 — 检查上传要求",
    desc: "上传文件，检查是否满足大小、格式和尺寸要求。免费、私密、浏览器端的合规检查工具。在上传到任何在线系统之前验证您的文件。",
  },
};
