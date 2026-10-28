// Item icons drawn with the scenario kernel: the same angle, fills, lines and level of detail as the figures, but one
// object (and a prop or two) instead of a whole scene, about a third of a scenario. One live part each; parts enter
// from a source and leave into a sink, never pop in or fade out; a short loop that settles on its rest frame.
import { kernel, hue, keys, spring, f, IN, OUT, EASY, type Ease, type Piece, type V3 } from './iso';

type K = ReturnType<typeof kernel>;
type P2 = [number, number];
const PUSH: Ease = [.4, 0, .2, 1];

// Upright prism over any convex plan: the walls that face the viewer (+x / +y), back to front, then the top
function prism(K: K, pts: P2[], z: number, h: number, top = 'paper', side = 'body') {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  const walls = pts.map((a, i) => {
    const b = pts[(i + 1) % pts.length], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    let nx = b[1] - a[1], ny = a[0] - b[0];
    if (nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
    return { a, b, d: mx + my, show: nx + ny > 1e-6 };
  }).filter((w) => w.show).sort((p, q) => p.d - q.d);
  return walls.map(({ a, b }) => K.poly([[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z + h], [a[0], a[1], z + h]], `f ${side}`)).join('') +
    K.poly(pts.map(([x, y]) => [x, y, z + h] as V3), `f ${top}`);
}
// A bar lying flat from r0 to r1 along angle a around (cx, cy)
const bar = (cx: number, cy: number, a: number, r0: number, r1: number, w: number): P2[] => {
  const c = Math.cos(a), s = Math.sin(a), n = w / 2;
  return [[cx + c * r0 - s * n, cy + s * r0 + c * n], [cx + c * r1 - s * n, cy + s * r1 + c * n], [cx + c * r1 + s * n, cy + s * r1 - c * n], [cx + c * r0 + s * n, cy + s * r0 - c * n]];
};
const dot = (K: K, x: number, y: number, z: number, r = 1.1) => { const [px, py] = K.P(x, y, z); return `<ellipse class="f blk" cx="${f(px)}" cy="${f(py)}" rx="${r}" ry="${f(r * .58)}"/>`; };
// Screw heads on a face plane (local 2D), with the slot
const screws = (pts: P2[]) => pts.map(([x, y]) => `<circle class="f paper" cx="${x}" cy="${y}" r="1.3"/><line class="det" x1="${x - .9}" y1="${y}" x2="${x + .9}" y2="${y}"/>`).join('');
const lit = (s: string, a = 1) => (a > .01 ? `<g class="lit"${a < .999 ? ` style="opacity:${f(a)}"` : ''}>${s}</g>` : '');
const clamp = (t: number, p: number) => ((t % p) + p) % p;

// ── Turnstile ─────────────────────────────────────────────────────────────────────────────────────────────
// Landing-page CPC report: you pay per pass. A coin tube on the pedestal pushes out its bottom coin, the coin slides
// to the token hole and drops in; the rotor is released and turns one arm (a third of a turn) onto its detent.
const T = kernel([[-12, -16, 0], [112, -16, 0], [-12, 44, 0], [112, 44, 0], [22, 13, 104], [100, 0, 52]], 12);
const HX = 2, HY = 2, HW = 26, HD = 22, HZ = 64, HT = 74, TX = 21, TY = 13, HOLE: P2 = [8, 13], CR = 4.6;
const RX = 62, RY = 13, AZ = 44, ARM = 24;
function coin(K: K, x: number, y: number, z: number) {
  return K.cyl(x, y, z, CR, 1.6, 'body', 'body') + K.on(K.TOP(x, y, z + 1.6), `<circle class="det" r="${CR - 1.3}"/>`);
}
function turnstile(t: number) {
  t = clamp(t, 5);
  const cx = keys(t, [[.15, TX, PUSH], [.85, HOLE[0]]]), cz = keys(t, [[.85, HT, IN], [1.15, HT - 14]]);
  const turn = spring(t, 1.25, 0, 1), a0 = Math.PI * .22 + turn * Math.PI * 2 / 3;
  // Floor plate with tread grooves and anchor bolts
  let s = T.box(-12, -16, 0, 124, 60, 4, 'paper', 'body', 'tint');
  s += T.on(T.TOP(-12, -16, 4), Array.from({ length: 11 }, (_, i) => `<line class="det" x1="${38 + i * 6}" y1="6" x2="${38 + i * 6}" y2="54"/>`).join(''));
  s += [[-8, -12], [108, -12], [-8, 40], [108, 40]].map(([x, y]) => dot(T, x, y, 4)).join('');
  // Pedestal: plinth, body with an access door and a vent on the side, a cover plate
  s += T.box(-3, -3, 4, 36, 32, 4, 'paper', 'body', 'tint') + T.box(0, 0, 8, 30, 26, 52, 'paper', 'body', 'tint');
  s += T.on(T.FRONT(0, 26, 60), `<rect class="det" x="4" y="8" width="22" height="34" rx=".8"/>` + screws([[6.5, 10.5], [23.5, 10.5], [6.5, 39.5], [23.5, 39.5]]) + `<rect class="f blk" x="14" y="22" width="2" height="4" rx=".4"/>`);
  s += T.on(T.SIDE(30, 26, 60), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="6" y1="${10 + i * 3}" x2="20" y2="${10 + i * 3}"/>`).join('') + `<rect class="det" x="4" y="30" width="18" height="14" rx=".8"/>` + screws([[6, 32.5], [20, 32.5], [6, 41.5], [20, 41.5]]));
  s += T.box(-2, -2, 60, 34, 30, 4, 'paper', 'body');
  // Coin acceptor housing: sides, the token hole's dark well, the sinking coin, then the top with the hole cut out
  s += T.box(HX, HY, HZ, HW, HD, HT - HZ, 'paper', 'body', 'tint');
  s += T.on(T.TOP(0, 0, HT), `<circle class="f blk" cx="${HOLE[0]}" cy="${HOLE[1]}" r="${CR + .8}"/><circle class="det" cx="${HOLE[0]}" cy="${HOLE[1]}" r="${CR + 2.4}"/>`);
  if (cz < HT) s += `<clipPath id="ts-hole"><circle transform="${T.TOP(0, 0, HT)}" cx="${HOLE[0]}" cy="${HOLE[1]}" r="${CR + .8}"/></clipPath><g clip-path="url(#ts-hole)">${lit(coin(T, cx, TY, cz))}</g>`;
  s += T.on(T.FRONT(HX, HY + HD, HT), `<rect class="f tint" x="${HW - 11}" y="3" width="8" height="5" rx=".5"/>`);
  // Coin in flight on the housing top, behind the tube until it clears it
  if (cz >= HT) s += lit(coin(T, cx, TY, HT));
  // Coin tube: a collar, the tube with a window showing the stack, a cap
  s += T.cyl(TX, TY, HT, CR + 2.6, 3, 'paper', 'body') + T.cyl(TX, TY, HT + 3, CR + 1.2, 24, 'paper', 'tint') + T.cyl(TX, TY, HT + 27, CR + 2, 2.4, 'paper', 'body');
  s += T.on(T.FRONT(TX, TY + CR + 1.2, HT + 27), `<rect class="f paper" x="-1.6" y="4" width="3.2" height="16" rx=".6"/>` + [7, 10, 13, 16].map((y) => `<line class="det" x1="-1.6" y1="${y}" x2="1.6" y2="${y}"/>`).join(''));
  // Rotor: flange, post, ratchet wheel, hub with three arms; arms behind the post first
  const arms = [0, 1, 2].map((q) => a0 + q * Math.PI * 2 / 3);
  const arm = (a: number) => prism(T, bar(RX, RY, a, 6, ARM, 3.6), AZ - 1.8, 3.6, 'paper', 'tint') + T.cyl(RX + Math.cos(a) * ARM, RY + Math.sin(a) * ARM, AZ - 2.6, 2.6, 5.2, 'paper', 'body');
  s += T.cyl(RX, RY, 4, 10, 2.4, 'paper', 'body') + [0, 1, 2, 3].map((q) => { const b = q * Math.PI / 2 + Math.PI / 4; return dot(T, RX + Math.cos(b) * 7.5, RY + Math.sin(b) * 7.5, 6.4, .9); }).join('');
  s += arms.filter((a) => Math.cos(a) + Math.sin(a) < 0).map(arm).join('');
  s += T.cyl(RX, RY, 6.4, 3.4, AZ - 14, 'paper', 'body') + T.cyl(RX, RY, AZ - 8, 7.5, 3, 'paper', 'tint');
  s += T.on(T.TOP(RX, RY, AZ - 5), Array.from({ length: 12 }, (_, i) => { const b = i * Math.PI / 6 + turn * Math.PI * 2 / 3; return `<line class="det" x1="${f(Math.cos(b) * 5.2)}" y1="${f(Math.sin(b) * 5.2)}" x2="${f(Math.cos(b) * 7.5)}" y2="${f(Math.sin(b) * 7.5)}"/>`; }).join(''));
  s += T.cyl(RX, RY, AZ - 5, 6.2, 9, 'paper', 'body') + T.cyl(RX, RY, AZ + 4, 3.4, 2, 'paper', 'tint');
  s += arms.filter((a) => Math.cos(a) + Math.sin(a) >= 0).map(arm).join('');
  // Guard rail on the far side of the lane: two posts and a top rail
  s += T.box(96, -2, 4, 5, 5, 46, 'paper', 'body') + T.box(96, 25, 4, 5, 5, 46, 'paper', 'body') + T.cylY(-4, 32, 98.5, 50, 2.4, 'paper', 'body');
  return hue('a', s);
}

// ── Metronome ─────────────────────────────────────────────────────────────────────────────────────────────
// Pacing check against schedule. A pyramid metronome on a board, its cover standing beside it; the pendulum swings
// on the beat in the recess of the leaning front, the weight on its rod is the live part.
const M = kernel([[-8, -10, 0], [92, -10, 0], [-8, 40, 0], [92, 40, 0], [20, 15, 92], [70, 2, 64]], 12);
function frustum(K: K, x: number, y: number, z: number, w: number, d: number, h: number, tw: number, td: number, front = 'tint', side = 'body') {
  const x0 = x + (w - tw) / 2, y0 = y + (d - td) / 2;
  return K.poly([[x + w, y, z], [x + w, y + d, z], [x0 + tw, y0 + td, z + h], [x0 + tw, y0, z + h]], `f ${side}`) +
    K.poly([[x, y + d, z], [x + w, y + d, z], [x0 + tw, y0 + td, z + h], [x0, y0 + td, z + h]], `f ${front}`) +
    K.poly([[x0, y0, z + h], [x0 + tw, y0, z + h], [x0 + tw, y0 + td, z + h], [x0, y0 + td, z + h]], 'f paper');
}
function metronome(t: number) {
  t = clamp(t, 2);
  const swing = keys(t, [[0, -.4], [1, .4], [2, -.4]]), BX = 0, BY = 0, W = 40, D = 30, H = 72, TW = 12, TD = 10, z = 7;
  // Board with a chamfered lip and corner screws
  let s = M.box(-8, -10, 0, 100, 50, 4, 'paper', 'body', 'tint') + M.box(-6, -8, 4, 96, 46, 1.5, 'paper', 'tint');
  s += [[-4, -6], [88, -6], [-4, 36], [88, 36]].map(([x, y]) => dot(M, x, y, 5.5)).join('');
  // The cover, lifted off and standing behind on the right: a hollow pyramid with a finger notch
  s += frustum(M, 54, -4, 5.5, 32, 24, 56, 10, 8, 'tint', 'body') + M.on(M.FRONT(54, 20, 5.5), `<path class="det" d="M12 0v-4a4 4 0 0 1 8 0v4"/>`);
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
// Budget re-allocation. A high tank on a braced stand, a low tank on the floor, a bent tube between them hung over their
// rims. The valve's handwheel turns, the liquid runs over the arch, the sight glasses show one level fall and the other
// rise; the wheel closes, and a hand pump on the low tank works it back up for the next loop.
const S = kernel([[-8, -8, 0], [86, -8, 0], [-8, 50, 0], [86, 50, 0], [17, 17, 104], [66, 32, 70]], 10);
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
  // Drain cock at the foot
  s += K.cylX(cx + r * .9, cx + r + 5, cy - r * .3, z + 3, 1.2) + K.box(cx + r + 3, cy - r * .3 - .6, z + 4.2, 1.2, 1.2, 3, 'paper', 'body');
  return s;
}
function siphon(t: number) {
  t = clamp(t, 8);
  // Open, run, close; then a hand pump on the low tank works the liquid back up, one level step per stroke
  const open = keys(t, [[.2, 0, EASY], [.9, 1], [4.2, 1, EASY], [4.9, 0]]), wheel = spring(t, .2, 0, 1) - spring(t, 4.2, 0, 1);
  const strokes: [number, number, Ease?][] = [[5, 0]];
  for (let i = 0; i < 4; i++) strokes.push([5.3 + i * .65, 1, EASY], [5.6 + i * .65, 0, EASY]);
  const lever = keys(t, strokes), back = keys(t, [[5, 0], ...[0, 1, 2, 3].map((i) => [5.6 + i * .65, (i + 1) / 4, EASY] as [number, number, Ease])]);
  const run = keys(t, [[.7, 0, [.3, 0, .4, 1]], [4.3, 1]]) * (1 - back);
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
  const PX = 44, PY = 24;
  // The tube: from inside the high tank up over the arch and down into the low one; the flow runs while it is open
  const arch: V3[] = [[L.x + 3, L.y, L.z + L.h - 4], [L.x + 3, L.y, 82], ...S.curve([L.x + 3, L.y, 88], [PX, PY, 98], [R.x - 3, R.y, 88], 16), [R.x - 3, R.y, 82], [R.x - 3, R.y, R.z + R.h - 2]];
  const d = 'M' + arch.map((p) => S.P(...p).map(f).join(' ')).join('L');
  s += `<path class="tube-o" d="${d}"/><path class="tube-i" d="${d}"/>`;
  s += lit(`<path class="flow march" d="${d}"/>`, open);
  // Valve on the falling leg with its handwheel (spokes turn as it opens)
  const VZ = 64;
  s += S.cyl(R.x - 3, R.y, VZ, 3.6, 8, 'paper', 'body') + S.cylX(R.x - 3, R.x + 4, R.y, VZ + 4, 1.2) + S.on(S.SIDE(R.x + 4, R.y, VZ + 4), `<g transform="rotate(${f(wheel * 180)})"><circle class="f paper" r="4.6"/><circle class="det" r="1.2"/>${[0, 1, 2].map((q) => `<line class="det" x1="0" y1="0" x2="${f(Math.cos(q * 2.094) * 4.2)}" y2="${f(Math.sin(q * 2.094) * 4.2)}"/>`).join('')}</g>`);
  // Hand pump on the low tank's lid, its return line up to the high tank; the lever rocks on its pivot
  const QX = R.x + 5, QY = R.y - 5, QZ = R.z + 1.5 + R.h + 4;
  const ret: V3[] = [[QX, QY, QZ + 14], [QX, QY, 76], [L.x - 4, L.y - 5, 76], [L.x - 4, L.y - 5, L.z + L.h + 4]];
  const rd = 'M' + ret.map((p) => S.P(...p).map(f).join(' ')).join('L');
  s += `<path class="tube-o" d="${rd}"/><path class="tube-i" d="${rd}"/>`;
  s += S.cyl(QX, QY, QZ, 3.4, 2, 'paper', 'body') + S.cyl(QX, QY, QZ + 2, 2.4, 12, 'paper', 'tint') + S.box(QX - 1, QY - 3, QZ + 14, 2, 6, 4, 'paper', 'body');
  const la = -.35 + lever * .7, lp: V3 = [QX, QY, QZ + 17];
  const le: V3 = [QX + Math.cos(la) * 16, QY + 1.2, QZ + 17 + Math.sin(la) * 16], up: V3 = [-Math.sin(la) * 1.4, 0, Math.cos(la) * 1.4];
  const lp1: V3 = [lp[0] - Math.cos(la) * 3, QY + 1.2, lp[2] - Math.sin(la) * 3];
  s += S.poly([[lp1[0] - up[0], lp1[1], lp1[2] - up[2]], [le[0] - up[0], le[1], le[2] - up[2]], [le[0] + up[0], le[1], le[2] + up[2]], [lp1[0] + up[0], lp1[1], lp1[2] + up[2]]], 'f tint') + S.cylY(QY - 1.4, QY + 1.4, QX + Math.cos(la) * 16, QZ + 17 + Math.sin(la) * 16, 1.6, 'paper', 'body') + S.cylY(QY - 3, QY + 3, QX, QZ + 17, 1.2, 'paper', 'body');
  return hue('a', s);
}

export const turnstile_i: Piece = { aria: 'A turnstile: a coin tube pushes out a coin, it drops into the token hole and the rotor turns one arm.', period: 5, rest: 3.6, viewBox: T.viewBox, focus: [.5, .5], draw: turnstile };
export const metronome_i: Piece = { aria: 'A pyramid metronome on a board with its cover beside it; the weight on its pendulum swings on the beat.', period: 2, rest: 1, viewBox: M.viewBox, focus: [.5, .5], draw: metronome };
export const siphon_i: Piece = { aria: 'A siphon: a valve opens and liquid runs from a high tank over an arch into a lower tank.', period: 8, rest: 3, viewBox: S.viewBox, focus: [.5, .5], draw: siphon };
