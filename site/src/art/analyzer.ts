// Scenario "Signal loop": a lab analyzer. Each week a cassette of five tubes from the rack runs through the analyzer
// while one sealed control tube stays out. Two tubes come out reacted; that result turns the selector knob, so next
// week a different set of tubes goes in. A loop that learns which signals are worth testing.
import { kernel, hue, k, keys, f, EASY, type Piece } from './iso';

const PERIOD = 8, TAU = 2 * Math.PI;
const BZ = 12, AX0 = 96, AX1 = 176, AD = 64, AH = 104;                         // plinth top; analyzer x range, depth, height
const CY = 26, CW = 66, CD = 14, TR = 3.6, TH = 28, CZ = 36;                  // cassette lane y, cassette length / depth / height; tube radius, height
const XL = -46, XR = AX1 + 6, BX1 = 256;                                      // cassette rises at XL, sinks at XR; bench end
const HIT = [1, 3];                                                           // the tubes that react
const K = kernel([[-52, -14, 0], [BX1, -14, 0], [-52, AD + 22, 0], [BX1, AD + 22, 0], [AX0, 0, BZ + AH + 6], [-46, 0, BZ + TH + 14]], 20);
const { P, on, line, box, cyl, cylY, FRONT, SIDE, TOP, arrow, curve } = K;

// Parts of the cassette below the bench top are inside the bench: cut boxes and upright cylinders at z = BZ
const cbox = (x: number, y: number, z: number, w: number, d: number, h: number, ...c: string[]) => z + h <= BZ + .05 ? '' : box(x, y, Math.max(z, BZ), w, d, z + h - Math.max(z, BZ), ...c);
const ccyl = (x: number, y: number, z: number, r: number, h: number, ...c: string[]) => z + h <= BZ + .05 ? '' : cyl(x, y, Math.max(z, BZ), r, z + h - Math.max(z, BZ), ...c);
const tube = (x: number, y: number, z: number, fill: number, cls = 'tint', cap = 'body') =>
  ccyl(x, y, z, TR, TH, 'tint', 'paper') + (fill > 0 ? ccyl(x, y, z + 1, TR - .8, TH * fill, cls, cls) : '') + ccyl(x, y, z + TH, TR + .6, 4, 'paper', cap);

