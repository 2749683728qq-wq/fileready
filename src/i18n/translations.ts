/**
 * Translation dictionaries for FileReady.
 * Keys follow a flat namespace convention: "section.key"
 */

export type Locale = "en" | "zh-CN";

// Translation value can be a string or an array of strings
type TranslationValue = string | string[];

export type TranslationEntry = Record<Locale, TranslationValue>;

// ============================================================
// Common / Layout
// ============================================================

const common = {
  "brand.name": { en: "FileReady", "zh-CN": "文件就绪" },
  "brand.tagline": {
    en: "Your files, upload-ready.",
    "zh-CN": "文件准备好，上传没烦恼。",
  },
  "nav.home": { en: "Home", "zh-CN": "首页" },
  "nav.tools": { en: "Tools", "zh-CN": "工具" },
  "nav.useCases": { en: "Use Cases", "zh-CN": "使用场景" },
  "nav.guides": { en: "Guides", "zh-CN": "指南" },
  "nav.about": { en: "About", "zh-CN": "关于" },
  "footer.tools": { en: "Tools", "zh-CN": "工具" },
  "footer.useCases": { en: "Use Cases", "zh-CN": "使用场景" },
  "footer.resources": { en: "Resources", "zh-CN": "资源" },
  "footer.legal": { en: "Legal", "zh-CN": "法律" },
  "footer.copyright": { en: "All rights reserved.", "zh-CN": "保留所有权利。" },
  "footer.disclaimer": {
    en: "This site is not affiliated with any government agency. Tools process files locally in your browser.",
    "zh-CN": "本网站与任何政府机构无关。工具在您的浏览器中本地处理文件。",
  },
  "privacy.local": {
    en: "Your files stay on your device",
    "zh-CN": "您的文件不会离开您的设备",
  },
  "privacy.localDesc": {
    en: "All processing happens locally in your browser. Your files are never uploaded to any server. We cannot see, access, or store your files.",
    "zh-CN": "所有处理都在您的浏览器中本地完成。您的文件绝不会被上传到任何服务器。我们无法查看、访问或存储您的文件。",
  },
  "breadcrumb.home": { en: "Home", "zh-CN": "首页" },
  "breadcrumb.tools": { en: "Tools", "zh-CN": "工具" },
  "breadcrumb.label": { en: "Breadcrumb", "zh-CN": "面包屑导航" },
  "breadcrumb.backToGuides": { en: "Back to guides", "zh-CN": "返回指南" },
  "related.title": { en: "Related tools", "zh-CN": "相关工具" },
  "lastUpdated": { en: "Last updated", "zh-CN": "最后更新" },
  "nav.switchLang": { en: "中文", "zh-CN": "English" },
  "upload.dropzone": {
    en: "Choose a file or drag and drop",
    "zh-CN": "选择文件或拖放到此处",
  },
  "upload.dropHere": {
    en: "Drop your file here",
    "zh-CN": "将文件拖放到此处",
  },
  "upload.formats": {
    en: "Accepted formats",
    "zh-CN": "支持的格式",
  },
  "upload.formatsAll": {
    en: "All supported formats accepted",
    "zh-CN": "接受所有支持的格式",
  },
  "button.download": { en: "Download", "zh-CN": "下载" },
  "button.cancel": { en: "Cancel", "zh-CN": "取消" },
  "button.retry": { en: "Try Again", "zh-CN": "重试" },
  "button.reset": { en: "Start Over", "zh-CN": "重新开始" },
  "button.changeFile": { en: "Change file", "zh-CN": "更换文件" },
  "button.change": { en: "Change", "zh-CN": "更换" },
  "button.remove": { en: "Remove", "zh-CN": "移除" },
  "button.removeFile": { en: "Remove file", "zh-CN": "移除文件" },
  "button.close": { en: "Close", "zh-CN": "关闭" },
  "button.processAnother": { en: "Process Another File", "zh-CN": "处理另一个文件" },
  "button.convertMore": { en: "Convert More", "zh-CN": "转换更多" },
  "button.mergeMore": { en: "Merge More", "zh-CN": "合并更多" },
  "button.extractMore": { en: "Extract More", "zh-CN": "提取更多" },
  "button.processAnotherShort": { en: "Process Another", "zh-CN": "再处理一个" },
  "state.reading": { en: "Reading file information...", "zh-CN": "正在读取文件信息..." },
  "state.readingFile": { en: "Reading file...", "zh-CN": "正在读取文件..." },
  "state.processing": { en: "Processing...", "zh-CN": "正在处理..." },
  "state.cancelled": { en: "Operation cancelled", "zh-CN": "操作已取消" },
  "state.cancelledDesc": {
    en: "Your original file is unchanged.",
    "zh-CN": "您的原始文件未做任何更改。",
  },
  "state.done": { en: "Complete!", "zh-CN": "完成！" },
  "state.downloadStarted": { en: "Download started", "zh-CN": "下载已开始" },
  "state.downloadNotStarted": {
    en: "If the download didn't start,",
    "zh-CN": "如果下载未开始，",
  },
  "state.clickHere": { en: "click here", "zh-CN": "点击此处" },
  "state.clickHereDownload": {
    en: "click here to download again",
    "zh-CN": "点击此处重新下载",
  },
  "error.fileTooLarge": {
    en: "File is too large",
    "zh-CN": "文件太大",
  },
  "error.fileTooLargeWithMax": {
    en: "File is too large. Maximum size is",
    "zh-CN": "文件太大。最大支持",
  },
  "error.unsupportedFormat": {
    en: "Unsupported format",
    "zh-CN": "不支持的格式",
  },
  "error.unsupportedFormatHint": {
    en: "Unsupported format. Use JPG, PNG, or WebP.",
    "zh-CN": "不支持的格式。请使用 JPG、PNG 或 WebP。",
  },
  "error.failedToLoad": {
    en: "Failed to load image. The file may be corrupted.",
    "zh-CN": "无法加载图片。文件可能已损坏。",
  },
  "error.unexpected": {
    en: "An unexpected error occurred.",
    "zh-CN": "发生了意外错误。",
  },
  "error.unexpectedCompress": {
    en: "An unexpected error occurred during compression.",
    "zh-CN": "压缩过程中发生了意外错误。",
  },
  "error.unexpectedConvert": {
    en: "An unexpected error occurred.",
    "zh-CN": "转换过程中发生了意外错误。",
  },
  "error.unexpectedResize": {
    en: "An error occurred",
    "zh-CN": "处理过程中发生错误",
  },
  "error.unexpectedCheck": {
    en: "An unexpected error occurred during the check.",
    "zh-CN": "检查过程中发生了意外错误。",
  },
  "error.processingFailed": {
    en: "Processing failed",
    "zh-CN": "处理失败",
  },
  "error.conversionCancelled": {
    en: "Conversion cancelled",
    "zh-CN": "转换已取消",
  },
  "error.mergeCancelled": {
    en: "Merge cancelled",
    "zh-CN": "合并已取消",
  },
  "error.splitCancelled": {
    en: "Split cancelled",
    "zh-CN": "拆分已取消",
  },
  "error.somethingWentWrong": {
    en: "Something went wrong",
    "zh-CN": "出了点问题",
  },
  "error.tryAgain": { en: "Try again", "zh-CN": "重试" },
  "ad.placeholder": { en: "Advertisement", "zh-CN": "广告" },
  "ui.property": { en: "Property", "zh-CN": "属性" },
  "ui.before": { en: "Before", "zh-CN": "处理前" },
  "ui.after": { en: "After", "zh-CN": "处理后" },
  "ui.fileSize": { en: "File size", "zh-CN": "文件大小" },
  "ui.dimensions": { en: "Dimensions", "zh-CN": "尺寸" },
  "ui.processingTime": { en: "Processing time", "zh-CN": "处理耗时" },
  "ui.format": { en: "Format", "zh-CN": "格式" },
  "ui.quality": { en: "Quality", "zh-CN": "质量" },
  "ui.background": { en: "Background", "zh-CN": "背景" },
  "ui.colorMode": { en: "Color Mode", "zh-CN": "颜色模式" },
  "ui.autoCropped": { en: "Auto-cropped", "zh-CN": "自动裁剪" },
  "ui.metadataEntries": { en: "Metadata Entries", "zh-CN": "元数据条目" },
  "ui.gpsLocation": { en: "GPS Location", "zh-CN": "GPS 位置" },
  "ui.cameraInfo": { en: "Camera Info", "zh-CN": "相机信息" },
  "ui.timestamps": { en: "Timestamps", "zh-CN": "时间戳" },
  "ui.removed": { en: "Removed", "zh-CN": "已移除" },
  "ui.present": { en: "Present", "zh-CN": "存在" },
  "ui.none": { en: "None", "zh-CN": "无" },
  "ui.yes": { en: "Yes", "zh-CN": "是" },
  "ui.no": { en: "No", "zh-CN": "否" },
  "ui.original": { en: "Original", "zh-CN": "原始" },
  "ui.whiteColored": { en: "White/Colored", "zh-CN": "白色/彩色" },
  "ui.transparent": { en: "Transparent", "zh-CN": "透明" },
  "ui.progress": { en: "Progress", "zh-CN": "进度" },
  "ui.notifications": { en: "Notifications", "zh-CN": "通知" },
  "ui.dismiss": { en: "Dismiss", "zh-CN": "关闭" },
  "ui.closeDialog": { en: "Close dialog", "zh-CN": "关闭对话框" },
  "ui.tips": { en: "Tips", "zh-CN": "提示" },
  "ui.preview": { en: "Preview", "zh-CN": "预览" },
  "ui.uploadToPreview": {
    en: "Upload an image to preview",
    "zh-CN": "上传图片以预览",
  },
  "ui.checkerboard": {
    en: "Checkerboard = transparent background",
    "zh-CN": "棋盘格 = 透明背景",
  },
  "ui.cropEditorHint": {
    en: "Crop editor. Use arrow keys to nudge, hold Shift for larger steps.",
    "zh-CN": "裁剪编辑器。使用方向键微调，按住 Shift 键大步移动。",
  },
  "ui.cropPreview": { en: "Crop preview", "zh-CN": "裁剪预览" },
  "ui.noMetadata": {
    en: "No metadata found in this image.",
    "zh-CN": "此图片中未找到元数据。",
  },
  "ui.noMetadataDesc": {
    en: "This image either has no embedded metadata, or it has already been stripped.",
    "zh-CN": "此图片没有嵌入元数据，或元数据已被清除。",
  },
  "ui.entries": { en: "entries", "zh-CN": "项" },
  "ui.entry": { en: "entry", "zh-CN": "项" },
  "privacy.staysOnDevice": {
    en: "Your files stay on your device",
    "zh-CN": "您的文件不会离开您的设备",
  },
  "privacy.allLocal": {
    en: "All processing happens in your browser. No upload to any server.",
    "zh-CN": "所有处理都在浏览器中完成。不会上传到任何服务器。",
  },
  "privacy.localNotice": {
    en: "All file analysis happens locally in your browser. Your files are never uploaded to any server.",
    "zh-CN": "所有文件分析都在浏览器本地完成。您的文件绝不会被上传到任何服务器。",
  },
  "privacy.localBrief": {
    en: "All conversion happens locally in your browser. Your images are never uploaded.",
    "zh-CN": "所有转换都在浏览器本地完成。您的图片绝不会被上传。",
  },
  "privacy.everythingLocal": {
    en: "Everything stays on your device",
    "zh-CN": "一切都在您的设备上处理",
  },
  "privacy.private": {
    en: "Your files stay private",
    "zh-CN": "您的文件保持私密",
  },
  "privacy.privateDesc": {
    en: "All compression happens directly in your browser. Your images are never uploaded to any server. We cannot see, access, or store your files.",
    "zh-CN": "所有压缩直接在您的浏览器中完成。您的图片绝不会被上传到任何服务器。我们无法查看、访问或存储您的文件。",
  },
};

