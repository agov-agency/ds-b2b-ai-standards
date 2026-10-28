// Alternative rule icons: two other ideas per rule, kept out of ICON_POOLS until Agov picks. Shown on /art-review as
// `x-<name>`. Same style and helpers as icons-rules.ts: one object on a plate, its telling details, one live part.
import { kernel, f, type V3 } from './iso';
import { bar, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from './icons';
import { ann, ball } from './icons-rules';

// Visible half rings round a cylinder lying along y or x (for bands and grooves)
export const ringY = (cx: number, y: number, cz: number, r: number): V3[] => Array.from({ length: 25 }, (_, i) => { const a = -Math.PI / 4 + Math.PI * i / 24; return [cx + r * Math.cos(a), y, cz + r * Math.sin(a)] as V3; });
export const ringX = (x: number, cy: number, cz: number, r: number): V3[] => Array.from({ length: 25 }, (_, i) => { const a = -Math.PI / 4 + Math.PI * i / 24; return [x, cy + r * Math.cos(a), cz + r * Math.sin(a)] as V3; });
// A cone lying along x, r0 at x0 to r1 at x1, with its +x end cap
export const coneX = (K: K, x0: number, x1: number, cy: number, cz: number, r0: number, r1: number, end = 'paper', side = 'body') => {
  const arc = (x: number, r: number, a0: number, a1: number): V3[] => Array.from({ length: 25 }, (_, i) => { const a = a0 + (a1 - a0) * i / 24; return [x, cy + r * Math.cos(a), cz + r * Math.sin(a)] as V3; });
  return K.poly([...arc(x0, r0, -Math.PI / 4, Math.PI * 3 / 4), ...arc(x1, r1, -Math.PI / 4, Math.PI * 3 / 4).reverse()], `f ${side}`) + K.poly(arc(x1, r1, 0, 2 * Math.PI), `f ${end}`);
};
// A wall segment on a top surface, from a to b
export const wall = (K: K, a: P2, b: P2, z: number, h: number, w = 1.6, top = 'paper') => K.prism(bar(a[0], a[1], Math.atan2(b[1] - a[1], b[0] - a[0]), 0, Math.hypot(b[0] - a[0], b[1] - a[1]), w), z, h, top, 'body', 'tint');
// A rectangle turned by a around its centre
export const rot = (cx: number, cy: number, w: number, d: number, a: number): P2[] => [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
export const spokes = (n: number, r: number, a0 = 0) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 2 * Math.PI / n; return `<line class="det" x1="0" y1="0" x2="${f(Math.cos(a) * r)}" y2="${f(Math.sin(a) * r)}"/>`; }).join('');

