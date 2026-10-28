// Alternative rule icons, batch 1 (rules 01–08): two new objects per rule, in the style of icons-rules.ts. One object on
// a plate, its telling details, one live part.
import { kernel, f, type V3 } from '../iso';
import { prism, bar, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from '../icons';
import type { Alt } from './index';

const ball = (K: K, x: number, y: number, z: number, r: number, cls = 'f tint') => { const [px, py] = K.P(x, y, z); return `<circle class="${cls}" cx="${f(px)}" cy="${f(py)}" r="${r}"/><path class="det" d="M${f(px - r * .62)} ${f(py - r * .1)}A${r * .7} ${r * .7} 0 0 1 ${f(px + r * .1)} ${f(py - r * .62)}"/>`; };
const pathOf = (q: number[][], cls: string) => `<path class="${cls}" d="M${q.map((p) => p.map(f).join(' ')).join('L')}Z"/>`;
// Outline of a set of 3D points (convex hull in screen space): the wall of a cone, a frustum, a horn
function hull(K: K, pts: V3[], cls: string) {
  const q = pts.map((p) => K.P(...p)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (ps: number[][]) => { const h: number[][] = []; for (const p of ps) { while (h.length > 1 && cr(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop(); h.push(p); } return h.slice(0, -1); };
  return pathOf([...half(q), ...half([...q].reverse())], cls);
}
// A frustum standing upright, r0 at z0 to r1 at z1, with its top
const cone = (K: K, x: number, y: number, z0: number, r0: number, z1: number, r1: number, side = 'f tint', top = 'f paper') =>
  hull(K, [...K.ring(x, y, z0, r0), ...(r1 > 0 ? K.ring(x, y, z1, r1) : [[x, y, z1] as V3])], side) + (r1 > 0 ? K.poly(K.ring(x, y, z1, r1), top) : '');

// ── Pegboard: read frequency and penetration together. Rings stacked high on two pegs, most pegs bare: how many pegs and
// how high, read at once; the two tall stacks are live.
const PB = kernel([[0, 0, 0], [76, 0, 0], [0, 52, 0], [76, 52, 0], [38, 26, 26]], 12);
const pegs = icon(PB, 'A board of pegs; rings are stacked high on two pegs, one ring on a few, the rest bare.', () => {
  const K = PB, N = [[0, 1, 0, 0, 0], [0, 6, 0, 1, 0], [1, 0, 0, 7, 0]], H = 15, RH = 1.8;
  let s = plate(K, 0, 0, 76, 52) + K.box(6, 6, 4, 64, 40, 4, 'paper', 'body', 'tint') + K.on(K.TOP(6, 6, 8), '<rect class="det" x="2" y="2" width="60" height="36"/>');
  const all = N.flatMap((row, j) => row.map((n, i) => ({ x: 14 + 12 * i, y: 14 + 12 * j, n }))).sort((a, b) => a.x + a.y - b.x - b.y);
  for (const { x, y, n } of all) {
    const rings = Array.from({ length: n }, (_, r) => K.cyl(x, y, 8 + r * RH, 3.8, RH, 'paper', 'tint')).join('') + (n ? K.on(K.TOP(x, y, 8 + n * RH), '<circle class="det" r="2.2"/>') : '');
    s += n > 4 ? lit(rings) : rings;
    s += K.cyl(x, y, 8 + n * RH, 1.1, H - n * RH, 'paper', 'body');
  }
  return s;
});

// ── Weather mast: read frequency and penetration together. A cup anemometer and a wind vane on one crossarm: speed means
// little without direction; the vane is live.
const WM = kernel([[0, 0, 0], [60, 0, 0], [0, 40, 0], [60, 40, 0], [30, 20, 80], [8, 18, 72], [56, 22, 72]], 12);
const mast = icon(WM, 'A weather mast with a cup anemometer on one end of its crossarm and a wind vane on the other.', () => {
  const K = WM, MX = 30, MY = 20, ZA = 60;
  let s = plate(K, 0, 0, 60, 40) + K.box(22, 12, 4, 16, 16, 3, 'paper', 'body', 'tint') + K.cyl(MX, MY, 7, 4, 2, 'paper', 'body') + [0, 1, 2, 3].map((q) => { const a = q * Math.PI / 2 + Math.PI / 4; return dot(K, MX + Math.cos(a) * 5.6, MY + Math.sin(a) * 5.6, 7, .8); }).join('');
  s += K.cyl(MX, MY, 9, 1.8, ZA - 9, 'paper', 'body') + [24, 42].map((z) => K.cyl(MX, MY, z, 2.4, 1.6, 'paper', 'tint')).join('');
  s += K.box(12, MY - 1, ZA, 36, 2, 2, 'paper', 'body', 'tint') + K.cyl(MX, MY, ZA - 1, 2.6, 4, 'paper', 'tint');
  // Anemometer: spindle, hub, three arms with cups; arms behind the hub first
  const AX = 14, cups = [0, 1, 2].map((q) => .4 + q * Math.PI * 2 / 3);
  const arm = (a: number) => prism(K, bar(AX, MY, a, 2, 9.5, 1), ZA + 8.4, 1, 'paper', 'body') + K.cyl(AX + Math.cos(a) * 10.5, MY + Math.sin(a) * 10.5, ZA + 7.4, 2.6, 3, 'blk', 'body');
  s += K.cyl(AX, MY, ZA + 2, .8, 6, 'paper', 'body') + cups.filter((a) => Math.cos(a) + Math.sin(a) < 0).map(arm).join('') + K.cyl(AX, MY, ZA + 7.6, 2.2, 2.6, 'paper', 'body') + cups.filter((a) => Math.cos(a) + Math.sin(a) >= 0).map(arm).join('');
  // Vane: spindle, the compass cross under it, the arrow with its tail fin on top
  const VX = 46, a = Math.PI * .12, c = Math.cos(a), sn = Math.sin(a), VZ = ZA + 13;
  s += K.cyl(VX, MY, ZA + 2, .8, 11, 'paper', 'body') + [0, 1, 2, 3].map((q) => prism(K, bar(VX, MY, q * Math.PI / 2, 0, 6, .8), ZA + 6, .8, 'paper', 'body')).join('');
  s += lit(prism(K, bar(VX, MY, a, -11, 7, 1.2), VZ - .6, 1.2, 'body', 'body') + prism(K, [[VX + c * 12, MY + sn * 12], [VX + c * 7 - sn * 2.6, MY + sn * 7 + c * 2.6], [VX + c * 7 + sn * 2.6, MY + sn * 7 - c * 2.6]], VZ - .6, 1.2, 'body', 'body') +
    K.on(planeAt(K, [VX - c * 11, MY - sn * 11, VZ], [c, sn, 0], [0, 0, -1]), '<path class="f body" d="M0 -5L7 -1.4L7 1.4L0 3Z"/>'));
  return s + K.cyl(VX, MY, VZ + .6, 1.2, 1.2, 'paper', 'body');
});

// ── Watering can and dropper: separate frequency targets for cold and warm. The can's rose wets a wide patch once, the
// dropper hits one spot over and over; the drop and its rings are live.
const WC = kernel([[0, 0, 0], [92, 0, 0], [0, 48, 0], [92, 48, 0], [18, 20, 36], [74, 23, 50]], 12);
const dropper = icon(WC, 'A watering can sprinkling a wide wet patch, beside a dropper on a stand dripping onto one spot.', () => {
  const K = WC, CX = 18, CY = 20, RX = 43, RZ = 26;
  let s = plate(K, 0, 0, 92, 48) + K.on(K.TOP(54, 22, 4), '<circle class="f tint" r="11"/><circle class="det" r="7"/>');
  // Can: body with bands, filler hole, handle, spout up to the rose
  s += K.cyl(CX, CY, 4, 10, 20, 'paper', 'tint') + K.line(K.ring(CX, CY, 8, 10, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det') + K.on(K.TOP(CX, CY, 24), '<circle class="f body" cx="-3" cy="-3" r="3.6"/><circle class="det" cx="-3" cy="-3" r="4.6"/>');
  s += rope(K, [[CX - 9, CY, 20], [CX - 9, CY, 30], [CX - 2, CY, 34], [CX + 5, CY, 30], [CX + 7, CY, 24]], 2, 'f paper');
  s += rope(K, [[CX + 7, CY + 6, 9], [CX + 15, CY + 4, 17], [RX - 2, 22, RZ]], 2.6, 'f paper') + K.cylX(RX - 2, RX + 1, 22, RZ, 3.8, 'paper', 'body');
  s += K.on(K.SIDE(RX + 1, 22, RZ), [[0, 0], [1.6, 1], [-1.6, 1], [1.6, -1], [-1.6, -1], [0, 2], [0, -2]].map(([x, y]) => `<circle class="f blk" cx="${x}" cy="${y}" r=".4"/>`).join(''));
  s += [-1.2, -.6, 0, .6, 1.2].map((q) => K.line([[RX + 1.6, 22 + q * 1.6, RZ - 1], [54 + Math.cos(q) * 9, 22 + Math.sin(q) * 9, 7]], 'det dashed')).join('');
  // Dropper: stand, rod, clamp arm, glass tube with its bulb; the drop falls on one spot
  const DX = 74, DY = 26;
  s += K.box(62, 20, 4, 18, 18, 2.4, 'paper', 'body', 'tint') + K.cyl(65, 23, 6.4, 1.1, 40, 'paper', 'body');
  s += K.box(65, DY - .6, 38, DX - 64, 1.2, 2.6, 'paper', 'body', 'tint') + cone(K, DX, DY, 11, .5, 14, 1.2, 'f paper') + K.cyl(DX, DY, 14, 1.2, 26, 'paper', 'paper') + K.cyl(DX, DY, 36, 1.8, 2.6, 'paper', 'body');
  s += K.cyl(DX, DY, 40, 2.6, 5, 'paper', 'tint') + K.cyl(DX, DY, 45, 1.6, 1.4, 'paper', 'tint');
  s += lit(K.on(K.TOP(DX, DY, 6.4), '<circle class="det" r="1.6"/><circle class="det" r="3.2"/><circle class="det" r="4.8"/>') + ball(K, DX, DY, 8.6, 1.3, 'f body'));
  return s;
});

// ── Hot plate: separate frequency targets for cold and warm. Two burners, a wide one and a small one, each with its own
// knob turned to its own setting; the knobs are live.
const HP = kernel([[0, 0, 0], [80, 0, 0], [0, 48, 0], [80, 48, 0], [40, 24, 20]], 12);
const hotplate = icon(HP, 'A two-burner hot plate, a wide burner and a small one, their two knobs turned to different settings.', () => {
  const K = HP, X = 8, Y = 6, W = 64, D = 34, Z = 6, H = 10, ZT = Z + H;
  let s = plate(K, 0, 0, 80, 48) + [[X + 3, Y + 3], [X + W - 7, Y + 3], [X + 3, Y + D - 7], [X + W - 7, Y + D - 7]].map(([x, y]) => K.box(x, y, 4, 4, 4, 2, 'paper', 'body')).join('');
  s += K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint') + K.on(K.TOP(X, Y, ZT), `<rect class="det" x="2" y="2" width="${W - 4}" height="${D - 4}" rx=".8"/>`);
  s += K.on(K.SIDE(X + W, Y + D, ZT), Array.from({ length: 5 }, (_, i) => `<line class="det" x1="${8 + i * 4}" y1="3" x2="${8 + i * 4}" y2="${H - 3}"/>`).join(''));
  const burner = (x: number, y: number, r: number, turns: number) => K.cyl(x, y, ZT, r, 1.4, 'paper', 'body') + K.on(K.TOP(x, y, ZT + 1.4), `<circle class="f tint" r="${r - 1.2}"/>` + Array.from({ length: turns }, (_, i) => `<circle class="det" r="${f((r - 2.2) * (i + 1) / turns)}"/>`).join('') + '<circle class="f body" r="1"/>');
  s += burner(28, 21, 12, 4) + burner(57, 19, 7, 2);
  // Front: a scale of ticks round each knob, the knobs at two settings
  const fr = K.FRONT(X, Y + D, ZT), ticks = (cx: number) => Array.from({ length: 7 }, (_, i) => { const a = -Math.PI * (.95 - i * .15); return `<line class="det" x1="${f(cx + Math.cos(a) * 4.4)}" y1="${f(5 + Math.sin(a) * 4.4)}" x2="${f(cx + Math.cos(a) * 5.4)}" y2="${f(5 + Math.sin(a) * 5.4)}"/>`; }).join('');
  s += K.on(fr, ticks(20) + ticks(49) + '<rect class="f blk" x="31" y="4" width="6" height="2" rx=".5"/>');
  const knob = (cx: number, a: number) => K.cylY(Y + D, Y + D + 2.6, X + cx, Z + H - 5, 3.4, 'paper', 'body') + K.on(K.FRONT(X + cx, Y + D + 2.6, Z + H - 5), `<line class="det" x1="0" y1="0" x2="${f(Math.cos(a) * 2.8)}" y2="${f(Math.sin(a) * 2.8)}"/><circle class="f body" cx="${f(Math.cos(a) * 2.4)}" cy="${f(Math.sin(a) * 2.4)}" r=".6"/>`);
  return s + lit(knob(20, -Math.PI * .9) + knob(49, -Math.PI * .1));
});

// ── Deposit box: call it fatigue only when both signs show. A safe-deposit box with two locks; it opens only with both
// keys in, and the two keys are live.
const DB = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [36, 20, 52]], 12);
const depositbox = icon(DB, 'A safe-deposit box with two key locks, a key in each.', () => {
  const K = DB, X = 10, Y = 8, W = 52, D = 22, Z = 6, H = 42, ZT = Z + H;
  let s = plate(K, 0, 0, 72, 44) + K.box(X - 2, Y - 2, 4, W + 4, D + 4, 2, 'paper', 'body', 'tint') + K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint');
  s += K.on(K.SIDE(X + W, Y + D, ZT), Array.from({ length: 4 }, (_, i) => `<line class="det" x1="3" y1="${8 + i * 8}" x2="${D - 3}" y2="${8 + i * 8}"/>`).join(''));
  const KZ = 22, keyx = [15, 37];
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="det" x="3" y="3" width="${W - 6}" height="${H - 6}" rx=".8"/><rect class="f tint" x="1" y="8" width="1.6" height="7"/><rect class="f tint" x="1" y="${H - 15}" width="1.6" height="7"/>` +
    `<rect class="f paper" x="${W / 2 - 7}" y="7" width="14" height="5" rx=".4"/><line class="det" x1="${W / 2 - 4}" y1="9.5" x2="${W / 2 + 4}" y2="9.5"/>` +
    keyx.map((x) => `<rect class="f paper" x="${x - 4}" y="${KZ - 6}" width="8" height="13" rx=".6"/><circle class="f blk" cx="${x}" cy="${KZ}" r="1.6"/>` + screws([[x, KZ - 4.2], [x, KZ + 5]])).join('') +
    `<rect class="f body" x="${W / 2 - 1.4}" y="${H - 14}" width="2.8" height="7" rx="1.2"/>`);
  // Keys: shank out of the lock, collar, bow lying flat (turned a quarter)
  const key = (x: number) => { const z = ZT - KZ, y0 = Y + D; return K.cylY(y0, y0 + 4, X + x, z, .8, 'body', 'body') + K.cylY(y0 + 3, y0 + 4.2, X + x, z, 1.6, 'body', 'body') +
    [[-.6, 'body'], [.6, 'tint']].map(([dx, c]) => K.on(planeAt(K, [X + x + +dx, y0 + 7.4, z], [0, -1, 0], [0, 0, -1]), `<path class="f ${c}" fill-rule="evenodd" d="M3.6 -3.6H-1.6A3.6 3.6 0 0 0 -1.6 3.6H3.6A3.6 3.6 0 0 0 3.6 -3.6ZM1 -1.2H-1.2V1.2H1Z"/>`)).join(''); };
  return s + lit(key(keyx[0]) + key(keyx[1]));
});

// ── Two-hand control: call it fatigue only when both signs show. A start console that runs only while both palm buttons
// are pressed; the two buttons are live.
const TH = kernel([[0, 0, 0], [84, 0, 0], [0, 40, 0], [84, 40, 0], [42, 20, 30]], 12);
const twohand = icon(TH, 'A two-hand start console: a long desk with a guarded palm button at each end, both pressed down.', () => {
  const K = TH, X = 6, Y = 9, W = 72, D = 22, Z = 4, H = 14, ZT = Z + H;
  let s = plate(K, 0, 0, 84, 40) + K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint') + K.box(X - 1, Y - 1, ZT, W + 2, D + 2, 1.6, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="det" x="4" y="3" width="${W - 8}" height="${H - 6}" rx=".6"/>` + screws([[7, 6], [W - 7, 6], [7, H - 6], [W - 7, H - 6]]) + `<rect class="f tint" x="${W / 2 - 9}" y="5" width="18" height="4" rx=".4"/>`);
  s += K.on(K.SIDE(X + W, Y + D, ZT), `<circle class="f paper" cx="${D / 2}" cy="${H / 2}" r="2.6"/><circle class="det" cx="${D / 2}" cy="${H / 2}" r="1.4"/>`);
  const T = ZT + 1.6, BY = Y + D / 2, XS = [X + 14, X + W - 14];
  s += K.on(K.TOP(X, Y, T), `<rect class="det" x="${W / 2 - 8}" y="${D / 2 - 4}" width="16" height="8" rx=".6"/><line class="det" x1="${W / 2 - 5}" y1="${D / 2}" x2="${W / 2 + 5}" y2="${D / 2}"/>`);
  // Each button: a guard collar with a cut-out, the mushroom head pressed down to it
  let b = '';
  for (const x of XS) {
    s += K.cyl(x, BY, T, 8, 1.4, 'paper', 'body') + K.cyl(x, BY, T + 1.4, 7, 3.4, 'paper', 'tint') + K.on(K.TOP(x, BY, T + 4.8), '<circle class="f blk" r="5.6"/>');
    b += K.cyl(x, BY, T + 2.6, 2.4, 1.6, 'body', 'body') + K.cyl(x, BY, T + 4.2, 5.2, 1.4, 'body', 'body') + K.on(K.TOP(x, BY, T + 5.6), '<circle class="det" r="3.2"/>');
  }
  return s + lit(b);
});

// ── Lighthouse: judge awareness formats on reach and CPM. Its worth is how many ships see it, not how many come in; the
// lantern is live.
const LH = kernel([[0, 0, 0], [60, 0, 0], [0, 56, 0], [60, 56, 0], [30, 28, 92]], 12);
const lighthouse = icon(LH, 'A striped lighthouse on a rock, with a gallery and a lantern room under its roof.', () => {
  const K = LH, X = 30, Y = 28, Z0 = 12, Z1 = 64, R0 = 10, R1 = 6.6, n = 5, ZG = Z1 + 1.6, ZL = ZG + 9;
  let s = plate(K, 0, 0, 60, 56) + prism(K, [[16, 16], [32, 12], [45, 19], [46, 36], [36, 45], [17, 42], [12, 30]], 4, 4, 'paper', 'body') + prism(K, [[19, 19], [38, 17], [42, 33], [30, 41], [17, 35]], 8, 4, 'paper', 'tint');
  for (let i = 0; i < n; i++) {
    const z0 = Z0 + (Z1 - Z0) * i / n, z1 = Z0 + (Z1 - Z0) * (i + 1) / n, r = (z: number) => R0 + (R1 - R0) * (z - Z0) / (Z1 - Z0);
    s += cone(K, X, Y, z0, r(z0), z1, r(z1), i % 2 ? 'f paper' : 'f tint');
  }
  // Door at the foot, two windows up the tower, on the face toward the viewer
  const face = (z: number, r: number, inner: string) => K.on(planeAt(K, [X + r * .707, Y + r * .707, z], [.707, -.707, 0], [0, 0, -1]), inner);
  s += face(Z0 + 9, R0 - .3, '<path class="f body" d="M-2.6 9V2A2.6 2.6 0 0 1 2.6 2V9Z"/>') + face(36, 8.2, '<rect class="f blk" x="-1.2" y="0" width="2.4" height="3.6" rx="1.2"/>') + face(52, 7.2, '<rect class="f blk" x="-1.2" y="0" width="2.4" height="3.6" rx="1.2"/>');
  // Gallery with its railing (back half before the lantern, front half after), the lantern, the roof and vent
  const posts = (a0: number, a1: number) => Array.from({ length: 6 }, (_, i) => { const a = a0 + (a1 - a0) * i / 5; return K.line([[X + Math.cos(a) * 9, Y + Math.sin(a) * 9, ZG], [X + Math.cos(a) * 9, Y + Math.sin(a) * 9, ZG + 4]], 'det'); }).join('') + K.line(K.ring(X, Y, ZG + 4, 9, a0, a1, 24), 'det');
  s += K.cyl(X, Y, Z1, 10, 1.6, 'paper', 'body') + posts(Math.PI * .75, Math.PI * 1.75);
  s += lit(K.cyl(X, Y, ZG, 5.4, 8, 'paper', 'paper') + [-.3, .25, .8, 1.35, 1.9].map((a) => K.line([[X + Math.cos(a) * 5.4, Y + Math.sin(a) * 5.4, ZG], [X + Math.cos(a) * 5.4, Y + Math.sin(a) * 5.4, ZG + 8]], 'det')).join(''));
  s += posts(-Math.PI * .25, Math.PI * .75) + cone(K, X, Y, ZL - 1, 6.6, ZL + 6, 0, 'f body') + ball(K, X, Y, ZL + 7.2, 1.4, 'f paper');
  return s;
});

// ── Loudspeaker pole: judge awareness formats on reach and CPM. Two horns on a pole: what counts is how far the call
// carries, not who calls back; the horns are live.
const PA = kernel([[0, 0, 0], [58, 0, 0], [0, 46, 0], [58, 46, 0], [24, 18, 80], [24, 40, 66], [46, 18, 66]], 12);
const loudspeaker = icon(PA, 'A pole with two horn loudspeakers at the top, pointing two ways.', () => {
  const K = PA, X = 24, Y = 18, ZT = 70, HZ = 64, R = 7.4;
  let s = plate(K, 0, 0, 58, 46) + K.box(X - 8, Y - 8, 4, 16, 16, 3, 'paper', 'body', 'tint') + K.cyl(X, Y, 7, 4, 2, 'paper', 'body') + [0, 1, 2, 3].map((q) => { const a = q * Math.PI / 2 + Math.PI / 4; return dot(K, X + Math.cos(a) * 5.6, Y + Math.sin(a) * 5.6, 7, .8); }).join('');
  s += K.cyl(X, Y, 9, 1.8, ZT - 9, 'paper', 'body') + K.cyl(X, Y, 30, 2.6, 6, 'paper', 'tint') + K.cyl(X, Y, ZT, 2.4, 1.4, 'paper', 'tint') + K.box(X - 1.4, Y - 1.4, HZ + 3, 2.8, 2.8, 3, 'paper', 'body');
  // Horns: driver at the throat, flared wall, the mouth facing out
  const ringY = (y: number, r: number) => Array.from({ length: 41 }, (_, i) => { const a = i * Math.PI / 20; return [X + r * Math.cos(a), y, HZ + r * Math.sin(a)] as V3; });
  const ringX = (x: number, r: number) => Array.from({ length: 41 }, (_, i) => { const a = i * Math.PI / 20; return [x, Y + r * Math.cos(a), HZ + r * Math.sin(a)] as V3; });
  const mouth = `<circle class="f paper" r="${R}"/><circle class="f blk" r="${R - 1.4}"/><circle class="det" r="2.2"/>`;
  const hx = K.cylX(X + 1, X + 5, Y, HZ, 2.6, 'paper', 'body') + hull(K, [...ringX(X + 5, 1.8), ...ringX(X + 20, R)], 'f body') + K.on(K.SIDE(X + 20, Y, HZ), mouth);
  const hy = K.cylY(Y + 1, Y + 5, X, HZ, 2.6, 'paper', 'body') + hull(K, [...ringY(Y + 5, 1.8), ...ringY(Y + 20, R)], 'f tint') + K.on(K.FRONT(X, Y + 20, HZ), mouth);
  return s + lit(hx + hy);
});

// ── Egg cup: split campaigns only when a segment outperforms. A carton of even eggs; only the one twice their size gets
// its own cup, and that egg is live.
const EG = kernel([[0, 0, 0], [84, 0, 0], [0, 40, 0], [84, 40, 0], [68, 22, 32]], 12);
const egg = (K: K, x: number, y: number, z: number, rx: number, cls = 'f paper') => { const [px, py] = K.P(x, y, z), ry = rx * 1.3; return `<ellipse class="${cls}" cx="${f(px)}" cy="${f(py - ry)}" rx="${rx}" ry="${f(ry)}"/><path class="det" d="M${f(px - rx * .6)} ${f(py - ry * 1.3)}A${rx * .7} ${f(ry * .7)} 0 0 1 ${f(px - rx * .05)} ${f(py - ry * 1.75)}"/>`; };
const eggcup = icon(EG, 'An egg carton of same-sized eggs, one cell empty; the one big egg stands in its own egg cup beside it.', () => {
  const K = EG, X = 6, Y = 8, W = 46, D = 24, ZT = 11;
  let s = plate(K, 0, 0, 84, 40) + K.box(X, Y, 4, W, D, ZT - 4, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + D, ZT), Array.from({ length: 4 }, (_, i) => `<path class="det" d="M${2 + i * 11} 1.6Q${7.5 + i * 11} 6 ${13 + i * 11} 1.6"/>`).join(''));
  const cells = Array.from({ length: 8 }, (_, n) => ({ x: X + 7 + 11 * (n % 4), y: Y + 6 + 12 * Math.floor(n / 4), full: n !== 7 })).sort((a, b) => a.x + a.y - b.x - b.y);
  for (const c of cells) s += K.on(K.TOP(c.x, c.y, ZT), `<circle class="f body" r="4.3"/>`) + (c.full ? egg(K, c.x, c.y, ZT - 1.4, 3.3) : K.on(K.TOP(c.x, c.y, ZT), '<circle class="det" r="2.4"/>'));
  // Egg cup: foot, stem, cup; the big egg in it
  const CX = 68, CY = 22;
  s += K.cyl(CX, CY, 4, 5.4, 1.4, 'paper', 'body') + K.cyl(CX, CY, 5.4, 1.8, 4, 'paper', 'body') + cone(K, CX, CY, 9.4, 3.4, 15, 5.6, 'f tint', 'f body');
  return s + lit(egg(K, CX, CY, 14, 5.2, 'f body'));
});

// ── Cable harness: split campaigns only when a segment outperforms. Thin cables stay tied in one bundle; the one cable
// three times thicker breaks out to its own clamp and socket, and it is live.
const HN = kernel([[0, 0, 0], [90, 0, 0], [0, 48, 0], [90, 48, 0], [44, 24, 16]], 12);
const harness = icon(HN, 'A cable harness: thin cables tied in one bundle, one thick cable breaking out to its own clamp and socket.', () => {
  const K = HN, Z = 7.4;
  let s = plate(K, 0, 0, 90, 48) + K.box(4, 8, 4, 10, 26, 12, 'paper', 'body', 'tint');
  s += K.on(K.SIDE(14, 34, 16), Array.from({ length: 6 }, (_, i) => `<circle class="det" cx="${21 - i * 3}" cy="${i === 0 ? 6 : 8}" r="${i === 0 ? 2.6 : .9}"/>`).join('') + screws([[3, 3], [23, 3]]));
  // Thin cables, back to front, into the bundle socket on the right
  s += [13, 15.5, 18, 20.5, 23].map((y) => rope(K, [[14, y, Z], [40, y, Z], ...K.curve([46, y, Z], [58, 15 + (y - 18) * .5, Z], [74, 15 + (y - 18) * .5, Z], 12)], 1.6, 'f tint')).join('');
  s += K.box(74, 8, 4, 10, 15, 10, 'paper', 'body', 'tint') + K.on(K.FRONT(74, 23, 14), '<rect class="det" x="2" y="2" width="6" height="4" rx=".4"/>');
  // The thick cable: along the bundle, then out to its own P-clamp and socket at the front
  const thick: V3[] = [[14, 27, Z + 1], [38, 27, Z + 1], ...K.curve([44, 27, Z + 1], [54, 27, Z + 1], [58, 36, Z + 1], 12), [70, 37, Z + 1]];
  s += lit(rope(K, thick, 5.2, 'f body'));
  // Ties round the bundle (the first takes the thick cable too), the clamp, the dedicated socket
  const tie = (x: number, y0: number, y1: number, z: number) => rope(K, [[x, y0, 4], [x, y0, z], [x, y0 + 1, z + 1], [x, y1 - 1, z + 1], [x, y1, z], [x, y1, 4]], 1.6, 'f paper');
  s += tie(26, 11.4, 30.4, 10) + tie(48, 11.4, 24.6, 8.6);
  s += K.box(60, 33, 4, 4, 9, 9, 'paper', 'body', 'tint') + dot(K, 62, 31, 4, .9) + dot(K, 62, 44, 4, .9);
  s += K.box(70, 31, 4, 12, 12, 13, 'paper', 'body', 'tint') + K.on(K.FRONT(70, 43, 17), '<rect class="det" x="2" y="2" width="8" height="5" rx=".4"/>') + K.on(K.SIDE(82, 43, 17), '<circle class="det" cx="6" cy="6" r="2"/>');
  return s;
});

// ── Ball steps: watch for budget drifting to junior roles. Steps from senior down to junior and a chute beside them: left
// alone, the balls roll down to the bottom; the balls are live.
const ST = kernel([[0, 0, 0], [88, 0, 0], [0, 48, 0], [88, 48, 0], [12, 14, 46]], 12);
const steps = icon(ST, 'Four steps from tall to low with a chute running down beside them; the balls have rolled into a tray at the bottom.', () => {
  const K = ST, Y = 6, D = 16, YC = Y + D + 1, CW = 7, x0 = 8, x1 = 64, z0 = 40, z1 = 8, zc = (x: number) => z0 + (z1 - z0) * (x - x0) / (x1 - x0);
  let s = plate(K, 0, 0, 88, 48);
  for (let i = 0; i < 4; i++) s += K.box(6 + i * 13, Y, 4, 13, D, 36 - i * 9, 'paper', 'body', 'tint') + K.on(K.FRONT(6 + i * 13, Y + D, 40 - i * 9), '<line class="det" x1="2" y1="2.4" x2="11" y2="2.4"/>');
  // Chute: legs, back rail, trough floor, a ball on its way, front rail
  for (const x of [20, 46]) s += K.box(x, YC + 2, 4, 2, 2, zc(x) - 4.4, 'paper', 'body', 'tint');
  const rail = (y: number, cls: string) => K.poly([[x0, y, zc(x0)], [x1, y, zc(x1)], [x1, y, zc(x1) + 3], [x0, y, zc(x0) + 3]], cls);
  s += rail(YC, 'f body') + K.poly([[x0, YC, zc(x0)], [x1, YC, zc(x1)], [x1, YC + CW, zc(x1)], [x0, YC + CW, zc(x0)]], 'f tint');
  const balls: string[] = [ball(K, 38, YC + CW / 2, zc(38) + 2.6, 2.6, 'f body')];
  s += lit(balls[0]) + rail(YC + CW, 'f paper') + K.poly([[x0, YC + CW, zc(x0) + 3], [x0, YC, zc(x0) + 3], [x0, YC, zc(x0)], [x0, YC + CW, zc(x0)]], 'f paper');
  // Tray at the foot: inside, the balls, then its near walls over them
  const TX = 64, TY = YC - 4, TW = 18, TD = 15, TZ = 4, TH = 6;
  s += K.poly([[TX, TY, TZ + 1], [TX + TW, TY, TZ + 1], [TX + TW, TY + TD, TZ + 1], [TX, TY + TD, TZ + 1]], 'f body') + K.poly([[TX, TY, TZ + 1], [TX + TW, TY, TZ + 1], [TX + TW, TY, TZ + TH], [TX, TY, TZ + TH]], 'f tint') + K.poly([[TX, TY, TZ + 1], [TX, TY + TD, TZ + 1], [TX, TY + TD, TZ + TH], [TX, TY, TZ + TH]], 'f tint');
  s += lit([[69, 22], [76, 21], [72, 28], [79, 28], [68, 33]].map(([x, y]) => ball(K, x, y, TZ + 3.6, 2.6, 'f body')).join(''));
  s += K.poly([[TX, TY + TD, TZ], [TX + TW, TY + TD, TZ], [TX + TW, TY + TD, TZ + TH], [TX, TY + TD, TZ + TH]], 'f paper') + K.poly([[TX + TW, TY, TZ], [TX + TW, TY + TD, TZ], [TX + TW, TY + TD, TZ + TH], [TX + TW, TY, TZ + TH]], 'f body');
  return s;
});

// ── Binnacle compass: watch for budget drifting to junior roles. The needle creeps off the lubber mark a little at a time,
// so it is checked each watch; the needle is live.
const BC = kernel([[0, 0, 0], [70, 0, 0], [0, 50, 0], [70, 50, 0], [35, 25, 48]], 12);
const binnacle = icon(BC, 'A ship\'s binnacle: a compass bowl on a pedestal between two corrector spheres, its needle off the lubber mark.', () => {
  const K = BC, X = 35, Y = 25, ZB = 34, ZC = 42;
  let s = plate(K, 0, 0, 70, 50) + K.cyl(X, Y, 4, 12, 3, 'paper', 'body') + [0, 1, 2, 3].map((q) => { const a = q * Math.PI / 2 + Math.PI / 4; return dot(K, X + Math.cos(a) * 9.6, Y + Math.sin(a) * 9.6, 7, .8); }).join('');
  s += cone(K, X, Y, 7, 8, ZB - 4, 6, 'f tint') + K.cyl(X, Y, ZB - 4, 7.4, 2, 'paper', 'body');
  const sphere = (dx: number) => K.box(X + Math.sign(dx) * 7, Y - 1, ZB - 2, Math.abs(dx) - 7, 2, 2, 'paper', 'body', 'tint') + K.cyl(X + dx, Y, ZB - 2.6, 1.6, 2.6, 'paper', 'body') + ball(K, X + dx, Y, ZB + 3.4, 4.8, 'f tint');
  s += sphere(-21);
  s += cone(K, X, Y, ZB - 2, 8, ZC, 11.6, 'f body') + K.cyl(X, Y, ZC, 12.4, 1.6, 'paper', 'body');
  const ticks = Array.from({ length: 32 }, (_, i) => { const a = i * Math.PI / 16, r0 = i % 4 ? 9.6 : 8.4; return `<line class="det" x1="${f(Math.cos(a) * r0)}" y1="${f(Math.sin(a) * r0)}" x2="${f(Math.cos(a) * 10.8)}" y2="${f(Math.sin(a) * 10.8)}"/>`; }).join('');
  const top = K.TOP(X, Y, ZC + 1.6), L = Math.PI / 4, a = L + .5, c = Math.cos(a), sn = Math.sin(a);
  s += K.on(top, `<circle class="f paper" r="11"/>${ticks}<circle class="det" r="5.4"/><path class="f blk" d="M${f(Math.cos(L) * 11.2)} ${f(Math.sin(L) * 11.2)}L${f(Math.cos(L - .12) * 13.4)} ${f(Math.sin(L - .12) * 13.4)}L${f(Math.cos(L + .12) * 13.4)} ${f(Math.sin(L + .12) * 13.4)}Z"/>`);
  s += lit(K.on(top, `<path class="f body" d="M${f(c * 8.4)} ${f(sn * 8.4)}L${f(-sn * 1.4)} ${f(c * 1.4)}L${f(-c * 8.4)} ${f(-sn * 8.4)}L${f(sn * 1.4)} ${f(-c * 1.4)}Z"/>`));
  return s + K.on(top, '<circle class="f paper" r="1.3"/>') + sphere(21);
});

// ── Pruned shrub: to exclude SDRs, exclude Sales. Cut the small twig at its own joint, not the branch carrying the fruit;
// the cut twig on the plate is live.
const PR = kernel([[0, 0, 0], [74, 0, 0], [0, 48, 0], [74, 48, 0], [26, 18, 70], [10, 18, 62]], 12);
const leaf = (K: K, x: number, y: number, z: number, deg: number, cls = 'f tint') => { const [px, py] = K.P(x, y, z); return `<g transform="translate(${f(px)} ${f(py)}) rotate(${deg})"><path class="${cls}" d="M0 0Q3 -2.2 6.4 0Q3 2.2 0 0Z"/><line class="det" x1=".6" y1="0" x2="5.4" y2="0"/></g>`; };
const pruned = icon(PR, 'A shrub in a pot with its fruiting branch kept; one thin twig is cut at its joint and lies on the plate.', () => {
  const K = PR, X = 26, Y = 18, ZS = 19;
  let s = plate(K, 0, 0, 74, 48) + cone(K, X, Y, 4, 8, ZS - 1.6, 10, 'f tint') + K.cyl(X, Y, ZS - 1.6, 10.8, 2, 'paper', 'body') + K.on(K.TOP(X, Y, ZS + .4), '<circle class="f body" r="9.6"/>');
  // Trunk, the fruiting branch up to the left, a shorter branch to the right, the stub where the twig was cut
  s += rope(K, [[X, Y, ZS], [X, Y, 32], [X - 1, Y, 38]], 3.2, 'f paper');
  s += rope(K, [[X - 1, Y, 36], [X - 7, Y, 46], [X - 14, Y, 56]], 2.2, 'f paper') + rope(K, [[X, Y, 34], [X + 6, Y, 42], [X + 9, Y, 52]], 1.8, 'f paper');
  s += rope(K, [[X, Y, 29], [X + 4, Y, 31]], 1.2, 'f paper') + (() => { const [px, py] = K.P(X + 4.4, Y, 31.2); return `<ellipse class="f tint" cx="${f(px)}" cy="${f(py)}" rx=".9" ry=".6"/>`; })();
  s += [[-14, 56, -40], [-12, 52, 200], [-8, 47, -60], [-5, 44, 170], [9, 52, -70], [7, 47, 20], [5, 41, 200], [-1, 38, -100]].map(([dx, z, d]) => leaf(K, X + dx, Y, z, d)).join('');
  s += ball(K, X - 9, Y + 1, 44, 2.6, 'f paper') + ball(K, X - 15, Y + 1, 52, 2.4, 'f paper') + ball(K, X - 4, Y + 1, 40, 2.2, 'f paper');
  // The cut twig on the plate with its two leaves
  return s + lit(rope(K, [[44, 34, 4.8], [54, 32, 4.8], [62, 30, 4.8]], 1.2, 'f body') + leaf(K, 54, 32, 4.8, -30, 'f body') + leaf(K, 60, 30.5, 4.8, 30, 'f body'));
});

// ── Tweezers and parts box: to exclude SDRs, exclude Sales. Pick out the one part you mean from its own compartment, not
// the whole section; the tweezers and the part they hold are live.
const TW = kernel([[0, 0, 0], [84, 0, 0], [0, 48, 0], [84, 48, 0], [74, 16, 52]], 12);
const tweezers = icon(TW, 'A parts box with compartments of screws, nuts and washers; tweezers lift a single screw out of one compartment.', () => {
  const K = TW, X = 6, Y = 8, W = 52, D = 32, ZT = 12, CW = 16, CD = 14;
  let s = plate(K, 0, 0, 84, 48) + K.box(X, Y, 4, W, D, ZT - 4, 'paper', 'body', 'tint');
  const cell = (i: number, j: number) => [X + 2 + i * (CW + 1), Y + 2 + j * (CD + 1)];
  const contents = [
    (x: number, y: number) => [[3, 3], [7, 5], [11, 3], [5, 9], [10, 9]].map(([a, b]) => `<circle class="f paper" cx="${x + a}" cy="${y + b}" r="1.3"/><line class="det" x1="${x + a - .8}" y1="${y + b}" x2="${x + a + .8}" y2="${y + b}"/>`).join(''),
    (x: number, y: number) => [[4, 4], [10, 4], [7, 9]].map(([a, b]) => `<path class="f paper" d="M${x + a - 2} ${y + b}L${x + a - 1} ${y + b - 1.7}H${x + a + 1}L${x + a + 2} ${y + b}L${x + a + 1} ${y + b + 1.7}H${x + a - 1}Z"/><circle class="det" cx="${x + a}" cy="${y + b}" r=".8"/>`).join(''),
    (x: number, y: number) => [[4, 4], [11, 5], [6, 10], [12, 10]].map(([a, b]) => `<circle class="f paper" cx="${x + a}" cy="${y + b}" r="2"/><circle class="det" cx="${x + a}" cy="${y + b}" r=".9"/>`).join(''),
  ];
  let top = '';
  for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) {
    const [cx, cy] = cell(i, j), lx = cx - X, ly = cy - Y;
    top += `<rect class="f body" x="${lx}" y="${ly}" width="${CW}" height="${CD}"/><path class="f tint" d="M${lx} ${ly}H${lx + CW}L${lx + CW - 2} ${ly + 2}H${lx + 2}V${ly + CD - 2}L${lx} ${ly + CD}Z"/>` + contents[(i + j) % 3](lx + 1, ly + 1.4);
  }
  s += K.on(K.TOP(X, Y, ZT), top);
  // Tweezers: two legs from the joint at the back right down to the tips, the screw held between them
  const [hx, hy] = [cell(1, 1)[0] + 8, cell(1, 1)[1] + 6], tz = 20;
  const held = K.cyl(hx, hy, tz - 5, .5, 4.2, 'body', 'body') + K.cyl(hx, hy, tz - .8, 1.4, .8, 'body', 'body');
  const legs = rope(K, [[74, 16, 50], [hx + .8, hy - .9, tz]], 1.8, 'f body') + rope(K, [[75, 18.4, 48], [hx + .8, hy + .9, tz - 1.4]], 1.8, 'f body') + K.cyl(74.6, 17.2, 47.6, 1.8, 2.4, 'body', 'body');
  return s + lit(held + legs);
});

// ── Beehive frame: check who your ads actually reach. The frame lifted out of the open hive shows who is really on the
// comb; the comb is live.
const BH = kernel([[0, 0, 0], [76, 0, 0], [0, 48, 0], [76, 48, 0], [28, 24, 76]], 12);
const beehive = icon(BH, 'An open beehive on its stand, one frame lifted out above it showing the comb, the lid set down beside it.', () => {
  const K = BH, X = 10, Y = 10, W = 34, D = 28, Z = 10, H = 24, ZT = Z + H;
  let s = plate(K, 0, 0, 76, 48) + [[X + 1, Y + 1], [X + W - 3, Y + 1], [X + 1, Y + D - 3], [X + W - 3, Y + D - 3]].map(([x, y]) => K.box(x, y, 4, 2, 2, Z - 4, 'paper', 'body')).join('');
  s += K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint') + K.on(K.FRONT(X, Y + D, ZT), `<line class="det" x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}"/><rect class="f paper" x="${W / 2 - 4}" y="${H / 4 - 1.4}" width="8" height="2.8" rx=".4"/><rect class="f blk" x="${W / 2 - 9}" y="${H - 3}" width="18" height="1.6"/>`);
  s += K.on(K.SIDE(X + W, Y + D, ZT), `<line class="det" x1="0" y1="${H / 2}" x2="${D}" y2="${H / 2}"/><rect class="f body" x="${D / 2 - 4}" y="4" width="8" height="2.4" rx=".6"/><rect class="f body" x="${D / 2 - 4}" y="${H / 2 + 4}" width="8" height="2.4" rx=".6"/>`);
  s += K.box(X + W / 2 - 10, Y + D, Z, 20, 4, 1.2, 'paper', 'body', 'tint');
  // Open top: frame top bars side by side, a gap where the lifted frame hung
  s += K.on(K.TOP(X, Y, ZT), `<rect class="f body" x="1.4" y="1.4" width="${W - 2.8}" height="${D - 2.8}"/>`) + [3, 6.2, 9.4, 15.8, 19, 22.2].map((y) => K.box(X + 1.4, Y + y, ZT - 1, W - 2.8, 1.8, 1, 'paper', 'paper', 'paper')).join('');
  // The lid on the plate
  s += K.box(52, 12, 4, 20, 26, 3, 'paper', 'body', 'tint') + K.on(K.TOP(52, 12, 7), '<rect class="det" x="2" y="2" width="16" height="22"/>');
  // The lifted frame: lugs and top bar, side bars, comb of hexagonal cells, a few bees
  const FX = X + 3, FY = Y + D / 2 - 1, FZ = 70, FW = W - 6, FH = 24;
  const hex = (cx: number, cy: number, r: number) => 'M' + Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`; }).join('L') + 'Z';
  let comb = '';
  for (let r = 0; r < 7; r++) for (let q = 0; q < 8; q++) { const cx = 3.6 + q * 3.1 + (r % 2) * 1.55, cy = 4.8 + r * 2.7; if (cx < FW - 3.2) comb += hex(cx, cy, 1.6); }
  s += K.on(K.FRONT(FX, FY, FZ), `<rect class="f paper" x="-3" y="0" width="${FW + 6}" height="2"/><rect class="f paper" x="0" y="2" width="1.6" height="${FH - 2}"/><rect class="f paper" x="${FW - 1.6}" y="2" width="1.6" height="${FH - 2}"/><rect class="f paper" x="0" y="${FH - 1.6}" width="${FW}" height="1.6"/>`);
  s += lit(K.on(K.FRONT(FX, FY, FZ), `<rect class="f body" x="1.6" y="2" width="${FW - 3.2}" height="${FH - 3.6}"/><path class="det" d="${comb}"/>`));
  s += K.on(K.FRONT(FX, FY, FZ), [[7, 9, 20], [16, 15, -30], [21, 7, 60]].map(([x, y, a]) => `<ellipse class="f blk" cx="${x}" cy="${y}" rx="1.1" ry=".6" transform="rotate(${a} ${x} ${y})"/>`).join(''));
  return s;
});

// ── Fish crate: check who your ads actually reach. Tip out the catch and look: among the fish lies a boot nobody aimed
// for; the boot is live.
const FC = kernel([[0, 0, 0], [80, 0, 0], [0, 46, 0], [80, 46, 0], [40, 22, 28]], 12);
const fishcrate = icon(FC, 'An open crate of fish with an old boot lying in the catch.', () => {
  const K = FC, X = 8, Y = 8, W = 60, D = 30, H = 14, T = 2, Z = 4, ZT = Z + H, ZF = ZT - 4;
  let s = plate(K, 0, 0, 80, 46);
  // Inside: floor, back and far end walls
  s += K.poly([[X, Y, Z], [X + W, Y, Z], [X + W, Y + D, Z], [X, Y + D, Z]], 'f tint') + K.poly([[X, Y + T, Z], [X + W, Y + T, Z], [X + W, Y + T, ZT], [X, Y + T, ZT]], 'f body') + K.poly([[X + T, Y, Z], [X + T, Y + D, Z], [X + T, Y + D, ZT], [X + T, Y, ZT]], 'f body');
  const fish = (x: number, y: number, deg: number, L = 16) => `<g transform="translate(${x} ${y}) rotate(${deg})"><path class="f paper" d="M0 0Q${L * .45} ${-L * .26} ${L * .82} 0Q${L * .45} ${L * .26} 0 0Z"/><path class="f paper" d="M${L * .8} 0L${L} ${-L * .14}L${L} ${L * .14}Z"/><circle class="f blk" cx="${f(L * .14)}" cy="-.4" r=".7"/><path class="det" d="M${f(L * .26)} ${f(-L * .12)}Q${f(L * .3)} 0 ${f(L * .26)} ${f(L * .12)}"/></g>`;
  const back = [[6, 6, 8], [22, 5, -6], [40, 7, 12], [8, 13, -10]], front = [[2, 22, -12], [44, 23, 4], [46, 14, 18], [24, 25, 0]];
  s += K.on(K.TOP(X, Y, ZF), back.map(([x, y, d]) => fish(x, y, d)).join(''));
  // The boot standing up out of the catch, drawn as two offset profiles
  const boot = 'M0 0H9V15Q12 16 16 17Q21 18.4 21 23V26H0Z', bx = X + 20, by = Y + 11, bz = Z + 26;
  s += lit(K.on(K.FRONT(bx, by, bz), `<path class="f body" d="${boot}"/>`) + K.on(K.FRONT(bx, by + 5, bz), `<path class="f tint" d="${boot}"/><path class="det" d="M0 3H9M0 23.4H21M9 6H6.4M9 9H6.4M9 12H6.4"/>`));
  s += K.on(K.TOP(X, Y, ZF), front.map(([x, y, d]) => fish(x, y, d)).join(''));
  // Near walls with slats and a hand hole, the rim
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="f paper" width="${W}" height="${H}"/><path class="det" d="M0 ${H / 3}H${W}M0 ${H * 2 / 3}H${W}"/>` + screws([[3, 2.4], [W - 3, 2.4], [3, H - 2.4], [W - 3, H - 2.4]]));
  s += K.poly([[X + W, Y, Z], [X + W, Y + D, Z], [X + W, Y + D, ZT], [X + W, Y, ZT]], 'f body') + K.on(K.SIDE(X + W, Y + D, ZT), `<rect class="f blk" x="${D / 2 - 5}" y="2.6" width="10" height="3" rx="1.5"/><path class="det" d="M0 ${H / 3 + 2}H${D}M0 ${H * 2 / 3 + 1}H${D}"/>`);
  s += K.on(K.TOP(X, Y, ZT), `<path class="f paper" fill-rule="evenodd" d="M0 0H${W}V${D}H0ZM${T} ${T}H${W - T}V${D - T}H${T}Z"/>`);
  return s;
});