// ============================================================
// Homepage
// ============================================================

const home = {
  "home.hero.title": {
    en: "Your file won't upload?",
    "zh-CN": "文件上传不上去？",
  },
  "home.hero.subtitle": {
    en: "Let's fix that.",
    "zh-CN": "我们来帮您解决。",
  },
  "home.hero.desc": {
    en: "Check, compress, resize, and convert images, PDFs, and signatures — all processed directly in your browser. No upload to any server.",
    "zh-CN": "检查、压缩、调整大小、转换图片、PDF 和签名——全部在您的浏览器中直接处理，无需上传到任何服务器。",
  },
  "home.hero.cta": {
    en: "Check My File",
    "zh-CN": "检查我的文件",
  },
  "home.hero.hint": {
    en: "or choose a tool below",
    "zh-CN": "或选择下方工具",
  },
  "home.problems.title": {
    en: "What's the problem with your file?",
    "zh-CN": "您的文件遇到了什么问题？",
  },
  "home.problems.tooLarge": { en: "File too large", "zh-CN": "文件太大" },
  "home.problems.wrongDimensions": { en: "Wrong dimensions", "zh-CN": "尺寸不对" },
  "home.problems.unsupportedFormat": { en: "Unsupported format", "zh-CN": "格式不支持" },
  "home.problems.signature": { en: "Signature issue", "zh-CN": "签名问题" },
  "home.problems.mergePdf": { en: "Need to merge PDFs", "zh-CN": "需要合并 PDF" },
  "home.problems.splitPdf": { en: "Need to split PDF", "zh-CN": "需要拆分 PDF" },
  "home.problems.uploadFails": { en: "Upload keeps failing", "zh-CN": "上传总是失败" },
  "home.problems.notSure": { en: "Not sure what's wrong", "zh-CN": "不知道哪里有问题" },
  "home.categories.title": {
    en: "Everything you need to prepare your files",
    "zh-CN": "准备文件所需的一切工具",
  },
  "home.categories.imageTools": { en: "Image Tools", "zh-CN": "图片工具" },
  "home.categories.imageToolsDesc": {
    en: "Compress, resize, crop, convert, and clean image files for any upload requirement.",
    "zh-CN": "压缩、调整大小、裁剪、转换和清理图片文件，满足各种上传要求。",
  },
  "home.categories.pdfTools": { en: "PDF Tools", "zh-CN": "PDF 工具" },
  "home.categories.pdfToolsDesc": {
    en: "Convert images to PDF, merge multiple PDFs, split pages, and organize documents.",
    "zh-CN": "将图片转为 PDF、合并多个 PDF、拆分页面、整理文档。",
  },
  "home.categories.checkCalc": { en: "Check & Calculate", "zh-CN": "检查与计算" },
  "home.categories.checkCalcDesc": {
    en: "Verify your files meet requirements and convert between measurement units.",
    "zh-CN": "验证文件是否符合要求，在不同度量单位之间转换。",
  },
  "home.useCases.title": {
    en: "Tools for every situation",
    "zh-CN": "适用于各种场景的工具",
  },
  "home.privacy.title": {
    en: "Your files never leave your device",
    "zh-CN": "您的文件永远不会离开您的设备",
  },
  "home.privacy.desc": {
    en: "All image and PDF processing happens directly in your browser using local processing. Your files are not uploaded to any server. We cannot see, access, or store your documents.",
    "zh-CN": "所有图片和 PDF 处理都在您的浏览器中本地完成。您的文件不会被上传到任何服务器。我们无法查看、访问或存储您的文档。",
  },
  "home.howItWorks.title": {
    en: "How it works",
    "zh-CN": "如何使用",
  },
  "home.step1.title": { en: "1. Check your file", "zh-CN": "1. 检查文件" },
  "home.step1.desc": {
    en: "Upload your file and see what's wrong — wrong size, format, dimensions, or orientation.",
    "zh-CN": "上传文件，查看问题所在——大小、格式、尺寸或方向不对。",
  },
  "home.step2.title": { en: "2. Fix it in one click", "zh-CN": "2. 一键修复" },
  "home.step2.desc": {
    en: "Our tools recommend the right fix. Compress, resize, convert, or merge with a single action.",
    "zh-CN": "我们的工具会推荐正确的修复方式。一键压缩、调整大小、转换或合并。",
  },
  "home.step3.title": { en: "3. Compare and download", "zh-CN": "3. 对比并下载" },
  "home.step3.desc": {
    en: "See before-and-after results. Download your processed file — ready to upload.",
    "zh-CN": "查看处理前后对比。下载处理好的文件——即可上传。",
  },
  "home.browser.title": {
    en: "Works in Chrome, Firefox, Safari, and Edge. Best on desktop or tablet.",
    "zh-CN": "支持 Chrome、Firefox、Safari 和 Edge 浏览器。推荐在电脑或平板上使用。",
  },
};

// ============================================================
// Tool: Image Compressor
// ============================================================

const compressor = {
  "compressor.title": { en: "Image Compressor", "zh-CN": "图片压缩" },
  "compressor.desc": {
    en: "Compress JPG, PNG, and WebP images to a target file size. Processing happens entirely in your browser — your files are never uploaded.",
    "zh-CN": "将 JPG、PNG 和 WebP 图片压缩到目标文件大小。所有处理都在您的浏览器中完成——您的文件绝不会被上传。",
  },
  "compressor.targetSize": { en: "Target file size", "zh-CN": "目标文件大小" },
  "compressor.custom": { en: "Custom:", "zh-CN": "自定义：" },
  "compressor.compress": { en: "Compress", "zh-CN": "压缩" },
  "compressor.compressTo": {
    en: "Compress to",
    "zh-CN": "压缩至",
  },
  "compressor.orLess": {
    en: "or less",
    "zh-CN": "以内",
  },
  "compressor.compressBtn": { en: "Compress Image", "zh-CN": "压缩图片" },
  "compressor.downloadCompressed": { en: "Download Compressed Image", "zh-CN": "下载压缩后的图片" },
  "compressor.compressAnother": { en: "Compress Another File", "zh-CN": "压缩另一个文件" },
  "compressor.compressing": { en: "Compressing...", "zh-CN": "正在压缩..." },
  "compressor.findingQuality": {
    en: "Finding optimal quality settings... This usually takes a few seconds.",
    "zh-CN": "正在寻找最佳质量设置... 通常需要几秒钟。",
  },
  "compressor.cancelled": { en: "Compression cancelled", "zh-CN": "压缩已取消" },
  "compressor.cancelledDesc": {
    en: "Your original file is unchanged. You can adjust settings and try again.",
    "zh-CN": "您的原始文件未做任何更改。您可以调整设置后重试。",
  },
  "compressor.complete": { en: "Compression complete!", "zh-CN": "压缩完成！" },
  "compressor.completeDesc": {
    en: "Your image has been compressed from",
    "zh-CN": "您的图片已从",
  },
  "compressor.to": { en: "to", "zh-CN": "压缩至" },
  "compressor.closeToTarget": {
    en: "close to target of",
    "zh-CN": "接近目标",
  },
  "compressor.withinTarget": {
    en: "within target of",
    "zh-CN": "在目标范围内",
  },
  "compressor.alreadySmall": {
    en: "This file is already smaller than the target size. No compression needed. You can still compress to a smaller target if needed.",
    "zh-CN": "此文件已经小于目标大小，无需压缩。如果需要，您仍可以压缩到更小的目标。",
  },
  "compressor.fileSize": { en: "File size", "zh-CN": "文件大小" },
  "compressor.dimensions": { en: "Dimensions", "zh-CN": "尺寸" },
  "compressor.format": { en: "Format", "zh-CN": "格式" },
  "compressor.qualityLevel": { en: "Quality level", "zh-CN": "质量等级" },
  "compressor.processingTime": { en: "Processing time", "zh-CN": "处理耗时" },
  "compressor.reducedBy": { en: "Reduced by", "zh-CN": "减小了" },
  "compressor.iterations": { en: "after {n} quality iterations", "zh-CN": "经过 {n} 次质量迭代" },
  "compressor.transparencyWarning": {
    en: "The original image had transparent areas. JPEG does not support transparency — transparent areas have been filled with white. Export as PNG to preserve transparency.",
    "zh-CN": "原始图片有透明区域。JPEG 不支持透明——透明区域已用白色填充。如需保留透明，请导出为 PNG。",
  },
  "compressor.transparency": { en: "Transparency", "zh-CN": "透明" },
  "compressor.howToTitle": { en: "How to compress your image", "zh-CN": "如何压缩您的图片" },
  "compressor.howToSteps": {
    en: [
      "Upload or drag and drop your JPG, PNG, or WebP image.",
      "Choose a target size from the presets or enter a custom size in KB.",
      "Click \"Compress\" — the tool finds the best quality setting automatically.",
      "Review the before-and-after comparison.",
      "Download your compressed image.",
    ],
    "zh-CN": [
      "上传或拖放您的 JPG、PNG 或 WebP 图片。",
      "从预设中选择目标大小，或输入自定义 KB 值。",
      "点击「压缩」——工具会自动找到最佳质量设置。",
      "查看处理前后对比。",
      "下载压缩后的图片。",
    ],
  },
  "compressor.whatHappensTitle": { en: "What happens during compression?", "zh-CN": "压缩过程中发生了什么？" },
  "compressor.whatHappensItems": {
    en: [
      "Quality reduction: The tool gradually reduces JPEG/WebP quality until the file is within the target size.",
      "Dimension reduction (if needed): If quality alone isn't enough, the image dimensions are slightly reduced.",
      "Smart optimization: The algorithm finds the best balance between file size and visual quality.",
    ],
    "zh-CN": [
      "质量降低：工具会逐步降低 JPEG/WebP 质量，直到文件大小在目标范围内。",
      "尺寸缩减（如需要）：如果仅靠质量调整不够，图片尺寸会略微缩小。",
      "智能优化：算法会找到文件大小和视觉质量之间的最佳平衡。",
    ],
  },
  "compressor.commonIssuesTitle": { en: "Common issues", "zh-CN": "常见问题" },
  "compressor.commonIssuesItems": {
    en: [
      "Can't reach target size: Very large images may not compress to extremely small targets without significant quality loss. Try a larger target size.",
      "Transparency lost: If you convert a PNG with transparency to JPEG, transparent areas become white. Use PNG output to keep transparency.",
      "PNG compression limits: PNG uses lossless compression. Size reduction for PNGs is limited compared to JPEG/WebP.",
    ],
    "zh-CN": [
      "无法达到目标大小：非常大的图片可能无法压缩到极小目标而不显著损失质量。请尝试更大的目标大小。",
      "透明度丢失：如果将带透明的 PNG 转为 JPEG，透明区域会变为白色。请使用 PNG 输出以保留透明度。",
      "PNG 压缩限制：PNG 使用无损压缩。与 JPEG/WebP 相比，PNG 的大小缩减有限。",
    ],
  },
  "compressor.faqTitle": { en: "FAQ", "zh-CN": "常见问答" },
  "compressor.faq1Q": { en: "Will compression reduce image quality?", "zh-CN": "压缩会降低图片质量吗？" },
  "compressor.faq1A": {
    en: "Yes, some quality reduction is necessary to reduce file size. The tool tries to find the best balance. For most online uploads (forms, portals, emails), the quality difference is barely noticeable.",
    "zh-CN": "是的，减小文件大小必然会有一定程度的质量降低。工具会尽量找到最佳平衡点。对于大多数在线上传（表单、门户、邮件），质量差异几乎看不出来。",
  },
  "compressor.faq2Q": { en: "Why is the result slightly above the target size?", "zh-CN": "为什么结果略高于目标大小？" },
  "compressor.faq2A": {
    en: "For some images, the tool may not be able to hit the exact target without unacceptable quality loss. The result will be as close as possible to your target.",
    "zh-CN": "对于某些图片，工具可能无法在不造成不可接受的质量损失的情况下精确达到目标。结果会尽可能接近您的目标。",
  },
  "compressor.faq3Q": { en: "Is my file uploaded to a server?", "zh-CN": "我的文件会被上传到服务器吗？" },
  "compressor.faq3A": {
    en: "No. All processing happens in your browser using the Canvas API. Your file never leaves your device.",
    "zh-CN": "不会。所有处理都在您的浏览器中使用 Canvas API 完成。您的文件永远不会离开您的设备。",
  },
  "compressor.unsupportedHint": {
    en: "Supported formats: JPG, JPEG, PNG, WebP. For HEIC files, please convert them first using another tool.",
    "zh-CN": "支持的格式：JPG、JPEG、PNG、WebP。HEIC 文件请先用其他工具转换。",
  },
};

