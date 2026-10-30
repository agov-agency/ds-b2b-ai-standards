// Footer CTA: a typewriter. Contributors' lines type out one after another on the sheet, the struck key lights,
// the carriage steps left with each letter and returns for the next line. The sheet and the struck key are the live (.lit) parts.
import { kernel, k, f, type Piece } from './iso';

const LINES = ['Hi there, here is my skill', 'Hello, let me submit my scenario', 'Hey, I have one interesting rule to share'];
const WRAP = 24, CPS = 12, HOLD = 1.6, FEED = .5, STEP = 3, LH = 15;
// Base on feet (Z0), deck at BZ, back housing to HZ, carriage rail on top; the sheet stands behind the platen
const BW = 260, BD = 190, Z0 = 6, BZ = 30, HZ = 66, PX = 45, PW = 170, PY = 30, PZ = 82, PH = 100, PLY = 40, PLZ = 90;
const SWING = WRAP * STEP / 2; // carriage travel each side of centre
const KEYS = Array.from({ length: 4 }, (_, r) => Array.from({ length: 11 - (r === 3 ? 3 : 0) }, (_, c) => [34 + r * 7 + (r === 3 ? 19.5 : 0) + c * 19.5, 112 + r * 18] as const)).flat();

// Word-wrap each line to the sheet's width; a phrase's timing is its letters plus a hold and a feed
const wrap = (s: string) => s.split(' ').reduce<string[]>((ls, w) => {
  const last = ls[ls.length - 1];
  if (last !== undefined && (last + ' ' + w).length <= WRAP) ls[ls.length - 1] = last + ' ' + w; else ls.push(w);
  return ls;
}, []);
const PHRASES = LINES.map((s) => ({ rows: wrap(s), n: s.length }));
const DUR = PHRASES.map((p) => p.n / CPS + HOLD + FEED);
const PERIOD = DUR.reduce((a, b) => a + b, 0);

const K = kernel([[-36 - SWING, PLY, PLZ], [BW + 36 + SWING, 0, 0], [0, BD, 0], [BW, BD, 0], [PX - SWING, PY, PZ + PH + 6], [PX + PW + SWING, PY, PZ + PH + 6]], 4);
const { on, poly, line, box, cyl, cylX, FRONT, TOP, SIDE } = K;

