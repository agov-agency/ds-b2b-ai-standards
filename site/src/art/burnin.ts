// Scenario "Weekly check for conversion campaigns": a lamp burn-in stand. Every ad is a lamp on its own energy meter.
// One lamp eats two norms of energy without ever lighting, so its relay trips and cuts it; the brightest lamp is copied
// into the two empty sockets at the front of the stand.
import { kernel, hue, k, lerp, f, type Piece } from './iso';

const PERIOD = 8, TAU = 2 * Math.PI;
const BW = 124, BD = 104, BZ = 28, SY = 0, N = 6;                                   // bench; lamps are drawn at their cell's origin
const CELL = (i: number): [number, number] => [22 + (i % 3) * 40, 38 + Math.floor(i / 3) * 52];  // socket x, y: back row 0-2, front row 3-5
const DUD = 2, BEST = 0, NEW = [4, 5];                                              // the lamp that never lights, the one copied
const LOOK = ['body', 'tint', 'paper', 'tint'];                                      // glass per test lamp: bright, dim, dark, dim
const K = kernel([[0, 0, 0], [BW, 0, 0], [0, BD, 0], [BW, BD, 0], [22, 38, BZ + 100], [102, 38, BZ + 56], [22, 90, BZ + 96]], 20);
const { P, on, line, box, cyl, FRONT, TOP } = K;
const at = (i: number, g: string) => { const [x, y] = CELL(i), [dx, dy] = K.D(x, y, 0); return `<g transform="translate(${f(dx)} ${f(dy)})">${g}</g>`; };

const lit = (s: string, a = 1) => (a > .01 ? `<g class="lit" style="opacity:${f(Math.min(1, a))}">${s}</g>` : '');

// A screw-base lamp standing in its socket at height z: threaded cap, neck, round glass, a filament inside
function lamp(x: number, z: number, glass: string, a = 1) {
  let g = cyl(x, SY, z, 4.6, 9, 'paper', 'body');
  for (const dz of [2.5, 5, 7.5]) g += line([[x - 3.3, SY + 3.3, z + dz], [x + 3.3, SY + 3.3, z + dz + 1]], 'det');
  const [nx, ny] = P(x, SY, z + 9), [cx, cy] = P(x, SY, z + 25), R = 12.5;
  g += `<path class="f ${glass}" d="M${f(nx - 5)} ${f(ny)}L${f(cx - R * .62)} ${f(cy + R * .78)}A${R} ${R} 0 1 1 ${f(cx + R * .62)} ${f(cy + R * .78)}L${f(nx + 5)} ${f(ny)}Z"/>`;
  g += `<path class="det" d="M${f(nx - 2)} ${f(ny - 1)}V${f(cy + 2)}l2 -3l2 3l2 -3l2 3M${f(nx + 2)} ${f(ny - 1)}V${f(cy + 2)}"/><path class="det" d="M${f(cx - R * .55)} ${f(cy - R * .2)}A${R * .6} ${R * .6} 0 0 1 ${f(cx - R * .1)} ${f(cy - R * .62)}"/>`;
  return a < .999 ? `<g style="opacity:${f(a)}">${g}</g>` : g;
}

// Meter behind each socket: a window with the spinning disc edge-on (its mark sweeps across) and a bar of energy used,
// ticked at one and two norms; the relay toggle sits on its top (up = closed, tipped back = tripped)
function meter(spin: number, used: number) {
  const mark = Math.cos(spin) * 7, front = Math.sin(spin) > 0;
  return box(-13, -24, BZ, 26, 7, 22, 'paper', 'body', 'tint') + on(FRONT(-13, -17, BZ + 22),
    `<rect class="f paper" x="3" y="4" width="13" height="8" rx=".5"/><line class="det" x1="4" y1="9" x2="15" y2="9"/>` +
    (front ? `<rect class="f blk" x="${f(8.5 + mark)}" y="8" width="2.4" height="2" />` : '') +
    `<rect class="f paper" x="19" y="4" width="4" height="15" rx=".5"/><rect class="f body" x="19.6" y="${f(19 - 14.4 * used)}" width="2.8" height="${f(14.4 * used)}"/>` +
    `<line class="det" x1="17.5" y1="11.5" x2="19" y2="11.5"/><line class="det" x1="17.5" y1="4.6" x2="19" y2="4.6"/>`) +
    line([[0, -17, BZ + 2], [0, -8, BZ]], 'det');
}
const toggle = (off: number) => {
  const a = lerp(.35, -.9, off), len = 11;
  return box(-4, -24, BZ + 22, 8, 7, 2, 'paper', 'body') + line([[0, -20.5, BZ + 24], [0, -20.5 + Math.sin(a) * len, BZ + 24 + Math.cos(a) * len]], 'f') +
    cyl(0, -20.5 + Math.sin(a) * len, BZ + 24 + Math.cos(a) * len - 1.5, 2, 3, 'paper', 'body');
};
const socket = () => box(-8, -8, BZ, 16, 16, 3, 'paper', 'body', 'tint') + cyl(0, 0, BZ + 3, 6.5, 6, 'paper', 'body') + cyl(0, 0, BZ + 9, 4.8, 1, 'blk', 'blk');

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const trip = k(t, 3.4, 3.9) - k(t, 7.3, 8), used = Math.min(1, t / 3.6) * (1 - k(t, 7.3, 8));
  const drop = NEW.map((_, q) => 46 * (1 - k(t, 4.2 + q * .5, 5.2 + q * .5)) + 46 * k(t, 7, 7.8));
  const glow = NEW.map((_, q) => k(t, 5.1 + q * .5, 5.6 + q * .5) * (1 - k(t, 6.9, 7.3)));
  const show = NEW.map((_, q) => k(t, 3.9 + q * .5, 4.4 + q * .5) * (1 - k(t, 7.3, 7.9)));
  let s = box(0, 0, 0, BW, BD, BZ, 'paper', 'body', 'tint') + on(TOP(0, 0, BZ), `<rect class="det" x="4" y="4" width="${BW - 8}" height="${BD - 8}" rx="1"/>`);
  for (let i = 0; i < N; i++) {
    const test = i < 4, q = i - 4;
    const rate = i === DUD ? 3 : test ? 1.2 : glow[q] * 1.2;
    let c = meter(i === DUD && trip > .5 ? TAU * 3 * 3 * 3.9 / PERIOD : TAU * 3 * rate * t / PERIOD, i === DUD ? used : test ? .35 + .1 * (i % 2) : .2 * glow[q]);
    c += toggle(i === DUD ? trip : 0) + (i === DUD && trip > .02 ? lit(toggle(trip), trip) : '') + socket();
    if (test) { const l = lamp(0, BZ + 9, LOOK[i]); c += i === BEST ? l + lit(l) : l; }
    else if (show[q] > .01) c += lamp(0, BZ + 9 + drop[q], glow[q] > .5 ? 'body' : 'paper', show[q]) + lit(lamp(0, BZ + 9 + drop[q], 'body'), glow[q] * show[q]);
    s += at(i, c);
  }
  const [bx, by] = CELL(BEST), [nx, ny] = CELL(NEW[0]);
  return hue('a', s) + K.arrow(K.curve([bx, by, BZ + 58], [(bx + nx) / 2 - 10, (by + ny) / 2, BZ + 100], [nx - 4, ny, BZ + 62]), { dot: true });
}

export const burnin: Piece = {
  aria: 'A lamp burn-in stand. Each lamp sits on its own energy meter; the one that uses two norms without lighting is cut off by its relay, and the brightest lamp is copied into the two empty sockets.',
  period: PERIOD, rest: 5.9, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
