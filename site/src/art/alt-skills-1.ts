// Alternative skill icons, first half of the list (skills 1–16 on /art-review): two other ideas per skill, outside
// ICON_POOLS until Agov picks. Same style as icons-skills.ts: one object on a plate, its telling details, one live part.
import { kernel, f, type V3 } from './iso';
import { bar, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from './icons';
import { ann, ball } from './icons-rules';
import { ringY, ringX, spokes } from './alt-rules';

// A frustum block (ingot, wedge-sided base): bottom w×d, top inset by i on every side
const frustum = (K: K, x: number, y: number, z: number, w: number, d: number, h: number, i: number, top = 'paper', side = 'body', front = 'tint') =>
  K.poly([[x + w, y, z], [x + w, y + d, z], [x + w - i, y + d - i, z + h], [x + w - i, y + i, z + h]], `f ${side}`) +
  K.poly([[x, y + d, z], [x + w, y + d, z], [x + w - i, y + d - i, z + h], [x + i, y + d - i, z + h]], `f ${front}`) +
  K.poly([[x + i, y + i, z + h], [x + w - i, y + i, z + h], [x + w - i, y + d - i, z + h], [x + i, y + d - i, z + h]], `f ${top}`);
const ticks = (n: number, x0: number, step: number, y: number, long = 3, short = 1.8, every = 5) => Array.from({ length: n }, (_, i) => `<line class="det" x1="${f(x0 + i * step)}" y1="${y}" x2="${f(x0 + i * step)}" y2="${f(y + (i % every ? short : long))}"/>`).join('');

// ── Landing-page CPC: a parking meter, the needle showing the time paid for (live).
const PM = kernel([[0, 0, 0], [56, 0, 0], [0, 40, 0], [56, 40, 0], [28, 20, 74]], 12);
const parkmeter = icon(PM, 'A parking meter on its post: a coin slot on the side and a dial window whose needle shows the time paid for.', () => {
  const K = PM, X = 18, Y = 14, W = 20, D = 12, Z = 42, H = 20;
  let s = plate(K, 0, 0, 56, 40) + K.cyl(28, 20, 4, 7, 2, 'paper', 'body') + K.box(26, 18, 6, 4, 4, Z - 6, 'paper', 'body', 'tint');
  s += K.box(X + 2, Y + 2, Z - 3, W - 4, D - 4, 3, 'paper', 'body', 'tint') + K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint');
  s += K.cyl(28, 20, Z + H, 9, 2, 'paper', 'body') + K.cyl(28, 20, Z + H + 2, 6, 3, 'paper', 'tint') + K.cyl(28, 20, Z + H + 5, 2, 1.4, 'paper', 'body');
  const fc = K.FRONT(X, Y + D, Z + H), a = -2.3;
  s += K.on(fc, `<rect class="f blk" x="3" y="3" width="${W - 6}" height="10" rx="1"/><path class="f paper" d="M4.4 12A5.6 5.6 0 0 1 15.6 12Z"/>` +
    Array.from({ length: 7 }, (_, i) => { const t = Math.PI + i * Math.PI / 6; return `<line class="det" x1="${f(10 + Math.cos(t) * 3.8)}" y1="${f(12 + Math.sin(t) * 3.8)}" x2="${f(10 + Math.cos(t) * 5)}" y2="${f(12 + Math.sin(t) * 5)}"/>`; }).join('') + `<circle class="det" cx="10" cy="16.4" r="1.6"/>`);
  s += lit(K.on(fc, `<path class="f body" d="M9.3 12L${f(10 + Math.cos(a) * 4.6)} ${f(12 + Math.sin(a) * 4.6)}L10.7 12Z"/><circle class="f body" cx="10" cy="12" r="1"/>`));
  s += K.on(K.SIDE(X + W, Y + D, Z + H), '<rect class="f blk" x="3.4" y="5" width="5" height="1.2" rx=".4"/>') + K.cylX(X + W, X + W + 2.4, Y + D / 2, Z + 6, 2.2, 'paper', 'body');
  return s;
});

// ── Landing-page CPC: a farebox; the ticket for this ride comes out of the slot (live).
const FX = kernel([[0, 0, 0], [56, 0, 0], [0, 44, 0], [56, 44, 0], [28, 22, 62]], 12);
const farebox = icon(FX, 'A farebox on a pedestal: a coin funnel on top and a ticket coming out of the slot in front.', () => {
  const K = FX;
  let s = plate(K, 0, 0, 56, 44) + K.box(20, 16, 4, 16, 14, 2, 'paper', 'body', 'tint') + K.box(23, 19, 6, 10, 8, 22, 'paper', 'body', 'tint');
  s += K.box(16, 12, 28, 24, 20, 22, 'paper', 'body', 'tint') + K.on(K.FRONT(16, 32, 50), `<rect class="det" x="2" y="2" width="20" height="18" rx=".8"/><rect class="f blk" x="5" y="4" width="14" height="5" rx=".6"/><rect class="f blk" x="7" y="13" width="10" height="1.2"/>` + screws([[4, 17], [20, 17]]));
  s += K.on(K.SIDE(40, 32, 50), `<rect class="det" x="4" y="4" width="12" height="10" rx=".6"/>${ticks(5, 6, 2, 6, 6, 6)}`);
  s += K.cyl(28, 22, 50, 8, 2, 'paper', 'body') + K.cyl(28, 22, 52, 6, 1.6, 'paper', 'tint') + K.on(K.TOP(28, 22, 53.6), `<circle class="det" r="4.4"/><circle class="f blk" r="2.4"/>`);
  s += lit(K.box(21, 32, 37, 10, 7, .6, 'body', 'body', 'body') + K.on(K.TOP(21, 32, 37.6), '<path class="det" d="M2 2H8M2 4H6"/>'));
  return s;
});

// ── Lowest bid that still spends: a throttle quadrant, the lever in the lowest notch that still runs (live knob).
const TQ = kernel([[0, 0, 0], [64, 0, 0], [0, 40, 0], [64, 40, 0], [32, 20, 52], [4, 20, 40]], 12);
const throttle = icon(TQ, 'A throttle quadrant: a notched fan plate on a base, the lever set in one of the low notches.', () => {
  const K = TQ, PX = 32, PY = 20, PZ = 16, R = 28, A0 = -Math.PI * .9, A1 = -Math.PI * .1, a = A0 + (A1 - A0) * .28;
  let s = plate(K, 0, 0, 64, 40) + K.box(8, 13, 4, 48, 14, 8, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 27, 12), screws([[4, 4], [44, 4]]));
  const fan = (cls: string) => `<path class="f ${cls}" d="M0 0L${f(Math.cos(A0) * R)} ${f(Math.sin(A0) * R)}A${R} ${R} 0 0 1 ${f(Math.cos(A1) * R)} ${f(Math.sin(A1) * R)}Z"/>`;
  s += K.on(K.FRONT(PX, PY - 1.4, PZ), fan('tint')) + K.on(K.FRONT(PX, PY, PZ), fan('paper') + Array.from({ length: 7 }, (_, i) => { const t = A0 + .14 + i * (A1 - A0 - .28) / 6; return `<path class="f blk" d="M${f(Math.cos(t - .03) * R)} ${f(Math.sin(t - .03) * R)}L${f(Math.cos(t) * (R - 3))} ${f(Math.sin(t) * (R - 3))}L${f(Math.cos(t + .03) * R)} ${f(Math.sin(t + .03) * R)}Z"/>`; }).join('') + `<path class="det" d="M${f(Math.cos(A0) * 12)} ${f(Math.sin(A0) * 12)}A12 12 0 0 1 ${f(Math.cos(A1) * 12)} ${f(Math.sin(A1) * 12)}"/>`);
  s += K.on(K.FRONT(PX, PY + 1, PZ), `<g transform="rotate(${f(a * 180 / Math.PI)})"><rect class="f paper" x="0" y="-1.3" width="${R + 2}" height="2.6"/></g><circle class="f paper" r="3"/><circle class="det" r="1.2"/>`);
  return s + lit(ball(K, PX + Math.cos(a) * (R + 4), PY + 1, PZ - Math.sin(a) * (R + 4), 4.4, 'f body'));
});

