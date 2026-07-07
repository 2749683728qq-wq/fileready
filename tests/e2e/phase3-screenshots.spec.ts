import { test } from "@playwright/test";
import path from "path";

const SCREENSHOTS_DIR = path.resolve("screenshots/phase-3");
const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

test.describe("Image Resizer screenshots", () => {
  for (const vp of viewports) {
    test(`resizer - ${vp.name}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      await page.goto("/en/tools/image-resizer", { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `resizer-${vp.name}.png`),
        fullPage: true,
      });
      await ctx.close();
    });
  }
});
