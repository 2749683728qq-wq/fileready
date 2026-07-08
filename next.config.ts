import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/fileready" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: "dist",
  // GitHub Pages deploys to a sub-path (e.g. /fileready/)
  // Local dev and other platforms use root path
  basePath,
  // Expose basePath to client so the language switcher can build correct URLs
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Next.js 16 requires images to use unoptimized for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
