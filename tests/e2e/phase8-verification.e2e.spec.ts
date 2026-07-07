import { test, expect } from "@playwright/test";

test.describe("Bilingual Support", () => {
  test("English homepage shows English content", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/en/");
    await page.waitForSelector("h1");

    const h1 = await page.locator("h1").innerText();
    expect(h1).toContain("Your file won't upload");
    expect(h1).toContain("Let's fix that");

    // Navigation should be in English
    const nav = page.locator("header nav");
    await expect(nav).toContainText("Tools");
    await expect(nav).toContainText("Use Cases");

    await ctx.close();
  });

  test("Chinese homepage shows Chinese content", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/zh-CN/");
    await page.waitForSelector("h1");

    const h1 = await page.locator("h1").innerText();
    expect(h1).toContain("文件上传不上去");
    expect(h1).toContain("我们来帮您解决");

    // Navigation should be in Chinese
    const nav = page.locator("header nav");
    await expect(nav).toContainText("工具");
    await expect(nav).toContainText("使用场景");

    await ctx.close();
  });

  test("Info pages are accessible in both languages", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();

    // EN about page
    await page.goto("/en/about/");
    await page.waitForSelector("h1");
    await expect(page.locator("h1")).toContainText("About");

    // ZH about page
    await page.goto("/zh-CN/about/");
    await page.waitForSelector("h1");
    await expect(page.locator("h1")).toContainText("关于");

    // EN privacy page
    await page.goto("/en/privacy/");
    await page.waitForSelector("h1");
    await expect(page.locator("h1")).toContainText("Privacy");

    // ZH privacy page
    await page.goto("/zh-CN/privacy/");
    await page.waitForSelector("h1");
    await expect(page.locator("h1")).toContainText("隐私");

    await ctx.close();
  });

  test("Use case pages are accessible in both languages", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();

    await page.goto("/en/use-cases/job-applications/");
    await page.waitForSelector("h1");
    await expect(page.locator("h1")).toContainText("Job Applications");

    await page.goto("/zh-CN/use-cases/job-applications/");
    await page.waitForSelector("h1");
    await expect(page.locator("h1")).toContainText("求职申请");

    await ctx.close();
  });
});

test.describe("PDF Tools", () => {
  test("Image to PDF page loads correctly", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/en/tools/image-to-pdf/");
    await page.waitForSelector("h1");

    await expect(page.locator("h1")).toContainText("Image to PDF");
    await expect(page.locator("text=Page Settings")).toBeVisible();

    await ctx.close();
  });

  test("Merge PDF page loads correctly", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/en/tools/merge-pdf/");
    await page.waitForSelector("h1");

    await expect(page.locator("h1")).toContainText("Merge PDF");
    await expect(page.locator("text=Choose a file")).toBeVisible();

    await ctx.close();
  });

  test("Split PDF page loads correctly", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/en/tools/split-pdf/");
    await page.waitForSelector("h1");

    await expect(page.locator("h1")).toContainText("Split");
    await expect(page.locator("text=Choose a file")).toBeVisible();

    await ctx.close();
  });
});

test.describe("Navigation", () => {
  test("All tool pages have no duplicate headers/footers", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();

    const toolPaths = [
      "/en/tools/image-compressor/",
      "/en/tools/image-resizer/",
      "/en/tools/image-converter/",
      "/en/tools/signature-resizer/",
      "/en/tools/remove-image-metadata/",
      "/en/tools/dpi-calculator/",
      "/en/tools/image-to-pdf/",
      "/en/tools/merge-pdf/",
      "/en/tools/split-pdf/",
    ];

    for (const path of toolPaths) {
      await page.goto(path);
      await page.waitForSelector("h1");
      const headers = await page.locator("header").count();
      const footers = await page.locator("footer").count();
      expect(headers).toBe(1);
      expect(footers).toBe(1);
    }

    await ctx.close();
  });

  test("Cookie consent banner appears and can be dismissed", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();

    // Clear consent
    await page.goto("/en/");
    await page.evaluate(() => localStorage.removeItem("fua-cookie-consent"));
    await page.reload();
    await page.waitForTimeout(800);

    // Cookie banner should be visible
    const banner = page.locator("text=Cookie Consent");
    await expect(banner.first()).toBeVisible();

    // Accept cookies
    await page.locator("text=Accept All").click();
    await page.waitForTimeout(500);

    // Banner should disappear
    await expect(banner.first()).not.toBeVisible();

    await ctx.close();
  });
});
