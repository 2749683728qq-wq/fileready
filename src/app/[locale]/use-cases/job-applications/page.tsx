"use client";
import { UseCasePage } from "@/components/layout/UseCasePage";
export default function Page() {
  return <UseCasePage titleKey="usecase.job.title" descKey="usecase.job.desc"
    tools={["compressor.title","resizer.title","img2pdf.title","merge.title","signature.title"]}
    tips={[
      {titleKey:"compressor.title",descKey:"compressor.desc"},
      {titleKey:"resizer.title",descKey:"resizer.desc"},
      {titleKey:"signature.title",descKey:"signature.desc"},
    ]} />;
}
