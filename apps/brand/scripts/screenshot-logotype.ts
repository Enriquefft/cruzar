import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

/**
 * One-off verification capture for the Logotype asset preview page.
 * Not part of `bun run screenshot`; invoked on demand by the Logotype
 * asset build to confirm the component render matches the editorial
 * wordmark before committing.
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
    await page.goto(`${HOST}/brand/logotype`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const file = join(OUT, "logotype-preview.png");
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
