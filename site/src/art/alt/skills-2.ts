// Alternative skill icons, batch 2 (periscope … trophies): two new objects per item, in the style of icons-skills.ts.
import { kernel, f, type V3 } from '../iso';
import { prism, bar, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from '../icons';
import type { Alt } from './index';

// Visible half of a tapered round wall (a bucket, a cone) between two rings
const taper = (K: K, cx: number, cy: number, z0: number, r0: number, z1: number, r1: number, cls = 'f body') =>
  K.poly([...K.ring(cx, cy, z0, r0, -Math.PI / 4, Math.PI * 3 / 4, 24), ...K.ring(cx, cy, z1, r1, -Math.PI / 4, Math.PI * 3 / 4, 24).reverse()], cls);
const half = (K: K, cx: number, cy: number, z: number, r: number) => K.line(K.ring(cx, cy, z, r, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det');
// A teardrop hanging from screen point (x, y), h tall
const drop = (x: number, y: number, h: number, w: number, cls = 'f body') => `<path class="${cls}" d="M${f(x)} ${f(y)}C${f(x - w * .2)} ${f(y + h * .4)} ${f(x - w / 2)} ${f(y + h * .6)} ${f(x - w / 2)} ${f(y + h * .78)}A${f(w / 2)} ${f(w / 2)} 0 0 0 ${f(x + w / 2)} ${f(y + h * .78)}C${f(x + w / 2)} ${f(y + h * .6)} ${f(x + w * .2)} ${f(y + h * .4)} ${f(x)} ${f(y)}Z"/>`;

// ── Binoculars: silent watchers finder. Field glasses on a tripod, turned on you; the objective lenses are live.
const BN = kernel([[0, 0, 0], [70, 0, 0], [0, 52, 0], [70, 52, 0], [35, 24, 64], [24, 8, 58], [46, 8, 58]], 12);
const binoculars = icon(BN, 'A pair of binoculars on a tripod, the two objective lenses turned toward the viewer.', () => {
  const K = BN, CX = 35, CY = 22, AZ = 30, CZ = 48, R = 5.6, Y0 = CY - 11, Y1 = CY + 9;
  let s = plate(K, 0, 0, 70, 52);
  const leg = (x: number, y: number) => rope(K, [[CX, CY, AZ], [x, y, 5.6]], 2.2, 'f paper') + K.cyl(x, y, 4, 2.4, 1.6, 'paper', 'body');
  // Back legs, the head with its column and lock knob, then the front leg
  s += leg(20, 8) + leg(54, 14);
  s += K.cyl(CX, CY, AZ - 4, 3.6, 5, 'paper', 'body') + K.cyl(CX, CY, AZ + 1, 1.8, 8, 'paper', 'body') + K.box(CX - 5, CY - 5, AZ + 9, 10, 10, 2.4, 'paper', 'body', 'tint');
  s += K.cylX(CX + 3.6, CX + 7, CY, AZ - 1.5, 1.4, 'paper', 'body');
  s += leg(28, 46);
  s += K.box(CX - 2, CY - 2, AZ + 11.4, 4, 4, CZ - R - AZ - 9, 'paper', 'body');
  // Barrels: eyepieces behind, the body, a hood and the lens at the front; the hinge and focus wheel between them
  const barrel = (x: number) => K.cylY(Y0 - 4, Y0, x, CZ, 3.4, 'paper', 'body') + K.cylY(Y0, Y1, x, CZ, R, 'paper', 'tint') + half(K, x, Y0 + 5, CZ, R) +
    K.cylY(Y1, Y1 + 3, x, CZ, R + .8, 'paper', 'body') + lit(K.on(K.FRONT(x, Y1 + 3, CZ), `<circle class="f body" r="${R - .8}"/><circle class="det" r="${R - 2.6}"/>`));
  s += barrel(CX - 7);
  s += K.cylY(Y0 + 1, Y1 - 4, CX, CZ + 2.6, 2.4, 'paper', 'body') + K.cylY(Y0 + 2, Y0 + 6, CX, CZ + 3.4, 3.6, 'paper', 'tint');
  s += barrel(CX + 7);
  return s;
});

// ── Theatre seats: silent watchers finder. A row of three folding seats; two have sprung up, the middle one is down:
// someone sits there in the dark and says nothing. The lowered seat is live.
const TS = kernel([[0, 0, 0], [84, 0, 0], [0, 40, 0], [84, 40, 0], [10, 6, 50]], 12);
const seats = icon(TS, 'A row of three folding theatre seats; two are folded up, the middle one is down as if someone is sitting in it.', () => {
  const K = TS, XS = [6, 29, 52, 75], Y = 6, D = 26;
  let s = plate(K, 0, 0, 84, 40) + K.box(3, 30, 4, 78, 6, 1.6, 'paper', 'tint');
  const standard = (x: number) => K.box(x, Y, 4, 3, D, 24, 'paper', 'body', 'tint') + K.box(x - .6, Y + 2, 28, 4.2, D - 2, 2.2, 'paper', 'body', 'tint') +
    K.on(K.SIDE(x + 3, Y + D, 22), `<rect class="det" x="3" y="2" width="${D - 6}" height="14" rx=".8"/>`);
  XS.forEach((x, i) => {
    s += standard(x);
    if (i === XS.length - 1) return;
    const a = x + 3.4, w = XS[i + 1] - a - .4;
    // Back with its cushion, then the seat: up against the back, or down (live)
    s += K.box(a, Y, 12, w, 4, 34, 'paper', 'body', 'tint') + K.on(K.FRONT(a, Y + 4, 46), `<rect class="det" x="2" y="2" width="${f(w - 4)}" height="26" rx="1.2"/>`);
    if (i === 1) s += lit(K.box(a, Y + 5, 17, w, D - 7, 4, 'body', 'body', 'body') + K.on(K.TOP(a, Y + 5, 21), `<rect class="det" x="2" y="2" width="${f(w - 4)}" height="${D - 11}" rx="1.2"/>`));
    else s += K.box(a, Y + 5, 15, w, 4, 21, 'paper', 'body', 'tint') + K.on(K.FRONT(a, Y + 9, 36), `<rect class="det" x="2" y="2" width="${f(w - 4)}" height="17" rx="1"/>`);
  });
  return s;
});

// ── Stethoscope: account health check. A stethoscope laid on the plate, ear tips to chest piece; the diaphragm is live.
const SC = kernel([[0, 0, 0], [72, 0, 0], [0, 52, 0], [72, 52, 0], [40, 26, 12]], 12);
const stethoscope = icon(SC, 'A stethoscope lying flat: ear tips, the metal tubes, the rubber tube and the round chest piece.', () => {
  const K = SC, Z = 5.6;
  let s = plate(K, 0, 0, 72, 52);
  // Ear tips and the sprung metal tubes, joined by the spring bar
  s += K.cyl(8, 10, 4, 2.4, 3, 'paper', 'tint') + K.cyl(26, 4, 4, 2.4, 3, 'paper', 'tint');
  s += rope(K, K.curve([9, 12, Z], [12, 22, Z], [20, 26, Z], 12), 1.4, 'f paper') + rope(K, K.curve([27, 6, Z], [32, 14, Z], [28, 22, Z], 12), 1.4, 'f paper');
  s += rope(K, [[13, 18, Z], [30, 14, Z]], 1.2, 'f paper');
  // The Y yoke and the rubber tube in a loop to the chest piece
  s += rope(K, K.curve([20, 26, Z], [24, 26, Z], [28, 22, Z], 8), 2.8, 'f body') + K.cyl(24, 25, 4, 2, 3.4, 'paper', 'body');
  s += rope(K, [...K.curve([24, 27, Z], [20, 44, Z], [36, 46, Z], 16), ...K.curve([36, 46, Z], [52, 46, Z], [48, 34, Z], 12).slice(1)], 3, 'f body');
  // Chest piece: stem, the bell, the rim and the diaphragm on top
  s += K.cylX(44, 48, 32, 6, 1.4, 'paper', 'body');
  s += K.cyl(54, 32, 4, 7.4, 2.6, 'paper', 'body') + K.cyl(54, 32, 6.6, 6.6, 1, 'paper', 'tint');
  s += lit(K.on(K.TOP(54, 32, 7.6), `<circle class="f body" r="5.4"/><circle class="det" r="3.4"/>`));
  return s;
});

// ── Dipstick: account health check. An engine block with its filler tube open; the dipstick lies drawn out in front,
// the oil on its tip between the two marks (live).
const DS = kernel([[0, 0, 0], [76, 0, 0], [0, 48, 0], [76, 48, 0], [36, 18, 42]], 12);
const dipstick = icon(DS, 'An engine block with its filler tube open and the dipstick drawn out in front, oil on its tip between the marks.', () => {
  const K = DS, Y = 40;
  let s = plate(K, 0, 0, 76, 48);
  // The block with fins, a rocker cover with bolts, the filler tube
  s += K.box(8, 6, 4, 40, 26, 22, 'paper', 'body', 'tint');
  s += K.on(K.SIDE(48, 32, 22), Array.from({ length: 5 }, (_, i) => `<line class="det" x1="3" y1="${2 + i * 3.4}" x2="23" y2="${2 + i * 3.4}"/>`).join(''));
  s += K.on(K.FRONT(8, 32, 26), `<rect class="det" x="4" y="4" width="32" height="12" rx=".8"/>` + screws([[6.5, 6.5], [33.5, 6.5], [6.5, 13.5], [33.5, 13.5]]));
  s += K.box(11, 9, 26, 34, 20, 6, 'paper', 'body', 'tint') + [[14, 12], [42, 12], [14, 26], [42, 26]].map(([x, y]) => dot(K, x, y, 32)).join('');
  s += K.cyl(38, 18, 32, 3, 8, 'paper', 'body') + K.cyl(38, 18, 40, 3.8, 1.4, 'paper', 'tint') + K.on(K.TOP(38, 18, 41.4), '<circle class="f blk" r="2"/>');
  // The dipstick: loop handle, the blade, its rounded tip with the marks and the oil band
  s += K.on(K.TOP(4, Y - 4, 4), `<circle class="f tint" cx="4" cy="4" r="4.2"/><circle class="f paper" cx="4" cy="4" r="2.4"/>`);
  s += prism(K, bar(8, Y, 0, 0, 62, 1.8), 4, .8, 'paper', 'body');
  s += lit(prism(K, bar(8, Y, 0, 50, 62, 1.8), 4, .9, 'body', 'body'));
  s += K.on(K.TOP(8, Y, 4.9), `<line class="det" x1="52" y1="-2.4" x2="52" y2="2.4"/><line class="det" x1="58" y1="-2.4" x2="58" y2="2.4"/>`);
  return s;
});

// ── Test tubes: CRM data health check. A rack of samples drawn from the records; one tube is clouded (live).
const TT = kernel([[0, 0, 0], [80, 0, 0], [0, 36, 0], [80, 36, 0], [40, 18, 48]], 12);
const testtubes = icon(TT, 'A rack of five test tubes with samples in them; one sample is off.', () => {
  const K = TT, Y = 18, R = 3.2, XS = [20, 30, 40, 50, 60], LV = [40, 39, 34, 40, 38], BAD = 2, Z1 = 26, Z2 = 30, ZT = 46;
  let s = plate(K, 0, 0, 80, 36) + K.box(6, 10, 4, 68, 16, 4, 'paper', 'body', 'tint') + K.on(K.FRONT(6, 26, 8), `<rect class="det" x="24" y="1" width="20" height="2" rx=".4"/>`);
  const post = (x: number) => K.box(x, 14, 8, 4, 8, Z2 - 8, 'paper', 'body', 'tint');
  const liquid = (i: number, z: number, h: number) => { const l = K.cyl(XS[i], Y, z, R - .8, h, 'body', 'body'); return i === BAD ? lit(l) : l; };
  s += post(8);
  // Lower halves behind the shelf, the shelf with its holes, the upper halves, the far post
  XS.forEach((x, i) => { s += K.cyl(x, Y, 8, R, Z1 - 8, 'paper', 'paper') + liquid(i, 8.6, Z1 - 8.6); });
  s += K.box(6, 10, Z1, 68, 16, Z2 - Z1, 'paper', 'body', 'tint') + XS.map((x) => K.on(K.TOP(x, Y, Z2), `<circle class="f blk" r="${R + .6}"/>`)).join('');
  XS.forEach((x, i) => {
    s += K.cyl(x, Y, Z2, R, ZT - Z2, 'paper', 'paper') + liquid(i, Z2, LV[i] - Z2);
    s += K.cyl(x, Y, ZT, R + .6, 1, 'paper', 'paper') + K.on(K.TOP(x, Y, ZT + 1), `<circle class="det" r="${R - .6}"/>`);
  });
  s += post(68);
  return s;
});

// ── Comb: CRM data health check. A comb standing in its cradle with teeth missing, gaps you see at once; one broken
// tooth lies in front (live).
const CM = kernel([[0, 0, 0], [80, 0, 0], [0, 40, 0], [80, 40, 0], [10, 20, 40], [70, 20, 40]], 12);
const comb = icon(CM, 'A comb standing in a cradle with a few teeth missing; one broken tooth lies on the plate in front.', () => {
  const K = CM, Y = 19, T = 3, GONE = [5, 6, 11];
  let s = plate(K, 0, 0, 80, 40) + K.box(8, 15, 4, 64, 11, 6, 'paper', 'body', 'tint') + K.on(K.TOP(8, 15, 10), `<rect class="f blk" x="2" y="${Y - 15 - .4}" width="60" height="${T + .8}" rx=".4"/>`);
  s += K.box(10, Y, 10, 60, T, 8, 'paper', 'body', 'tint') + K.on(K.FRONT(10, Y + T, 18), `<line class="det" x1="2" y1="4" x2="58" y2="4"/>`);
  for (let i = 0; i < 17; i++) {
    const x = 11.4 + i * 3.4;
    if (GONE.includes(i)) { s += K.box(x, Y, 18, 1.8, T, 1.4, 'paper', 'body', 'tint'); continue; }
    s += K.box(x, Y, 18, 1.8, T, 20 - (i % 2) * .8, 'paper', 'body', 'tint');
  }
  s += lit(prism(K, bar(46, 33, -.5, 0, 16, 1.8), 4, 2.4, 'body', 'body'));
  return s;
});

// ── Ticket dispenser: who's looking at your buying pages. A take-a-number dispenser on its post by the counter; the
// next ticket hangs out of the slot (live).
const TD = kernel([[0, 0, 0], [60, 0, 0], [0, 46, 0], [60, 46, 0], [30, 22, 74]], 12);
const ticket = icon(TD, 'A take-a-number ticket dispenser on a post, a ticket hanging out of its slot.', () => {
  const K = TD, CX = 30, CY = 20, CZ = 56, R = 12, Y1 = CY + 5;
  let s = plate(K, 0, 0, 60, 46);
  // Foot, post with a collar, the bracket under the housing
  s += K.cyl(CX, CY, 4, 11, 2.6, 'paper', 'body') + K.cyl(CX, CY, 6.6, 6, 1.6, 'paper', 'tint') + K.cyl(CX, CY, 8.2, 2.2, CZ - R - 8, 'paper', 'body');
  s += K.cyl(CX, CY, 24, 3.2, 2.4, 'paper', 'tint') + K.box(CX - 3, CY - 3, CZ - R - 2, 6, 6, 3, 'paper', 'body', 'tint');
  // Housing: a round shell, the tinted front with the reel cover and the slot at its foot
  s += K.cylY(CY - 5, CY + 3, CX, CZ, R, 'paper', 'body') + K.cylY(CY + 3, Y1, CX, CZ, R - .8, 'paper', 'tint');
  s += K.on(K.FRONT(CX, Y1, CZ), `<circle class="det" r="${R - 3.4}"/><circle class="f paper" r="2"/><rect class="f blk" x="-5" y="${R - 4.6}" width="10" height="1.6" rx=".4"/>` + screws([[-6, -6], [6, -6]]));
  s += K.cylY(CY - 2, CY + 1, CX, CZ + R, 2.4, 'paper', 'body');
  // The ticket out of the slot, its tear line and blank number field
  s += lit(K.on(K.FRONT(CX, Y1 + .4, CZ), `<path class="f body" d="M-4 ${R - 3.8}H4V${R + 9}L2.6 ${R + 10}L1.3 ${R + 9}L0 ${R + 10}L-1.3 ${R + 9}L-2.6 ${R + 10}L-4 ${R + 9}Z"/><rect class="det" x="-2.4" y="${R - 1}" width="4.8" height="5" rx=".4"/>`));
  return s;
});

// ── Shopping cart: who's looking at your buying pages. A cart with something already in the basket but not yet paid
// for; the box in it is live.
const SH = kernel([[0, 0, 0], [76, 0, 0], [0, 48, 0], [76, 48, 0], [6, 12, 60], [8, 36, 60], [44, 28, 58]], 12);
const cart = icon(SH, 'A shopping cart with a box in its wire basket, parked and not yet checked out.', () => {
  const K = SH, X0 = 16, X1 = 58, Y0 = 12, Y1 = 36, ZB = 24, ZT = 44;
  let s = plate(K, 0, 0, 76, 48);
  const wheel = (x: number, y: number) => K.box(x - 1, y - 1, 9, 2, 2, ZB - 9, 'paper', 'body') + K.cylY(y - 1.4, y + 1.4, x, 7, 3, 'paper', 'body') + K.on(K.FRONT(x, y + 1.4, 7), '<circle class="f blk" r="1"/>');
  const grid = (w: number, h: number) => Array.from({ length: Math.floor(w / 4) }, (_, i) => `<line class="det" x1="${4 + i * 4}" y1="1" x2="${4 + i * 4}" y2="${h - 1}"/>`).join('') + `<line class="det" x1="1" y1="${h / 2}" x2="${w - 1}" y2="${h / 2}"/>`;
  // Back wheels, the chassis rails, the handle on the far end
  s += wheel(X0 + 4, Y0 + 2) + wheel(X1 - 4, Y0 + 2) + wheel(X0 + 4, Y1 - 2);
  s += K.box(X0 + 2, Y0 + 1, 12, X1 - X0 - 4, 2, 2, 'paper', 'body') + K.box(X0 + 2, Y1 - 3, 12, X1 - X0 - 4, 2, 2, 'paper', 'body');
  s += rope(K, [[X0, Y0, ZT], [X0 - 8, Y0, ZT + 8]], 1.4, 'f paper') + K.cylY(Y0 - 2, Y1 + 2, X0 - 8, ZT + 8, 1.8, 'paper', 'tint') + rope(K, [[X0, Y1, ZT], [X0 - 8, Y1, ZT + 8]], 1.4, 'f paper');
  // Basket: the inside of the two far walls and the floor, the box, then the two near walls
  s += K.poly([[X0, Y0, ZB], [X1, Y0, ZB], [X1, Y1, ZB], [X0, Y1, ZB]], 'f tint');
  s += K.poly([[X0, Y0, ZB], [X1, Y0, ZB], [X1, Y0, ZT], [X0, Y0, ZT]], 'f body') + K.on(K.FRONT(X0, Y0, ZT), grid(X1 - X0, ZT - ZB));
  s += K.poly([[X0, Y0, ZB], [X0, Y1, ZB], [X0, Y1, ZT], [X0, Y0, ZT]], 'f body') + K.on(K.SIDE(X0, Y1, ZT), grid(Y1 - Y0, ZT - ZB));
  s += lit(K.box(26, 17, ZB, 20, 14, 26, 'body', 'body', 'body') + K.on(K.TOP(26, 17, ZB + 26), `<path class="det" d="M0 7H20M10 0V14"/>`));
  s += K.poly([[X0, Y1, ZB], [X1, Y1, ZB], [X1, Y1, ZT], [X0, Y1, ZT]], 'f paper') + K.on(K.FRONT(X0, Y1, ZT), grid(X1 - X0, ZT - ZB));
  s += K.poly([[X1, Y0, ZB], [X1, Y1, ZB], [X1, Y1, ZT], [X1, Y0, ZT]], 'f paper') + K.on(K.SIDE(X1, Y1, ZT), grid(Y1 - Y0, ZT - ZB));
  s += K.line([[X0, Y1, ZT], [X1, Y1, ZT], [X1, Y0, ZT]], 'f nofill');
  s += wheel(X1 - 4, Y1 - 2);
  return s;
});

// ── Candle: creative decay watchlist. A chamberstick with the candle burnt down to a stub, wax run down its side;
// the flame is live.
const CN = kernel([[0, 0, 0], [60, 0, 0], [0, 48, 0], [60, 48, 0], [28, 22, 40]], 12);
const candle = icon(CN, 'A candle burnt down to a stub in a chamberstick, wax run down its side, still alight.', () => {
  const K = CN, CX = 28, CY = 22, R = 4.4, Z0 = 11, H = 9;
  let s = plate(K, 0, 0, 60, 48);
  // Dish with its rim, the finger ring on the near side, the socket
  s += K.cyl(CX, CY, 4, 15, 2.2, 'paper', 'body') + K.on(K.TOP(CX, CY, 6.2), `<circle class="det" r="12.6"/>`) + K.on(K.TOP(CX + 4, CY + 6, 6.2), `<path class="f paper" d="M0 0q3 1 2 3t-3 1q-2-1 1-4Z"/>`);
  const ring: V3[] = Array.from({ length: 25 }, (_, i) => { const a = i / 24 * Math.PI * 2; return [CX + 16 + 4 * Math.cos(a), CY + 11, 5 + 4 * Math.sin(a) + 1.2] as V3; });
  s += rope(K, ring, 1.4, 'f paper') + K.box(CX + 9, CY + 9.6, 4.6, 5, 2.8, 1.6, 'paper', 'body');
  s += K.cyl(CX, CY, 6.2, 6, 1.4, 'paper', 'body') + K.cyl(CX, CY, 7.6, R + 1, Z0 - 7.6, 'paper', 'tint');
  // The stub with drips down its front, a melted pool on top, the wick
  s += K.cyl(CX, CY, Z0, R, H, 'paper', 'paper') + K.on(K.TOP(CX, CY, Z0 + H), `<circle class="det" r="${R - 1.2}"/>`);
  for (const [a, l] of [[.2, 5], [.9, 3], [1.6, 6]]) { const x = CX + R * Math.cos(a), y = CY + R * Math.sin(a); s += rope(K, [[x, y, Z0 + H], [x, y, Z0 + H - l]], 1.4, 'f paper'); }
  const [wx, wy] = K.P(CX, CY, Z0 + H + 2.4), [bx, by] = K.P(CX, CY, Z0 + H);
  s += `<path class="f blk" d="M${f(bx - .4)} ${f(by)}L${f(wx - .4)} ${f(wy)}L${f(wx + .4)} ${f(wy)}L${f(bx + .4)} ${f(by)}Z"/>`;
  s += lit(`<g transform="translate(${f(wx)} ${f(wy + 2)}) scale(1 -1)">${drop(0, 0, 12, 5.6)}${drop(0, 1.6, 7, 2.6, 'det')}</g>`);
  return s;
});

// ── Pencil sharpener: creative decay watchlist. A crank sharpener with a pencil worn down to a stub in its mouth, a new
// pencil beside it for scale; the stub is live.
const PN = kernel([[0, 0, 0], [72, 0, 0], [0, 48, 0], [72, 48, 0], [26, 18, 38]], 12);
const sharpener = icon(PN, 'A crank pencil sharpener with a pencil worn down to a short stub in it, a full-length pencil lying beside.', () => {
  const K = PN, X0 = 10, X1 = 38, Y0 = 8, Y1 = 30, Z = 26, PX = 24, PY = 18;
  let s = plate(K, 0, 0, 72, 48);
  // Body, the shavings drawer in front, the fluted top with the mouth
  s += K.box(X0, Y0, 4, X1 - X0, Y1 - Y0, Z - 4, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X0, Y1, Z), `<rect class="det" x="3" y="10" width="${X1 - X0 - 6}" height="10" rx=".8"/><rect class="f blk" x="${(X1 - X0) / 2 - 3}" y="14" width="6" height="2" rx=".6"/>` + screws([[3.4, 3.4], [X1 - X0 - 3.4, 3.4]]));
  s += K.on(K.SIDE(X1, Y1, Z), `<circle class="det" cx="${(Y1 - Y0) / 2}" cy="8" r="5"/>`);
  s += K.cyl(PX, PY, Z, 6, 3, 'paper', 'body') + K.on(K.TOP(PX, PY, Z + 3), `<circle class="f blk" r="3.4"/>`);
  // Crank on the side: shaft, arm, knob
  s += K.cylX(X1, X1 + 4, (Y0 + Y1) / 2, 14, 1.6, 'paper', 'body') + rope(K, [[X1 + 4.6, (Y0 + Y1) / 2, 14], [X1 + 4.6, (Y0 + Y1) / 2 + 2, 26]], 2.6, 'f paper') + K.cylX(X1 + 4, X1 + 10, (Y0 + Y1) / 2 + 2, 26, 1.8, 'paper', 'tint');
  // The stub: a short hexagonal shank, the ferrule, the eraser
  const hex = Array.from({ length: 6 }, (_, i) => [PX + 2.8 * Math.cos(i * Math.PI / 3), PY + 2.8 * Math.sin(i * Math.PI / 3)] as P2);
  s += lit(prism(K, hex, Z + 3, 5, 'body', 'body') + K.cyl(PX, PY, Z + 8, 2.8, 2, 'body', 'body') + K.cyl(PX, PY, Z + 10, 2.5, 2.4, 'body', 'body'));
  // Shavings on the plate, the new pencil in front
  s += K.on(K.TOP(44, 10, 4), `<path class="f paper" d="M0 0q4-3 7 0t-2 4q-3 0-2-2"/><path class="f paper" d="M8 7q3-2 5 1t-3 2"/>`);
  s += prism(K, bar(8, 40, 0, 6, 52, 3.4), 4, 3, 'paper', 'tint') + K.on(K.TOP(8, 40, 7), `<line class="det" x1="6" y1="0" x2="52" y2="0"/>`);
  s += K.poly([[14, 41.7, 4], [14, 41.7, 7], [8, 40, 5.5]], 'f tint') + K.poly([[14, 38.3, 7], [14, 41.7, 7], [8, 40, 5.5]], 'f paper') + K.poly([[10, 40.6, 5.5], [10, 39.4, 6], [8, 40, 5.5]], 'f blk');
  s += K.cylX(60, 62.6, 40, 5.5, 1.7, 'paper', 'body') + K.cylX(62.6, 65, 40, 5.5, 1.5, 'paper', 'tint');
  return s;
});

// ── Test-card TV: video quality check. A cabinet set on short legs, rabbit ears on top, the test bars on its screen (live).
const TV = kernel([[0, 0, 0], [64, 0, 0], [0, 46, 0], [64, 46, 0], [18, 14, 74], [48, 22, 72]], 12);
const testcard = icon(TV, 'An old television on short legs with rabbit-ear aerials, a test pattern of bars on its screen.', () => {
  const K = TV, X0 = 8, X1 = 54, Y0 = 8, Y1 = 36, Z0 = 10, Z1 = 46;
  let s = plate(K, 0, 0, 64, 46);
  for (const [x, y] of [[X0 + 3, Y0 + 3], [X1 - 5, Y0 + 3], [X0 + 3, Y1 - 5], [X1 - 5, Y1 - 5]]) s += K.box(x, y, 4, 2, 2, Z0 - 4, 'paper', 'body');
  // Tube housing behind, the cabinet, the screen with its bars, the control strip
  s += K.box(X0 + 8, Y0 - 6, Z0 + 4, X1 - X0 - 16, 6, Z1 - Z0 - 10, 'paper', 'body', 'tint');
  s += K.box(X0, Y0, Z0, X1 - X0, Y1 - Y0, Z1 - Z0, 'paper', 'body', 'tint');
  s += K.on(K.SIDE(X1, Y1, Z1), Array.from({ length: 5 }, (_, i) => `<line class="det" x1="6" y1="${8 + i * 3}" x2="${Y1 - Y0 - 6}" y2="${8 + i * 3}"/>`).join(''));
  const W = 30, H = 26, cls = ['paper', 'tint', 'body', 'tint', 'paper', 'body'];
  s += K.on(K.FRONT(X0, Y1, Z1), `<rect class="f paper" x="3" y="4" width="${W + 4}" height="${H + 4}" rx="3"/>`);
  s += lit(K.on(K.FRONT(X0, Y1, Z1), `<clipPath id="tv-scr"><rect x="5" y="6" width="${W}" height="${H}" rx="2.4"/></clipPath><g clip-path="url(#tv-scr)">` +
    cls.map((c, i) => `<rect class="f ${c}" x="${f(5 + i * W / 6)}" y="6" width="${f(W / 6)}" height="${H * .72}"/>`).join('') + `<rect class="f blk" x="5" y="${6 + H * .72}" width="${W}" height="${H * .28}"/></g>` +
    `<rect class="det" x="5" y="6" width="${W}" height="${H}" rx="2.4"/>`));
  s += K.on(K.FRONT(X0, Y1, Z1), `<circle class="f paper" cx="${W + 11}" cy="10" r="2.6"/><circle class="f paper" cx="${W + 11}" cy="18" r="2.6"/><line class="det" x1="${W + 11}" y1="8" x2="${W + 11}" y2="10"/>` +
    Array.from({ length: 4 }, (_, i) => `<line class="det" x1="${W + 9}" y1="${24 + i * 2}" x2="${W + 13}" y2="${24 + i * 2}"/>`).join(''));
  // Rabbit ears on their base
  s += K.cyl(31, 22, Z1, 4, 2, 'paper', 'body') + rope(K, [[30, 21, Z1 + 2], [18, 14, Z1 + 28]], 1, 'f paper') + rope(K, [[32, 23, Z1 + 2], [48, 22, Z1 + 26]], 1, 'f paper');
  s += dot(K, 18, 14, Z1 + 28, 1.3) + dot(K, 48, 22, Z1 + 26, 1.3);
  return s;
});

// ── Light box: video quality check. A strip of film laid on a light box, frame by frame; one frame ringed with a
// grease pencil. The lit panel is live.
const LX = kernel([[0, 0, 0], [80, 0, 0], [0, 44, 0], [80, 44, 0], [40, 22, 18]], 12);
const lightbox = icon(LX, 'A strip of film laid on a light box, one frame ringed for a closer look; the panel glows.', () => {
  const K = LX, X0 = 6, X1 = 74, Y0 = 8, Y1 = 38, Z = 14;
  let s = plate(K, 0, 0, 80, 44);
  // Cord out of the back, the case, the switch, the glowing panel in its frame
  s += rope(K, [[X1 - 6, Y0, 8], [X1 - 4, Y0 - 5, 4.6], [X1 + 2, Y0 - 6, 4.6]], 1.4, 'f paper');
  s += K.box(X0, Y0, 4, X1 - X0, Y1 - Y0, Z - 4, 'paper', 'body', 'tint') + K.on(K.FRONT(X0, Y1, Z), `<rect class="det" x="4" y="3" width="8" height="3.4" rx=".6"/><rect class="f blk" x="5" y="3.8" width="3" height="1.8" rx=".4"/>`);
  s += lit(K.on(K.TOP(X0, Y0, Z), `<rect class="f body" x="3" y="3" width="${X1 - X0 - 6}" height="${Y1 - Y0 - 6}" rx=".8"/>`));
  // The film strip: sprocket holes along both edges, five frames, one ringed
  const L = 58, Wd = 12;
  let strip = `<rect class="f paper" width="${L}" height="${Wd}"/>`;
  for (let i = 0; i < 14; i++) strip += `<rect class="f blk" x="${1.6 + i * 4.1}" y=".8" width="2" height="1.4" rx=".3"/><rect class="f blk" x="${1.6 + i * 4.1}" y="${Wd - 2.2}" width="2" height="1.4" rx=".3"/>`;
  for (let i = 0; i < 5; i++) strip += `<rect class="f tint" x="${1.4 + i * 11.2}" y="3" width="10" height="${Wd - 6}" rx=".4"/>`;
  strip += `<ellipse class="det" cx="${1.4 + 2 * 11.2 + 5}" cy="${Wd / 2}" rx="7.4" ry="5.4"/>`;
  s += K.on(`${K.TOP(X0 + 5, Y0 + 9, Z + .2)} rotate(-6)`, strip);
  return s;
});

// ── Leaky bucket: waste budget detection. A pail with a hole near its foot; what you pour in drips out into a pool (live).
const LB = kernel([[0, 0, 0], [64, 0, 0], [0, 50, 0], [64, 50, 0], [24, 20, 52]], 12);
const bucket = icon(LB, 'A metal bucket with a small hole near its foot, water dripping out into a puddle.', () => {
  const K = LB, CX = 24, CY = 20, R0 = 10, R1 = 13.4, Z0 = 4, Z1 = 34;
  let s = plate(K, 0, 0, 64, 50);
  // Wall with its rolled bands, the rim and the dark inside, ears and the bail over the top
  const rAt = (z: number) => R0 + (R1 - R0) * (z - Z0) / (Z1 - Z0);
  s += taper(K, CX, CY, Z0, R0, Z1, R1, 'f tint') + half(K, CX, CY, 8, rAt(8)) + half(K, CX, CY, 20, rAt(20)) + half(K, CX, CY, 30, rAt(30));
  s += K.cyl(CX, CY, Z1, R1 + .4, 1.4, 'paper', 'body') + K.on(K.TOP(CX, CY, Z1 + 1.4), `<circle class="f body" r="${R1 - 1}"/>`);
  const ear = (a: number): V3 => [CX + (R1 - .4) * Math.cos(a), CY + (R1 - .4) * Math.sin(a), Z1 - 3];
  const e0 = ear(-Math.PI / 4), e1 = ear(Math.PI * 3 / 4);
  s += rope(K, K.curve(e0, [CX, CY, Z1 + 24], e1, 24), 1.2, 'f paper') + dot(K, ...e0, 1.4) + dot(K, ...e1, 1.4);
  // The hole on the near side and the water: drops falling from it and the puddle on the plate
  const a = Math.PI / 4, hx = CX + rAt(8.6) * Math.cos(a), hy = CY + rAt(8.6) * Math.sin(a), [px, py] = K.P(hx, hy, 8.6);
  s += `<ellipse class="f blk" cx="${f(px)}" cy="${f(py)}" rx="1.1" ry="1.3"/>`;
  s += lit(K.on(K.TOP(hx + 4, hy + 4, 4), `<path class="f body" d="M-6 0C-6-4 2-5 6-3S12 3 6 4S-6 4-6 0Z"/>`) + drop(px + 1.2, py + 2.6, 4.4, 2.4) + drop(px + 2.6, py + 8.6, 4.4, 2.4));
  return s;
});

// ── Electric meter: waste budget detection. A disc meter on its board; nothing in the room is on, yet the disc behind
// the glass keeps turning (live).
const EM = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [8, 12, 70], [52, 16, 70]], 12);
const meter = icon(EM, 'An electricity meter on a board, its spinning disc showing through the window, cables leaving from the terminal block.', () => {
  const K = EM, X0 = 8, X1 = 52, Y = 12, CX = 30, CZ = 44;
  let s = plate(K, 0, 0, 60, 44);
  // The board, the meter base and the round glass cover
  s += K.box(X0, Y, 4, X1 - X0, 4, 62, 'paper', 'body', 'tint') + K.on(K.FRONT(X0, Y + 4, 66), screws([[4, 4], [X1 - X0 - 4, 4], [4, 58], [X1 - X0 - 4, 58]]));
  s += K.box(16, Y + 4, 26, 28, 4, 34, 'paper', 'body', 'tint');
  s += K.cylY(Y + 8, Y + 14, CX, CZ, 12, 'paper', 'tint') + K.cylY(Y + 14, Y + 15, CX, CZ, 11, 'paper', 'paper');
  // Behind the glass: the register of blank wheels, the disc seen edge on with its black mark
  s += K.on(K.FRONT(CX, Y + 15, CZ), `<rect class="f body" x="-7.6" y="-7" width="15.2" height="5" rx=".6"/>` + [0, 1, 2, 3].map((i) => `<rect class="f paper" x="${-7 + i * 3.6}" y="-6.4" width="3" height="3.8" rx=".3"/>`).join('') + `<line class="det" x1="-9" y1="7" x2="9" y2="7"/>`);
  s += lit(K.on(K.FRONT(CX, Y + 15, CZ), `<rect class="f body" x="-8" y="1.4" width="16" height="2.4" rx="1.2"/>`)) + K.on(K.FRONT(CX, Y + 15, CZ), `<rect class="f blk" x="1.6" y="1.4" width="2" height="2.4"/>`);
  // Terminal block with its screws, the cables down to the plate
  s += K.box(18, Y + 4, 14, 24, 6, 10, 'paper', 'body', 'tint') + K.on(K.FRONT(18, Y + 10, 24), screws([[4, 5], [9.3, 5], [14.6, 5], [20, 5]]));
  for (const x of [22, 27.3, 32.6, 38]) s += rope(K, [[x, Y + 8, 14], [x, Y + 10, 8], [x, Y + 18, 4.8], [x, Y + 26, 4.8]], 1.6, 'f paper');
  return s;
});

