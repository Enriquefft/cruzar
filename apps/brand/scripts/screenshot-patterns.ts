import { chromium } from "playwright";
const url = "http://localhost:3100/system/patterns";
const out = "/home/hybridz/Projects/cruzar/apps/brand/screenshots/system-patterns.png";
async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROME ?? "/run/current-system/sw/bin/google-chrome",
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: out, fullPage: true });
  console.log("captured", out);
  await browser.close();
}
main();
