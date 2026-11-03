// Renders /og into public/og.webp (animated, one seamless loop) and public/og.png (the rest frame).
// Needs the site running (`npm run dev` or `npm run preview`), Playwright and python3 with Pillow. Usage: npm run og [-- <url>]
// CommonJS so a global Playwright install resolves via NODE_PATH.
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');

const URL = process.argv[2] ?? 'http://127.0.0.1:4321/og';
const FPS = 20, SPEED = 0.6; // same pace as on the page (IsoArt SPEED)
const out = path.join(__dirname, '../public'), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const { period, rest } = await page.evaluate(() => ({ period: og.period, rest: og.rest }));
  const n = Math.round(period / SPEED * FPS);
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => og.draw(t), rest + i * period / n);
    await page.screenshot({ path: path.join(tmp, `${String(i).padStart(4, '0')}.png`) });
  }
  await browser.close();
  // Pillow, not ffmpeg: ffmpeg's libwebp_anim broke the orange glow into blocks at any lossy quality
  execFileSync('python3', ['-c', `import sys, glob
from PIL import Image
f = [Image.open(p).convert('RGB') for p in sorted(glob.glob(sys.argv[1] + '/*.png'))]
f[0].save(sys.argv[2], save_all=True, append_images=f[1:], duration=${1000 / FPS}, loop=0, quality=80, method=4, minimize_size=True)`, tmp, path.join(out, 'og.webp')]);
  fs.copyFileSync(path.join(tmp, '0000.png'), path.join(out, 'og.png'));
  fs.rmSync(tmp, { recursive: true });
  for (const f of ['og.webp', 'og.png']) console.log(f, (fs.statSync(path.join(out, f)).size / 1024).toFixed(0), 'KB');
})();
