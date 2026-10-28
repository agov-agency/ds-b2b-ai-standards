// Alternative skill icons, batch 3: rulers, logbook, lockout, weekpad, knocker, puzzle, bell, thermometer. Same style as
// icons-skills.ts: one object (or a tight pair) on a plate, its telling details, one live part.
import { kernel, f, type V3 } from '../iso';
import { prism, bar, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from '../icons';
import type { Alt } from './index';

// A ring in a face plane (local 2D), the middle cut out
const ann = (r0: number, r1: number, cls = 'f body') => `<path class="${cls}" fill-rule="evenodd" d="M${r0} 0A${r0} ${r0} 0 1 1 ${-r0} 0A${r0} ${r0} 0 1 1 ${r0} 0ZM${r1} 0A${r1} ${r1} 0 1 0 ${-r1} 0A${r1} ${r1} 0 1 0 ${r1} 0Z"/>`;
const ball = (K: K, x: number, y: number, z: number, r: number, cls = 'f tint') => { const [px, py] = K.P(x, y, z); return `<circle class="${cls}" cx="${f(px)}" cy="${f(py)}" r="${r}"/><path class="det" d="M${f(px - r * .62)} ${f(py - r * .1)}A${r * .7} ${r * .7} 0 0 1 ${f(px + r * .1)} ${f(py - r * .62)}"/>`; };
// Upright cone or frustum: the wall facing the viewer from radius r0 at z to r1 at z + h, then the top (none if top = '')
const cone = (K: K, cx: number, cy: number, z: number, r0: number, r1: number, h: number, top = 'paper', side = 'body') => {
  const a0 = -Math.PI / 4, a1 = 3 * Math.PI / 4;
  return K.poly([...K.ring(cx, cy, z, r0, a0, a1, 24), ...K.ring(cx, cy, z + h, r1, a0, a1, 24).reverse()], `f ${side}`) + (top ? K.poly(K.ring(cx, cy, z + h, r1), `f ${top}`) : '');
};
// Screen-space clip to a flat ring's opening, for looking into a cup
const clipTo = (K: K, id: string, cx: number, cy: number, z: number, r: number, inner: string) =>
  `<clipPath id="${id}"><polygon points="${K.ring(cx, cy, z, r).map((p) => K.P(...p).map(f).join(' ')).join(' ')}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;

// ── Swatch fan: market benchmark. A fan of colour strips on its rivet, the market's shades; one strip swung out to sit
// against them is live.
const SW = kernel([[0, -8, 0], [84, -8, 0], [0, 48, 0], [84, 48, 0], [14, 38, 12]], 12);
const swatch = icon(SW, 'A fan deck of colour swatch strips on a rivet; one strip is swung out from the rest.', () => {
  const K = SW, PX = 14, PY = 38, L = 54;
  let s = plate(K, 0, -8, 84, 56);
  const strip = (a: number, z: number, cells: string[]) => prism(K, bar(PX, PY, a, -5, L, 9), z, .8, 'paper', 'body') +
    K.on(K.TOP(PX, PY, z + .8), `<g transform="rotate(${f(a * 180 / Math.PI)})">${cells.map((c, j) => `<rect class="f ${c}" x="${14 + j * 10}" y="-3.2" width="8.6" height="6.4" rx=".4"/>`).join('')}<circle class="det" r="2.6"/></g>`);
  const shades = [['paper', 'tint', 'tint', 'body'], ['tint', 'tint', 'body', 'body'], ['paper', 'paper', 'tint', 'body'], ['tint', 'body', 'body', 'body'], ['paper', 'tint', 'body', 'body']];
  shades.forEach((c, i) => { s += strip(.02 - i * .13, 4 + i * .8, c); });
  s += lit(strip(-1.02, 8, ['body', 'body', 'body', 'body']));
  s += K.cyl(PX, PY, 8.8, 2.4, 1.2, 'paper', 'body') + K.on(K.TOP(PX, PY, 10), '<circle class="f blk" r=".8"/>');
  return s;
});

// ── Ring mandrel: market benchmark. A graduated ring-sizing mandrel on its base; the ring slid down to where it fits
// is live, its size read off the standard scale.
const MD = kernel([[0, 0, 0], [64, 0, 0], [0, 52, 0], [64, 52, 0], [32, 26, 74]], 12);
const mandrel = icon(MD, 'A tapered ring-sizing mandrel with rings of graduations, a ring slid down onto it where it fits.', () => {
  const K = MD, CX = 32, CY = 26, Z0 = 15, ZT = 72, R0 = 5.4, R1 = 1.6, r = (z: number) => R0 + (R1 - R0) * (z - Z0) / (ZT - Z0);
  let s = plate(K, 0, 0, 64, 52) + K.cyl(CX, CY, 4, 15, 5, 'paper', 'body') + K.line(K.ring(CX, CY, 6.6, 15, -Math.PI / 4, Math.PI * 3 / 4, 30), 'det') + K.cyl(CX, CY, 9, 7.4, 3, 'paper', 'tint') + K.cyl(CX, CY, 12, 6, 3, 'paper', 'body');
  // The ring's far half first, so the mandrel covers it
  const RZ = 40, RH = 3, rin = r(RZ + RH), rout = r(RZ) + 1.8;
  s += lit(K.poly(K.ring(CX, CY, RZ + RH, rout), 'f body'));
  s += cone(K, CX, CY, Z0, R0, R1, ZT - Z0, 'paper', 'paper');
  for (let i = 0; i < 18; i++) { const z = 18 + i * 3, big = i % 5 === 0; s += K.line(K.ring(CX, CY, z, r(z), big ? -Math.PI / 4 : .1, big ? Math.PI * 3 / 4 : 1.0, 12), 'det'); }
  s += lit(K.poly([...K.ring(CX, CY, RZ, rout, -Math.PI / 4, Math.PI * 3 / 4, 24), ...K.ring(CX, CY, RZ + RH, rout, -Math.PI / 4, Math.PI * 3 / 4, 24).reverse()], 'f body') +
    K.poly([...K.ring(CX, CY, RZ + RH, rout, -Math.PI / 4, Math.PI * 3 / 4, 24), ...K.ring(CX, CY, RZ + RH, rin, -Math.PI / 4, Math.PI * 3 / 4, 24).reverse()], 'f body'));
  return s;
});

// ── Sealed envelope: manager monthly report. Last month's envelope under this month's, closed with a wax seal (live).
const EV = kernel([[0, 0, 0], [76, 0, 0], [0, 52, 0], [76, 52, 0], [40, 26, 12]], 12);
const envelope = icon(EV, 'Two envelopes stacked on a plate, the top one closed with a wax seal and ribbon tails.', () => {
  const K = EV, W = 54, D = 34;
  let s = plate(K, 0, 0, 76, 52);
  const env = (x: number, y: number, z: number) => K.box(x, y, z, W, D, 1.4, 'paper', 'body', 'tint') +
    K.on(K.TOP(x, y, z + 1.4), `<path class="det" d="M0 0L${W / 2} ${D * .56}L${W} 0M0 ${D}L${W * .4} ${D * .44}M${W} ${D}L${W * .6} ${D * .44}"/>`);
  s += env(14, 6, 4) + env(8, 12, 5.4);
  // Ribbon tails under the seal, then the seal: a blob of wax with a stamped ring
  const SX = 8 + W / 2, SY = 12 + D * .56, Z = 6.8;
  s += K.on(K.TOP(SX, SY, Z), '<path class="f tint" d="M-1 2L-5 11L-2.6 10.4L-1.6 13L2 3Z"/><path class="f tint" d="M1 2L7 9.6L4.6 9.8L4.4 12.4L-.6 3Z"/>');
  s += lit(K.cyl(SX, SY, Z, 5.4, 1.4, 'body', 'body') + K.on(K.TOP(SX, SY, Z + 1.4), '<circle class="det" r="3.6"/><path class="det" d="M-1.6 1.2L0 -1.8L1.6 1.2Z"/>'));
  return s;
});

// ── Briefcase: manager monthly report. A case on its feet with the month's report sticking out of its mouth (live).
const BC = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [26, 22, 56]], 12);
const briefcase = icon(BC, 'A briefcase standing on its feet, its handle on top and a report sticking out of its open mouth.', () => {
  const K = BC, X = 12, Y = 16, W = 52, D = 14, H = 34, Z = 6;
  let s = plate(K, 0, 0, 76, 44) + [X + 4, X + W - 8].map((x) => K.box(x, Y + 4, 4, 4, 6, 2, 'paper', 'body', 'tint')).join('');
  // The report first, rising out of the gap between the two halves
  s += lit(K.box(X + 5, Y + 6, Z + H - 4, 18, 1.2, 17, 'paper', 'body', 'tint') + K.on(K.FRONT(X + 5, Y + 7.2, Z + H + 13), '<rect class="f body" x="2" y="2" width="10" height="2"/><path class="det" d="M2 6H18M2 8.4H15"/>'));
  s += K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint') + K.on(K.TOP(X, Y, Z + H), `<path class="f blk" d="M3 ${D / 2 - .5}H${W - 3}V${D / 2 + .5}H3Z"/>`);
  s += K.on(K.FRONT(X, Y + D, Z + H), `<path class="det" d="M0 7H${W}"/><path class="f tint" d="M0 ${H - 6}V${H}H6Z"/><path class="f tint" d="M${W} ${H - 6}V${H}H${W - 6}Z"/>` +
    [10, W - 16].map((x) => `<rect class="f body" x="${x}" y="5" width="6" height="5" rx=".6"/><rect class="f paper" x="${x + 2}" y="6.6" width="2" height="1.8"/>`).join(''));
  s += K.on(K.SIDE(X + W, Y + D, Z + H), `<path class="det" d="M0 7H${D}"/>`);
  // Handle: two lugs and the grip arching between them
  for (const x of [X + W / 2 - 9, X + W / 2 + 6]) s += K.box(x, Y + D / 2 - 1.5, Z + H, 3, 3, 2, 'paper', 'body', 'tint');
  const g: V3[] = [[X + W / 2 - 7.5, Y + D / 2, Z + H + 2], ...K.curve([X + W / 2 - 7.5, Y + D / 2, Z + H + 9], [X + W / 2, Y + D / 2, Z + H + 11], [X + W / 2 + 7.5, Y + D / 2, Z + H + 9], 12), [X + W / 2 + 7.5, Y + D / 2, Z + H + 2]];
  s += rope(K, g, 2.6, 'f body');
  return s;
});

// ── Boom barrier: pausing ads. A barrier arm lowered across the lane onto its rest post; the striped arm is live.
const BB = kernel([[0, 0, 0], [94, 0, 0], [0, 36, 0], [94, 36, 0], [13, 17, 42]], 12);
const barrier = icon(BB, 'A boom barrier: a housing with the striped arm lowered across onto a forked rest post.', () => {
  const K = BB, Y = 17, AZ = 28;
  let s = plate(K, 0, 0, 94, 36);
  // Housing with a service door, a cap
  s += K.box(4, 8, 4, 20, 18, 4, 'paper', 'body', 'tint') + K.box(6, 10, 8, 16, 14, 28, 'paper', 'body', 'tint') + K.box(5, 9, 36, 18, 16, 2.4, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(6, 24, 36), '<rect class="det" x="3" y="4" width="10" height="20" rx=".6"/><rect class="f blk" x="10.6" y="13" width="1.2" height="3"/>') + K.on(K.SIDE(22, 24, 36), Array.from({ length: 4 }, (_, i) => `<line class="det" x1="4" y1="${4 + i * 2.4}" x2="10" y2="${4 + i * 2.4}"/>`).join(''));
  // Rest post: back fork cheek, then the arm, then the front cheek
  s += K.box(80, Y - 2.6, 4, 6, 5.2, 2, 'paper', 'body', 'tint') + K.box(81.4, Y - 1.2, 6, 3.2, 2.4, AZ - 8, 'paper', 'body', 'tint') + K.box(81, Y - 2.8, AZ - 4, 4, 1.2, 6, 'paper', 'body', 'tint');
  const L = 64, n = 8;
  s += lit(K.box(22, Y - 1.6, AZ - 1.8, L, 3.2, 3.6, 'paper', 'body', 'paper') +
    K.on(K.FRONT(22, Y + 1.6, AZ + 1.8), Array.from({ length: n }, (_, i) => i % 2 ? '' : `<rect class="f body" x="${4 + i * (L - 6) / n}" y="0" width="${f((L - 6) / n)}" height="3.6"/>`).join('')) +
    K.on(K.FRONT(48, Y + 1.7, AZ), '<circle class="f paper" r="4.6"/><circle class="det" r="3.4"/><rect class="f body" x="-2.6" y="-.8" width="5.2" height="1.6"/>'));
  s += K.box(81, Y + 1.6, AZ - 4, 4, 1.2, 6, 'paper', 'body', 'tint');
  // Pivot hub on the housing's side
  s += K.cylX(22, 25, Y, AZ, 4, 'paper', 'body') + K.on(K.SIDE(25, Y, AZ), '<circle class="f paper" r="1.6"/>');
  return s;
});

// ── Candle snuffer: pausing ads. A candle in its holder with the snuffer bell set over the wick (live), a wisp of smoke.
const CS = kernel([[0, 0, 0], [66, 0, 0], [0, 48, 0], [66, 48, 0], [26, 26, 52], [56, 6, 58]], 12);
const snuffer = icon(CS, 'A candle in a dish holder with a snuffer bell on a long handle set over its wick, a wisp of smoke rising.', () => {
  const K = CS, CX = 26, CY = 26, ZC = 38;
  let s = plate(K, 0, 0, 66, 48);
  // Dish with a finger ring, the socket, the candle with a dip at its top
  s += K.cyl(CX, CY, 4, 15, 2.4, 'paper', 'body') + K.on(K.TOP(CX, CY, 6.4), '<circle class="det" r="12.6"/>');
  s += K.on(planeAt(K, [CX + 2, CY + 15.6, 5.2], [1, 0, 0], [0, 0, -1]), ann(4, 2.4, 'f body'));
  s += K.cyl(CX, CY, 6.4, 5.4, 4, 'paper', 'body') + K.cyl(CX, CY, 10.4, 3.8, ZC - 10.4, 'paper', 'tint') + K.on(K.TOP(CX, CY, ZC), '<circle class="det" r="2.4"/>');
  s += K.line([[CX, CY, ZC], [CX, CY, ZC + 2]], 'f');
  // Smoke curling out from under the bell's rim
  const [wx, wy] = K.P(CX - 4, CY + 4, ZC + 2);
  s += `<path class="det" d="M${f(wx)} ${f(wy)}c-3 -3 2 -6 -1 -10s1.6 -6 -1.4 -9"/>`;
  // The bell over the wick, the handle up to the right with its grip
  s += lit(cone(K, CX, CY, ZC + 1, 5.2, 1.8, 8, 'paper', 'body') + K.cyl(CX, CY, ZC + 9, 1.4, 2, 'paper', 'body'));
  s += rope(K, [[CX + 1.4, CY - 1, ZC + 9.6], [CX + 12, CY - 8, ZC + 12.6], [52, 8, ZC + 15]], 1.4, 'f body') + K.cyl(54, 7, ZC + 13.6, 2.4, 3.6, 'paper', 'tint');
  return s;
});

// ── Pill box: weekly reporting. A seven-day pill organiser, the lids marked one to seven dots; one day stands open (live).
const PB = kernel([[0, 0, 0], [84, 0, 0], [0, 40, 0], [84, 40, 0], [42, 0, 30]], 12);
const pillbox = icon(PB, 'A seven-day pill organiser in a row; each lid has its count of dots, one lid stands open with two pills inside.', () => {
  const K = PB, X = 7, Y = 14, C = 10, D = 16, Z = 12, OPEN = 3;
  let s = plate(K, 0, 0, 84, 40) + K.box(X, Y, 4, 7 * C, D, Z - 4, 'paper', 'body', 'tint');
  for (let i = 0; i < 7; i++) {
    const x = X + i * C;
    if (i === OPEN) {
      // Inside the open cell, cut to its mouth: floor, back and left walls, the pills; the lid stands up at the back
      const mouth = ([[x + 1, Y + 1], [x + C - 1, Y + 1], [x + C - 1, Y + D - 1], [x + 1, Y + D - 1]] as P2[]).map(([a, b]) => K.P(a, b, Z).map(f).join(' ')).join(' ');
      const inside = K.poly([[x + 1, Y + 1, 6], [x + C - 1, Y + 1, 6], [x + C - 1, Y + D - 1, 6], [x + 1, Y + D - 1, 6]], 'f tint') + K.poly([[x + 1, Y + 1, 6], [x + C - 1, Y + 1, 6], [x + C - 1, Y + 1, Z], [x + 1, Y + 1, Z]], 'f body') +
        K.poly([[x + 1, Y + 1, 6], [x + 1, Y + D - 1, 6], [x + 1, Y + D - 1, Z], [x + 1, Y + 1, Z]], 'f body') + K.cyl(x + 4, Y + 6, 6, 2, 1.4, 'paper', 'body') + K.cyl(x + 6, Y + 11, 6, 2, 1.4, 'paper', 'body');
      s += `<clipPath id="s3-pill"><polygon points="${mouth}"/></clipPath><g clip-path="url(#s3-pill)">${inside}</g>`;
      const th = .22, sn = Math.sin(th), cs = Math.cos(th), top: V3 = [x + .4, Y - D * sn, Z + D * cs];
      s += lit(K.poly([[x + C - .4, Y, Z], [x + C - .4, top[1], top[2]], [x + C - .4, top[1] - 1.4 * cs, top[2] + 1.4 * sn - .2], [x + C - .4, Y - 1.4, Z]], 'f body') +
        K.on(planeAt(K, top, [1, 0, 0], [0, sn, -cs]), `<rect class="f body" width="${C - .8}" height="${D}"/><rect class="det" x="1.4" y="1.4" width="${C - 3.6}" height="${D - 2.8}" rx=".6"/>`));
      continue;
    }
    s += K.box(x + .4, Y, Z, C - .8, D, 1.4, 'paper', 'body', 'tint') + K.box(x + 3.4, Y + D, Z - .4, 3.2, 1.2, 1.8, 'paper', 'body', 'tint');
    s += K.on(K.TOP(x + .4, Y, Z + 1.4), Array.from({ length: i + 1 }, (_, j) => `<circle class="f blk" cx="${f((C - .8) / 2 + (j % 4 - (Math.min(i, 3)) / 2) * 1.9)}" cy="${f(D / 2 + (j < 4 ? 0 : 2.4) - (i >= 4 ? 1.2 : 0))}" r=".6"/>`).join(''));
  }
  return s;
});

// ── Mailbox: weekly reporting. A post-mounted mailbox with its flag raised: this week's report is in (the flag is live).
const MB = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [14, 21, 48], [50, 28, 58]], 12);
const mailbox = icon(MB, 'A round-topped mailbox on a post with its signal flag raised.', () => {
  const K = MB, X0 = 12, X1 = 56, CY = 22, R = 7, Z0 = 34, CZ = 40;
  let s = plate(K, 0, 0, 72, 44) + K.box(26, 16, 4, 14, 12, 2, 'paper', 'body', 'tint') + K.box(30, 19, 6, 6, 6, Z0 - 6, 'paper', 'body', 'tint') + K.box(22, 18, Z0 - 2, 22, 8, 2, 'paper', 'body', 'tint');
  // Box: the front wall, the rounded roof, then the door on the +x end
  const arc = (x: number): V3[] => Array.from({ length: 19 }, (_, i) => { const a = i * Math.PI * .75 / 18; return [x, CY + R * Math.cos(a), CZ + R * Math.sin(a)]; });
  s += K.poly([[X0, CY + R, Z0], [X1, CY + R, Z0], [X1, CY + R, CZ], [X0, CY + R, CZ]], 'f tint') + K.poly([...arc(X0), ...arc(X1).reverse()], 'f paper');
  for (const x of [X0 + 6, X1 - 6]) s += K.line(arc(x), 'det') + K.line([[x, CY + R, CZ], [x, CY + R, Z0]], 'det');
  const H = CZ - Z0;
  s += K.on(K.SIDE(X1, CY + R, CZ), `<path class="f body" d="M0 ${H}V0A${R} ${R} 0 0 1 ${2 * R} 0V${H}Z"/><path class="det" d="M1.4 ${H - 1.2}V0A${R - 1.4} ${R - 1.4} 0 0 1 ${2 * R - 1.4} 0V${H - 1.2}Z"/><rect class="f paper" x="${R - 1.6}" y="-6" width="3.2" height="2" rx=".5"/>`);
  // The flag up on its arm
  s += lit(K.on(K.FRONT(X1 - 10, CY + R + .6, CZ - 2), '<rect class="f body" x="-.8" y="-16" width="1.6" height="17"/><rect class="f body" x="-9" y="-16" width="8.2" height="5.4" rx=".4"/>')) + K.on(K.FRONT(X1 - 10, CY + R + .8, CZ - 2), '<circle class="f paper" r="1.6"/><circle class="f blk" r=".5"/>');
  return s;
});

// ── Ring stack: capping recommendation. Rings stacked on a peg up to the stop cap (live); one more ring waits on the plate.
const RK = kernel([[0, 0, 0], [66, 0, 0], [0, 50, 0], [66, 50, 0], [24, 22, 38]], 12);
const ringstack = icon(RK, 'Five rings stacked on a peg up to a stop cap on its top, a sixth ring lying on the plate beside it.', () => {
  const K = RK, CX = 24, CY = 22, R = 10, H = 3.8;
  let s = plate(K, 0, 0, 66, 50) + K.cyl(CX, CY, 4, 14, 3.6, 'paper', 'body') + K.cyl(CX, CY, 7.6, 3, 1, 'paper', 'body');
  const one = (x: number, y: number, z: number) => K.cyl(x, y, z, R, H, 'paper', 'tint');
  for (let i = 0; i < 5; i++) s += one(CX, CY, 8.6 + i * (H + .6)) + (i < 4 ? K.cyl(CX, CY, 8.6 + i * (H + .6) + H, 3, .6, 'paper', 'body') : '');
  const zt = 8.6 + 5 * (H + .6) - .6;
  s += K.on(K.TOP(CX, CY, zt), '<circle class="det" r="6.6"/>') + K.cyl(CX, CY, zt, 2.4, 2, 'paper', 'body');
  s += lit(K.cyl(CX, CY, zt + 2, 5.6, 3, 'body', 'body') + K.cyl(CX, CY, zt + 5, 3, 2, 'paper', 'body'));
  // The spare ring flat on the plate, its hole showing
  s += one(50, 36, 4) + K.on(K.TOP(50, 36, 4 + H), '<circle class="det" r="6.6"/><circle class="f blk" r="2.6"/>');
  return s;
});

// ── Jigger: capping recommendation. A bar measure poured to its line beside the bottle; the measured dose is live.
const JG = kernel([[0, 0, 0], [64, 0, 0], [0, 50, 0], [64, 50, 0], [20, 16, 60]], 12);
const jigger = icon(JG, 'A double-cone bar jigger filled to its line, standing in front of a bottle.', () => {
  const K = JG, BX = 20, BY = 16, JX = 40, JY = 32, ZW = 16, ZT = 30, RT = 7.6, RW = 2.2;
  let s = plate(K, 0, 0, 64, 50);
  // Bottle: body, a label band, the shoulder, the neck and its cap
  s += K.cyl(BX, BY, 4, 9, 30, 'paper', 'tint') + K.line(K.ring(BX, BY, 14, 9, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det') + K.line(K.ring(BX, BY, 26, 9, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det');
  s += cone(K, BX, BY, 34, 9, 3.2, 7, '', 'tint') + K.cyl(BX, BY, 41, 3.2, 10, 'paper', 'tint') + K.cyl(BX, BY, 51, 3.6, 4, 'paper', 'body');
  // Jigger: the small cup upside down, the waist band, the big cup open on top
  s += cone(K, JX, JY, 4, 6, RW, ZW - 4, '', 'body') + K.cyl(JX, JY, ZW, RW + .6, 1.4, 'paper', 'body') + cone(K, JX, JY, ZW + 1.4, RW, RT, ZT - ZW - 1.4, 'paper', 'body');
  const rz = (z: number) => RW + (RT - RW) * (z - ZW - 1.4) / (ZT - ZW - 1.4), ZL = 26;
  const inside = K.poly(K.ring(JX, JY, ZT, RT), 'f tint') + lit(K.poly(K.ring(JX, JY, ZL, rz(ZL)), 'f body')) + K.line(K.ring(JX, JY, ZL + 1.4, rz(ZL + 1.4), Math.PI * .75, Math.PI * 1.75, 20), 'det');
  s += clipTo(K, 's3-jig', JX, JY, ZT, RT - .7, inside);
  return s;
});

// ── Ring box: account engagement. An open ring box, the ring standing in the cushion's slot (live).
const RB = kernel([[0, 0, 0], [62, 0, 0], [0, 50, 0], [62, 50, 0], [16, 2, 40], [30, 28, 32]], 12);
const ringbox = icon(RB, 'An open ring box: the lid tipped back on its hinge, an engagement ring with a stone standing in the cushion.', () => {
  const K = RB, X = 16, Y = 16, W = 28, D = 24, Z = 16, th = .3, sn = Math.sin(th), cs = Math.cos(th);
  let s = plate(K, 0, 0, 62, 50);
  // Lid tipped back: its edge, then the lined inside facing us
  const top: V3 = [X, Y - D * sn, Z + D * cs];
  s += K.poly([[X + W, Y, Z], [X + W, top[1], top[2]], [X + W, top[1] - 4 * cs, top[2] + 4 * sn - .2], [X + W, Y - 4, Z]], 'f body');
  s += K.on(planeAt(K, top, [1, 0, 0], [0, sn, -cs]), `<rect class="f body" width="${W}" height="${D}" rx=".8"/><rect class="f tint" x="2.4" y="2.4" width="${W - 4.8}" height="${D - 4.8}" rx="1.4"/>`);
  s += K.box(X, Y, 4, W, D, Z - 4, 'paper', 'body', 'tint') + K.on(K.FRONT(X, Y + D, Z), `<path class="det" d="M0 3H${W}"/><rect class="f paper" x="${W / 2 - 2}" y="1.6" width="4" height="2.8" rx=".5"/>`) + K.on(K.SIDE(X + W, Y + D, Z), `<path class="det" d="M0 3H${D}"/>`);
  s += K.on(K.TOP(X, Y, Z), `<rect class="f tint" x="2.4" y="2.4" width="${W - 4.8}" height="${D - 4.8}" rx="2"/><path class="f blk" d="M${W / 2 - 4.6} ${D / 2 - .4}H${W / 2 + 4.6}V${D / 2 + .4}H${W / 2 - 4.6}Z"/>`);
  // The ring: a band in two layers for its thickness, the setting and stone on top
  const RX = X + W / 2, RY = Y + D / 2, RR = 6.2, CZ = Z + RR - .8;
  s += lit(K.on(K.FRONT(RX, RY - .7, CZ), ann(RR, RR - 1.6)) + K.on(K.FRONT(RX, RY + .7, CZ), ann(RR, RR - 1.6, 'f paper')) +
    K.cyl(RX, RY, CZ + RR - .6, 1.6, 1.2, 'paper', 'body') + cone(K, RX, RY, CZ + RR + .6, 1.4, 3, 1.6, '', 'body') + prism(K, Array.from({ length: 6 }, (_, i) => [RX + 3 * Math.cos(i * Math.PI / 3 + .3), RY + 3 * Math.sin(i * Math.PI / 3 + .3)] as P2), CZ + RR + 2.2, .8, 'paper', 'body'));
  return s;
});

// ── Gear lever: account engagement. A gate of an H-shift on its console, the lever pushed into gear (its knob is live).
const GL = kernel([[0, 0, 0], [64, 0, 0], [0, 52, 0], [64, 52, 0], [24, 20, 44]], 12);
const gearlever = icon(GL, 'A gear lever standing in an H-pattern gate on a console, pushed into one of the gears.', () => {
  const K = GL, X = 12, Y = 12, W = 40, D = 30, Z = 14, GX = X + 6, GY = Y + 5;
  let s = plate(K, 0, 0, 64, 52) + K.box(X, Y, 4, W, D, Z - 4, 'paper', 'body', 'tint') + K.on(K.FRONT(X, Y + D, Z), `<path class="det" d="M3 3H${W - 3}"/>`) + K.on(K.SIDE(X + W, Y + D, Z), `<path class="det" d="M3 3H${D - 3}"/>`);
  // Gate plate with the H slot and a dot at the end of each gear
  s += K.box(GX, GY, Z, 28, 20, 1.4, 'paper', 'body', 'tint') + K.on(K.TOP(GX, GY, Z + 1.4), screws([[2.4, 2.4], [25.6, 2.4], [2.4, 17.6], [25.6, 17.6]]) +
    '<path class="f blk" d="M5.2 3.6H6.8V9.2H13.2V3.6H14.8V9.2H21.2V3.6H22.8V16.4H21.2V10.8H14.8V16.4H13.2V10.8H6.8V16.4H5.2Z"/>');
  // Lever in the first gear: a rubber collar, the shaft, the knob
  const LX = GX + 6, LY = GY + 4.4;
  s += K.cyl(LX, LY, Z + 1.4, 2.6, 1.6, 'paper', 'tint') + K.cyl(LX, LY, Z + 3, 1.2, 22, 'paper', 'body');
  s += lit(K.cyl(LX, LY, Z + 24, 2.4, 1.4, 'paper', 'body') + ball(K, LX, LY, Z + 29, 5.4, 'f body'));
  return s;
});

// ── Desk phone: ad-hoc query. A desk telephone with its handset off the cradle, lying in front on its coiled cord (live).
const DP = kernel([[0, 0, 0], [76, 0, 0], [0, 52, 0], [76, 52, 0], [30, 14, 30]], 12);
const deskphone = icon(DP, 'A desk telephone with a keypad and an empty cradle; the handset lies off the hook in front of it on a coiled cord.', () => {
  const K = DP, X = 14, Y = 8, W = 36, D = 28;
  let s = plate(K, 0, 0, 76, 52) + K.box(X, Y, 4, W, D, 10, 'paper', 'body', 'tint') + K.box(X, Y, 14, W, 11, 8, 'paper', 'body', 'tint');
  s += K.on(K.TOP(X, Y + 11, 14), Array.from({ length: 12 }, (_, i) => `<rect class="f ${i === 4 ? 'tint' : 'paper'}" x="${9 + (i % 3) * 6.4}" y="${2 + Math.floor(i / 3) * 3.6}" width="4.8" height="2.6" rx=".5"/>`).join('') + '<rect class="det" x="7.6" y="1" width="21.4" height="15" rx=".6"/>');
  // Empty cradle: two forks on the raised back
  for (const x of [X + 4, X + W - 8]) s += K.box(x, Y + 3, 22, 4, 2, 4, 'paper', 'body', 'tint') + K.box(x, Y + 7, 22, 4, 2, 4, 'paper', 'body', 'tint');
  s += K.on(K.TOP(X, Y, 22), `<rect class="f blk" x="13" y="4.6" width="10" height="1.6" rx=".4"/>`);
  // Coiled cord from the phone's side round to the handset's near cup
  const path = K.curve([X + W, Y + 22, 8], [56, 50, 5], [60, 41, 6], 64).map((p, i) => [p[0] + Math.cos(i * 1.3) * 1.2, p[1], p[2] + Math.sin(i * 1.3) * 1.2] as V3);
  s += K.line(path, 'f nofill');
  // Handset lying beside it on the plate: two cups and the grip between them
  const cup = (y: number) => K.cyl(61, y, 4, 5.4, 4, 'paper', 'body') + K.cyl(61, y, 8, 4.4, 2, 'paper', 'body') + K.on(K.TOP(61, y, 10), '<circle class="det" r="2.8"/>' + [0, 1, 2, 3].map((i) => `<circle class="f blk" cx="${f(Math.cos(i * 1.57) * 1.4)}" cy="${f(Math.sin(i * 1.57) * 1.4)}" r=".4"/>`).join(''));
  s += lit(cup(13) + K.cylY(17, 32, 61, 9, 2.2, 'paper', 'body') + cup(36));
  return s;
});

// ── Voice pipe: ad-hoc query. A ship's speaking tube up out of the deck, its mouth facing us with the lid flipped up
// (live): open it and ask the engine room, any time.
const VP = kernel([[8, 0, 0], [50, 0, 0], [8, 42, 0], [50, 42, 0], [28, 26, 56]], 12);
const voicepipe = icon(VP, 'A ship voice pipe rising from a deck plate, bent towards the viewer, its flared mouth open with the hinged lid flipped up.', () => {
  const K = VP, CX = 28, CY = 16, CZ = 36, Y1 = 26;
  let s = plate(K, 8, 0, 42, 42) + K.cyl(CX, CY, 4, 8, 2.4, 'paper', 'body') + [0, 1, 2, 3].map((q) => { const a = q * Math.PI / 2 + Math.PI / 4; return dot(K, CX + Math.cos(a) * 6, CY + Math.sin(a) * 6, 6.4, .8); }).join('');
  // The pipe up to the bend with a coupling band half way
  s += K.cyl(CX, CY, 6.4, 3, 13.6, 'paper', 'tint') + K.cyl(CX, CY, 20, 3.6, 2.4, 'paper', 'body') + K.cyl(CX, CY, 22.4, 3, CZ - 22.4, 'paper', 'tint');
  // Bend and run towards us, then the flare and the mouth
  s += K.cylY(CY, Y1, CX, CZ, 3, 'paper', 'tint') + K.cylY(Y1, Y1 + 2, CX, CZ, 4.6, 'paper', 'body') + K.cylY(Y1 + 2, Y1 + 3.4, CX, CZ, 6.4, 'paper', 'body');
  s += K.on(K.FRONT(CX, Y1 + 3.4, CZ), '<circle class="det" r="5.4"/><circle class="f blk" r="4"/>');
  // The lid on its hinge at the top of the rim, flipped up and back
  const o: V3 = [CX, Y1 + 3.4, CZ + 6.4], pl = planeAt(K, o, [1, 0, 0], [0, .35, -.94]), pl2 = planeAt(K, [CX, Y1 + 3.4 + .5, CZ + 6.4 - .2], [1, 0, 0], [0, .35, -.94]);
  s += lit(K.on(pl, '<circle class="f body" cy="-6.6" r="6.4"/>') + K.on(pl2, '<circle class="f body" cy="-6.6" r="6.4"/><circle class="det" cy="-6.6" r="4.4"/><circle class="f paper" cy="-6.6" r="1.4"/>'));
  s += K.cylX(CX - 2.4, CX + 2.4, Y1 + 3.6, CZ + 6.4, 1, 'paper', 'body');
  return s;
});

// ── Prototype weight: benchmark comparison. The reference cylinder under its two glass bells, the one every other
// weight is held against (the cylinder is live).
const PW = kernel([[0, 0, 0], [60, 0, 0], [0, 52, 0], [60, 52, 0], [30, 26, 56]], 12);
const prototype = icon(PW, 'A reference weight cylinder standing under two nested glass bell jars on a round wooden stand.', () => {
  const K = PW, CX = 30, CY = 26, Z = 12;
  let s = plate(K, 0, 0, 60, 52) + K.cyl(CX, CY, 4, 18, 4, 'paper', 'body') + K.cyl(CX, CY, 8, 16, 4, 'paper', 'tint') + K.on(K.TOP(CX, CY, Z), '<circle class="det" r="14.6"/><circle class="det" r="10.6"/>');
  // A glass bell as a see-through outline: walls, a domed top, the front of its rim, a knob
  const bell = (r: number, z1: number, knob: boolean) => {
    const [px, y0] = K.P(CX, CY, Z), [, y1] = K.P(CX, CY, z1), R = r * 1.2247, ry = R * .577;
    return `<path class="f nofill" d="M${f(px - R)} ${f(y0)}V${f(y1)}A${f(R)} ${f(R)} 0 0 1 ${f(px + R)} ${f(y1)}V${f(y0)}A${f(R)} ${f(ry)} 0 0 1 ${f(px - R)} ${f(y0)}Z"/>` +
      `<path class="det" d="M${f(px - R * .7)} ${f(y1 + 4)}V${f(y1 - R * .2)}A${f(R * .8)} ${f(R * .8)} 0 0 1 ${f(px - R * .3)} ${f(y1 - R * .72)}"/>` + (knob ? ball(K, CX, CY, z1 + r * 1.2247 + 1.2, 2.2, 'f paper') : '');
  };
  s += lit(K.cyl(CX, CY, Z, 4.6, 9.2, 'body', 'body') + K.on(K.TOP(CX, CY, Z + 9.2), '<circle class="det" r="3.2"/>'));
  s += bell(9, Z + 14, false) + bell(13, Z + 20, true);
  return s;
});

// ── Plumb bob: benchmark comparison. A bob hung on a gallows stand over a mark, the true vertical to hold things to
// (the bob is live); the post carries a scale.
const PL = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [14, 20, 66], [46, 20, 66]], 12);
const plumb = icon(PL, 'A plumb bob hanging on a string from a gallows stand, its point just over a cross mark on the plate.', () => {
  const K = PL, PX = 12, PY = 18, BX = 44, BY = 20, ZA = 62;
  let s = plate(K, 0, 0, 64, 44) + K.box(PX - 5, PY - 6, 4, 14, 16, 3, 'paper', 'body', 'tint') + K.box(PX, PY, 7, 4, 4, ZA - 7, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(PX, PY + 4, ZA), Array.from({ length: 14 }, (_, i) => `<line class="det" x1="0" y1="${4 + i * 3.6}" x2="${i % 5 ? 1.6 : 3}" y2="${4 + i * 3.6}"/>`).join(''));
  s += K.on(K.TOP(BX, BY, 4), '<path class="det" d="M-6 0H6M0 -6V6"/><circle class="det" r="2.6"/>');
  s += K.box(PX - 1, PY - .4, ZA, BX - PX + 5, 4.8, 3, 'paper', 'body', 'tint') + K.poly([[PX + 4, PY + 4.4, ZA - 12], [PX + 4, PY + 4.4, ZA - 1], [PX + 15, PY + 4.4, ZA - 1]], 'f tint');
  // String from the arm's hook down to the bob
  s += K.cyl(BX, BY, ZA - 1.6, 1.2, 1.6, 'paper', 'body') + K.line([[BX, BY, ZA - 1.6], [BX, BY, 22]], 'f');
  s += lit(cone(K, BX, BY, 8, .2, 4.4, 10, 'paper', 'body') + K.cyl(BX, BY, 18, 2.8, 3.6, 'paper', 'body') + K.cyl(BX, BY, 21.6, 1.2, 1, 'paper', 'body'));
  return s;
});

export const ALTS: Record<string, Alt> = {
  'alt-rulers-1': { of: 'i-rulers', idea: 'Віяло колірних смужок: свій відтінок відведено вбік і поставлено поруч із ринковими', piece: swatch },
  'alt-rulers-2': { of: 'i-rulers', idea: 'Конус-мірник для каблучок: кільце сідає там, де його розмір на загальній шкалі', piece: mandrel },
  'alt-logbook-1': { of: 'i-logbook', idea: 'Конверт під сургучною печаткою на торішньому: щомісячний звіт, закритий і готовий до передачі', piece: envelope },
  'alt-logbook-2': { of: 'i-logbook', idea: 'Портфель зі звітом, що визирає назовні: несемо підсумок місяця керівнику', piece: briefcase },
  'alt-lockout-1': { of: 'i-lockout', idea: 'Опущений шлагбаум: показ зупинено, поки рішення не переглянуть', piece: barrier },
  'alt-lockout-2': { of: 'i-lockout', idea: 'Гасильник над свічкою: слабку рекламу гасять, а не спалюють бюджет далі', piece: snuffer },
  'alt-weekpad-1': { of: 'i-weekpad', idea: 'Таблетниця на сім днів: один відділ відкрито, кожен тиждень по черзі', piece: pillbox },
  'alt-weekpad-2': { of: 'i-weekpad', idea: 'Поштова скринька з піднятим прапорцем: тижневий звіт уже лежить усередині', piece: mailbox },
  'alt-knocker-1': { of: 'i-knocker', idea: 'Кільця на стрижні до стопорного ковпачка: показів стільки, скільки вміщує ліміт', piece: ringstack },
  'alt-knocker-2': { of: 'i-knocker', idea: 'Барний мірник, налитий до риски: доза показів відміряна, не більше', piece: jigger },
  'alt-puzzle-1': { of: 'i-puzzle', idea: 'Відкрита коробочка з каблучкою: заручини як залученість акаунта', piece: ringbox },
  'alt-puzzle-2': { of: 'i-puzzle', idea: 'Важіль коробки передач у передачі: акаунт увімкнувся і тягне', piece: gearlever },
  'alt-bell-1': { of: 'i-bell', idea: 'Стаціонарний телефон зі знятою слухавкою: подзвонив і спитав, коли треба', piece: deskphone },
  'alt-bell-2': { of: 'i-bell', idea: 'Переговорна труба корабля з відкинутою кришкою: відкрив і спитав машинне відділення, коли треба', piece: voicepipe },
  'alt-thermometer-1': { of: 'i-thermometer', idea: 'Еталонна гиря під двома скляними ковпаками: зразок, з яким звіряють усі інші', piece: prototype },
  'alt-thermometer-2': { of: 'i-thermometer', idea: 'Висок на стійці: справжня вертикаль, до якої прикладають свої цифри', piece: plumb },
};
