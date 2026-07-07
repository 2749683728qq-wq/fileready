"use client";
import { UseCasePage } from "@/components/layout/UseCasePage";
export default function Page() {
  return <UseCasePage titleKey="usecase.gov.title" descKey="usecase.gov.desc"
    tools={["check.title","compressor.title","img2pdf.title","merge.title","metadata.title"]}
    tips={[
      {titleKey:"check.title",descKey:"check.desc"},
      {titleKey:"img2pdf.title",descKey:"img2pdf.desc"},
      {titleKey:"metadata.title",descKey:"metadata.desc"},
    ]} />;
}