// ── Cribbage board: campaign group scoreboard. Three tracks of holes, two pegs per player leapfrogging; the peg out in
// front is live.
const CR = kernel([[0, 0, 0], [86, 0, 0], [0, 36, 0], [86, 36, 0], [40, 18, 18]], 12);
const cribbage = icon(CR, 'A cribbage board with three tracks of holes and two pegs in each; one peg is well ahead.', () => {
  const K = CR, X0 = 6, Y0 = 8, L = 74, ZT = 10, PITCH = 3.6, N = 18, TR = [4.6, 10, 15.4];
  let s = plate(K, 0, 0, 86, 36) + K.box(X0, Y0, 4, L, 20, ZT - 4, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X0, Y0 + 20, ZT), `<line class="det" x1="3" y1="3" x2="${L - 3}" y2="3"/>`);
  let top = `<rect class="det" x="2" y="1.8" width="${L - 4}" height="16.4" rx="1"/><line class="det" x1="${8 + N * PITCH}" y1="2.6" x2="${8 + N * PITCH}" y2="17.4"/>`;
  for (const y of TR) for (let i = 0; i < N; i++) top += `<circle class="f blk" cx="${f(6 + i * PITCH + Math.floor(i / 5) * 1.4)}" cy="${y}" r=".55"/>`;
  s += K.on(K.TOP(X0, Y0, ZT), top);
  // Pegs, far track first, each with its head
  const hx = (i: number) => X0 + 6 + i * PITCH + Math.floor(i / 5) * 1.4;
  const peg = (i: number, t: number) => K.cyl(hx(i), Y0 + TR[t], ZT, .9, 5, 'paper', 'body') + K.cyl(hx(i), Y0 + TR[t], ZT + 5, 1.4, 1.4, 'paper', 'tint');
  const pegs: [number, number, boolean][] = [[3, 0, false], [7, 0, false], [9, 1, false], [16, 1, true], [2, 2, false], [5, 2, false]];
  for (const [i, t, live] of pegs) s += live ? lit(K.cyl(hx(i), Y0 + TR[t], ZT, .9, 5, 'body', 'body') + K.cyl(hx(i), Y0 + TR[t], ZT + 5, 1.4, 1.4, 'body', 'body')) : peg(i, t);
  return s;
});

