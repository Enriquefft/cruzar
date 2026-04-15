import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { DIRECTIONS } from "../lib/content";

const HOST = process.env.BRAND_HOST ?? "http://localhost:3100";
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "screenshots");

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const ROUTES = [
  { slug: "index", path: "/" },
  ...DIRECTIONS.map((d) => ({ slug: d.slug, path: `/direction/${d.slug}` })),
] as const;

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROME ?? "/run/current-system/sw/bin/google-chrome",
  });
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      for (const route of ROUTES) {
        const url = `${HOST}${route.path}`;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        const file = join(OUT, `${route.slug}-${vp.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`captured ${file}`);
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
