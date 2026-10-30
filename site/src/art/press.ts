// Skills hub hero: a hand-operated fly press. The top export sheet slides from the stack into the press, the
// ball arm swings and drives the platen down, the finding prints onto the sheet and slides out onto the tray, where
// it fades while the next sheet feeds in (DESIGN §8.17).
import { kernel, hue, k, f, type Piece, type V3 } from './iso';

const BED = 44, SH = 3, SW = 60, SD = 46, SY = 33, SX = 142, SC = 56; // bed top; sheet thickness, size, y; screw axis
const MX = 28, BX = 112, OX = 198, WALL = BED - 5.5 * SH, STROKE = 16; // sheet x in the magazine, on the bed, on the tray
const FX = 116, FW = 52, CH = 110, HUB = 166, ARM = 62, BALL = 8, RS = 1.2247; // RS: screen radius of a unit sphere
const sweep = Array.from({ length: 16 }, (_, i) => [SX + 72 * Math.cos(i * Math.PI / 8), SC + 72 * Math.sin(i * Math.PI / 8), HUB + 26] as V3);
const K = kernel([[16, 4, 0], [276, 4, 0], [16, 100, 0], [276, 100, 0], ...sweep], 24);
const { P, on, line, box, cyl, ring, TOP, FRONT, SIDE } = K;
const pt = (p: number[]) => `${f(p[0])} ${f(p[1])}`;

// Raw export: header band, ruled rows and columns. Finding: two text bars and a stamp with a check.
const raw = `<rect class="f tint" width="${SW}" height="8"/>` +
  [15, 22, 29, 36].map((y) => `<line class="det" x1="0" y1="${y}" x2="${SW}" y2="${y}"/>`).join('') +
  [18, 38].map((x) => `<line class="det" x1="${x}" y1="0" x2="${x}" y2="${SD}"/>`).join('');
const finding = `<rect class="f tint" x="6" y="9" width="24" height="5" rx="2.5"/><rect class="f tint" x="6" y="18" width="15" height="5" rx="2.5"/>` +
  `<circle class="f body" cx="40" cy="27" r="12"/><circle class="det" cx="40" cy="27" r="9"/>` +
  `<path class="f blk" transform="translate(40 27) rotate(-45) scale(1 1.6)" d="M-6-.5L-1.5 4 6-3.5 4.3-5.2-1.5.6-4.3-2.2Z"/>`;
const sheet = (x: number, z: number) => hue('b', box(x, SY, z, SW, SD, SH, 'paper', 'tint') + on(TOP(x, SY, z + SH), raw));
const card = (x: number, o: number) => `<g style="opacity:${o.toFixed(2)}">` +
  `<g class="lit">${hue('c', box(x, SY, BED, SW, SD, SH, 'paper', 'tint') + on(TOP(x, SY, BED + SH), finding))}</g>` + '</g>';

// Thread line on the front half of the screw, slanted like a helix.
// Points under lo are dropped, so a thread sinks into the boss instead of vanishing at once.
const thread = (z: number, lo = -Infinity) => {
  const ps = Array.from({ length: 9 }, (_, j) => {
    const a = -Math.PI / 4 + j * Math.PI / 8; return [SX + 5 * Math.cos(a), SC + 5 * Math.sin(a), z + 1.6 * (j / 8 - .5)] as V3;
  }).filter((p) => p[2] >= lo);
  return ps.length > 1 ? line(ps, 'det') : '';
};

// Fly arm through the hub: far ball, far rod, hub, near rod, near ball (painter's order turns with the arm).
function arm(hb: number, th: number) {
  const za = hb + 5;
  const ends = [0, Math.PI].map((d, i) => ({ i, a: th + d, x: SX + ARM * Math.cos(th + d), y: SC + ARM * Math.sin(th + d) }))
    .sort((p, q) => p.x + p.y - q.x - q.y);
  const at = (a: number, r: number) => P(SX + r * Math.cos(a), SC + r * Math.sin(a), za);
  const rod = (e: typeof ends[0], r0: number, r1: number) => {
    const s = at(e.a, r0), p = at(e.a, r1);
    const l = Math.hypot(p[0] - s[0], p[1] - s[1]) || 1, n = [-(p[1] - s[1]) / l * 3, (p[0] - s[0]) / l * 3];
    return `<path class="f tint" d="M${pt([s[0] + n[0], s[1] + n[1]])}L${pt([p[0] + n[0], p[1] + n[1]])}L${pt([p[0] - n[0], p[1] - n[1]])}L${pt([s[0] - n[0], s[1] - n[1]])}Z"/>`;
  };
  const ball = (e: typeof ends[0]) => { const p = P(e.x, e.y, za);
    return `<circle class="f body" cx="${f(p[0])}" cy="${f(p[1])}" r="${f(BALL * RS)}"/>` + line(ring(e.x, e.y, za, BALL, -Math.PI / 4, 3 * Math.PI / 4, 16), 'det') +
      (e.i ? '' : cyl(e.x, e.y, za + BALL - 2, 3, 13, 'paper', 'tint')); // the grip the hand turns
  };
  return hue('b', ball(ends[0]) + rod(ends[0], 0, ARM - BALL) + cyl(SX, SC, hb, 10, 10, 'paper', 'body') +
    cyl(SX, SC, hb + 10, 4, 3, 'paper', 'body') + rod(ends[1], 10, ARM) + ball(ends[1]));
}