// ── High striker: campaign group scoreboard. The fairground strength tester: a tower with its scale, the mallet
// at its foot; the puck has flown near the top (live).
const HS = kernel([[0, 0, 0], [64, 0, 0], [0, 48, 0], [64, 48, 0], [25, 12, 86], [35, 22, 86]], 12);
const striker = icon(HS, 'A fairground high striker: a tall tower with a scale, a mallet at its foot, the puck up near the top.', () => {
  const K = HS, X = 27, Y = 14, W = 6, ZT = 78, RX = X + W / 2, RY = Y + W + 2;
  let s = plate(K, 0, 0, 64, 48) + K.box(16, 8, 4, 28, 22, 4, 'paper', 'body', 'tint');
  // Tower with its scale, the cap and finial, the guide rod in front
  s += K.box(X, Y, 8, W, W, ZT - 8, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + W, ZT), Array.from({ length: 16 }, (_, i) => `<line class="det" x1="${i % 4 ? 3.6 : 1.6}" y1="${4 + i * 4}" x2="${W - 1}" y2="${4 + i * 4}"/>`).join(''));
  s += K.box(X - 2, Y - 2, ZT, W + 4, W + 4, 3, 'paper', 'body', 'tint') + K.cyl(X + W / 2, Y + W / 2, ZT + 3, 1.6, 3, 'paper', 'tint');
  s += K.box(RX - 1.4, RY - 1.4, ZT - 4, 2.8, 2.8, 2, 'paper', 'body') + K.cyl(RX, RY, 8, .7, ZT - 12, 'paper', 'paper');
  s += lit(K.box(RX - 2.6, RY - 2.6, 62, 5.2, 5.2, 4, 'body', 'body', 'body'));
  // The strike pad on its lever
  s += K.box(20, RY + 2, 8, 20, 8, 3, 'paper', 'body', 'tint') + K.cyl(30, RY + 6, 11, 3.4, 2.4, 'paper', 'body');
  // The mallet lying in front
  s += prism(K, bar(8, 40, -.08, 0, 30, 2.4), 4, 2.4, 'paper', 'tint');
  s += K.cylY(30, 44, 41, 8.4, 4.4, 'paper', 'body') + K.on(K.FRONT(41, 44, 8.4), `<circle class="det" r="2.8"/>`);
  return s;
});

