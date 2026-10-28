// Scenario "LinkedIn fit gate": a baggage belt. Bags come out of a tunnel, pass a sizing frame that scans them, and a
// turntable at the junction sends each one straight on, onto the inspection line, or back; every branch ends in a tunnel.
import { kernel, hue, keys, POP, EASY, type Piece, type V3 } from './iso';

const ZB = 22, BWD = 30, V = 72;                                             // belt top, belt width, belt speed
const JX = 130, CXJ = JX + BWD / 2, CYJ = BWD / 2, R = 13;                    // junction square and its turntable
const GX = 62, TH = 52;                                                      // sizing frame x, tunnel height
const XE = -6, XO = JX + 96, YT = BWD + 56, YB = -56;                        // tunnel mouths: entry, on, table, back
const ROUTE = ['on', 'table', 'on', 'back', 'on', 'table'], N = ROUTE.length, STEP = 2.1, PERIOD = N * STEP;
const TURN: Record<string, number> = { on: 0, table: Math.PI / 2, back: -Math.PI / 2 };
const X0 = -26, LD = 15, AD = V * V / (2 * LD), TD = 2 * LD / V;              // start inside the entry tunnel; braking
const A = (CXJ - LD - X0) / V + TD, E = A + .5;                              // stops on the turntable; leaves it
const K = kernel([[-36, -8, 0], [-36, BWD + 8, TH + 5], [JX - 8, -84, 0], [JX + 38, -84, TH + 5], [XO + 28, -8, 0], [XO + 28, BWD + 8, 0],
  [JX - 8, YT + 28, 0], [JX + 38, YT + 28, 0], [GX, -10, ZB + 58]], 16);
const { on, poly, line, box, prism, cyl, ring, TOP, FRONT, SIDE } = K;
const BAGS = [[24, 18, 16], [26, 20, 20], [22, 16, 14]];

// A belt run between two points on one axis; the slats march at belt speed
function belt(x0: number, y0: number, x1: number, y1: number, t: number, alongX: boolean, dir = 1) {
  const w = x1 - x0, d = y1 - y0;
  let s = '';
  for (const [lx, ly] of alongX ? [[x0 + 6, y0], [x1 - 10, y0]] : [[x0, y0 + 6], [x0, y1 - 10]]) s += box(lx + (alongX ? 0 : 4), ly + (alongX ? 4 : 0), 0, 4, 4, ZB - 6, 'paper', 'body');
  s += box(x0, y0, ZB - 6, w, d, 6, 'tint', 'body');
  const L = alongX ? w : d, off = ((dir * t * V) % 10 + 10) % 10;
  for (let p = 4 + off; p < L - 2; p += 10) s += alongX ? line([[x0 + p, y0 + 2, ZB], [x0 + p, y1 - 2, ZB]], 'det') : line([[x0 + 2, y0 + p, ZB], [x1 - 2, y0 + p, ZB]], 'det');
  return s;
}

// A tunnel housing; `mouth` draws the visible opening (with its strip curtain) when the belt enters through a face we see
function tunnel(x: number, y: number, w: number, d: number, mouth?: 'x' | 'y') {
  let s = box(x - 2, y - 2, 0, w + 4, d + 4, 4, 'paper', 'body', 'tint') + box(x, y, 4, w, d, TH - 4, 'paper', 'body', 'tint');
  // Panel seams on the faces we see, a vent box on the roof
  s += on(FRONT(x, y + d, TH), Array.from({ length: Math.floor(w / 10) }, (_, i) => `<line class="det" x1="${(i + 1) * w / (Math.floor(w / 10) + 1)}" y1="2" x2="${(i + 1) * w / (Math.floor(w / 10) + 1)}" y2="${TH - 6}"/>`).join(''));
  s += on(SIDE(x + w, y + d, TH), Array.from({ length: Math.floor(d / 10) }, (_, i) => `<line class="det" x1="${(i + 1) * d / (Math.floor(d / 10) + 1)}" y1="2" x2="${(i + 1) * d / (Math.floor(d / 10) + 1)}" y2="${TH - 6}"/>`).join(''));
  s += cyl(x + w / 2, y + d / 2, TH, 5, 3, 'paper', 'body') + cyl(x + w / 2, y + d / 2, TH + 3, 3, 1.5, 'tint', 'body');
  if (!mouth) return s;
  // The mouth: a framed opening over the belt, hung with a strip curtain
  const span = mouth === 'x' ? d : w, a = (span - BWD) / 2 - 1, top = TH - ZB - 29, b = TH - ZB + 6, sw = (BWD + 2) / 6;
  const strips = Array.from({ length: 6 }, (_, i) => `<rect class="f tint" x="${f2(a + i * sw + .3)}" y="${top}" width="${f2(sw - .6)}" height="${(b - top) * .72}"/>`).join('');
  return s + on(mouth === 'x' ? SIDE(x + w, y + d, TH) : FRONT(x, y + d, TH), `<rect class="f paper" x="${f2(a - 3)}" y="${top - 3}" width="${BWD + 8}" height="${b - top + 3}"/><rect class="f blk" x="${f2(a)}" y="${top}" width="${BWD + 2}" height="${b - top}"/>${strips}`);
}
const f2 = (n: number) => n.toFixed(2);

