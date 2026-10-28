// Item icons drawn with the scenario kernel (same angle, fills and lines as the figures), just fewer parts.
// One live part each; a short loop that settles on the rest frame.
import { kernel, hue, keys, spring, lerp, f, IN, OUT, EASY, POP, type Piece, type V3 } from './iso';

type K = ReturnType<typeof kernel>;
type P2 = [number, number];

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
const bolt = (K: K, x: number, y: number, z: number) => { const [px, py] = K.P(x, y, z); return `<ellipse class="f blk" cx="${f(px)}" cy="${f(py)}" rx="1.3" ry=".75"/>`; };
const lit = (s: string, a = 1) => (a > .01 ? `<g class="lit"${a < .999 ? ` style="opacity:${f(a)}"` : ''}>${s}</g>` : '');
const clamp = (t: number, p: number) => ((t % p) + p) % p;

// Turnstile with a coin box: a coin drops into the slot, the rotor turns one arm. Landing-page CPC report.
const T = kernel([[-8, -8, 0], [80, -8, 0], [-8, 32, 0], [80, 32, 0], [0, 0, 78], [72, 26, 48]], 10);
function turnstile(t: number) {
  t = clamp(t, 4);
  // Coin falls (ease in, like a drop), then the rotor is pushed a third of a turn and settles on its detent
  const z = keys(t, [[.2, 74, IN], [.75, 50]]), turn = spring(t, 1.0, 0, 1, { pace: .9 }), a0 = Math.PI * .2 + turn * Math.PI * 2 / 3;
  let s = T.box(-8, -8, 0, 88, 40, 4, 'paper', 'body', 'tint') + [[-4, -4], [76, -4], [-4, 28], [76, 28]].map(([x, y]) => bolt(T, x, y, 4)).join('');
  // Coin box: body, cap plate, slot, return cup on the front
  s += T.box(0, 0, 4, 22, 22, 44, 'paper', 'body', 'tint') + T.box(-1.5, -1.5, 48, 25, 25, 3, 'paper', 'body');
  s += T.on(T.TOP(-1.5, -1.5, 51), `<rect class="f blk" x="10.5" y="7" width="4" height="11" rx=".4"/>`);
  s += T.on(T.FRONT(0, 22, 48), `<rect class="det" x="5" y="22" width="12" height="8" rx=".6"/><rect class="det" x="5" y="5" width="12" height="9" rx=".6"/><line class="det" x1="5" y1="9.5" x2="17" y2="9.5"/>`);
  // Coin, upright in the slot's plane; fades as it enters
  const ca = keys(t, [[0, 0, OUT], [.2, 1], [.62, 1, EASY], [.78, 0]]);
  if (ca > .02) s += lit(T.cylY(10, 12, 12.5, z, 6.5, 'body', 'body') + T.line([[12.5, 12, z - 3.5], [12.5, 12, z + 3.5]], 'det'), ca);
  // Rotor: post on its own foot, hub, three arms with end caps; arms behind the post first
  const RX = 50, RY = 12, AZ = 40;
  const arms = [0, 1, 2].map((q) => a0 + q * Math.PI * 2 / 3);
  const arm = (a: number) => prism(T, bar(RX, RY, a, 4, 22, 3.4), AZ - 1.7, 3.4, 'paper', 'tint') + T.cyl(RX + Math.cos(a) * 22, RY + Math.sin(a) * 22, AZ - 2.4, 2.4, 4.8, 'paper', 'body');
  s += T.box(RX - 8, RY - 8, 4, 16, 16, 3, 'paper', 'body', 'tint');
  s += arms.filter((a) => Math.cos(a) + Math.sin(a) < 0).map(arm).join('');
  s += T.cyl(RX, RY, 7, 3.4, AZ - 10, 'paper', 'body') + T.cyl(RX, RY, AZ - 4, 6, 8, 'paper', 'tint') + T.cyl(RX, RY, AZ + 4, 3.4, 2, 'paper', 'body');
  s += arms.filter((a) => Math.cos(a) + Math.sin(a) >= 0).map(arm).join('');
  return hue('a', s);
}