// ============================================================
// Tool: Image Resizer
// ============================================================

const resizer = {
  "resizer.title": { en: "Image Resizer & Cropper", "zh-CN": "图片调整与裁剪" },
  "resizer.desc": {
    en: "Crop, resize, rotate, and flip your images. Adjust dimensions in pixels, millimeters, centimeters, or inches. All processing happens in your browser.",
    "zh-CN": "裁剪、调整大小、旋转和翻转您的图片。可以以像素、毫米、厘米或英寸为单位调整尺寸。所有处理都在浏览器中完成。",
  },
  "resizer.crop": { en: "Crop", "zh-CN": "裁剪" },
  "resizer.aspectRatio": { en: "Aspect Ratio", "zh-CN": "宽高比" },
  "resizer.cropSize": { en: "Crop Size", "zh-CN": "裁剪尺寸" },
  "resizer.rotateFlip": { en: "Rotate & Flip", "zh-CN": "旋转与翻转" },
  "resizer.rotate90": { en: "Rotate 90° clockwise", "zh-CN": "顺时针旋转 90°" },
  "resizer.flipHorizontal": { en: "Flip horizontal", "zh-CN": "水平翻转" },
  "resizer.flipVertical": { en: "Flip vertical", "zh-CN": "垂直翻转" },
  "resizer.resetCrop": { en: "Reset crop", "zh-CN": "重置裁剪" },
  "resizer.resize": { en: "Resize", "zh-CN": "调整大小" },
  "resizer.rotate": { en: "Rotate", "zh-CN": "旋转" },
  "resizer.flip": { en: "Flip", "zh-CN": "翻转" },
  "resizer.outputDims": { en: "Output Dimensions", "zh-CN": "输出尺寸" },
  "resizer.width": { en: "Width", "zh-CN": "宽度" },
  "resizer.height": { en: "Height", "zh-CN": "高度" },
  "resizer.dpi": { en: "DPI", "zh-CN": "DPI" },
  "resizer.dpiLabel": { en: "DPI:", "zh-CN": "DPI：" },
  "resizer.unitPixels": { en: "Pixels (px)", "zh-CN": "像素 (px)" },
  "resizer.unitMm": { en: "Millimeters (mm)", "zh-CN": "毫米 (mm)" },
  "resizer.unitCm": { en: "Centimeters (cm)", "zh-CN": "厘米 (cm)" },
  "resizer.unitIn": { en: "Inches (in)", "zh-CN": "英寸 (in)" },
  "resizer.pixels": { en: "pixels", "zh-CN": "像素" },
  "resizer.original": { en: "Original:", "zh-CN": "原始：" },
  "resizer.atDpi": {
    en: "At {dpi} DPI, {px}px ≈ {mm}mm",
    "zh-CN": "在 {dpi} DPI 下，{px}px ≈ {mm}mm",
  },
  "resizer.lockAspect": { en: "Lock aspect ratio", "zh-CN": "锁定宽高比" },
  "resizer.unlockAspect": { en: "Unlock aspect ratio", "zh-CN": "解锁宽高比" },
  "resizer.process": { en: "Resize Image", "zh-CN": "调整图片" },
  "resizer.applying": {
    en: "Applying crop, resize, and transformations",
    "zh-CN": "正在应用裁剪、调整和变换",
  },
  "resizer.success": { en: "Image resized successfully!", "zh-CN": "图片调整成功！" },
  "resizer.successDesc": {
    en: "Your image has been processed.",
    "zh-CN": "您的图片已处理完成。",
  },
  "resizer.downloadResized": { en: "Download Resized Image", "zh-CN": "下载调整后的图片" },
  "resizer.howToTitle": { en: "How to use", "zh-CN": "如何使用" },
  "resizer.howToSteps": {
    en: [
      "Upload your image.",
      "Drag the crop handles or choose a preset aspect ratio.",
      "Set output dimensions in pixels, mm, cm, or inches.",
      "Rotate or flip if needed.",
      "Click \"Resize Image\" to process.",
      "Download the result.",
    ],
    "zh-CN": [
      "上传您的图片。",
      "拖动裁剪手柄或选择预设宽高比。",
      "以像素、毫米、厘米或英寸为单位设置输出尺寸。",
      "根据需要旋转或翻转。",
      "点击「调整图片」进行处理。",
      "下载结果。",
    ],
  },
  "resizer.keyboardTitle": { en: "Keyboard shortcuts", "zh-CN": "键盘快捷键" },
  "resizer.keyboardItems": {
    en: [
      "Arrow keys: Nudge crop by 1 pixel",
      "Shift + Arrow keys: Nudge crop by 10 pixels",
      "Tab: Focus the crop editor first",
    ],
    "zh-CN": [
      "方向键：每次微调 1 像素",
      "Shift + 方向键：每次微调 10 像素",
      "Tab：先聚焦裁剪编辑器",
    ],
  },
  "resizer.faq1Q": { en: "What DPI should I use?", "zh-CN": "应该使用多少 DPI？" },
  "resizer.faq1A": {
    en: "For digital uploads, DPI is typically ignored — websites care about pixel dimensions. Use 96 DPI for screen display or 300 DPI for print.",
    "zh-CN": "对于数字上传，DPI 通常被忽略——网站关心的是像素尺寸。屏幕显示使用 96 DPI，打印使用 300 DPI。",
  },
  "resizer.faq2Q": { en: "Will quality be lost?", "zh-CN": "会损失质量吗？" },
  "resizer.faq2A": {
    en: "Downscaling (making smaller) generally preserves quality. Upscaling (making larger) may reduce sharpness.",
    "zh-CN": "缩小尺寸通常能保持质量。放大尺寸可能会降低清晰度。",
  },
};

// ============================================================
// Tool: Format Converter
// ============================================================

