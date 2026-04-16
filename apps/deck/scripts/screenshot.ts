import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

/**
 * Capture the cover slide (and any additional slides listed in SLIDES)
 * at 1280×720 — the deck's native canvas — for review without a dev server.
 */

const HOST = process.env.DECK_HOST ?? "http://localhost:5173";
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "screenshots");

const SLIDES = [
  { slug: "cover", hash: "" },
  { slug: "salary-delta", hash: "#/2" },
  { slug: "proof", hash: "#/6" },
] as const;

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROME ?? "/run/current-system/sw/bin/google-chrome",
  });
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    for (const s of SLIDES) {
      const url = `${HOST}/${s.hash}`.replace(/\/+$/, "/");
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const file = join(OUT, `${s.slug}.png`);
      await page.screenshot({ path: file });
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
