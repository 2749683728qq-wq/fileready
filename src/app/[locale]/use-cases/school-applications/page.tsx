"use client";
import { UseCasePage } from "@/components/layout/UseCasePage";
export default function Page() {
  return <UseCasePage titleKey="usecase.school.title" descKey="usecase.school.desc"
    tools={["compressor.title","resizer.title","img2pdf.title","signature.title","metadata.title"]}
    tips={[
      {titleKey:"compressor.title",descKey:"compressor.desc"},
      {titleKey:"img2pdf.title",descKey:"img2pdf.desc"},
      {titleKey:"signature.title",descKey:"signature.desc"},
    ]} />;
}
