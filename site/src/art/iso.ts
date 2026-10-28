// Isometric kernel for the hero and CTA art (DESIGN §8.17). Same projection as ScenarioCover and iso-glow:
// +x runs down-right, +y down-left, +z up. Every piece is a pure draw(t) that returns SVG markup, so the build
// renders the rest frame and the page re-renders the same function while it plays.
const C = Math.cos(Math.PI / 6), S = Math.sin(Math.PI / 6);
export type V3 = [number, number, number];
export const f = (n: number) => n.toFixed(1);

export interface Piece {
  aria: string;
  period: number; // seconds per loop
  rest: number;   // time of the static frame (cards, reduced motion, no JS)
  viewBox: string;
  focus?: [number, number]; // the part that matters, as a fraction of the viewBox; zoomed slots scale around it
  draw: (t: number) => string;
}

// Timing helpers: k(t, a, b) is 0 before a, 1 after b, eased in between.
// The ease is Figma's "Slow" spring (mass 1, stiffness 80, damping 20): starts at rest, no overshoot, long soft
// settle. Its step response is fitted to the a→b window (settled to 0.5% at 1.05 s), so loops still close exactly.
const R1 = -10 + Math.sqrt(20), R2 = -10 - Math.sqrt(20), SETTLE = 1.05;
const step = (s: number) => 1 - (R2 * Math.exp(R1 * s) - R1 * Math.exp(R2 * s)) / (R2 - R1);
export const ease = (u: number) => step(u * SETTLE) / step(SETTLE);
export const k = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

// After Effects-style keys, after the fun-isometric skill's kit/motions.ts: values between keys follow a cubic-bezier ease
// (AE influence handles), held before the first key and after the last. Times in seconds.
export type Ease = [number, number, number, number];
export const EASY: Ease = [.333, 0, .667, 1], POP: Ease = [.75, 0, .25, 1], SNAP: Ease = [.8, 0, .2, 1], OUT: Ease = [0, 0, 0, 1], IN: Ease = [1, 0, .8, 1], SOFT: Ease = [.2, 0, 0, 1];
export function bez([x1, y1, x2, y2]: Ease, x: number) {
  const b = (u: number, p: number, q: number) => 3 * (1 - u) * (1 - u) * u * p + 3 * (1 - u) * u * u * q + u * u * u;
  let lo = 0, hi = 1, u = x;
  for (let i = 0; i < 24; i++) { u = (lo + hi) / 2; if (b(u, x1, x2) < x) lo = u; else hi = u; }
  return b(u, y1, y2);
}
export type Key = [number, number, Ease?];
export function keys(t: number, ks: Key[]) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    const [t0, v0, e = EASY] = ks[i], [t1, v1] = ks[i + 1];
    if (t < t1) return v0 + (v1 - v0) * bez(e, (t - t0) / (t1 - t0));
  }
  return ks[ks.length - 1][1];
}
// The skill's baked spring: overshoots, swings halving, rests after 91 frames (1.5 s) at pace 1. `amp` scales the
// overshoot: 1 is the sticker bounce, our machines use about .3 so heavy parts settle instead of bouncing.
const SPR: Ease[] = [[.17, .17, .55, 1], [.35, 0, .62, 1], [.31, 0, .67, 1], [.31, 0, .64, 1], [.3, 0, .64, 1], [.24, 0, .57, 1]];
const REACH = [1.448, .778, 1.11, .95, 1.012, 1], GAPS = [13, 16, 16, 15, 15, 16];
export function spring(t: number, start: number, from: number, to: number, { pace = 1, amp = .3 } = {}) {
  const ks: Key[] = [[start, from, SPR[0]]];
  let s = start;
  REACH.forEach((r, i) => { s += GAPS[i] * pace / 60; ks.push([s, from + (to - from) * (1 + (r - 1) * amp), SPR[i + 1]]); });
  return keys(t, ks);
}