// ── Lowest bid that still spends: a dimmer turned low with its bulb still glowing (live bulb).
const DM = kernel([[0, 0, 0], [64, 0, 0], [0, 40, 0], [64, 40, 0], [46, 20, 50], [16, 10, 46]], 12);
const dimmer = icon(DM, 'A wall dimmer turned down low beside a bulb on its socket, still glowing.', () => {
  const K = DM, KX = 18, KZ = 26;
  let s = plate(K, 0, 0, 64, 40) + K.box(6, 10, 4, 24, 4, 40, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(6, 14, 44), `<rect class="det" x="3" y="3" width="18" height="34" rx="1"/>` + screws([[12, 6], [12, 34]]) + Array.from({ length: 9 }, (_, i) => { const t = Math.PI * .75 + i * Math.PI * 1.5 / 8; return `<line class="det" x1="${f(12 + Math.cos(t) * 7.4)}" y1="${f(18 + Math.sin(t) * 7.4)}" x2="${f(12 + Math.cos(t) * (i % 4 ? 8.4 : 9.4))}" y2="${f(18 + Math.sin(t) * (i % 4 ? 8.4 : 9.4))}"/>`; }).join(''));
  s += K.cylY(14, 18, KX, KZ, 5, 'paper', 'body') + K.on(K.FRONT(KX, 18, KZ), `<circle class="det" r="3.6"/><line class="det" x1="0" y1="0" x2="${f(Math.cos(Math.PI * .95) * 4.4)}" y2="${f(Math.sin(Math.PI * .95) * 4.4)}"/>`);
  s += rope(K, [[30, 12, 6], [36, 16, 5], [42, 20, 6]], 1.4, 'f paper') + K.box(38, 12, 4, 16, 16, 4, 'paper', 'body', 'tint') + K.cyl(46, 20, 8, 4.4, 9, 'paper', 'body') + [11, 13.4].map((z) => K.line(K.ring(46, 20, z, 4.4, -Math.PI / 4, Math.PI * 3 / 4, 16), 'det')).join('');
  s += K.cyl(46, 20, 17, 3, 3, 'paper', 'body') + lit(ball(K, 46, 20, 28, 10, 'f body'), .6) + K.on(K.FRONT(46, 20, 28), '<path class="det" d="M-2 6L-2 1L-1 -1L0 1L1 -1L2 1L2 6"/>');
  return s;
});

// ── Cost per retargetable member: a card punch, the card under the pin with its holes punched (live card).
const CP = kernel([[0, 0, 0], [70, 0, 0], [0, 44, 0], [70, 44, 0], [24, 22, 58]], 12);
const cardpunch = icon(CP, 'A bench card punch: a card lies under the punch pin, a row of holes already punched in it.', () => {
  const K = CP;
  let s = plate(K, 0, 0, 70, 44) + K.box(8, 10, 4, 34, 24, 10, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 34, 14), screws([[4, 5], [30, 5]]));
  s += K.box(12, 16, 14, 7, 7, 30, 'paper', 'body', 'tint');
  s += lit(K.box(18, 14, 14, 46, 16, .8, 'body', 'body', 'body') + K.on(K.TOP(18, 14, 14.8), [20, 25, 30, 35, 40].map((x, i) => `<circle class="f ${i % 2 ? 'blk' : 'paper'}" cx="${x}" cy="8" r="1.4"/>`).join('') + '<line class="det" x1="2" y1="3" x2="44" y2="3"/>'));
  s += K.cyl(31, 22, 14.8, 1.6, 22, 'paper', 'body') + [22, 25, 28].map((z) => K.line(K.ring(31, 22, z, 2.6, -Math.PI / 4, Math.PI * 3 / 4, 12), 'det')).join('');
  s += K.box(12, 18, 44, 24, 6, 4, 'paper', 'body', 'tint') + K.cyl(31, 21, 36.8, 2.6, 7, 'paper', 'tint') + rope(K, [[36, 21, 48], [48, 21, 56]], 2.4, 'f paper') + K.cylX(46, 52, 21, 56.4, 2.6, 'paper', 'body');
  return s;
});

// ── Cost per retargetable member: a coin press; the blank on the die is struck into a token (live).
const CR = kernel([[0, 0, 0], [64, 0, 0], [0, 46, 0], [64, 46, 0], [6, 22, 62], [58, 22, 62]], 12);
const coinpress = icon(CR, 'A screw coin press with a long handlebar; a blank sits on the die and finished tokens lie in a tray in front.', () => {
  const K = CR, CX = 32, CY = 22;
  let s = plate(K, 0, 0, 64, 46) + K.box(12, 14, 4, 40, 18, 6, 'paper', 'body', 'tint');
  s += K.box(16, 18, 10, 5, 8, 34, 'paper', 'body', 'tint') + K.box(CX - 5, CY - 5, 10, 10, 10, 4, 'paper', 'body', 'tint');
  s += lit(K.cyl(CX, CY, 14, 3.6, 1, 'body', 'body'));
  s += K.cyl(CX, CY, 20, 4, 6, 'paper', 'tint') + K.cyl(CX, CY, 26, 2, 30, 'paper', 'body') + [30, 33, 36, 39].map((z) => K.line(K.ring(CX, CY, z, 2, -Math.PI / 4, Math.PI * 3 / 4, 10), 'det')).join('');
  s += K.box(43, 18, 10, 5, 8, 34, 'paper', 'body', 'tint') + K.box(14, 17, 44, 36, 10, 6, 'paper', 'body', 'tint') + K.on(K.FRONT(14, 27, 50), screws([[4, 3], [32, 3]]));
  s += K.cyl(CX, CY, 50, 3.4, 4, 'paper', 'body') + K.cylX(8, 56, CY, 56, 1.2, 'paper', 'body') + ball(K, 8, CY, 56, 4, 'f paper') + ball(K, 56, CY, 56, 4, 'f paper');
  s += K.box(38, 34, 4, 20, 8, 2, 'paper', 'body', 'tint') + lit([42, 47, 52].map((x) => K.cyl(x, 38, 6, 2.2, 1, 'body', 'body')).join(''));
  return s;
});

// ── Retargeting guardrails: a boom barrier, the striped arm down across the way (live).
const BM = kernel([[0, 0, 0], [80, 0, 0], [0, 40, 0], [80, 40, 0], [13, 19, 40]], 12);
const boom = icon(BM, 'A boom barrier: a housing with a counterweight and a long striped arm lowered onto its rest.', () => {
  const K = BM, Y = 26, Z = 24;
  let s = plate(K, 0, 0, 80, 40) + K.box(6, 12, 4, 14, 14, 26, 'paper', 'body', 'tint') + K.on(K.FRONT(6, 26, 30), `<rect class="det" x="2" y="4" width="10" height="16" rx=".6"/><circle class="f blk" cx="7" cy="12" r=".9"/>`);
  s += K.cyl(13, 19, 30, 2.4, 3, 'paper', 'body') + K.cyl(13, 19, 33, 1.6, 2.4, 'paper', 'tint');
  s += K.box(70, Y - 2, 4, 4, 4, Z - 6, 'paper', 'body', 'tint') + K.box(69, Y - 3, Z - 2, 6, 6, 1.6, 'paper', 'body', 'tint');
  s += K.box(4, Y, Z - 4, 8, 3, 8, 'paper', 'body', 'tint') + K.box(12, Y, Z - 1.5, 62, 3, 3, 'paper', 'body', 'paper');
  s += lit(K.on(K.FRONT(12, Y + 3, Z + 1.5), Array.from({ length: 6 }, (_, i) => `<path class="f body" d="M${4 + i * 10} 0H${9 + i * 10}L${6 + i * 10} 3H${1 + i * 10}Z"/>`).join('')));
  s += K.cylY(Y + 3, Y + 5, 13, Z, 3, 'paper', 'body') + K.on(K.FRONT(13, Y + 5, Z), '<circle class="det" r="1.2"/>');
  return s;
});

