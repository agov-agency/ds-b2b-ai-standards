// Alternative rule icons, batch 2 (rules 09–15): two new objects per rule, in the style of icons-rules.ts.
import { kernel, f, type V3 } from '../iso';
import { prism, dot, screws, lit, plate, rope, icon, planeAt, bar, type K, type P2 } from '../icons';
import type { Alt } from './index';

const hex = (cx: number, cy: number, r: number, a0 = Math.PI / 6): P2[] => Array.from({ length: 6 }, (_, i) => [cx + Math.cos(a0 + i * Math.PI / 3) * r, cy + Math.sin(a0 + i * Math.PI / 3) * r]);
const d2 = (ps: P2[]) => 'M' + ps.map((p) => p.map(f).join(' ')).join('L') + 'Z';

// ── Urn: count an audience as warm only once it can serve. A tea urn whose level stands above its tap, a cup under the
// tap; the pour is live.
const UR = kernel([[0, 0, 0], [62, 0, 0], [0, 44, 0], [62, 44, 0], [28, 18, 58]], 12);
const urn = icon(UR, 'A tea urn with a level window, the level above its tap; a cup under the tap is being filled.', () => {
  const K = UR, X = 28, Y = 18, R = 12, TZ = 18, CY = Y + R + 4.5;
  let s = plate(K, 0, 0, 62, 44);
  // Back handle, body with its bands, lid and knob, the near handle
  const handle = (sg: number) => rope(K, [[X + sg * (R - .5), Y, 42], [X + sg * (R + 3.6), Y, 41], [X + sg * (R + 3.6), Y, 33], [X + sg * (R - .5), Y, 32]], 1.8, 'f paper');
  s += handle(-1) + K.cyl(X, Y, 4, 9, 3, 'paper', 'body') + K.cyl(X, Y, 7, R, 42, 'paper', 'tint');
  for (const z of [11, 45]) s += K.line(K.ring(X, Y, z, R, -Math.PI / 4, Math.PI * 3 / 4, 30), 'det');
  s += K.cyl(X, Y, 49, R + 1, 2.4, 'paper', 'body') + K.cyl(X, Y, 51.4, R - 3, 2, 'paper', 'tint') + K.cyl(X, Y, 53.4, 2.2, 3, 'paper', 'body') + handle(1);
  // Level window on the right of the front: the level well above the mark at tap height
  const a = .2, win = planeAt(K, [X + R * Math.cos(a), Y + R * Math.sin(a), 43], [Math.sin(a), -Math.cos(a), 0], [0, 0, -1]);
  s += K.on(win, `<rect class="f paper" x="-2.2" y="0" width="4.4" height="31" rx=".6"/><rect class="f tint" x="-2.2" y="8" width="4.4" height="23" rx=".6"/><line class="det" x1="-3.6" y1="${43 - TZ}" x2="3.6" y2="${43 - TZ}"/>`);
  // Tap: nozzle, spout, lever; the cup below it
  s += K.cyl(X, CY, TZ - 5, 1.3, 4, 'paper', 'body') + K.cylY(Y + R - 1, CY + .6, X, TZ, 1.8, 'paper', 'body') + K.box(X - 1, CY - 2, TZ + 1.6, 2, 2, 3.4, 'paper', 'body') + K.box(X - 3, CY - 2.4, TZ + 5, 6, 2.8, 1.2, 'paper', 'body');
  s += rope(K, [[X + 3.6, CY, 9], [X + 6, CY, 8.4], [X + 6, CY, 6], [X + 3.6, CY, 5.4]], 1.4, 'f paper') + K.cyl(X, CY, 4, 4.2, 6, 'paper', 'body');
  return s + lit(K.on(K.TOP(X, CY, 10), '<circle class="f tint" r="3.3"/>') + rope(K, [[X, CY, TZ - 5], [X, CY, 10]], 1));
});

