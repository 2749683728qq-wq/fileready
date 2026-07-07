import { test, expect } from "@playwright/test";
import path from "path";

const FIXTURES_DIR = path.resolve("tests/fixtures/images");

test.describe("Image Resizer E2E", () => {
  test("upload and resize an image", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();

    await page.goto("/en/tools/image-resizer", { waitUntil: "networkidle" });

    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(FIXTURES_DIR, "large-test.jpg"));

    // Wait for the crop editor to appear
    await expect(page.getByRole("heading", { name: "Output Dimensions" })).toBeVisible({ timeout: 10000 });

    // Verify the resize button is visible
    await expect(page.locator("button", { hasText: "Resize Image" })).toBeVisible();

    // Click resize
    await page.locator("button", { hasText: "Resize Image" }).click();

    // Wait for completion
    await expect(page.locator("text=Image resized successfully")).toBeVisible({ timeout: 20000 });

    // Verify download button
    await expect(page.locator("button", { hasText: "Download Resized Image" })).toBeVisible();

    await ctx.close();
  });
});