// Pyramid metronome: the pendulum swings on its beat, the weight on the rod is the live part. Pacing check.
const M = kernel([[-6, -6, 0], [46, -6, 0], [-6, 36, 0], [46, 36, 0], [20, 15, 86]], 14);
function metronome(t: number) {
  t = clamp(t, 2);
  const swing = keys(t, [[0, -.42], [1, .42], [2, -.42]]), BX = 0, BY = 0, W = 40, D = 30, H = 70, TW = 12, TD = 10;
  let s = M.box(-6, -6, 0, 52, 42, 5, 'paper', 'body', 'tint') + [[-3, -3], [43, -3], [-3, 33], [43, 33]].map(([x, y]) => bolt(M, x, y, 5)).join('');
  const x0 = BX + (W - TW) / 2, y0 = BY + (D - TD) / 2, z = 5;
  // Body: a frustum; the side and front faces lean in to the cap
  s += M.poly([[BX + W, BY, z], [BX + W, BY + D, z], [x0 + TW, y0 + TD, z + H], [x0 + TW, y0, z + H]], 'f body');
  s += M.poly([[BX, BY + D, z], [BX + W, BY + D, z], [x0 + TW, y0 + TD, z + H], [x0, y0 + TD, z + H]], 'f tint');
  s += M.box(x0 - 1, y0 - 1, z + H, TW + 2, TD + 2, 3, 'paper', 'body') + M.cyl(x0 + TW / 2, y0 + TD / 2, z + H + 3, 2.4, 3, 'paper', 'body');
  // Winding key on the side face
  s += M.cylX(BX + W - 6, BX + W + 4, BY + D / 2, z + 16, 1.4) + M.box(BX + W + 4, BY + D / 2 - 4, z + 12, 2, 8, 8, 'paper', 'body');
  // Front recess with the tempo scale, drawn in the leaning front plane
  const o = M.P(BX, BY + D, z), u = M.D(1, 0, 0), top = M.D(0, y0 + TD - BY - D, H), v = [-top[0] / H, -top[1] / H];
  const lean = `matrix(${[...u, ...v, ...o].map((n) => n.toFixed(3)).join(' ')})`;
  const rec = (h: number) => (W - TW) / 2 * h / H;
  let face = `<path class="f body" d="M${f(W / 2 - 7)} -6L${f(W / 2 + 7)} -6L${f(W / 2 + 3)} ${-H + 8}L${f(W / 2 - 3)} ${-H + 8}Z"/>`;
  for (let i = 0; i < 9; i++) { const y = -14 - i * 5.6; face += `<line class="det" x1="${f(W / 2 + 3.6 - i * .32)}" y1="${f(y)}" x2="${f(W / 2 + 6.2 - i * .4)}" y2="${f(y)}"/>`; }
  s += M.on(lean, face);
  // Pendulum: swings in the plane of the front face, pivoting near the base; the weight rides on the rod
  const L = 56, deg = f(swing * 180 / Math.PI), pv = `${lean} translate(${W / 2} -8)`; // in the recess, parallel to the leaning face
  s += M.on(pv, `<g transform="rotate(${deg})"><path class="f paper" d="M-1.2 0L-1.2 ${-L}L1.2 ${-L}L1.2 0Z"/></g>`);
  s += lit(M.on(pv, `<g transform="rotate(${deg})"><path class="f body" d="M-6 ${-L * .62}L6 ${-L * .62}L4.4 ${-L * .62 - 8}L-4.4 ${-L * .62 - 8}Z"/><line class="det" x1="-4" y1="${f(-L * .62 - 4)}" x2="4" y2="${f(-L * .62 - 4)}"/></g>`));
  s += M.on(pv, `<circle class="f paper" r="2.6"/>`);
  return hue('a', s);
}

