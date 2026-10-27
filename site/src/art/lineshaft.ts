// Scenario "Company-level account routing": a workshop line shaft. One shaft under the ceiling drives every machine.
// The big accounts sit on big pulleys and spin flat out; the small ones on small pulleys barely turn. A belt fork moves
// one belt off its idle pulley onto the fixed one, and that small machine spins up: the account routed to the right owner.
import { kernel, hue, k, f, type Piece } from './iso';

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
const { on, poly, box, cylX, SIDE, arrow } = K;

const uv = (r: number, a: number) => `${f(-r * Math.cos(a))} ${f(-r * Math.sin(a))}`;
const spokes = (x: number, y: number, z: number, r: number, a: number) => on(SIDE(x, y, z),
  [0, 1, 2, 3].map((q) => `<path class="det" d="M${uv(2.5, a + q * TAU / 4)}L${uv(r - 2.5, a + q * TAU / 4)}"/>`).join('') + `<circle class="det" r="${r - 2}"/><circle class="f blk" r="1.6"/>`);
const drum = (x: number, w: number, y: number, z: number, r: number, a: number, side = 'body') => cylX(x - w / 2, x + w / 2, y, z, r, 'paper', side) + spokes(x + w / 2, y, z, r, a);

// Open belt between the shaft pulley and the floor pulley (both in the plane x = const): two flat strands
function belt(x: number, w: number, r1: number, r2: number, cls = 'f body') {
  const dy = FY, dz = FZ - SZ, L = Math.hypot(dy, dz), phi = Math.atan2(dz, dy), al = Math.acos((r1 - r2) / L);
  return [phi + al, phi - al].map((a) => {
    const y1 = r1 * Math.cos(a), z1 = SZ + r1 * Math.sin(a), y2 = FY + r2 * Math.cos(a), z2 = FZ + r2 * Math.sin(a);
    return poly([[x - w / 2, y1, z1], [x + w / 2, y1, z1], [x + w / 2, y2, z2], [x - w / 2, y2, z2]], cls);
  }).join('');
}

const machine = (x: number, w = 26) =>
  box(x - w / 2, FY - 14, 0, w, 30, FZ - 16, 'paper', 'body', 'tint') + on(K.FRONT(x - w / 2, FY + 16, FZ - 16), `<rect class="f paper" x="5" y="8" width="${w - 10}" height="8" rx=".5"/>`) +
  box(x - w / 2 + 3, FY - 4, FZ - 16, 4, 8, 16, 'paper', 'body');

const hanger = (x: number) => box(x - 4, -6, SZ, 8, 12, 22, 'paper', 'body', 'tint') + cylX(x - 5, x + 5, 0, SZ, 6, 'paper', 'tint');

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const th = TAU * TURNS * t / PERIOD, on1 = k(t, 1.6, 2.4) - k(t, 6.4, 7.2);     // belt fork position: 0 idle, 1 fixed
  // Fixed pulley angle: the belt's drive ramps in and out with the fork, integrated so the spin builds up smoothly
  let spin = 0;
  for (let i = 0, n = 48; i < n; i++) { const s = t * i / n; spin += (k(s, 1.9, 3) - k(s, 6.2, 7.2)) * TAU * TURNS / PERIOD * CR1 / CR2 * t / n; }
  let s = box(-10, -10, SZ + 22, 260, 20, 10, 'paper', 'body', 'blk');
  s += cylX(-6, 236, 0, SZ, 3);
  const parts: [number, string][] = [];
  [0, 96, 232].forEach((x) => parts.push([x - 2, hanger(x)]));
  ST.forEach((p) => parts.push([p.x, machine(p.x) + drum(p.x, p.w + 2, FY, FZ, p.r2, -th * p.r1 / p.r2) + belt(p.x, p.w, p.r1, p.r2) + drum(p.x, p.w + 2, 0, SZ, p.r1, -th)]));
  // Clutched station: belt slides from the idle pulley to the fixed one; the fork rides with it
  const bx = IDLE + (FIXED - IDLE) * on1;
  const fork = box(CX + 26, FY - 2, 0, 6, 6, FZ + 22, 'paper', 'body') + box(bx - CW / 2 - 4, FY - 4, FZ + 18, CX + 32 - bx + CW / 2 + 4, 4, 4, 'paper', 'body', 'tint') +
    box(bx - CW / 2 - 4, FY - 4, FZ + 12, 2, 4, 8, 'paper', 'body') + box(bx + CW / 2 + 2, FY - 4, FZ + 12, 2, 4, 8, 'paper', 'body');
  parts.push([CX, machine(CX, 46) + drum(IDLE, CW, FY, FZ, CR2, -th * CR1 / CR2 * (1 - on1), 'tint') +
    `<g class="lit">${drum(FIXED, CW, FY, FZ, CR2, -spin)}</g>` + `<g class="lit">${belt(bx, CW - 1, CR1, CR2)}</g>` + drum(CX, CW * 2 + 6, 0, SZ, CR1, -th) + fork]);
  s += parts.sort((a, b) => a[0] - b[0]).map((p) => p[1]).join('');
  return hue('a', s) + arrow(K.curve([CX + 40, FY + 30, FZ + 40], [CX + 30, FY + 40, FZ + 50], [CX + 14, FY + 36, FZ + 46]), { dot: true });
}

export const lineshaft: Piece = {
  aria: 'A workshop line shaft driving five machines by belts. Big pulleys spin fast, small ones barely turn; a belt fork shifts one belt onto its fixed pulley and that machine spins up.',
  period: PERIOD, rest: 3.2, viewBox: K.viewBox, focus: [0.6, 0.55], draw,
};
