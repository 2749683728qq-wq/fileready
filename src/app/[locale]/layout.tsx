import type { Metadata } from "next";
import { PageLayout } from "@/components/layout";
import { ToastContainer } from "@/components/ui";

export const metadata: Metadata = {
  title: {
    template: "%s | File Upload Assistant",
    default: "File Upload Assistant — Check, Compress & Convert Files",
  },
  description:
    "Free online tools to check, compress, resize, and convert files for online uploads. All processing happens in your browser.",
};

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageLayout>{children}</PageLayout>
      <ToastContainer />
    </>
  );
}