export const ALTS: Record<string, Alt> = {
  'alt-periscope-1': { of: 'i-periscope', idea: 'Бінокль на штативі, обʼєктиви дивляться на тебе: хтось уважно спостерігає здалеку', piece: binoculars },
  'alt-periscope-2': { of: 'i-periscope', idea: 'Ряд відкидних крісел у залі, одне опущене: хтось сидить і мовчки дивиться', piece: seats },
  'alt-clipboard-1': { of: 'i-clipboard', idea: 'Стетоскоп: слухаємо, як почувається акаунт, перш ніж лікувати', piece: stethoscope },
  'alt-clipboard-2': { of: 'i-clipboard', idea: 'Щуп для оливи біля двигуна: рівень між мітками, звичайна регулярна перевірка', piece: dipstick },
  'alt-gauge-1': { of: 'i-gauge', idea: 'Штатив із пробірками: беремо зразки записів CRM, одна проба каламутна', piece: testtubes },
  'alt-gauge-2': { of: 'i-gauge', idea: 'Гребінець із вибитими зубцями: прогалини в даних видно одразу', piece: comb },
  'alt-tagcounter-1': { of: 'i-tagcounter', idea: 'Автомат із талонами черги: хтось уже взяв номер біля каси', piece: ticket },
  'alt-tagcounter-2': { of: 'i-tagcounter', idea: 'Візок із коробкою в кошику: товар обрали, але ще не оплатили', piece: cart },
  'alt-charger-1': { of: 'i-charger', idea: 'Свічка, що догоріла до огарка: креатив вигорає з часом, треба встигнути замінити', piece: candle },
  'alt-charger-2': { of: 'i-charger', idea: 'Олівець, сточений до огризка, поруч новий: креатив стирається від кожного показу', piece: sharpener },
  'alt-reels-1': { of: 'i-reels', idea: 'Старий телевізор з тестовою таблицею: перевіряємо, як показує картинка', piece: testcard },
  'alt-reels-2': { of: 'i-reels', idea: 'Кіноплівка на світловому столі, один кадр обведено: дивимось відео кадр за кадром', piece: lightbox },
  'alt-plug-1': { of: 'i-plug', idea: 'Діряве відро з калюжею під ним: бюджет витікає, поки ти доливаєш', piece: bucket },
  'alt-plug-2': { of: 'i-plug', idea: 'Електролічильник, диск якого крутиться, хоч усе вимкнено: витрата без користі', piece: meter },
  'alt-trophies-1': { of: 'i-trophies', idea: 'Дошка для криббеджу з трьома доріжками: видно, чий кілочок попереду', piece: cribbage },
  'alt-trophies-2': { of: 'i-trophies', idea: 'Ярмарковий силомір: шайба злетіла майже до верху, сила удару на шкалі', piece: striker },
};
