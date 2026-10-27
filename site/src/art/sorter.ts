// Scenario "Warm-lead handoff": a post sorting wall. Letters slide down a chute onto a shuttle. A letter that already
// has an owner in the CRM (the black stamp) drops through a flap into the reject bin; the others ride the shuttle to
// their owner's pigeonhole and are pushed in. The hand-off is the letter landing in the right box.
import { kernel, hue, k, lerp, f, type Piece, type V3 } from './iso';

const PERIOD = 7.2, STEP = 2.4;
const CW = 176, CD = 40, CH = 156;                                      // cabinet: x 0…CW, y 0…CD (front face), z 0…CH
const COLS = 4, CX = (c: number) => 10 + c * 41, CUW = 35;               // pigeonhole columns (local x on the front face)
const ROWS = [12, 58, 104], CUH = 34;                                    // pigeonhole rows (local y down from the top)
const SILL = CH - ROWS[1] - CUH;                                         // middle row floor = ledge top
const LX0 = -38, LY = CD, LD = 26;                                       // ledge: x LX0…CW, y CD…CD + LD
const LW = 28, LDp = 18, LT = 1.8;                                       // letter: width along x, depth along y, thickness
const TRAY = 34, HOME = LX0 + 2, ZT = SILL + 3;                           // shuttle tray, its home x, tray top
const XA = -132, ZA = 152, XB = LX0, ZB = ZT + 1;                         // chute: top end, bottom end (lands on the tray)
const FLAP = 24, BIN: [number, number, number, number] = [-82, LX0 - 2, CD - 2, CD + 34]; // flap length; bin x0, x1, y0, y1
const BH = 34;
const zc = (x: number) => ZA + (ZB - ZA) * (x - XA) / (XB - XA);         // chute floor height at x
const TARGET = [1, -1, 3];                                               // per step: column the letter goes to (-1 = owned, rejected)

const K = kernel([[XA - 10, CD + 2, 0], [XA - 10, CD + LD, ZA + 10], [CW + 4, 0, 0], [CW + 4, CD + LD, 0], [0, -4, CH + 8], [CW, -4, CH + 8], [BIN[0], BIN[3], 0], [CW, CD + LD, SILL]], 24);
const { on, poly, line, box, cyl, cylX, FRONT, TOP, arrow, curve } = K;

const lit = (s: string, a: number) => (a > .01 ? `<g class="lit" style="opacity:${f(Math.min(1, a))}">${s}</g>` : '');

// A letter lying flat with its long side along x; z(x) gives the floor under it (a slope on the chute), tilt drops the front.
function letter(x: number, y: number, z: (x: number) => number, stamp = false) {
  const x1 = x + LW, y1 = y + LDp, a: V3 = [x, y, z(x) + LT], b: V3 = [x1, y, z(x1) + LT], c: V3 = [x1, y1, z(x1) + LT], d: V3 = [x, y1, z(x) + LT];
  const dn = (p: V3): V3 => [p[0], p[1], p[2] - LT];
  const m = (u: number, v: number): V3 => { const xx = lerp(x, x1, u); return [xx, lerp(y, y1, v), z(xx) + LT]; };
  let g = poly([b, c, dn(c), dn(b)], 'f body') + poly([d, c, dn(c), dn(d)], 'f body') + poly([a, b, c, d], 'f paper');
  g += line([a, m(.5, .55), b], 'det');
  g += poly([m(.74, .62), m(.88, .62), m(.88, .86), m(.74, .86)], stamp ? 'f blk' : 'f tint');
  return g;
}

// Pigeonhole interiors (back wall, floor, left wall), drawn before the front frame cuts the openings
function cubbies() {
  let s = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < COLS; c++) {
    const x0 = CX(c), x1 = x0 + CUW, zt = CH - ROWS[r], zb = zt - CUH;
    s += poly([[x0, 4, zb], [x1, 4, zb], [x1, 4, zt], [x0, 4, zt]], 'f body');
    s += poly([[x0, 4, zb], [x1, 4, zb], [x1, CD, zb], [x0, CD, zb]], 'f tint');
    s += poly([[x0, 4, zb], [x0, CD, zb], [x0, CD, zt], [x0, 4, zt]], 'f tint');
  }
  return s;
}