// ── 01 Padlock: read frequency and penetration together. A combination padlock; its two wheels line up on the index (live).
const PL = kernel([[0, 0, 0], [64, 0, 0], [0, 40, 0], [64, 40, 0], [32, 20, 62]], 12);
const padlock = icon(PL, 'A combination padlock with two wheels turned so their marks line up on the index.', () => {
  const K = PL, X = 12, Y = 13, W = 40, D = 14, ZT = 36, yc = Y + D / 2;
  let s = plate(K, 0, 0, 64, 40) + K.box(X + 2, Y + 2, 4, W - 4, D - 4, 2, 'paper', 'body', 'tint') + K.box(X, Y, 6, W, D, ZT - 6, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="det" x="2" y="2" width="${W - 4}" height="26" rx=".8"/><rect class="f blk" x="7" y="8" width="26" height="14" rx=".6"/>` +
    [9, 21].map((x) => `<rect class="f paper" x="${x}" y="8.6" width="10" height="12.8"/>` + [10.8, 13.2, 18.8, 21].map((y) => `<line class="det" x1="${x}" y1="${y}" x2="${x + 10}" y2="${y}"/>`).join('')).join('') + screws([[5, 25.4], [W - 5, 25.4]]));
  s += lit(K.on(K.FRONT(X, Y + D, ZT), [9, 21].map((x) => `<rect class="f body" x="${x}" y="13.6" width="10" height="2.8"/>`).join('') + `<path class="f body" d="M3.6 13L6.4 15L3.6 17Z"/><path class="f body" d="M${W - 3.6} 13L${W - 6.4} 15L${W - 3.6} 17Z"/>`));
  s += K.on(K.SIDE(X + W, Y + D, ZT), `<rect class="det" x="4" y="6" width="6" height="3" rx="1"/><line class="det" x1="2" y1="12" x2="${D - 2}" y2="12"/>`);
  s += K.on(K.TOP(X, Y, ZT), `<ellipse class="f blk" cx="8" cy="${D / 2}" rx="2.8" ry="2.8"/><ellipse class="f blk" cx="${W - 8}" cy="${D / 2}" rx="2.8" ry="2.8"/>`);
  const arc = Array.from({ length: 13 }, (_, i) => { const a = Math.PI * i / 12; return [X + W / 2 - Math.cos(a) * 12, yc, ZT + 12 + Math.sin(a) * 12] as V3; });
  return s + rope(K, [[X + 8, yc, ZT], ...arc, [X + W - 8, yc, ZT + 4]], 4.4, 'f paper') + rope(K, [[X + W - 8, yc, ZT + 4], [X + W - 8, yc, ZT]], 4.4, 'f tint');
});

// ── 01 Binoculars: read the two together. Binoculars on a tripod, both barrels on one focus; the lenses are live.
const BI = kernel([[0, 0, 0], [64, 0, 0], [0, 48, 0], [64, 48, 0], [32, 24, 58]], 12);
const binoculars = icon(BI, 'Binoculars on a tripod, both barrels on one focus wheel, the lenses facing out.', () => {
  const K = BI, HX = 32, HY = 22, HZ = 30, CZ = 44, R = 5.2;
  let s = plate(K, 0, 0, 64, 48);
  const leg = ([x, y]: P2) => K.box(x - 2.5, y - 2.5, 4, 5, 5, 1.6, 'paper', 'body', 'tint') + rope(K, [[x, y, 5.6], [HX + (x - HX) * .12, HY + (y - HY) * .12, HZ - 3]], 2.4, 'f paper');
  s += leg([30, 6]) + K.cyl(HX, HY, 12, 1.6, HZ - 12, 'paper', 'body') + K.cyl(HX, HY, 14, 3, 2, 'paper', 'body') + leg([8, 40]) + leg([56, 36]);
  s += K.cyl(HX, HY, HZ - 3, 4.4, 3, 'paper', 'body') + K.box(HX - 2, HY - 2, HZ, 4, 4, 7, 'paper', 'body', 'tint') + rope(K, [[HX, HY + 2, HZ + 1], [HX - 3, HY + 18, HZ - 5]], 1.6, 'f paper');
  const barrel = (cx: number) => K.cylY(8, 13, cx, CZ, 3.4, 'paper', 'body') + K.cylY(13, 34, cx, CZ, R, 'paper', 'tint') + K.line(ringY(cx, 19, CZ, R), 'det') + K.line(ringY(cx, 27, CZ, R), 'det') +
    K.on(K.FRONT(cx, 34, CZ), `<circle class="det" r="4.2"/>`) + lit(K.on(K.FRONT(cx, 34, CZ), `<circle class="f body" r="3.4"/><path class="f paper" d="M-2.4 -.6A2.5 2.5 0 0 1 -.6 -2.4L-.4 -1.4A1.4 1.4 0 0 0 -1.4 -.4Z"/>`));
  s += K.box(HX - 3, HY - 4, HZ + 7, 6, 8, CZ - HZ - 9, 'paper', 'body', 'tint') + barrel(26) + K.box(27, 17, CZ + 2, 10, 8, 2.4, 'paper', 'body', 'tint') + K.cylY(18, 23, 32, CZ + 6.4, 2.4, 'paper', 'body') + barrel(38);
  return s;
});

// ── 02 Manifold: separate targets for cold and warm. One header, two branches with their own valves: a wide fan nozzle and
// a narrow jet; the sprays are live.
const MF = kernel([[0, 0, 0], [72, 0, 0], [0, 50, 0], [72, 50, 0], [36, 12, 32]], 12);
const manifold = icon(MF, 'A header pipe feeding two branches, each with its own handwheel valve: one ends in a wide fan nozzle, the other in a narrow jet.', () => {
  const K = MF, HY = 12, HZ = 16, R = 5;
  let s = plate(K, 0, 0, 72, 50) + [14, 58].map((x) => K.box(x - 4, HY - 5, 4, 8, 10, 8, 'paper', 'body', 'tint')).join('');
  s += K.cylX(4, 64, HY, HZ, R, 'paper', 'tint') + K.cylX(64, 66, HY, HZ, R + 1.8, 'paper', 'body') + K.on(K.SIDE(66, HY, HZ), Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return `<circle class="f blk" cx="${f(Math.cos(a) * 5.4)}" cy="${f(Math.sin(a) * 5.4)}" r=".7"/>`; }).join(''));
  const branch = (x: number, end: string) => {
    let g = K.cylY(HY + 2, 21, x, HZ, 2.8, 'paper', 'tint') + K.box(x - 3.8, 21, HZ - 3.8, 7.6, 5, 7.6, 'paper', 'body', 'tint') + K.cyl(x, 23.5, HZ + 3.8, 1, 4, 'paper', 'body');
    g += K.cyl(x, 23.5, HZ + 7.8, 4.6, 1.2, 'paper', 'body') + K.on(K.TOP(x, 23.5, HZ + 9), `<circle class="det" r="1.2"/>${spokes(4, 3.8, .4)}`);
    return g + K.cylY(26, 31, x, HZ, 2.8, 'paper', 'tint') + K.cylY(31, 32.6, x, HZ, 3.6, 'paper', 'body') + end;
  };
  const fan = K.prism([[19.4, 32.6], [24.6, 32.6], [30, 40], [14, 40]], HZ - 1.4, 2.8, 'paper', 'body', 'tint') + K.on(K.FRONT(14, 40, HZ + 1.4), '<rect class="f blk" x="2" y="1.1" width="12" height=".8"/>');
  const jet = K.cylY(32.6, 36, 50, HZ, 2, 'paper', 'body') + K.cylY(36, 37.4, 50, HZ, 1.1, 'paper', 'body');
  s += branch(22, fan) + lit(K.poly([[15, 40.6, HZ], [29, 40.6, HZ], [36, 49, HZ - 2], [8, 49, HZ - 2]], 'f body'), .45);
  s += branch(50, jet) + lit(rope(K, [[50, 37.6, HZ], [50, 49, HZ - 1.4]], 1.4, 'f body'));
  return s;
});

// ── 02 Gear gate: separate targets for cold and warm. A gear lever in a gate with two slots, pushed into one (live knob).
const GL = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [24, 30, 56]], 12);
const gearlever = icon(GL, 'A gear lever standing in a gate plate with two parallel slots, pushed to the end of one of them.', () => {
  const K = GL, X = 10, Y = 8, W = 40, D = 28, Z = 12;
  let s = plate(K, 0, 0, 60, 44) + K.box(X, Y, 4, W, D, Z - 4, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + D, Z), `<line class="det" x1="3" y1="4" x2="${W - 3}" y2="4"/>`);
  s += K.on(K.TOP(X, Y, Z), `<rect class="det" x="5" y="3" width="30" height="22" rx="1"/><path class="f blk" d="M10 6H14V22H10ZM26 6H30V22H26ZM14 12.4H26V15.6H14Z"/>` + screws([[3, 3], [W - 3, 3], [3, D - 3], [W - 3, D - 3]]) +
    [7, 23].map((y) => `<line class="det" x1="16" y1="${y}" x2="24" y2="${y}"/>`).join(''));
  // The lever: boot at the slot end, rod leaning forward, the knob on top
  const bx = X + 12, by = Y + 20;
  s += K.cyl(bx, by, Z, 3.4, 1.6, 'paper', 'body') + K.cyl(bx, by, Z + 1.6, 2.4, 2, 'paper', 'body');
  s += rope(K, [[bx, by, Z + 3], [bx - 1, by + 3, Z + 30]], 2.4, 'f paper') + K.cyl(bx - .8, by + 2.4, Z + 22, 2, 1.6, 'paper', 'body');
  return s + lit(ball(K, bx - 1.1, by + 3.3, Z + 34, 6, 'f body'));
});

// ── 03 Strongbox: fatigue only when both signs show. A box with two key locks, a key turned in each (live).
const LB = kernel([[0, 0, 0], [70, 0, 0], [0, 42, 0], [70, 42, 0], [35, 21, 50]], 12);
const lockbox = icon(LB, 'A strongbox with two key locks on its front and a key turned in each of them.', () => {
  const K = LB, X = 10, Y = 8, W = 50, D = 22, H = 34, ZT = 4 + H, yc = Y + D / 2;
  let s = plate(K, 0, 0, 70, 42) + K.box(X, Y, 4, W, D, H, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + D, ZT), `<line class="det" x1="0" y1="8" x2="${W}" y2="8"/><rect class="det" x="3" y="11" width="${W - 6}" height="${H - 14}" rx=".8"/>` + screws([[5, 4], [W - 5, 4], [6, H - 6], [W - 6, H - 6]]));
  s += K.on(K.SIDE(X + W, Y + D, ZT), `<line class="det" x1="0" y1="8" x2="${D}" y2="8"/><rect class="det" x="${D / 2 - 5}" y="16" width="10" height="3" rx="1"/>`);
  s += [X + 16, X + W - 16].map((x) => K.box(x - 2.4, yc - 2, ZT, 4.8, 4, 2.4, 'paper', 'body', 'tint')).join('') + rope(K, [[X + 16, yc, ZT + 2.4], [X + 16, yc, ZT + 7], [X + W - 16, yc, ZT + 7], [X + W - 16, yc, ZT + 2.4]], 2.2, 'f paper');
  const key = (x: number) => {
    const z = 20, y = Y + D;
    let g = K.cylY(y, y + 1.4, x, z, 4.6, 'paper', 'body') + K.on(K.FRONT(x, y + 1.4, z), '<circle class="det" r="3.4"/>');
    g += lit(K.cylY(y + 1.4, y + 5, x, z, .9, 'body', 'body') + [0, 1.2].map((dz, i) => K.on(K.TOP(x, y + 5, z + dz), `<path class="f ${i ? 'body' : 'tint'}" fill-rule="evenodd" d="M-4.4 0H4.4V7.4H-4.4ZM-1.8 2.6H1.8V4.8H-1.8Z"/>`)).join(''));
    return g;
  };
  return s + key(X + 14) + key(X + W - 14);
});

// ── 03 Two-hand press: both signs before acting. A bench press with a palm button each side, both held down (live).
const TP = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [38, 18, 70]], 12);
const press2 = icon(TP, 'A bench press with a palm button at each side of its base; both buttons are held down.', () => {
  const K = TP, CX = 38, CY = 22;
  let s = plate(K, 0, 0, 76, 44);
  for (const x of [4, 58]) s += K.box(x, 16, 4, 14, 16, 6, 'paper', 'body', 'tint') + rope(K, [[x === 4 ? 18 : 58, 24, 7], [x === 4 ? 22 : 54, 24, 7]], 2, 'f paper');
  s += K.box(22, 6, 4, 32, 30, 8, 'paper', 'body', 'tint') + K.on(K.FRONT(22, 36, 12), screws([[4, 4], [28, 4]]) + '<rect class="det" x="9" y="2" width="14" height="4" rx=".5"/>');
  s += K.box(31, 6, 12, 14, 9, 48, 'paper', 'body', 'tint') + K.on(K.SIDE(45, 15, 60), Array.from({ length: 5 }, (_, i) => `<line class="det" x1="2" y1="${8 + i * 3}" x2="7" y2="${8 + i * 3}"/>`).join(''));
  s += K.box(31, CY - 2, 12, 14, 12, 4, 'paper', 'body', 'tint') + K.box(34, CY + 1, 16, 8, 6, 2, 'tint', 'body', 'tint');
  s += K.box(32, CY - 1, 18, 12, 10, 7, 'paper', 'body', 'tint') + K.cyl(CX, CY + 4, 25, 3.2, 33, 'paper', 'tint') + K.box(29, 6, 58, 18, 26, 9, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(29, 32, 67), '<rect class="det" x="3" y="2.4" width="12" height="4.2" rx=".5"/>');
  const button = (x: number) => K.cyl(x, 24, 10, 6.4, 1.6, 'paper', 'body') + lit(K.cyl(x, 24, 11.6, 2.4, .8, 'body', 'body') + K.cyl(x, 24, 12.4, 5, 1.6, 'body', 'body') + K.on(K.TOP(x, 24, 14), '<circle class="det" r="3.2"/>'));
  return s + button(11) + button(65);
});

// ── 04 Lighthouse: judge awareness on reach. A striped tower, its lamp lit and the beam thrown wide (live).
const LH = kernel([[0, 0, 0], [64, 0, 0], [0, 52, 0], [64, 52, 0], [22, 22, 82], [64, 50, 52]], 12);
const lighthouse = icon(LH, 'A striped lighthouse on its base, the lantern lit and a wide beam thrown out over the plate.', () => {
  const K = LH, X = 22, Y = 22;
  let s = plate(K, 0, 0, 64, 52) + K.cyl(X, Y, 4, 14, 3, 'paper', 'body');
  [[12, 'paper'], [10.8, 'tint'], [9.6, 'paper'], [8.4, 'tint']].forEach(([r, c], i) => { s += K.cyl(X, Y, 7 + i * 13, r as number, 13, 'paper', c as string); });
  s += K.box(X + 6, Y + 6, 7, 6, 6, 9, 'paper', 'body', 'tint') + K.on(K.FRONT(X + 6, Y + 12, 16), '<rect class="det" x="1.4" y="2" width="3.2" height="7"/>');
  s += K.cyl(X, Y, 59, 10, 1.6, 'paper', 'body') + K.line(K.ring(X, Y, 64, 10, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det') +
    Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 4 + i * Math.PI / 6; return K.line([[X + Math.cos(a) * 10, Y + Math.sin(a) * 10, 60.6], [X + Math.cos(a) * 10, Y + Math.sin(a) * 10, 64]], 'det'); }).join('');
  s += lit(K.poly([[X + 3, Y, 65], [64, 2, 71], [64, 24, 59]], 'f body'), .35);
  s += lit(K.cyl(X, Y, 60.6, 5.4, 8, 'body', 'body')) + K.line([[X + 3.8, Y + 3.8, 60.6], [X + 3.8, Y + 3.8, 68.6]], 'det') + K.line([[X + 5.4, Y, 60.6], [X + 5.4, Y, 68.6]], 'det');
  s += K.cyl(X, Y, 68.6, 6.6, 1.4, 'paper', 'body') + K.cyl(X, Y, 70, 4.2, 2.4, 'paper', 'body') + K.cyl(X, Y, 72.4, 1.8, 2.4, 'paper', 'body') + K.cyl(X, Y, 74.8, .6, 3, 'paper', 'body');
  return s;
});

// ── 04 Radio mast: judge awareness on reach. A lattice mast held by guy wires, antenna panels round the top (live).
const RM = kernel([[0, 0, 0], [64, 0, 0], [0, 48, 0], [64, 48, 0], [32, 22, 78]], 12);
const mast = icon(RM, 'A lattice radio mast on a pad, held by guy wires, with antenna panels fixed round its top.', () => {
  const K = RM, A: P2 = [27, 17], B: P2 = [37, 17], C: P2 = [32, 26], Z0 = 8, Z1 = 64;
  let s = plate(K, 0, 0, 64, 48) + K.box(22, 12, 4, 20, 19, 4, 'paper', 'body', 'tint');
  const anchors: V3[] = [[6, 6, 4], [60, 10, 4], [12, 42, 4]];
  const guy = (p: V3, q: P2) => K.box(p[0] - 2, p[1] - 2, 4, 4, 4, 1.4, 'paper', 'body', 'tint') + K.line([[p[0], p[1], 5.4], [q[0], q[1], 42]], 'det');
  s += guy(anchors[0], A) + guy(anchors[1], B);
  const leg = ([x, y]: P2) => rope(K, [[x, y, Z0], [x, y, Z1]], 1.6, 'f paper');
  const brace = (p: P2, q: P2) => { let g = ''; for (let z = Z0; z < Z1; z += 7) g += K.line([[p[0], p[1], z], [q[0], q[1], z + 7]], 'det') + K.line([[q[0], q[1], z], [p[0], p[1], z + 7]], 'det') + K.line([[p[0], p[1], z], [q[0], q[1], z]], 'det'); return g; };
  const panel = (x: number, y: number, a: number) => lit(K.prism(bar(x, y, a, -4.4, 4.4, 1.6), 50, 12, 'paper', 'body', 'body'));
  s += leg(A) + panel(32, 13.6, 0) + brace(A, B) + brace(A, C) + brace(B, C) + leg(B) + leg(C);
  s += K.prism([[25, 15.6], [39, 15.6], [32, 28]], Z1, 1.4, 'paper', 'body', 'tint') + K.cyl(32, 20, Z1 + 1.4, .8, 6, 'paper', 'body') + K.cyl(32, 20, Z1 + 7.4, 1.4, 1.6, 'paper', 'body');
  s += panel(26.6, 23.6, Math.atan2(9, 5)) + panel(37.4, 23.6, Math.atan2(9, -5));
  return s + guy(anchors[2], C);
});

// ── 05 Points: split only when a segment outperforms. A railway switch, the blades thrown to the branch (live).
const RP = kernel([[0, 0, 0], [80, 0, 0], [0, 50, 0], [80, 50, 0], [18, 40, 30]], 12);
const points = icon(RP, 'A railway switch: a straight track and a branch curving off, the switch blades thrown to the branch, a lever stand beside it.', () => {
  const K = RP, Z = 6, by = (x: number) => 20 + Math.max(0, x - 24) ** 2 * .0075;
  let s = plate(K, 0, 0, 80, 50);
  for (let x = 6; x <= 74; x += 6) { const y1 = Math.max(28, by(x) + 8); s += K.box(x - 1.4, 12, 4, 2.8, y1 - 12, 2, 'paper', 'body', 'tint'); }
  const railTo = (pts: P2[], cls = 'f paper') => rope(K, pts.map(([x, y]) => [x, y, Z - 1] as V3), 2, 'f tint') + rope(K, pts.map(([x, y]) => [x, y, Z] as V3), 1.4, cls);
  const curve = (dy: number, x0: number, x1: number) => Array.from({ length: 12 }, (_, i) => { const x = x0 + (x1 - x0) * i / 11; return [x, by(x) + dy] as P2; });
  s += railTo([[4, 16], [76, 16]]) + railTo([[50, 24], [76, 24]]);
  s += railTo([[4, 24], [20, 24]]) + railTo(curve(4, 40, 76)) + railTo(curve(-4, 48, 76));
  s += lit(railTo(curve(4, 20, 40), 'f body') + railTo([[20, 16.6], ...curve(-4, 28, 48).slice(1)], 'f body'));
  s += rope(K, [[17, 38, 5], [21, 23, 5]], 1.2, 'f paper') + K.box(13, 36, 4, 8, 6, 5, 'paper', 'body', 'tint') + K.cyl(17, 39, 9, 1.2, 14, 'paper', 'body');
  s += rope(K, [[17, 39, 10], [10, 43, 16]], 1.6, 'f paper') + lit(K.on(K.FRONT(17, 40.4, 26), `${ann(4.4, 2, 'f body')}<circle class="det" r="4.4"/>`));
  return s;
});

// ── 05 Chute flap: split only the standout. A ball run that forks; the flap is thrown and turns one ball off (live).
const CF = kernel([[0, 0, 0], [76, 0, 0], [0, 48, 0], [76, 48, 0], [38, 24, 22]], 12);
const chute = icon(CF, 'A ball run that forks in two; a hinged flap at the fork turns one standout ball into the side lane while the rest run straight.', () => {
  const K = CF, X = 6, Y = 6, Z = 12, o = (x: number, y: number): P2 => [X + x, Y + y];
  let s = plate(K, 0, 0, 76, 48) + K.box(X, Y, 4, 64, 36, Z - 4, 'paper', 'body', 'tint') + K.on(K.FRONT(X, Y + 36, Z), screws([[4, 4], [60, 4]]));
  s += K.on(K.TOP(X, Y, Z), '<path class="f tint" d="M2 7H62V17H50L62 25V33H38L24 17H2Z"/>');
  s += wall(K, o(2, 6), o(62, 6), Z, 3);
  s += [12, 52, 60].map((x) => ball(K, X + x, Y + 12, Z + 3, 3.6, 'f paper')).join('');
  s += K.prism([o(36, 17.6), o(62, 17.6), o(62, 24), o(46, 24)], Z, 3, 'paper', 'body', 'tint');
  s += K.cyl(X + 35, Y + 17, Z, 1.6, 4.4, 'paper', 'body') + lit(K.prism(bar(X + 35, Y + 17, Math.atan2(-10, -8), 0, 12, 1.6), Z, 3.6, 'body', 'body', 'body'));
  s += lit(ball(K, X + 52, Y + 29, Z + 3, 3.6, 'f body'));
  s += wall(K, o(2, 17.6), o(24, 17.6), Z, 3) + wall(K, o(24, 17.6), o(38, 33.4), Z, 3) + wall(K, o(38, 33.4), o(62, 33.4), Z, 3);
  return s;
});

// ── 06 Gyroscope: watch for drift. A gyroscope balanced upright on its stand, the rotor spinning true (live).
const GY = kernel([[0, 0, 0], [56, 0, 0], [0, 44, 0], [56, 44, 0], [28, 22, 70]], 12);
const gyroscope = icon(GY, 'A gyroscope balanced upright on the cup of its stand, its rotor spinning inside the ring.', () => {
  const K = GY, X = 28, Y = 22, CZ = 44;
  let s = plate(K, 0, 0, 56, 44) + K.cyl(X, Y, 4, 11, 2.4, 'paper', 'body') + K.cyl(X, Y, 6.4, 3, 12, 'paper', 'body') + K.cyl(X, Y, 18.4, 4, 2, 'paper', 'body');
  s += K.cyl(X, Y, 20.4, .9, CZ - 20.4, 'paper', 'body');
  s += K.on(K.FRONT(X, Y - .9, CZ), ann(19, 16.4, 'f tint')) + K.on(K.FRONT(X, Y + .9, CZ), ann(19, 16.4, 'f paper') + '<circle class="det" r="17.7"/>');
  s += K.cyl(X, Y, CZ - 3.6, 2.6, 2, 'paper', 'body');
  s += lit(K.cyl(X, Y, CZ - 2, 14, 5, 'body', 'body') + K.on(K.TOP(X, Y, CZ + 3), `<circle class="det" r="11.4"/><circle class="det" r="4"/>` + Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return `<circle class="f paper" cx="${f(Math.cos(a) * 7.6)}" cy="${f(Math.sin(a) * 7.6)}" r="1.5"/>`; }).join('')));
  s += K.cyl(X, Y, CZ + 3, 2.6, 2, 'paper', 'body') + K.cyl(X, Y, CZ + 5, .9, 12, 'paper', 'body') + K.cyl(X, Y, CZ + 17, 2.4, 2.4, 'paper', 'body');
  return s;
});

// ── 06 Plumb bob: watch for drift off centre. A bob on a string from a stand, hanging dead over the centre mark (live bob).
const PB = kernel([[0, 0, 0], [60, 0, 0], [0, 48, 0], [60, 48, 0], [8, 20, 72]], 12);
const plumb = icon(PB, 'A plumb bob hanging on a string from the arm of a stand, its point right over the centre of a target on the plate.', () => {
  const K = PB, BX = 38, BY = 24, ZA = 66;
  let s = plate(K, 0, 0, 60, 48);
  s += K.on(K.TOP(BX, BY, 4), [11, 7.4, 3.8].map((r) => `<circle class="det" r="${r}"/>`).join('') + '<path class="det" d="M-14 0H-1.6M1.6 0H14M0 -14V-1.6M0 1.6V14"/><circle class="f blk" r=".8"/>');
  s += K.box(4, 16, 4, 12, 12, 5, 'paper', 'body', 'tint') + K.on(K.TOP(4, 16, 9), '<rect class="f tint" x="2" y="4.6" width="8" height="2.8" rx="1.4"/><ellipse class="f body" cx="6" cy="6" rx="1.2" ry=".9"/>');
  s += K.box(8, 20, 9, 4, 4, ZA - 9, 'paper', 'body', 'tint') + K.box(8, BY - 2, ZA, BX - 6, 4, 4, 'paper', 'body', 'tint') + K.cyl(BX, BY, ZA + 4, 1.8, 1.4, 'paper', 'body');
  s += K.line([[BX, BY, ZA], [BX, BY, 25]], 'det');
  s += lit(K.cyl(BX, BY, 23, 1.2, 2, 'body', 'body') + K.cyl(BX, BY, 14, 4.2, 9, 'body', 'body') + K.poly([...K.ring(BX, BY, 14, 4.2, -Math.PI / 4, Math.PI * 3 / 4, 12), [BX, BY, 7.4]], 'f body') + K.line(K.ring(BX, BY, 19, 4.2, -Math.PI / 4, Math.PI * 3 / 4, 16), 'det'));
  return s;
});

// ── 07 Fuse box: to exclude SDRs, exclude Sales. A fuse box, door open, one whole fuse pulled and lying in front (live).
const FB = kernel([[0, 0, 0], [72, 0, 0], [0, 46, 0], [72, 46, 0], [30, 6, 60], [0, 30, 58]], 12);
const fusebox = icon(FB, 'A wall fuse box with its door swung open, one cartridge fuse pulled out of its clips and lying on the plate.', () => {
  const K = FB, X = 30, Y = 6, W = 32, D = 12, ZT = 58, H = ZT - 6;
  let s = plate(K, 0, 0, 72, 46) + K.box(X, Y, 4, W, D, 2, 'paper', 'body', 'tint') + K.box(X, Y, 6, W, D, H, 'paper', 'body', 'tint');
  const row = (i: number, empty: boolean) => { const y = 8 + i * 11; return `<rect class="f paper" x="4" y="${y}" width="3" height="6"/><rect class="f paper" x="${W - 7}" y="${y}" width="3" height="6"/>` + (empty ? `<rect class="f blk" x="7.6" y="${y + 1.4}" width="${W - 15.2}" height="3.2" rx=".4"/>` : `<rect class="f paper" x="6" y="${y + .8}" width="${W - 12}" height="4.4" rx="2.2"/><rect class="f tint" x="6" y="${y + .8}" width="3.4" height="4.4"/><rect class="f tint" x="${W - 9.4}" y="${y + .8}" width="3.4" height="4.4"/>`); };
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="f body" x="2" y="2" width="${W - 4}" height="${H - 4}"/>` + [0, 1, 2, 3].map((i) => row(i, i === 2)).join('') + `<line class="det" x1="2" y1="${H - 6}" x2="${W - 2}" y2="${H - 6}"/>`);
  // Door swung open to the left on its hinge
  s += K.on(planeAt(K, [X, Y + D, ZT], [-.94, .34, 0], [0, 0, -1]), `<rect class="f tint" width="${W}" height="${H}"/><rect class="det" x="4" y="4" width="${W - 8}" height="${H - 8}" rx=".6"/><rect class="f paper" x="${W - 6}" y="${H / 2 - 4}" width="2.4" height="8" rx="1.2"/>`);
  s += K.cyl(X, Y + D, 12, 1, 4, 'paper', 'body') + K.cyl(X, Y + D, ZT - 16, 1, 4, 'paper', 'body');
  s += lit(K.cylX(44, 46.6, 34, 8, 2.8, 'body', 'body') + K.cylX(46.6, 59.4, 34, 8, 2.4, 'body', 'body') + K.cylX(59.4, 62, 34, 8, 2.8, 'body', 'body') + K.on(K.SIDE(62, 34, 8), '<circle class="det" r="1.2"/>'));
  return s;
});