// ── Crates and flag: the same rule. Crates stacked beside a marker post; the top crate has reached the flag (live).
const CF = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [34, 22, 46], [15, 31, 56]], 12);
const crates = icon(CF, 'Three crates stacked beside a marker post; the top crate is level with the flag on the post.', () => {
  const K = CF, CX = 27, CY = 12, W = 20, H = 12, TOP = 4 + 3 * H, PX = 14, PY = 30;
  let s = plate(K, 0, 0, 60, 44);
  const crate = (z: number) => K.box(CX, CY, z, W, W, H - 1.4, 'paper', 'body', 'tint') + K.box(CX - .6, CY - .6, z + H - 1.4, W + 1.2, W + 1.2, 1.4, 'paper', 'body', 'tint') +
    K.on(K.FRONT(CX, CY + W, z + H - 1.4), `<path class="det" d="M0 ${(H - 1.4) / 2}H${W}M2.4 0V${H - 1.4}M${W - 2.4} 0V${H - 1.4}"/>`) + K.on(K.SIDE(CX + W, CY + W, z + H - 1.4), `<path class="det" d="M0 ${(H - 1.4) / 2}H${W}M2.4 0V${H - 1.4}M${W - 2.4} 0V${H - 1.4}"/>`);
  s += crate(4) + crate(4 + H) + lit(crate(4 + 2 * H) + K.on(K.TOP(CX - .6, CY - .6, TOP), `<rect class="det" x="2.4" y="2.4" width="${W - 3.6}" height="${W - 3.6}"/>`));
  // Marker post in front of the stack: foot, post with a scale, the flag at the stack's height
  s += K.box(PX - 3, PY - 3, 4, 9, 9, 2.4, 'paper', 'body', 'tint') + K.box(PX, PY, 6.4, 3, 3, 46, 'paper', 'body', 'tint') + K.box(PX - .6, PY - .6, 52.4, 4.2, 4.2, 1.6, 'paper', 'body');
  s += K.on(K.FRONT(PX, PY + 3, 52.4), Array.from({ length: 15 }, (_, i) => `<line class="det" x1="0" y1="${3 + i * 3}" x2="${i % 4 ? 1.2 : 2.2}" y2="${3 + i * 3}"/>`).join(''));
  s += K.on(planeAt(K, [PX + 3, PY + 1.5, TOP + 7], [1, 0, 0], [0, 0, -1]), '<path class="f paper" d="M0 0L9 3.5L0 7Z"/><line class="det" x1="0" y1="7" x2="9" y2="7"/>');
  return s;
});

