// Scenario "Warm-lead handoff": a post sorting wall. Letters slide down a chute onto a shuttle. A letter that already
// has an owner in the CRM (the black stamp) drops through a flap into the reject bin; the others ride the shuttle to
// their owner's pigeonhole and are pushed in. The hand-off is the letter landing in the right box.
import { kernel, hue, k, keys, spring, lerp, f, IN, OUT, EASY, type Ease, type Piece, type V3 } from './iso';

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
const BH = 22;
const zc = (x: number) => ZA + (ZB - ZA) * (x - XA) / (XB - XA);         // chute floor height at x
const TARGET = [1, -1, 3];                                               // per step: column the letter goes to (-1 = owned, rejected)

const K = kernel([[XA - 44, CD + 2, 0], [XA - 44, CD + LD, ZA + 80], [CW + 4, 0, 0], [CW + 4, CD + LD, 0], [0, -4, CH + 8], [CW, -4, CH + 8], [BIN[0], BIN[3], 0], [CW, CD + LD, SILL]], 24);
const { on, poly, line, box, cyl, cylX, FRONT, TOP } = K;

const lit = (s: string, a: number) => (a > .01 ? `<g class="lit" style="opacity:${f(Math.min(1, a))}">${s}</g>` : '');

// A letter lying flat with its long side along x; z(x) gives the floor under it (a slope on the chute), tilt drops the front.
// The stamp sits at the rear, so it is still under the magazine when a stamped letter starts to come out.
function letter(x: number, y: number, z: (x: number) => number, stamp = false, w = LW, lt = LT) {
  if (lt < .05) return '';
  const x1 = x + w, y1 = y + LDp, a: V3 = [x, y, z(x) + lt], b: V3 = [x1, y, z(x1) + lt], c: V3 = [x1, y1, z(x1) + lt], d: V3 = [x, y1, z(x) + lt];
  const dn = (p: V3): V3 => [p[0], p[1], p[2] - lt];
  const m = (u: number, v: number): V3 => { const xx = lerp(x, x1, u); return [xx, lerp(y, y1, v), z(xx) + lt]; };
  let g = poly([b, c, dn(c), dn(b)], 'f body') + poly([d, c, dn(c), dn(d)], 'f body') + poly([a, b, c, d], 'f paper');
  g += line([a, m(.5, .55), b], 'det');
  g += poly([m(.12, .62), m(.26, .62), m(.26, .86), m(.12, .86)], stamp ? 'f blk' : 'f tint');
  return g;
}
// A rigid letter by its centre: bottom centre at (cx, cz), pitched by p (radians, front down)
const plank = (cx: number, y: number, cz: number, p: number, stamp = false, lt = LT) => {
  const w = LW * Math.cos(p), tp = Math.tan(p);
  return letter(cx - w / 2, y, (xx) => cz - (xx - cx) * tp, stamp, w, lt);
};
// The floor a letter rides on: the magazine platform, the chute slope, the shuttle tray, with rounded kinks so a
// letter tips over each edge instead of snapping to the new angle
const SLOPE = -(ZA - ZT) / (XB - XA), RK = 9;
function floor(x: number): [number, number] {
  const fil = (xk: number, zk: number, m1: number, m2: number) => { const d = x - xk; return [zk + m1 * d + (m2 - m1) * (d + RK) ** 2 / (4 * RK), m1 + (m2 - m1) * (d + RK) / (2 * RK)] as [number, number]; };
  if (x < XA - RK) return [ZA, 0];
  if (x < XA + RK) return fil(XA, ZA, 0, SLOPE);
  if (x < XB - RK) return [ZA + SLOPE * (x - XA), SLOPE];
  if (x < XB + RK) return fil(XB, ZT, SLOPE, 0);
  return [ZT, 0];
}
const onFloor = (cx: number, stamp = false) => { const [z, m] = floor(cx); return plank(cx, LY + 4, z, -Math.atan(m), stamp); };

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

