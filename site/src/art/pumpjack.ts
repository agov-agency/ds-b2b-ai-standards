// Scenario "Turn social signals into pipeline": an oil field. Each pump jack nods away into its own company's tank;
// a full tank opens its valve and drains into the main line along the side: the pipeline, literally.
import { kernel, hue, k, lerp, f, type Piece, type V3 } from './iso';

const PERIOD = 8, TAU = 2 * Math.PI, N = 3, ROW = 74, MX = 178;           // rows of jack + tank, one behind another; main line x
const JY = 0, JD = 14, PZ = 58, TR = 17, TH = 56, ZM = 9;                     // jack depth; beam pivot height; tank radius / height; main line z
const YE = (N - 1) * ROW + 30;
const K = kernel([[-10, -24, 0], [MX + 8, -24, 0], [-10, YE + 30, 0], [MX + 8, YE + 30, 0], [-40, 0, PZ + 30], [140, 8, TH + 12]], 22);
const { P, poly, line, box, cyl, cylX, cylY, arrow } = K;

type P2 = [number, number];
// A flat part lying in the x-z plane between y0 and y1: back face, the side walls that face the viewer, front face
function plate(pts: P2[], y0: number, y1: number, face = 'paper', side = 'body') {
  let s = '';
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], nx = b[1] - a[1], nz = a[0] - b[0];
    if (nx + nz > 0) s += poly([[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], `f ${side}`);
  });
  return s + poly(pts.map(([x, z]) => [x, y1, z] as V3), `f ${face}`);
}
const rot = (cx: number, cz: number, a: number, pts: P2[]) => pts.map(([x, z]) => [cx + x * Math.cos(a) - z * Math.sin(a), cz + x * Math.sin(a) + z * Math.cos(a)] as P2);
const arcPts = (cx: number, cz: number, r: number, a0: number, a1: number, n = 10) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), cz + r * Math.sin(a)] as P2; });

function jack(x0: number, th: number) {
  const px = x0 + 40, cx = x0 + 70, cz = 24, CRK = 8;
  // The beam's tilt follows the crank through a rigid pitman: find the angle where pin and tail sit one pitman apart
  const pin: P2 = [cx + CRK * Math.cos(th), cz + CRK * Math.sin(th)], PL = Math.hypot(px + 38 - cx, PZ - cz);
  let lo = -.6, hi = .6;
  for (let q = 0; q < 24; q++) { const m = (lo + hi) / 2; if (Math.hypot(px + 38 * Math.cos(m) - pin[0], PZ + 38 * Math.sin(m) - pin[1]) < PL) lo = m; else hi = m; }
  const phi = (lo + hi) / 2;
  let s = box(x0, JY, 0, 92, JD, 4, 'paper', 'body', 'tint');
  // Wellhead and its flow line out the back
  s += cylY(-24, JY + 4, x0 + 8, 8, 2.6) + cyl(x0 + 8, JY + JD / 2, 4, 5, 6, 'paper', 'body') + cyl(x0 + 8, JY + JD / 2, 10, 2.6, 8, 'paper', 'body');
  // Samson post: two legs to the pivot
  s += plate([[px - 16, 4], [px - 12, 4], [px + 1, PZ - 2], [px - 1, PZ - 2]], JY + 2, JY + 5) + plate([[px + 12, 4], [px + 16, 4], [px + 1, PZ - 2], [px - 1, PZ - 2]], JY + 2, JY + 5);
  // Gearbox and crank with its counterweight, turning
  s += box(cx - 9, JY + 2, 4, 18, JD - 4, 18, 'paper', 'body', 'tint');
  const cw = rot(cx, cz, th + Math.PI, [[-11, -3], [20, -9], [22, 0], [20, 9], [-11, 3]]);
  s += plate(cw, JY + JD - 2, JY + JD + 2, 'tint');
  // Walking beam with horse head at the well end; the pitman runs from the crank pin up to the beam's tail
  const beam = rot(px, PZ, phi, [[-34, -2.5], [40, -2.5], [40, 2.5], [-34, 2.5]]);
  const head = rot(px, PZ, phi, [...arcPts(-34, -4, 14, Math.PI * .55, Math.PI * 1.45, 8), [-34, 3]]);
  const tail = rot(px, PZ, phi, [[38, 0]])[0];
  const hb = rot(px, PZ, phi, [[-34 - 14 * Math.cos(Math.PI * .05) + 0, -4]])[0];
  s += line([[x0 + 8, JY + JD / 2, 18], [x0 + 8, JY + JD / 2, hb[1] - 6]], 'f');
  s += plate(beam, JY + 3, JY + 9) + plate(head, JY + 2, JY + 10, 'tint', 'body') + cylY(JY + 9, JY + 11, px, PZ, 2.4);
  s += line([[pin[0], JY + JD + 2, pin[1]], [tail[0], JY + 9, tail[1]]], 'tube-o') + line([[pin[0], JY + JD + 2, pin[1]], [tail[0], JY + 9, tail[1]]], 'tube-i') + cylY(JY + JD + 2, JY + JD + 4, pin[0], pin[1], 2.2, 'blk', 'blk');
  return s;
}

