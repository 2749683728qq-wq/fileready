import { test, expect } from "@playwright/test";
import path from "path";

const FIXTURES_DIR = path.resolve("tests/fixtures/images");

test.describe("Image Compressor target size button", () => {
  test("button updates when clicking 100 KB preset", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();

    await page.goto("/en/tools/image-compressor", { waitUntil: "networkidle" });

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(FIXTURES_DIR, "large-test.jpg"));

    // Wait for file ready
    await expect(page.locator("button", { hasText: "Compress to" })).toBeVisible();

    // Default should be 200 KB
    await expect(page.locator("button", { hasText: "Compress to 200 KB or less" })).toBeVisible();

    // Click 100 KB
    await page.locator("button", { hasText: "100 KB" }).click();

    // Wait a bit for state update
    await page.waitForTimeout(300);

    // Button should now show 100 KB
    await expect(page.locator("button", { hasText: "Compress to 100 KB or less" })).toBeVisible();

    await ctx.close();
  });
});
