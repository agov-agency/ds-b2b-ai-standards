// Rule icons, in the style of the skill icons: one object on a plate, its telling details, one live part.
import { kernel, f, type V3 } from './iso';
import { prism, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from './icons';

// A ring in a face plane (local 2D): outer and inner circle cut out, so what is behind shows through
export const ann = (r0: number, r1: number, cls = 'f body') => `<path class="${cls}" fill-rule="evenodd" d="M${r0} 0A${r0} ${r0} 0 1 1 ${-r0} 0A${r0} ${r0} 0 1 1 ${r0} 0ZM${r1} 0A${r1} ${r1} 0 1 0 ${-r1} 0A${r1} ${r1} 0 1 0 ${r1} 0Z"/>`;
export const ball = (K: K, x: number, y: number, z: number, r: number, cls = 'f tint') => { const [px, py] = K.P(x, y, z); return `<circle class="${cls}" cx="${f(px)}" cy="${f(py)}" r="${r}"/><path class="det" d="M${f(px - r * .62)} ${f(py - r * .1)}A${r * .7} ${r * .7} 0 0 1 ${f(px + r * .1)} ${f(py - r * .62)}"/>`; };

// ── Clock: read frequency and penetration together. A mantel clock; its two hands are the live part.
const CK = kernel([[0, 0, 0], [70, 0, 0], [0, 40, 0], [70, 40, 0], [35, 16, 64]], 12);
const clock = icon(CK, 'A mantel clock with a round face and two hands.', () => {
  const K = CK, X = 14, Y = 10, W = 42, D = 14, CX = 35, CZ = 31;
  let s = plate(K, 0, 0, 70, 40) + K.box(X + 2, Y + 2, 4, 6, 10, 4, 'paper', 'body', 'tint') + K.box(X + W - 8, Y + 2, 4, 6, 10, 4, 'paper', 'body', 'tint');
  s += K.box(X, Y, 8, W, D, 46, 'paper', 'body', 'tint') + K.box(X - 2, Y - 2, 54, W + 4, D + 4, 3, 'paper', 'body', 'tint');
  s += K.box(CX - 7, Y + 5, 57, 2.4, 4, 4, 'paper', 'body', 'tint') + K.box(CX + 4.6, Y + 5, 57, 2.4, 4, 4, 'paper', 'body', 'tint') + K.box(CX - 7, Y + 5, 61, 14, 4, 2.4, 'paper', 'body', 'tint');
  s += K.cylY(Y + D, Y + D + 2, CX, CZ, 18, 'paper', 'body');
  const face = K.FRONT(CX, Y + D + 2, CZ);
  s += K.on(face, `<circle class="det" r="15.6"/>` + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, r0 = i % 3 ? 13.6 : 12; return `<line class="det" x1="${f(Math.cos(a) * r0)}" y1="${f(Math.sin(a) * r0)}" x2="${f(Math.cos(a) * 15.6)}" y2="${f(Math.sin(a) * 15.6)}"/>`; }).join(''));
  const hand = (a: number, l: number, w: number) => `<path class="f body" d="M${f(-Math.sin(a) * w)} ${f(Math.cos(a) * w)}L${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}L${f(Math.sin(a) * w)} ${f(-Math.cos(a) * w)}L${f(-Math.cos(a) * 3)} ${f(-Math.sin(a) * 3)}Z"/>`;
  s += lit(K.on(face, hand(-Math.PI * .83, 9, 1.6) + hand(-Math.PI * .28, 13, 1.2))) + K.on(face, '<circle class="f paper" r="1.8"/>');
  return s;
});

// ── Roller and stamp: separate frequency targets for cold and warm. A paint roller for the broad coat, a stamp for the
// single mark (live); each has left its own print on the plate.
const RS = kernel([[0, 0, 0], [86, 0, 0], [0, 48, 0], [86, 48, 0], [70, 37, 30]], 12);
const rollerstamp = icon(RS, 'A paint roller beside a hand stamp, each next to the print it leaves: a long stripe and a single mark.', () => {
  const K = RS, RY = 14;
  let s = plate(K, 0, 0, 86, 48);
  s += K.on(K.TOP(6, 26, 4), '<rect class="f tint" width="32" height="8"/>') + K.on(K.TOP(44, 39, 4), '<rect class="f tint" width="13" height="7"/><rect class="det" x="2.4" y="2" width="8.2" height="3"/>');
  // Roller: an L of wire off its right end to the handle lying behind the stamp
  s += K.cylX(6, 36, RY, 12, 8, 'paper', 'tint') + K.line([[8, RY + 5.6, 12 - 5.6], [34, RY + 5.6, 12 - 5.6]], 'det') + K.line([[8, RY + 7.6, 12 - 2], [34, RY + 7.6, 12 - 2]], 'det');
  s += rope(K, [[36, RY, 12], [40, RY, 12], [42, RY, 9], [43, RY, 7]], 1.4, 'f paper') + K.cylX(43, 46, RY, 7, 1.8, 'paper', 'body') + K.cylX(46, 62, RY, 7, 3.2, 'paper', 'tint');
  // Stamp: rubber, mount, neck, knob
  s += lit(K.box(63, 32, 4, 14, 10, 1.6, 'body', 'body', 'body') + K.box(62, 31, 5.6, 16, 12, 5, 'paper', 'body', 'tint') + K.cyl(70, 37, 10.6, 2.4, 8, 'paper', 'body') + K.cyl(70, 37, 18.6, 5.4, 6, 'paper', 'body') + K.cyl(70, 37, 24.6, 4, 1.2, 'paper', 'tint'));
  return s;
});