// The cassette at x, dz below its lane. The two hits glow as they come out of the analyzer, by how far out they are.
function cassette(x: number, dz: number) {
  const z = BZ + dz;
  let g = cbox(x, CY, z, CW, CD, 6, 'paper', 'body', 'tint');
  for (let i = 0; i < 5; i++) {
    const tx = x + 9 + i * 12, hot = HIT.includes(i) ? Math.min(1, Math.max(0, (tx - AX1 + 2) / 10)) : 0;
    g += tube(tx, CY + CD / 2, z + 3, .55) + (hot > .01 ? `<g class="lit" style="opacity:${f(hot)}">${tube(tx, CY + CD / 2, z + 3, .85, 'body')}</g>` : '');
  }
  return g + cbox(x, CY + CD - 3, z, CW, 3, 9, 'paper', 'body', 'tint');
}
// What of the lane we can see beyond the analyzer's exit face (the slab x > AX1 seen from the front); the rest of a
// cassette in that window shows through the opening, which covers the lane's cross-section
const exitWin = (() => {
  const x0 = AX1, x1 = AX1 + 300, y0 = CY - 1, y1 = CY + CD + 1, z0 = BZ - 1, z1 = BZ + CZ + 2;
  return [[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y1, z1]].map(([x, y, z]) => P(x, y, z).map(f).join(' ')).join('L');
})();
const hatch = (x: number) => on(TOP(x, CY - 3, BZ), `<rect class="f paper" x="0" y="0" width="${CW + 4}" height="${CD + 6}"/><rect class="f blk" x="2" y="2" width="${CW}" height="${CD + 2}"/>`);

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  // Up out of the left hatch, along the lane through the analyzer, down into the right hatch
  const dz = keys(t, [[0, -CZ - 4, EASY], [1, 0], [5.6, 0, EASY], [6.6, -CZ - 4]]), x = keys(t, [[1.1, XL - 2, EASY], [3.9, XR]]);
  const knob = TAU / 6 * k(t, 4.4, 5.4), pulse = k(t, 3.9, 4.4) * (1 - k(t, 5.6, 6.4));
  let s = K.plinth(-52, -14, BX1 + 52, AD + 36);
  s += on(TOP(XL - 6, CY - 5, BZ), `<rect class="f tint" x="0" y="0" width="${XR + CW - XL + 12}" height="${CD + 10}"/><line class="det" x1="0" y1="3" x2="${XR + CW - XL + 12}" y2="3"/><line class="det" x1="0" y1="${CD + 7}" x2="${XR + CW - XL + 12}" y2="${CD + 7}"/>`) + hatch(XL - 2) + hatch(XR - 2);
  // Rack at the back left: two rows of spare tubes, five slots of the front row empty (they ride in the cassette)
  s += box(-46, -6, BZ, 84, 18, 14, 'paper', 'body', 'tint');
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) {
    const tx = -38 + i * 13, ty = -1 + r * 8;
    s += r === 1 && i > 0 ? on(TOP(tx - TR, ty - TR, BZ + 14), `<circle class="f body" cx="${TR}" cy="${TR}" r="${TR - .6}"/>`) : tube(tx, ty, BZ + 10, .5);
  }
  // Entering, the analyzer hides the part inside; leaving, only the window beyond the exit face is drawn
  const leaving = x + CW > AX1;
  if (!leaving) s += cassette(x, dz);
  s += box(AX0, 0, BZ, AX1 - AX0, AD, AH, 'paper', 'body', 'tint');
  s += on(SIDE(AX1, AD, BZ + AH), `<rect class="f paper" x="${AD - CY - CD - 6}" y="${AH - CZ - 6}" width="${CD + 12}" height="${CZ + 6}"/><rect class="f blk" x="${AD - CY - CD - 3}" y="${AH - CZ - 3}" width="${CD + 6}" height="${CZ + 3}"/><rect class="det" x="6" y="6" width="${AD - 12}" height="30" rx="1"/>`);
  s += on(TOP(AX0, 0, BZ + AH), `<rect class="det" x="8" y="8" width="${AX1 - AX0 - 16}" height="${AD - 16}" rx="1"/>` + [0, 1, 2, 3, 4].map((i) => `<line class="det" x1="${20 + i * 10}" y1="16" x2="${20 + i * 10}" y2="${AD - 16}"/>`).join(''));
  // Front panel: a read-out with two marks for the two hits, and the selector knob with six ribs
  const panel = `<rect class="f tint" x="8" y="10" width="40" height="24" rx="1"/>` + [0, 1, 2, 3, 4].map((i) => `<rect class="f ${HIT.includes(i) ? 'body' : 'paper'}" x="${12 + i * 7}" y="${HIT.includes(i) ? 16 : 24}" width="4" height="${HIT.includes(i) ? 14 : 6}"/>`).join('');
  s += on(FRONT(AX0, AD, BZ + AH), panel + `<rect class="det" x="8" y="${AH - 22}" width="60" height="10" rx="1"/>`);
  s += cylY(AD, AD + 6, AX1 - 20, BZ + AH - 26, 11, 'paper', 'body') + cylY(AD + 6, AD + 12, AX1 - 20, BZ + AH - 26, 8, 'paper', 'tint');
  const rib = (q: number) => { const r = knob + q * TAU / 6; return `<path class="det" d="M${f(3 * Math.cos(r))} ${f(3 * Math.sin(r))}L${f(7 * Math.cos(r))} ${f(7 * Math.sin(r))}"/>`; };
  s += on(FRONT(AX1 - 20, AD + 12, BZ + AH - 26), `<g>${[0, 1, 2, 3, 4, 5].map(rib).join('')}</g><g class="lit" style="opacity:${f(pulse)}"><circle class="f body" r="2.4"/></g>`);
  if (leaving) s += `<clipPath id="an-exit"><path d="M${exitWin}Z"/></clipPath><g clip-path="url(#an-exit)">${cassette(x, dz)}</g>`;
  // Control tube: sealed, in its own stand beside the lane, never goes in
  s += box(AX0 - 34, AD - 6, BZ, 18, 18, 8, 'paper', 'body', 'tint') + tube(AX0 - 25, AD + 3, BZ + 4, .55, 'tint', 'body') + cyl(AX0 - 25, AD + 3, BZ + TH + 8, TR + .6, 2, 'body', 'body') + line([[AX0 - 28.6, AD + 3, BZ + TH + 6], [AX0 - 21.4, AD + 3, BZ + TH + 6]], 'det');
  // From the hits to the knob
  const go = curve([AX1 + 40, CY + CD / 2, BZ + TH + 14], [AX1 + 30, AD + 40, BZ + AH], [AX1 - 16, AD + 16, BZ + AH - 14]);
  return hue('a', s) + arrow(go, { dot: true });
}

export const analyzer: Piece = {
  aria: 'A lab analyzer. A cassette of five tubes rises from the bench, runs through it and sinks back while a sealed control tube stays outside; two tubes come out reacted and that turns the selector knob for the next run.',
  period: PERIOD, rest: 4.6, viewBox: K.viewBox, focus: [0.55, 0.5], draw,
};