// ── Grill: spend on warm audiences before cold. A grill with the coals heaped under one half; the skewer sits over the
// hot half, the cool half waits. The coals are live.
const GR = kernel([[0, 0, 0], [74, 0, 0], [0, 40, 0], [74, 40, 0], [12, 10, 44], [62, 10, 44]], 12);
const grill = icon(GR, 'A charcoal grill on legs, coals heaped under one half of the grate and a skewer over them.', () => {
  const K = GR, X = 12, Y = 9, W = 50, D = 22, Z = 26, H = 10, T = 1.6, ZT = Z + H;
  let s = plate(K, 0, 0, 74, 40);
  const leg = (x: number, y: number) => K.box(x, y, 4, 2.6, 2.6, Z - 4, 'paper', 'body', 'tint');
  s += leg(X + 2, Y + 2) + leg(X + W - 4.6, Y + 2) + K.box(X + 2, Y + 2, 11, W - 4, D - 4, 1.4, 'paper', 'body', 'tint') + leg(X + 2, Y + D - 4.6) + leg(X + W - 4.6, Y + D - 4.6);
  // Inside the firebox: floor, far walls, the coals on the left half
  s += K.poly([[X, Y, Z], [X + W, Y, Z], [X + W, Y + D, Z], [X, Y + D, Z]], 'f tint');
  s += K.poly([[X, Y + T, Z], [X + W, Y + T, Z], [X + W, Y + T, ZT], [X, Y + T, ZT]], 'f body') + K.poly([[X + T, Y, Z], [X + T, Y + D, Z], [X + T, Y + D, ZT], [X + T, Y, ZT]], 'f body');
  const coals: [number, number, number][] = [];
  for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) coals.push([X + 4 + i * 3.4 + (j % 2) * 1.6, Y + 4 + j * 4, i > 0 && i < 5 && j > 0 && j < 3 ? 2.6 : 0]);
  s += lit(coals.map(([x, y, z]) => K.box(x, y, Z + z, 2.8, 2.8, 2.2, 'body', 'body', 'body')).join(''));
  // Near walls with vents, the rim, the grate bars, the skewer over the hot half, side handles
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="f paper" width="${W}" height="${H}"/>` + [10, 20, 30, 40].map((x) => `<rect class="f blk" x="${x - 3}" y="${H / 2 - .6}" width="6" height="1.2" rx=".4"/>`).join(''));
  s += K.poly([[X + W, Y, Z], [X + W, Y + D, Z], [X + W, Y + D, ZT], [X + W, Y, ZT]], 'f body');
  s += K.on(K.TOP(X, Y, ZT), `<path class="f paper" fill-rule="evenodd" d="M0 0H${W}V${D}H0ZM${T} ${T}H${W - T}V${D - T}H${T}Z"/>` + Array.from({ length: 11 }, (_, i) => `<line class="det" x1="${4 + i * 4.2}" y1="${T}" x2="${4 + i * 4.2}" y2="${D - T}"/>`).join(''));
  s += K.cylX(X - 6, X + W / 2 + 2, Y + D / 2, ZT + 3, .7) + [5, 11, 17].map((x) => K.box(X + x, Y + D / 2 - 2, ZT + 1, 4, 4, 4, 'paper', 'body', 'tint')).join('') + K.box(X - 9, Y + D / 2 - 1.4, ZT + 1.6, 3, 2.8, 2.8, 'paper', 'body');
  s += K.box(X + W, Y + D / 2 - 3, ZT - 4, 4, 6, 1.6, 'paper', 'body');
  return s;
});

// ── Cylinders on a changeover: the same rule. Two gas cylinders on one regulator; its lever points to the first
// (live), the second is opened only once the first runs empty.
const GC = kernel([[0, 0, 0], [64, 0, 0], [0, 40, 0], [64, 40, 0], [32, 8, 62]], 12);
const cylinders = icon(GC, 'Two gas cylinders strapped to a wall panel, both piped to one changeover regulator whose lever points to the first.', () => {
  const K = GC, Y = 22, XS = [19, 45], R = 9;
  let s = plate(K, 0, 0, 64, 40) + K.box(5, 6, 4, 54, 4, 52, 'paper', 'body', 'tint') + K.on(K.FRONT(5, 10, 56), screws([[4, 4], [50, 4], [4, 48], [50, 48]]));
  // Regulator block on the panel, between the two valves
  s += K.box(26, 10, 40, 12, 7, 14, 'paper', 'body', 'tint') + K.cylY(17, 18.4, 32, 47, 4.6, 'paper', 'body') + K.cyl(32, 13.5, 54, 2, 2.4, 'paper', 'body');
  XS.forEach((x, i) => {
    s += K.cyl(x, Y, 4, R, 36, 'paper', 'tint') + K.line(K.ring(x, Y, 12, R, -Math.PI / 4, Math.PI * 3 / 4, 30), 'det') + K.line(K.ring(x, Y, 32, R + .2, -Math.PI / 4, Math.PI * 3 / 4, 30), 'f nofill');
    s += K.cyl(x, Y, 40, 6, 2.4, 'paper', 'body') + K.cyl(x, Y, 42.4, 2.4, 4, 'paper', 'body') + K.cyl(x, Y, 46.4, 4.2, 1.4, 'paper', 'body');
    const sg = i ? -1 : 1;
    s += rope(K, [[x, Y, 47.8], [x, Y, 51], [x + sg * 4, Y - 2, 53], [32 - sg * 9, 16, 46], [32 - sg * 6, 14, 44]], 1.4, 'f paper');
  });
  // The lever on the regulator's dial, pointing at the first cylinder
  s += K.on(K.FRONT(32, 18.5, 47), [0, 1, 2, 3, 4].map((i) => { const a = Math.PI * (1.1 + i * .2); return `<line class="det" x1="${f(Math.cos(a) * 3)}" y1="${f(Math.sin(a) * 3)}" x2="${f(Math.cos(a) * 4)}" y2="${f(Math.sin(a) * 4)}"/>`; }).join('')) +
    lit(K.on(K.FRONT(32, 18.6, 47), `<path class="f body" d="${d2(bar(0, 0, Math.PI * 1.12, -1.2, 7, 2.2))}"/><circle class="f paper" r="1.2"/>`));
  return s;
});

// ── Adjustable spanner: start Lead Gen Forms early, then narrow them. A spanner lying open early, its jaw wound in
// to the nut; the moving jaw and its worm are live.
const SP = kernel([[0, 0, 0], [76, 0, 0], [0, 38, 0], [76, 38, 0], [18, 6, 14]], 12);
const spanner = icon(SP, 'An adjustable spanner lying on a plate, its moving jaw wound in against a hex nut.', () => {
  const K = SP, Z = 4, NX = 18, NY = 9;
  let s = plate(K, 0, 0, 76, 38);
  s += prism(K, [[5, 2], [14, 2], [14, 16], [5, 16]], Z, 5, 'paper', 'body');
  s += lit(prism(K, [[22, 4], [29, 4], [29, 16], [22, 16]], Z, 5, 'paper', 'body'));
  s += prism(K, hex(NX, NY, 4.6, 0), Z, 5.6, 'paper', 'tint') + K.on(K.TOP(NX, NY, Z + 5.6), '<circle class="det" r="2"/>');
  s += prism(K, [[30, 19.5], [66, 19.5], [66, 28.5], [30, 28.5]], Z, 4, 'paper', 'body', 'tint') + K.cyl(66, 24, Z, 4.5, 4, 'paper', 'body');
  s += K.on(K.TOP(0, 0, Z + 4), `<path class="f tint" d="M36 22.4H58V25.6H36Z"/><ellipse class="f blk" cx="65" cy="24" rx="2" ry="1.4"/>`);
  s += prism(K, [[5, 16], [32, 16], [32, 32], [5, 32]], Z, 5, 'paper', 'body', 'tint') + K.on(K.TOP(5, 16, Z + 5), '<rect class="f blk" x="14.6" y="2.4" width="9" height="10" rx=".4"/><line class="det" x1="2" y1="13" x2="10" y2="13"/>' + screws([[5, 6]]));
  s += lit(K.cylY(18.6, 28.2, 24.1, Z + 5, 2.6, 'paper', 'body') + [20.6, 22.6, 24.6, 26.6].map((y) => K.line([[22.2, y, Z + 7.4], [26, y, Z + 7.4]], 'det')).join(''));
  return s;
});

// ── Hose nozzle: the same rule. The water is on from the start, the nozzle's collar twisted down to a narrow jet;
// the collar is live.
const HN = kernel([[0, 0, 0], [78, 0, 0], [0, 40, 0], [78, 40, 0], [40, 22, 16]], 12);
const nozzle = icon(HN, 'A garden hose ending in a twist nozzle, its collar turned down so a single narrow jet comes out.', () => {
  const K = HN, Y = 20, Z = 9.2;
  let s = plate(K, 0, 0, 78, 40);
  s += rope(K, [...K.curve([4, 34, 6], [4, Y, 6], [12, Y, 8], 12), [15, Y, Z]], 4.6, 'f body');
  const ribs = (x0: number, x1: number, n: number, r: number) => Array.from({ length: n }, (_, i) => {
    const x = x0 + (i + .5) * (x1 - x0) / n;
    return K.line(Array.from({ length: 13 }, (_, j) => { const a = -Math.PI / 4 + j * Math.PI / 12; return [x, Y + r * Math.cos(a), Z + r * Math.sin(a)] as V3; }), 'det');
  }).join('');
  s += K.cylX(13, 20, Y, Z, 2.6, 'paper', 'body') + K.cylX(20, 40, Y, Z, 4.4, 'paper', 'tint') + ribs(23, 37, 6, 4.4);
  s += lit(K.cylX(40, 47, Y, Z, 5, 'paper', 'body') + ribs(40, 47, 4, 5));
  s += K.cylX(47, 51, Y, Z, 2.4, 'paper', 'body') + K.on(K.SIDE(51, Y, Z), '<circle class="f blk" r=".7"/>');
  s += rope(K, K.curve([51.4, Y, Z], [64, Y, Z + 1], [76, Y, 4.6], 14), .9, 'f tint');
  return s;
});

// ── Sorting bins: report exposure, influence and attribution separately. Three bins whose lids take only their own
// shape: a round hole, a slot, a square. The holes are live.
const SB = kernel([[0, 0, 0], [76, 0, 0], [0, 38, 0], [76, 38, 0], [14, 19, 36]], 12);
const bins = icon(SB, 'Three bins side by side, each lid cut with a different hole: round, a slot, square.', () => {
  const K = SB, Y = 10, W = 16, D = 18, H = 26;
  let s = plate(K, 0, 0, 76, 38);
  const holes = ['<circle class="f blk" r="3.4"/>', '<rect class="f blk" x="-5.5" y="-1" width="11" height="2" rx=".4"/>', '<rect class="f blk" x="-3" y="-3" width="6" height="6" rx=".4"/>'];
  [6, 30, 54].forEach((x, i) => {
    s += K.box(x, Y, 4, W, D, H, 'paper', 'body', 'tint') + K.on(K.FRONT(x, Y + D, 4 + H), `<rect class="det" x="2.4" y="5" width="${W - 4.8}" height="${H - 9}" rx=".6"/><path class="det" d="M5 ${H - 2}H${W - 5}"/>`);
    s += K.on(K.SIDE(x + W, Y + D, 4 + H), [5, 9, 13].map((y) => `<line class="det" x1="${y}" y1="6" x2="${y}" y2="${H - 6}"/>`).join(''));
    s += K.box(x - 1, Y - 1, 4 + H, W + 2, D + 2, 2.6, 'paper', 'body', 'tint') + K.box(x + W / 2 - 3, Y + D + 1, 4 + H, 6, 1.4, 1.6, 'paper', 'body');
    s += lit(K.on(K.TOP(x + W / 2, Y + D / 2, 6.6 + H), holes[i]));
  });
  return s;
});

// ── Layered glass: the same rule. A glass holding three layers that do not mix, a spoon beside it unused; the middle
// layer is live.
const LG = kernel([[0, 0, 0], [60, 0, 0], [0, 42, 0], [60, 42, 0], [22, 20, 56]], 12);
const layered = icon(LG, 'A tall glass with three separate layers that have not mixed, a spoon lying unused beside it.', () => {
  const K = LG, X = 22, Y = 20, R = 11, Z = 6.5, L = 10, ZR = Z + 3 * L + 10;
  let s = plate(K, 0, 0, 60, 42);
  // Glass: back of the empty rim, foot, the three layers, the front of the rim
  s += K.line(K.ring(X, Y, ZR, R, Math.PI * 3 / 4, Math.PI * 7 / 4, 24), 'det');
  s += K.cyl(X, Y, 4, R - 1, 2.5, 'paper', 'body');
  s += K.cyl(X, Y, Z, R, L, 'body', 'body') + lit(K.cyl(X, Y, Z + L, R, L, 'tint', 'tint')) + K.cyl(X, Y, Z + 2 * L, R, L, 'paper', 'paper');
  const a0 = -Math.PI / 4, a1 = Math.PI * 3 / 4;
  s += K.poly([...K.ring(X, Y, Z + 3 * L, R, a0, a1, 24), ...K.ring(X, Y, ZR, R, a0, a1, 24).reverse()], 'f nofill');
  s += K.line(K.ring(X, Y, ZR - 1.4, R, a0, a1, 24), 'det');
  // The spoon, lying flat and dry
  const a = -.5;
  s += prism(K, bar(42, 34, a, 0, 14, 1.4), 4, .8, 'paper', 'body') + K.on(`${K.TOP(42, 34, 4.8)} rotate(${f(a * 180 / Math.PI)})`, '<ellipse class="f paper" cx="-2.6" cy="0" rx="3.4" ry="2.3"/><ellipse class="det" cx="-2.6" cy="0" rx="2.2" ry="1.3"/>');
  return s;
});

// ── Ticket rail: give sales a weekly ranked list. Order tickets clipped to a kitchen rail, longest first, each ticked
// off; the first ticket is live.
const TR = kernel([[0, 0, 0], [78, 0, 0], [0, 36, 0], [78, 36, 0], [4, 16, 58], [72, 16, 58]], 12);
const rail = icon(TR, 'A rail on two posts with order tickets clipped in a row, from the longest to the shortest, each with a tick.', () => {
  const K = TR, RY = 15, RZ = 50;
  let s = plate(K, 0, 0, 78, 36) + [4, 70].map((x) => K.box(x - 2, RY - 1, 4, 8, 8, 2, 'paper', 'body', 'tint') + K.box(x, RY + 1, 6, 4, 4, RZ - 6, 'paper', 'body', 'tint')).join('');
  s += K.box(1, RY, RZ, 76, 6, 4, 'paper', 'body', 'tint') + K.on(K.FRONT(1, RY + 6, RZ + 4), '<line class="det" x1="2" y1="2" x2="74" y2="2"/>');
  [32, 27, 22, 17, 12].forEach((h, i) => {
    const x = 17 + i * 10.4, n = Math.round(h / 5);
    const t = K.on(K.FRONT(x, RY + 6.2, RZ + 1), `<rect class="f paper" x="0" y="0" width="8" height="${h}" rx=".3"/><rect class="f blk" x="2.6" y="-1.6" width="2.8" height="2.4" rx=".4"/>` +
      Array.from({ length: n }, (_, j) => `<line class="det" x1="1.6" y1="${4.6 + j * 4}" x2="${j % 2 ? 5 : 6.4}" y2="${4.6 + j * 4}"/>`).join('') + `<path class="det" d="M2.4 ${h - 3}l1.3 1.3l2.6 -2.8"/>`);
    s += i === 0 ? lit(t.replace('f paper', 'f body')) : t;
  });
  return s;
});

// ── Bookends: the same rule. A row of books between two bookends, stood tallest to shortest; the tallest is live.
const BK = kernel([[0, 0, 0], [76, 0, 0], [0, 34, 0], [76, 34, 0], [10, 10, 48]], 12);
const books = icon(BK, 'A row of books between two bookends, set from the tallest to the shortest.', () => {
  const K = BK, Y = 9, D = 16;
  let s = plate(K, 0, 0, 76, 34);
  const end = (x: number, sg: number) => K.box(sg > 0 ? x : x - 8, Y, 4, 10, D, 1.4, 'paper', 'body', 'tint') + K.box(x, Y, 5.4, 2, D, 24, 'paper', 'body', 'tint');
  s += end(6, 1);
  let x = 8.2;
  [[7, 40], [6, 36], [7.4, 32], [5.6, 28], [6.4, 24], [5, 21]].forEach(([w, h], i) => {
    const b = K.box(x, Y + (i % 2) * .8, 5.4, w, D - (i % 2) * 1.6, h, 'paper', 'body', 'tint') + K.on(K.FRONT(x, Y + D - (i % 2) * .8, 5.4 + h), `<path class="det" d="M0 3H${w}M0 5H${w}M0 ${h - 3}H${w}"/><rect class="f paper" x="1.2" y="9" width="${w - 2.4}" height="5" rx=".3"/>`);
    s += i === 0 ? lit(b) : b;
    x += w + .2;
  });
  return s + end(x, -1);
});

// ── Seedling tray: grow a signal list from the same market. A tray of identical seedlings from one packet; the
// newest sprout in the last cell is live.
const SD = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [10, 8, 30]], 12);
const seedlings = icon(SD, 'A seed tray of eight cells, each with the same two-leaf sprout; the last one has only just come up.', () => {
  const K = SD, X = 8, Y = 8, CW = 14, CD = 12, H = 8, ZT = 4 + H;
  let s = plate(K, 0, 0, 72, 40) + K.box(X, Y, 4, 4 * CW, 2 * CD, H, 'paper', 'body', 'tint');
  s += K.on(K.TOP(X, Y, ZT), Array.from({ length: 8 }, (_, i) => `<rect class="f tint" x="${(i % 4) * CW + 1.4}" y="${Math.floor(i / 4) * CD + 1.4}" width="${CW - 2.8}" height="${CD - 2.8}" rx=".6"/>`).join(''));
  s += K.on(K.FRONT(X, Y + 2 * CD, ZT), [1, 2, 3].map((i) => `<line class="det" x1="${i * CW}" y1="1.6" x2="${i * CW}" y2="${H}"/>`).join(''));
  const leaf = '<path class="f paper" d="M0 0C-1 -2.6 -4 -3.6 -6.4 -3C-5.6 -.6 -2.6 .6 0 0Z"/><path class="det" d="M0 0L-4.6 -2"/>';
  for (let i = 0; i < 8; i++) {
    const cx = X + (i % 4) * CW + CW / 2, cy = Y + Math.floor(i / 4) * CD + CD / 2, last = i === 7, h = last ? 4 : 11, sc = last ? .55 : 1;
    const g = rope(K, [[cx, cy, ZT], [cx, cy, ZT + h]], .9, 'f paper') + K.on(`${planeAt(K, [cx, cy, ZT + h], [.8, -.6, 0], [0, 0, -1])} scale(${sc})`, leaf + `<g transform="scale(-1 1)">${leaf}</g>`);
    s += last ? lit(g.replace(/f paper/g, 'f body')) : g;
  }
  return s;
});

// ── Cookie cutter: the same rule. A sheet of one dough, a fluted cutter pressed into it, the rounds already cut set
// beside it, all alike; the round just cut is live.
const CC = kernel([[0, 0, 0], [76, 0, 0], [0, 42, 0], [76, 42, 0], [36, 26, 16]], 12);
const fluted = (r: number, n = 14) => 'M' + Array.from({ length: n * 4 }, (_, i) => { const a = i * Math.PI / (n * 2), rr = r * (1 + .07 * Math.cos(a * n)); return `${f(Math.cos(a) * rr)} ${f(Math.sin(a) * rr)}`; }).join('L') + 'Z';
const cutter = icon(CC, 'A rolled sheet of dough with round holes cut out, a fluted cutter pressed into it and identical cut rounds beside it.', () => {
  const K = CC, Z = 6.4, R = 5.2;
  let s = plate(K, 0, 0, 76, 42) + K.box(5, 6, 4, 40, 30, 2.4, 'paper', 'body', 'tint');
  // Dough: the holes already cut, a rolling pin's edge line
  s += K.on(K.TOP(0, 0, Z), [[13, 14], [25, 14], [13, 27]].map(([x, y]) => `<path class="f tint" transform="translate(${x} ${y})" d="${fluted(R)}"/>`).join('') + '<path class="det" d="M37 8V20"/>');
  // The cutter pressed in: a fluted wall, open top, a handle bar across
  s += K.on(K.TOP(28, 27, Z), `<path class="f tint" d="${fluted(R + .6)}"/>`);
  s += prism(K, Array.from({ length: 28 }, (_, i) => { const a = i * Math.PI / 14; return [28 + Math.cos(a) * (R + .6), 27 + Math.sin(a) * (R + .6)] as P2; }), Z, 4, 'tint', 'body');
  s += K.on(K.TOP(28, 27, Z + 4), `<circle class="f paper" r="${R - .4}"/>`) + K.box(27.2, 21.4, Z + 4, 1.6, 11.2, 4, 'paper', 'body', 'tint');
  // The cut rounds, alike, the last one live
  const round = (x: number, y: number) => K.cyl(x, y, 4, R, 1.8, 'paper', 'body') + K.on(K.TOP(x, y, 5.8), `<path class="det" d="${fluted(R - .8)}"/>` + [[-1.6, -1], [1.6, -1], [0, 1.6]].map(([u, v]) => `<circle class="f blk" cx="${u}" cy="${v}" r=".45"/>`).join(''));
  s += round(56, 10) + round(68, 14) + round(54, 22) + lit(round(66, 27));
  return s;
});

// ── Snowball: judge cold ads by the warm audience they build. A snowball rolled across the plate, its track widening
// behind it; what it gathered on the way is the result, and the ball is live.
const SW = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [50, 20, 30]], 12);
const snowball = icon(SW, 'A big snowball at the end of the track it rolled, the track widening from a thin line to the width of the ball.', () => {
  const K = SW, BX = 50, BY = 19, R = 11;
  let s = plate(K, 0, 0, 76, 44);
  // The track: bare stripe from a thin start to the ball's width, a seed lump at its start
  const a = Math.atan2(BY - 37, BX - 8), n = [-Math.sin(a), Math.cos(a)], w0 = .8, w1 = R * .4, EX = BX, EY = BY;
  const tr: P2[] = [[8 + n[0] * w0, 37 + n[1] * w0], [EX + n[0] * w1, EY + n[1] * w1], [EX - n[0] * w1, EY - n[1] * w1], [8 - n[0] * w0, 37 - n[1] * w0]];
  s += K.on(K.TOP(0, 0, 4), `<path class="f tint" d="${d2(tr)}"/>` + [.25, .45, .65, .82].map((u) => { const x = 8 + (BX - 8) * u, y = 37 + (BY - 37) * u, w = w0 + (w1 - w0) * u; return `<path class="det" d="M${f(x + n[0] * w * .6)} ${f(y + n[1] * w * .6)}L${f(x - n[0] * w * .6)} ${f(y - n[1] * w * .6)}"/>`; }).join(''));
  s += K.cyl(7, 38, 4, 1.6, 1.4, 'paper', 'body');
  // The ball: an outline in screen space, a few packed-snow seams
  const [cx, cy] = K.P(BX, BY, 4 + R);
  s += lit(`<circle class="f tint" cx="${f(cx)}" cy="${f(cy)}" r="${R}"/>` + `<path class="det" d="M${f(cx - R * .8)} ${f(cy + R * .1)}Q${f(cx - R * .1)} ${f(cy + R * .5)} ${f(cx + R * .7)} ${f(cy - R * .3)}M${f(cx - R * .5)} ${f(cy - R * .6)}Q${f(cx + R * .1)} ${f(cy - R * .3)} ${f(cx + R * .3)} ${f(cy - R * .9)}M${f(cx - R * .2)} ${f(cy + R * .9)}Q${f(cx + R * .3)} ${f(cy + R * .5)} ${f(cx + R * .8)} ${f(cy + R * .4)}"/>`);
  return s;
});

// ── Crab pot: the same rule. A slatted pot with its float; judged by the catch inside it, which is live.
const CP = kernel([[0, 0, 0], [70, 0, 0], [0, 46, 0], [70, 46, 0], [14, 8, 24], [56, 8, 24]], 12);
const pot = icon(CP, 'A slatted crab pot with its rope and float, a crab caught inside between the slats.', () => {
  const K = CP, X = 14, Y = 8, W = 42, D = 26, Z = 6, H = 15, ZT = Z + H;
  let s = plate(K, 0, 0, 70, 46) + K.box(X, Y, 4, W, D, 2, 'paper', 'body', 'tint');
  // Inside: floor slats, the far walls' bars
  s += K.on(K.TOP(X, Y, Z), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="2" y1="${2 + i * 4.4}" x2="${W - 2}" y2="${2 + i * 4.4}"/>`).join(''));
  for (let i = 0; i <= 6; i++) s += K.line([[X + i * W / 6, Y, Z], [X + i * W / 6, Y, ZT]], 'det');
  for (let i = 0; i <= 5; i++) s += K.line([[X, Y + i * D / 5, Z], [X, Y + i * D / 5, ZT]], 'det');
  // The crab: shell, legs, two claws
  const crab = `<path class="det" d="${[-1, 1].map((sg) => [-2.6, 0, 2.6].map((y) => `M${sg * 4} ${y}L${sg * 7.6} ${y * 1.6 + 1}L${sg * 8.6} ${y * 1.6 + 3}`).join('')).join('')}"/>` +
    [-1, 1].map((sg) => `<path class="det" d="M${sg * 2.6} -3.4L${sg * 4} -6.4"/><ellipse class="f body" cx="${sg * 4.6}" cy="-7.8" rx="2" ry="1.4"/>`).join('') + '<ellipse class="f body" cx="0" cy="0" rx="5.4" ry="4"/><path class="det" d="M-3 -1.2Q0 -2.6 3 -1.2"/>';
  s += lit(K.on(`${K.TOP(X + W / 2 - 2, Y + D / 2, Z + .6)} scale(1.35)`, crab));
  // Near walls: bars, corner posts, rims, and the funnel entrance on the end
  for (let i = 1; i < 6; i++) s += K.box(X + i * W / 6 - .5, Y + D - 1, Z, 1, 1, H, 'paper', 'body', 'tint');
  for (let i = 1; i < 5; i++) s += K.box(X + W - 1, Y + i * D / 5 - .5, Z, 1, 1, H, 'paper', 'body', 'tint');
  s += [[X, Y], [X + W - 2, Y], [X, Y + D - 2], [X + W - 2, Y + D - 2]].map(([x, y]) => K.box(x, y, Z, 2, 2, H, 'paper', 'body', 'tint')).join('');
  s += K.on(K.TOP(X, Y, ZT), `<path class="f paper" fill-rule="evenodd" d="M0 0H${W}V${D}H0ZM2 2H${W - 2}V${D - 2}H2Z"/>` + Array.from({ length: 2 }, (_, i) => `<rect class="f paper" x="${13 + i * 16}" y="2" width="1.4" height="${D - 4}"/>`).join(''));
  s += K.on(K.SIDE(X + W, Y + D, ZT), `<ellipse class="f paper" fill-rule="evenodd" cx="${D / 2}" cy="${H / 2}" rx="5" ry="5"/><ellipse class="f blk" cx="${D / 2}" cy="${H / 2}" rx="2.6" ry="2.6"/>`);
  // Rope from the top corner to the float on the plate
  s += rope(K, [...K.curve([X + 2, Y + D - 2, ZT], [4, Y + D + 2, ZT + 6], [8, 38, 13], 12)], 1.2, 'f paper');
  s += K.cyl(8, 38, 4, 4.4, 4, 'paper', 'body') + K.cyl(8, 38, 8, 2.8, 4, 'paper', 'tint') + K.cyl(8, 38, 12, 1, 1.6, 'paper', 'body');
  return s;
});

