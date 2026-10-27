// Scenario "Signal loop": a lab analyzer. Each week a cassette of five tubes from the rack runs through the analyzer
// while one sealed control tube stays out. Two tubes come out reacted; that result turns the selector knob, so next
// week a different set of tubes goes in. A loop that learns which signals are worth testing.
import { kernel, hue, k, lerp, f, type Piece } from './iso';

const PERIOD = 8, TAU = 2 * Math.PI;
const BZ = 10, AX0 = 96, AX1 = 176, AD = 64, AH = 86;                         // bench top; analyzer x range, depth, height
const CY = 26, CW = 66, CD = 14, TR = 3.6, TH = 28;                           // cassette lane y, cassette length / depth; tube radius, height
const HIT = [1, 3];                                                           // the tubes that react
const K = kernel([[-96, -14, 0], [246, -14, 0], [-96, AD + 22, 0], [246, AD + 22, 0], [AX0, 0, BZ + AH + 6], [-80, 0, BZ + TH + 14]], 20);
const { on, line, box, cyl, cylY, FRONT, SIDE, TOP, arrow, curve } = K;

const tube = (x: number, y: number, z: number, fill: number, cls = 'tint', cap = 'body') =>
  cyl(x, y, z, TR, TH, 'tint', 'paper') + (fill > 0 ? cyl(x, y, z + 1, TR - .8, TH * fill, cls, cls) : '') + cyl(x, y, z + TH, TR + .6, 4, 'paper', cap);

function cassette(x: number, lit: number, a: number) {
  let g = box(x, CY, BZ, CW, CD, 6, 'paper', 'body', 'tint');
  for (let i = 0; i < 5; i++) {
    const tx = x + 9 + i * 12, react = HIT.includes(i) && tx > AX1 - 4;
    const t1 = tube(tx, CY + CD / 2, BZ + 3, .55);
    g += react ? t1 + `<g class="lit" style="opacity:${f(lit)}">${tube(tx, CY + CD / 2, BZ + 3, .85, 'body')}</g>` : t1;
  }
  g += box(x, CY + CD - 3, BZ, CW, 3, 9, 'paper', 'body', 'tint');
  return a < .999 ? `<g style="opacity:${f(a)}">${g}</g>` : g;
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const x = lerp(-84, 40, k(t, 0, 1.4)) + (AX1 + 6 - 40) * k(t, 1.6, 3.6), a = k(t, 0, .4) * (1 - k(t, 6.6, 7.4));
  const lit = k(t, 3.2, 3.8), knob = TAU / 6 * k(t, 4.6, 5.6), pulse = k(t, 3.9, 4.4) * (1 - k(t, 5.6, 6.4));
  let s = box(-96, -14, 0, 342, AD + 36, BZ, 'paper', 'body', 'tint');
  // Rack at the back left: two rows of spare tubes, five slots of the front row empty (they ride in the cassette)
  s += box(-80, -6, BZ, 84, 26, 14, 'paper', 'body', 'tint');
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) {
    const tx = -72 + i * 13, ty = -1 + r * 12;
    s += r === 1 && i > 0 ? on(TOP(tx - TR, ty - TR, BZ + 14), `<circle class="f body" cx="${TR}" cy="${TR}" r="${TR - .6}"/>`) : tube(tx, ty, BZ + 10, .5);
  }
  // Cassette before the analyzer covers it; the analyzer's body hides the part inside the tunnel
  const inside = x + CW > AX0 && x < AX1;
  if (inside) s += cassette(x, lit, a);
  s += box(AX0, 0, BZ, AX1 - AX0, AD, AH, 'paper', 'body', 'tint');
  s += on(SIDE(AX1, AD, BZ + AH), `<rect class="f blk" x="${AD - CY - CD - 4}" y="${AH - 22}" width="${CD + 8}" height="22" rx="1"/><rect class="det" x="6" y="6" width="${AD - 12}" height="30" rx="1"/>`);
  s += on(TOP(AX0, 0, BZ + AH), `<rect class="det" x="8" y="8" width="${AX1 - AX0 - 16}" height="${AD - 16}" rx="1"/>` + [0, 1, 2, 3, 4].map((i) => `<line class="det" x1="${20 + i * 10}" y1="16" x2="${20 + i * 10}" y2="${AD - 16}"/>`).join(''));
  // Front panel: a read-out with two marks for the two hits, and the selector knob with six ribs
  const panel = `<rect class="f tint" x="8" y="10" width="40" height="24" rx="1"/>` + [0, 1, 2, 3, 4].map((i) => `<rect class="f ${HIT.includes(i) ? 'body' : 'paper'}" x="${12 + i * 7}" y="${HIT.includes(i) ? 16 : 24}" width="4" height="${HIT.includes(i) ? 14 : 6}"/>`).join('');
  s += on(FRONT(AX0, AD, BZ + AH), panel + `<rect class="det" x="8" y="${AH - 22}" width="60" height="10" rx="1"/>`);
  s += cylY(AD, AD + 6, AX1 - 20, BZ + AH - 26, 11, 'paper', 'body') + cylY(AD + 6, AD + 12, AX1 - 20, BZ + AH - 26, 8, 'paper', 'tint');
  const rib = (q: number) => { const r = knob + q * TAU / 6; return `<path class="det" d="M${f(3 * Math.cos(r))} ${f(3 * Math.sin(r))}L${f(7 * Math.cos(r))} ${f(7 * Math.sin(r))}"/>`; };
  s += on(FRONT(AX1 - 20, AD + 12, BZ + AH - 26), `<g>${[0, 1, 2, 3, 4, 5].map(rib).join('')}</g><g class="lit" style="opacity:${f(pulse)}"><circle class="f body" r="2.4"/></g>`);
  if (!inside) s += cassette(x, lit, a);
  // Control tube: sealed, in its own stand beside the lane, never goes in
  s += box(AX0 - 34, AD - 6, BZ, 18, 18, 8, 'paper', 'body', 'tint') + tube(AX0 - 25, AD + 3, BZ + 4, .55, 'tint', 'body') + cyl(AX0 - 25, AD + 3, BZ + TH + 8, TR + .6, 2, 'body', 'body') + line([[AX0 - 28.6, AD + 3, BZ + TH + 6], [AX0 - 21.4, AD + 3, BZ + TH + 6]], 'det');
  // From the hits to the knob
  const go = curve([AX1 + 40, CY + CD / 2, BZ + TH + 14], [AX1 + 30, AD + 40, BZ + AH], [AX1 - 16, AD + 16, BZ + AH - 14]);
  return hue('a', s) + (pulse > .02 ? `<g style="opacity:${f(pulse)}">${arrow(go, { dot: true })}</g>` : '');
}

export const analyzer: Piece = {
  aria: 'A lab analyzer. A cassette of five tubes runs through it while a sealed control tube stays outside; two tubes come out reacted and that turns the selector knob for the next run.',
  period: PERIOD, rest: 4.6, viewBox: K.viewBox, focus: [0.55, 0.5], draw,
};