const converter = {
  "converter.title": { en: "Image Format Converter", "zh-CN": "图片格式转换" },
  "converter.desc": {
    en: "Convert your images between JPEG, PNG, and WebP formats. All processing happens in your browser.",
    "zh-CN": "在 JPEG、PNG 和 WebP 格式之间转换图片。所有处理都在浏览器中完成。",
  },
  "converter.convertTo": { en: "Convert to", "zh-CN": "转换为" },
  "converter.outputFormat": { en: "Output format", "zh-CN": "输出格式" },
  "converter.sameFormatHint": {
    en: "Same as current format (re-encode)",
    "zh-CN": "与当前格式相同（重新编码）",
  },
  "converter.quality": { en: "Quality", "zh-CN": "质量" },
  "converter.convert": { en: "Convert", "zh-CN": "转换" },
  "converter.converting": { en: "Converting...", "zh-CN": "正在转换..." },
  "converter.cancelled": { en: "Conversion cancelled", "zh-CN": "转换已取消" },
  "converter.cancelledDesc": {
    en: "Your original file is unchanged. Adjust settings and try again.",
    "zh-CN": "您的原始文件未做任何更改。调整设置后重试。",
  },
  "converter.failed": { en: "Conversion failed", "zh-CN": "转换失败" },
  "converter.complete": { en: "Conversion complete!", "zh-CN": "转换完成！" },
  "converter.sameFormat": {
    en: "Converting to the same format will re-encode the image, which can reduce file size and remove metadata.",
    "zh-CN": "转换为相同格式会重新编码图片，可以减小文件大小并移除元数据。",
  },
  "converter.pngLossless": {
    en: "PNG is a lossless format — quality control is not needed. The output will be identical to the original image.",
    "zh-CN": "PNG 是无损格式——不需要质量控制。输出将与原始图片完全相同。",
  },
  "converter.smaller": { en: "Smaller file", "zh-CN": "更小的文件" },
  "converter.better": { en: "Better quality", "zh-CN": "更好的质量" },
  "converter.downloadConverted": { en: "Download Converted File", "zh-CN": "下载转换后的文件" },
  "converter.convertAnother": { en: "Convert Another", "zh-CN": "转换另一个" },
  "converter.aboutTitle": { en: "About image format conversion", "zh-CN": "关于图片格式转换" },
  "converter.about1Q": { en: "Which format should I choose?", "zh-CN": "我应该选择哪种格式？" },
  "converter.about1A": {
    en: "JPEG is best for photos and most online uploads (smaller file size). PNG is best when you need transparency or lossless quality. WebP offers better compression than both but may not be accepted by all systems.",
    "zh-CN": "JPEG 最适合照片和大多数在线上传（文件更小）。PNG 适合需要透明或无损质量的场景。WebP 提供比两者更好的压缩率，但可能不被所有系统接受。",
  },
  "converter.about2Q": { en: "Will I lose quality when converting?", "zh-CN": "转换时会损失质量吗？" },
  "converter.about2A": {
    en: "Converting to JPEG or WebP may reduce quality slightly. Converting to PNG from any format will not lose quality (PNG is lossless).",
    "zh-CN": "转换为 JPEG 或 WebP 可能会略微降低质量。从任何格式转换为 PNG 不会损失质量（PNG 是无损格式）。",
  },
};

// ============================================================
// Tool: Signature Processor
// ============================================================

const signature = {
  "signature.title": { en: "Signature Processor", "zh-CN": "签名处理" },
  "signature.desc": {
    en: "Upload a photo of your signature, and we'll clean it up — remove the background, convert to black and white, and resize it for forms.",
    "zh-CN": "上传签名照片，我们会帮您清理——去除背景、转为黑白、调整为表单所需尺寸。",
  },
  "signature.autoCrop": { en: "Auto-Crop", "zh-CN": "自动裁剪" },
  "signature.autoCropDesc": {
    en: "Automatically crop whitespace around signature",
    "zh-CN": "自动裁剪签名周围的空白区域",
  },
  "signature.padding": { en: "Padding", "zh-CN": "边距" },
  "signature.bgRemove": { en: "Background Removal", "zh-CN": "背景移除" },
  "signature.bgRemoveDesc": {
    en: "Make white background transparent",
    "zh-CN": "将白色背景变为透明",
  },
  "signature.threshold": { en: "Threshold", "zh-CN": "阈值" },
  "signature.moreAggressive": { en: "More aggressive", "zh-CN": "更激进" },
  "signature.lessAggressive": { en: "Less aggressive", "zh-CN": "更保守" },
  "signature.colorMode": { en: "Color Mode", "zh-CN": "颜色模式" },
  "signature.colorModeLabel": { en: "Color mode", "zh-CN": "颜色模式" },
  "signature.original": { en: "Original Colors", "zh-CN": "原始颜色" },
  "signature.originalHint": { en: "Keep the original colors", "zh-CN": "保留原始颜色" },
  "signature.grayscale": { en: "Grayscale", "zh-CN": "灰度" },
  "signature.grayscaleHint": { en: "Convert to shades of gray", "zh-CN": "转换为灰色调" },
  "signature.bw": { en: "Black & White", "zh-CN": "黑白" },
  "signature.bwHint": { en: "Pure black and white", "zh-CN": "纯黑白" },
  "signature.bwThreshold": { en: "B&W Threshold", "zh-CN": "黑白阈值" },
  "signature.darker": { en: "Darker", "zh-CN": "更深" },
  "signature.lighter": { en: "Lighter", "zh-CN": "更浅" },
  "signature.contrast": { en: "Contrast", "zh-CN": "对比度" },
  "signature.outputSize": { en: "Output Size", "zh-CN": "输出尺寸" },
  "signature.preset": { en: "Preset", "zh-CN": "预设" },
  "signature.widthPx": { en: "Width (px)", "zh-CN": "宽度 (px)" },
  "signature.heightPx": { en: "Height (px)", "zh-CN": "高度 (px)" },
  "signature.maintainAspect": { en: "Maintain aspect ratio", "zh-CN": "保持宽高比" },
  "signature.process": { en: "Process Signature", "zh-CN": "处理签名" },
  "signature.processing": { en: "Processing signature...", "zh-CN": "正在处理签名..." },
  "signature.cancelled": { en: "Processing cancelled", "zh-CN": "处理已取消" },
  "signature.failed": { en: "Processing failed", "zh-CN": "处理失败" },
  "signature.success": { en: "Signature processed!", "zh-CN": "签名处理完成！" },
  "signature.downloadPng": { en: "Download Signature (PNG)", "zh-CN": "下载签名 (PNG)" },
  "signature.processAnother": { en: "Process Another", "zh-CN": "处理另一个" },
  "signature.preview": { en: "Preview", "zh-CN": "预览" },
  "signature.checkerboard": {
    en: "Checkerboard = transparent background",
    "zh-CN": "棋盘格 = 透明背景",
  },
  "signature.tipsTitle": { en: "Tips for best results", "zh-CN": "获得最佳效果的建议" },
  "signature.tips.whiteBg": {
    en: "Sign on a plain white piece of paper for the cleanest result. Avoid lined or colored paper.",
    "zh-CN": "在纯白纸上签名以获得最清晰的效果。避免使用有线条或彩色纸张。",
  },
  "signature.tips.lighting": {
    en: "Good lighting reduces shadows. Natural daylight works best.",
    "zh-CN": "良好的光线可以减少阴影。自然日光效果最好。",
  },
  "signature.tips.format": {
    en: "Signatures are always exported as PNG files to preserve transparency.",
    "zh-CN": "签名始终以 PNG 格式导出以保留透明度。",
  },
};

// ============================================================
// Tool: Metadata Remover
// ============================================================

const metadata = {
  "metadata.title": { en: "Remove Image Metadata", "zh-CN": "移除图片元数据" },
  "metadata.desc": {
    en: "Photos often contain hidden data — GPS location, camera details, and timestamps. Remove all metadata before sharing your images online.",
    "zh-CN": "照片通常包含隐藏数据——GPS 位置、相机详情和时间戳。在在线分享图片之前移除所有元数据。",
  },
  "metadata.privacyWarning": {
    en: "Why remove metadata?",
    "zh-CN": "为什么要移除元数据？",
  },
  "metadata.privacyWarningDesc": {
    en: "Images taken with phones and cameras often embed GPS coordinates, device serial numbers, and timestamps. This data can reveal your location, identity, and habits when shared online.",
    "zh-CN": "用手机和相机拍摄的照片通常会嵌入 GPS 坐标、设备序列号和时间戳。这些数据在在线分享时可能会泄露您的位置、身份和习惯。",
  },
  "metadata.privacyRisk": { en: "Privacy risk detected", "zh-CN": "检测到隐私风险" },
  "metadata.found": {
    en: "Metadata found in this image",
    "zh-CN": "在此图片中找到的元数据",
  },
  "metadata.foundCount": {
    en: "All {n} metadata entries removed successfully.",
    "zh-CN": "已成功移除全部 {n} 项元数据。",
  },
  "metadata.foundEntry": { en: "entry", "zh-CN": "项" },
  "metadata.foundEntries": { en: "entries", "zh-CN": "项" },
  "metadata.foundLabel": { en: "found.", "zh-CN": "已找到。" },
  "metadata.remove": {
    en: "Remove All Metadata",
    "zh-CN": "移除所有元数据",
  },
  "metadata.removeCount": {
    en: "Remove All Metadata ({n} entries)",
    "zh-CN": "移除所有元数据（{n} 项）",
  },
  "metadata.noMetadata": {
    en: "No metadata to remove",
    "zh-CN": "没有可移除的元数据",
  },
  "metadata.removing": { en: "Removing metadata...", "zh-CN": "正在移除元数据..." },
  "metadata.failed": { en: "Failed to remove metadata", "zh-CN": "移除元数据失败" },
  "metadata.removed": { en: "Metadata removed!", "zh-CN": "元数据已移除！" },
  "metadata.downloadClean": { en: "Download Clean File", "zh-CN": "下载清理后的文件" },
  "metadata.removeAnother": { en: "Remove Metadata from Another", "zh-CN": "为另一文件移除元数据" },
  "metadata.entries": { en: "entries", "zh-CN": "项" },
  "metadata.entry": { en: "entry", "zh-CN": "项" },
  "metadata.aboutTitle": { en: "About image metadata", "zh-CN": "关于图片元数据" },
  "metadata.help.title": { en: "About image metadata", "zh-CN": "关于图片元数据" },
  "metadata.help.what": {
    en: "Metadata (also called EXIF data) is hidden information embedded in image files by cameras and phones. It can include GPS coordinates, camera make and model, serial numbers, date and time the photo was taken, and software used to edit it.",
    "zh-CN": "元数据（也称为 EXIF 数据）是相机和手机嵌入图片文件中的隐藏信息。它可能包含 GPS 坐标、相机品牌和型号、序列号、照片拍摄日期和时间，以及用于编辑照片的软件。",
  },
  "metadata.help.how": {
    en: "We redraw your image on a Canvas element in your browser and export it as a new file. This process naturally strips all embedded metadata without modifying the image content. The visual quality of your image remains unchanged.",
    "zh-CN": "我们在您的浏览器中将图片重新绘制到 Canvas 上，然后导出为新文件。此过程会自然地剥离所有嵌入的元数据，而不会修改图片内容。图片的视觉质量保持不变。",
  },
};

// ============================================================
// Tool: DPI Calculator
// ============================================================

