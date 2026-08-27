import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });

const card = page.locator("#sistema ol > li").first().locator("article");
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);

const antes = await card.evaluate((el) => getComputedStyle(el).boxShadow);
const b = await card.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + 60);
await page.waitForTimeout(1200);
const desp = await card.evaluate((el) => getComputedStyle(el).boxShadow);

console.log("ANTES  :", antes);
console.log("DESPUÉS:", desp);
console.log("¿cambió?:", antes !== desp);
await browser.close();
