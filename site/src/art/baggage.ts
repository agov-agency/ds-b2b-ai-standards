// Scenario "LinkedIn fit gate": a baggage belt. Only bags that actually arrived ride the belt; each passes a sizing
// frame, then a diverter arm sends it one of three ways: straight on, onto the inspection table, or back.
import { kernel, hue, k, lerp, f, type Piece, type V3 } from './iso';

const PERIOD = 9, STEP = 1.5, ZB = 22, BWD = 30;                                // belt top, belt width
const JX = 130, JY = 0;                                                      // junction square: x JX…JX+BWD, y 0…BWD
const CXJ = JX + BWD / 2, CYJ = BWD / 2;
const EXIT: Record<string, V3> = { on: [JX + 110, CYJ, ZB], table: [CXJ, BWD + 76, ZB], back: [CXJ, -84, ZB] };
const ROUTE = ['on', 'table', 'on', 'back', 'on', 'table'], N = ROUTE.length, ANG: Record<string, number> = { on: 0, table: Math.PI / 2, back: -Math.PI / 2 };
const GX = 62;                                                               // sizing frame x
const K = kernel([[-24, -10, 0], [JX + 120, -10, 0], [-24, BWD + 10, 0], [CXJ, BWD + 112, 0], [CXJ + 30, -96, 0], [GX, -10, ZB + 60], [JX + 120, BWD + 10, 0]], 20);
const { on, poly, line, box, cyl, TOP, FRONT } = K;
const BAGS = [[24, 18, 16], [26, 20, 20], [22, 16, 14]];

// A belt run between two points on one axis; rollers march with the belt
function belt(x0: number, y0: number, x1: number, y1: number, t: number, alongX: boolean, dir = 1) {
  const w = x1 - x0, d = y1 - y0;
  let s = '';
  for (const [lx, ly] of alongX ? [[x0 + 6, y0], [x1 - 10, y0]] : [[x0, y0 + 6], [x0, y1 - 10]]) s += box(lx + (alongX ? 0 : 4), ly + (alongX ? 4 : 0), 0, 4, 4, ZB - 6, 'paper', 'body');
  s += box(x0, y0, ZB - 6, w, d, 6, 'tint', 'body');
  const L = alongX ? w : d, off = ((dir * t * 26) % 10 + 10) % 10;
  for (let p = 4 + off; p < L - 2; p += 10) s += alongX ? line([[x0 + p, y0 + 2, ZB], [x0 + p, y1 - 2, ZB]], 'det') : line([[x0 + 2, y0 + p, ZB], [x1 - 2, y0 + p, ZB]], 'det');
  return s;
}

function bag(c: V3, i: number, a = 1) {
  const [w, d, h] = BAGS[i % 3], x = c[0] - w / 2, y = c[1] - d / 2, z = c[2];
  let g = box(x, y, z, w, d, h, 'paper', 'body', 'tint') + line([[x + w * .3, y + d, z], [x + w * .3, y + d, z + h], [x + w * .3, y, z + h]], 'det') +
    line([[x + w * .7, y + d, z], [x + w * .7, y + d, z + h], [x + w * .7, y, z + h]], 'det');
  g += box(c[0] - 5, c[1] - 1.5, z + h, 2, 3, 3, 'paper', 'body') + box(c[0] + 3, c[1] - 1.5, z + h, 2, 3, 3, 'paper', 'body') + box(c[0] - 5, c[1] - 1.5, z + h + 3, 10, 3, 2, 'paper', 'body');
  return a < .999 ? `<g style="opacity:${f(a)}">${g}</g>` : g;
}

