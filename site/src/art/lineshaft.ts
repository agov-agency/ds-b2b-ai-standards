// Scenario "Company-level account routing": a workshop line shaft. One shaft under the ceiling drives every machine.
// The big accounts sit on big pulleys and spin flat out; the small ones on small pulleys barely turn. A belt fork moves
// one belt off its idle pulley onto the fixed one, and that small machine spins up: the account routed to the right owner.
import { kernel, hue, k, f, type Piece, type V3 } from './iso';

const PERIOD = 8, TAU = 2 * Math.PI;
const SZ = 168, FY = 84, FZ = 52, TURNS = 3;                                  // shaft height; floor pulley y, z; shaft turns per loop
const ST = [
  { x: 24, r1: 20, r2: 10, w: 10 },
  { x: 70, r1: 20, r2: 10, w: 10 },
  { x: 116, r1: 8, r2: 16, w: 6 },
  { x: 156, r1: 8, r2: 16, w: 6 },
];
const CX = 208, CR1 = 16, CR2 = 13, CW = 11, IDLE = CX - 7, FIXED = CX + 7;     // the clutched station: wide drum above, idle + fixed below
const K = kernel([[-10, -10, 0], [250, -10, 0], [-10, FY + 26, 0], [250, FY + 26, 0], [-10, -10, SZ + 34], [250, -10, SZ + 34]], 22);
const { on, poly, box, cylX, SIDE } = K;

const uv = (r: number, a: number) => `${f(-r * Math.cos(a))} ${f(-r * Math.sin(a))}`;
const spokes = (x: number, y: number, z: number, r: number, a: number) => on(SIDE(x, y, z),
  [0, 1, 2, 3].map((q) => `<path class="det" d="M${uv(2.5, a + q * TAU / 4)}L${uv(r - 2.5, a + q * TAU / 4)}"/>`).join('') + `<circle class="det" r="${r - 2}"/><circle class="f blk" r="1.6"/>`);
const arc = (x: number, y: number, z: number, r: number, a0: number, a1: number, n = 24): V3[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [x, y + r * Math.cos(a), z + r * Math.sin(a)] as V3; });
// A pulley in two layers, so a belt can run between them: the rim, then the end face with its spokes
const rim = (x: number, w: number, y: number, z: number, r: number, side = 'tint') => cylX(x - w / 2, x + w / 2, y, z, r, 'paper', side).replace(/<path[^>]*>$/, '');
const face = (x: number, w: number, y: number, z: number, r: number, a: number) => poly(arc(x + w / 2, y, z, r, 0, TAU, 40), 'f paper') + spokes(x + w / 2, y, z, r, a);
const drum = (x: number, w: number, y: number, z: number, r: number, a: number, side = 'body') => rim(x, w, y, z, r, side) + face(x, w, y, z, r, a);

// Open belt between the shaft pulley and the floor pulley (both in the plane x = const). The back strand runs behind
// both rims; the front strand and the band wrapped on each rim's visible half go over them, and the end faces close it.
const VIS = [-Math.PI / 4, 3 * Math.PI / 4];                                   // the rim's visible half (as cylX draws it)
function belt(x: number, w: number, r1: number, r2: number, cls = 'f body') {
  const dy = FY, dz = FZ - SZ, L = Math.hypot(dy, dz), phi = Math.atan2(dz, dy), al = Math.acos((r1 - r2) / L);
  const strand = (a: number) => {
    const y1 = r1 * Math.cos(a), z1 = SZ + r1 * Math.sin(a), y2 = FY + r2 * Math.cos(a), z2 = FZ + r2 * Math.sin(a);
    return poly([[x - w / 2, y1, z1], [x + w / 2, y1, z1], [x + w / 2, y2, z2], [x - w / 2, y2, z2]], cls);
  };
  const wrap = (y: number, z: number, r: number, a0: number, a1: number) => {
    const lo = Math.max(a0, VIS[0]), hi = Math.min(a1, VIS[1]);
    return hi > lo ? poly([...arc(x - w / 2, y, z, r + .3, lo, hi), ...arc(x + w / 2, y, z, r + .3, lo, hi).reverse()], cls) : '';
  };
  return { back: strand(phi - al), front: wrap(FY, FZ, r2, phi - al, phi + al) + wrap(0, SZ, r1, phi + al, phi - al + TAU) + strand(phi + al) };
}

