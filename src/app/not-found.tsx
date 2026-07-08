import Link from "next/link";
import { FileQuestion } from "lucide-react";

function detectLocale(): "en" | "zh-CN" {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/zh-CN")) {
    return "zh-CN";
  }
  return "en";
}

const translations = {
  title: { en: "Page not found", "zh-CN": "页面未找到" },
  desc: {
    en: "The page you are looking for does not exist or has been moved.",
    "zh-CN": "您要查找的页面不存在或已被移动。",
  },
  backHome: { en: "Back to Home", "zh-CN": "返回首页" },
};

export default function NotFound() {
  const locale = detectLocale();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="h-16 w-16 text-text-tertiary" />
      <h1 className="mt-6 text-2xl font-bold text-text-primary">{translations.title[locale]}</h1>
      <p className="mt-2 max-w-md text-text-secondary">
        {translations.desc[locale]}
      </p>
      <Link
        href={locale === "zh-CN" ? "/zh-CN" : "/"}
        className="mt-6 rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        {translations.backHome[locale]}
      </Link>
    </div>
  );
}