// ── Retargeting guardrails: meshing gears under a guard cage (live frame).
const GC = kernel([[0, 0, 0], [68, 0, 0], [0, 44, 0], [68, 44, 0], [34, 22, 34]], 12);
const gear = (r: number, n: number, d = 2) => 'M' + Array.from({ length: n * 4 }, (_, i) => { const t = (i / 4) * 2 * Math.PI / n, q = i % 4, rr = q === 1 || q === 2 ? r : r - d; return [Math.cos(t + (q === 0 || q === 1 ? -.04 : .04) * 6 / n * 2) * rr, Math.sin(t + (q === 0 || q === 1 ? -.04 : .04) * 6 / n * 2) * rr].map(f).join(' '); }).join('L') + 'Z';
const guardcage = icon(GC, 'Two meshing gears on a base plate, covered by a wire guard cage.', () => {
  const K = GC, X = 8, Y = 8, W = 52, D = 28, Z = 8, H = 16;
  let s = plate(K, 0, 0, 68, 44) + K.box(X - 2, Y - 2, 4, W + 4, D + 4, 4, 'paper', 'body', 'tint');
  const g = (x: number, y: number, r: number, n: number) => K.on(K.TOP(x, y, Z), `<path class="f tint" d="${gear(r, n)}"/>`) + K.on(K.TOP(x, y, Z + 2.4), `<path class="f paper" d="${gear(r, n)}"/><circle class="det" r="${f(r * .55)}"/>`) + K.cyl(x, y, Z + 2.4, 2.4, 2, 'paper', 'body');
  s += g(24, 22, 12, 14) + g(42.4, 22, 7.4, 9);
  const post = (x: number, y: number) => K.box(x, y, Z, 1.6, 1.6, H, 'body', 'body', 'body');
  s += lit(post(X, Y) + post(X + W - 1.6, Y) + post(X, Y + D - 1.6));
  s += K.on(K.TOP(X, Y, Z + H), Array.from({ length: 12 }, (_, i) => `<line class="det" x1="${f(i * W / 12)}" y1="0" x2="${f(i * W / 12)}" y2="${D}"/>`).join('') + Array.from({ length: 6 }, (_, i) => `<line class="det" x1="0" y1="${f(i * D / 6)}" x2="${W}" y2="${f(i * D / 6)}"/>`).join(''));
  s += K.on(K.FRONT(X, Y + D, Z + H), Array.from({ length: 12 }, (_, i) => `<line class="det" x1="${f(i * W / 12)}" y1="0" x2="${f(i * W / 12)}" y2="${H}"/>`).join('') + Array.from({ length: 4 }, (_, i) => `<line class="det" x1="0" y1="${i * 4}" x2="${W}" y2="${i * 4}"/>`).join(''));
  s += K.on(K.SIDE(X + W, Y + D, Z + H), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="${f(i * D / 6)}" y1="0" x2="${f(i * D / 6)}" y2="${H}"/>`).join('') + Array.from({ length: 4 }, (_, i) => `<line class="det" x1="0" y1="${i * 4}" x2="${D}" y2="${i * 4}"/>`).join(''));
  s += lit(post(X + W - 1.6, Y + D - 1.6) + K.box(X, Y + D - 1.6, Z + H, W, 1.6, 1.6, 'body', 'body', 'body') + K.box(X + W - 1.6, Y, Z + H, 1.6, D, 1.6, 'body', 'body', 'body') + K.box(X, Y, Z + H, W, 1.6, 1.6, 'body', 'body', 'body') + K.box(X, Y, Z + H, 1.6, D, 1.6, 'body', 'body', 'body'));
  return s;
});

// ── Matched audience lists: a stencil and the print it leaves, the same shapes (live print).
const SN = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [36, 22, 12]], 12);
const shapes = (cls: string) => `<circle class="${cls}" cx="6" cy="7" r="3.6"/><rect class="${cls}" x="12" y="3.4" width="8" height="7.2"/><path class="${cls}" d="M3 22L9 14L15 22Z"/><rect class="${cls}" x="17" y="14" width="4" height="8"/>`;
const stencil = icon(SN, 'A stencil sheet with cut-out shapes lying beside the print it left, the same shapes painted on the board, and a stencil brush.', () => {
  const K = SN;
  let s = plate(K, 0, 0, 72, 44) + K.box(6, 6, 4, 60, 32, 3, 'paper', 'body', 'tint');
  s += lit(K.on(K.TOP(40, 10, 7), shapes('f body')));
  s += K.box(8, 9, 7, 28, 28, .8, 'paper', 'body', 'tint') + K.on(K.TOP(12, 12, 7.8), shapes('f tint') + '<rect class="det" x="-2" y="-1.6" width="24" height="25" rx=".6"/>');
  s += K.cylX(44, 58, 34, 9, 2, 'paper', 'tint') + K.cylX(58, 60, 34, 9, 2.6, 'paper', 'body') + K.cylX(60, 64, 34, 9, 2.4, 'body', 'blk');
  return s;
});

// ── Matched audience lists: an extrusion die, the bar coming out in the die's exact profile (live).
const EX = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [18, 20, 40]], 12);
const extruder = icon(EX, 'An extrusion die block on a bed; a bar comes out of it with exactly the profile cut in the die, carried on rollers.', () => {
  const K = EX, X0 = 26, CY = 20;
  let s = plate(K, 0, 0, 76, 40) + K.box(6, 8, 4, 22, 24, 4, 'paper', 'body', 'tint') + K.box(10, 10, 8, 16, 20, 26, 'paper', 'body', 'tint');
  s += K.on(K.SIDE(X0, 30, 34), '<path class="det" d="M4 12.6H16V16H11.6V24.6H8.4V16H4Z"/>' + screws([[3, 3], [17, 3], [3, 23], [17, 23]]) + '<rect class="det" x="1.4" y="1.4" width="17.2" height="23.2"/>');
  s += K.on(K.FRONT(10, 30, 34), '<rect class="det" x="2" y="3" width="12" height="4" rx=".5"/>');
  for (const x of [42, 60]) s += K.box(x - 2, CY - 6, 4, 4, 12, 7, 'paper', 'body', 'tint') + K.cylY(CY - 5, CY + 5, x, 12.6, 1.6, 'paper', 'body');
  s += lit(K.box(X0, CY - 1.6, 14.2, 44, 3.2, 8.6, 'body', 'body', 'body') + K.box(X0, CY - 6, 22.8, 44, 12, 3.4, 'body', 'body', 'body') + K.on(K.SIDE(X0 + 44, CY + 6, 26.2), '<line class="det" x1="0" y1="3.4" x2="12" y2="3.4"/>'));
  return s;
});

// ── No-deal warm leads: a mailbox with its flag up (live).
const MB = kernel([[0, 0, 0], [52, 0, 0], [0, 40, 0], [52, 40, 0], [24, 20, 62]], 12);
const mailbox = icon(MB, 'A mailbox on a post with its side flag raised.', () => {
  const K = MB, X0 = 12, X1 = 38, CY = 20, ZB = 36, R = 7;
  let s = plate(K, 0, 0, 52, 40) + K.box(18, 14, 4, 12, 12, 2, 'paper', 'body', 'tint') + K.box(22, 18, 6, 4, 4, ZB - 6, 'paper', 'body', 'tint') + K.box(16, CY - 5, ZB - 2, 18, 10, 2, 'paper', 'body', 'tint');
  s += K.box(X0, CY - R, ZB, X1 - X0, 2 * R, 7, 'paper', 'body', 'tint');
  const arc = (x: number): V3[] => Array.from({ length: 19 }, (_, i) => { const a = -Math.PI / 4 + Math.PI * .75 * i / 18 + Math.PI / 4; return [x, CY + R * Math.cos(a), ZB + 7 + R * Math.sin(a)] as V3; });
  s += K.poly([...arc(X0), ...arc(X1).reverse()], 'f tint') + K.line([[X0 + 4, CY + R, ZB + 7], [X1 - 2, CY + R, ZB + 7]], 'det');
  s += K.on(K.SIDE(X1, CY + R, ZB + 7), `<path class="f paper" d="M0 0A${R} ${R} 0 0 1 ${2 * R} 0Z"/><rect class="f paper" x="0" y="0" width="${2 * R}" height="7"/><rect class="det" x="1.4" y="-3" width="${2 * R - 2.8}" height="8.6" rx="1"/><circle class="f paper" cx="${R}" cy="1" r="1.2"/>`);
  s += lit(K.on(K.FRONT(X1 - 6, CY + R + .4, ZB + 4), '<rect class="f body" x="-1" y="-15" width="2" height="15"/><rect class="f body" x="1" y="-15" width="7" height="5" rx=".4"/>')) + K.on(K.FRONT(X1 - 6, CY + R + .6, ZB + 4), '<circle class="f paper" r="1.4"/>');
  return s;
});

// ── No-deal warm leads: a signal lamp on its mast, the lamp lit (live).
const SG = kernel([[0, 0, 0], [52, 0, 0], [0, 40, 0], [52, 40, 0], [26, 20, 68]], 12);
const signal = icon(SG, 'A signal mast with a lamp head: a hooded lens lit on a round back plate, a ladder up the mast.', () => {
  const K = SG, X = 26, Y = 18, LZ = 50;
  let s = plate(K, 0, 0, 52, 40) + K.box(16, 10, 4, 20, 18, 3, 'paper', 'body', 'tint') + K.box(30, 22, 7, 8, 6, 8, 'paper', 'body', 'tint');
  s += K.cyl(X, Y, 7, 2, LZ - 7, 'paper', 'body') + Array.from({ length: 7 }, (_, i) => K.line([[X - 3, Y + 2, 10 + i * 5], [X + 3, Y + 2, 10 + i * 5]], 'det')).join('') + K.line([[X - 3, Y + 2, 8], [X - 3, Y + 2, 44]], 'det') + K.line([[X + 3, Y + 2, 8], [X + 3, Y + 2, 44]], 'det');
  s += K.on(K.FRONT(X, Y + 1, LZ), '<circle class="f tint" r="11"/>') + K.on(K.FRONT(X, Y + 1, LZ), '<circle class="det" r="9"/>');
  s += K.box(X - 6, Y + 1, LZ - 6, 12, 6, 12, 'paper', 'body', 'tint') + lit(K.cylY(Y + 7, Y + 9, X, LZ, 4.6, 'body', 'body') + K.on(K.FRONT(X, Y + 9, LZ), '<circle class="det" r="3"/>'));
  s += K.on(K.FRONT(X, Y + 11, LZ), '<path class="f paper" d="M-6 0A6 6 0 0 1 6 0L4.6 0A4.6 4.6 0 0 0 -4.6 0Z"/>') + K.line([[X - 6, Y + 7, LZ], [X - 6, Y + 11, LZ]], 'det') + K.line([[X + 6, Y + 7, LZ], [X + 6, Y + 11, LZ]], 'det');
  return s;
});

// ── Silent watchers: a security camera on its wall bracket, the lens looking out (live).
const CC = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [14, 10, 60]], 12);
const cctv = icon(CC, 'A security camera on a wall bracket under its sun hood, the lens looking out over the plate.', () => {
  const K = CC, Y = 14, Z = 36, CY = Y + 5;
  let s = plate(K, 0, 0, 64, 44) + K.box(8, 6, 4, 12, 4, 54, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 10, 58), screws([[3, 4], [9, 4], [3, 50], [9, 50]]));
  s += K.box(11, 10, Z + 12, 6, 9, 3, 'paper', 'body', 'tint') + K.cyl(14, CY, Z + 9, 1.6, 3, 'paper', 'body') + K.cyl(14, CY, Z + 7.4, 3.4, 1.6, 'paper', 'body');
  s += K.box(10, Y, Z - 2, 30, 10, 9.4, 'paper', 'body', 'tint') + K.on(K.FRONT(10, Y + 10, Z + 7.4), '<path class="det" d="M4 3H20M4 5.4H14"/><circle class="f blk" cx="25" cy="4" r=".8"/>');
  s += K.box(8, Y - 1, Z + 7.4, 36, 12, 1.2, 'paper', 'body', 'tint');
  s += K.cylX(40, 44, CY, Z + 2.6, 4, 'paper', 'body') + lit(K.on(K.SIDE(44, CY, Z + 2.6), '<circle class="f body" r="3"/><circle class="det" r="1.4"/>'));
  return s;
});

// ── Silent watchers: a radar dish on its turntable, listening quietly (live dish).
const RD = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [30, 22, 58], [30, 40, 44]], 12);
const radar = icon(RD, 'A radar dish on a yoke and turntable, tilted up, its feed held on three struts in front of it.', () => {
  const K = RD, C: V3 = [30, 22, 32], u: V3 = [1, 0, 0], v: V3 = [0, .6, -.8], n: V3 = [0, .8, .6], R = 15;
  let s = plate(K, 0, 0, 60, 44) + K.box(18, 12, 4, 24, 20, 6, 'paper', 'body', 'tint') + K.cyl(30, 22, 10, 9, 3, 'paper', 'body') + K.cyl(30, 22, 13, 5, 6, 'paper', 'tint');
  s += K.box(18, 20, 19, 3, 4, 14, 'paper', 'body', 'tint');
  const pl = planeAt(K, C, u, v), F: V3 = [C[0] + n[0] * 12, C[1] + n[1] * 12, C[2] + n[2] * 12];
  s += K.on(planeAt(K, [C[0] - n[0] * 1.6, C[1] - n[1] * 1.6, C[2] - n[2] * 1.6], u, v), `<circle class="f tint" r="${R}"/>`);
  s += lit(K.on(pl, `<circle class="f body" r="${R}"/><circle class="det" r="${R - 4}"/><circle class="det" r="${R - 9}"/>`));
  s += [0, 2.1, 4.2].map((t) => { const p: V3 = [C[0] + Math.cos(t) * R * u[0] + Math.sin(t) * R * v[0], C[1] + Math.cos(t) * R * u[1] + Math.sin(t) * R * v[1], C[2] + Math.cos(t) * R * u[2] + Math.sin(t) * R * v[2]]; return K.line([p, F], 'det'); }).join('');
  s += K.box(39, 20, 19, 3, 4, 14, 'paper', 'body', 'tint') + ball(K, F[0], F[1], F[2], 2.4, 'f paper');
  return s;
});

// ── Account health: an open toolbox, the cantilever trays lifted out (live trays).
const TX = kernel([[0, 0, 0], [70, 0, 0], [0, 44, 0], [70, 44, 0], [34, 18, 40]], 12);
const toolbox = icon(TX, 'An open cantilever toolbox: two trays lifted out on their arms, tools in the trays and in the box.', () => {
  const K = TX, X = 12, Y = 16, W = 46, D = 18, ZT = 24;
  let s = plate(K, 0, 0, 70, 44) + K.box(X, Y, 4, W, D, ZT - 4, 'paper', 'body', 'tint') + K.on(K.TOP(X, Y, ZT), `<rect class="f blk" x="2" y="2" width="${W - 4}" height="${D - 4}"/>`);
  s += K.cyl(X + 10, Y + 9, ZT - 4, 1.6, 8, 'paper', 'body') + K.cyl(X + 15, Y + 8, ZT - 4, 1.2, 10, 'paper', 'tint');
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="f paper" x="${W / 2 - 4}" y="6" width="8" height="4" rx=".6"/><circle class="f blk" cx="${W / 2}" cy="8" r=".8"/>`);
  const tray = (x: number) => lit(K.box(x, Y - 10, ZT + 6, 20, 9, 5, 'body', 'body', 'body') + K.on(K.TOP(x, Y - 10, ZT + 11), '<rect class="f blk" x="1.2" y="1.2" width="17.6" height="6.6"/><line class="det" x1="10" y1="1.2" x2="10" y2="7.8"/>'));
  s += rope(K, [[X + 4, Y + 1, ZT], [X + 4, Y - 6, ZT + 6]], 1.4, 'f paper') + tray(X + 2) + K.prism(bar(X + 7, Y - 6.4, .2, 0, 10, 1.6), ZT + 11, 1.2, 'paper', 'body', 'tint');
  s += rope(K, [[X + W - 4, Y + 1, ZT], [X + W - 4, Y - 6, ZT + 6]], 1.4, 'f paper') + tray(X + W - 22) + K.cylX(X + W - 18, X + W - 6, Y - 5.4, ZT + 12.4, 1.2, 'paper', 'tint');
  return s;
});