// Beats: feed, lift the stack, press, print, lift, slide out. The last loop's finding fades off the tray while the
// next sheet feeds, so the wrap is seamless and there is no idle gap.
const PERIOD = 3.1;
function press(u: number) {
  const feed = k(u, 0, .75), rise = k(u, .35, .95), down = k(u, .6, 1.25) - k(u, 1.45, 2.1), out = k(u, 1.85, 2.6);
  const print = k(u, .95, 1.55), gone = k(u, .05, .65);
  const dz = -STROKE * down, die = BED + SH + STROKE + dz, top = die + 22, hb = HUB + dz;
  let g = '';
  // Feet, base plate (black front edge is the thickness accent), groove and corner screws
  for (const [x, y] of [[28, 16], [264, 16], [28, 88], [264, 88]]) g += cyl(x, y, 0, 6, 8, 'paper', 'body');
  g += box(16, 4, 8, 260, 96, 6, 'paper', 'body', 'blk');
  g += on(TOP(16, 4, 14), `<rect class="det" x="5" y="5" width="250" height="86" rx="1"/>` +
    [[11, 11], [249, 11], [11, 85], [249, 85]].map(([x, y]) => `<circle class="det" cx="${x}" cy="${y}" r="2.4"/>`).join(''));
  // Feed magazine: back and left walls, the stack (it lifts one sheet once the top one has gone), right and front walls
  const wall = (x: number, y: number, w: number, d: number) => box(x, y, 14, w, d, WALL - 14, 'paper', 'body', 'tint');
  g += wall(22, 29, 72, 3) + wall(22, 29, 3, 54);
  for (let i = 8; i >= 1; i--) g += sheet(MX, BED - (i - rise) * SH);
  g += wall(91, 32, 3, 48) + wall(22, 80, 72, 3);
  // C-frame column with a cast pocket and gib strips, then the bolster, die plate and the back guide strip
  g += box(FX, 4, 14, FW, 20, CH - 14, 'paper', 'body') + on(SIDE(FX + FW, 24, CH), `<rect class="det" x="5" y="8" width="10" height="${CH - 52}" rx="1"/>`);
  for (const x of [FX + 2, FX + FW - 8]) g += box(x, 24, 40, 6, 3, CH - 40, 'paper', 'tint');
  g += box(100, 26, 14, 84, 60, 26, 'paper', 'body') + on(FRONT(100, 86, 40), `<circle class="det" cx="9" cy="13" r="2.4"/><circle class="det" cx="75" cy="13" r="2.4"/><rect class="det" x="18" y="8" width="48" height="10" rx="1"/>`);
  g += box(104, 29, 40, 76, 54, 4, 'paper', 'tint') + box(104, 29, BED, 76, 3, 2.5, 'paper', 'body');
  // Output tray on its stem
  g += box(223, 50, 14, 12, 12, BED - 18, 'paper', 'body') + box(188, 30, BED - 4, 78, 52, 4, 'paper', 'body') + box(188, 30, BED, 78, 3, 4, 'paper', 'body');
  // The work: last loop's finding fading off the tray; the raw sheet, with the finding fading in over it under the die
  if (gone < 1) g += card(OX, 1 - gone);
  if (print < 1) g += sheet(MX + (BX - MX) * feed, BED);
  if (print > 0) g += card(BX + (OX - BX) * out, print);
  g += box(104, 80, BED, 76, 3, 2.5, 'paper', 'body') + box(188, 79, BED, 78, 3, 4, 'paper', 'body') + box(262, 33, BED, 4, 46, 8, 'paper', 'body');
  // Die (the rule, hue c), platen riding the gibs, screw below the head
  g += `<g class="lit">${hue('c', box(122, 36, die, 40, 40, 10, 'tint', 'body'))}</g>`;
  g += box(FX + 2, 27, die + 10, FW - 4, 53, 12, 'paper', 'body');
  g += cyl(SX, SC, top, 9, 4, 'paper', 'body') + cyl(SX, SC, top + 4, 5, CH - top - 4, 'tint', 'tint');
  for (let z = top + 9; z < CH - 2; z += 4) g += thread(z);
  // Head with its bolts, boss, screw above the head, then the arm
  g += box(FX, 4, CH, FW, 70, 18, 'paper', 'body') + on(FRONT(FX, 74, CH + 18), `<circle class="det" cx="8" cy="9" r="2.4"/><circle class="det" cx="${FW - 8}" cy="9" r="2.4"/>`);
  g += cyl(SX, SC, CH + 18, 13, 6, 'paper', 'body') + cyl(SX, SC, CH + 24, 5, hb - CH - 24, 'tint', 'tint');
  for (let z = hb - 4; z > CH + 23; z -= 4) g += thread(z, CH + 24);
  // The arm swings 60° and only through angles where neither ball crosses in front of the head or column
  return hue('b', g) + arm(hb, -.49 - 1.05 * down);
}

export const skills: Piece = {
  aria: 'A small hand press. A sheet slides from a stack of raw exports into the press, the arm swings the platen down, and one stamped card slides out onto a tray.',
  period: PERIOD, rest: 2.75, viewBox: K.viewBox,
  draw: (t) => press(((t % PERIOD) + PERIOD) % PERIOD),
};
