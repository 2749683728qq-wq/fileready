"use client";
import { UseCasePage } from "@/components/layout/UseCasePage";
export default function Page() {
  return <UseCasePage titleKey="usecase.office.title" descKey="usecase.office.desc"
    tools={["compressor.title","converter.title","img2pdf.title","merge.title","split.title"]}
    tips={[
      {titleKey:"compressor.title",descKey:"compressor.desc"},
      {titleKey:"converter.title",descKey:"converter.desc"},
      {titleKey:"merge.title",descKey:"merge.desc"},
    ]} />;
}