// ── Two bolts: call it fatigue only when both signs show. A door held by two barrel bolts, both shot home (live).
const BO = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [36, 12, 78]], 12);
const bolts = icon(BO, 'A door with two barrel bolts, both slid home into keepers on the frame.', () => {
  const K = BO, X = 8, Y = 16, W = 48;
  let s = plate(K, 0, 0, 72, 40) + K.box(X - 2, Y - 8, 4, W + 12, 4, 68, 'paper', 'body', 'tint') + K.box(X, Y - 4, 4, W, 4, 64, 'paper', 'body', 'tint');
  s += K.box(X + W, Y - 6, 4, 6, 6, 66, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y, 68), `<rect class="det" x="5" y="7" width="${W - 10}" height="24" rx=".6"/><rect class="det" x="5" y="36" width="${W - 10}" height="24" rx=".6"/>`);
  const bolt = (z: number) => {
    let g = K.box(X + 30, Y, z - 3.4, 15, 1.2, 6.8, 'paper', 'body', 'tint') + K.on(K.FRONT(X + 30, Y + 1.2, z + 3.4), screws([[2.2, 3.4], [12.8, 3.4]]));
    g += K.box(X + W + .6, Y, z - 3, 4.4, 2.2, 6, 'paper', 'body', 'tint') + K.cylX(X + 33.6, X + 43, Y + 3.4, z, 2.4, 'paper', 'tint');
    return g + lit(K.cylX(X + 43, X + W + 3.6, Y + 3.4, z, 1.4, 'body', 'body') + K.cyl(X + 38, Y + 3.4, z + 1.4, .9, 4, 'body', 'body') + K.cyl(X + 38, Y + 3.4, z + 5.4, 1.6, 1.6, 'body', 'body'));
  };
  return s + bolt(52) + bolt(20);
});

// ── Billboard: judge awareness formats on reach and CPM. A billboard on two legs with its catwalk and lamps; the face is live.
const BB = kernel([[0, 0, 0], [82, 0, 0], [0, 36, 0], [82, 36, 0], [41, 12, 74]], 12);
const billboard = icon(BB, 'A roadside billboard on two legs, with a catwalk under the face and lamps over it.', () => {
  const K = BB, X = 6, Y = 12, W = 70, Z = 34, H = 32;
  let s = plate(K, 0, 0, 82, 36);
  s += rope(K, [[24, Y + 2, 10], [56, Y + 2, Z - 4]], 1.4, 'f paper') + rope(K, [[24, Y + 2, Z - 4], [56, Y + 2, 10]], 1.4, 'f paper');
  for (const x of [22, 58]) s += K.box(x - 5, Y - 4, 4, 10, 12, 3, 'paper', 'body', 'tint') + K.box(x - 2, Y, 7, 4, 4, Z - 7, 'paper', 'body', 'tint');
  s += K.box(X, Y, Z, W, 3, H, 'paper', 'body', 'tint');
  s += lit(K.on(K.FRONT(X, Y + 3, Z + H), `<rect class="f body" x="2.4" y="2.4" width="${W - 4.8}" height="${H - 4.8}"/>` + [1, 2, 3].map((i) => `<line class="det" x1="${f(2.4 + i * (W - 4.8) / 4)}" y1="2.4" x2="${f(2.4 + i * (W - 4.8) / 4)}" y2="${H - 2.4}"/>`).join('')));
  s += K.box(X, Y + 3, Z - 2, W, 7, 2, 'paper', 'body', 'tint');
  s += Array.from({ length: 8 }, (_, i) => K.line([[X + 2 + i * 9.4, Y + 9.6, Z], [X + 2 + i * 9.4, Y + 9.6, Z + 5]], 'det')).join('') + K.line([[X + 2, Y + 9.6, Z + 5], [X + W - 2, Y + 9.6, Z + 5]], 'det');
  for (const x of [20, 41, 62]) s += rope(K, [[x, Y + 1.5, Z + H], [x, Y + 1.5, Z + H + 3], [x, Y + 8, Z + H + 3]], 1.4, 'f paper') + K.box(x - 3, Y + 8, Z + H + 1, 6, 4, 3.4, 'paper', 'body', 'tint');
  return s;
});

