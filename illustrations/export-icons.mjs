// Renders every icon in icons.js at rest and writes icons/<name>.svg (tight viewBox, classes kept).
// Usage: node export-icons.mjs [name ...]   (only those icons when names are given)
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// playwright-core from the hairline look cache on the Mac, else any installed playwright
const req = createRequire(join(homedir(), "Library/Caches/hairline-look/look.cjs"));
const { chromium } = await Promise.resolve().then(() => req("playwright-core")).catch(() => createRequire(import.meta.url)("playwright"));
const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const page = await browser.newPage();
await page.setContent("<!doctype html><body></body>");
await page.addScriptTag({ content: readFileSync(join(here, "hairline-kernel.js"), "utf8") });
await page.addScriptTag({ content: readFileSync(join(here, "icons.js"), "utf8") });
await page.addScriptTag({ content: readFileSync(join(here, "icons-items.js"), "utf8") });
const only = process.argv.slice(2);
const out = await page.evaluate((only) => {
  HL.inject(document);
  const res = {};
  for (const [name, draw] of Object.entries(window.ICONS).filter(([n]) => !only.length || only.includes(n))) {
    const host = document.createElement("div");
    host.setAttribute("data-hairline", name);
    document.body.append(host);
    const svg = HL.mk("svg", { viewBox: "0 0 400 320" }, host);
    draw(svg);
    const b = svg.getBBox(), pad = 2;
    const s = Math.max(b.width, b.height) + pad * 2;
    const x = b.x + b.width / 2 - s / 2, y = b.y + b.height / 2 - s / 2;
    svg.setAttribute("viewBox", [x, y, s, s].map((n) => Math.round(n * 100) / 100).join(" "));
    svg.setAttribute("class", "hl");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    res[name] = svg.outerHTML.replace(/(\d+\.\d{2})\d+/g, "$1");
  }
  return res;
}, only);
mkdirSync(join(here, "icons"), { recursive: true });
for (const [name, markup] of Object.entries(out)) writeFileSync(join(here, "icons", name + ".svg"), markup + "\n");
console.log(Object.keys(out).join(" "));
await browser.close();
