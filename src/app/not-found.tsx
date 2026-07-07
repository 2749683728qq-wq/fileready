import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="h-16 w-16 text-text-tertiary" />
      <h1 className="mt-6 text-2xl font-bold text-text-primary">Page not found</h1>
      <p className="mt-2 max-w-md text-text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