// ── Wedge: split campaigns only when a segment outperforms. A concrete block with a wedge driven into its crack (live).
const WG = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [36, 22, 46]], 12);
const wedge = icon(WG, 'A concrete block split by a crack, a steel wedge driven into the crack from the top.', () => {
  const K = WG, X = 10, Y = 10, W = 52, D = 26, H = 30, ZT = 4 + H, CX = 36;
  let s = plate(K, 0, 0, 72, 44) + K.box(X, Y, 4, W, D, H, 'paper', 'body', 'tint');
  // Crack: across the top from the back edge to the front edge, then down the front face
  s += K.on(K.TOP(0, 0, ZT), `<path class="det" d="M${CX - 2} ${Y}L${CX + 1} ${Y + 4}L${CX - 1} ${Y + 7}L${CX + 1} ${Y + 19}L${CX - 1} ${Y + 22}L${CX + 1} ${Y + D}"/><path class="f blk" d="M${CX - 1.6} ${Y + 7}L${CX + 1.6} ${Y + 7}L${CX + 2.4} ${Y + 19}L${CX - .4} ${Y + 19}Z"/>`);
  s += K.on(K.FRONT(0, Y + D, ZT), `<path class="det" d="M${CX + 1} 0L${CX - 1} 6L${CX + 2} 11L${CX} 18L${CX + 3} 24L${CX + 1} ${H}"/>`);
  s += K.on(K.TOP(X, Y, ZT), '<path class="det" d="M5 4l3 1M44 20l3 -2M6 21l2 2"/>');
  // The wedge: blade down in the crack, its top a little proud of the block
  const y0 = Y + 2, y1 = Y + 24, zt = ZT + 15, hw = 3.6, cx = CX + 1;
  s += lit(K.poly([[cx, y0, ZT], [cx + hw, y0, zt], [cx + hw, y1, zt], [cx, y1, ZT]], 'f body') + K.poly([[cx - hw, y0, zt], [cx + hw, y0, zt], [cx + hw, y1, zt], [cx - hw, y1, zt]], 'f tint') +
    K.poly([[cx - hw, y1, zt], [cx + hw, y1, zt], [cx, y1, ZT]], 'f body') + K.line([[cx - hw + 1, y0 + 1, zt], [cx + hw - 1, y0 + 1, zt]], 'det'));
  return s;
});

