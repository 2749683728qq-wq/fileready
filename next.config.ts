import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: "dist",
  // GitHub Pages deploys to a sub-path (e.g. /fileready/)
  // Local dev and other platforms use root path
  basePath: isGitHubPages ? "/fileready" : "",
  // Next.js 16 requires images to use unoptimized for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
