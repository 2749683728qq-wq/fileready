import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "cd /workspace && pnpm dev --port 3000",
    url: "http://localhost:3000/en/tools/image-compressor/",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
