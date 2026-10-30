// Scenario "Competitor watch" (option): a blink comparator, the astronomers' machine that flips between two plates of
// the same sky to find what moved. Every week a new plate rises out of the feed slot, the pair slides one place along
// (this week next to last week) and the oldest drops into the slot at the far end. The shutter on the head keeps
// flipping the view between the two; the mark that is new on this week's plate lights.
import { kernel, hue, k, f, type Piece, type V3 } from './iso';
import { lit } from './icons';

const PERIOD = 9, WK = 3, TAU = 2 * Math.PI;
const BW = 228, BD = 100, BZ = 12, TZ = 30;                                        // plinth; table top
const PW = 40, PD = 34, PT = 2, PY = 34, PITCH = 52, SX = (n: number) => 18 + n * PITCH; // plate size; slot n's near-left corner x
const DEEP = -70;
// Marks on every plate: the rivals, big to small (priority), and one new mark per week (cycles every 3 plates)
const FIELD: [number, number, number][] = [[9, 10, 3.4], [29, 8, 2.4], [16, 25, 2.4], [32, 26, 1.7], [6, 28, 1.7], [23, 15, 1.2], [35, 16, 1.2]];
const NEW: [number, number][] = [[31, 17], [11, 18], [24, 29]];
const K = kernel([[0, 0, 0], [BW, 0, 0], [0, BD, 0], [BW, BD, 0], [SX(1), PY - 16, TZ + 66], [SX(2) + PW, PY - 16, TZ + 66], [BW, BD, -20]], 20);
const { P, on, line, box, cyl, cylX, TOP, FRONT } = K;

// A hole in the table and the column above it: anything below the top shows only through the hole. A trapdoor lid
// just under the top slides open sideways (under the table) and back.
const column = (x0: number, x1: number, y0: number, y1: number) => ([[x0, y0, 300], [x1, y0, 300], [x1, y0, TZ], [x1, y1, TZ], [x0, y1, TZ], [x0, y1, 300]] as V3[]).map((p) => P(...p).map(f).join(' ')).join('L');
const clip = (n: number, g: string, id: string) => `<clipPath id="bl-${id}"><path d="M${column(SX(n) - 2, SX(n) + PW + 2, PY - 2, PY + PD + 2)}Z"/></clipPath><g clip-path="url(#bl-${id})">${g}</g>`;
const hole = (n: number, open: number) => clip(n, on(TOP(SX(n) - 2, PY - 2, TZ - .5), `<rect class="f blk" width="${PW + 4}" height="${PD + 4}"/>`) +
  on(TOP(SX(n) - 2 + open * (PW + 6), PY - 2, TZ - .5), `<rect class="f tint" width="${PW + 4}" height="${PD + 4}"/><path class="det" d="M4 ${PD / 2 - 2}v8M7 ${PD / 2 - 2}v8"/>`), `h${n}`) +
  on(TOP(SX(n) - 2, PY - 2, TZ), `<rect class="det" width="${PW + 4}" height="${PD + 4}"/>`);

