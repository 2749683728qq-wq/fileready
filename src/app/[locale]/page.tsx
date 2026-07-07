import HomePage from "@/app/page";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh-CN" }];
}

export default function LocaleHomePage() {
  return <HomePage />;
}
