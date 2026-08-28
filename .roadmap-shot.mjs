import { chromium } from "playwright";

const OUT = process.argv[2] || "out";
const WIDTH = Number(process.argv[3] || 390);
const HEIGHT = Number(process.argv[4] || 844);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3001", { waitUntil: "networkidle" });

await page.evaluate(() => document.querySelector("#sistema")?.scrollIntoView());
await page.waitForTimeout(1200);

// Scroll slowly through the roadmap so the line draws
const box = await page.evaluate(() => {
  const el = document.querySelector("#sistema");
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height };
});

const shots = 5;
for (let i = 0; i < shots; i++) {
  const y = box.top + (box.height - HEIGHT) * (i / (shots - 1));
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}-${i}.png` });
}

const metrics = await page.evaluate(() => {
  const li = document.querySelector("#sistema ol > li");
  const anchor = li?.querySelector("[data-roadmap-anchor]");
  const svg = document.querySelector("#sistema svg");
  return {
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    sectionHeight: document.querySelector("#sistema").getBoundingClientRect().height,
    rowHeight: li?.getBoundingClientRect().height,
    anchorWidth: anchor?.getBoundingClientRect().width,
    pathD: svg?.querySelector("path")?.getAttribute("d")?.slice(0, 220),
  };
});
console.log(JSON.stringify(metrics, null, 2));

await browser.close();