const dpi = {
  "dpi.title": { en: "DPI & Size Calculator", "zh-CN": "DPI 与尺寸换算器" },
  "dpi.desc": {
    en: "Convert between pixels and physical dimensions (mm, cm, inches) at any DPI. See how your image scales across common print and screen resolutions.",
    "zh-CN": "在任何 DPI 下转换像素与物理尺寸（毫米、厘米、英寸）。查看您的图片在不同打印和屏幕分辨率下的缩放情况。",
  },
  "dpi.enterDims": { en: "Enter dimensions", "zh-CN": "输入尺寸" },
  "dpi.width": { en: "Width", "zh-CN": "宽度" },
  "dpi.height": { en: "Height", "zh-CN": "高度" },
  "dpi.pixelsHint": { en: "pixels", "zh-CN": "像素" },
  "dpi.unit": { en: "Unit", "zh-CN": "单位" },
  "dpi.dpiLabel": { en: "DPI", "zh-CN": "DPI" },
  "dpi.dpiHint": {
    en: "Dots per inch (72-600 typical)",
    "zh-CN": "每英寸点数（通常 72-600）",
  },
  "dpi.calculate": { en: "Calculate", "zh-CN": "计算" },
  "dpi.dimsAt": { en: "Dimensions at {dpi} DPI", "zh-CN": "{dpi} DPI 下的尺寸" },
  "dpi.pixels": { en: "Pixels", "zh-CN": "像素" },
  "dpi.millimeters": { en: "Millimeters", "zh-CN": "毫米" },
  "dpi.centimeters": { en: "Centimeters", "zh-CN": "厘米" },
  "dpi.inches": { en: "Inches", "zh-CN": "英寸" },
  "dpi.commonDpi": { en: "Size at common DPI values", "zh-CN": "常见 DPI 值下的尺寸" },
  "dpi.current": { en: "(current)", "zh-CN": "（当前）" },
  "dpi.megapixels": { en: "Megapixels", "zh-CN": "百万像素" },
  "dpi.megapixelsLabel": { en: "Megapixels:", "zh-CN": "百万像素：" },
  "dpi.aspectRatio": { en: "Aspect Ratio", "zh-CN": "宽高比" },
  "dpi.aspectRatioLabel": { en: "Aspect Ratio:", "zh-CN": "宽高比：" },
  "dpi.dpiTh": { en: "DPI", "zh-CN": "DPI" },
  "dpi.pixelsTh": { en: "Pixels (px)", "zh-CN": "像素 (px)" },
  "dpi.unitPixels": { en: "Pixels (px)", "zh-CN": "像素 (px)" },
  "dpi.unitMm": { en: "Millimeters (mm)", "zh-CN": "毫米 (mm)" },
  "dpi.unitCm": { en: "Centimeters (cm)", "zh-CN": "厘米 (cm)" },
  "dpi.unitIn": { en: "Inches (in)", "zh-CN": "英寸 (in)" },
  "dpi.mmTh": { en: "mm", "zh-CN": "毫米" },
  "dpi.cmTh": { en: "cm", "zh-CN": "厘米" },
  "dpi.inTh": { en: "in", "zh-CN": "英寸" },
  "dpi.aboutTitle": { en: "About DPI and size conversion", "zh-CN": "关于 DPI 与尺寸换算" },
  "dpi.about1Q": { en: "What is DPI?", "zh-CN": "什么是 DPI？" },
  "dpi.about1A": {
    en: "DPI (Dots Per Inch) is a measure of print resolution. For digital images displayed on screens, DPI metadata doesn't affect how the image looks — only pixel dimensions matter. DPI becomes relevant when printing.",
    "zh-CN": "DPI（每英寸点数）是打印分辨率的度量。对于在屏幕上显示的数字图像，DPI 元数据不会影响图像的显示效果——只有像素尺寸才重要。DPI 在打印时才有意义。",
  },
  "dpi.about2Q": { en: "How do I convert between pixels and physical size?", "zh-CN": "如何在像素和物理尺寸之间转换？" },
  "dpi.about2A": {
    en: "Use the formula: pixels = (physical_size_in_inches) × DPI. For example, at 300 DPI, a 1-inch square image needs 300×300 pixels. Use the calculator above to convert automatically.",
    "zh-CN": "使用公式：像素 = （物理尺寸/英寸）× DPI。例如，在 300 DPI 下，1 英寸正方形的图片需要 300×300 像素。使用上面的计算器可以自动转换。",
  },
};

// ============================================================
// Tool: Image to PDF
// ============================================================

const imageToPdf = {
  "img2pdf.title": { en: "Image to PDF", "zh-CN": "图片转 PDF" },
  "img2pdf.desc": {
    en: "Convert one or more images into a single PDF document. Choose page size, orientation, and margins.",
    "zh-CN": "将一张或多张图片转换为单个 PDF 文档。选择页面大小、方向和边距。",
  },
  "img2pdf.pageSettings": { en: "Page Settings", "zh-CN": "页面设置" },
  "img2pdf.pageSize": { en: "Page Size", "zh-CN": "页面大小" },
  "img2pdf.orientation": { en: "Orientation", "zh-CN": "方向" },
  "img2pdf.imageFit": { en: "Image Fit", "zh-CN": "图片适配" },
  "img2pdf.margin": { en: "Margin", "zh-CN": "边距" },
  "img2pdf.marginPt": { en: "Margin: {n}pt", "zh-CN": "边距：{n}pt" },
  "img2pdf.ptHint": { en: "1pt ≈ 0.35mm", "zh-CN": "1pt ≈ 0.35mm" },
  "img2pdf.moveUp": { en: "Move up", "zh-CN": "上移" },
  "img2pdf.moveDown": { en: "Move down", "zh-CN": "下移" },
  "img2pdf.convert": { en: "Convert to PDF", "zh-CN": "转换为 PDF" },
  "img2pdf.creating": { en: "Creating PDF...", "zh-CN": "正在创建 PDF..." },
  "img2pdf.failed": { en: "Conversion failed", "zh-CN": "转换失败" },
  "img2pdf.success": { en: "PDF created!", "zh-CN": "PDF 已创建！" },
  "img2pdf.downloadPdf": { en: "Download PDF", "zh-CN": "下载 PDF" },
  "img2pdf.convertMore": { en: "Convert More", "zh-CN": "转换更多" },
  "img2pdf.images": { en: "images", "zh-CN": "张图片" },
  "img2pdf.image": { en: "image", "zh-CN": "张图片" },
  "img2pdf.aboutTitle": { en: "About Image to PDF", "zh-CN": "关于图片转 PDF" },
  "img2pdf.fitToImage": { en: "Fit to image", "zh-CN": "适应图片" },
  "img2pdf.portrait": { en: "Portrait", "zh-CN": "纵向" },
  "img2pdf.landscape": { en: "Landscape", "zh-CN": "横向" },
  "img2pdf.contain": { en: "Contain (show all)", "zh-CN": "包含（显示全部）" },
  "img2pdf.cover": { en: "Cover (fill page)", "zh-CN": "覆盖（填满页面）" },
  "img2pdf.fill": { en: "Fill (stretch)", "zh-CN": "填充（拉伸）" },
  "img2pdf.about1Q": { en: "What page size should I use?", "zh-CN": "应该使用什么页面大小？" },
  "img2pdf.about1A": {
    en: "A4 is standard in most countries. Letter is common in the US and Canada. Fit to image creates each page at the exact size of your image.",
    "zh-CN": "A4 是大多数国家的标准。Letter 在美国和加拿大常用。适应图片会让每页大小与图片一致。",
  },
  "img2pdf.about2Q": { en: "Can I add more images later?", "zh-CN": "可以后续添加更多图片吗？" },
  "img2pdf.about2A": {
    en: "Yes. Upload your first image, then use the upload area to add more. You can reorder images before converting.",
    "zh-CN": "可以。上传第一张图片后，使用上传区域添加更多。您可以在转换前重新排序图片。",
  },
};

// ============================================================
// Tool: Merge PDF
// ============================================================

const mergePdf = {
  "merge.title": { en: "Merge PDFs", "zh-CN": "合并 PDF" },
  "merge.desc": {
    en: "Combine multiple PDF files into a single document. Drag to reorder — all processing happens in your browser.",
    "zh-CN": "将多个 PDF 文件合并为一个文档。拖拽排序——所有处理都在浏览器中完成。",
  },
  "merge.files": { en: "files", "zh-CN": "个文件" },
  "merge.file": { en: "file", "zh-CN": "个文件" },
  "merge.totalPages": { en: "total", "zh-CN": "页" },
  "merge.moveUp": { en: "Move up", "zh-CN": "上移" },
  "merge.moveDown": { en: "Move down", "zh-CN": "下移" },
  "merge.merge": { en: "Merge", "zh-CN": "合并" },
  "merge.mergeBtn": { en: "Merge {n} PDFs", "zh-CN": "合并 {n} 个 PDF" },
  "merge.reading": { en: "Reading PDF files...", "zh-CN": "正在读取 PDF 文件..." },
  "merge.merging": { en: "Merging PDFs...", "zh-CN": "正在合并 PDF..." },
  "merge.failed": { en: "Merge failed", "zh-CN": "合并失败" },
  "merge.success": { en: "PDFs merged!", "zh-CN": "PDF 已合并！" },
  "merge.downloadMerged": { en: "Download Merged PDF", "zh-CN": "下载合并后的 PDF" },
  "merge.aboutTitle": { en: "About PDF merging", "zh-CN": "关于 PDF 合并" },
  "merge.about1Q": { en: "Is there a limit to how many PDFs I can merge?", "zh-CN": "合并 PDF 有数量限制吗？" },
  "merge.about1A": {
    en: "There is no hard limit, but merging many large files may use significant browser memory. For best results, keep total file size under 100MB.",
    "zh-CN": "没有硬性限制，但合并大量大文件可能会占用较多浏览器内存。为获得最佳效果，请保持总文件大小在 100MB 以下。",
  },
  "merge.about2Q": { en: "Will the merged PDF keep bookmarks and links?", "zh-CN": "合并后的 PDF 会保留书签和链接吗？" },
  "merge.about2A": {
    en: "The merged PDF will contain all pages from source PDFs in order. Internal links and bookmarks from source files may not be preserved.",
    "zh-CN": "合并后的 PDF 将按顺序包含所有源 PDF 的页面。源文件的内部链接和书签可能不会被保留。",
  },
};

// ============================================================
// Tool: Split PDF
// ============================================================