function machine(dx: number, typed: string[], fade: number, key: number, press: number) {
  let s = '';
  // Feet, then the base with its badge, side vents and the key-lever slot on the deck
  for (const [x, y] of [[12, 12], [BW - 30, 12], [12, BD - 30], [BW - 30, BD - 30]]) s += box(x, y, 0, 18, 18, Z0, 'blk', 'blk', 'blk');
  s += box(0, 0, Z0, BW, BD, BZ - Z0, 'paper', 'body', 'tint');
  s += on(FRONT(0, BD, BZ), `<line class="det" x1="12" y1="6" x2="${BW - 12}" y2="6"/><rect class="f blk" x="${BW / 2 - 24}" y="10" width="48" height="8" rx=".8"/><line class="det" x1="${BW / 2 - 16}" y1="14" x2="${BW / 2 + 16}" y2="14"/>`);
  s += on(SIDE(BW, BD, BZ), Array.from({ length: 9 }, (_, i) => `<line class="det" x1="${96 + i * 8}" y1="6" x2="${96 + i * 8}" y2="18"/>`).join('') + `<line class="det" x1="10" y1="4" x2="${BD - 10}" y2="4"/>`);
  s += on(TOP(0, 0, BZ), `<rect class="det" x="16" y="100" width="${BW - 32}" height="${BD - 108}" rx="1"/><rect class="det" x="20" y="104" width="${BW - 40}" height="${BD - 116}" rx="1"/>`);
  // Typebar basket: a fan of bars between the keys and the housing, the struck bar lit
  const fan = Array.from({ length: 23 }, (_, i) => { const a = Math.PI * (i + 1) / 24, cx = BW / 2, cy = 92; return `<line class="det" x1="${f(cx + 16 * Math.cos(a))}" y1="${f(cy - 8 * Math.sin(a))}" x2="${f(cx + 70 * Math.cos(a))}" y2="${f(cy - 20 * Math.sin(a))}"/>`; }).join('');
  s += on(TOP(0, 0, BZ), `<path class="f body" d="M${BW / 2 - 76} 92 A76 24 0 0 1 ${BW / 2 + 76} 92Z"/>${fan}`);
  // Back housing with its ribbon window, screws and side panel
  s += box(10, 0, BZ, BW - 20, 74, HZ - BZ, 'paper', 'body', 'tint');
  s += on(TOP(10, 0, HZ), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="${92 + i * 12}" y1="62" x2="${92 + i * 12}" y2="70"/>`).join(''));
  s += on(FRONT(10, 74, HZ), `<rect class="det" x="64" y="8" width="${BW - 148}" height="16" rx="1"/><line class="det" x1="72" y1="16" x2="${BW - 92}" y2="16"/><line class="det" x1="10" y1="30" x2="${BW - 30}" y2="30"/>` +
    [16, BW - 36].map((x) => `<circle class="det" cx="${x}" cy="16" r="2.5"/>`).join(''));
  s += on(SIDE(BW - 10, 74, HZ), `<rect class="det" x="8" y="6" width="58" height="24" rx="1"/><circle class="det" cx="16" cy="18" r="2"/><circle class="det" cx="58" cy="18" r="2"/>`);
  // Ribbon spools on the housing's front strip
  for (const x of [34, BW - 34]) s += cyl(x, 64, HZ, 9, 5, 'paper', 'body') + on(TOP(x - 9, 55, HZ + 5), `<circle class="det" cx="9" cy="9" r="4"/><circle class="f blk" cx="9" cy="9" r="1.6"/>`);
  // Carriage (moves with dx): rail with margin scale and stops, return lever, knobs, sheet, bail, platen
  const cx = (x: number) => x + dx;
  s += box(cx(-20), 18, HZ, BW + 40, 40, 10, 'paper', 'body', 'tint');
  s += on(FRONT(cx(-20), 58, HZ + 10), Array.from({ length: 37 }, (_, i) => `<line class="det" x1="${10 + i * 8}" y1="${i % 5 ? 3 : 1}" x2="${10 + i * 8}" y2="7"/>`).join(''));
  for (const x of [40, BW - 48]) s += box(cx(x), 22, HZ + 10, 8, 10, 6, 'paper', 'body', 'tint');
  const arm: [number, number, number][] = [[cx(-30), PLY, PLZ + 8], [cx(-36), PLY + 10, PLZ + 22], [cx(-40), PLY + 22, PLZ + 30]];
  s += line(arm, 'tube-o') + line(arm, 'tube-i');
  s += cyl(cx(-40), PLY + 22, PLZ + 27, 3.5, 5, 'paper', 'body');
  s += cylX(cx(-36), cx(-20), PLY, PLZ, 12, 'paper', 'body') + cylX(cx(-20), cx(-14), PLY, PLZ, 7, 'paper', 'body');
  // Paper rest: a tall plate behind the sheet with ruled guides
  s += poly([[cx(10), 20, PLZ], [cx(BW - 10), 20, PLZ], [cx(BW - 10), 16, PLZ + 80], [cx(10), 16, PLZ + 80]], 'f tint');
  s += [0.3, 0.55, 0.8].map((v) => line([[cx(18), 20 - 4 * v, PLZ + 80 * v], [cx(BW - 18), 20 - 4 * v, PLZ + 80 * v]], 'det')).join('');
  let text = '';
  typed.forEach((row, i) => { text += `<text class="type" x="12" y="${PH - 38 - (typed.length - 1 - i) * LH}">${row}</text>`; });
  s += `<g class="lit">${poly([[cx(PX), PY, PZ], [cx(PX + PW), PY, PZ], [cx(PX + PW), PY, PZ + PH], [cx(PX), PY, PZ + PH]], 'f paper')}` +
    on(FRONT(cx(PX), PY, PZ + PH), `<g style="opacity:${f(fade)}">${text}</g>`) + '</g>';
  s += cylX(cx(-14), cx(BW + 14), PLY, PLZ, 17, 'paper', 'body');
  s += on(FRONT(cx(-14), PLY + 12, PLZ + 12), Array.from({ length: 34 }, (_, i) => `<line class="det" x1="${8 + i * 8}" y1="2" x2="${8 + i * 8}" y2="5"/>`).join(''));
  s += cylX(cx(-6), cx(BW + 6), PLY + 18, PLZ + 16, 2, 'paper', 'body');
  for (const x of [PX + 30, PX + PW - 40]) s += cylX(cx(x), cx(x + 10), PLY + 18, PLZ + 16, 4.5, 'paper', 'body');
  s += cylX(cx(BW + 14), cx(BW + 20), PLY, PLZ, 7, 'paper', 'body') + cylX(cx(BW + 20), cx(BW + 36), PLY, PLZ, 12, 'paper', 'body');
  s += on(SIDE(cx(BW + 36), PLY, PLZ), `<circle class="det" cx="0" cy="0" r="7"/><circle class="f blk" cx="0" cy="0" r="2"/>`);
  // Keys, back row first: rim, cap and letter ring; the struck one sinks and lights. Shift keys and the space bar close the deck
  KEYS.forEach(([x, y], i) => {
    const h = 9 - 4 * (i === key ? press : 0);
    const cap = cyl(x, y, BZ, 7.5, h, 'paper', 'body') + on(TOP(x, y, BZ + h), `<circle class="det" cx="0" cy="0" r="4.5"/>`);
    s += i === key && press > 0.05 ? `<g class="lit">${cap}</g>` : cap;
  });
  for (const x of [22, BW - 44]) s += box(x, 164, BZ, 22, 13, 7, 'paper', 'body', 'tint');
  s += box(70, 177, BZ, 120, 9, 6, 'paper', 'body', 'tint');
  return s;
}

export const typewriter: Piece = {
  aria: 'A typewriter typing out contributors’ lines: here is my skill, let me submit my scenario, I have a rule to share.',
  period: PERIOD, rest: PHRASES[0].n / CPS + .6, viewBox: K.viewBox, focus: [0.5, 0.5],
  draw(t) {
    let u = t % PERIOD, i = 0;
    while (u >= DUR[i]) u -= DUR[i++];
    const { rows, n } = PHRASES[i];
    const shown = Math.min(n, Math.floor(u * CPS));
    // Rows typed so far; the carriage sits at the current row's column
    const typed: string[] = [];
    let left = shown;
    for (const r of rows) { if (left <= 0) break; typed.push(r.slice(0, left)); left -= r.length + 1; }
    const col = typed.length ? typed[typed.length - 1].length : 0;
    const ch = LINES[i].charCodeAt(Math.max(0, shown - 1)) || 0;
    const press = shown < n && shown > 0 ? 1 - k(u * CPS % 1, 0, .6) : 0;
    const fade = 1 - k(u, n / CPS + HOLD, n / CPS + HOLD + FEED);
    return machine(SWING - col * STEP, typed, fade, (ch * 7) % KEYS.length, press);
  },
};