// ── Balance: watch for budget drifting to junior roles. A divided tray held level on its fulcrum, the balls shared evenly;
// the spirit vial on its rim is live.
const TT = kernel([[0, 0, 0], [80, 0, 0], [0, 46, 0], [80, 46, 0], [40, 23, 38]], 12);
const balance = icon(TT, 'A tray with a divider resting level on a fulcrum, the same number of balls on each side, a spirit vial on its rim.', () => {
  const K = TT, X = 8, Y = 10, L = 64, D = 26, PX = X + L / 2, PZ = 20, WT = 1.6, WH = 7;
  const T = (x: number, y: number, z: number): V3 => [x, y, PZ + z];
  const q = (...ps: V3[]) => ps.map((p) => T(...p));
  let s = plate(K, 0, 0, 80, 46);
  // Fulcrum: a ridge under the middle
  s += K.poly([[PX - 7, Y + 2, 4], [PX, Y + 2, PZ - .6], [PX, Y + D - 2, PZ - .6], [PX - 7, Y + D - 2, 4]], 'f tint') + K.poly([[PX + 7, Y + 2, 4], [PX, Y + 2, PZ - .6], [PX, Y + D - 2, PZ - .6], [PX + 7, Y + D - 2, 4]], 'f body') + K.poly([[PX - 7, Y + D - 2, 4], [PX + 7, Y + D - 2, 4], [PX, Y + D - 2, PZ - .6]], 'f body');
  // Inside: floor, back wall, left wall, their rims
  s += K.poly(q([X, Y, 2], [X + L, Y, 2], [X + L, Y + D, 2], [X, Y + D, 2]), 'f tint');
  s += K.poly(q([X, Y + WT, 2], [X + L, Y + WT, 2], [X + L, Y + WT, WH], [X, Y + WT, WH]), 'f body') + K.poly(q([X + WT, Y, 2], [X + WT, Y + D, 2], [X + WT, Y + D, WH], [X + WT, Y, WH]), 'f body');
  s += K.poly(q([X, Y, WH], [X + L, Y, WH], [X + L, Y + WT, WH], [X, Y + WT, WH]), 'f paper') + K.poly(q([X, Y, WH], [X + WT, Y, WH], [X + WT, Y + D, WH], [X, Y + D, WH]), 'f paper');
  const balls = (pts: P2[]) => pts.map(([x, y]) => { const p = T(x, y, 2 + 3.2); return ball(K, p[0], p[1], p[2], 3.4, 'f paper'); }).join('');
  const side = (x0: number) => [[x0 + 6, Y + 7], [x0 + 6, Y + 19], [x0 + 15, Y + 7], [x0 + 15, Y + 19]] as P2[];
  s += balls(side(X + WT));
  // Divider, the other side's balls, then the near walls with the vial
  s += K.poly(q([PX, Y + WT, 2], [PX, Y + D - WT, 2], [PX, Y + D - WT, WH + 1], [PX, Y + WT, WH + 1]), 'f paper') + K.poly(q([PX - 1, Y + WT, WH + 1], [PX, Y + WT, WH + 1], [PX, Y + D - WT, WH + 1], [PX - 1, Y + D - WT, WH + 1]), 'f paper');
  s += balls(side(PX + 4));
  s += K.poly(q([X, Y + D, 0], [X + L, Y + D, 0], [X + L, Y + D, WH], [X, Y + D, WH]), 'f tint') + K.poly(q([X + L, Y, 0], [X + L, Y + D, 0], [X + L, Y + D, WH], [X + L, Y, WH]), 'f body');
  s += K.poly(q([X, Y + D - WT, WH], [X + L, Y + D - WT, WH], [X + L, Y + D, WH], [X, Y + D, WH]), 'f paper') + K.poly(q([X + L - WT, Y, WH], [X + L, Y, WH], [X + L, Y + D, WH], [X + L - WT, Y + D, WH]), 'f paper');
  const vial = K.FRONT(PX - 8, Y + D, PZ + WH - .8);
  s += K.on(vial, '<rect class="f paper" x="0" y="0" width="16" height="5.4" rx="1"/><rect class="f tint" x="2" y="1.2" width="12" height="3" rx="1.5"/><line class="det" x1="5.6" y1="1.2" x2="5.6" y2="4.2"/><line class="det" x1="10.4" y1="1.2" x2="10.4" y2="4.2"/>');
  s += lit(K.on(vial, '<ellipse class="f body" cx="8" cy="2.7" rx="1.9" ry="1.2"/>'));
  return s;
});

// ── Drawer: to exclude SDRs, exclude Sales. A filing cabinet with one whole drawer taken out and set aside (live).
const BN = kernel([[0, 0, 0], [72, 0, 0], [0, 48, 0], [72, 48, 0], [10, 8, 56]], 12);
const drawer = icon(BN, 'A filing cabinet with its middle drawer taken out whole and set down beside it, files still inside.', () => {
  const K = BN, X = 8, Y = 6, W = 28, D = 22, Z0 = 6, DH = 14, ZT = Z0 + 3 * DH + 2;
  let s = plate(K, 0, 0, 72, 48) + K.box(X + 1, Y + 1, 4, W - 2, D - 2, 2, 'paper', 'body', 'tint') + K.box(X, Y, Z0, W, D, ZT - Z0, 'paper', 'body', 'tint') + K.box(X - 1, Y - 1, ZT, W + 2, D + 2, 2, 'paper', 'body', 'tint');
  const front = (v: number) => `<rect class="f paper" x="2" y="${v + 1}" width="${W - 4}" height="${DH - 2}" rx=".6"/><rect class="f tint" x="${W / 2 - 4}" y="${v + 4}" width="8" height="2.2" rx="1.1"/><rect class="det" x="${W / 2 - 3}" y="${v + 8}" width="6" height="3"/>`;
  // Top and bottom drawers in place, the middle slot empty and dark inside
  s += K.on(K.FRONT(X, Y + D, ZT), front(1) + `<rect class="f body" x="2" y="${DH + 2}" width="${W - 4}" height="${DH - 2}"/><path class="f tint" d="M2 ${DH + 2}H${W - 2}L${W - 6} ${DH + 5}H6V${2 * DH - 1}L2 ${2 * DH}Z"/>` + front(2 * DH + 1));
  // The drawer on the plate: open box, file cards standing in it, its front with the handle
  const DX = 44, DY = 18, DW = W - 4, DD = 22, DZ = 4, H = DH - 2;
  const g = K.box(DX, DY, DZ, DW, DD, H, 'tint', 'body', 'body') + K.poly([[DX + 1.4, DY + 1.4, DZ + H], [DX + DW - 1.4, DY + 1.4, DZ + H], [DX + DW - 1.4, DY + DD - 1.4, DZ + H], [DX + 1.4, DY + DD - 1.4, DZ + H]], 'f body') +
    [4, 9, 14].map((y) => K.box(DX + 2.4, DY + y, DZ + H - 1, DW - 4.8, 1, 4, 'paper', 'paper', 'paper') + K.box(DX + 4 + y / 1.6, DY + y, DZ + H + 3, 5, 1, 1.6, 'paper', 'paper', 'paper')).join('') +
    K.on(K.FRONT(DX, DY + DD, DZ + H), `<rect class="f paper" x="0" y="0" width="${DW}" height="${H}"/><rect class="f tint" x="${DW / 2 - 4}" y="3" width="8" height="2.2" rx="1.1"/><rect class="det" x="${DW / 2 - 3}" y="7" width="6" height="3"/>`);
  return s + lit(g);
});

