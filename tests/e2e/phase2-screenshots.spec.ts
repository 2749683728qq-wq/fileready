import { test } from "@playwright/test";
import path from "path";

const SCREENSHOTS_DIR = path.resolve("screenshots/phase-2");

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

test.describe("Image Compressor screenshots", () => {
  for (const viewport of viewports) {
    test(`compressor - ${viewport.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      await page.goto("/en/tools/image-compressor", { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `compressor-${viewport.name}.png`),
        fullPage: true,
      });

      await context.close();
    });
  }
});