// A bag as a box turned to angle a, cut to its own length range [l0, l1] where it meets a tunnel mouth
function bag(cx: number, cy: number, a: number, i: number, l0 = -1e3, l1 = 1e3) {
  const [w, d, h] = BAGS[i % 3], c = Math.cos(a), s = Math.sin(a), z = ZB;
  const at = (lx: number, ly: number): [number, number] => [cx + lx * c - ly * s, cy + lx * s + ly * c];
  const u0 = Math.max(-w / 2, l0), u1 = Math.min(w / 2, l1);
  if (u1 - u0 < .2) return '';
  const quad = (a0: number, a1: number, b0: number, b1: number) => [at(a0, b0), at(a1, b0), at(a1, b1), at(a0, b1)];
  let g = prism(quad(u0, u1, -d / 2, d / 2), z, h, 'paper', 'body', 'tint');
  // Two straps over the top and down the long side we see
  const near = c - s > 0 ? d / 2 : -d / 2;
  for (const lx of [-w * .2, w * .2]) if (lx > u0 + .5 && lx < u1 - .5) {
    const [px, py] = at(lx, near), [qx, qy] = at(lx, -near);
    g += line([[px, py, z], [px, py, z + h], [qx, qy, z + h]], 'det');
  }
  // Handle: two posts and the grip, cut like the bag
  const part = (a0: number, a1: number, z0: number, hh: number) => { const b0 = Math.max(a0, u0), b1 = Math.min(a1, u1); return b1 - b0 > .1 ? prism(quad(b0, b1, -1.5, 1.5), z0, hh) : ''; };
  g += part(-5, -3, z + h, 3) + part(3, 5, z + h, 3) + part(-5, 5, z + h + 3, 2);
  return g;
}

// The sizing frame scans a bag as it passes: the slice inside the frame lights up and runs along the bag
function scan(cx: number, i: number) {
  const [w, d, h] = BAGS[i % 3], x0 = Math.max(cx - w / 2, GX - 4), x1 = Math.min(cx + w / 2, GX + 4);
  if (x1 - x0 < .2) return '';
  const y0 = CYJ - d / 2, y1 = CYJ + d / 2, z1 = ZB + h;
  let g = poly([[x0, y1, ZB], [x1, y1, ZB], [x1, y1, z1], [x0, y1, z1]], 'f body') + poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], 'f tint');
  if (x1 >= cx + w / 2 - .01) g += poly([[x1, y0, ZB], [x1, y1, ZB], [x1, y1, z1], [x1, y0, z1]], 'f body');
  return `<g class="lit">${g}</g>`;
}