export const ALTS: Record<string, Alt> = {
  'alt-springscale-1': { of: 'i-springscale', idea: 'Кип’ятильник із краником: рівень стоїть вище за кран, тож уже можна наливати', piece: urn },
  'alt-springscale-2': { of: 'i-springscale', idea: 'Стос ящиків біля стовпчика з прапорцем: рахується, лише коли дорівнявся позначці', piece: crates },
  'alt-cascade-1': { of: 'i-cascade', idea: 'Мангал із жаром під однією половиною: спершу смажать над гарячим, холодний край чекає', piece: grill },
  'alt-cascade-2': { of: 'i-cascade', idea: 'Два газові балони на перемикачі: другий відкривають, лише коли перший спорожнів', piece: cylinders },
  'alt-aperture-1': { of: 'i-aperture', idea: 'Розвідний ключ: розкритий заздалегідь, губку підкручено точно під гайку', piece: spanner },
  'alt-aperture-2': { of: 'i-aperture', idea: 'Наконечник шланга: воду пущено одразу, кільце закручено до вузького струменя', piece: nozzle },
  'alt-canisters-1': { of: 'i-canisters', idea: 'Три урни з різними отворами в кришках: кожна приймає лише своє', piece: bins },
  'alt-canisters-2': { of: 'i-canisters', idea: 'Склянка з трьома шарами, що не змішуються, і ложка, якою не мішали', piece: layered },
  'alt-airlock-1': { of: 'i-airlock', idea: 'Кухонна планка із замовленнями: чеки по порядку від найдовшого, кожен звірений', piece: rail },
  'alt-airlock-2': { of: 'i-airlock', idea: 'Книжки між підпірками, розставлені за зростом: короткий упорядкований добір', piece: books },
  'alt-chain-1': { of: 'i-chain', idea: 'Касета з розсадою з одного пакетика: нові паростки такі самі, як решта', piece: seedlings },
  'alt-chain-2': { of: 'i-chain', idea: 'Форма для печива й одне тісто: нові кружальця вирізають такі самі, як уже вирізані', piece: cutter },
  'alt-magnet-1': { of: 'i-magnet', idea: 'Сніжна куля в кінці свого сліду: її міряють тим, скільки вона назбирала дорогою', piece: snowball },
  'alt-magnet-2': { of: 'i-magnet', idea: 'Верша з крабом усередині: про пастку судять за уловом', piece: pot },
};
