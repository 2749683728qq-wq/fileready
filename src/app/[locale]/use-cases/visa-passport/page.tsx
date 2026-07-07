"use client";
import { UseCasePage } from "@/components/layout/UseCasePage";
export default function Page() {
  return <UseCasePage titleKey="usecase.visa.title" descKey="usecase.visa.desc"
    tools={["check.title","compressor.title","resizer.title","dpi.title"]}
    tips={[
      {titleKey:"check.title",descKey:"check.desc"},
      {titleKey:"resizer.title",descKey:"resizer.desc"},
      {titleKey:"dpi.title",descKey:"dpi.desc"},
    ]} />;
}