// ── Account health: a stethoscope laid on a tray, the chest piece live.
const ST = kernel([[0, 0, 0], [70, 0, 0], [0, 46, 0], [70, 46, 0], [34, 22, 14]], 12);
const stethoscope = icon(ST, 'A stethoscope laid out on a tray: the chest piece, the tubing looped round and the two ear tubes.', () => {
  const K = ST, Z = 6.6;
  let s = plate(K, 0, 0, 70, 46) + K.box(6, 6, 4, 58, 34, 2, 'paper', 'body', 'tint') + K.on(K.TOP(6, 6, 6), '<rect class="det" x="2" y="2" width="54" height="30" rx="1"/>');
  const loop: V3[] = Array.from({ length: 22 }, (_, i) => { const t = Math.PI * .1 + i * Math.PI * 1.5 / 21; return [30 + Math.cos(t) * 14, 23 + Math.sin(t) * 10, Z] as V3; });
  s += rope(K, [[46, 32, Z], ...loop, [24, 12, Z], [20, 10, Z]], 2.6, 'f tint');
  s += rope(K, [[20, 10, Z], [14, 10, Z], [10, 16, Z]], 1.2, 'f paper') + rope(K, [[20, 10, Z], [16, 14, Z], [16, 20, Z]], 1.2, 'f paper') + ball(K, 10, 16.6, Z, 1.8, 'f paper') + ball(K, 16, 20.6, Z, 1.8, 'f paper');
  s += rope(K, [[46, 32, Z], [50, 33, Z]], 1.6, 'f paper') + lit(K.cyl(54, 33, 6, 5.6, 2.2, 'body', 'body') + K.on(K.TOP(54, 33, 8.2), '<circle class="det" r="4"/><circle class="det" r="1.2"/>'));
  return s;
});

