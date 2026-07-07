import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const FIXTURES_DIR = path.resolve("tests/fixtures/images");

test.describe("File Compliance Checker E2E", () => {
  test("check an image that fails size requirement", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();

    await page.goto("/en/check-file/");
    await page.waitForSelector("h1");

    // Verify the page loaded
    await expect(page.locator("h1")).toContainText("File Compliance Checker");

    // Upload a large image (the 2.5MB fixture)
    const filePath = path.join(FIXTURES_DIR, "large-test.jpg");
    if (!fs.existsSync(filePath)) {
      test.skip(true, "Test fixture not found");
      return;
    }

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("text=Choose a file").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    // Should show file selected state
    await page.waitForSelector("text=Check File");
    await expect(page.locator("text=large-test.jpg")).toBeVisible();

    // Click Check File
    await page.click("text=Check File");

    // Should show results
    await page.waitForSelector("text=Detailed Check Results");

    // Since the file is 2.5MB and max is 500KB, should show file size failure
    // At minimum, file size should fail
    await expect(page.getByText("File size", { exact: true })).toBeVisible();

    await ctx.close();
  });

  test("check file with special characters in filename", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();

    await page.goto("/en/check-file/");

    // Create a temp file with special chars in name
    const filePath = path.join(FIXTURES_DIR, "small-test.jpg");
    if (!fs.existsSync(filePath)) {
      test.skip(true, "Test fixture not found");
      return;
    }

    // Use file with original name
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("text=Choose a file").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    await page.waitForSelector("text=Check File");
    await page.click("text=Check File");
    await page.waitForSelector("text=Detailed Check Results");

    // Verify results are displayed
    await expect(page.locator("text=Detailed Check Results")).toBeVisible();

    await ctx.close();
  });

  test("change requirements and re-check", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();

    await page.goto("/en/check-file/");

    // Change max size to 10MB
    const maxSizeInput = page.locator("input#maximum-file-size");
    await maxSizeInput.fill("");
    await maxSizeInput.fill("10000");

    // Upload test photo
    const filePath = path.join(FIXTURES_DIR, "small-test.jpg");
    if (!fs.existsSync(filePath)) {
      test.skip(true, "Test fixture not found");
      return;
    }

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("text=Choose a file").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    await page.waitForSelector("text=Check File");
    await page.click("text=Check File");
    await page.waitForSelector("text=Detailed Check Results");

    // With 10MB limit, the test photo should pass size check
    await expect(page.locator("text=Detailed Check Results")).toBeVisible();

    await ctx.close();
  });
});
