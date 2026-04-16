import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

/**
 * Multi-page PDF export for prez decks.
 *
 * The bundled `prez-export pdf` invokes `chrome --print-to-pdf`, which on
 * this machine ignores the `@page { size: ... }` rule that prez emits in
 * print mode and collapses the deck onto a single Letter page.
 *
 * Playwright's `page.pdf({ preferCSSPageSize: true })` honors the rule
 * correctly, producing one page per slide. We point at the running
 * `vite preview` server to keep the slide React tree alive (so fonts and
 * any client-rendered content settle before capture).
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const URL = process.env.DECK_URL ?? "http://localhost:4180";
const OUTPUT = process.env.DECK_PDF ?? join(ROOT, "cruzar-deck.pdf");

async function main() {
  await mkdir(dirname(OUTPUT), { recursive: true });
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
    await page.goto(`${URL}/?print=true`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.pdf({
      path: OUTPUT,
      preferCSSPageSize: true,
      printBackground: true,
    });
    console.log(`exported ${OUTPUT}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