function tank(x: number, y: number, lvl: number, open: number) {
  const g = (TH - 8) * lvl;
  let s = cyl(x, y, 0, TR + 2, 4, 'paper', 'body') + cyl(x, y, 4, TR, TH, 'paper', 'tint') + cyl(x, y, 4 + TH, TR - 6, 3, 'paper', 'body');
  // Level gauge: a glass tube on the front with the level inside
  const gx = x + TR * .72, gy = y + TR * .72;
  s += cyl(gx + 3, gy + 3, 6, 2.6, TH - 4, 'paper', 'paper') + (g > 1 ? cyl(gx + 3, gy + 3, 7, 1.8, g, 'body', 'body') + (lvl > .85 ? `<g class="lit" style="opacity:${f(Math.min(1, (lvl - .85) / .1))}">${cyl(gx + 3, gy + 3, 7, 1.8, g, 'body', 'body')}</g>` : '') : '');
  // Outlet to the main line with its valve and handwheel
  const wx = x + TR + 13, a = open * TAU;
  const flowing = Math.min(1, open * 3);
  s += cylX(x + TR - 2, MX - 4, y, ZM, 2.8) + (flowing > .01 ? `<g style="opacity:${f(flowing)}">${line([[x + TR, y, ZM + 2.8], [MX - 4, y, ZM + 2.8]], 'flow')}</g>` : '') + box(wx - 4, y - 5, ZM - 5, 8, 10, 10, 'paper', 'body', 'tint') + cyl(wx, y, ZM + 5, 1.4, 8, 'paper', 'body');
  const [sx, sy] = P(wx, y, ZM + 13);
  const spokes = [0, 1, 2].map((q) => { const b = a + q * TAU / 3; return `<path class="det" d="M${f(sx)} ${f(sy)}L${f(sx + 7 * Math.cos(b))} ${f(sy + 3.5 * Math.sin(b))}"/>`; }).join('');
  s += `<ellipse class="f body" cx="${f(sx)}" cy="${f(sy)}" rx="8" ry="4"/><g class="lit" style="opacity:${f(flowing)}"><ellipse class="f body" cx="${f(sx)}" cy="${f(sy)}" rx="8" ry="4"/></g><ellipse class="f paper" cx="${f(sx)}" cy="${f(sy - 1)}" rx="6" ry="3"/>${spokes}`;
  return s;
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  let s = '', main = 0;
  // Rows run back to front; a row is the same drawing shifted along y (a straight screen offset in this projection)
  for (let i = 0; i < N; i++) {
    const th = TAU * 4 * t / PERIOD + i * 2.1, u = ((t - i * PERIOD / N) % PERIOD + PERIOD) % PERIOD;
    // Fills for 5.4 s, valve opens, drains, valve closes
    const open = k(u, 5.4, 5.9) - k(u, 7.3, 7.9), lvl = lerp(.12, 1, Math.min(1, u / 5.4)) - .88 * k(u, 5.8, 7.2);
    const [dx, dy] = K.D(0, i * ROW, 0);
    main = Math.max(main, Math.min(1, open * 3));
    s += `<g transform="translate(${f(dx)} ${f(dy)})">${cylX(8, 120 - TR, -18, 8, 2.6) + jack(0, th) + tank(122, 6, lvl, open)}</g>`;
  }
  // Main line along the side on low supports
  const ml = [-10, 60, 130].map((y) => box(MX - 5, y, 0, 10, 6, ZM - 4, 'paper', 'body')).join('') + cylY(-24, YE, MX, ZM, 4, 'paper', 'tint') +
    (main > .01 ? `<g style="opacity:${f(main)}">${line([[MX, 6, ZM + 4], [MX, YE, ZM + 4]], 'flow')}</g>` : '');
  return hue('a', s + ml) + arrow([[MX, YE - 6, ZM + 12], [MX, YE + 26, ZM + 12]], { dot: true });
}

export const pumpjack: Piece = {
  aria: 'Three pump jacks nod in a row, each filling its own tank. A full tank opens its valve and drains into the main pipeline along the side.',
  period: PERIOD, rest: 5.7, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
