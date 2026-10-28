// Item icons drawn with the scenario kernel: the same angle, fills and lines as the figures, one object with its telling
// details and nothing around it that needs explaining. Static: draw() ignores t; one live part in the accent.
import { kernel, hue, f, type Piece, type V3 } from './iso';

export type K = ReturnType<typeof kernel>;
export type P2 = [number, number];

export const prism = (K: K, pts: P2[], z: number, h: number, top = 'paper', side = 'body') => K.prism(pts, z, h, top, side);
// A bar lying flat from r0 to r1 along angle a around (cx, cy)
export const bar = (cx: number, cy: number, a: number, r0: number, r1: number, w: number): P2[] => {
  const c = Math.cos(a), s = Math.sin(a), n = w / 2;
  return [[cx + c * r0 - s * n, cy + s * r0 + c * n], [cx + c * r1 - s * n, cy + s * r1 + c * n], [cx + c * r1 + s * n, cy + s * r1 - c * n], [cx + c * r0 + s * n, cy + s * r0 - c * n]];
};
export const dot = (K: K, x: number, y: number, z: number, r = 1.1) => { const [px, py] = K.P(x, y, z); return `<ellipse class="f blk" cx="${f(px)}" cy="${f(py)}" rx="${r}" ry="${f(r * .58)}"/>`; };
// Screw heads on a face plane (local 2D), with the slot
export const screws = (pts: P2[]) => pts.map(([x, y]) => `<circle class="f paper" cx="${x}" cy="${y}" r="1.3"/><line class="det" x1="${x - .9}" y1="${y}" x2="${x + .9}" y2="${y}"/>`).join('');
export const lit = (s: string, a = 1) => (a > .01 ? `<g class="lit"${a < .999 ? ` style="opacity:${f(a)}"` : ''}>${s}</g>` : '');

// The plate every icon stands on, with a screw in each corner
export const plate = (K: K, x: number, y: number, w: number, d: number) =>
  K.box(x, y, 0, w, d, 4, 'paper', 'body', 'tint') + [[x + 4, y + 4], [x + w - 4, y + 4], [x + 4, y + d - 4], [x + w - 4, y + d - 4]].map(([px, py]) => dot(K, px, py, 4)).join('');