// Siphon between two tanks: the high tank drains over the arch into the low one. Budget re-allocation.
const S = kernel([[-4, -4, 0], [76, -4, 0], [-4, 44, 0], [76, 44, 0], [16, 16, 92], [62, 30, 92]], 10);
function tank(K: K, id: string, cx: number, cy: number, z: number, r: number, h: number, lvl: number, on: number) {
  const top = K.P(cx, cy, z + h), lz = z + 2 + (h - 4) * lvl, liq = K.P(cx, cy, lz), rx = r * Math.cos(Math.PI / 6) * Math.SQRT2, ry = rx / Math.sqrt(3);
  let s = K.cyl(cx, cy, z, r, h, 'paper', 'paper');
  s += `<clipPath id="${id}"><ellipse cx="${f(top[0])}" cy="${f(top[1])}" rx="${f(rx - 1.6)}" ry="${f(ry - .9)}"/></clipPath>`;
  s += `<ellipse class="f tint" cx="${f(top[0])}" cy="${f(top[1])}" rx="${f(rx - 1.6)}" ry="${f(ry - .9)}"/>`;
  const surf = `<ellipse class="f body" cx="${f(liq[0])}" cy="${f(liq[1])}" rx="${f(rx - 1.6)}" ry="${f(ry - .9)}"/>`;
  s += `<g clip-path="url(#${id})">${surf}${lit(surf, on)}</g>`;
  // Hoops around the wall
  for (const dz of [h * .3, h * .7]) s += K.line(K.ring(cx, cy, z + dz, r, -Math.PI / 4, Math.PI * 3 / 4, 20), 'det');
  return s;
}
function siphon(t: number) {
  t = clamp(t, 6);
  const valve = spring(t, .2, 0, 1) - spring(t, 4.6, 0, 1), run = keys(t, [[.7, 0], [4.4, 1, POP], [5.9, 0]]), L = { x: 16, y: 16, z: 26, r: 13, h: 38 }, R = { x: 58, y: 28, z: 4, r: 13, h: 34 };
  let s = S.box(-4, -4, 0, 80, 48, 4, 'paper', 'body', 'tint');
  // Stand under the high tank: four legs and a top
  for (const [x, y] of [[4, 4], [24, 4], [4, 24], [24, 24]] as P2[]) s += S.box(x, y, 4, 4, 4, 18, 'paper', 'body');
  s += S.box(2, 2, 22, 28, 28, 4, 'paper', 'body', 'tint') + S.on(S.FRONT(2, 30, 26), `<line class="det" x1="2" y1="2" x2="26" y2="2"/>`);
  s += tank(S, 'sy-l', L.x, L.y, L.z, L.r, L.h, lerp(.85, .35, run), 0);
  s += S.box(R.x - 15, R.y - 15, 4, 30, 30, 0, 'paper', 'body') + tank(S, 'sy-r', R.x, R.y, R.z, R.r, R.h, lerp(.25, .75, run), 0);
  // The tube: down into the high tank, over the arch, down into the low one; a valve on the falling leg
  const arch: V3[] = [[L.x, L.y, L.z + L.h - 6], [L.x, L.y, 80], ...K3(S, [L.x, L.y, 86], [(L.x + R.x) / 2 + 4, (L.y + R.y) / 2, 92], [R.x, R.y, 80]), [R.x, R.y, R.z + R.h - 6]];
  const d = 'M' + arch.map((p) => S.P(...p).map(f).join(' ')).join('L');
  s += `<path class="tube-o" d="${d}"/><path class="tube-i" d="${d}"/>`;
  s += valve > .5 && run < .98 ? `<path class="flow march" d="${d}"/>` : '';
  s += S.cyl(R.x, R.y, 60, 3.2, 7, 'paper', 'body') + S.box(R.x - 1, R.y - 1, 67, 2, 2, 3, 'paper', 'body') + lit(prism(S, bar(R.x, R.y, Math.PI * .25 - valve * Math.PI / 2, -7, 7, 2.4), 70, 1.6, 'paper', 'body'));
  return hue('a', s);
}
const K3 = (K: K, a: V3, c: V3, b: V3) => K.curve(a, c, b, 16);

export const turnstile_i: Piece = { aria: 'A turnstile beside a coin box: one coin in, one arm through.', period: 4, rest: 3.2, viewBox: T.viewBox, focus: [.5, .5], draw: turnstile };
export const metronome_i: Piece = { aria: 'A pyramid metronome; the weight on its pendulum swings on the beat.', period: 2, rest: 1, viewBox: M.viewBox, focus: [.5, .5], draw: metronome };
export const siphon_i: Piece = { aria: 'A siphon carries liquid from a high tank over an arch into a lower tank.', period: 6, rest: 3, viewBox: S.viewBox, focus: [.5, .5], draw: siphon };
