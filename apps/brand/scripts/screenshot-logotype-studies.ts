import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

/**
 * One-off verification capture for the Logotype studies page (Capa 1).
 * Captures a single full-page screenshot at desktop width so the 24-month
 * lock recommendation can be reviewed as a single artifact.
 */

const HOST = process.env.BRAND_HOST ?? "http://localhost:3100";
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "screenshots");

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROME ?? "/run/current-system/sw/bin/google-chrome",
  });
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${HOST}/brand/logotype-studies`, { waitUntil: "networkidle" });
    // Extra wait so next/font/google faces all settle before capture.
    await page.waitForTimeout(1200);
    const file = join(OUT, "logotype-studies.png");
    await page.screenshot({ path: file, fullPage: true });
    console.log(`captured ${file}`);
    await ctx.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
