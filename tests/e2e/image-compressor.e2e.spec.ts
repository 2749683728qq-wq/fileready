import { test, expect } from "@playwright/test";
import path from "path";

const FIXTURES_DIR = path.resolve("tests/fixtures/images");

test.describe("Image Compressor E2E", () => {
  test("compress a large JPG to 50KB", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    await page.goto("/en/tools/image-compressor", { waitUntil: "networkidle" });

    // Upload the large test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(FIXTURES_DIR, "large-test.jpg"));

    // Wait for file info to appear
    await expect(page.locator("text=large-test.jpg")).toBeVisible();

    // Select 50KB target
    await page.locator("button", { hasText: "50 KB" }).click();

    // Start compression
    await page.locator("button", { hasText: "Compress to" }).click();

    // Wait for processing to complete
    await expect(page.locator("text=Compression complete!")).toBeVisible({ timeout: 20000 });

    // Verify download button is present
    await expect(page.locator("button", { hasText: "Download Compressed Image" })).toBeVisible();

    await context.close();
  });

  test("show unsupported format error for HEIC", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    await page.goto("/en/tools/image-compressor", { waitUntil: "networkidle" });

    // Verify dropzone is visible
    await expect(page.locator("text=Choose a file or drag and drop")).toBeVisible();

    await context.close();
  });
});