// A rope or cable: a band of width w along a 3D path, drawn as a filled outline in screen space
export function rope(K: K, pts: V3[], w = 3, cls = 'f body') {
  const q = pts.map((p) => K.P(...p)), n = q.length, L: number[][] = [], R: number[][] = [];
  q.forEach((p, i) => {
    const a = q[Math.max(0, i - 1)], b = q[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    L.push([p[0] - dy / l * w / 2, p[1] + dx / l * w / 2]); R.push([p[0] + dy / l * w / 2, p[1] - dx / l * w / 2]);
  });
  return `<path class="${cls}" d="M${[...L, ...R.reverse()].map((p) => p.map(f).join(' ')).join('L')}Z"/>`;
}
// A plane through o spanned by unit steps u and v (both 3D), for drawing flat parts that lean: SVG x along u, y along v
export const planeAt = (K: K, o: V3, u: V3, v: V3) => { const O = K.P(...o), U = K.D(...u), V = K.D(...v); return `matrix(${[...U, ...V, ...O].map((n) => n.toFixed(3)).join(' ')})`; };
export const icon = (K: K, aria: string, draw: () => string): Piece => ({ aria, period: 1, rest: 0, viewBox: K.viewBox, focus: [.5, .5], draw: () => hue('a', draw()) });

// ── Turnstile ─────────────────────────────────────────────────────────────────────────────────────────────
// Landing-page CPC report: you pay per pass. A pedestal with a coin standing in its slot, and the rotor beside it.
const T = kernel([[-8, -12, 0], [82, -12, 0], [-8, 40, 0], [82, 40, 0], [15, 13, 82]], 12);
const HX = 2, HY = 2, HW = 26, HD = 22, HZ = 64, HT = 74, TX = 21, TY = 13, HOLE: P2 = [8, 13], CR = 4.6;
const RX = 62, RY = 13, AZ = 44, ARM = 24;
function coin(K: K, x: number, y: number, z: number) {
  return K.cyl(x, y, z, CR, 1.6, 'body', 'body') + K.on(K.TOP(x, y, z + 1.6), `<circle class="det" r="${CR - 1.3}"/>`);
}
function turnstile() {
  const a0 = Math.PI * .22;
  let s = T.box(-8, -12, 0, 90, 52, 4, 'paper', 'body', 'tint') + [[-4, -8], [78, -8], [-4, 36], [78, 36]].map(([x, y]) => dot(T, x, y, 4)).join('');
  // Pedestal: plinth, body with an access door, a cover plate
  s += T.box(-3, -3, 4, 36, 32, 4, 'paper', 'body', 'tint') + T.box(0, 0, 8, 30, 26, 52, 'paper', 'body', 'tint');
  s += T.on(T.FRONT(0, 26, 60), `<rect class="det" x="4" y="8" width="22" height="34" rx=".8"/>` + screws([[6.5, 10.5], [23.5, 10.5], [6.5, 39.5], [23.5, 39.5]]) + `<rect class="f blk" x="14" y="22" width="2" height="4" rx=".4"/>`);
  s += T.on(T.SIDE(30, 26, 60), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="6" y1="${10 + i * 3}" x2="20" y2="${10 + i * 3}"/>`).join(''));
  s += T.box(-2, -2, 60, 34, 30, 4, 'paper', 'body');
  // Coin box with a slot; a coin stands half in it (the box's front half is drawn again over the coin's lower half)
  const SY = HY + 11;
  const box = (front: boolean) => front
    ? T.poly([[HX, HY + HD, HZ], [HX + HW, HY + HD, HZ], [HX + HW, HY + HD, HT], [HX, HY + HD, HT]], 'f tint') + T.poly([[HX + HW, HY, HZ], [HX + HW, HY + HD, HZ], [HX + HW, HY + HD, HT], [HX + HW, HY, HT]], 'f body') +
      T.poly([[HX, SY + .6, HT], [HX + HW, SY + .6, HT], [HX + HW, HY + HD, HT], [HX, HY + HD, HT]], 'f paper')
    : T.box(HX, HY, HZ, HW, HD, HT - HZ, 'paper', 'body', 'tint') + T.on(T.TOP(HX, HY, HT), `<rect class="f blk" x="${HW / 2 - 8}" y="${SY - HY - .6}" width="16" height="1.2" rx=".3"/>`);
  s += box(false) + lit(T.cylY(SY - .6, SY + .6, HX + HW / 2, HT, 6.5, 'body', 'body') + T.on(T.FRONT(HX + HW / 2, SY + .6, HT), `<circle class="det" r="4.6"/>`)) + box(true);
  s += T.on(T.FRONT(HX, HY + HD, HT), `<rect class="det" x="${HW / 2 - 5}" y="4" width="10" height="4" rx=".5"/>`);
  // Rotor: flange, post, hub with three arms; arms behind the post first
  const arms = [0, 1, 2].map((q) => a0 + q * Math.PI * 2 / 3);
  const arm = (a: number) => prism(T, bar(RX, RY, a, 6, ARM, 3.6), AZ - 1.8, 3.6, 'paper', 'tint') + T.cyl(RX + Math.cos(a) * ARM, RY + Math.sin(a) * ARM, AZ - 2.6, 2.6, 5.2, 'paper', 'body');
  s += T.cyl(RX, RY, 4, 10, 2.4, 'paper', 'body') + [0, 1, 2, 3].map((q) => { const b = q * Math.PI / 2 + Math.PI / 4; return dot(T, RX + Math.cos(b) * 7.5, RY + Math.sin(b) * 7.5, 6.4, .9); }).join('');
  s += arms.filter((a) => Math.cos(a) + Math.sin(a) < 0).map(arm).join('');
  s += T.cyl(RX, RY, 6.4, 3.4, AZ - 11, 'paper', 'body') + T.cyl(RX, RY, AZ - 5, 6.2, 9, 'paper', 'body') + T.cyl(RX, RY, AZ + 4, 3.4, 2, 'paper', 'tint');
  s += arms.filter((a) => Math.cos(a) + Math.sin(a) >= 0).map(arm).join('');
  return hue('a', s);
}

// ── Metronome ─────────────────────────────────────────────────────────────────────────────────────────────
// Pacing check against schedule. A pyramid metronome on a board, the pendulum out at one end of its swing; the weight is the live part.
const M = kernel([[-8, -8, 0], [48, -8, 0], [-8, 38, 0], [48, 38, 0], [20, 15, 86], [-14, 40, 60]], 10);
function frustum(K: K, x: number, y: number, z: number, w: number, d: number, h: number, tw: number, td: number, front = 'tint', side = 'body') {
  const x0 = x + (w - tw) / 2, y0 = y + (d - td) / 2;
  return K.poly([[x + w, y, z], [x + w, y + d, z], [x0 + tw, y0 + td, z + h], [x0 + tw, y0, z + h]], `f ${side}`) +
    K.poly([[x, y + d, z], [x + w, y + d, z], [x0 + tw, y0 + td, z + h], [x0, y0 + td, z + h]], `f ${front}`) +
    K.poly([[x0, y0, z + h], [x0 + tw, y0, z + h], [x0 + tw, y0 + td, z + h], [x0, y0 + td, z + h]], 'f paper');
}
function metronome() {
  const swing = .32, BX = 0, BY = 0, W = 40, D = 30, H = 72, TW = 12, TD = 10, z = 7;
  // Board with a chamfered lip and corner screws
  let s = M.box(-8, -8, 0, 56, 46, 4, 'paper', 'body', 'tint') + M.box(-6, -6, 4, 52, 42, 1.5, 'paper', 'tint');
  s += [[-4, -4], [44, -4], [-4, 34], [44, 34]].map(([x, y]) => dot(M, x, y, 5.5)).join('');
  // Feet, then the body
  s += [[2, 2], [34, 2], [2, 24], [34, 24]].map(([x, y]) => M.box(BX + x, BY + y, 5.5, 4, 4, 1.5, 'paper', 'body')).join('');
  s += frustum(M, BX, BY, z, W, D, H, TW, TD);
  const x0 = BX + (W - TW) / 2, y0 = BY + (D - TD) / 2;
  s += M.box(x0 - 1.5, y0 - 1.5, z + H, TW + 3, TD + 3, 3, 'paper', 'body') + M.cyl(x0 + TW / 2, y0 + TD / 2, z + H + 3, 2.6, 3, 'paper', 'body') + M.cyl(x0 + TW / 2, y0 + TD / 2, z + H + 6, 1.4, 2, 'paper', 'tint');
  // Winding key on the side face: shaft and two wings
  s += M.cylX(BX + W - 6, BX + W + 5, BY + D / 2, z + 18, 1.5) + M.box(BX + W + 5, BY + D / 2 - 5, z + 14, 2, 10, 8, 'paper', 'body') + M.on(M.SIDE(BX + W + 7, BY + D / 2 + 5, z + 22), `<circle class="det" cx="5" cy="4" r="1.6"/>`);
  // Front: a recess with a tempo scale, a name plate at the foot, drawn in the leaning plane
  const o = M.P(BX, BY + D, z), u = M.D(1, 0, 0), top = M.D(0, y0 + TD - BY - D, H), v = [-top[0] / H, -top[1] / H];
  const lean = `matrix(${[...u, ...v, ...o].map((n) => n.toFixed(3)).join(' ')})`;
  let face = `<path class="f body" d="M${W / 2 - 7} -12L${W / 2 + 7} -12L${W / 2 + 3} ${-H + 8}L${W / 2 - 3} ${-H + 8}Z"/>`;
  for (let i = 0; i < 12; i++) { const y = -20 - i * 4.2, long = i % 3 === 0; face += `<line class="det" x1="${f(W / 2 + 3.4 - i * .3)}" y1="${f(y)}" x2="${f(W / 2 + (long ? 6.4 : 5.2) - i * .36)}" y2="${f(y)}"/>`; }
  face += `<rect class="f paper" x="${W / 2 - 8}" y="-9" width="16" height="5" rx=".5"/>` + screws([[W / 2 - 6, -6.5], [W / 2 + 6, -6.5]]);
  s += M.on(lean, face);
  // Pendulum: rod pivoting near the foot of the recess, the weight with its lock screw; a pivot screw on top
  const L = 56, deg = f(swing * 180 / Math.PI), pv = `${lean} translate(${W / 2} -14)`;
  s += M.on(pv, `<g transform="rotate(${deg})"><path class="f paper" d="M-1.1 0L-1.1 ${-L}L1.1 ${-L}L1.1 0Z"/><circle class="f paper" cx="0" cy="${-L}" r="1.6"/></g>`);
  const wy = -L * .6;
  s += lit(M.on(pv, `<g transform="rotate(${deg})"><path class="f body" d="M-6 ${wy}L6 ${wy}L4.4 ${wy - 9}L-4.4 ${wy - 9}Z"/><line class="det" x1="-4.6" y1="${wy - 3}" x2="4.6" y2="${wy - 3}"/><circle class="f paper" cx="0" cy="${wy - 6}" r="1.1"/></g>`));
  s += M.on(pv, `<circle class="f paper" r="2.8"/><line class="det" x1="-1.8" y1="0" x2="1.8" y2="0"/>`);
  return hue('a', s);
}

// ── Siphon ────────────────────────────────────────────────────────────────────────────────────────────────
// Budget re-allocation. A high tank on a braced stand, a low tank on the floor, a bent tube between them with a valve;
// the flow runs over the arch, the sight glasses show the levels half way.
const S = kernel([[-8, -8, 0], [86, -8, 0], [-8, 50, 0], [86, 50, 0], [17, 17, 100], [66, 32, 70]], 10);
function tank(K: K, cx: number, cy: number, z: number, r: number, h: number, lvl: number) {
  let s = K.cyl(cx, cy, z, r, h, 'paper', 'paper');
  for (const dz of [5, h - 5]) s += K.line(K.ring(cx, cy, z + dz, r, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det');
  // Rim flange with bolts, a lid
  s += K.cyl(cx, cy, z + h, r + 1.6, 2, 'paper', 'body') + K.cyl(cx, cy, z + h + 2, r - 2, 2, 'paper', 'tint');
  s += Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return dot(K, cx + Math.cos(a) * (r + .4), cy + Math.sin(a) * (r + .4), z + h + 2, .7); }).join('');
  // Sight glass on the front: a tube in two brackets, the level inside
  const gx = cx + r * .7, gy = cy + r * .7, g0 = z + 5, gh = h - 10;
  s += K.box(gx - 1, gy - 1, g0 - 2, 3, 3, 2, 'paper', 'body') + K.box(gx - 1, gy - 1, g0 + gh, 3, 3, 2, 'paper', 'body');
  s += K.cyl(gx + 1.5, gy + 1.5, g0, 1.8, gh, 'paper', 'paper') + K.cyl(gx + 1.5, gy + 1.5, g0, 1.2, gh * lvl, 'body', 'body');
  return s;
}
function siphon() {
  const run = .5;
  const L = { x: 17, y: 17, z: 30, r: 12, h: 36 }, R = { x: 66, y: 32, z: 4, r: 12, h: 30 };
  // Floor plate
  let s = S.box(-8, -8, 0, 94, 58, 4, 'paper', 'body', 'tint') + [[-4, -4], [82, -4], [-4, 46], [82, 46]].map(([x, y]) => dot(S, x, y, 4)).join('');
  // Stand: four legs, cross braces on the visible sides, a top with a lip
  const leg = (x: number, y: number) => S.box(x, y, 4, 4, 4, 24, 'paper', 'body');
  s += leg(2, 2) + leg(28, 2) + leg(2, 28);
  s += S.line([[30, 4, 8], [30, 30, 24]], 'f') + S.line([[4, 30, 8], [30, 30, 24]], 'f');
  s += leg(28, 28) + S.box(0, 0, 28, 34, 34, 2, 'paper', 'body', 'tint');
  s += tank(S, L.x, L.y, L.z, L.r, L.h, .85 - .5 * run);
  // The low tank on a pad
  s += S.box(R.x - 15, R.y - 15, 4, 30, 30, 1.5, 'paper', 'body') + tank(S, R.x, R.y, R.z + 1.5, R.r, R.h, .25 + .5 * run);
    // The tube: from inside the high tank up over the arch and down into the low one; the flow runs while it is open
  const arch: V3[] = [[L.x + 3, L.y, L.z + L.h - 4], [L.x + 3, L.y, 82], ...S.curve([L.x + 3, L.y, 88], [42, 24, 98], [R.x - 3, R.y, 88], 16), [R.x - 3, R.y, 82], [R.x - 3, R.y, R.z + R.h - 2]];
  const d = 'M' + arch.map((p) => S.P(...p).map(f).join(' ')).join('L');
  s += `<path class="tube-o" d="${d}"/><path class="tube-i" d="${d}"/>`;
  s += lit(`<path class="flow" d="${d}"/>`);
  // Valve on the falling leg with its handwheel (spokes turn as it opens)
  const VZ = 64;
  s += S.cyl(R.x - 3, R.y, VZ, 3.6, 8, 'paper', 'body') + S.cylX(R.x - 3, R.x + 4, R.y, VZ + 4, 1.2) + S.on(S.SIDE(R.x + 4, R.y, VZ + 4), `<g><circle class="f paper" r="4.6"/><circle class="det" r="1.2"/>${[0, 1, 2].map((q) => `<line class="det" x1="0" y1="0" x2="${f(Math.cos(q * 2.094) * 4.2)}" y2="${f(Math.sin(q * 2.094) * 4.2)}"/>`).join('')}</g>`);
  return hue('a', s);
}

export const turnstile_i: Piece = { aria: 'A turnstile pedestal with a coin in its slot and a three-arm rotor.', period: 1, rest: 0, viewBox: T.viewBox, focus: [.5, .5], draw: turnstile };
export const metronome_i: Piece = { aria: 'A pyramid metronome; its pendulum with the weight out at one end of the swing.', period: 1, rest: 0, viewBox: M.viewBox, focus: [.5, .5], draw: metronome };
export const siphon_i: Piece = { aria: 'A siphon: liquid runs from a high tank over an arch into a lower tank.', period: 1, rest: 0, viewBox: S.viewBox, focus: [.5, .5], draw: siphon };