const FILED: [number, number, number][] = [[0, 0, 2], [1, 0, 1], [3, 0, 3], [0, 1, 1], [2, 1, 2], [0, 2, 3], [1, 2, 1], [2, 2, 2], [3, 2, 1]];
// Letters already filed: a small stack in most pigeonholes; the middle row's two targets hold one letter that the new one lands on
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
  s += poly([[xh, y1, zc(xh)], [fx, y1, fz], [fx, y1, fz - 1.5], [xh, y1, zc(xh) - 1.5]], 'f body') + poly([[fx, y0, fz], [fx, y1, fz], [fx, y1, fz - 1.5], [fx, y0, fz - 1.5]], 'f body') +
    poly([[xh, y0, zc(xh)], [fx, y0, fz], [fx, y1, fz], [xh, y1, zc(xh)]], 'f paper') + cylY2(xh, y0, y1, zc(xh));
  return { back: s, front: wall(y1, XA, xh) + poly([[XA, y1, zc(XA)], [xh, y1, zc(xh)], [xh, y1, zc(xh) - 3], [XA, y1, zc(XA) - 3]], 'f blk') };
}
const cylY2 = (x: number, y0: number, y1: number, z: number) => line([[x, y0 - 1, z], [x, y1 + 1, z]], 'f');

const bin = (inner: string) => {
  const [x0, x1, y0, y1] = BIN;
  let s = poly([[x0, y0, 2], [x1, y0, 2], [x1, y1, 2], [x0, y1, 2]], 'f tint') + box(x0, y0, 0, x1 - x0, 3, BH) + box(x0, y0, 0, 3, y1 - y0, BH);
  s += inner;
  s += box(x0, y1 - 3, 0, x1 - x0, 3, BH, 'paper', 'body', 'tint') + box(x1 - 3, y0, 0, 3, y1 - y0, BH);
  return s + on(FRONT(x0, y1, BH), `<rect class="f paper" x="${(x1 - x0) / 2 - 9}" y="8" width="18" height="7" rx=".5"/>`);
};

// A stack that takes one more letter each loop and settles back by the end: the new letter lands on top, then the
// bottom one thins out as the stack sinks by one letter, so the loop closes without anything popping
function stack(x: number, y: number, z: number, n: number, settle: number, stamp: boolean) {
  let g = '';
  for (let i = 0; i < n; i++) g += letter(x, y, () => z + Math.max(0, i - settle) * LT, stamp, LW, i === 0 ? LT * (1 - settle) : LT);
  return g;
}

const MX0 = XA - 36, MW = 32;                                            // magazine on its platform at the chute's top
const PUSH: Ease = [.4, 0, .2, 1], SLIDE: Ease = [.42, 0, .3, 1];
const CX0 = XA - 20;                                                     // a waiting letter's centre under the magazine