export const ALTS: Record<string, Alt> = {
  'alt-clock-1': { of: 'i-clock', idea: 'Дошка з кілочками: кільця нанизані високо лише на два кілочки — видно разом і скільки охоплено, і скільки разів', piece: pegs },
  'alt-clock-2': { of: 'i-clock', idea: 'Метеощогла з чашковим анемометром і флюгером: швидкість без напрямку нічого не каже', piece: mast },
  'alt-rollerstamp-1': { of: 'i-rollerstamp', idea: 'Лійка й піпетка: лійка раз змочує широку пляму, піпетка капає в одну точку знову і знову', piece: dropper },
  'alt-rollerstamp-2': { of: 'i-rollerstamp', idea: 'Двоконфоркова плитка: широка й мала конфорки, у кожної своя ручка і своя потужність', piece: hotplate },
  'alt-bolts-1': { of: 'i-bolts', idea: 'Депозитна скринька з двома замками: відчиняється лише двома ключами разом', piece: depositbox },
  'alt-bolts-2': { of: 'i-bolts', idea: 'Пульт дворучного пуску: машина стартує лише коли натиснуто обидві кнопки', piece: twohand },
  'alt-billboard-1': { of: 'i-billboard', idea: 'Маяк: його цінність у тому, скільки кораблів його бачать, а не скільки зайшли в порт', piece: lighthouse },
  'alt-billboard-2': { of: 'i-billboard', idea: 'Гучномовці на стовпі: важить, як далеко чути, а не хто відгукнувся', piece: loudspeaker },
  'alt-wedge-1': { of: 'i-wedge', idea: 'Лоток однакових яєць і підставка: окрему підставку дістає лише яйце, вдвічі більше за решту', piece: eggcup },
  'alt-wedge-2': { of: 'i-wedge', idea: 'Джгут кабелів: власний хомут і роз\'єм дістає лише кабель, утричі товщий за решту', piece: harness },
  'alt-balance-1': { of: 'i-balance', idea: 'Сходинки й жолоб: якщо не стежити, кульки самі скочуються від старших ролей до молодших', piece: steps },
  'alt-balance-2': { of: 'i-balance', idea: 'Компас у нактоузі: стрілка сповзає з курсової риски потроху, тож його звіряють щовахти', piece: binnacle },
  'alt-drawer-1': { of: 'i-drawer', idea: 'Підрізаний кущ: зрізають тонку гілочку біля її розвилки, а не гілку з плодами', piece: pruned },
  'alt-drawer-2': { of: 'i-drawer', idea: 'Пінцет і касета з дрібницями: виймають один потрібний гвинтик, а не всю секцію', piece: tweezers },
  'alt-xray-1': { of: 'i-xray', idea: 'Рамка з вулика: витягни й подивись, хто насправді сидить на стільниках', piece: beehive },
  'alt-xray-2': { of: 'i-xray', idea: 'Ящик з уловом: серед риби лежить чобіт — видно, що насправді зачепила сітка', piece: fishcrate },
};
