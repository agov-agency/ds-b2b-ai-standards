// Scenario "Weekly check for conversion campaigns": a lamp burn-in stand. Every ad is a lamp on its own energy meter.
// One lamp eats two norms of energy without ever lighting, so its relay trips and cuts it; the brightest lamp is copied
// into the two empty sockets at the end of the stand.
import { kernel, hue, k, lerp, f, type Piece } from './iso';

const PERIOD = 8, TAU = 2 * Math.PI;
const BW = 236, BD = 46, BZ = 30, SY = 26, N = 6, X = (i: number) => 24 + i * 38;   // bench; socket lane y; socket x
const DUD = 2, BEST = 0, NEW = [4, 5];                                              // the lamp that never lights, the one copied
const LOOK = ['body', 'tint', 'paper', 'tint'];                                      // glass per test lamp: bright, dim, dark, dim
const K = kernel([[-4, -4, 0], [BW + 4, -4, 0], [-4, BD + 10, 0], [BW + 4, BD + 10, 0], [0, SY, BZ + 92], [BW, SY, BZ + 92]], 20);
const { P, on, line, box, cyl, FRONT, TOP } = K;

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

// Meter on the bench front: a window with the spinning disc edge-on (its mark sweeps across) and a bar of energy used,
// ticked at one and two norms
function meter(i: number, spin: number, used: number) {
  const x = X(i) - 13;
  const mark = Math.cos(spin) * 7, front = Math.sin(spin) > 0;
  return box(x, BD, 6, 26, 6, 20, 'paper', 'body', 'tint') + on(FRONT(x, BD + 6, 26),
    `<rect class="f paper" x="3" y="3" width="13" height="8" rx=".5"/><line class="det" x1="4" y1="8" x2="15" y2="8"/>` +
    (front ? `<rect class="f blk" x="${f(8.5 + mark)}" y="7" width="2.4" height="2" />` : '') +
    `<rect class="f paper" x="19" y="3" width="4" height="14" rx=".5"/><rect class="f body" x="19.6" y="${f(17 - 13.4 * used)}" width="2.8" height="${f(13.4 * used)}"/>` +
    `<line class="det" x1="17.5" y1="10" x2="19" y2="10"/><line class="det" x1="17.5" y1="3.6" x2="19" y2="3.6"/>`);
}

// Relay toggles on the bank at the back of the bench: up = closed, tipped back = tripped
const toggle = (i: number, off: number) => {
  const x = X(i), a = lerp(.35, -.9, off), len = 12;
  return box(x - 4, 3, BZ + 14, 8, 8, 2, 'paper', 'body') + line([[x, 7, BZ + 16], [x, 7 + Math.sin(a) * len, BZ + 16 + Math.cos(a) * len]], 'f') +
    cyl(x, 7 + Math.sin(a) * len, BZ + 16 + Math.cos(a) * len - 1.5, 2, 3, 'paper', 'body');
};

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const trip = k(t, 3.4, 3.9) - k(t, 7.3, 8), used = Math.min(1, t / 3.6) * (1 - k(t, 7.3, 8));
  const drop = NEW.map((_, q) => 46 * (1 - k(t, 4.2 + q * .5, 5.2 + q * .5)) + 46 * k(t, 7, 7.8));
  const glow = NEW.map((_, q) => k(t, 5.1 + q * .5, 5.6 + q * .5) * (1 - k(t, 6.9, 7.3)));
  const show = NEW.map((_, q) => k(t, 3.9 + q * .5, 4.4 + q * .5) * (1 - k(t, 7.3, 7.9)));
  let s = box(0, 0, 0, BW, BD, BZ, 'paper', 'body', 'tint') + on(TOP(0, 0, BZ), `<rect class="det" x="4" y="16" width="${BW - 8}" height="${BD - 20}" rx="1"/>`);
  s += box(0, 0, BZ, BW, 14, 14, 'paper', 'body', 'tint');
  for (let i = 0; i < N; i++) {
    const x = X(i), test = i < 4;
    s += line([[x, 12, BZ + 6], [x, SY - 6, BZ + 3]], 'det') + toggle(i, i === DUD ? trip : 0);
    s += box(x - 8, SY - 8, BZ, 16, 16, 3, 'paper', 'body', 'tint') + cyl(x, SY, BZ + 3, 6.5, 6, 'paper', 'body') + cyl(x, SY, BZ + 9, 4.8, 1, 'blk', 'blk');
    const rate = i === DUD ? 3 : test ? 1.2 : i === NEW[0] ? glow[0] * 1.2 : glow[1] * 1.2;
    const spin = TAU * 3 * rate * t / PERIOD;
    s += meter(i, i === DUD && trip > .5 ? TAU * 3 * 3 * 3.9 / PERIOD : spin, i === DUD ? used : test ? .35 + .1 * (i % 2) : .2 * glow[i - 4]);
    if (test) {
      const l = lamp(x, BZ + 9, LOOK[i]);
      s += i === BEST ? l + lit(l) : l;
    } else {
      const q = i - 4, l = lamp(x, BZ + 9 + drop[q], glow[q] > .5 ? 'body' : 'paper', show[q]);
      s += show[q] > .01 ? l + lit(lamp(x, BZ + 9 + drop[q], 'body'), glow[q] * show[q]) : '';
    }
  }
  if (trip > .02) s += lit(toggle(DUD, trip), trip);
  return hue('a', s) + K.arrow(K.curve([X(BEST), SY, BZ + 62], [lerp(X(BEST), X(NEW[0]), .5), SY - 20, BZ + 110], [X(NEW[0]) - 4, SY, BZ + 66]), { dot: true });
}

export const burnin: Piece = {
  aria: 'A lamp burn-in stand. Each lamp sits on its own energy meter; the one that uses two norms without lighting is cut off by its relay, and the brightest lamp is copied into the two empty sockets.',
  period: PERIOD, rest: 5.9, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