// The shuttle and the letter it pushes are drawn twice: before the cabinet's front, so the part inside a pigeonhole
// shows only through its opening, and again clipped to the space in front of that face (y > CD, at ledge height)
const FRONT_CLIP = `<clipPath id="so-front"><path d="M${[[-400, CD, ZT + 14], [CW + 400, CD, ZT + 14], [CW + 400, CD, SILL - 2], [CW + 400, CD + 300, SILL - 2], [-400, CD + 300, SILL - 2], [-400, CD + 300, ZT + 14]]
  .map(([x, y, z]) => K.P(x, y, z).map(f).join(' ')).join('L')}Z"/></clipPath>`;

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const j = Math.floor(t / STEP), u = t - j * STEP, col = TARGET[j], owned = col < 0;
  const settle = k(t, PERIOD - .55, PERIOD - .05);
  // Feed: the pusher shoves the bottom letter out of the magazine, it slides down the chute and comes to rest
  const cxEnd = owned ? XB - FLAP + 10 : HOME + 3 + LW / 2;
  const cx = keys(u, [[0, CX0, PUSH], [.28, XA - 4, SLIDE], [owned ? .62 : .78, cxEnd]]);
  const pusher = keys(u, [[0, 0, PUSH], [.28, 16, EASY], [.7, 0]]);
  const open = owned ? keys(u, [[.66, 0, [.5, 0, .7, 1]], [.9, 1, EASY], [1.6, 1, EASY], [2.1, 0]]) : 0;
  const tx = col >= 0 ? CX(col) + (CUW - TRAY) / 2 : HOME, carry = k(u, .8, 1.35), back = k(u, 1.85, 2.4);
  const sx = col >= 0 ? lerp(lerp(HOME, tx, carry), HOME, back) : HOME, push = col >= 0 ? k(u, 1.3, 1.62) - k(u, 1.7, 2) : 0;
  // Delivered letters stay on their pigeonhole's stack to the end of the loop
  let inside = '';
  TARGET.forEach((c, i) => {
    if (c < 0) return;
    const landed = i < j || (i === j && u >= 1.62);
    const g = stack(CX(c) + 3.5, 12, SILL, landed ? 2 : 1, landed ? settle : 0, false);
    inside += landed && i === j ? g + lit(letter(CX(c) + 3.5, 12, () => SILL + LT), 1 - k(u, 1.9, 2.4)) : g;
  });
  // The moving letter
  let moving = '', fall = '', drop = '';                                 // drop: above the bin's rim, drawn over the chute
  const xh = XB - FLAP, rideP = (o: number) => -Math.atan(SLOPE) + o * 1.1;
  const rideAt = (o: number): [number, number, number] => { const p = rideP(o), r = cxEnd - xh; return [xh + r * Math.cos(p), zc(xh) - r * Math.sin(p), p]; };
  if (owned && u >= .66) {
    // Rides the flap as it drops, slides off and falls flat onto the reject pile
    const T0 = .76, [x0, z0, p0] = rideAt(open);
    if (u < T0) drop = plank(x0, LY + 4, z0, p0, true);
    else {
      const [x1, z1, p1] = rideAt(keys(T0, [[.66, 0, [.5, 0, .7, 1]], [.9, 1]])), v = keys(u, [[T0, 0, IN], [1.06, 1]]);
      const top = 2 + 2 * LT, p = keys(u, [[T0, p1, OUT], [1.06, .12, EASY], [1.22, 0]]);
      const z = lerp(z1, top, v), g = plank(lerp(x1, BIN[0] + 6 + LW / 2, keys(u, [[T0, 0, EASY], [1.06, 1]])), LY + 4, z, p, true);
      if (u < 1.22) { if (z > BH + 4) drop = g; else fall = g; }
    }
  } else if (u < (owned ? .66 : .8)) {
    moving = onFloor(cx, owned);
  }
  let near = '';                                                         // on the shuttle, then pushed into the pigeonhole
  if (!owned && u >= .8 && u < 1.3) near = letter(sx + 3, LY + 4, () => ZT);
  else if (!owned && u >= 1.3 && u < 1.62) near = letter(sx + 3, lerp(LY + 4, 12, k(u, 1.3, 1.6)), () => ZT - (ZT - SILL - LT) * k(u, 1.3, 1.45));
  near = shuttle(sx, push) + (near ? near + lit(near, 1) : '');
  // Reject pile: two stamped letters, a third once this loop's stamped letter has landed (it is the fall until then)
  const pileN = j > 1 || (j === 1 && u >= 1.22) ? 3 : 2;
  const pile = stack(BIN[0] + 6, LY + 4, 2, pileN, pileN === 3 ? settle : 0, true);
  const ch = chute(open);
  // Magazine: platform, the waiting letter (always there: the stack drops one down as one leaves), walls, pusher
  const mag = box(MX0 - 4, LY + 1, ZA - 5, MW + 8, LD - 2, 5, 'paper', 'body', 'tint') + onFloor(CX0) +
    box(MX0 - 3 + pusher, LY + 6, ZA, 3, LD - 12, 6, 'paper', 'body') + box(MX0 + 2, LY + 2, ZA + LT + 1.4, MW - 4, LD - 4, 40, 'tint', 'body', 'paper') +
    on(TOP(MX0 + 2, LY + 2, ZA + LT + 41.4), `<rect class="f paper" x="3" y="2" width="${MW - 10}" height="${LD - 8}" rx=".5"/>`) +
    on(FRONT(MX0 + 2, LY + LD - 2, ZA + LT + 41.4), `<rect class="det" x="6" y="8" width="${MW - 16}" height="22" rx=".8"/>`);
  return FRONT_CLIP + hue('a',
    bin(pile + fall) + plinth() + cubbies() + filed() + inside + near + cabinet() + frame() + ledge() + `<g clip-path="url(#so-front)">${near}</g>` + ch.back +
    (owned ? moving : moving + lit(moving, 1)) + ch.front + drop + mag);
}

export const sorter: Piece = {
  aria: 'A post sorting wall. Letters slide down a chute onto a shuttle; one with a stamp drops through a flap into a bin, the others are carried to their pigeonhole and pushed in.',
  period: PERIOD, rest: 1.1, viewBox: K.viewBox, focus: [0.55, 0.5], draw,
};