// ── CRM data health: a water filter, the fresh cartridge seen through its clear bowl (live).
const WF = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [30, 18, 60]], 12);
const filter = icon(WF, 'An inline water filter on a wall bracket: inlet and outlet pipes, a clear bowl with a clean pleated cartridge inside.', () => {
  const K = WF, CX = 32, CY = 20;
  let s = plate(K, 0, 0, 72, 40) + K.box(28, 8, 4, 8, 4, 56, 'paper', 'body', 'tint');
  s += K.cylX(4, 22, CY, 48, 3, 'paper', 'tint') + K.box(20, 13, 42, 24, 14, 10, 'paper', 'body', 'tint') + K.on(K.FRONT(20, 27, 52), screws([[3, 3], [21, 3]]) + '<rect class="det" x="8" y="2.4" width="8" height="4" rx=".5"/>');
  s += K.cyl(CX, CY, 38, 9.4, 4, 'paper', 'body') + K.line(K.ring(CX, CY, 40, 9.4, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det');
  s += K.cyl(CX, CY, 10, 8, 28, 'paper', 'paper');
  s += lit(K.cyl(CX, CY, 12, 5, 24, 'body', 'body') + Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 4 + (i + .5) * Math.PI / 7; return K.line([[CX + Math.cos(a) * 5, CY + Math.sin(a) * 5, 13], [CX + Math.cos(a) * 5, CY + Math.sin(a) * 5, 35]], 'det'); }).join(''));
  s += K.line(K.ring(CX, CY, 10, 8, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det') + K.cyl(CX, CY, 6, 2, 4, 'paper', 'body') + K.cylX(44, 68, CY, 48, 3, 'paper', 'tint');
  return s;
});

// ── CRM data health: a tuning fork on its resonance box, ringing true (live tines).
const TF = kernel([[0, 0, 0], [68, 0, 0], [0, 40, 0], [68, 40, 0], [32, 22, 60]], 12);
const tuningfork = icon(TF, 'A tuning fork standing on its wooden resonance box, a small mallet lying beside it.', () => {
  const K = TF;
  let s = plate(K, 0, 0, 68, 40) + K.box(8, 12, 4, 44, 20, 16, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 32, 20), '<rect class="f blk" x="16" y="5" width="12" height="6" rx="3"/><rect class="det" x="2" y="2" width="40" height="12" rx=".6"/>');
  s += K.box(28, 19, 20, 8, 6, 2, 'paper', 'body', 'tint') + K.cyl(32, 22, 22, 1.4, 6, 'paper', 'body');
  s += rope(K, [[28.6, 22, 34], [28.6, 22, 30], [30, 22, 28], [34, 22, 28], [35.4, 22, 30], [35.4, 22, 34]], 2.2, 'f paper');
  s += lit(K.box(27.6, 21, 33, 2, 2, 24, 'body', 'body', 'body') + K.box(34.4, 21, 33, 2, 2, 24, 'body', 'body', 'body'));
  s += K.cylX(40, 58, 36, 5.4, 1, 'paper', 'tint') + ball(K, 60, 36, 5.6, 3.4, 'f paper');
  return s;
});

// ── Who's looking at your buying pages: a motion-sensor lamp over a door, its light on (live).
const MS = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [28, 8, 58]], 12);
const sensorlamp = icon(MS, 'A wall with a door; the motion-sensor lamp over the door has switched on and lights the step.', () => {
  const K = MS;
  let s = plate(K, 0, 0, 64, 44) + K.box(6, 6, 4, 52, 4, 54, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(6, 10, 58), '<rect class="f tint" x="16" y="16" width="20" height="38"/><rect class="det" x="18" y="18" width="16" height="14" rx=".6"/><rect class="det" x="18" y="35" width="16" height="16" rx=".6"/><circle class="f paper" cx="31" cy="34" r="1.4"/>');
  s += K.box(18, 10, 4, 28, 10, 2, 'paper', 'body', 'tint');
  s += lit(K.poly([[26, 16, 44], [38, 16, 44], [46, 36, 6], [16, 36, 6]], 'f body'), .25);
  s += K.box(30, 10, 47, 4, 6, 2, 'paper', 'body', 'tint') + K.box(25, 12, 43, 14, 6, 5, 'paper', 'body', 'tint') + lit(K.on(K.FRONT(25, 18, 48), '<rect class="f body" x="1.4" y="1.4" width="11.2" height="2.2"/>') + ball(K, 32, 18.6, 41.6, 2.4, 'f body'));
  return s;
});