type Bag = { x: number; y: number; a: number; i: number; l0?: number; l1?: number };
// Bag j, u seconds after it starts inside the entry tunnel. Straight-on bags ride through; the others brake onto the
// turntable, turn with it, and pull away along their branch.
function bagAt(j: number, u: number): Bag | null {
  const r = ROUTE[j % N], w = BAGS[j % 3][0], cut = { l0: XE - (X0 + V * u) };
  if (u < 0) return null;
  if (r === 'on') { const x = X0 + V * u; return x - w / 2 > XO + 2 ? null : { x, y: CYJ, a: 0, i: j, ...cut }; }
  const t1 = A - TD;
  if (u < t1) return { x: X0 + V * u, y: CYJ, a: 0, i: j, ...cut };
  if (u < A) { const τ = u - t1; return { x: CXJ - LD + V * τ - AD * τ * τ / 2, y: CYJ, a: 0, i: j }; }
  const a = keys(u, [[A + .03, 0, POP], [A + .45, TURN[r]]]), τ = Math.max(0, u - E);
  const sd = τ < TD ? AD * τ * τ / 2 : LD + V * (τ - TD);
  if (r === 'table') return CYJ + sd - w / 2 > YT + 2 ? null : { x: CXJ, y: CYJ + sd, a, i: j };
  const y = CYJ - sd;
  return y + w / 2 < YB - 1 ? null : { x: CXJ, y, a, i: j, l1: y - YB };
}
// The turntable turns with a bag, then swings back once the bag has rolled off it
function platter(j: number, u: number) {
  const r = ROUTE[j % N];
  if (r === 'on' || u < A) return 0;
  const clear = E + TD + (R + BAGS[j % 3][0] / 2 + 2 - LD) / V;
  return keys(u, [[A + .03, 0, POP], [A + .45, TURN[r]], [clear, TURN[r], EASY], [clear + .4, 0]]);
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const j = Math.floor(t / STEP), u = t - j * STEP;
  const bags: Bag[] = [];
  let turn = 0;
  for (const back of [0, 1, 2, 3]) {
    const jj = (((j - back) % N) + N) % N, uu = u + back * STEP, p = bagAt(jj, uu);
    if (p) bags.push(p);
    turn += platter(jj, uu);
  }
  const draw1 = (b: Bag) => bag(b.x, b.y, b.a, b.i, b.l0, b.l1);
  const behind = bags.filter((b) => b.y + BAGS[b.i % 3][0] / 2 < -1);
  const rest = bags.filter((b) => !behind.includes(b)).sort((p, q) => p.x + p.y - q.x - q.y);

  // Back branch: belt, tunnel, then the bags rolling into its curtain
  let s = belt(JX, -74, JX + BWD, 0, t, false, -1) + tunnel(JX - 6, -82, BWD + 12, 26, 'y') + behind.map(draw1).join('');
  // Main line, the junction with its turntable, the straight-on run and the inspection branch
  s += belt(-28, 0, JX, BWD, t, true) + belt(JX + BWD, 0, XO + 14, BWD, t, true) + belt(JX, BWD, JX + BWD, YT + 14, t, false);
  s += box(JX, 0, ZB - 6, BWD, BWD, 4, 'tint', 'body') + cyl(CXJ, CYJ, ZB - 2, R, 2, 'paper', 'body');
  const c = Math.cos(turn), sn = Math.sin(turn);
  s += [-8, -4, 0, 4, 8].map((lx) => { const ly = Math.sqrt(R * R - lx * lx) - 1.5; return line([[CXJ + lx * c + ly * sn, CYJ + lx * sn - ly * c, ZB], [CXJ + lx * c - ly * sn, CYJ + lx * sn + ly * c, ZB]], 'det'); }).join('');
  s += line(ring(CXJ, CYJ, ZB, R - 3, 0, 2 * Math.PI, 32), 'det');
  s += tunnel(-34, -6, 28, BWD + 12, 'x');
  // Sizing frame: posts each side, a cross beam over the belt; bags pass under it
  s += box(GX - 3, -10, 0, 6, 6, ZB + 52, 'paper', 'body');
  s += rest.filter((b) => b.x < GX).map((b) => draw1(b) + scan(b.x, b.i)).join('');
  s += box(GX - 3, -10, ZB + 52, 6, BWD + 20, 6, 'paper', 'body', 'tint');
  s += rest.filter((b) => b.x >= GX).map((b) => draw1(b) + (b.a === 0 && b.y === CYJ ? scan(b.x, b.i) : '')).join('');
  s += box(GX - 3, BWD + 4, 0, 6, 6, ZB + 52, 'paper', 'body') + on(FRONT(GX - 3, BWD + 10, ZB + 40), '<rect class="f blk" x="1" y="2" width="4" height="8" rx=".5"/>');
  s += tunnel(XO, -6, 26, BWD + 12) + tunnel(JX - 6, YT, BWD + 12, 26);
  return hue('a', s);
}

export const baggage: Piece = {
  aria: 'A baggage belt. Bags come out of a tunnel and pass a sizing frame; a turntable sends each one straight on, onto the inspection line, or back, each into its own tunnel.',
  period: PERIOD, rest: 2 * STEP + 1.6, viewBox: K.viewBox, focus: [0.55, 0.5], draw,
};