// ── 07 Cutters: exclude the whole function. Two cables between terminals; side cutters have cut through one (live jaws).
const WC = kernel([[0, 0, 0], [76, 0, 0], [0, 50, 0], [76, 50, 0], [38, 24, 18]], 12);
const cutters = icon(WC, 'Two cables run between terminal blocks; one is cut through, the side cutters still at the cut.', () => {
  const K = WC, Z = 9;
  let s = plate(K, 0, 0, 76, 50);
  const block = (x: number) => K.box(x, 8, 4, 10, 28, 7, 'paper', 'body', 'tint') + K.on(K.TOP(x, 8, 11), screws([[5, 8], [5, 20]]) + '<line class="det" x1="1.4" y1="14" x2="8.6" y2="14"/>');
  const cable = (pts: V3[]) => rope(K, pts, 3.4, 'f tint') + rope(K, pts.map(([x, y, z]) => [x, y, z + .5] as V3), 1.4, 'f paper');
  s += block(6) + block(60);
  s += cable([[16, 16, Z], [60, 16, Z]]);
  s += cable([[16, 28, Z], [33, 28, Z]]) + cable([[41, 28, Z], [60, 28, Z]]) + K.on(K.FRONT(33, 28.6, Z + 1), '<rect class="f body" x="0" y="-.6" width="1.6" height="1.2"/>') + K.on(K.FRONT(39.4, 28.6, Z + 1), '<rect class="f body" x="0" y="-.6" width="1.6" height="1.2"/>');
  const PX = 37, PY = 33, ZC = Z + 2;
  const handle = (a: number) => K.prism(bar(PX, PY, a, 2, 15, 3.4), ZC - 1, 2, 'paper', 'body', 'tint') + K.prism(bar(PX, PY, a, 6, 15, 3.8), ZC + 1, 1, 'tint', 'body', 'tint');
  s += handle(Math.PI * .58) + handle(Math.PI * .42);
  s += lit(K.prism([[PX - 2.4, PY], [PX - 1, PY - 6], [PX + .2, PY - 5.4], [PX, PY]], ZC - 1, 2, 'body', 'body', 'body') + K.prism([[PX, PY], [PX - .2, PY - 5.4], [PX + 1, PY - 6], [PX + 2.4, PY]], ZC - 1, 2, 'body', 'body', 'body'));
  return s + K.cyl(PX, PY, ZC + 1, 1.8, 1, 'paper', 'body') + dot(K, PX, PY, ZC + 2, .8);
});