// Letters already filed: a small stack in most pigeonholes, the middle row's two targets start empty
const FILED: [number, number, number][] = [[0, 0, 2], [1, 0, 1], [3, 0, 3], [0, 1, 1], [2, 1, 2], [0, 2, 3], [1, 2, 1], [2, 2, 2], [3, 2, 1]];
const filed = () => FILED.map(([c, r, n]) => {
  let s = '';
  for (let i = 0; i < n; i++) s += letter(CX(c) + 3.5 - i * .6, 12 + i * 1.4, () => CH - ROWS[r] - CUH + i * LT);
  return s;
}).join('');

const frame = () => {
  const holes = Array.from({ length: COLS * 3 }, (_, i) => { const x = CX(i % COLS), y = ROWS[Math.floor(i / COLS)]; return `M${x} ${y}h${CUW}v${CUH}h${-CUW}Z`; }).join('');
  const tags = Array.from({ length: COLS * 3 }, (_, i) => `<rect class="f tint" x="${CX(i % COLS) + CUW / 2 - 7}" y="${ROWS[Math.floor(i / COLS)] + CUH + 3}" width="14" height="5" rx=".5"/>`).join('');
  return on(FRONT(0, CD, CH), `<path class="f paper" fill-rule="evenodd" d="M0 0H${CW}V${CH}H0Z${holes}"/>` + tags);
};

const plinth = () => box(-4, -4, 0, CW + 8, CD + 8, 6, 'paper', 'body', 'blk');
function cabinet() {
  let s = poly([[CW, 0, 6], [CW, CD, 6], [CW, CD, CH], [CW, 0, CH]], 'f body') + poly([[0, 0, CH], [CW, 0, CH], [CW, CD, CH], [0, CD, CH]], 'f paper');
  s += box(-3, -3, CH, CW + 6, CD + 6, 5, 'paper', 'body', 'tint');
  return s;
}

// The ledge the shuttle runs on: rail grooves, two brackets, a leg at the free end
const ledge = () =>
  box(LX0 + 4, LY + LD - 10, 0, 6, 6, SILL - 6, 'paper', 'body') +
  [30, 120].map((x) => poly([[x, CD, SILL - 6], [x, CD, SILL - 30], [x, CD + 18, SILL - 6]], 'f body')).join('') +
  box(LX0, LY, SILL - 6, CW - LX0, LD, 6, 'paper', 'body', 'tint') +
  line([[LX0, LY + 6, SILL], [CW, LY + 6, SILL]], 'det') + line([[LX0, LY + LD - 6, SILL], [CW, LY + LD - 6, SILL]], 'det');

// Shuttle: a tray on the rails with a pusher at the front edge; push 0…1 drives the pusher into the pigeonhole
const shuttle = (x: number, push: number) => {
  const py = lerp(LY + LD - 4, CD - 10, push);
  return box(x, LY + 3, SILL, TRAY, LD - 6, 3, 'paper', 'body', 'tint') +
    cylX(x + 6, x + TRAY - 6, LY + LD - 2, SILL + 6, 1.4, 'paper', 'body') +
    box(x + 4, py, ZT, TRAY - 8, 2.5, 9, 'paper', 'body', 'tint');
};

// Chute: a sloped trough with low walls on a post; the last FLAP units hinge down at their upper end
function chute(open: number) {
  const y0 = LY + 2, y1 = LY + LD - 2, xh = XB - FLAP, W = 6;
  const wall = (y: number, x0: number, x1: number) => poly([[x0, y, zc(x0)], [x1, y, zc(x1)], [x1, y, zc(x1) + W], [x0, y, zc(x0) + W]], 'f body');
  let s = box(XA + 6, y0 + 6, 0, 6, 6, zc(XA + 9), 'paper', 'body') + box(XA + 2, y0 + 2, 0, 14, 14, 3, 'paper', 'body', 'blk');
  s += wall(y0, XA, xh) + poly([[XA, y0, zc(XA)], [xh, y0, zc(xh)], [xh, y1, zc(xh)], [XA, y1, zc(XA)]], 'f tint');
  // flap, turned down by open about the hinge line at xh
  const a = open * 1.1, L = Math.hypot(FLAP, zc(xh) - zc(XB)), a0 = Math.atan2(zc(XB) - zc(xh), FLAP) - a;
  const fx = xh + L * Math.cos(a0), fz = zc(xh) + L * Math.sin(a0);
  s += poly([[xh, y0, zc(xh)], [fx, y0, fz], [fx, y1, fz], [xh, y1, zc(xh)]], 'f paper') + cylY2(xh, y0, y1, zc(xh));
  return { back: s, front: wall(y1, XA, xh) + poly([[XA, y1, zc(XA)], [xh, y1, zc(xh)], [xh, y1, zc(xh) - 3], [XA, y1, zc(XA) - 3]], 'f blk') };
}
const cylY2 = (x: number, y0: number, y1: number, z: number) => line([[x, y0 - 1, z], [x, y1 + 1, z]], 'f');

