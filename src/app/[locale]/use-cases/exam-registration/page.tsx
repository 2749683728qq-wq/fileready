"use client";
import { UseCasePage } from "@/components/layout/UseCasePage";
export default function Page() {
  return <UseCasePage titleKey="usecase.exam.title" descKey="usecase.exam.desc"
    tools={["compressor.title","resizer.title","signature.title","check.title"]}
    tips={[
      {titleKey:"compressor.title",descKey:"compressor.desc"},
      {titleKey:"resizer.title",descKey:"resizer.desc"},
      {titleKey:"signature.title",descKey:"signature.desc"},
    ]} />;
}
