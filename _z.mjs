import { chromium } from "playwright";
const SHOT = "C:\\Users\\cavin\\AppData\\Local\\Temp\\claude\\c--Users-cavin-Proyectos-Pagina-Uli\\7f1808df-6e44-4659-943d-f6b75bba479d\\scratchpad\\audit";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
const g = await page.evaluate(() => {
  const j = document.querySelector("#sistema svg.pointer-events-none.absolute").parentElement;
  const r = j.getBoundingClientRect();
  return { top: r.top + window.scrollY, h: r.height, vh: window.innerHeight };
});
const s0 = g.top - g.vh * 0.82;
const s1 = g.top + g.h - g.vh * 1.0;

console.log("=== ACOPLE 1:1 (solo 2 frames de espera; con resorte iría muy atrás) ===");
for (const pct of [0, 0.3, 0.6, 1]) {
  await page.evaluate((v) => window.scrollTo(0, v), s0 + (s1 - s0) * pct);
  await page.waitForTimeout(120);
  const d = await page.evaluate(() => {
    const svg = document.querySelector("#sistema svg.pointer-events-none.absolute");
    const p = Array.from(svg.querySelectorAll("path")).find((x) => (x.getAttribute("stroke") || "").startsWith("url("));
    return Math.round((1 - (parseFloat(getComputedStyle(p).strokeDashoffset) || 0)) * 100);
  });
  console.log(`  scroll ${String(pct * 100).padStart(3)}% -> dibujado ${d}%`);
}

const base = await page.evaluate(() => {
  const p = document.querySelector("#sistema svg.pointer-events-none.absolute path");
  const cs = getComputedStyle(p);
  return { dash: cs.strokeDasharray, width: cs.strokeWidth };
});
console.log("\nPunteado base:", base.dash, "| grosor:", base.width);

// tarjeta: fondo + hover
const card = page.locator("#sistema ol > li").first().locator("article");
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const antes = await card.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { bg: cs.backgroundColor, border: cs.borderColor, shadow: cs.boxShadow.slice(0, 42), translate: cs.translate };
});
const b = await card.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + 60);
await page.waitForTimeout(1100);
const desp = await card.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { shadow: cs.boxShadow.slice(0, 42), translate: cs.translate };
});
console.log("\nTarjeta -> fondo:", antes.bg, "| borde:", antes.border);
console.log("Hover -> sombra cambió:", antes.shadow !== desp.shadow, "| translate:", desp.translate);

// CTA final
const cta = await page.evaluate(() => {
  const s = document.getElementById("sistema");
  const h3s = Array.from(s.querySelectorAll("h3"));
  const cierre = h3s[h3s.length - 1];
  const link = Array.from(s.querySelectorAll('a[href="#agendar"]')).pop();
  return {
    titulo: cierre ? cierre.textContent.trim() : "(no encontrado)",
    cta: link ? link.textContent.trim() : "(no encontrado)",
    altura: link ? Math.round(link.getBoundingClientRect().height) : 0,
  };
});
console.log("\nCTA de cierre:", JSON.stringify(cta));
console.log("Overflow:", await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1));

// capturas
await page.evaluate(() => document.querySelector("#sistema ol > li").scrollIntoView({ block: "center" }));
await page.waitForTimeout(800);
await page.screenshot({ path: `${SHOT}/z-card.png` });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1000);
await page.screenshot({ path: `${SHOT}/z-cta.png` });
await browser.close();