const machine = (x: number, w = 26) =>
  box(x - w / 2, FY - 14, 0, w, 30, FZ - 16, 'paper', 'body', 'tint') + on(K.FRONT(x - w / 2, FY + 16, FZ - 16), `<rect class="f paper" x="5" y="8" width="${w - 10}" height="8" rx=".5"/>`) +
  box(x - w / 2 + 3, FY - 4, FZ - 16, 4, 8, 16, 'paper', 'body');

const hanger = (x: number) => box(x - 4, -6, SZ, 8, 12, 22, 'paper', 'body', 'tint') + cylX(x - 5, x + 5, 0, SZ, 6, 'paper', 'tint');

// The clutched pulleys spin up and coast down with the belt: their angle is the integral of the drive share, scaled
// so a loop ends on a quarter turn (four spokes look the same) and the loop seam doesn't jump
const drive = (s: number) => k(s, 1.9, 3) - k(s, 6.2, 7.2), RATE = TAU * TURNS / PERIOD * CR1 / CR2;
const integ = (t: number, fn: (s: number) => number, n = 64) => { let a = 0; for (let i = 0; i < n; i++) a += fn(t * (i + .5) / n) * t / n; return a * RATE; };
const turned = (t: number, fn: (s: number) => number) => { const all = integ(PERIOD, fn, 256), q = Math.PI / 2; return integ(t, fn) * Math.max(1, Math.round(all / q)) * q / all; };

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const th = TAU * TURNS * t / PERIOD, on1 = k(t, 1.6, 2.4) - k(t, 6.4, 7.2);     // belt fork position: 0 idle, 1 fixed
  const spin = turned(t, (s) => drive(s)), idle = turned(t, (s) => 1 - drive(s));
  let s = box(-10, -10, SZ + 22, 260, 20, 10, 'paper', 'body', 'blk');
  s += cylX(-6, 236, 0, SZ, 3);
  const parts: [number, string][] = [];
  [0, 96, 232].forEach((x) => parts.push([x - 2, hanger(x)]));
  ST.forEach((p) => {
    const b = belt(p.x, p.w, p.r1, p.r2);
    parts.push([p.x, machine(p.x) + b.back + rim(p.x, p.w + 2, FY, FZ, p.r2) + rim(p.x, p.w + 2, 0, SZ, p.r1) + b.front +
      face(p.x, p.w + 2, FY, FZ, p.r2, -th * p.r1 / p.r2) + face(p.x, p.w + 2, 0, SZ, p.r1, -th)]);
  });
  // Clutched station: belt slides from the idle pulley to the fixed one; the fork rides with it
  const bx = IDLE + (FIXED - IDLE) * on1;
  const fork = box(CX + 26, FY - 2, 0, 6, 6, FZ + 22, 'paper', 'body') + box(bx - CW / 2 - 4, FY - 4, FZ + 18, CX + 32 - bx + CW / 2 + 4, 4, 4, 'paper', 'body', 'tint') +
    box(bx - CW / 2 - 4, FY - 4, FZ + 12, 2, 4, 8, 'paper', 'body') + box(bx + CW / 2 + 2, FY - 4, FZ + 12, 2, 4, 8, 'paper', 'body');
  const b = belt(bx, CW - 1, CR1, CR2);
  const idleFace = face(IDLE, CW, FY, FZ, CR2, -idle), onIdle = on1 < .5;          // the idle face covers the belt only while the belt is on it
  parts.push([CX, machine(CX, 46) + `<g class="lit">${b.back}</g>` + rim(IDLE, CW, FY, FZ, CR2, 'tint') + (onIdle ? '' : idleFace) + `<g class="lit">${rim(FIXED, CW, FY, FZ, CR2)}</g>` +
    rim(CX, CW * 2 + 6, 0, SZ, CR1) + `<g class="lit">${b.front}</g>` + (onIdle ? idleFace : '') + `<g class="lit">${face(FIXED, CW, FY, FZ, CR2, -spin)}</g>` + face(CX, CW * 2 + 6, 0, SZ, CR1, -th) + fork]);
  s += parts.sort((a, b) => a[0] - b[0]).map((p) => p[1]).join('');
  return hue('a', s);
}

export const lineshaft: Piece = {
  aria: 'A workshop line shaft driving five machines by belts. Big pulleys spin fast, small ones barely turn; a belt fork shifts one belt onto its fixed pulley and that machine spins up.',
  period: PERIOD, rest: 3.2, viewBox: K.viewBox, focus: [0.6, 0.55], draw,
};