const splitPdf = {
  "split.title": { en: "Split & Extract PDF", "zh-CN": "拆分与提取 PDF" },
  "split.desc": {
    en: "Extract specific pages from a PDF, split by page range, or remove unwanted pages.",
    "zh-CN": "从 PDF 中提取特定页面、按页码范围拆分或删除不需要的页面。",
  },
  "split.reading": { en: "Reading PDF...", "zh-CN": "正在读取 PDF..." },
  "split.extractPages": { en: "Extract Pages", "zh-CN": "提取页面" },
  "split.mode": { en: "Mode", "zh-CN": "模式" },
  "split.allPages": { en: "All pages (remove specific)", "zh-CN": "全部页面（可删除指定页）" },
  "split.pageRange": { en: "Page range", "zh-CN": "页码范围" },
  "split.specificPages": { en: "Specific pages", "zh-CN": "指定页面" },
  "split.pageRangeLabel": { en: "Page range (e.g. 1-5)", "zh-CN": "页码范围（如 1-5）" },
  "split.specificPagesLabel": { en: "Pages to extract (e.g. 1,3,5-7)", "zh-CN": "要提取的页面（如 1,3,5-7）" },
  "split.rangeHint": { en: "Extract a range like 1-5", "zh-CN": "提取范围如 1-5" },
  "split.pickHint": { en: "Pick exact pages like 1,3,5-7", "zh-CN": "选择指定页面如 1,3,5-7" },
  "split.pageNumberNote": {
    en: "Pages are numbered starting from 1 (the first page). All ranges are inclusive.",
    "zh-CN": "页码从 1 开始（第一页）。所有范围均为闭区间。",
  },
  "split.removePages": { en: "Remove pages (optional)", "zh-CN": "删除页面（可选）" },
  "split.removePagesHint": { en: "e.g. 2,4 or 10-12", "zh-CN": "如 2,4 或 10-12" },
  "split.removePagesPlaceholder": { en: "e.g. 1,3", "zh-CN": "如 1,3" },
  "split.extract": { en: "Extract Pages", "zh-CN": "提取页面" },
  "split.extracting": { en: "Extracting pages...", "zh-CN": "正在提取页面..." },
  "split.failed": { en: "Extraction failed", "zh-CN": "提取失败" },
  "split.success": { en: "Pages extracted!", "zh-CN": "页面已提取！" },
  "split.downloadExtracted": { en: "Download Extracted PDF", "zh-CN": "下载提取的 PDF" },
  "split.pagesHint": { en: "PDF has", "zh-CN": "PDF 共" },
  "split.howToTitle": { en: "How to use page ranges", "zh-CN": "如何使用页码范围" },
  "split.howToItems": {
    en: [
      "Use commas to separate individual pages: 1,3,5",
      "Use hyphens for ranges: 1-5 means pages 1 through 5",
      "Combine both: 1-3,7,10-12",
      "In \"all pages\" mode, the remove field lets you exclude specific pages from the result.",
    ],
    "zh-CN": [
      "使用逗号分隔单独的页面：1,3,5",
      "使用连字符表示范围：1-5 表示第 1 到第 5 页",
      "组合使用：1-3,7,10-12",
      "在「全部页面」模式下，删除字段可以让您从结果中排除特定页面。",
    ],
  },
};

// ============================================================
// Tool: Check File
// ============================================================

