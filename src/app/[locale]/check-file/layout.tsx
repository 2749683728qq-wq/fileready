import type { Metadata } from "next";
import { generatePageMeta, checkFileMeta } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = checkFileMeta[locale as "en" | "zh-CN"];
  return generatePageMeta({
    title: meta.title,
    description: meta.desc,
    path: `/${locale}/check-file`,
    locale: locale as "en" | "zh-CN",
  });
}

export default function CheckFileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