// ── Who's looking at your buying pages: a hand tally counter, its button just pressed (live).
const HT = kernel([[0, 0, 0], [60, 0, 0], [0, 40, 0], [60, 40, 0], [30, 20, 50]], 12);
const tally = icon(HT, 'A hand tally counter standing on a little stand: a window of counting wheels, the push button on top just pressed.', () => {
  const K = HT, CX = 30, Y0 = 14, Y1 = 26, CZ = 24, R = 13;
  let s = plate(K, 0, 0, 60, 40) + K.box(22, 14, 4, 16, 12, 6, 'paper', 'body', 'tint');
  s += K.cylY(Y0, Y1, CX, CZ, R, 'paper', 'tint') + K.line(ringY(CX, Y1 - 3, CZ, R), 'det');
  s += K.on(K.FRONT(CX, Y1, CZ), `<circle class="det" r="${R - 1.6}"/><rect class="f blk" x="-8.6" y="-3.6" width="17.2" height="7.2" rx=".6"/>` + [-7.6, -3.6, .4, 4.4].map((x) => `<rect class="f paper" x="${x}" y="-2.8" width="3.2" height="5.6"/><line class="det" x1="${x}" y1="0" x2="${x + 3.2}" y2="0"/>`).join('') + screws([[0, 8]]));
  s += K.cylX(CX + R - 2, CX + R + 2, 20, CZ + 2, 2.4, 'paper', 'body');
  s += lit(K.cyl(CX, 20, CZ + R - 1.4, 2.6, 2, 'body', 'body') + K.cyl(CX, 20, CZ + R + .6, 3.6, 1.6, 'body', 'body'));
  return s;
});