// ── X-ray frame: check who your ads actually reach. A parcel on a belt under an x-ray arch; inside it the real contents
// show (live).
const XR = kernel([[0, 0, 0], [80, 0, 0], [0, 46, 0], [80, 46, 0], [40, 8, 50], [40, 38, 50]], 12);
const xray = icon(XR, 'A parcel on a short belt passing under an x-ray arch, its contents showing through the box.', () => {
  const K = XR, Y = 14, D = 18, BZ = 10, CX = 40;
  let s = plate(K, 0, 0, 80, 46);
  const post = (y: number) => K.box(CX - 4, y, 4, 8, 4, 40, 'paper', 'body', 'tint');
  s += post(Y - 8) + K.box(4, Y, 4, 72, D, BZ - 4, 'paper', 'body', 'tint') + K.on(K.TOP(4, Y, BZ), Array.from({ length: 11 }, (_, i) => `<line class="det" x1="${4 + i * 6.4}" y1="1" x2="${4 + i * 6.4}" y2="${D - 1}"/>`).join(''));
  // The parcel as a dashed ghost, the contents inside it solid
  const PX = CX - 9, PY = Y + 3, PW = 18, PD = 12, PH = 13;
  s += lit(K.cyl(PX + 6, PY + 6, BZ, 3.4, 10, 'body', 'body') + K.box(PX + 10, PY + 3, BZ, 6, 6, 6, 'body', 'body', 'body'));
  s += K.box(PX, PY, BZ, PW, PD, PH, 'nofill dashed', 'nofill dashed', 'nofill dashed');
  s += K.line([[PX, PY, BZ + PH], [PX, PY, BZ], [PX + PW, PY, BZ]], 'det dashed') + K.line([[PX, PY, BZ], [PX, PY + PD, BZ]], 'det dashed');
  s += post(Y + D + 4) + K.box(CX - 5, Y - 9, 44, 10, D + 18, 5, 'paper', 'body', 'tint') + K.on(K.FRONT(CX - 5, Y + D + 9, 49), '<rect class="f blk" x="3" y="1.6" width="4" height="1.6"/>');
  return s;
});

// ── Spring scale: count an audience as warm only once it can serve. A spring balance on a stand, a weight on its hook;
// the pointer has reached the mark (live).
const SS = kernel([[0, 0, 0], [70, 0, 0], [0, 40, 0], [70, 40, 0], [14, 20, 70], [48, 20, 70]], 12);
const springscale = icon(SS, 'A spring balance hanging from a stand, a weight on its hook, the pointer level with a mark on the scale.', () => {
  const K = SS, Y = 20, SX = 46, ZA = 66;
  let s = plate(K, 0, 0, 70, 40) + K.box(6, Y - 8, 4, 16, 16, 4, 'paper', 'body', 'tint') + K.box(11, Y - 3, 8, 6, 6, ZA - 6, 'paper', 'body', 'tint') + K.box(11, Y - 3, ZA, SX - 8, 6, 4, 'paper', 'body', 'tint');
  s += rope(K, [[SX, Y, ZA], [SX, Y, ZA - 6]], 1.2, 'f paper') + K.cyl(SX, Y, ZA - 7, 2, 1.6, 'paper', 'body');
  // The balance: a tube with a flat scale face, ticks, the mark and the pointer
  const Z0 = 28, Z1 = ZA - 8;
  s += K.cyl(SX, Y, Z0, 4.2, Z1 - Z0, 'paper', 'tint') + K.box(SX - 3.4, Y + 3, Z0 + 2, 6.8, 1.6, Z1 - Z0 - 4, 'paper', 'body', 'paper');
  const fc = K.FRONT(SX - 3.4, Y + 4.6, Z1 - 2), L = Z1 - Z0 - 4;
  s += K.on(fc, Array.from({ length: 10 }, (_, i) => `<line class="det" x1="${i % 3 ? 4.6 : 3.4}" y1="${f(3 + i * (L - 6) / 9)}" x2="6.8" y2="${f(3 + i * (L - 6) / 9)}"/>`).join('') + `<rect class="f tint" x="0" y="${f(L * .62)}" width="6.8" height="2.4"/><line class="det" x1="1.6" y1="2" x2="1.6" y2="${L - 2}"/>`);
  s += lit(K.on(fc, `<path class="f body" d="M-1.4 ${f(L * .62 - .3)}H4L5.6 ${f(L * .62 + 1.2)}L4 ${f(L * .62 + 2.7)}H-1.4Z"/>`));
  // Hook and the weight on it
  s += rope(K, [[SX - 3, Y, 18], [SX - 2, Y, 21], [SX, Y, 22.2], [SX + 2, Y, 21], [SX + 3, Y, 18]], 1.2, 'f paper') + rope(K, [[SX, Y, Z0], [SX, Y, 23.4], [SX + 1.6, Y, 21.4], [SX + 2.8, Y, 22.6]], 1.2, 'f paper');
  s += K.box(SX - 6, Y - 5, 8, 12, 10, 10, 'paper', 'body', 'tint') + K.on(K.TOP(SX - 6, Y - 5, 18), '<rect class="det" x="2" y="2" width="8" height="6"/>');
  return s;
});

