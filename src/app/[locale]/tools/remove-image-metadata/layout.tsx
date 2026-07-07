import type { Metadata } from "next";
import { generatePageMeta, toolMeta } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = toolMeta["remove-image-metadata"][locale as "en" | "zh-CN"];
  return generatePageMeta({
    title: meta.title,
    description: meta.desc,
    path: `/${locale}/tools/remove-image-metadata`,
    locale: locale as "en" | "zh-CN",
  });
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