export function kernel(extremes: V3[], pad = 16) {
  const d = extremes.map(([x, y, z]) => [(x - y) * C, (x + y) * S - z]);
  const x0 = Math.min(...d.map((p) => p[0])) - pad, y0 = Math.min(...d.map((p) => p[1])) - pad;
  const W = Math.max(...d.map((p) => p[0])) + pad - x0, H = Math.max(...d.map((p) => p[1])) + pad - y0;
  const P = (x: number, y: number, z: number) => [(x - y) * C - x0, (x + y) * S - z - y0];
  const D = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z];
  const plane = (o: V3, u: V3, v: V3) => { const O = P(...o), U = D(...u), V = D(...v); return `matrix(${[...U, ...V, ...O].map((n) => n.toFixed(3)).join(' ')})`; };
  // Face planes: draw ordinary SVG (x right, y down) inside on(...) and it lands on the face.
  const TOP = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 1, 0]);
  const FRONT = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 0, -1]); // y = max face, lower left
  const SIDE = (x: number, y: number, z: number) => plane([x, y, z], [0, -1, 0], [0, 0, -1]); // x = max face, lower right
  const on = (t: string, inner: string) => `<g transform="${t}">${inner}</g>`;
  const pts = (ps: V3[]) => ps.map((p) => P(...p).map(f).join(' ')).join('L');
  const poly = (ps: V3[], cls: string) => `<path class="${cls}" d="M${pts(ps)}Z"/>`;
  const line = (ps: V3[], cls: string) => `<path class="${cls}" d="M${pts(ps)}"/>`;
  // A box is its three visible faces; fill classes per face (paper, tint, body, blk).
  const box = (x: number, y: number, z: number, w: number, dd: number, h: number, top = 'paper', side = 'body', front = side) =>
    poly([[x + w, y, z], [x + w, y + dd, z], [x + w, y + dd, z + h], [x + w, y, z + h]], `f ${side}`) +
    poly([[x, y + dd, z], [x + w, y + dd, z], [x + w, y + dd, z + h], [x, y + dd, z + h]], `f ${front}`) +
    poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + dd, z + h], [x, y + dd, z + h]], `f ${top}`);
  const ring = (cx: number, cy: number, z: number, r: number, a0 = 0, a1 = 2 * Math.PI, n = 40): V3[] =>
    Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3; });
  // Upright cylinder (coin, drum on end): visible wall is the half facing the viewer (-45°…135°).
  const cyl = (cx: number, cy: number, z: number, r: number, h: number, top = 'paper', side = 'body') => {
    const a0 = -Math.PI / 4, a1 = 3 * Math.PI / 4;
    return poly([...ring(cx, cy, z, r, a0, a1, 24), ...ring(cx, cy, z + h, r, a0, a1, 24).reverse()], `f ${side}`) +
      poly(ring(cx, cy, z + h, r), `f ${top}`);
  };
  // Cylinder lying along x (a drum, a roller): wall then the +x end cap.
  const cylX = (x0: number, x1: number, cy: number, cz: number, r: number, end = 'paper', side = 'body') => {
    const arc = (x: number, a0: number, a1: number, n = 24): V3[] => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [x, cy + r * Math.cos(a), cz + r * Math.sin(a)] as V3; });
    const a0 = -Math.PI / 4, a1 = 3 * Math.PI / 4;
    return poly([...arc(x0, a0, a1), ...arc(x1, a0, a1).reverse()], `f ${side}`) + poly(arc(x1, 0, 2 * Math.PI, 40), `f ${end}`);
  };
  // Cylinder lying along y: wall then the +y end cap.
  const cylY = (y0: number, y1: number, cx: number, cz: number, r: number, end = 'paper', side = 'body') => {
    const arc = (y: number, a0: number, a1: number, n = 24): V3[] => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), y, cz + r * Math.sin(a)] as V3; });
    const a0 = -Math.PI / 4, a1 = 3 * Math.PI / 4;
    return poly([...arc(y0, a0, a1), ...arc(y1, a0, a1).reverse()], `f ${side}`) + poly(arc(y1, 0, 2 * Math.PI, 40), `f ${end}`);
  };
  // Quadratic curve through 3D control points, sampled.
  const curve = (a: V3, c: V3, b: V3, n = 32): V3[] => Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, v = 1 - u; return [0, 1, 2].map((j) => v * v * a[j] + 2 * v * u * c[j] + u * u * b[j]) as V3;
  });
  // Dashed motion path ending in a solid triangle head; optional dot at the start (DESIGN §8.17).
  const arrow = (ps: V3[], { dot = false, head = 11, march = true } = {}) => {
    const a = P(...ps[ps.length - 2]), b = P(...ps[ps.length - 1]);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
    const tip = [b[0] + ux * head * .6, b[1] + uy * head * .6], base = [b[0] - ux * head * .4, b[1] - uy * head * .4];
    const h = [tip, [base[0] - uy * head * .5, base[1] + ux * head * .5], [base[0] + uy * head * .5, base[1] - ux * head * .5]];
    const s = P(...ps[0]);
    return `<path class="dash${march ? ' march' : ''}" d="M${pts(ps)}"/>` +
      `<path class="head" d="M${h.map((p) => p.map(f).join(' ')).join('L')}Z"/>` +
      (dot ? `<circle class="head" cx="${f(s[0])}" cy="${f(s[1])}" r="4"/>` : '');
  };
  // Upright prism over any convex plan (a box turned to any angle, a hexagonal post): the walls facing the viewer
  // back to front, then the top. Walls facing +y more than +x take the `front` fill, like box().
  const prism = (plan: [number, number][], z: number, h: number, top = 'paper', side = 'body', front = side) => {
    const cx = plan.reduce((s, p) => s + p[0], 0) / plan.length, cy = plan.reduce((s, p) => s + p[1], 0) / plan.length;
    return plan.map((a, i) => {
      const b = plan[(i + 1) % plan.length], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      let nx = b[1] - a[1], ny = a[0] - b[0];
      if (nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
      return { a, b, d: mx + my, nx, ny };
    }).filter((w) => w.nx + w.ny > 1e-6).sort((p, q) => p.d - q.d)
      .map(({ a, b, nx, ny }) => poly([[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z + h], [a[0], a[1], z + h]], `f ${ny > nx ? front : side}`)).join('') +
      poly(plan.map(([x, y]) => [x, y, z + h] as V3), `f ${top}`);
  };
  return { P, D, TOP, FRONT, SIDE, on, poly, line, box, prism, cyl, cylX, cylY, ring, curve, arrow, viewBox: `0 0 ${f(W)} ${f(H)}` };
}

// Hue groups: wrap a part in hue('b', svg) and its body / tint fills take that hue (DESIGN §8.17, coloured slots).
export const hue = (h: 'a' | 'b' | 'c', inner: string) => `<g class="h${h}">${inner}</g>`;