const checkFile = {
  "check.title": { en: "File Compliance Checker", "zh-CN": "文件合规检查器" },
  "check.desc": {
    en: "Upload your file and set your requirements. We'll check if your file meets the specifications and tell you exactly what needs to be fixed.",
    "zh-CN": "上传文件并设置要求。我们会检查您的文件是否符合规格，并告诉您需要修复的内容。",
  },
  "check.requirements": { en: "Upload Requirements", "zh-CN": "上传要求" },
  "check.allowedType": { en: "Allowed file type", "zh-CN": "允许的文件类型" },
  "check.maxSize": { en: "Maximum file size", "zh-CN": "最大文件大小" },
  "check.maxWidth": { en: "Maximum width", "zh-CN": "最大宽度" },
  "check.maxHeight": { en: "Maximum height", "zh-CN": "最大高度" },
  "check.orientation": { en: "Orientation", "zh-CN": "方向" },
  "check.aspectRatio": { en: "Aspect ratio", "zh-CN": "宽高比" },
  "check.typeImages": { en: "Images only (JPG, PNG, WebP)", "zh-CN": "仅图片（JPG、PNG、WebP）" },
  "check.typePdf": { en: "PDF only", "zh-CN": "仅 PDF" },
  "check.typeAll": { en: "Images and PDF", "zh-CN": "图片和 PDF" },
  "check.anyOrientation": { en: "Any orientation", "zh-CN": "任意方向" },
  "check.portraitOnly": { en: "Portrait only", "zh-CN": "仅纵向" },
  "check.landscapeOnly": { en: "Landscape only", "zh-CN": "仅横向" },
  "check.anyRatio": { en: "Any ratio", "zh-CN": "任意比例" },
  "check.ratioSquare": { en: "1:1 (Square)", "zh-CN": "1:1（正方形）" },
  "check.ratio43": { en: "4:3 (Standard)", "zh-CN": "4:3（标准）" },
  "check.ratio32": { en: "3:2 (Photo)", "zh-CN": "3:2（照片）" },
  "check.ratio169": { en: "16:9 (Widescreen)", "zh-CN": "16:9（宽屏）" },
  "check.sizeHint": { en: "in KB", "zh-CN": "单位 KB" },
  "check.dimHint": { en: "in pixels (0 = no limit)", "zh-CN": "单位像素（0 = 无限制）" },
  "check.noSpaces": { en: "Filename must not contain spaces", "zh-CN": "文件名不能包含空格" },
  "check.noSpecialChars": { en: "Filename must not contain special characters", "zh-CN": "文件名不能包含特殊字符" },
  "check.check": { en: "Check File", "zh-CN": "检查文件" },
  "check.checking": { en: "Checking your file...", "zh-CN": "正在检查您的文件..." },
  "check.analyzing": {
    en: "Analyzing format, dimensions, size, and metadata",
    "zh-CN": "正在分析格式、尺寸、大小和元数据",
  },
  "check.allPassed": { en: "All checks passed!", "zh-CN": "所有检查通过！" },
  "check.allPassedDesc": {
    en: "Your file meets all the specified requirements.",
    "zh-CN": "您的文件满足所有指定要求。",
  },
  "check.issuesFound": { en: "issue(s) found", "zh-CN": "个问题" },
  "check.issuesFoundDesc": {
    en: "Your file does not meet all requirements. See details below.",
    "zh-CN": "您的文件不满足所有要求。请查看下方详情。",
  },
  "check.results": { en: "Detailed Check Results", "zh-CN": "详细检查结果" },
  // File compliance check item labels and details
  "check.item.fileType": { en: "File type", "zh-CN": "文件类型" },
  "check.item.fileExtension": { en: "File extension", "zh-CN": "文件扩展名" },
  "check.item.fileSize": { en: "File size", "zh-CN": "文件大小" },
  "check.item.filenameSpaces": { en: "Filename (no spaces)", "zh-CN": "文件名（无空格）" },
  "check.item.filenameSpecial": { en: "Filename (no special chars)", "zh-CN": "文件名（无特殊字符）" },
  "check.item.imageWidth": { en: "Image width", "zh-CN": "图片宽度" },
  "check.item.imageHeight": { en: "Image height", "zh-CN": "图片高度" },
  "check.item.orientation": { en: "Orientation", "zh-CN": "方向" },
  "check.item.aspectRatio": { en: "Aspect ratio", "zh-CN": "宽高比" },
  "check.item.dpi": { en: "DPI information", "zh-CN": "DPI 信息" },
  "check.item.locationMetadata": { en: "Location metadata", "zh-CN": "位置元数据" },
  "check.item.imageAnalysis": { en: "Image analysis", "zh-CN": "图片分析" },
  "check.item.pdfAnalysis": { en: "PDF analysis", "zh-CN": "PDF 分析" },
  "check.item.dimensions": { en: "Dimensions", "zh-CN": "尺寸" },
  // Detail keys
  "check.detail.unsupportedType": {
    en: "Unsupported file type ({type}). Only JPG, PNG, WebP, and PDF are supported.",
    "zh-CN": "不支持的文件类型（{type}）。仅支持 JPG、PNG、WebP 和 PDF。",
  },
  "check.detail.typeNotAllowed": {
    en: "{type} files are not allowed. Required: {required}.",
    "zh-CN": "不允许 {type} 文件。要求：{required}。",
  },
  "check.detail.typeAllowed": {
    en: "{type} — allowed",
    "zh-CN": "{type} — 允许",
  },
  "check.detail.ext": {
    en: ".{ext}",
    "zh-CN": ".{ext}",
  },
  "check.detail.sizeExceeds": {
    en: "{size} exceeds maximum {max}",
    "zh-CN": "{size} 超过最大限制 {max}",
  },
  "check.detail.sizeOk": {
    en: "{size} — within {max} limit",
    "zh-CN": "{size} — 在 {max} 限制内",
  },
  "check.detail.filenameHasSpaces": {
    en: "Filename contains spaces. Some systems may reject it.",
    "zh-CN": "文件名包含空格。某些系统可能会拒绝。",
  },
  "check.detail.filenameNoSpaces": {
    en: "No spaces in filename",
    "zh-CN": "文件名无空格",
  },
  "check.detail.filenameHasSpecial": {
    en: "Filename contains special characters. Rename to use only letters, numbers, hyphens, and underscores.",
    "zh-CN": "文件名包含特殊字符。请重命名为仅包含字母、数字、连字符和下划线。",
  },
  "check.detail.filenameNoSpecial": {
    en: "No special characters in filename",
    "zh-CN": "文件名无特殊字符",
  },
  "check.detail.widthExceeds": {
    en: "{width} exceeds maximum {max} px",
    "zh-CN": "{width} 超过最大宽度 {max} px",
  },
  "check.detail.widthBelow": {
    en: "{width} px is below minimum {min} px",
    "zh-CN": "{width} px 低于最小宽度 {min} px",
  },
  "check.detail.widthOk": {
    en: "{width} px",
    "zh-CN": "{width} px",
  },
  "check.detail.heightExceeds": {
    en: "{height} exceeds maximum {max} px",
    "zh-CN": "{height} 超过最大高度 {max} px",
  },
  "check.detail.heightBelow": {
    en: "{height} px is below minimum {min} px",
    "zh-CN": "{height} px 低于最小高度 {min} px",
  },
  "check.detail.heightOk": {
    en: "{height} px",
    "zh-CN": "{height} px",
  },
  "check.detail.orientationWrongLandscape": {
    en: "Landscape orientation detected — portrait required",
    "zh-CN": "检测到横向方向——需要纵向",
  },
  "check.detail.orientationWrongPortrait": {
    en: "Portrait orientation detected — landscape required",
    "zh-CN": "检测到纵向方向——需要横向",
  },
  "check.detail.portrait": { en: "Portrait", "zh-CN": "纵向" },
  "check.detail.landscape": { en: "Landscape", "zh-CN": "横向" },
  "check.detail.ratioNotAllowed": {
    en: "{ratio} — not in allowed ratios: {allowed}",
    "zh-CN": "{ratio} — 不在允许的宽高比中：{allowed}",
  },
  "check.detail.ratioMatches": {
    en: "{ratio} — matches requirement",
    "zh-CN": "{ratio} — 符合要求",
  },
  "check.detail.ratioNoRestriction": {
    en: "{ratio} (no restriction)",
    "zh-CN": "{ratio}（无限制）",
  },
  "check.detail.dpi": {
    en: "{dpi} DPI — most online uploads ignore DPI for digital images",
    "zh-CN": "{dpi} DPI — 大多数在线上传会忽略数字图像的 DPI",
  },
  "check.detail.noDpi": {
    en: "No DPI data — typical for digital images",
    "zh-CN": "无 DPI 数据 — 数字图像通常如此",
  },
  "check.detail.locationFound": {
    en: "GPS location data found — consider removing for privacy",
    "zh-CN": "发现 GPS 位置数据 — 建议移除以保护隐私",
  },
  "check.detail.locationEntries": {
    en: "{n} metadata entries found (no GPS)",
    "zh-CN": "发现 {n} 项元数据（无 GPS）",
  },
  "check.detail.locationNone": {
    en: "No metadata found",
    "zh-CN": "未发现元数据",
  },
  "check.detail.imageCorrupt": {
    en: "Could not read image properties. The file may be corrupted.",
    "zh-CN": "无法读取图片属性。文件可能已损坏。",
  },
  "check.detail.pdfBasic": {
    en: "Basic PDF checking: format and file size verified. Advanced PDF analysis (page count, dimensions) is coming in Phase 5.",
    "zh-CN": "基础 PDF 检查：已验证格式和文件大小。高级 PDF 分析（页数、尺寸）将在后续阶段推出。",
  },
  "check.detail.pdfOrientationUnknown": {
    en: "PDF page orientation cannot be determined in this version",
    "zh-CN": "当前版本无法确定 PDF 页面方向",
  },
  "check.detail.pdfDimensionsUnknown": {
    en: "PDF page dimensions require advanced parsing (coming in Phase 5)",
    "zh-CN": "PDF 页面尺寸需要高级解析（后续阶段推出）",
  },
  // Recommendation messages
  "check.rec.size": {
    en: "Reduce file size to {max} or less",
    "zh-CN": "将文件大小减小到 {max} 或更小",
  },
  "check.rec.rotatePortrait": {
    en: "Rotate or crop to portrait orientation",
    "zh-CN": "旋转或裁剪为纵向方向",
  },
  "check.rec.rotateLandscape": {
    en: "Rotate or crop to landscape orientation",
    "zh-CN": "旋转或裁剪为横向方向",
  },
  "check.rec.removeGps": {
    en: "Remove GPS location data from image",
    "zh-CN": "从图片中移除 GPS 位置数据",
  },
  "check.rec.width": {
    en: "Resize image width to {max} px or less",
    "zh-CN": "将图片宽度调整为 {max} px 或更小",
  },
  "check.rec.widthMin": {
    en: "Image width must be at least {min} px",
    "zh-CN": "图片宽度至少为 {min} px",
  },
  "check.rec.height": {
    en: "Resize image height to {max} px or less",
    "zh-CN": "将图片高度调整为 {max} px 或更小",
  },
  "check.rec.heightMin": {
    en: "Image height must be at least {min} px",
    "zh-CN": "图片高度至少为 {min} px",
  },
  // Tool labels in recommendations
  "check.tool.compressImage": { en: "Compress image", "zh-CN": "压缩图片" },
  "check.tool.resizeCrop": { en: "Resize & crop", "zh-CN": "调整与裁剪" },
  "check.tool.imageCompressor": { en: "Image Compressor", "zh-CN": "图片压缩" },
  "check.tool.imageResizer": { en: "Image Resizer", "zh-CN": "图片调整" },
  "check.tool.removeMetadata": { en: "Remove metadata", "zh-CN": "移除元数据" },
  "check.tool.metadataRemover": { en: "Metadata Remover", "zh-CN": "元数据移除" },
  "check.recommendations": { en: "Recommended Actions", "zh-CN": "建议操作" },
  "check.openTool": { en: "Open {tool}", "zh-CN": "打开 {tool}" },
  "check.important": {
    en: "Important: These tools can only inspect readable file properties. They cannot guarantee acceptance by any third-party system. Always verify requirements with the official source.",
    "zh-CN": "重要提示：这些工具只能检查可读的文件属性，不能保证被任何第三方系统接受。请始终与官方来源核实要求。",
  },
  "check.notAffiliated": {
    en: "This site is not affiliated with any government agency. We do not guarantee that processed files will be accepted.",
    "zh-CN": "本网站与任何政府机构无关。我们不保证处理后的文件会被接受。",
  },
  "check.failed": { en: "Check failed", "zh-CN": "检查失败" },
  "check.failedDesc": {
    en: "We couldn't read this file. It may be corrupted, password-protected, or in an unsupported format.",
    "zh-CN": "无法读取此文件。文件可能已损坏、受密码保护或格式不受支持。",
  },
  "check.howToTitle": { en: "How to use this tool", "zh-CN": "如何使用此工具" },
  "check.howToSteps": {
    en: [
      "Upload your file — an image or PDF.",
      "Set the requirements you need to meet (file type, size limits, dimensions, etc.).",
      "Click \"Check File\" to analyze.",
      "Review the detailed results — passed and failed checks are highlighted.",
      "If issues are found, follow the recommended actions to fix them.",
      "Download or reprocess your file using the suggested tools.",
    ],
    "zh-CN": [
      "上传您的文件——图片或 PDF。",
      "设置您需要满足的要求（文件类型、大小限制、尺寸等）。",
      "点击「检查文件」进行分析。",
      "查看详细结果——通过和失败的检查会突出显示。",
      "如果发现问题，按照建议操作进行修复。",
      "使用推荐的工具下载或重新处理您的文件。",
    ],
  },
  "check.commonIssuesTitle": { en: "Common issues and solutions", "zh-CN": "常见问题与解决方案" },
  "check.commonIssuesItems": {
    en: [
      "File too large: Use the Image Compressor to reduce file size while maintaining quality.",
      "Wrong dimensions: Use the Image Resizer to adjust width and height to the required values.",
      "Unsupported format: Use the Format Converter to change your file to an accepted format.",
      "Metadata concerns: Use the Metadata Remover to strip hidden data from your images before submission.",
    ],
    "zh-CN": [
      "文件太大：使用图片压缩工具减小文件大小，同时保持质量。",
      "尺寸不对：使用图片调整工具将宽度和高度调整到要求值。",
      "格式不支持：使用格式转换工具将文件转换为可接受的格式。",
      "元数据问题：使用元数据移除工具在提交前清除图片中的隐藏数据。",
    ],
  },
  "check.faqTitle": { en: "FAQ", "zh-CN": "常见问答" },
  "check.faq1Q": { en: "Can this tool guarantee my file will be accepted?", "zh-CN": "这个工具能保证我的文件被接受吗？" },
  "check.faq1A": {
    en: "No tool can guarantee acceptance. Our checker verifies technical file properties against your specified requirements. The receiving institution always has final say.",
    "zh-CN": "没有任何工具可以保证被接受。我们的检查器会根据您指定的要求验证文件的技术属性。接收机构始终拥有最终决定权。",
  },
  "check.faq2Q": { en: "What file types are supported?", "zh-CN": "支持哪些文件类型？" },
  "check.faq2A": {
    en: "We support JPEG, PNG, WebP images and PDF documents. Other formats like HEIC or BMP are not supported for checking.",
    "zh-CN": "我们支持 JPEG、PNG、WebP 图片和 PDF 文档。HEIC 或 BMP 等其他格式不支持检查。",
  },
  "check.faq3Q": { en: "Is my file uploaded anywhere?", "zh-CN": "我的文件会被上传到哪里吗？" },
  "check.faq3A": {
    en: "No. All file analysis happens locally in your browser. Your files are never uploaded to any server.",
    "zh-CN": "不会。所有文件分析都在浏览器本地完成。您的文件绝不会被上传到任何服务器。",
  },
  "check.relatedTitle": { en: "Related tools", "zh-CN": "相关工具" },
};

// ============================================================
// Use Cases
// ============================================================

const useCases = {
  "usecase.job.title": { en: "Job Applications", "zh-CN": "求职申请" },
  "usecase.job.desc": {
    en: "Compress resumes, merge cover letters, and adjust photos for job portals.",
    "zh-CN": "压缩简历、合并求职信、调整照片以符合求职平台要求。",
  },
  "usecase.school.title": { en: "School & University", "zh-CN": "学校与大学申请" },
  "usecase.school.desc": {
    en: "Process application photos, signatures, and documents for admissions.",
    "zh-CN": "处理申请照片、签名和文件以符合入学要求。",
  },
  "usecase.exam.title": { en: "Exam Registration", "zh-CN": "考试报名" },
  "usecase.exam.desc": {
    en: "Meet strict photo and signature requirements for test registration.",
    "zh-CN": "满足考试报名严格的照片和签名要求。",
  },
  "usecase.visa.title": { en: "Visa & Passport", "zh-CN": "签证与护照" },
  "usecase.visa.desc": {
    en: "Check photo dimensions, file sizes, and format requirements.",
    "zh-CN": "检查照片尺寸、文件大小和格式要求。",
  },
  "usecase.gov.title": { en: "Government Forms", "zh-CN": "政府表格" },
  "usecase.gov.desc": {
    en: "Adjust scans, fix orientations, and prepare attachments for online services.",
    "zh-CN": "调整扫描件、修正方向、准备在线服务的附件。",
  },
  "usecase.office.title": { en: "Everyday Office", "zh-CN": "日常办公" },
  "usecase.office.desc": {
    en: "Compress email attachments, convert HEIC, and merge documents.",
    "zh-CN": "压缩邮件附件、转换 HEIC、合并文档。",
  },
};