// ── 08 Extinguisher: check who you reach, on schedule. A fire extinguisher with its inspection tag on the neck (live tag).
const FE = kernel([[0, 0, 0], [56, 0, 0], [0, 44, 0], [56, 44, 0], [26, 22, 76]], 12);
const extinguisher = icon(FE, 'A fire extinguisher on a floor stand, hose clipped down its side and an inspection tag hanging from its neck.', () => {
  const K = FE, X = 24, Y = 20, R = 10;
  let s = plate(K, 0, 0, 56, 44) + K.box(X - 13, Y - 13, 4, 26, 26, 2, 'paper', 'body', 'tint') + K.cyl(X, Y, 6, R + 1, 3, 'paper', 'body');
  s += K.cyl(X, Y, 9, R, 44, 'paper', 'tint') + K.line(K.ring(X, Y, 22, R, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det') + K.line(K.ring(X, Y, 40, R, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det');
  s += K.cyl(X, Y, 53, 8, 2, 'paper', 'body') + K.cyl(X, Y, 55, 4.6, 2, 'paper', 'body') + K.cyl(X, Y, 57, 2.6, 3, 'paper', 'body');
  s += K.box(X - 3, Y - 3, 60, 6, 6, 6, 'paper', 'body', 'tint') + K.on(K.FRONT(X - 3, Y + 3, 66), '<circle class="f paper" cx="3" cy="3" r="2.2"/><line class="det" x1="3" y1="3" x2="4.4" y2="1.8"/>');
  s += K.prism(bar(X, Y, .1, -2, 16, 3), 63.4, 1.6, 'paper', 'body', 'tint') + K.prism(bar(X, Y, -.12, -2, 14, 3), 67, 1.6, 'paper', 'body', 'tint');
  s += K.on(K.SIDE(X + 3, Y + 1.4, 65), ann(1.8, 1.1, 'f paper'));
  s += rope(K, [[X + 3, Y, 62], [X + 9, Y + 4, 58], [X + 9.6, Y + 6, 44], [X + 9.2, Y + 6.6, 26]], 2.4, 'f tint') + K.cyl(X + 9.2, Y + 6.6, 20, 1.6, 6, 'paper', 'body') + K.box(X + 7, Y + 6, 40, 4, 2, 3, 'paper', 'body', 'tint');
  s += K.line([[X, Y + 3, 58], [X + 2, Y + 11, 50]], 'det');
  s += lit(K.on(planeAt(K, [X - 1, Y + 14, 50], [.7, -.7, 0], [0, 0, -1]), '<rect class="f body" x="0" y="0" width="7" height="11" rx=".6"/><circle class="f paper" cx="3.5" cy="1.8" r=".9"/><path class="det" d="M1.4 4.4H5.6M1.4 6.4H5.6M1.4 8.4H4"/>'));
  return s;
});

// ── 08 Magnifier: check who your ads actually reach. A lens on a jointed arm over a tray of tokens (live lens).
const MA = kernel([[0, 0, 0], [72, 0, 0], [0, 50, 0], [72, 50, 0], [12, 8, 54]], 12);
const magnifier = icon(MA, 'A magnifying lens on a jointed arm clamped to the plate, held low over a tray of tokens.', () => {
  const K = MA, LX = 44, LY = 32, LZ = 26;
  let s = plate(K, 0, 0, 72, 50) + K.box(24, 20, 4, 44, 26, 3, 'paper', 'body', 'tint');
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const x = 30 + i * 10, y = 25 + j * 8; if (Math.hypot(x - LX, y - LY) > 8) s += K.cyl(x, y, 7, 2.8, 1.2, 'paper', 'tint') + K.on(K.TOP(x, y, 8.2), '<circle class="det" r="1.6"/>'); }
  s += K.box(6, 4, 4, 12, 10, 6, 'paper', 'body', 'tint') + K.cyl(12, 9, 10, 1.8, 28, 'paper', 'body') + K.cyl(12, 9, 38, 2.8, 3, 'paper', 'body');
  s += rope(K, [[12, 9, 40], [28, 16, 50]], 2.4, 'f paper') + K.cyl(28, 16, 48, 2.6, 3.4, 'paper', 'body') + rope(K, [[28, 16, 50], [37, 26, LZ + 2]], 2.4, 'f paper');
  s += K.cyl(LX, LY, LZ, 9, 2, 'paper', 'body') + K.on(K.TOP(LX, LY, LZ + 2), ann(9, 7.4, 'f paper'));
  s += lit(K.on(K.TOP(LX, LY, LZ + 2), '<circle class="f body" r="7.4" style="opacity:.5"/><circle class="det" r="4.6"/><circle class="det" r="2.6"/>'));
  return s;
});

