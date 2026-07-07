import { guides as allGuides } from "@/lib/guides";

export function generateStaticParams() {
  const slugs = allGuides.map((g) => g.slug);
  const locales = ["en", "zh-CN"];
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default function GuideSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