// ── Cascade: spend on warm audiences before cold. Three bowls stepping down; the top one fills and spills into the next (live).
const CS = kernel([[0, 0, 0], [86, 0, 0], [0, 40, 0], [86, 40, 0], [16, 20, 50]], 12);
const cascade = icon(CS, 'Three bowls stepping down on stands; the top one overflows into the second, the third still waits.', () => {
  const K = CS, Y = 20, R = 10, XS = [16, 42, 68], ZS = [38, 26, 14];
  let s = plate(K, 0, 0, 86, 40);
  const bowl = (i: number, full: boolean) => {
    const x = XS[i], z = ZS[i];
    let g = K.cyl(x, Y, 4, 6, 2, 'paper', 'body') + K.cyl(x, Y, 6, 1.8, z - 8, 'paper', 'body') + K.cyl(x, Y, z - 2.4, R * .55, 2.4, 'paper', 'body') + K.cyl(x, Y, z, R, 6, 'paper', 'tint');
    return g + K.on(K.TOP(x, Y, z + 6), `<circle class="${full ? 'f body' : 'f paper'}" r="${R - 1.4}"/>`);
  };
  s += bowl(0, true) + bowl(1, true) + bowl(2, false);
  const spill = (i: number) => rope(K, [[XS[i] + R * .7, Y - R * .7 + 2, ZS[i] + 6], [XS[i] + R + 2, Y - 2, ZS[i] + 4], [XS[i + 1] - 2, Y, ZS[i + 1] + 9], [XS[i + 1] - 1, Y, ZS[i + 1] + 6]], 2, 'f body');
  return s + lit(spill(0) + K.on(K.TOP(XS[0], Y, ZS[0] + 6), `<circle class="f body" r="${R - 1.4}"/>`) + spill(1));
});

// ── Aperture: start Lead Gen Forms early. A lens on its cradle, the iris blades half closed (live).
const AP = kernel([[0, 0, 0], [70, 0, 0], [0, 50, 0], [70, 50, 0], [35, 30, 56]], 12);
const aperture = icon(AP, 'A camera lens on a cradle, seen face on, its iris blades half closed.', () => {
  const K = AP, CX = 35, CZ = 30, Y0 = 6, Y1 = 30, R = 20;
  let s = plate(K, 0, 0, 70, 50) + K.box(CX - 16, Y0 + 4, 4, 32, 8, 8, 'paper', 'body', 'tint') + K.box(CX - 16, Y1 - 10, 4, 32, 8, 8, 'paper', 'body', 'tint');
  s += K.cylY(Y0, Y1 - 6, CX, CZ, R - 2, 'paper', 'tint') + K.cylY(Y1 - 6, Y1 - 2, CX, CZ, R, 'paper', 'body') + K.cylY(Y1 - 2, Y1, CX, CZ, R - 1, 'paper', 'tint');
  const face = K.FRONT(CX, Y1, CZ), N = 6, ro = R - 3.4, ri = 6;
  const blades = Array.from({ length: N }, (_, i) => {
    const a0 = i * 2 * Math.PI / N, a1 = a0 + 2 * Math.PI / N, h = (a: number): P2 => [Math.cos(a) * ri, Math.sin(a) * ri], o = (a: number): P2 => [Math.cos(a) * ro, Math.sin(a) * ro];
    const [p0, p1, p2, p3] = [h(a0), h(a1), o(a1 + .9), o(a0 + .9)];
    return `<path class="f body" d="M${p0.map(f).join(' ')}L${p1.map(f).join(' ')}L${p2.map(f).join(' ')}A${ro} ${ro} 0 0 0 ${p3.map(f).join(' ')}Z"/>`;
  }).join('');
  s += K.on(face, `<circle class="f paper" r="${R - 1}"/><circle class="f blk" r="${ro}"/>`) + lit(K.on(face, blades)) + K.on(face, `<circle class="det" r="${ro}"/>` + Array.from({ length: 36 }, (_, i) => { const a = i * Math.PI / 18; return `<line class="det" x1="${f(Math.cos(a) * (R - 1))}" y1="${f(Math.sin(a) * (R - 1))}" x2="${f(Math.cos(a) * (R - 2.4))}" y2="${f(Math.sin(a) * (R - 2.4))}"/>`; }).join(''));
  return s;
});