// ── 09 Water tower: warm only once it can serve. A tank on legs, the float gauge above the mark (live), outlet open.
const WT = kernel([[0, 0, 0], [56, 0, 0], [0, 48, 0], [56, 48, 0], [26, 22, 74]], 12);
const watertower = icon(WT, 'A water tower on four braced legs, the float gauge on its side above the fill mark and the outlet valve open below.', () => {
  const K = WT, X = 26, Y = 22, R = 13, Z = 32, H = 22;
  let s = plate(K, 0, 0, 56, 48);
  const leg = (x: number, y: number) => K.box(x - 1.6, y - 1.6, 4, 3.2, 3.2, Z - 4, 'paper', 'body', 'tint');
  s += leg(X - 9, Y - 9) + leg(X + 9, Y - 9) + leg(X - 9, Y + 9);
  s += K.line([[X - 9, Y + 9, 8], [X + 9, Y + 9, 28]], 'det') + K.line([[X + 9, Y - 9, 8], [X + 9, Y + 9, 28]], 'det') + K.line([[X - 9, Y + 9, 28], [X + 9, Y + 9, 8]], 'det') + K.line([[X + 9, Y - 9, 28], [X + 9, Y + 9, 8]], 'det');
  s += rope(K, [[X, Y, Z], [X, Y, 10], [X, Y + 2, 8], [X, Y + 20, 8]], 2.6, 'f paper') + leg(X + 9, Y + 9);
  s += K.box(X - 3, Y + 15, 5, 6, 4, 6, 'paper', 'body', 'tint') + K.prism(bar(X, Y + 17, Math.PI / 2, -1, 6, 1.6), 11, 1.2, 'paper', 'body', 'tint');
  s += K.cyl(X, Y, Z - 2, R + 1, 2, 'paper', 'body') + K.cyl(X, Y, Z, R, H, 'paper', 'tint') + [7, 15].map((dz) => K.line(K.ring(X, Y, Z + dz, R, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det')).join('');
  s += K.cyl(X, Y, Z + H, R + 1, 1.4, 'paper', 'body') + K.cyl(X, Y, Z + H + 1.4, 9, 2.6, 'paper', 'body') + K.cyl(X, Y, Z + H + 4, 4.6, 2.6, 'paper', 'body') + K.cyl(X, Y, Z + H + 6.6, 1, 3, 'paper', 'body');
  const gx = X + R * .7 + 1, gy = Y + R * .7 + 1, fc = planeAt(K, [gx - 2.8, gy + 2.8, Z + H - 2], [.7, -.7, 0], [0, 0, -1]);
  s += K.on(fc, `<rect class="f paper" x="0" y="0" width="8" height="${H - 4}"/>` + Array.from({ length: 7 }, (_, i) => `<line class="det" x1="${i % 3 ? 5 : 3.4}" y1="${2 + i * 2.6}" x2="8" y2="${2 + i * 2.6}"/>`).join('') + '<rect class="f tint" x="0" y="11" width="8" height="1.6"/>');
  s += lit(K.on(fc, '<path class="f body" d="M-1.6 5.2H4.4L6.2 6.6L4.4 8H-1.6Z"/>'));
  return s;
});

// ── 09 Sluice: warm only once it can serve. A channel whose water has passed the mark on the staff gauge; the gate is wound
// up and the water runs (live).
const SL = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [38, 6, 52]], 12);
const sluice = icon(SL, 'A channel with a staff gauge and a sluice gate: the water stands above the mark and the gate is wound up so it runs through.', () => {
  const K = SL, X = 4, Y = 12, W = 68, D = 20, T = 2.4, H = 14, WZ = 13, GX = 40;
  let s = plate(K, 0, 0, 76, 44) + K.box(X, Y - T, 4, W, T, H, 'paper', 'body', 'tint') + K.box(X, Y, 4, W, D, 1, 'tint', 'body', 'tint');
  s += K.box(GX - 1.6, Y - T - 3, 4, 3.2, 3, 36, 'paper', 'body', 'tint');
  s += lit(K.poly([[X, Y, WZ], [X + W, Y, WZ], [X + W, Y + D, WZ], [X, Y + D, WZ]], 'f body') + K.poly([[X + W, Y, 5], [X + W, Y + D, 5], [X + W, Y + D, WZ], [X + W, Y, WZ]], 'f body') +
    K.on(K.TOP(GX + 4, Y, WZ), [4, 9, 14].map((v, i) => `<path class="det" d="M${2 + i * 3} ${v}q2 -1.4 4 0t4 0"/>`).join('')));
  s += K.box(X + 9, Y + 3, 5, 4, 1.2, 24, 'paper', 'body', 'paper') + K.on(K.FRONT(X + 9, Y + 4.2, 29), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="${i % 2 ? 2.4 : 1.2}" y1="${2 + i * 2.6}" x2="4" y2="${2 + i * 2.6}"/>`).join('') + `<rect class="f tint" x="0" y="${29 - WZ + 1.6}" width="4" height="1.6"/>`);
  s += K.box(GX - 1, Y, 18, 2, D, 14, 'paper', 'body', 'tint') + K.on(K.SIDE(GX + 1, Y + D, 32), '<path class="det" d="M2 3H18M2 11H18"/>' + screws([[3, 7], [17, 7]]));
  s += K.box(X, Y + D, 4, W, T, H, 'paper', 'body', 'tint') + K.box(GX - 1.6, Y + D + T, 4, 3.2, 3, 36, 'paper', 'body', 'tint');
  s += K.box(GX - 1.6, Y - T - 3, 40, 3.2, D + 2 * T + 6, 3, 'paper', 'body', 'tint') + K.cyl(GX, Y + D / 2, 32, .9, 8, 'paper', 'body') + K.cyl(GX, Y + D / 2, 43, 1.4, 3, 'paper', 'body');
  s += K.cyl(GX, Y + D / 2, 46, 6, 1.2, 'paper', 'body') + K.on(K.TOP(GX, Y + D / 2, 47.2), `<circle class="det" r="1.4"/>${spokes(5, 5)}`);
  return s;
});

// ── 10 Fuel selector: warm before cold. Three tanks piped to one selector; the handle is set to the first tank (live).
const FS = kernel([[0, 0, 0], [72, 0, 0], [0, 48, 0], [72, 48, 0], [36, 12, 42]], 12);
const selector = icon(FS, 'Three tanks piped to one selector valve; its handle points at the first tank, whose line is running.', () => {
  const K = FS, TY = 11, XS = [14, 36, 58], VX = 36, VY = 34;
  let s = plate(K, 0, 0, 72, 48);
  XS.forEach((x) => { s += K.cyl(x, TY, 4, 8.4, 1.6, 'paper', 'body') + K.cyl(x, TY, 5.6, 7.4, 26, 'paper', 'tint') + K.line(K.ring(x, TY, 14, 7.4, -Math.PI / 4, Math.PI * 3 / 4, 20), 'det') + K.cyl(x, TY, 31.6, 7.8, 1.4, 'paper', 'body') + K.cyl(x, TY, 33, 2.4, 2.4, 'paper', 'body'); });
  const pipe = (pts: V3[], live = false) => { const d = 'M' + pts.map((p) => K.P(...p).map(f).join(' ')).join('L'); return `<path class="tube-o" d="${d}"/><path class="tube-i" d="${d}"/>` + (live ? lit(`<path class="flow" d="${d}"/>`) : ''); };
  s += pipe([[58, TY + 7, 8], [58, 28, 8], [VX + 5, VY - 2, 8]]) + pipe([[36, TY + 7, 8], [VX, VY - 5, 8]]) + pipe([[14, TY + 7, 8], [14, 28, 8], [VX - 5, VY - 2, 8]], true);
  s += pipe([[VX, VY, 6], [VX, 47, 6]]);
  s += K.cyl(VX, VY, 4, 6.4, 8, 'paper', 'body') + K.on(K.TOP(VX, VY, 12), '<circle class="det" r="4.8"/>' + [Math.PI * 1.25, Math.PI * 1.5, Math.PI * 1.75].map((a) => `<circle class="f blk" cx="${f(Math.cos(a) * 5.4)}" cy="${f(Math.sin(a) * 5.4)}" r=".7"/>`).join(''));
  s += lit(K.prism(bar(VX, VY, Math.PI * 1.25, -2.4, 9, 2.6), 12, 2, 'body', 'body', 'body')) + K.cyl(VX, VY, 14, 1.8, 1.4, 'paper', 'body');
  return s;
});

// ── 10 Filler: warm before cold. A bottling line; the nozzle fills the first of three bottles (live), the others wait.
const BF = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [16, 8, 58]], 12);
const filler = icon(BF, 'A short bottling line with a filling nozzle over the first of three bottles; it is filling, the other two stand empty.', () => {
  const K = BF, Y = 24, XS = [18, 36, 54];
  let s = plate(K, 0, 0, 72, 44) + K.box(13, 6, 4, 6, 6, 52, 'paper', 'body', 'tint');
  s += K.box(4, Y - 7, 4, 64, 14, 6, 'paper', 'body', 'tint') + K.on(K.TOP(4, Y - 7, 10), Array.from({ length: 11 }, (_, i) => `<line class="det" x1="${3 + i * 6}" y1="1" x2="${3 + i * 6}" y2="13"/>`).join(''));
  const bottle = (x: number, full: boolean) => { const g = K.cyl(x, Y, 10, 5, 15, full ? 'body' : 'paper', full ? 'body' : 'tint') + K.cyl(x, Y, 25, 3.4, 2, 'paper', full ? 'body' : 'tint') + K.cyl(x, Y, 27, 1.8, 6, 'paper', full ? 'body' : 'tint'); return full ? lit(g) : g + K.line(K.ring(x, Y, 18, 5, -Math.PI / 4, Math.PI * 3 / 4, 20), 'det'); };
  s += bottle(XS[0], true);
  s += K.box(13, 6, 52, 6, Y - 3, 4, 'paper', 'body', 'tint') + K.box(14.4, Y - 4, 44, 7, 7, 8, 'paper', 'body', 'tint') + K.cyl(XS[0], Y, 40, 1.4, 4, 'paper', 'body');
  s += lit(rope(K, [[XS[0], Y, 40], [XS[0], Y, 33.6]], 1, 'f body'));
  return s + bottle(XS[1], false) + bottle(XS[2], false);
});

// ── 11 Wrench: start Lead Gen Forms early, set right. An adjustable wrench closing on a nut; the moving jaw is live.
const WR = kernel([[0, 0, 0], [76, 0, 0], [0, 50, 0], [76, 50, 0], [20, 18, 26]], 12);
const wrench = icon(WR, 'An adjustable wrench lying with its jaws closed on a hex nut on a stud, the moving jaw run up by its worm.', () => {
  const K = WR, NX = 20, NY = 18, a = .62, Z = 14, deg = f(a * 180 / Math.PI);
  const body = 'M-7 -10.6H10L16 -4H52A3 3 0 0 1 52 2H16L10 9H4V-5.4H-7Z', jaw = 'M-7 5.4H4V10.6H-5Z';
  const layer = (z: number, top: boolean) => K.on(K.TOP(NX, NY, z), `<g transform="rotate(${deg})"><path class="f ${top ? 'paper' : 'tint'}" d="${body}"/>` + (top ? '<rect class="det" x="5" y="1.4" width="4" height="6" rx="1"/><path class="det" d="M5 3.4H9M5 5.4H9"/><circle class="det" cx="48" cy="-1" r="1.6"/>' : '') + '</g>');
  const mov = lit([0, 2.4].map((dz) => K.on(K.TOP(NX, NY, Z + dz), `<g transform="rotate(${deg})"><path class="f body" d="${jaw}"/></g>`)).join(''));
  let s = plate(K, 0, 0, 76, 50) + K.box(8, 6, 4, 24, 24, 8, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 30, 12), screws([[4, 4], [20, 4]]));
  s += K.cyl(NX, NY, 12, 2.8, 8, 'paper', 'tint') + K.prism(Array.from({ length: 6 }, (_, i) => { const t = a + Math.PI / 6 + i * Math.PI / 3; return [NX + Math.cos(t) * 6, NY + Math.sin(t) * 6] as P2; }), 12.6, 4.4, 'paper', 'body', 'tint');
  s += K.cyl(NX, NY, 17, 2.8, 2.6, 'paper', 'tint') + K.line(K.ring(NX, NY, 18.4, 2.8, -Math.PI / 4, Math.PI * 3 / 4, 12), 'det');
  return s + layer(Z, false) + layer(Z + 2.4, true) + mov;
});

// ── 11 Reducer: start forms early, in a narrower pipe. A big pipe narrowing through a reducer into a small one with a valve.
const PR = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [52, 20, 42]], 12);
const reducer = icon(PR, 'A wide pipe narrowing through a cone reducer into a small pipe, a gate valve on the small side.', () => {
  const K = PR, CY = 20, CZ = 18;
  let s = plate(K, 0, 0, 76, 40) + [12, 64].map((x) => K.box(x - 4, CY - 6, 4, 8, 12, x < 30 ? 6 : 9, 'paper', 'body', 'tint')).join('');
  const flange = (x: number, r: number) => K.cylX(x, x + 2, CY, CZ, r, 'paper', 'body') + K.on(K.SIDE(x + 2, CY, CZ), Array.from({ length: 6 }, (_, i) => { const t = i * Math.PI / 3 + .3; return `<circle class="f blk" cx="${f(Math.cos(t) * (r - 1.6))}" cy="${f(Math.sin(t) * (r - 1.6))}" r=".7"/>`; }).join(''));
  s += K.cylX(2, 22, CY, CZ, 9, 'paper', 'tint') + K.line(ringX(10, CY, CZ, 9), 'det') + flange(22, 11);
  s += lit(coneX(K, 24, 36, CY, CZ, 9, 4.6, 'body', 'body'));
  s += flange(36, 6.4) + K.cylX(38, 46, CY, CZ, 4.6, 'paper', 'tint') + K.box(46, CY - 5.6, CZ - 5.6, 10, 11.2, 11.2, 'paper', 'body', 'tint') + K.cylX(56, 74, CY, CZ, 4.6, 'paper', 'tint');
  s += K.cyl(51, CY, CZ + 5.6, 3, 6, 'paper', 'body') + K.cyl(51, CY, CZ + 11.6, 1, 4, 'paper', 'body') + K.cyl(51, CY, CZ + 15.6, 5, 1.2, 'paper', 'body') + K.on(K.TOP(51, CY, CZ + 16.8), `<circle class="det" r="1.2"/>${spokes(5, 4.2)}`);
  return s;
});

// ── 12 Coin tray: report the three separately. A counting tray with two dividers (live), each bin its own stack.
const CT = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [38, 22, 22]], 12);
const cointray = icon(CT, 'A counting tray split by two dividers into three bins, a different stack of coins in each.', () => {
  const K = CT, X = 8, Y = 9, W = 60, D = 26, H = 9, T = 2, ZT = 4 + H;
  let s = plate(K, 0, 0, 76, 44) + K.poly([[X, Y, 5], [X + W, Y, 5], [X + W, Y + D, 5], [X, Y + D, 5]], 'f tint');
  s += K.poly([[X, Y + T, 5], [X + W, Y + T, 5], [X + W, Y + T, ZT], [X, Y + T, ZT]], 'f body') + K.poly([[X + T, Y, 5], [X + T, Y + D, 5], [X + T, Y + D, ZT], [X + T, Y, ZT]], 'f body');
  const stack = (x: number, n: number) => Array.from({ length: n }, (_, i) => K.cyl(x, Y + D / 2 + 1, 5 + i * 1.8, 6, 1.8, 'paper', 'tint')).join('') + K.on(K.TOP(x, Y + D / 2 + 1, 5 + n * 1.8), '<circle class="det" r="4.4"/>');
  const div = (x: number) => lit(K.box(x - .8, Y + T, 5, 1.6, D - 2 * T, H + 2, 'body', 'body', 'body'));
  s += stack(X + 11, 3) + div(X + 21) + stack(X + 31, 5) + div(X + 41) + stack(X + 51, 2);
  s += K.poly([[X, Y + D, 4], [X + W, Y + D, 4], [X + W, Y + D, ZT], [X, Y + D, ZT]], 'f tint') + K.poly([[X + W, Y, 4], [X + W, Y + D, 4], [X + W, Y + D, ZT], [X + W, Y, ZT]], 'f body');
  s += K.on(K.TOP(X, Y, ZT), `<path class="f paper" fill-rule="evenodd" d="M0 0H${W}V${D}H0ZM${T} ${T}H${W - T}V${D - T}H${T}Z"/>`);
  return s + K.on(K.FRONT(X, Y + D, ZT), [W / 6, W / 2, W * 5 / 6].map((x) => `<rect class="det" x="${x - 4}" y="3" width="8" height="3" rx=".5"/>`).join(''));
});

// ── 12 Test tubes: report the three separately. A rack of three tubes, each filled to its own level (live liquids).
const TT2 = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [36, 20, 50]], 12);
const testtubes = icon(TT2, 'A rack holding three test tubes, each filled to a different level.', () => {
  const K = TT2, Y = 20, XS = [22, 36, 50], LV = [14, 30, 22], R = 3.4, ZP = 24, ZT = 46;
  let s = plate(K, 0, 0, 72, 40) + K.box(10, 12, 4, 52, 16, 2, 'paper', 'body', 'tint') + K.box(10, 12, 6, 3, 16, ZP - 6, 'paper', 'body', 'tint');
  const tube = (x: number, lv: number, z0: number) => K.cyl(x, Y, z0, R, ZT - z0, 'paper', 'paper') + (lv > z0 ? lit(K.cyl(x, Y, z0, R - .6, lv - z0, 'body', 'body')) : '') + K.line(K.ring(x, Y, ZT - 6, R, -Math.PI / 4, Math.PI * 3 / 4, 16), 'det');
  XS.forEach((x, i) => { s += K.cyl(x, Y, 6, R, 2, 'paper', 'paper') + tube(x, LV[i], 8); });
  s += K.box(10, 12, ZP, 52, 16, 2, 'paper', 'body', 'tint') + K.on(K.TOP(10, 12, ZP + 2), XS.map((x) => `<circle class="f blk" cx="${x - 10}" cy="8" r="${R + .6}"/>`).join(''));
  XS.forEach((x, i) => { s += tube(x, LV[i], ZP + 2) + K.cyl(x, Y, ZT, R + .6, 1, 'paper', 'paper'); });
  return s + K.box(59, 12, 6, 3, 16, ZP - 6, 'paper', 'body', 'tint');
});

// ── 13 Ticket spike: a weekly ranked list for sales. Slips stacked on a desk spike, the newest on top (live).
const SP = kernel([[0, 0, 0], [56, 0, 0], [0, 44, 0], [56, 44, 0], [28, 22, 54]], 12);
const spike = icon(SP, 'A desk spike with a stack of slips pushed down on it, the newest slip on top.', () => {
  const K = SP, X = 28, Y = 22;
  let s = plate(K, 0, 0, 56, 44) + K.cyl(X, Y, 4, 11, 3, 'paper', 'body') + K.cyl(X, Y, 7, 9, 1, 'paper', 'tint');
  const slip = (i: number, n: number) => { const a = [.1, -.18, .26, -.05, .2, -.12][i], z = 8 + i * 1.6, live = i === n - 1; const g = K.prism(rot(X + (i % 2 ? 1 : -1), Y + (i % 3) - 1, 22, 15, a), z, .6, live ? 'body' : 'paper', 'body', live ? 'body' : 'tint') + K.on(K.TOP(0, 0, z + .6), [-4, -1, 2].map((d) => { const [p, q] = [rot(X, Y + d, 14, 0, a)[0], rot(X, Y + d, 14, 0, a)[1]]; return `<path class="det" d="M${p.map(f).join(' ')}L${q.map(f).join(' ')}"/>`; }).join('')); return live ? lit(g) : g; };
  for (let i = 0; i < 6; i++) s += slip(i, 6);
  return s + K.cyl(X, Y, 17.6, .9, 22, 'paper', 'body') + K.poly([[X - .9, Y, 39.6], [X + .9, Y, 39.6], [X, Y, 43]], 'f paper');
});

// ── 13 Key cutter: ranked and checked. A key duplicator: the tracer reads the original, the wheel cuts the copy (live).
const KD = kernel([[0, 0, 0], [72, 0, 0], [0, 48, 0], [72, 48, 0], [36, 4, 40]], 12);
const keycutter = icon(KD, 'A key duplicator: two keys clamped side by side, a tracer on the original and a cutting wheel on the copy.', () => {
  const K = KD, Z = 24, keyp = 'M0 0L3 0L3.8 2L2.8 3.4L3.8 5L2.8 6.6L3.8 8L2.8 9.6L3.6 11L3 12.4L3 14H0Z', bow = 'M-2 14H6V22H-2Z';
  let s = plate(K, 0, 0, 72, 48) + K.box(8, 2, 4, 56, 7, 32, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 9, 36), '<rect class="det" x="4" y="4" width="48" height="6" rx=".6"/>');
  const key = (x: number, live: boolean) => { const g = [0, 1].map((i) => K.on(K.TOP(x, 10, Z + i * .9), `<path class="f ${live ? 'body' : i ? 'paper' : 'tint'}" d="${keyp}"/>`)).join(''); return live ? lit(g) : g; };
  s += K.box(18, 9, 32, 6, 4, 3, 'paper', 'body', 'tint') + K.cyl(21.6, 11.4, Z + 1.8, .8, 6.2, 'paper', 'body');
  s += K.box(42, 6, 33, 10, 6, 3, 'paper', 'body', 'tint') + K.cylX(47, 49, 10, Z + 7.4, 6, 'paper', 'body') + K.on(K.SIDE(49, 10, Z + 7.4), Array.from({ length: 16 }, (_, i) => { const t = i * Math.PI / 8; return `<line class="det" x1="${f(Math.cos(t) * 4.6)}" y1="${f(Math.sin(t) * 4.6)}" x2="${f(Math.cos(t) * 6)}" y2="${f(Math.sin(t) * 6)}"/>`; }).join('') + '<circle class="f paper" r="1.4"/>');
  s += K.box(8, 12, 4, 56, 30, 14, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 42, 18), screws([[4, 4], [52, 4]]) + '<rect class="det" x="20" y="3" width="16" height="6" rx=".6"/>');
  for (const x of [16, 40]) s += K.box(x, 22, 18, 14, 10, 6, 'paper', 'body', 'tint') + K.cylY(32, 36, x + 7, 21, 1.4, 'paper', 'body') + K.cylY(36, 37.4, x + 7, 21, 3, 'paper', 'body');
  s += key(19, false) + key(45, true);
  return s;
});

// ── 14 Bricks: grow the list from the same market. A stack of identical studded bricks; the next one clicks on (live).
const BK = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [34, 20, 44]], 12);
const bricks = icon(BK, 'A stack of identical studded building bricks, the next brick just above, about to click on.', () => {
  const K = BK, W = 24, D = 12, H = 8;
  const brick = (x: number, y: number, z: number, live = false) => { let g = K.box(x, y, z, W, D, H, live ? 'body' : 'paper', 'body', live ? 'body' : 'tint'); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) g += K.cyl(x + 3 + i * 6, y + 3 + j * 6, z + H, 2.1, 1.6, live ? 'body' : 'paper', 'body'); return live ? lit(g) : g; };
  let s = plate(K, 0, 0, 64, 44) + brick(8, 10, 4) + brick(32, 10, 4) + brick(20, 10, 12.6) + brick(26, 24, 4);
  return s + brick(14, 10, 24, true) + K.line([[14, 22, 22.2], [14, 22, 23]], 'det') + K.line([[38, 22, 22.2], [38, 22, 23]], 'det');
});

// ── 14 Coupling: grow from the same market. A wagon on a track with an identical new one coupling on (live).
const TC = kernel([[0, 0, 0], [80, 0, 0], [0, 44, 0], [80, 44, 0], [40, 20, 34]], 12);
const coupling = icon(TC, 'Two identical wagons on a short track, the new one just coupling on to the first.', () => {
  const K = TC, Y = 12, D = 18;
  let s = plate(K, 0, 0, 80, 44);
  for (let x = 6; x <= 74; x += 6) s += K.box(x - 1.2, Y - 4, 4, 2.4, D + 8, 1.6, 'paper', 'body', 'tint');
  s += [Y + 2, Y + D - 2].map((y) => rope(K, [[3, y, 6], [77, y, 6]], 1.4, 'f paper')).join('');
  const wagon = (x: number, live = false) => {
    let g = K.box(x, Y, 9, 30, D, 2, 'paper', 'body', 'tint') + K.box(x + 1, Y, 11, 28, D, 13, live ? 'body' : 'tint', 'body', live ? 'body' : 'paper');
    g += K.on(K.FRONT(x + 1, Y + D, 24), [7, 14, 21].map((u) => `<line class="det" x1="${u}" y1="1" x2="${u}" y2="12"/>`).join('') + '<line class="det" x1="0" y1="2" x2="28" y2="2"/>');
    g += K.on(K.TOP(x + 1, Y, 24), `<rect class="det" x="1.4" y="1.4" width="25.2" height="${D - 2.8}"/>`);
    g += [x + 7, x + 23].map((u) => K.on(K.FRONT(u, Y + D, 8), '<circle class="f paper" r="4"/><circle class="det" r="2.6"/><circle class="f blk" r=".9"/>')).join('');
    return live ? lit(g) : g;
  };
  s += K.cylX(4, 6, Y + D / 2, 15, 1.4, 'paper', 'body') + wagon(6) + K.cylX(36, 39, Y + D / 2, 15, 1, 'paper', 'body') + K.box(38.6, Y + D / 2 - 1.4, 14, 2, 2.8, 2, 'paper', 'body', 'tint');
  return s + wagon(41, true);
});

// ── 15 3D printer: judge cold ads by what they build. A printer frame, the head laying down a part layer by layer (live).
const P3 = kernel([[0, 0, 0], [60, 0, 0], [0, 50, 0], [60, 50, 0], [6, 6, 66], [52, 44, 66]], 12);
const printer = icon(P3, 'An open-frame 3D printer, its head laying down the top layer of a part on the bed.', () => {
  const K = P3, X0 = 8, Y0 = 8, X1 = 50, Y1 = 42, ZT = 62, PX = 20, PY = 18, PW = 18, PD = 14, PH = 14, BZ = 14;
  const post = (x: number, y: number) => K.box(x - 1.6, y - 1.6, 4, 3.2, 3.2, ZT - 4, 'paper', 'body', 'tint');
  let s = plate(K, 0, 0, 60, 50) + post(X0, Y0) + K.cyl(29, Y0 + 2, 4, 1, ZT - 6, 'paper', 'body');
  s += K.box(X0 + 4, Y0 + 4, BZ - 2, X1 - X0 - 8, Y1 - Y0 - 8, 2, 'paper', 'body', 'tint');
  s += lit(K.box(PX, PY, BZ, PW, PD, PH, 'body', 'body', 'body') + K.on(K.FRONT(PX, PY + PD, BZ + PH), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="0" y1="${2 + i * 2.2}" x2="${PW}" y2="${2 + i * 2.2}"/>`).join('')) + K.on(K.SIDE(PX + PW, PY + PD, BZ + PH), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="0" y1="${2 + i * 2.2}" x2="${PD}" y2="${2 + i * 2.2}"/>`).join('')));
  const HZ = BZ + PH + 5;
  s += K.cylX(X0, X1, 23, HZ + 2, .9, 'paper', 'body') + K.cylX(X0, X1, 29, HZ + 2, .9, 'paper', 'body');
  s += K.box(30, 21, HZ - 1, 9, 10, 8, 'paper', 'body', 'tint') + K.cyl(34.5, 26, HZ - 3, 1.6, 2, 'paper', 'body') + K.poly([[33.5, 26, HZ - 3], [35.5, 26, HZ - 3], [34.5, 26, HZ - 4.6]], 'f body');
  s += rope(K, [[34.5, 24, HZ + 7], [32, 18, ZT - 4], [30, 12, ZT]], 1.2, 'f paper');
  s += post(X0, Y1) + post(X1, Y0) + post(X1, Y1);
  s += K.box(X0 - 1.6, Y0 - 1.6, ZT, X1 - X0 + 3.2, 3.2, 3, 'paper', 'body', 'tint') + K.box(X0 - 1.6, Y0 - 1.6, ZT, 3.2, Y1 - Y0 + 3.2, 3, 'paper', 'body', 'tint') + K.box(X1 - 1.6, Y0 - 1.6, ZT, 3.2, Y1 - Y0 + 3.2, 3, 'paper', 'body', 'tint') + K.box(X0 - 1.6, Y1 - 1.6, ZT, X1 - X0 + 3.2, 3.2, 3, 'paper', 'body', 'tint');
  return s;
});

// ── 15 Spool winder: judge cold ads by the warm audience they build. Thread runs off a cone through a guide onto a reel
// that is filling up (live).
const SW = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [16, 20, 46], [52, 22, 36]], 12);
const winder = icon(SW, 'A winder: thread runs off a cone through a guide and onto a reel that is filling up, a crank on the reel.', () => {
  const K = SW, RX = 52, CZ = 22;
  let s = plate(K, 0, 0, 72, 40) + K.box(6, 8, 4, 60, 26, 3, 'paper', 'body', 'tint');
  s += K.cyl(16, 20, 7, 1.2, 4, 'paper', 'body') + [[8, 'tint'], [7, 'paper'], [6, 'tint'], [5, 'paper'], [4, 'tint'], [3, 'paper']].map(([r, c], i) => K.cyl(16, 20, 8 + i * 4, r as number, 4, c as string, c as string)).join('') + K.cyl(16, 20, 32, 1, 3, 'paper', 'body');
  s += K.box(32, 12, 7, 3, 3, 30, 'paper', 'body', 'tint') + K.box(32, 12, 37, 3, 8, 2, 'paper', 'body', 'tint') + K.on(K.FRONT(33.5, 20, 38), ann(1.6, .8, 'f paper'));
  s += K.line([[16, 20, 35], [33.5, 18, 38]], 'det') + K.box(RX - 2, 9, 7, 4, 3, CZ - 5, 'paper', 'body', 'tint') + K.cylY(10, 12, RX, CZ, 1.4, 'paper', 'body');
  s += K.cylY(12, 14, RX, CZ, 12, 'paper', 'body') + lit(K.cylY(14, 26, RX, CZ, 9, 'body', 'body') + [16.4, 19, 21.6, 24.2].map((y) => K.line(ringY(RX, y, CZ, 9), 'det')).join(''));
  s += K.line([[33.5, 18, 38], [RX - 2, 20, CZ + 9]], 'det');
  s += K.cylY(26, 28, RX, CZ, 12, 'paper', 'body') + K.on(K.FRONT(RX, 28, CZ), '<circle class="det" r="3"/>' + Array.from({ length: 5 }, (_, i) => { const t = i * Math.PI * 2 / 5; return `<circle class="f blk" cx="${f(Math.cos(t) * 7.4)}" cy="${f(Math.sin(t) * 7.4)}" r="1.6"/>`; }).join(''));
  s += K.box(RX - 2, 28, 7, 4, 3, CZ - 5, 'paper', 'body', 'tint') + K.cylY(28, 32, RX, CZ, 1.2, 'paper', 'body') + K.on(planeAt(K, [RX, 32, CZ], [1, 0, 0], [0, 0, -1]), '<path class="f paper" d="M-1.4 0V-12H1.4V0Z"/><circle class="f paper" cy="-12" r="2.4"/>');
  return s;
});

export const ALT_RULES = { padlock, binoculars, manifold, gearlever, lockbox, press2, lighthouse, mast, points, chute, gyroscope, plumb, fusebox, cutters, extinguisher, magnifier, watertower, sluice, selector, filler, wrench, reducer, cointray, testtubes, spike, keycutter, bricks, coupling, printer, winder };
