import type { Metadata } from "next";
import { generatePageMeta, infoMeta } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = infoMeta["about"][locale as "en" | "zh-CN"];
  return generatePageMeta({
    title: meta.title,
    description: meta.desc,
    path: `/${locale}/about/`,
    locale: locale as "en" | "zh-CN",
  });
}

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
