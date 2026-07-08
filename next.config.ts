import type { NextConfig } from "next";

// GitHub Pages custom domain: fileready.vip — no sub-path needed
// When deploying via GitHub Pages workflow, we don't need basePath anymore
const basePath = "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: "dist",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: "https://fileready.vip",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