// ── Canisters: report exposure, influence and attribution separately. Three sealed canisters; the seals are live.
const CN = kernel([[0, 0, 0], [84, 0, 0], [0, 40, 0], [84, 40, 0], [20, 20, 56]], 12);
const canisters = icon(CN, 'Three sealed canisters of different sizes standing apart, each lid clamped and tagged with a seal.', () => {
  const K = CN, Y = 20;
  let s = plate(K, 0, 0, 84, 40);
  [[18, 10, 40], [44, 12, 30], [68, 9, 22]].forEach(([x, r, h]) => {
    s += K.cyl(x, Y, 4, r, h, 'paper', 'tint') + K.line(K.ring(x, Y, 4 + h * .3, r, -Math.PI / 4, Math.PI * 3 / 4, 30), 'det') + K.line(K.ring(x, Y, 4 + h * .7, r, -Math.PI / 4, Math.PI * 3 / 4, 30), 'det');
    s += K.cyl(x, Y, 4 + h, r + 1, 3, 'paper', 'body') + K.cyl(x, Y, 7 + h, r * .4, 2, 'paper', 'body');
    s += lit(rope(K, [[x + r * .7, Y + r * .7 + .8, 6 + h], [x + r * .7, Y + r * .7 + 1, 2 + h]], 1.2) + K.box(x + r * .7 - 2, Y + r * .7 + 1, h - 3.6, 4, 1.2, 5.4, 'body', 'body', 'body'));
  });
  return s;
});

// ── Airlock: give sales a weekly ranked list. An open-topped chamber with a door at each end; the parcel waits between
// them (live).
const AL = kernel([[0, 0, 0], [84, 0, 0], [0, 44, 0], [84, 44, 0], [42, 22, 40]], 12);
const airlock = icon(AL, 'A chamber with a hatch door at each end and a parcel waiting inside between them.', () => {
  const K = AL, X = 10, Y = 10, W = 62, D = 24, H = 24, T = 2.4, ZT = 4 + H;
  let s = plate(K, 0, 0, 84, 44);
  // Inside: floor, back wall, far end wall with its door
  s += K.poly([[X, Y, 4], [X + W, Y, 4], [X + W, Y + D, 4], [X, Y + D, 4]], 'f tint');
  s += K.poly([[X, Y + T, 4], [X + W, Y + T, 4], [X + W, Y + T, ZT], [X, Y + T, ZT]], 'f body') + K.poly([[X + T, Y, 4], [X + T, Y + D, 4], [X + T, Y + D, ZT], [X + T, Y, ZT]], 'f body');
  const hatch = `<rect class="f paper" x="${D / 2 - 7}" y="5" width="14" height="${H - 8}" rx="3"/><circle class="det" cx="${D / 2}" cy="${H / 2}" r="3.6"/><path class="det" d="M${D / 2 - 3.6} ${H / 2}h7.2M${D / 2} ${H / 2 - 3.6}v7.2"/>`;
  s += K.on(planeAt(K, [X + T, Y + D, ZT], [0, -1, 0], [0, 0, -1]), hatch);
  s += lit(K.box(X + W / 2 - 8, Y + D / 2 - 4, 4, 16, 12, 12, 'body', 'body', 'body') + K.on(K.TOP(X + W / 2 - 8, Y + D / 2 - 4, 16), '<path class="det" d="M8 0V12M0 6H16"/>'));
  // Near walls: the long side with a window, the near end with the other door; rims and roof ribs
  s += K.on(K.FRONT(X, Y + D, ZT), `<path class="f paper" fill-rule="evenodd" d="M0 0H${W}V${H}H0ZM${W / 2 - 16} 5H${W / 2 + 16}V${H - 5}H${W / 2 - 16}Z"/><path class="det" d="M${W / 2 - 10} ${H - 7}L${W / 2 - 3} 7M${W / 2 - 5} ${H - 7}L${W / 2 + 1} 9"/>` + screws([[3, 3], [W - 3, 3], [3, H - 3], [W - 3, H - 3]]));
  s += K.poly([[X + W, Y, 4], [X + W, Y + D, 4], [X + W, Y + D, ZT], [X + W, Y, ZT]], 'f body') + K.on(K.SIDE(X + W, Y + D, ZT), hatch.replace('class="f paper"', 'class="f tint"'));
  s += K.on(K.TOP(X, Y, ZT), `<path class="f paper" fill-rule="evenodd" d="M0 0H${W}V${D}H0ZM${T} ${T}H${W - T}V${D - T}H${T}Z"/>`);
  s += [W / 3, W * 2 / 3].map((x) => K.box(X + x - 1, Y, ZT, 2, D, 1.6, 'paper', 'body', 'tint')).join('');
  return s;
});

