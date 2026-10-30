// Scenario "Competitor watch" (option): a row of tri-vision billboards, one per competitor and sized by priority, with a
// spotting scope on a tripod in front. Each week the scope pans along the row and settles on the main rival just as its
// louvres turn over to a new message. Three turns of a third each close the loop.
import { kernel, hue, k, lerp, f, type Piece, type V3 } from './iso';
import { lit, rope, planeAt } from './icons';

const PERIOD = 9, WK = 3, TAU = 2 * Math.PI;
const BW = 186, BD = 128, BZ = 12, BY = 22;                                       // plinth; billboards' line
// Billboards, main rival first: left x, louvre count, louvre width, height, leg height
const BOARDS = [{ x: 14, n: 8, s: 8, h: 50, leg: 30 }, { x: 98, n: 6, s: 7, h: 38, leg: 26 }, { x: 156, n: 4, s: 6, h: 28, leg: 22 }];
const SC: V3 = [100, 92, BZ + 40];                                                 // scope pivot
const K = kernel([[0, 0, 0], [BW, 0, 0], [0, BD, 0], [BW, BD, 0], [14, BY, BZ + 30 + 50 + 10], [BW, BY, BZ + 70]], 20);
const { poly, line, box, cyl } = K;
const FILL = ['paper', 'body', 'tint'];

// One louvre: an upright triangular prism turned to a. Each face carries its strip of one of three messages (j of n
// across the board): a headline, a rising bar chart, a big round badge. A turn shows a new message.
function louvre(cx: number, cy: number, s: number, z: number, h: number, a: number, j: number, n: number) {
  const r = s / Math.sqrt(3), pts = [0, 1, 2].map((i) => [cx + r * Math.cos(a + i * TAU / 3), cy + r * Math.sin(a + i * TAU / 3)]);
  const W = n * s, x0 = j * s, art = [
    `<path class="det" d="M${4 - x0} ${f(h * .22)}H${W - 10 - x0}M${4 - x0} ${f(h * .32)}H${W * .6 - x0}"/><rect class="f tint" x="${4 - x0}" y="${f(h * .72)}" width="${f(W * .34)}" height="${f(h * .12)}"/>`,
    `<rect class="f tint" x="1.2" y="${f(h * (.8 - .55 * j / (n - 1)))}" width="${s - 2.4}" height="${f(h * (.55 * j / (n - 1)) + h * .12)}"/>`,
    `<circle class="f paper" cx="${W / 2 - x0}" cy="${f(h / 2)}" r="${f(h * .32)}"/><circle class="det" cx="${W / 2 - x0}" cy="${f(h / 2)}" r="${f(h * .22)}"/>`,
  ];
  const faces = [0, 1, 2].map((i) => { const p = pts[i], q = pts[(i + 1) % 3], nx = q[1] - p[1], ny = p[0] - q[0]; return { i, p, q, d: nx + ny, m: p[0] + q[0] + p[1] + q[1] }; })
    .filter((w) => w.d > 0).sort((u, v) => u.m - v.m); // faces turned towards the viewer, back to front
  return faces.map(({ i, p, q }) => poly([[p[0], p[1], z], [q[0], q[1], z], [q[0], q[1], z + h], [p[0], p[1], z + h]], `f ${FILL[i]}`) +
    `<g transform="${planeAt(K, [q[0], q[1], z + h], [(p[0] - q[0]) / s, (p[1] - q[1]) / s, 0], [0, 0, -1])}"><clipPath id="tv-${s}-${j}-${i}"><rect width="${s}" height="${h}"/></clipPath><g clip-path="url(#tv-${s}-${j}-${i})">${art[i]}</g></g>`).join('') +
    poly(pts.map(([x, y]) => [x, y, z + h] as V3), 'f paper');
}

function board(b: typeof BOARDS[0], a: (i: number) => number) {
  const w = b.n * b.s, z0 = BZ + b.leg;
  let g = box(b.x + 4, BY - 2, BZ, 4, 4, b.leg + b.h + 4, 'paper', 'body') + box(b.x + w - 8, BY - 2, BZ, 4, 4, b.leg + b.h + 4, 'paper', 'body');
  g += line([[b.x + 6, BY, BZ + 4], [b.x + w - 6, BY, z0 - 4]], 'det') + line([[b.x + 6, BY, z0 - 4], [b.x + w - 6, BY, BZ + 4]], 'det');
  g += box(b.x - 2, BY - 4, z0 - 3, w + 4, 8, 3, 'paper', 'body', 'tint');
  for (let i = 0; i < b.n; i++) g += louvre(b.x + b.s * (i + .5), BY, b.s, z0, b.h, a(i), i, b.n);
  return g + box(b.x - 2, BY - 4, z0 + b.h, w + 4, 8, 3, 'paper', 'body', 'tint');
}

const centre = (j: number): V3 => { const b = BOARDS[j]; return [b.x + b.n * b.s / 2, BY, BZ + b.leg + b.h / 2]; };
const yawTo = (j: number) => { const c = centre(j); return Math.atan2(c[1] - SC[1], c[0] - SC[0]); };

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const wk = Math.floor(t / WK), w = t - wk * WK;
  // The scope pans main rival → far end → middle → main rival, then holds while the louvres turn
  const yaw = lerp(lerp(lerp(yawTo(0), yawTo(2), k(w, 0, .8)), yawTo(1), k(w, .9, 1.4)), yawTo(0), k(w, 1.5, 2));
  const turn = (i: number) => TAU / 3 * (wk + k(w, 2 + i * .07, 2.6 + i * .07)) + Math.PI / 6;
  const fresh = k(w, 2.5, 2.9) + (1 - k(w, 0, .4));
  let s = K.plinth(0, 0, BW, BD);
  const main = board(BOARDS[0], turn);
  s += main + lit(main, fresh);
  s += board(BOARDS[1], () => Math.PI / 6) + board(BOARDS[2], () => Math.PI / 6);
  // Tripod and scope: legs to the plinth, a head, the tube along the yaw, tilted up a little towards the boards
  const [x, y, z] = SC, foot = (a: number): V3 => [x + 26 * Math.cos(a), y + 26 * Math.sin(a), BZ];
  const c = centre(0), up = Math.atan2(c[2] - z, Math.hypot(c[0] - x, c[1] - y)) * .8, dx = Math.cos(yaw) * Math.cos(up), dy = Math.sin(yaw) * Math.cos(up), dz = Math.sin(up);
  const at = (u: number): V3 => [x + dx * u, y + dy * u, z + 6 + dz * u];
  const legs = [-.5, 1.6, 3.7].map((a) => rope(K, [[x, y, z - 2], foot(a)], 3.2, 'f paper')).join('');
  s += legs + cyl(x, y, z - 6, 6, 6, 'paper', 'body') + cyl(x, y, z, 2.4, 6, 'paper', 'body');
  // Tube: eyepiece, body with its focus ring, the wide objective at the far end
  s += rope(K, [at(-24), at(-14)], 5, 'f body') + rope(K, [at(-15), at(24)], 10, 'f paper') + rope(K, [at(2), at(7)], 11, 'f tint') + rope(K, [at(22), at(36)], 14, 'f paper') + rope(K, [at(33), at(36)], 14, 'f body');
  return hue('a', s);
}

export const trivision: Piece = {
  aria: 'A row of tri-vision billboards, one per competitor and sized by priority, with a spotting scope on a tripod in front. Each week the scope pans the row and settles on the main rival as its louvres turn to a new message.',
  period: PERIOD, rest: 2.95, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
