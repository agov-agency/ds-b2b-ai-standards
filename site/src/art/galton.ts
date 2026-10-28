// Scenario "Targeting vs who actually buys": a Galton board. The budget drops as balls from the hopper through the pins
// into bins. Every bin lets its balls out at the bottom: most roll off to the waste bucket, only the two right-hand bins
// feed the deals box. Turning the screw on the side swings the flipper under the hopper, and the pile moves over to the
// bins that pay. No ball appears or vanishes: each comes out of the hopper pile and ends in a box.
import { kernel, hue, keys, lerp, f, IN, OUT, EASY, type Piece, type V3 } from './iso';

const PERIOD = 10, DT = .25, BW = 150, BT = 14, BZ = 34, BH = 214, TOP = BZ + BH;  // board width, thickness, bottom, height
const PIN0 = 70, ROWS = 8, PH = 9, PW = 9, BIN0 = 154, NB = 8, BINW = (BW - 20) / NB, BALL = 3.1;
const PAY = 6, XD = 10 + PAY * BINW;                                         // bins from PAY up feed the deals box; trough divide
const PIV = [BW / 2, 46], FL = 36, SW = 1.2;                                 // flipper pivot, length, swing (rad)
const SERVE = 1.15, YC = BT + 6, ZW = (x: number) => 30 - (XD - x) * .034, ZP = (x: number) => 30 - (x - XD) * .06;  // trough floor
const WX = -22, PX = BW + 14, RIM = 24;                                       // where the trough drops into each box; box rim
const K = kernel([[-44, -26, 0], [BW + 34, BT + 20, 0], [-44, BT + 20, 0], [BW + 26, -26, TOP + 6], [-6, -6, TOP + 6]], 22);
const { P, on, box, cylX, poly, SIDE, FRONT, TOP: TOPF, arrow } = K;
const circ = (cls: string, x: number, y: number, r = BALL) => `<circle class="f ${cls}" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
const sphere = (p: V3, cls: string) => { const [sx, sy] = P(...p); return circ(cls, sx, sy); };

const hash = (i: number, r: number) => { const x = Math.sin(i * 127.1 + r * 311.7) * 43758.5453; return x - Math.floor(x); };
// The flipper: left while the targeting is off, swung right by the screw, back again for the loop
const swing = (t: number) => { t = ((t % PERIOD) + PERIOD) % PERIOD; return keys(t, [[0, -SW], [3.2, -SW, EASY], [4.6, SW], [8.4, SW, EASY], [9.8, -SW]]); };
const tipOf = (a: number) => [PIV[0] + FL * Math.sin(a), PIV[1] + FL * Math.cos(a)];
const stackY = (lv: number) => BH - 5 - BALL - lv * 2 * BALL;
const binX = (b: number) => 10 + (b + .5) * BINW;

// Every ball of a few loops, simulated once: its drop time, path, bin, when it reaches the stack and when it leaves.
// Each bin lets one ball out every SERVE seconds, so the queues settle into the same loop every period.
type Ball = { t0: number; x0: number; steps: number[]; bin: number; land: number; out: number };
const LOOPS = 4, LAST = (LOOPS - 1) * PERIOD;
const T_PIN = .4, ROW = .085, T_BIN = T_PIN + ROWS * ROW;
const BALLS: Ball[] = [];
{
  const free = Array(NB).fill(-1e9);
  for (let i = 0; i < LOOPS * PERIOD / DT; i++) {
    const t0 = i * DT, a = swing(t0 + .3), steps = Array.from({ length: ROWS }, (_, r) => (hash(i % (PERIOD / DT), r) < .5 ? -PW / 2 : PW / 2));
    const x0 = tipOf(a)[0], xe = x0 + steps.reduce((s, v) => s + v, 0);
    const bin = Math.min(NB - 1, Math.max(0, Math.floor((xe - 10) / BINW)));
    const land = t0 + T_BIN + .35, out = Math.max(land + .25, free[bin] + SERVE);
    free[bin] = out;
    BALLS.push({ t0, x0, steps, bin, land, out });
  }
}
// The stack level a ball sits at: the balls under it, each easing away as it leaves
const level = (b: Ball, T: number) => BALLS.reduce((n, o) => n + (o.bin === b.bin && o.land < b.land && o.out + .2 > T ? 1 - keys(T, [[o.out, 0, IN], [o.out + .2, 1]]) : 0), 0);

// Where a ball is at absolute time T: on the board face (2D, local) or in front of it (3D), or null before / after
function where(b: Ball, T: number): { face?: [number, number]; at?: V3 } | null {
  const u = T - b.t0;
  if (u < 0) return null;
  if (u < .12) return { face: [BW / 2, lerp(32, PIV[1] - BALL, keys(u, [[0, 0, IN], [.12, 1]]))] };
  if (u < .3) {                                                               // slides down the flipper
    const a = swing(T), s = keys(u, [[.12, 0, IN], [.3, 1]]);
    return { face: [PIV[0] + FL * s * Math.sin(a), PIV[1] + FL * s * Math.cos(a) - BALL] };
  }
  if (u < T_PIN) { const y0 = tipOf(swing(b.t0 + .3))[1] - BALL; return { face: [b.x0, lerp(y0, PIN0 - 7, keys(u, [[.3, 0, IN], [T_PIN, 1]]))] }; }
  if (u < T_BIN) {                                                            // through the pins: a sideways hop per row
    const r = Math.min(ROWS - 1, Math.floor((u - T_PIN) / ROW)), e = (u - T_PIN - r * ROW) / ROW;
    const x = b.x0 + b.steps.slice(0, r).reduce((s, v) => s + v, 0) + b.steps[r] * keys(e, [[0, 0], [1, 1]]);
    return { face: [x, PIN0 - 7 + (r + e) * PH - 2.2 * Math.sin(Math.PI * e)] };
  }
  if (T < b.out) {                                                            // into the bin and down onto the stack
    const xe = b.x0 + b.steps.reduce((s, v) => s + v, 0), v = u - T_BIN, y = PIN0 - 7 + ROWS * PH + 40 * v + 300 * v * v;
    return { face: [lerp(xe, binX(b.bin), Math.min(1, v / .2)), Math.min(y, stackY(level(b, T)))] };
  }
  // Out through the slot at the bin's foot, into the trough, along it and down into a box
  const v = T - b.out, x0 = binX(b.bin), pay = b.bin >= PAY, zf = pay ? ZP : ZW, z0 = TOP - stackY(0);
  if (v < .22) return { at: [x0, lerp(BT, YC, keys(v, [[0, 0, EASY], [.22, 1]])), lerp(z0, zf(x0) + BALL, keys(v, [[0, 0, IN], [.22, 1]]))] };
  const w = v - .22, d = 30 * w + 70 * w * w, end = pay ? PX : WX, L = Math.abs(end - x0);
  if (d < L) { const x = x0 + (pay ? d : -d); return { at: [x, YC, zf(x) + BALL] }; }
  const wd = w - (Math.sqrt(900 + 280 * L) - 30) / 140, z = zf(end) + BALL - 160 * wd * wd - 20 * wd;
  return z < 4 ? null : { at: [end + (pay ? 1 : -1) * 18 * wd, YC, z] };
}

// An open box the balls drop into: the inside and rim first, the balls, then the walls that hide them
const crateIn = (x: number) => box(x, BT - 4, 0, 24, 22, RIM, 'paper', 'body', 'tint') + on(TOPF(x, BT - 4, RIM), '<rect class="f blk" x="2.5" y="2.5" width="19" height="17"/>');
const crateOut = (x: number) => poly([[x, BT + 18, 0], [x + 24, BT + 18, 0], [x + 24, BT + 18, RIM], [x + 21.5, BT + 15.5, RIM], [x + 2.5, BT + 15.5, RIM], [x, BT + 18, RIM]], 'f tint') +
  poly([[x + 24, BT - 4, 0], [x + 24, BT + 18, 0], [x + 24, BT + 18, RIM], [x + 21.5, BT + 15.5, RIM], [x + 21.5, BT - 1.5, RIM], [x + 24, BT - 4, RIM]], 'f body');

// A sloped trough run in front of the board: back wall, floor, then (after the balls) the front lip
const run = (x0: number, x1: number, zf: (x: number) => number) => ({
  back: poly([[x0, BT + 1, zf(x0) - 2], [x1, BT + 1, zf(x1) - 2], [x1, BT + 1, zf(x1) + 6], [x0, BT + 1, zf(x0) + 6]], 'f paper') +
    poly([[x0, BT + 1, zf(x0)], [x1, BT + 1, zf(x1)], [x1, BT + 11, zf(x1)], [x0, BT + 11, zf(x0)]], 'f tint'),
  front: poly([[x0, BT + 11, zf(x0) - 3], [x1, BT + 11, zf(x1) - 3], [x1, BT + 11, zf(x1) + 4], [x0, BT + 11, zf(x0) + 4]], 'f body'),
});

function face(t: number, T: number, live: Ball[]) {
  const a = swing(t);
  let g = `<path class="f tint" d="M0 0H${BW}V${BH}H0Z"/>`;
  // Hopper with its pile of balls (the source), and the flipper under its throat
  g += `<path class="f paper" d="M14 10H${BW - 14}L${BW / 2 + 8} 40H${BW / 2 - 8}Z"/>`;
  for (let r = 0; r < 3; r++) {
    const y = 34 - r * 5.4, n = Math.floor((68 - (y - 10) * 2 - BALL - 1) / 6.4 - (r % 2) / 2);
    for (let c = -n; c <= n; c++) g += circ('paper', BW / 2 + (c + (r % 2) / 2) * 6.4, y);
  }
  const [ex, ey] = tipOf(a), nx = Math.cos(a) * 1.6, ny = -Math.sin(a) * 1.6;
  g += `<g class="lit"><path class="f body" d="M${f(PIV[0] - nx)} ${f(PIV[1] - ny)}L${f(ex - nx)} ${f(ey - ny)}L${f(ex + nx)} ${f(ey + ny)}L${f(PIV[0] + nx)} ${f(PIV[1] + ny)}Z"/></g><circle class="f paper" cx="${PIV[0]}" cy="${PIV[1]}" r="2.4"/>`;
  for (let r = 0; r < ROWS; r++) for (let c = -7; c <= 7; c++) {
    const x = BW / 2 + c * PW + (r % 2 ? PW / 2 : 0);
    if (x > 8 && x < BW - 8) g += `<circle class="f paper" cx="${f(x)}" cy="${PIN0 + r * PH}" r="1.5"/>`;
  }
  for (let b = 1; b < NB; b++) g += `<rect class="f paper" x="${f(10 + b * BINW - 1.2)}" y="${BIN0 - 4}" width="2.4" height="${BH - BIN0 + 4}"/>`;
  for (const b of live) { const p = where(b, T); if (p?.face) g += circ(b.bin >= PAY && p.face[1] > BIN0 ? 'body' : 'paper', ...p.face); }
  // Frame lip round the face, with a slot at the foot of every bin
  g += `<path class="f paper" fill-rule="evenodd" d="M-4 -4H${BW + 4}V${BH + 4}H-4ZM4 4V${BH - 4}H${BW - 4}V4Z"/>`;
  for (let b = 0; b < NB; b++) g += `<rect class="f blk" x="${f(binX(b) - 3.6)}" y="${BH - 4}" width="7.2" height="4"/>`;
  return g;
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const T = t + LAST, live = BALLS.filter((b) => b.t0 <= T && b.out + 3 > T);
  const turn = 2 * Math.PI * 1.5 * (swing(t) + SW) / (2 * SW);
  let s = '';
  // Feet reaching back, the board, its face
  for (const x of [10, BW - 26]) s += box(x, -26, 0, 16, BT + 22, BZ, 'paper', 'body', 'tint');
  s += box(-4, -4, BZ - 4, BW + 8, BT + 4, BH + 8, 'paper', 'body', 'paper');
  s += on(FRONT(0, BT, TOP), face(t, T, live));
  // Waste bucket left, deals box right, the two trough runs between, then every ball that has left its bin
  const waste = run(WX - 4, XD, ZW), deals = run(XD, PX + 4, ZP);
  s += crateIn(-44) + `<g class="lit">${crateIn(BW + 10)}</g>` + waste.back + deals.back;
  const out = live.map((b) => ({ b, p: where(b, T) })).filter((o) => o.p?.at).sort((p, q) => p.p!.at![0] - q.p!.at![0]);
  s += out.map((o) => sphere(o.p!.at!, o.b.bin >= PAY ? 'body' : 'paper')).map((g, i) => out[i].b.bin >= PAY ? `<g class="lit">${g}</g>` : g).join('');
  s += waste.front + `<g class="lit">${deals.front}</g>` + crateOut(-44) + `<g class="lit">${crateOut(BW + 10)}</g>`;
  // Adjusting screw on the right edge: a threaded rod into the board and a knurled knob
  const zk = TOP - 50;
  s += cylX(BW + 4, BW + 12, BT / 2 - 2, zk, 2.2) + cylX(BW + 12, BW + 22, BT / 2 - 2, zk, 7, 'paper', 'tint') +
    on(SIDE(BW + 22, BT / 2 - 2, zk), `<g class="lit"><path class="f body" d="M${f(-5 * Math.sin(turn))} ${f(-5 * Math.cos(turn))}L${f(5 * Math.sin(turn))} ${f(5 * Math.cos(turn))}"/></g><circle class="det" r="2"/>`);
  s += on(TOPF(-4, -4, TOP + 4), `<rect class="det" x="${BW / 2 - 20}" y="3" width="40" height="${BT - 2}" rx="1"/>`);
  return hue('a', s) + arrow(K.curve([BW + 34, BT / 2, zk + 22], [BW + 40, BT / 2 + 6, zk], [BW + 30, BT / 2 + 8, zk - 16]), { dot: true });
}

export const galton: Piece = {
  aria: 'A Galton board. Balls fall from a hopper through pins into bins and roll out into a trough; only the right-hand bins feed the deals box. A screw on the side swings the flipper and the pile moves to those bins.',
  period: PERIOD, rest: 6.2, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