// ── Chain: grow a signal list from the same market. A chain of identical links; the newest link at the end is live.
const CH = kernel([[0, 0, 0], [86, 0, 0], [0, 40, 0], [86, 40, 0], [40, 20, 20]], 12);
const link = (w: number, h: number, t: number) => `M${h / 2} 0H${w - h / 2}A${h / 2} ${h / 2} 0 0 1 ${w - h / 2} ${h}H${h / 2}A${h / 2} ${h / 2} 0 0 1 ${h / 2} 0ZM${h / 2} ${t}H${w - h / 2}A${h / 2 - t} ${h / 2 - t} 0 0 1 ${w - h / 2} ${h - t}H${h / 2}A${h / 2 - t} ${h / 2 - t} 0 0 1 ${h / 2} ${t}Z`;
const chain = icon(CH, 'A chain of identical links lying on a plate; the last link has just been added.', () => {
  const K = CH, Y = 20, N = 6, P = 11, LW = 17, LH = 9, T = 2.6;
  let s = plate(K, 0, 0, 86, 40);
  const d = link(LW, LH, T);
  for (let i = 0; i < N; i++) {
    const x = 6 + i * P, live = i === N - 1;
    let g: string;
    const lo = live ? 'body' : 'tint', hi = live ? 'body' : 'paper';
    if (i % 2 === 0) g = K.on(K.TOP(x, Y - LH / 2, 4), `<path class="f ${lo}" fill-rule="evenodd" d="${d}"/>`) + K.on(K.TOP(x, Y - LH / 2, 5.8), `<path class="f ${hi}" fill-rule="evenodd" d="${d}"/>`);
    else g = K.on(K.FRONT(x, Y - .9, 4 + LH), `<path class="f ${lo}" fill-rule="evenodd" d="${d}"/>`) + K.on(K.FRONT(x, Y + .9, 4 + LH), `<path class="f ${hi}" fill-rule="evenodd" d="${d}"/>`);
    s += live ? lit(g) : g;
  }
  return s;
});

// ── Magnet: judge cold ads by the warm audience they build. A horseshoe magnet lying on the plate, filings drawn into
// lines between its poles; the poles are live.
const MG = kernel([[0, 0, 0], [74, 0, 0], [0, 56, 0], [74, 56, 0], [37, 20, 14]], 12);
const magnet = icon(MG, 'A horseshoe magnet lying flat, iron filings gathered in arcs between its two poles.', () => {
  const K = MG, CX = 37, CY = 20, RI = 7, RO = 16, Z = 4, H = 7, YE = 38;
  let s = plate(K, 0, 0, 74, 56);
  // Filings: short strokes along field arcs in front of the poles
  const fil: string[] = [];
  for (let k = 0; k < 4; k++) {
    const r = 6 + k * 3.6;
    for (let j = 0; j <= 10; j++) { const a = Math.PI * j / 10, x = CX + Math.cos(a) * (RI + RO) / 2 * (1 + k * .32), y = YE + 4 + Math.sin(a) * r, t = a + Math.PI / 2; fil.push(`<line class="det" x1="${f(x - Math.cos(t) * 1.1)}" y1="${f(y - Math.sin(t) * 1.1)}" x2="${f(x + Math.cos(t) * 1.1)}" y2="${f(y + Math.sin(t) * 1.1)}"/>`); }
  }
  s += K.on(K.TOP(0, 0, Z), fil.join(''));
  // The horseshoe: the bend as short segments round the back, the two arms forward to the poles
  const u = `M${CX - RO} ${YE}V${CY}A${RO} ${RO} 0 0 1 ${CX + RO} ${CY}V${YE}H${CX + RI}V${CY}A${RI} ${RI} 0 0 0 ${CX - RI} ${CY}V${YE}Z`;
  s += Array.from({ length: 13 }, (_, i) => K.on(K.TOP(0, 0, Z + i * H / 12), `<path class="${i === 0 ? 'f tint' : i === 12 ? 'f paper' : 'tint'}" d="${u}"/>`)).join('');
  s += lit(K.box(CX - RO, YE, Z, RO - RI, 5, H, 'body', 'body', 'body') + K.box(CX + RI, YE, Z, RO - RI, 5, H, 'body', 'body', 'body'));
  return s;
});

export const RULE_ICONS = { clock, rollerstamp, bolts, billboard, wedge, balance, drawer, xray, springscale, cascade, aperture, canisters, airlock, chain, magnet };
