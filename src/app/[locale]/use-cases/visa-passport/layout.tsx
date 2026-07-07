import type { Metadata } from "next";
import { generatePageMeta, useCaseMeta } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = useCaseMeta["visa-passport"][locale as "en" | "zh-CN"];
  return generatePageMeta({
    title: meta.title,
    description: meta.desc,
    path: `/${locale}/use-cases/visa-passport`,
    locale: locale as "en" | "zh-CN",
  });
}

export default function UseCaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