// Where bag j is u seconds after it appears: along the main belt to the junction centre, then out along its branch
function bagAt(j: number, u: number): { c: V3; a: number } | null {
  const d = u * 72, L1 = CXJ + 20, ex = EXIT[ROUTE[j % N]];
  if (u < 0) return null;
  if (d < L1) return { c: [-20 + d, CYJ, ZB], a: k(u, 0, .4) };
  const L2 = Math.hypot(ex[0] - CXJ, ex[1] - CYJ), v = Math.min(1, (d - L1) / L2);
  if (d - L1 > L2 + 20) return null;
  return { c: [lerp(CXJ, ex[0], v), lerp(CYJ, ex[1], v), ZB], a: 1 - Math.max(0, (d - L1 - L2) / 20) };
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const j = Math.floor(t / STEP), u = t - j * STEP;
  // Diverter swings to the next bag's route while that bag is on the main belt
  const prev = ANG[ROUTE[(j + N - 2) % N]], next = ANG[ROUTE[(j + N - 1) % N]], arm = lerp(prev, next, k(u, 0, .5));
  const bags: { c: V3; i: number; a: number }[] = [];
  for (const back of [0, 1, 2, 3]) {
    const jj = (((j - back) % N) + N) % N, p = bagAt(jj, u + back * STEP);
    if (p) bags.push({ c: p.c, i: jj, a: p.a });
  }
  const zone = (test: (c: V3) => boolean) => bags.filter((b) => test(b.c)).sort((p, q) => p.c[0] + p.c[1] - q.c[0] - q.c[1]);
  const lit = (b: { c: V3; i: number; a: number }) => { const g = bag(b.c, b.i, b.a); return b.c[0] > GX - 14 && b.c[0] < CXJ + 2 && Math.abs(b.c[1] - CYJ) < 2 ? g + `<g class="lit">${g}</g>` : g; };

  let s = belt(JX, -70, JX + BWD, 0, t, false, -1) + box(JX - 4, -84, ZB - 10, BWD + 8, 14, 12, 'paper', 'body', 'tint');
  s += zone((c) => c[1] < -2).map((b) => bag(b.c, b.i, b.a)).join('');
  s += belt(-24, 0, JX, BWD, t, true) + belt(JX, 0, JX + BWD, BWD, 0, true) + belt(JX + BWD, 0, JX + 110, BWD, t, true);
  // Diverter: a post in the junction's far corner and an arm that swings over the belt
  const ax = Math.cos(arm), ay = Math.sin(arm);
  const armEnd: V3 = [CXJ + ax * 15, CYJ + ay * 15, ZB + 2];
  s += cyl(CXJ, CYJ, ZB, 4, 2, 'paper', 'body');
  // Sizing frame: posts each side, a cross beam, the gauge plate hanging inside
  const frameBack = box(GX - 3, -10, 0, 6, 6, ZB + 52, 'paper', 'body');
  s += frameBack;
  const onBelt = zone((c) => c[1] >= -2 && c[1] <= BWD + 2);
  s += onBelt.filter((b) => b.c[0] < GX).map(lit).join('');
  s += box(GX - 3, -10, ZB + 52, 6, BWD + 20, 6, 'paper', 'body', 'tint');
  s += onBelt.filter((b) => b.c[0] >= GX).map(lit).join('');
  s += `<g class="lit">${poly([[CXJ - ay * 2, CYJ + ax * 2, ZB + 2], [armEnd[0] - ay * 2, armEnd[1] + ax * 2, ZB + 2], [armEnd[0] - ay * 2, armEnd[1] + ax * 2, ZB + 12], [CXJ - ay * 2, CYJ + ax * 2, ZB + 12]], 'f body')}</g>` + cyl(CXJ, CYJ, ZB + 2, 2.6, 12, 'paper', 'body');
  s += box(GX - 3, BWD + 4, 0, 6, 6, ZB + 52, 'paper', 'body') + on(FRONT(GX - 3, BWD + 10, ZB + 40), '<rect class="f blk" x="1" y="2" width="4" height="8" rx=".5"/>');
  // Table branch, the inspection table at its end, and bags on it
  s += belt(JX, BWD, JX + BWD, BWD + 60, t, false);
  s += box(JX - 8, BWD + 60, 0, BWD + 16, 40, ZB - 2, 'paper', 'body', 'tint') + on(TOP(JX - 8, BWD + 60, ZB - 2), `<rect class="det" x="4" y="4" width="${BWD + 8}" height="32" rx="1"/>`);
  s += zone((c) => c[1] > BWD + 2).map((b) => bag(b.c, b.i, b.a)).join('');
  return hue('a', s);
}

export const baggage: Piece = {
  aria: 'A baggage belt. Bags pass through a sizing frame, then a diverter arm sends each one straight on, onto an inspection table, or back.',
  period: PERIOD, rest: 1.2, viewBox: K.viewBox, focus: [0.55, 0.5], draw,
};