function plate(p: number, x: number, z: number, hot: number) {
  const [mx, my] = NEW[((p % 3) + 3) % 3];
  let g = `<rect class="f paper" width="${PW}" height="${PD}"/><path class="det" d="M${PW / 2} 3V${PD - 3}M3 ${PD / 2}H${PW - 3}"/>`;
  g += FIELD.map(([u, v, r]) => `<circle class="f blk" cx="${u}" cy="${v}" r="${r}"/>`).join('') + `<circle class="f blk" cx="${mx}" cy="${my}" r="2.6"/>`;
  const mark = `<circle class="f body" cx="${mx}" cy="${my}" r="2.6"/><circle class="hl" cx="${mx}" cy="${my}" r="5.5"/><path class="hl" d="M${mx - 9} ${my}h2.5M${mx + 9} ${my}h-2.5M${mx} ${my - 9}v2.5M${mx} ${my + 9}v-2.5"/>`;
  return box(x, PY, z, PW, PD, PT, 'paper', 'body', 'tint') + on(TOP(x, PY, z + PT), g + lit(mark, hot));
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const wk = Math.floor(t / WK), w = t - wk * WK;
  const rise = k(w, .2, .8), slide = k(w, .85, 1.6), drop = k(w, 1.75, 2.3);
  const feed = k(w, 0, .2) - k(w, 1.6, 1.9), sink = k(w, 1.6, 1.85) - k(w, 2.35, 2.7);
  let s = K.plinth(0, 0, BW, BD) + box(6, PY - 20, BZ, BW - 12, PD + 32, TZ - BZ, 'paper', 'body', 'tint');
  // Front panel: a dial under each viewing slot
  const spin = 2 * TAU * t / PERIOD;
  s += on(FRONT(6, PY + PD + 12, TZ), [1, 2].map((n) => { const cx = SX(n) + PW / 2 - 6; return `<circle class="f paper" cx="${cx}" cy="9" r="4.5"/><path class="det" d="M${cx} 9l${f(3.4 * Math.cos(spin + n))} ${f(3.4 * Math.sin(spin + n))}"/>`; }).join('') + `<path class="det" d="M4 3H${BW - 16}"/>`);
  s += hole(0, sink) + hole(3, feed);
  // Rails the plates ride on
  s += line([[SX(0), PY + 5, TZ + .2], [SX(3) + PW, PY + 5, TZ + .2]], 'det') + line([[SX(0), PY + PD - 5, TZ + .2], [SX(3) + PW, PY + PD - 5, TZ + .2]], 'det');
  // Bridge posts behind the viewing pair
  const bx0 = SX(1) - 8, bx1 = SX(2) + PW + 2;
  s += box(bx0, PY - 14, TZ, 6, 6, 44, 'paper', 'body') + box(bx1, PY - 14, TZ, 6, 6, 44, 'paper', 'body', 'tint');
  // Plates: q is the slot each one starts the week in (3 = still below the feed slot)
  for (const q of [1, 2, 3]) {
    const p = wk + q - 1, x = SX(q) - PITCH * slide;
    if (q === 1) { // the oldest slides into the far slot, then drops
      s += drop > .001 ? clip(0, plate(p, x, TZ + (DEEP - TZ) * drop, 0), 'out') : plate(p, x, TZ, 0); // rides the shut lid until it opens
    } else if (q === 3) { // rises out of the feed slot, then slides into this week's place and lights
      s += rise < .999 ? clip(3, plate(p, x, DEEP + (TZ - DEEP) * rise, 0), 'in') : plate(p, x, TZ, k(w, 1.7, 2.1));
    } else s += plate(p, x, TZ, 1 - k(w, .85, 1.1));
  }
  // Beam over the pair: an arm out to each plate with its objective, the head between them with the eyepiece leaning
  // out to the viewer, and the shutter disc on top that keeps flipping the view between the two plates
  s += cylX(bx0 - 2, bx1 + 8, PY - 11, TZ + 46, 3.4);
  for (const n of [1, 2]) {
    const cx = SX(n) + PW / 2, cy = PY + PD / 2;
    s += box(cx - 3, PY - 12, TZ + 42, 6, cy - PY + 12, 5, 'paper', 'body', 'tint') + cyl(cx, cy, TZ + 26, 4.5, 16, 'paper', 'body') + cyl(cx, cy, TZ + 22, 2.8, 4, 'paper', 'tint');
  }
  const hx = (SX(1) + SX(2) + PW) / 2, eye: V3[] = [[hx, PY - 4, TZ + 54], [hx, PY + 8, TZ + 66]];
  s += box(hx - 9, PY - 16, TZ + 47, 18, 16, 12, 'paper', 'body', 'tint');
  s += line(eye, 'tube-o') + line(eye, 'tube-i') + cyl(hx, PY + 8, TZ + 64, 3.6, 5, 'paper', 'body');
  const a = TAU * 6 * t / PERIOD;
  s += cyl(hx, PY - 8, TZ + 59, 1.4, 3, 'paper', 'body') + on(TOP(hx, PY - 8, TZ + 62), `<circle class="f paper" r="7"/><path class="f blk" d="M0 0L${f(7 * Math.cos(a))} ${f(7 * Math.sin(a))}A7 7 0 0 1 ${f(-7 * Math.cos(a))} ${f(-7 * Math.sin(a))}Z"/><circle class="f paper" r="1.4"/>`);
  return hue('a', s) + K.arrow([[SX(3) + PW / 2, PY + PD + 6, TZ + .5], [SX(0) + PW / 2 + 8, PY + PD + 6, TZ + .5]], { dot: true });
}

export const blink: Piece = {
  aria: 'A blink comparator: this week’s plate beside last week’s, a shutter flipping between them. The mark that is new this week lights; each week a new plate rises in and the oldest drops away.',
  period: PERIOD, rest: 2.6, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
