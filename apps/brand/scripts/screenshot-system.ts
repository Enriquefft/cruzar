import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HOST = process.env.BRAND_HOST ?? "http://localhost:3100";
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "screenshots");

const ROUTES = [
  { slug: "index", path: "/system" },
  { slug: "actions", path: "/system/actions" },
  { slug: "inputs", path: "/system/inputs" },
  { slug: "forms", path: "/system/forms" },
  { slug: "foundations", path: "/system/foundations" },
  { slug: "data", path: "/system/data" },
  { slug: "navigation", path: "/system/navigation" },
  { slug: "feedback", path: "/system/feedback" },
  { slug: "overlays", path: "/system/overlays" },
] as const;

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROME ?? "/run/current-system/sw/bin/google-chrome",
  });
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      const url = `${HOST}${route.path}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const file = join(OUT, `system-${route.slug}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`captured ${file}`);
    }
    await ctx.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