const bin = (inner: string) => {
  const [x0, x1, y0, y1] = BIN;
  let s = poly([[x0, y0, 2], [x1, y0, 2], [x1, y1, 2], [x0, y1, 2]], 'f tint') + box(x0, y0, 0, x1 - x0, 3, BH) + box(x0, y0, 0, 3, y1 - y0, BH);
  s += box(x0 + 6, y0 + 6, 2, LW, LDp, LT, 'paper', 'body') + box(x0 + 9, y0 + 8, 2 + LT, LW, LDp, LT, 'paper', 'body');
  s += inner;
  s += box(x0, y1 - 3, 0, x1 - x0, 3, BH, 'paper', 'body', 'tint') + box(x1 - 3, y0, 0, 3, y1 - y0, BH);
  return s + on(FRONT(x0, y1, BH), `<rect class="f paper" x="${(x1 - x0) / 2 - 9}" y="8" width="18" height="7" rx=".5"/>`);
};

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const j = Math.floor(t / STEP), u = t - j * STEP, col = TARGET[j], owned = col < 0;
  // Letter down the chute: the slide is along the trough floor, the last bit lands it on the tray
  const slide = k(u, 0, .7), lx = lerp(XA + 4, HOME + 3, slide);
  const open = owned ? k(u, .55, .85) - k(u, 1.5, 2) : 0;
  const tx = col >= 0 ? CX(col) + (CUW - TRAY) / 2 : HOME, carry = k(u, .75, 1.35), back = k(u, 1.85, 2.4);
  const sx = col >= 0 ? lerp(lerp(HOME, tx, carry), HOME, back) : HOME, push = col >= 0 ? k(u, 1.3, 1.65) - k(u, 1.7, 2) : 0;
  // A delivered letter stays in its pigeonhole for the rest of the loop and is taken out at the end (fade)
  const out = 1 - k(t, PERIOD - .6, PERIOD);
  let inside = '', front = '';
  TARGET.forEach((c, i) => {
    if (c < 0 || i > j || (i === j && u < 1.6)) return;
    const s = letter(CX(c) + 3.5, 12, () => SILL);
    inside += `<g style="opacity:${f(out)}">${s}${lit(s, i === j ? 1 - k(u, 1.9, 2.4) : 0)}</g>`;
  });
  // The moving letter
  let moving = '', fall = '';
  const XS = XB - FLAP - 6;                                              // an owned letter stops on the flap
  if (owned) {
    const v = k(u, .7, 1.2), x = lerp(lerp(XA + 4, XS, k(u, 0, .6)), BIN[0] + 8, v), z = lerp(zc(XS), 2 + 2 * LT, v * v);
    if (u < .7) moving = letter(lerp(XA + 4, XS, k(u, 0, .6)), LY + 4, zc, true);
    else if (u < 1.9) fall = `<g style="opacity:${f(1 - k(u, 1.5, 1.9))}">${letter(x, LY + 4, () => z, true)}</g>`;
  } else if (u >= .7 && u < 1.3) {
    moving = letter(sx + 3, LY + 4, () => ZT);
  } else if (u >= 1.3 && u < 1.6) {
    moving = letter(sx + 3, lerp(LY + 4, 12, k(u, 1.3, 1.6)), () => ZT - (u > 1.5 ? 3 : 0));
  } else if (u < .7) {
    moving = letter(lx, LY + 4, u < .62 ? zc : () => ZT);
  }
  const ch = chute(open);
  return hue('a',
    bin(fall) + plinth() + cubbies() + filed() + inside + cabinet() + frame() + ledge() + shuttle(sx, push) + ch.back +
    (owned ? moving : moving + lit(moving, 1)) + ch.front) +
    arrow(curve([XA - 6, LY + LD / 2, ZA + 30], [XA + 20, LY + LD / 2, ZA + 34], [XA + 40, LY + LD / 2, zc(XA + 40) + 18]), { dot: true });
}

export const sorter: Piece = {
  aria: 'A post sorting wall. Letters slide down a chute onto a shuttle; one with a stamp drops through a flap into a bin, the others are carried to their pigeonhole and pushed in.',
  period: PERIOD, rest: 1.1, viewBox: K.viewBox, focus: [0.55, 0.5], draw,
};