// ============================================================
// Info Pages
// ============================================================

const info = {
  "about.title": { en: "About FileReady", "zh-CN": "关于文件就绪" },
  "about.desc": {
    en: "Free online tools to help you prepare files for online uploads. All processing happens in your browser.",
    "zh-CN": "免费在线工具，帮助您准备在线上传的文件。所有处理都在您的浏览器中完成。",
  },
  "about.body1": {
    en: "FileReady is a free, browser-based toolset that helps you prepare files for online uploads. Whether you are applying for a job, registering for an exam, or submitting government forms, our tools check, compress, resize, convert, and organize your files to meet specific requirements.",
    "zh-CN": "文件就绪是一套免费的浏览器工具集，帮助您为在线上传准备文件。无论您是求职、报名考试还是提交政府表格，我们的工具都能帮您检查、压缩、调整大小、转换和整理文件，以满足具体要求。",
  },
  "about.body2": {
    en: "All processing happens directly in your browser using Canvas API and PDF-lib. Your files are never uploaded to any server. We do not collect, store, or have access to your documents.",
    "zh-CN": "所有处理都通过 Canvas API 和 PDF-lib 在您的浏览器中直接完成。您的文件绝不会被上传到任何服务器。我们不会收集、存储或访问您的文件。",
  },
  "about.body3": {
    en: "This project is built with Next.js, TypeScript, and Tailwind CSS. It is designed to be fast, accessible, and privacy-respecting.",
    "zh-CN": "本项目使用 Next.js、TypeScript 和 Tailwind CSS 构建，旨在提供快速、可访问且尊重隐私的体验。",
  },
  "privacy.title": { en: "Privacy Policy", "zh-CN": "隐私政策" },
  "privacy.effectiveDate": { en: "Effective Date", "zh-CN": "生效日期" },
  "privacy.commitment": { en: "Our Commitment to Privacy", "zh-CN": "我们对隐私的承诺" },
  "privacy.commitmentDesc": {
    en: "FileReady processes all files entirely in your browser. We do not upload, collect, store, or have any access to your files or their contents.",
    "zh-CN": "文件就绪完全在您的浏览器中处理所有文件。我们不会上传、收集、存储或访问您的文件及其内容。",
  },
  "privacy.dataCollection": { en: "Data Collection", "zh-CN": "数据收集" },
  "privacy.dataCollectionDesc": {
    en: "We do not collect personal information. We do not use cookies for tracking purposes. We may use anonymous analytics (like page view counts) to improve our service, but these do not identify individual users.",
    "zh-CN": "我们不收集个人信息。我们不会使用 Cookie 进行追踪。我们可能使用匿名分析（如页面浏览量）来改进服务，但这些不会识别个人用户。",
  },
  "privacy.advertising": { en: "Advertising", "zh-CN": "广告" },
  "privacy.advertisingDesc": {
    en: "This site may display advertisements through Google AdSense or similar services. These third parties may use cookies to serve ads based on prior visits. Users can opt out of personalized advertising through Google Ads Settings.",
    "zh-CN": "本网站可能通过 Google AdSense 或类似服务展示广告。这些第三方可能使用 Cookie 根据之前的访问投放广告。用户可以通过 Google 广告设置退出个性化广告。",
  },
  "privacy.contact": { en: "Contact", "zh-CN": "联系方式" },
  "privacy.contactDesc": {
    en: "If you have questions about this privacy policy, please contact us through the Contact page.",
    "zh-CN": "如果您对本隐私政策有疑问，请通过联系我们页面与我们取得联系。",
  },
  "terms.title": { en: "Terms of Use", "zh-CN": "使用条款" },
  "terms.body1": {
    en: "By using FileReady, you agree to these terms. Our tools are provided free of charge for personal and commercial use.",
    "zh-CN": "使用文件就绪即表示您同意这些条款。我们的工具免费供个人和商业使用。",
  },
  "terms.body2": {
    en: "You retain all rights to files you process. We do not claim ownership of your content.",
    "zh-CN": "您保留对所处理文件的所有权利。我们不主张对您内容的所有权。",
  },
  "terms.body3": {
    en: "Tools are provided \"as is\" without warranty. We are not responsible for files that fail to meet third-party requirements. Always verify requirements with the receiving institution.",
    "zh-CN": "工具按「原样」提供，不附带任何保证。我们不对未能满足第三方要求的文件负责。请始终与接收机构核实要求。",
  },
  "terms.body4": {
    en: "Do not use our tools for illegal purposes, including forgery, identity fraud, or copyright violation.",
    "zh-CN": "请勿将我们的工具用于非法目的，包括伪造、身份欺诈或侵犯版权。",
  },
  "disclaimer.title": { en: "Disclaimer", "zh-CN": "免责声明" },
  "disclaimer.body1": {
    en: "FileReady is an independent tool and is not affiliated with, endorsed by, or connected to any government agency, educational institution, or online platform.",
    "zh-CN": "文件就绪是一个独立工具，与任何政府机构、教育机构或在线平台无关、未经其认可、也不与其关联。",
  },
  "disclaimer.body2": {
    en: "Our tools can only inspect and process readable file technical properties. We cannot guarantee that a processed file will be accepted by any third party. Final requirements are always determined by the receiving institution.",
    "zh-CN": "我们的工具只能检查和处理器可读的文件技术属性。我们无法保证处理后的文件会被任何第三方接受。最终要求始终由接收机构决定。",
  },
  "disclaimer.body3": {
    en: "Users are responsible for verifying file requirements with the official source before submission.",
    "zh-CN": "用户有责任在提交前与官方来源核实文件要求。",
  },
  "contact.title": { en: "Contact", "zh-CN": "联系我们" },
  "contact.desc": {
    en: "Have questions, suggestions, or feedback? We would love to hear from you.",
    "zh-CN": "有问题、建议或反馈？我们很乐意听取您的意见。",
  },
  "contact.body": {
    en: "For now, the best way to reach us is through the project repository or by opening an issue. We aim to respond within 2-3 business days.",
    "zh-CN": "目前，联系我们的最佳方式是通过项目仓库或提交 Issue。我们会在 2-3 个工作日内回复。",
  },
  "contact.noFiles": {
    en: "Please do not send any files or personal documents through email. All file processing should be done through our browser-based tools.",
    "zh-CN": "请不要通过邮件发送任何文件或个人文档。所有文件处理应通过我们的浏览器工具完成。",
  },
};

// ============================================================
// Cookie Consent
// ============================================================

const cookie = {
  "cookie.title": { en: "Cookie Consent", "zh-CN": "Cookie 同意" },
  "cookie.desc": {
    en: "We use cookies for essential site functionality and anonymous analytics to improve our service. We do not track you across other websites.",
    "zh-CN": "我们使用 Cookie 来保证网站基本功能和匿名分析以改进服务。我们不会跨网站追踪您。",
  },
  "cookie.accept": { en: "Accept All", "zh-CN": "全部接受" },
  "cookie.reject": { en: "Reject All", "zh-CN": "全部拒绝" },
  "cookie.settings": { en: "Cookie Settings", "zh-CN": "Cookie 设置" },
  "notFound.title": { en: "Page not found", "zh-CN": "页面未找到" },
  "notFound.desc": {
    en: "The page you are looking for does not exist or has been moved.",
    "zh-CN": "您要查找的页面不存在或已被移动。",
  },
  "notFound.backHome": { en: "Back to Home", "zh-CN": "返回首页" },
  "preset.free": { en: "Free", "zh-CN": "自由比例" },
  "preset.square": { en: "1:1 (Square)", "zh-CN": "1:1（正方形）" },
  "preset.portrait": { en: "3:4 (Portrait)", "zh-CN": "3:4（纵向）" },
  "preset.landscape": { en: "4:3 (Landscape)", "zh-CN": "4:3（横向）" },
  "preset.widescreen": { en: "16:9 (Widescreen)", "zh-CN": "16:9（宽屏）" },
  "preset.story": { en: "9:16 (Story)", "zh-CN": "9:16（故事）" },
  "preset.photo3_2": { en: "3:2 (Photo)", "zh-CN": "3:2（照片）" },
  "preset.portraitPhoto": { en: "2:3 (Portrait Photo)", "zh-CN": "2:3（纵向照片）" },
  "preset.custom": { en: "Custom", "zh-CN": "自定义" },
  "preset.passport": { en: "Passport Photo (600x600)", "zh-CN": "护照照片 (600x600)" },
  "preset.visa": { en: "Visa Application (800x400)", "zh-CN": "签证申请 (800x400)" },
  "preset.exam": { en: "Exam Form (400x200)", "zh-CN": "考试表格 (400x200)" },
  "unit.pixels": { en: "Pixels (px)", "zh-CN": "像素 (px)" },
  "unit.mm": { en: "Millimeters (mm)", "zh-CN": "毫米 (mm)" },
  "unit.cm": { en: "Centimeters (cm)", "zh-CN": "厘米 (cm)" },
  "unit.in": { en: "Inches (in)", "zh-CN": "英寸 (in)" },
};

// ============================================================
// Guides page
// ============================================================

const guidesPage = {
  "guides.title": { en: "Guides", "zh-CN": "指南" },
  "guides.desc": {
    en: "Step-by-step guides to help you prepare files for online uploads.",
    "zh-CN": "逐步指南，帮助您为在线上传准备文件。",
  },
  "guides.readGuide": { en: "Read guide", "zh-CN": "阅读指南" },
};

// ============================================================
// Result Summary
// ============================================================

const resultSummary = {
  "result.passed": { en: "Passed", "zh-CN": "通过" },
  "result.failed": { en: "Failed", "zh-CN": "未通过" },
  "result.needsReview": { en: "Needs review", "zh-CN": "需审查" },
  "result.cannotDetermine": { en: "Cannot determine", "zh-CN": "无法判断" },
};

// ============================================================
// Merge all dictionaries
// ============================================================

export const translations: Record<string, TranslationEntry> = {
  ...common,
  ...home,
  ...compressor,
  ...resizer,
  ...converter,
  ...signature,
  ...metadata,
  ...dpi,
  ...imageToPdf,
  ...mergePdf,
  ...splitPdf,
  ...checkFile,
  ...useCases,
  ...info,
  ...cookie,
  ...guidesPage,
  ...resultSummary,
};
