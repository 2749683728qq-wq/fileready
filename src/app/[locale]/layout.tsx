import type { Metadata } from "next";
import { LocaleProvider } from "@/i18n";
import type { Locale } from "@/i18n";

const SITE_URL = "https://fileready.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | FileReady",
    default: "FileReady — 文件就绪，上传没烦恼",
  },
  description:
    "免费在线工具，帮您检查、压缩、调整和转换文件。文件准备好，上传没烦恼——全部在浏览器中私密处理。",
  alternates: {
    languages: {
      en: "/en",
      "zh-CN": "/zh-CN",
    },
  },
  openGraph: {
    siteName: "FileReady",
    type: "website",
  },
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh-CN" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "zh-CN" ? "zh-CN" : "en";
  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