// ── Creative decay watchlist: an inkjet printer, lid up, a fresh cartridge going into the carriage (live).
const IP = kernel([[0, 0, 0], [70, 0, 0], [0, 46, 0], [70, 46, 0], [34, -8, 40]], 12);
const inkjet = icon(IP, 'A desktop printer with its lid raised; one fresh cartridge is being seated in the carriage beside the others.', () => {
  const K = IP, X = 8, Y = 10, W = 54, D = 24, ZT = 20;
  let s = plate(K, 0, 0, 70, 46) + K.on(planeAt(K, [X, Y, ZT], [1, 0, 0], [0, .5, -.87]), `<rect class="f tint" x="0" y="-22" width="${W}" height="22"/><rect class="det" x="3" y="-19" width="${W - 6}" height="16" rx=".6"/>`);
  s += K.box(X, Y, 4, W, D, ZT - 4, 'paper', 'body', 'tint') + K.on(K.TOP(X, Y, ZT), `<rect class="f blk" x="4" y="2" width="${W - 16}" height="12"/>` + [0, 1, 2].map((i) => `<circle class="f paper" cx="${W - 7}" cy="${5 + i * 5}" r="1.4"/>`).join(''));
  s += [0, 1, 2].map((i) => K.box(X + 10 + i * 6, Y + 5, ZT - 6, 5, 7, 7, 'paper', 'body', 'tint')).join('') + lit(K.box(X + 28, Y + 5, ZT + 3, 5, 7, 7, 'body', 'body', 'body'));
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="f blk" x="8" y="6" width="${W - 16}" height="2"/>`) + K.box(X + 10, Y + D, 9, W - 20, 10, .6, 'paper', 'body', 'paper');
  return s;
});

// ── Creative decay watchlist: a tape dispenser loaded with a fresh roll (live).
const TD = kernel([[0, 0, 0], [70, 0, 0], [0, 40, 0], [70, 40, 0], [26, 22, 40]], 12);
const tape = icon(TD, 'A heavy tape dispenser with a fresh, full roll on its hub, the tape running to the serrated blade.', () => {
  const K = TD, RX = 24, CZ = 26, Y0 = 14, Y1 = 28;
  let s = plate(K, 0, 0, 70, 40) + K.box(8, 12, 4, 54, 18, 8, 'paper', 'body', 'tint') + K.box(10, 12, 12, 26, 18, 6, 'paper', 'body', 'tint');
  s += K.box(48, 12, 12, 10, 18, 4, 'paper', 'body', 'tint');
  s += lit(K.cylY(Y0, Y1, RX, CZ, 10, 'body', 'body') + K.poly([[RX + 7, Y0, CZ - 7], [56, Y0, 16.4], [56, Y1, 16.4], [RX + 7, Y1, CZ - 7]], 'f body'));
  s += K.on(K.FRONT(RX, Y1, CZ), `${ann(5, 3.6, 'f paper')}<circle class="det" r="7.6"/>`) + K.cylY(Y1, Y1 + 1.4, RX, CZ, 2, 'paper', 'body');
  s += K.on(K.FRONT(56, Y1 + .1, 17), '<path class="f blk" d="M0 0L1 -1.4L2 0L3 -1.4L4 0V1H0Z"/>');
  return s;
});

// ── Video quality: a film projector, reels on its arms and the beam out of the lens (live beam).
const FP = kernel([[0, 0, 0], [70, 0, 0], [0, 44, 0], [70, 44, 0], [28, 22, 64], [70, 8, 30]], 12);
const projector = icon(FP, 'A film projector with a supply and a take-up reel on its arms and a beam of light from the lens.', () => {
  const K = FP, Y = 22, RZ = 46;
  let s = plate(K, 0, 0, 70, 44) + [[12, 14], [36, 14], [12, 28], [36, 28]].map(([x, y]) => K.box(x, y, 4, 4, 4, 4, 'paper', 'body', 'tint')).join('');
  const reel = (x: number) => K.cylY(Y - 2, Y + 1, x, RZ, 11, 'paper', 'body') + K.on(K.FRONT(x, Y + 1, RZ), `<circle class="det" r="9"/><circle class="f paper" r="2"/>` + Array.from({ length: 4 }, (_, i) => { const t = i * Math.PI / 2 + .4; return `<circle class="f blk" cx="${f(Math.cos(t) * 5.6)}" cy="${f(Math.sin(t) * 5.6)}" r="2"/>`; }).join(''));
  s += K.box(19, Y - 1, 26, 3, 2, 18, 'paper', 'body', 'tint') + reel(18) + K.box(33, Y - 1, 26, 3, 2, 18, 'paper', 'body', 'tint') + reel(36);
  s += K.box(10, 14, 8, 34, 16, 18, 'paper', 'body', 'tint') + K.on(K.FRONT(10, 30, 26), `<rect class="det" x="3" y="3" width="14" height="10" rx=".6"/>` + screws([[24, 5], [30, 5]]));
  s += K.on(K.SIDE(44, 30, 26), Array.from({ length: 5 }, (_, i) => `<line class="det" x1="${3 + i * 2.4}" y1="4" x2="${3 + i * 2.4}" y2="12"/>`).join(''));
  s += lit(K.poly([[54, 22, 18], [70, 8, 26], [70, 34, 12]], 'f body'), .3) + K.cylX(44, 54, 22, 18, 4, 'paper', 'tint') + K.line(ringX(48, 22, 18, 4), 'det') + K.on(K.SIDE(54, 22, 18), '<circle class="f blk" r="2.4"/>');
  return s;
});

// ── Video quality: a monitor showing a test pattern (live bars).
const TM = kernel([[0, 0, 0], [64, 0, 0], [0, 40, 0], [64, 40, 0], [32, 18, 52]], 12);
const testcard = icon(TM, 'A monitor on its stand showing a test pattern: vertical bars with a centre circle and grid.', () => {
  const K = TM, X = 8, Y = 14, W = 48, D = 8, Z = 14, H = 32;
  let s = plate(K, 0, 0, 64, 40) + K.box(20, 12, 4, 24, 14, 2, 'paper', 'body', 'tint') + K.box(29, 16, 6, 6, 4, 8, 'paper', 'body', 'tint');
  s += K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint') + K.on(K.SIDE(X + W, Y + D, Z + H), '<circle class="f paper" cx="4" cy="24" r="1.4"/><circle class="f paper" cx="4" cy="28" r="1.4"/>');
  const fc = K.FRONT(X, Y + D, Z + H), bw = (W - 8) / 7;
  s += K.on(fc, `<rect class="f blk" x="3" y="3" width="${W - 6}" height="${H - 9}"/>`);
  s += lit(K.on(fc, Array.from({ length: 7 }, (_, i) => `<rect class="f ${['paper', 'tint', 'body', 'tint', 'paper', 'body', 'tint'][i]}" x="${f(4 + i * bw)}" y="4" width="${f(bw)}" height="${H - 15}"/>`).join('') + `<rect class="f blk" x="4" y="${H - 11}" width="${W - 8}" height="4"/>` + `<circle class="det" cx="${W / 2}" cy="${(H - 7) / 2 + 1}" r="8"/><path class="det" d="M${W / 2} 5V${H - 8}M6 ${(H - 7) / 2 + 1}H${W - 6}"/>`));
  s += K.on(fc, `<circle class="f paper" cx="${W - 6}" cy="${H - 3}" r="1"/>`);
  return s;
});

// ── Waste budget detection: a repair clamp bolted round a pipe, the leak stopped (live clamp).
const LC = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [40, 20, 36]], 12);
const clamp = icon(LC, 'A pipe on two saddles with a bolted repair clamp closed round it where it leaked.', () => {
  const K = LC, CY = 20, CZ = 18, R = 6;
  let s = plate(K, 0, 0, 76, 40) + [12, 64].map((x) => K.box(x - 4, CY - 6, 4, 8, 12, 9, 'paper', 'body', 'tint')).join('');
  s += K.cylX(2, 34, CY, CZ, R, 'paper', 'tint');
  const lug = (z: number) => K.box(33, CY - 2, z, 12, 4, 3, 'body', 'body', 'body') + [36, 42].map((x) => K.cyl(x, CY, z + 3, 1.2, 2, 'paper', 'body') + K.prism(Array.from({ length: 6 }, (_, i) => [x + Math.cos(i * Math.PI / 3) * 1.8, CY + Math.sin(i * Math.PI / 3) * 1.8] as P2), z + 3, 1.4, 'paper', 'body', 'tint')).join('');
  s += lit(lug(CZ + R + .4) + K.cylX(34, 44, CY, CZ, R + 1.6, 'body', 'body') + K.line(ringX(36, CY, CZ, R + 1.6), 'det') + K.line(ringX(42, CY, CZ, R + 1.6), 'det') + K.line([[34, CY + (R + 1.6) * .7, CZ + (R + 1.6) * .7], [44, CY + (R + 1.6) * .7, CZ + (R + 1.6) * .7]], 'det'));
  s += K.cylX(44, 74, CY, CZ, R, 'paper', 'tint');
  return s;
});

// ── Waste budget detection: a gas hob, its knob turned to off and the burner dark (live knob).
const HB = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [32, 22, 30]], 12);
const hob = icon(HB, 'A gas hob with two burners; the knob in front is turned to the off mark and the burner is out.', () => {
  const K = HB, X = 6, Y = 6, W = 52, D = 32, ZT = 14;
  let s = plate(K, 0, 0, 64, 44) + K.box(X, Y, 4, W, D, ZT - 4, 'paper', 'body', 'tint');
  const burner = (x: number, y: number, r: number) => K.cyl(x, y, ZT, r + 2, 1, 'paper', 'tint') + K.cyl(x, y, ZT + 1, r, 2.2, 'paper', 'body') + K.on(K.TOP(x, y, ZT + 3.2), `<circle class="det" r="${r - 1.6}"/>` + Array.from({ length: 12 }, (_, i) => { const t = i * Math.PI / 6; return `<circle class="f blk" cx="${f(Math.cos(t) * (r - .6))}" cy="${f(Math.sin(t) * (r - .6))}" r=".4"/>`; }).join('')) + K.cyl(x, y, ZT + 3.2, r * .45, 1, 'paper', 'body') +
    [0, 1, 2, 3].map((q) => K.prism(bar(x, y, q * Math.PI / 2 + Math.PI / 4, r + 1, r + 5, 1.4), ZT, 3.6, 'paper', 'body', 'tint')).join('');
  s += burner(20, 18, 6) + burner(42, 20, 4.6);
  s += K.on(K.FRONT(X, Y + D, ZT), [W / 2 - 12, W / 2 + 12].map((x) => `<circle class="det" cx="${x}" cy="5" r="4.2"/><line class="det" x1="${x}" y1="${f(5 - 4.2)}" x2="${x}" y2="${f(5 - 5.6)}"/>`).join(''));
  s += lit(K.cylY(Y + D, Y + D + 3, X + W / 2 - 12, ZT - 5, 3.2, 'body', 'body') + K.on(K.FRONT(X + W / 2 - 12, Y + D + 3, ZT - 5), '<rect class="f paper" x="-.8" y="-3" width="1.6" height="6" rx=".6"/>'));
  s += K.cylY(Y + D, Y + D + 3, X + W / 2 + 12, ZT - 5, 3.2, 'paper', 'body') + K.on(K.FRONT(X + W / 2 + 12, Y + D + 3, ZT - 5), '<rect class="f tint" x="-.8" y="-3" width="1.6" height="6" rx=".6"/>');
  return s;
});

// ── Campaign group scoreboard: three stacks of ingots, the tallest live.
const IG = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [56, 22, 34]], 12);
const ingots = icon(IG, 'Three stacks of ingots laid crosswise, one short, one middling and one tall.', () => {
  const K = IG;
  let s = plate(K, 0, 0, 72, 44);
  const stack = (x: number, y: number, n: number, live = false) => { let g = ''; for (let i = 0; i < n; i++) { const z = 4 + i * 4, along = i % 2 === 0; g += along ? frustum(K, x, y + 2, z, 14, 5, 4, 1, live ? 'body' : 'paper', 'body', live ? 'body' : 'tint') + frustum(K, x, y + 8, z, 14, 5, 4, 1, live ? 'body' : 'paper', 'body', live ? 'body' : 'tint') : frustum(K, x + 2, y, z, 5, 14, 4, 1, live ? 'body' : 'paper', 'body', live ? 'body' : 'tint') + frustum(K, x + 8, y, z, 5, 14, 4, 1, live ? 'body' : 'paper', 'body', live ? 'body' : 'tint'); } return live ? lit(g) : g; };
  return s + stack(6, 16, 2) + stack(28, 15, 4) + stack(50, 14, 7, true);
});

// ── Campaign group scoreboard: three flagpoles, the flag on the tallest (live).
const FL = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [36, 20, 70]], 12);
const flags = icon(FL, 'Three flagpoles of different heights on a plinth; a flag flies from the tallest.', () => {
  const K = FL;
  let s = plate(K, 0, 0, 72, 40) + K.box(8, 12, 4, 56, 16, 4, 'paper', 'body', 'tint');
  const pole = (x: number, h: number) => K.cyl(x, 20, 8, 3, 2, 'paper', 'body') + K.cyl(x, 20, 10, 1, h, 'paper', 'tint') + ball(K, x, 20, 11 + h, 1.6, 'f paper');
  s += pole(18, 34) + pole(36, 52);
  s += lit(K.on(K.FRONT(37, 20, 61), '<path class="f body" d="M0 0C5 -2 9 2 14 0V10C9 12 5 8 0 10Z"/>')) + K.line([[37, 20, 61], [37, 20, 51]], 'det');
  return s + pole(54, 40);
});

// ── Market benchmark comparison: a vernier caliper closed on a pin (live sliding jaw).
const VC = kernel([[0, 0, 0], [76, 0, 0], [0, 46, 0], [76, 46, 0], [20, 30, 14]], 12);
const caliper = icon(VC, 'A vernier caliper lying flat, its sliding jaw closed on a pin standing between the jaws.', () => {
  const K = VC, Z = 4.4;
  const beam = 'M8 14H70V20H8ZM8 20H15L15 36L12 36L8 24Z', slide = 'M24 12H40V22H31V36H28L24 26Z';
  const layer = (z: number, top: boolean) => K.on(K.TOP(0, 0, z), `<path class="f ${top ? 'paper' : 'tint'}" d="${beam}"/>` + (top ? ticks(24, 40, 1.25, 14, 3, 1.6, 4) : ''));
  let s = plate(K, 0, 0, 76, 46) + layer(Z, false) + K.cyl(19.5, 30, 4, 4.4, 10, 'paper', 'tint') + K.on(K.TOP(19.5, 30, 14), '<circle class="det" r="2.4"/>') + layer(Z + 2, true);
  s += lit([0, 2].map((dz) => K.on(K.TOP(0, 0, Z + 2 + dz), `<path class="f body" d="${slide}"/>` + (dz ? ticks(8, 30, 1.2, 12, 2.4, 1.4, 4) + '<circle class="f paper" cx="36" cy="17" r="1.2"/>' : ''))).join(''));
  s += K.on(K.TOP(0, 0, Z + 2), '<rect class="f paper" x="70" y="16.2" width="4" height="1.6"/>');
  return s;
});

// ── Market benchmark comparison: a tape measure, its blade pulled out along the plate (live blade).
const TPM = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [18, 20, 30]], 12);
const tapemeasure = icon(TPM, 'A tape measure with its blade pulled out along the plate, the hook caught over the far edge.', () => {
  const K = TPM, Y = 18;
  let s = plate(K, 0, 0, 76, 40);
  s += lit(K.box(26, Y, 4, 44, 5, .6, 'body', 'body', 'body') + K.on(K.TOP(26, Y, 4.6), ticks(22, 2, 2, .2, 2.8, 1.4, 5)) + K.box(70, Y - .5, 0, 1.2, 6, 4.6, 'body', 'body', 'body'));
  s += K.box(8, 13, 4, 20, 15, 20, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 28, 24), '<circle class="det" cx="10" cy="10" r="8"/><circle class="f paper" cx="10" cy="10" r="2"/><line class="det" x1="8.6" y1="10" x2="11.4" y2="10"/>');
  s += K.box(14, 13, 24, 8, 4, 2.4, 'paper', 'body', 'tint') + K.on(K.SIDE(28, 28, 24), '<rect class="f blk" x="6" y="15" width="6" height="1.2"/>') + K.box(28, 16, 4, 2, 9, 3, 'paper', 'body', 'tint');
  return s;
});

// ── Manager monthly report: a ring binder open flat, sheets on its rings (live rings).
const RB = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [36, 22, 16]], 12);
const binder = icon(RB, 'A ring binder open flat with a stack of punched sheets on its three rings.', () => {
  const K = RB, Y = 8, D = 30;
  let s = plate(K, 0, 0, 72, 44) + K.box(6, Y, 4, 28, D, 1.4, 'tint', 'body', 'tint') + K.box(34, Y, 4, 4, D, 1, 'body', 'body', 'body') + K.box(38, Y, 4, 28, D, 1.4, 'tint', 'body', 'tint');
  s += K.box(30, Y + 2, 5.4, 6, D - 4, .8, 'paper', 'body', 'tint');
  for (let i = 0; i < 4; i++) s += K.box(39 - i * .4, Y + 2 - i * .3, 5.4 + i * 1.2, 24, D - 4, 1.2, 'paper', 'body', 'tint');
  s += K.on(K.TOP(38.6, Y + 2, 10.2), [6, 12, 18].map((y) => `<line class="det" x1="5" y1="${y}" x2="20" y2="${y}"/>`).join(''));
  s += lit([Y + 6, Y + D / 2, Y + D - 6].map((y) => K.on(K.FRONT(34, y, 6.4), '<path class="f body" fill-rule="evenodd" d="M-1 0A5 5 0 0 1 9 0H7.6A3.6 3.6 0 0 0 .4 0Z"/>')).join(''));
  return s;
});

// ── Manager monthly report: a dot-matrix printer, the folded stack of the month's report in front (live stack).
const DX = kernel([[0, 0, 0], [70, 0, 0], [0, 46, 0], [70, 46, 0], [30, 2, 46]], 12);
const dotmatrix = icon(DX, 'A dot-matrix printer feeding continuous paper up and over; the printed sheets fold into a stack in front of it.', () => {
  const K = DX, X = 10, Y = 8, W = 48, D = 20, ZT = 18;
  let s = plate(K, 0, 0, 70, 46) + K.on(planeAt(K, [X + 6, Y + 6, ZT + 2], [1, 0, 0], [0, .35, -.94]), `<rect class="f paper" x="0" y="-26" width="${W - 12}" height="26"/>` + [-24, -20, -16, -12, -8, -4].map((y) => `<circle class="det" cx="2" cy="${y}" r=".6"/><circle class="det" cx="${W - 14}" cy="${y}" r=".6"/><line class="det" x1="6" y1="${y}" x2="${W - 20}" y2="${y}"/>`).join(''));
  s += K.box(X, Y, 4, W, D, ZT - 4, 'paper', 'body', 'tint') + K.cylX(X + 2, X + W - 2, Y + 6, ZT, 3, 'paper', 'tint') + K.on(K.TOP(X, Y, ZT), `<rect class="f blk" x="6" y="9" width="${W - 12}" height="1.6"/>`) + K.cylX(X + W, X + W + 3, Y + 6, ZT - 2, 3.4, 'paper', 'body');
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="det" x="4" y="4" width="10" height="4" rx=".5"/>` + [32, 36, 40].map((x) => `<circle class="f paper" cx="${x}" cy="6" r="1.2"/>`).join(''));
  let st = '';
  for (let i = 0; i < 6; i++) st += K.box(X + 8, Y + D + 4, 4 + i * 1.4, W - 16, 14, 1.4, 'body', 'body', 'body');
  s += lit(st + K.on(K.FRONT(X + 8, Y + D + 18, 12.4), Array.from({ length: 6 }, (_, i) => `<path class="det" d="M0 ${f(.7 + i * 1.4)}H${W - 16}"/>`).join('')));
  return s;
});

export const ALT_SKILLS_A = { parkmeter, farebox, throttle, dimmer, cardpunch, coinpress, boom, guardcage, stencil, extruder, mailbox, signal, cctv, radar, toolbox, stethoscope, filter, tuningfork, sensorlamp, tally, inkjet, tape, projector, testcard, clamp, hob, ingots, flags, caliper, tapemeasure, binder, dotmatrix };
