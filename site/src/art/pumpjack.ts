// Scenario "Turn social signals into pipeline": an oil field. Each pump jack nods away into its own company's tank;
// a full tank opens its valve and drains into the main line along the front: the pipeline, literally.
import { kernel, hue, k, lerp, f, type Piece, type V3 } from './iso';

const PERIOD = 8, TAU = 2 * Math.PI, N = 3, PITCH = 152;
const JY = 0, JD = 14, PZ = 58, TR = 17, TH = 56, YM = 58, ZM = 9;            // jack depth; beam pivot height; tank radius / height; main line
const K = kernel([[-10, -24, 0], [N * PITCH, -24, 0], [-10, YM + 12, 0], [N * PITCH + 60, YM + 12, 0], [40, 0, PZ + 30], [(N - 1) * PITCH + 142, 8, TH + 12]], 22);
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
  const px = x0 + 40, phi = .2 * Math.sin(th), cx = x0 + 70, cz = 24;
  let s = box(x0, JY, 0, 92, JD, 4, 'paper', 'body', 'tint');
  // Wellhead and its flow line out the back
  s += cylY(-24, JY + 4, x0 + 8, 8, 2.6) + cyl(x0 + 8, JY + JD / 2, 4, 5, 6, 'paper', 'body') + cyl(x0 + 8, JY + JD / 2, 10, 2.6, 8, 'paper', 'body');
  // Samson post: two legs to the pivot
  s += plate([[px - 16, 4], [px - 12, 4], [px + 1, PZ - 2], [px - 1, PZ - 2]], JY + 2, JY + 5) + plate([[px + 12, 4], [px + 16, 4], [px + 1, PZ - 2], [px - 1, PZ - 2]], JY + 2, JY + 5);
  // Gearbox and crank with its counterweight, turning
  s += box(cx - 9, JY + 2, 4, 18, JD - 4, 18, 'paper', 'body', 'tint');
  const cw = rot(cx, cz, th, [[-3, -3], [24, -9], [26, 0], [24, 9], [-3, 3]]);
  s += plate(cw, JY + JD - 2, JY + JD + 2, 'tint');
  const pin: P2 = [cx + 18 * Math.cos(th), cz + 18 * Math.sin(th)];
  // Walking beam with horse head at the well end; the pitman runs from the crank pin up to the beam's tail
  const beam = rot(px, PZ, phi, [[-34, -2.5], [40, -2.5], [40, 2.5], [-34, 2.5]]);
  const head = rot(px, PZ, phi, [...arcPts(-34, -4, 14, Math.PI * .55, Math.PI * 1.45, 8), [-34, 3]]);
  const tail = rot(px, PZ, phi, [[38, 0]])[0];
  const hb = rot(px, PZ, phi, [[-34 - 14 * Math.cos(Math.PI * .05) + 0, -4]])[0];
  s += line([[x0 + 8, JY + JD / 2, 18], [x0 + 8, JY + JD / 2, hb[1] - 6]], 'f');
  s += plate(beam, JY + 3, JY + 9) + plate(head, JY + 2, JY + 10, 'tint', 'body') + cylY(JY + 9, JY + 11, px, PZ, 2.4);
  s += line([[pin[0], JY + JD + 2, pin[1]], [tail[0], JY + 9, tail[1]]], 'f') + cylY(JY + JD + 2, JY + JD + 4, pin[0], pin[1], 2.2, 'blk', 'blk');
  return s;
}

function tank(x: number, y: number, lvl: number, open: number) {
  const g = (TH - 8) * lvl;
  let s = cyl(x, y, 0, TR + 2, 4, 'paper', 'body') + cyl(x, y, 4, TR, TH, 'paper', 'tint') + cyl(x, y, 4 + TH, TR - 6, 3, 'paper', 'body');
  // Level gauge: a glass tube on the front with the level inside
  const gx = x + TR * .72, gy = y + TR * .72;
  s += cyl(gx + 3, gy + 3, 6, 2.6, TH - 4, 'paper', 'paper') + (g > 1 ? cyl(gx + 3, gy + 3, 7, 1.8, g, 'body', 'body') + (lvl > .9 ? `<g class="lit">${cyl(gx + 3, gy + 3, 7, 1.8, g, 'body', 'body')}</g>` : '') : '');
  // Outlet to the main line with its valve and handwheel
  const wy = y + TR + 14, a = open * TAU;
  s += cylY(y + TR - 2, YM - 4, x, ZM, 2.8) + box(x - 5, wy - 4, ZM - 5, 10, 8, 10, 'paper', 'body', 'tint') + cyl(x, wy, ZM + 5, 1.4, 8, 'paper', 'body');
  const [sx, sy] = P(x, wy, ZM + 13);
  const spokes = [0, 1, 2].map((q) => { const b = a + q * TAU / 3; return `<path class="det" d="M${f(sx)} ${f(sy)}L${f(sx + 7 * Math.cos(b))} ${f(sy + 3.5 * Math.sin(b))}"/>`; }).join('');
  s += `<g class="${open > 0 && open < 1 ? 'lit' : ''}"><ellipse class="f body" cx="${f(sx)}" cy="${f(sy)}" rx="8" ry="4"/></g><ellipse class="f paper" cx="${f(sx)}" cy="${f(sy - 1)}" rx="6" ry="3"/>${spokes}`;
  return s;
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  let s = '';
  // Main line along the front on low supports
  const ml = [20, 170, 320, 450].map((x) => box(x, YM - 5, 0, 6, 10, ZM - 4, 'paper', 'body')).join('') + cylX(-10, N * PITCH + 50, YM, ZM, 4, 'paper', 'tint');
  for (let i = 0; i < N; i++) {
    const x0 = i * PITCH, th = TAU * 4 * t / PERIOD + i * 2.1, u = ((t - i * PERIOD / N) % PERIOD + PERIOD) % PERIOD;
    // Fills for 5.4 s, valve opens, drains, valve closes
    const open = k(u, 5.4, 5.9) - k(u, 7.3, 7.9), lvl = lerp(.12, 1, Math.min(1, u / 5.4)) - .88 * k(u, 5.8, 7.2);
    s += cylX(x0 + 8, x0 + 120 - TR, -18, 8, 2.6) + jack(x0, th) + tank(x0 + 122, 6, lvl, open);
  }
  return hue('a', s + ml) + arrow([[N * PITCH + 20, YM, ZM + 12], [N * PITCH + 56, YM, ZM + 12]], { dot: true });
}

export const pumpjack: Piece = {
  aria: 'Three pump jacks nod in a row, each filling its own tank. A full tank opens its valve and drains into the main pipeline along the front.',
  period: PERIOD, rest: 5.7, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
