import { Header } from "./Header";
import { Footer } from "./Footer";
import { StructuredData } from "./StructuredData";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Narrower content width for tool pages */
  narrow?: boolean;
}

export function PageLayout({ children, narrow = false }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData />
      <Header />
      <main className={`flex-1 ${narrow ? "max-w-3xl" : "max-w-7xl"} mx-auto w-full px-4 py-8 sm:px-6 lg:px-8`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
