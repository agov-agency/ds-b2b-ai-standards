// Alternative skill icons, batch 1 (turnstile, metronome, siphon, regulator, passcard, stanchions, adapter, keyrack):
// two different objects for each, in the pilot's style (icons.ts): one object on a plate, its telling details, one live part.
import { kernel, f, type V3 } from '../iso';
import { prism, bar, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from '../icons';
import type { Alt } from './index';

// A plane square to the view at o, 1:1 with the screen: draw flames, drops, heads and tags upright in it
const face = (K: K, o: V3) => planeAt(K, o, [.577, -.577, 0], [0, 0, -1]);
const flame = (h: number, w = h * .42) => `M0 0C${f(-w)} 0 ${f(-w)} ${f(-h * .45)} 0 ${f(-h)}C${f(w)} ${f(-h * .45)} ${f(w)} 0 0 0Z`;
// Dome over (x, y, z): the base ellipse below, the sphere's silhouette above (as the bell in icons-skills.ts)
const dome = (K: K, x: number, y: number, z: number, r: number, cls = 'f paper') => {
  const [cx, cy] = K.P(x, y, z), [ex] = K.P(x + r * .7071, y - r * .7071, z), rx = ex - cx, ry = rx * .5774;
  return `<path class="${cls}" d="M${f(cx - rx)} ${f(cy)}A${f(rx)} ${f(rx)} 0 0 1 ${f(cx + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy)}Z"/>`;
};

// ── Toll gate: landing-page CPC report. A toll booth and its barrier arm; each pass costs the coin dropping into the basket (live).
const TG = kernel([[-6, 0, 0], [94, 0, 0], [-6, 42, 0], [94, 42, 0], [12, 18, 56]], 12);
const tollgate = icon(TG, 'A toll booth beside a barrier arm, a coin dropping into the toll basket.', () => {
  const K = TG;
  let s = plate(K, -6, 0, 100, 42);
  // Booth: body with a door and a side window, a roof with an overhang
  s += K.box(0, 4, 4, 24, 24, 40, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(0, 28, 44), `<rect class="det" x="4" y="10" width="10" height="28" rx=".6"/><rect class="f blk" x="11.4" y="24" width="1.4" height="3" rx=".3"/><rect class="f paper" x="16" y="8" width="5" height="10" rx=".4"/>`);
  s += K.on(K.SIDE(24, 28, 44), `<rect class="f tint" x="4" y="6" width="16" height="12" rx=".6"/><line class="det" x1="12" y1="6" x2="12" y2="18"/><rect class="f paper" x="3" y="19" width="18" height="1.6"/>`);
  s += K.box(-2, 2, 44, 28, 28, 3, 'paper', 'body', 'tint') + K.box(2, 6, 47, 20, 20, 2, 'paper', 'tint');
  // Barrier: counterweight behind, the pedestal, the striped arm out to its rest post
  s += K.box(30, 16, 14, 5, 6, 8, 'paper', 'body') + K.box(34, 14, 4, 10, 10, 20, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(34, 24, 24), `<rect class="det" x="2" y="4" width="6" height="8" rx=".5"/>` + screws([[5, 16]]));
  s += K.box(86, 16.5, 4, 4, 5, 12, 'paper', 'body', 'tint') + K.box(85, 16, 16, 6, 6, 1.5, 'paper', 'body');
  s += K.cylX(44, 47, 19, 19.5, 3.6, 'paper', 'body') + K.box(47, 17.5, 17.5, 42, 3, 3, 'paper', 'paper');
  s += K.on(K.FRONT(47, 20.5, 20.5), Array.from({ length: 5 }, (_, i) => `<rect class="f body" x="${4 + i * 8}" y="0" width="4" height="3"/>`).join(''));
  // Toll basket on its post by the window, the coin on its way in
  s += K.cyl(32, 34, 4, 3, 1.5, 'paper', 'body') + K.cyl(32, 34, 5.5, 1.1, 15, 'paper', 'body') + K.cyl(32, 34, 20.5, 5.4, 4, 'tint', 'body') + K.on(K.TOP(32, 34, 24.5), '<circle class="det" r="3.8"/>');
  s += lit(K.on(face(K, [32, 34, 30]), '<ellipse class="f body" rx="1.8" ry="3.4"/><line class="det" x1="0" y1="-2" x2="0" y2="2"/>'));
  return s;
});

// ── Coin button: landing-page CPC report. A coin-op cabinet: the coin slot on its face pays for each press of the big
// button on top (live).
const CBX = kernel([[0, 0, 0], [66, 0, 0], [0, 46, 0], [66, 46, 0], [33, 22, 50]], 12);
const coinbutton = icon(CBX, 'A coin-operated cabinet with a big push button on top and a coin slot on its face.', () => {
  const K = CBX, X = 12, Y = 8, W = 42, D = 30, H = 28;
  let s = plate(K, 0, 0, 66, 46) + K.box(X - 2, Y - 2, 4, W + 4, D + 4, 3, 'paper', 'body', 'tint') + K.box(X, Y, 7, W, D, H, 'paper', 'body', 'tint');
  // Face: coin plate with the slot and the reject button, the coin return cup below
  s += K.on(K.FRONT(X, Y + D, 7 + H), `<rect class="f paper" x="5" y="4" width="13" height="16" rx=".8"/><rect class="f blk" x="10.8" y="7" width="1.4" height="7" rx=".3"/><circle class="f paper" cx="11.5" cy="17" r="1.4"/>` +
    screws([[7, 6], [16, 6]]) + `<rect class="f blk" x="24" y="14" width="12" height="7" rx="1"/><rect class="det" x="23" y="13" width="14" height="9" rx="1.4"/>`);
  s += K.on(K.SIDE(X + W, Y + D, 7 + H), Array.from({ length: 5 }, (_, i) => `<line class="det" x1="8" y1="${8 + i * 3}" x2="22" y2="${8 + i * 3}"/>`).join(''));
  // Button: bezel ring, the mushroom cap
  const CX = X + W / 2, CY = Y + D / 2, Z = 7 + H;
  s += K.cyl(CX, CY, Z, 11, 2, 'paper', 'body') + K.cyl(CX, CY, Z + 2, 8.6, 1.4, 'paper', 'tint');
  s += lit(K.cyl(CX, CY, Z + 3.4, 2.8, 2.6, 'body', 'body') + K.cyl(CX, CY, Z + 6, 8, 2.6, 'body', 'body') + dome(K, CX, CY, Z + 8.6, 8, 'f body'));
  return s;
});

// ── Candle clock: pacing check against schedule. A banded candle in its dish, a pin pushed in at the band it should have
// burned to by now; the flame is live.
const CC = kernel([[0, 0, 0], [50, 0, 0], [0, 50, 0], [50, 50, 0], [25, 25, 76]], 12);
const candleclock = icon(CC, 'A candle marked in hour bands, standing in a dish, with a pin pushed in at one band; the flame burns above it.', () => {
  const K = CC, X = 25, Y = 25, Z0 = 12, TOPZ = 56, R = 4.6;
  let s = plate(K, 0, 0, 50, 50);
  // Dish with a finger loop, the socket
  s += K.cylX(39, 46, Y, 6.5, 2.4, 'paper', 'body') + K.cyl(X, Y, 4, 16, 3, 'paper', 'body') + K.on(K.TOP(X, Y, 7), '<circle class="det" r="13.6"/>');
  s += K.cyl(X, Y, 7, 6.4, 5, 'paper', 'body') + K.cyl(X, Y, Z0 - 1, 7, 1, 'paper', 'tint');
  // The candle, its hour bands (every third one long), a drip down the front
  s += K.cyl(X, Y, Z0, R, TOPZ - Z0, 'paper', 'paper');
  for (let z = Z0 + 5; z < TOPZ - 1; z += 5) s += K.line(K.ring(X, Y, z, R, -Math.PI / 4, Math.PI * 3 / 4, 20), 'det');
  s += K.on(K.FRONT(X - 2, Y + R, TOPZ), '<path class="f tint" d="M0 .3C0 4 1.6 5 1.6 8.6C1.6 10 -.2 10 -.2 8.6L-.4 .3Z"/>');
  // The pin, the wick, then the flame
  s += K.cylX(X + R - .6, X + R + 5, Y, TOPZ - 10, .6, 'paper', 'body') + K.cylX(X + R + 5, X + R + 5.8, Y, TOPZ - 10, 1.5, 'paper', 'body');
  s += K.on(K.TOP(X, Y, TOPZ), '<circle class="det" r="2"/>') + K.line([[X, Y, TOPZ], [X, Y, TOPZ + 3]], 'f');
  s += lit(K.on(face(K, [X, Y, TOPZ + 2]), `<path class="f body" d="${flame(13)}"/><path class="f paper" d="${flame(6)}"/>`));
  return s;
});

// ── Drip oiler: pacing check against schedule. A sight-feed oiler on a bearing block: the reservoir above, the needle
// valve set to a rate, a drop falling in the sight glass (live).
const DO = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [30, 22, 84]], 12);
const dripoiler = icon(DO, 'A sight-feed drip oiler on a bearing block: a glass reservoir, a needle valve and a drop falling in the sight glass.', () => {
  const K = DO, X = 30, Y = 22;
  let s = plate(K, 0, 0, 60, 44);
  // Bearing block with its cap, the shaft through it, the oil pipe up
  s += K.cylX(2, 10, Y, 13, 4.4, 'paper', 'tint') + K.box(10, Y - 11, 4, 40, 22, 12, 'paper', 'body', 'tint') + K.box(12, Y - 9, 16, 36, 18, 3, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(10, Y + 11, 16), screws([[4, 3], [36, 3], [4, 9], [36, 9]])) + K.cylX(50, 58, Y, 13, 4.4, 'paper', 'tint');
  s += K.cyl(X, Y, 19, 4.4, 2, 'paper', 'body') + K.cyl(X, Y, 21, 1.8, 5, 'paper', 'body');
  // Sight glass between two flanges; the drop inside
  s += K.cyl(X, Y, 26, 5, 2, 'paper', 'body') + K.cyl(X, Y, 28, 3.8, 11, 'paper', 'paper');
  s += K.on(K.FRONT(X - 2, Y + 3.8, 39), '<line class="det" x1="0" y1="1" x2="0" y2="10"/>');
  s += lit(K.on(face(K, [X, Y, 31]), `<path class="f body" d="${flame(4)}" transform="scale(1 -1) translate(0 -2)"/>`)) + K.on(face(K, [X, Y, 37.5]), '<path class="f blk" d="M-1.2 -1.5L1.2 -1.5L0 1Z"/>');
  // Needle valve block with its rate knob out the side
  s += K.cyl(X, Y, 39, 6, 5, 'paper', 'body') + K.cylX(X + 4, X + 10, Y, 41.5, 1, 'paper', 'body') + K.cylX(X + 10, X + 12, Y, 41.5, 2.6, 'paper', 'tint');
  // Glass reservoir: the oil up to its level, clear above, a cap with the filler knob
  s += K.cyl(X, Y, 44, 9, 2, 'paper', 'body') + K.cyl(X, Y, 46, 8, 14, 'tint', 'tint') + K.cyl(X, Y, 60, 8, 10, 'paper', 'paper');
  s += K.cyl(X, Y, 70, 9.4, 2.4, 'paper', 'body') + K.cyl(X, Y, 72.4, 3.6, 4, 'paper', 'body') + K.cyl(X, Y, 76.4, 2, 1.4, 'paper', 'tint');
  s += [0, 1, 2, 3].map((q) => { const a = q * Math.PI / 2 + Math.PI / 4; return dot(K, X + Math.cos(a) * 7.6, Y + Math.sin(a) * 7.6, 72.4, .7); }).join('');
  return s;
});

// ── Points: budget re-allocation. A railway switch with its throw lever; the switch blades (live) send the line from the
// straight track to the branch.
const PT = kernel([[-4, 0, 0], [92, 0, 0], [-4, 50, 0], [92, 50, 0], [20, 46, 26]], 12);
const points = icon(PT, 'A railway switch: two tracks part at the points, the blades set to the branch, a throw lever beside them.', () => {
  const K = PT, Y1 = 28, Y2 = 36, A = -.3, X0 = 40;
  let s = plate(K, -4, 0, 96, 50);
  const off = (x: number) => Math.max(0, x - X0) * Math.tan(-A);
  // Sleepers, widening under the branch
  for (let x = 2; x < 88; x += 6) s += K.box(x, Y1 - 4 - off(x + 2), 4, 3, Y2 - Y1 + 8 + off(x + 2), 1.6, 'paper', 'body', 'tint');
  const rail = (pl: P2[]) => prism(K, pl, 5.6, 3.2, 'paper', 'body');
  // Stock rails straight through, the branch rails off at angle A, the frog where they cross
  s += rail(bar(0, Y1, 0, 0, 90, 1.4)) + rail(bar(X0 + 18, Y1 - off(X0 + 18) + 1.2, A, 0, 34, 1.4)) + rail(bar(X0 + 2, Y1 - .6, A, 0, 50, 1.4));
  s += rail(bar(0, Y2, 0, 0, 90, 1.4));
  // The blades: tapered rails swung across to the branch
  s += lit(rail(bar(X0 - 16, Y1 + 1.4, -.05, 0, 18, 1.2)) + rail(bar(X0 - 16, Y2 - 1.4, -.12, 0, 22, 1.2)));
  s += K.box(X0 - 18, Y1 - 1, 5.6, 2, Y2 - Y1 + 2, 1, 'paper', 'tint');
  // Ground throw: a base on its timber, the lever up with its weight
  const LX = 22, LY = 44;
  s += K.box(LX - 8, LY - 2, 4, 16, 5, 2, 'paper', 'body', 'tint') + K.box(LX - 4, LY - 1.5, 6, 8, 4, 4, 'paper', 'body', 'tint') + K.cylY(LY - 1, LY + 3, LX, 9, 1.6, 'paper', 'body');
  s += K.poly([[LX - .8, LY + 1, 9], [LX + .8, LY + 1, 9], [LX - 7.2, LY + 1, 25], [LX - 8.8, LY + 1, 25]], 'f body') + K.on(face(K, [LX - 8, LY + 1, 25]), '<circle class="f paper" r="3.4"/><circle class="det" r="1.4"/>');
  return s;
});

// ── Coin stacks: budget re-allocation. Three stacks of coins in a tray; a coin (live) is lifted off the tall one onto the
// short one.
const CS = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [24, 20, 54]], 12);
const coinstacks = icon(CS, 'Three stacks of coins in a tray, a coin moving from the tall stack to the short one.', () => {
  const K = CS, Y = 20, R = 7;
  let s = plate(K, 0, 0, 76, 40) + K.box(6, 8, 4, 64, 24, 2, 'paper', 'body', 'tint') + K.on(K.TOP(6, 8, 6), '<rect class="det" x="2" y="2" width="60" height="20"/>');
  const coin = (x: number, z: number, top = 'paper', side = 'body') => K.cyl(x, Y, z, R, 2.2, top, side) + K.on(K.TOP(x, Y, z + 2.2), `<circle class="det" r="${R - 1.4}"/>`);
  const stack = (x: number, n: number) => Array.from({ length: n }, (_, i) => coin(x, 6 + i * 2.2, 'paper', i % 2 ? 'tint' : 'body')).join('');
  s += stack(20, 12) + stack(38, 6) + stack(56, 2);
  // The path it takes and the coin, tipped as it goes over
  s += K.line(K.curve([22, Y, 34], [40, Y, 50], [56, Y, 22], 20), 'dash');
  s += lit(K.on(planeAt(K, [50, Y, 36], [.9, 0, -.44], [0, 1, 0]), `<circle class="f body" r="${R}"/><circle class="det" r="${R - 1.4}"/>`));
  return s;
});

// ── Gas burner: lowest bid that still spends the budget. A burner with its knob turned down to the last mark before
// it goes out; the low ring of flame is live.
const GB = kernel([[0, 0, 0], [62, 0, 0], [0, 50, 0], [62, 50, 0], [31, 24, 34]], 12);
const burner = icon(GB, 'A gas burner turned down low: a small ring of flame, its knob at the lowest mark.', () => {
  const K = GB, X = 31, Y = 22, Z = 18, X0 = 7, Y0 = 4, W = 48, D = 40;
  let s = plate(K, 0, 0, 62, 50) + K.box(X0, Y0, 4, W, D, 14, 'paper', 'body', 'tint');
  s += K.on(K.TOP(X0, Y0, Z), `<rect class="det" x="3" y="3" width="${W - 6}" height="${D - 12}" rx="1"/><circle class="f tint" cx="${X - X0}" cy="${Y - Y0}" r="13"/>`);
  // Knob on the front: the scale from full to low, the pointer on the last mark
  const KX = 24, KY = 6.6, a = (i: number) => Math.PI * (1.1 + i * .16);
  s += K.on(K.FRONT(X0, Y0 + D, Z), Array.from({ length: 6 }, (_, i) => { const r0 = 5.6, r1 = 5.6 + (5 - i) * .5 + .8; return `<line class="det" x1="${f(KX + Math.cos(a(i)) * r0)}" y1="${f(KY + Math.sin(a(i)) * r0)}" x2="${f(KX + Math.cos(a(i)) * r1)}" y2="${f(KY + Math.sin(a(i)) * r1)}"/>`; }).join('') + `<rect class="det" x="34" y="4" width="10" height="5" rx=".6"/>`);
  s += K.cylY(Y0 + D, Y0 + D + 3, X0 + KX, Z - KY, 4, 'paper', 'body') + K.on(K.FRONT(X0 + KX, Y0 + D + 3, Z - KY), `<rect class="f paper" x="-1" y="-3.6" width="2" height="7.2" rx=".4" transform="rotate(${f(a(5) * 180 / Math.PI + 90)})"/>`);
  // Burner: base, cap; small flames round the head, the far ones behind the cap
  const fl = (q: number) => { const b = q * Math.PI / 4 + Math.PI / 8; return K.on(face(K, [X + Math.cos(b) * 6.4, Y + Math.sin(b) * 6.4, Z + 3.4]), `<path class="f body" d="${flame(3.4)}"/>`); };
  const back = [0, 1, 2, 3, 4, 5, 6, 7].filter((q) => Math.cos(q * Math.PI / 4 + Math.PI / 8) + Math.sin(q * Math.PI / 4 + Math.PI / 8) < 0);
  const front = [0, 1, 2, 3, 4, 5, 6, 7].filter((q) => !back.includes(q));
  s += K.cyl(X, Y, Z, 8, 2, 'paper', 'body') + lit(back.map(fl).join('')) + K.cyl(X, Y, Z + 2, 6.4, 1.6, 'paper', 'body') + K.cyl(X, Y, Z + 3.6, 4.6, 1, 'paper', 'tint');
  s += lit(front.map(fl).join(''));
  // Pan supports: four fingers on the outer ring
  s += [0, 1, 2, 3].map((q) => prism(K, bar(X, Y, q * Math.PI / 2 + Math.PI / 4, 9.4, 14, 1.8), Z, 4.4, 'paper', 'body')).join('');
  return s;
});

// ── Sluice gate: lowest bid that still spends the budget. A gate across a channel, wound down until only a thin sheet of
// water still runs out under it (live).
const SG = kernel([[0, 0, 0], [88, 0, 0], [0, 42, 0], [88, 42, 0], [42, 20, 64]], 12);
const sluice = icon(SG, 'A sluice gate across a channel, lowered so only a thin sheet of water runs under it; a handwheel on top.', () => {
  const K = SG, GX = 40;
  let s = plate(K, 0, 0, 88, 42);
  // Far bank, the high water upstream of the gate
  s += K.box(2, 3, 4, 84, 6, 9, 'paper', 'body', 'tint');
  s += K.poly([[2, 9, 12], [GX, 9, 12], [GX, 31, 12], [2, 31, 12]], 'f tint') + K.on(K.TOP(2, 9, 12), [8, 18, 28].map((x) => `<path class="det" d="M${x} 7q2 -1.2 4 0t4 0"/>`).join(''));
  // Gate frame: far post, the gate leaf (its bottom just off the bed), the outflow, near post, near bank, top beam
  s += K.box(GX - 2, 3, 13, 6, 6, 34, 'paper', 'body', 'tint');
  s += K.box(GX, 9, 8.6, 3, 22, 29.4, 'paper', 'body', 'tint') + K.on(K.SIDE(GX + 3, 31, 38), `<line class="det" x1="0" y1="10" x2="22" y2="10"/><line class="det" x1="0" y1="20" x2="22" y2="20"/>` + screws([[3, 3], [19, 3]]));
  s += lit(K.poly([[GX + 3, 9, 5.4], [86, 9, 5.4], [86, 31, 5.4], [GX + 3, 31, 5.4]], 'f body') + K.on(K.TOP(GX + 3, 9, 5.4), [10, 24, 36].map((x) => `<path class="det" d="M${x} 11h6M${x + 4} 16h6"/>`).join('')));
  s += K.box(2, 31, 4, 84, 6, 9, 'paper', 'body', 'tint') + K.box(GX - 2, 31, 13, 6, 6, 34, 'paper', 'body', 'tint') + K.box(GX - 3, 2, 47, 8, 36, 4, 'paper', 'body', 'tint');
  // Screw stem and the handwheel
  s += K.cyl(GX + 1, 20, 51, 2.6, 2, 'paper', 'body') + K.cyl(GX + 1, 20, 53, 1, 6, 'paper', 'body');
  s += K.cyl(GX + 1, 20, 58, 8, 1.4, 'paper', 'body') + K.on(K.TOP(GX + 1, 20, 59.4), `<circle class="det" r="6.4"/>${[0, 1, 2, 3, 4].map((q) => `<line class="det" x1="0" y1="0" x2="${f(Math.cos(q * 1.257) * 6.4)}" y2="${f(Math.sin(q * 1.257) * 6.4)}"/>`).join('')}<circle class="f paper" r="1.6"/>`);
  return s;
});

// ── Ticket roll: cost per retargetable member. An admission-ticket roll on its stand, the strip pulled out across the
// base; the end ticket (live) is the one each member costs, a coin beside it.
const TK = kernel([[0, 0, 0], [80, 0, 0], [0, 42, 0], [80, 42, 0], [20, 20, 40]], 12);
const ticketroll = icon(TK, 'A roll of admission tickets on a stand, the strip pulled out with the end ticket ready to tear, a coin beside it.', () => {
  const K = TK, Y0 = 12, Y1 = 28, RX = 20, RZ = 22, R = 12;
  let s = plate(K, 0, 0, 80, 42) + K.box(6, Y0 - 2, 4, 64, Y1 - Y0 + 4, 4, 'paper', 'body', 'tint');
  // The strip along the base: tickets with perforations between, a stub box on each; the end one live
  const tk = (i: number) => `<rect class="f paper" x="${f(i * 11)}" y="0" width="11" height="${Y1 - Y0}"/><rect class="det" x="${f(i * 11 + 3)}" y="4" width="5" height="${Y1 - Y0 - 8}" rx=".5"/>`;
  s += K.on(K.TOP(24, Y0, 8), [0, 1, 2].map(tk).join('') + [1, 2, 3].map((i) => `<line class="det dashed" x1="${i * 11}" y1="0" x2="${i * 11}" y2="${Y1 - Y0}"/>`).join(''));
  s += lit(K.on(K.TOP(57, Y0, 8), `<rect class="f body" x="0" y="0" width="11" height="${Y1 - Y0}"/><circle class="det" cx="5.5" cy="${(Y1 - Y0) / 2}" r="2.4"/>`));
  // Back cheek, the roll with its wound edge, the axle cap
  s += K.box(RX - 7, Y0 - 3, 8, 14, 3, 22, 'paper', 'body', 'tint');
  s += K.cylY(Y0, Y1, RX, RZ, R, 'paper', 'paper') + K.on(K.FRONT(RX, Y1, RZ), [3.6, 6.6, 9.6].map((r) => `<circle class="det" r="${r}"/>`).join(''));
  s += K.cylY(Y1, Y1 + 2.4, RX, RZ, 2.6, 'paper', 'body');
  // Coin lying in front
  s += K.cyl(48, 38, 4, 5.4, 1.8, 'paper', 'body') + K.on(K.TOP(48, 38, 5.8), '<circle class="det" r="4"/>');
  return s;
});

// ── Pawns: cost per retargetable member. A row of pawns on a board, one with a price tag tied round its neck (live).
const PW = kernel([[0, 0, 0], [80, 0, 0], [0, 38, 0], [80, 38, 0], [40, 18, 32]], 12);
const pawns = icon(PW, 'A row of four pawns on a board, a price tag tied to one of them.', () => {
  const K = PW, Y = 17, Z = 6;
  let s = plate(K, 0, 0, 80, 38) + K.box(4, 8, 4, 72, 18, 2, 'paper', 'body', 'tint');
  const pawn = (x: number) => K.cyl(x, Y, Z, 5.4, 2.2, 'paper', 'body') + K.cyl(x, Y, Z + 2.2, 4.2, 1.4, 'paper', 'tint') + K.cyl(x, Y, Z + 3.6, 2.4, 10, 'paper', 'body') +
    K.cyl(x, Y, Z + 13, 3.8, 1.4, 'paper', 'tint') + K.on(face(K, [x, Y, Z + 18.4]), '<circle class="f paper" r="4"/><path class="det" d="M-2.4 -1.6A2.8 2.8 0 0 1 -.6 -2.8"/>');
  [14, 30, 46, 62].forEach((x, i) => {
    s += pawn(x);
    // The tag hangs from a loop round the third pawn's neck, down to its front-left
    if (i === 2) s += lit(rope(K, [[x - 2, Y + 2, Z + 14.4], [x - 4, Y + 6, Z + 10], [x - 5, Y + 9, Z + 6.4]], .8, 'f body') +
      K.on(planeAt(K, [x - 5, Y + 9, Z + 6.4], [.8, -.2, 0], [.1, .3, -.9]), '<path class="f body" d="M-3 0L3 0L5 2.4L5 10L-5 10L-5 2.4Z"/><circle class="f paper" cx="0" cy="2.6" r="1"/><line class="det" x1="-3" y1="6" x2="3" y2="6"/>'));
  });
  return s;
});

// ── Relief valve: retargeting guardrails. A pressure pot clamped shut, a weighted relief valve (live) on its lid that
// lets off before it goes too far.
const RV = kernel([[0, 0, 0], [62, 0, 0], [0, 54, 0], [62, 54, 0], [31, 27, 62]], 12);
const relief = icon(RV, 'A clamped pressure pot with a weighted relief valve on its lid.', () => {
  const K = RV, X = 31, Y = 27, R = 17, H = 24;
  let s = plate(K, 0, 0, 62, 54);
  // Handles either side, the pot with its bands, the lid and its clamps
  s += K.box(X - R - 7, Y - 3, 20, 8, 6, 3, 'paper', 'body');
  s += K.cyl(X, Y, 4, R, H, 'paper', 'body') + [9, H - 4].map((dz) => K.line(K.ring(X, Y, 4 + dz, R, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det')).join('');
  s += K.box(X + R - 1, Y - 3, 20, 8, 6, 3, 'paper', 'body');
  s += K.cyl(X, Y, 4 + H, R + 1.6, 2, 'paper', 'tint') + K.cyl(X, Y, 6 + H, R - 2, 2.4, 'paper', 'paper') + K.on(K.TOP(X, Y, 8.4 + H), '<circle class="det" r="10"/>');
  s += [0, 1, 2, 3].map((q) => { const a = q * Math.PI / 2 + Math.PI / 4; return prism(K, bar(X, Y, a, R - 3, R + 2.6, 4), 2 + H, 5, 'paper', 'body'); }).join('');
  // The valve: nozzle, the weight on it, its cap
  s += K.cyl(X, Y, 8.4 + H, 3.4, 2, 'paper', 'body') + K.cyl(X, Y, 10.4 + H, 1.4, 4, 'paper', 'body');
  s += lit(K.cyl(X, Y, 14.4 + H, 5, 4.6, 'body', 'body') + K.cyl(X, Y, 19 + H, 2.4, 2, 'body', 'body'));
  return s;
});

// ── Fuse: retargeting guardrails. A cartridge fuse in its spring clips on a ceramic base; the wire inside (live) is
// what gives way before anything else does.
const FU = kernel([[0, 0, 0], [78, 0, 0], [0, 40, 0], [78, 40, 0], [39, 20, 34]], 12);
const fuse = icon(FU, 'A glass cartridge fuse held in spring clips on a ceramic base, its wire visible inside.', () => {
  const K = FU, Y = 20, Z = 21, X0 = 12, X1 = 66;
  let s = plate(K, 0, 0, 78, 40) + K.box(6, 8, 4, 66, 24, 6, 'paper', 'body', 'tint');
  s += K.on(K.TOP(6, 8, 10), screws([[4, 12], [62, 12]]) + `<rect class="det" x="11" y="3" width="44" height="18" rx="1"/>`);
  const clip = (x: number, y: number) => K.box(x - 2.5, y, 10, 5, 1.2, 12, 'paper', 'body', 'tint');
  s += clip(18, Y - 5.6) + clip(60, Y - 5.6) + K.box(15, Y - 4, 10, 6, 8, 1.6, 'paper', 'body') + K.box(57, Y - 4, 10, 6, 8, 1.6, 'paper', 'body');
  // Cartridge: caps, the glass, the wire through it
  s += K.cylX(X0, X0 + 9, Y, Z, 5, 'paper', 'body') + K.cylX(X0 + 9, X1 - 9, Y, Z, 4.2, 'paper', 'paper');
  s += lit(K.line([[X0 + 9, Y, Z], ...Array.from({ length: 9 }, (_, i) => [X0 + 12 + i * 3.6, Y + (i % 2 ? 1.4 : -1.4), Z + (i % 2 ? -.6 : .6)] as V3), [X1 - 9, Y, Z]], 'hl'));
  s += K.cylX(X1 - 9, X1, Y, Z, 5, 'paper', 'body') + clip(18, Y + 4.4) + clip(60, Y + 4.4);
  return s;
});

// ── Zipper: matched audience lists. A zip half done up: teeth from both tapes lock one by one behind the slider (live).
const ZP = kernel([[0, 0, 0], [84, 0, 0], [0, 44, 0], [84, 44, 0], [40, 22, 12]], 12);
const zipper = icon(ZP, 'A zip half closed: the teeth of both tapes interlock behind the slider and part in front of it.', () => {
  const K = ZP, Y = 22, SX = 40;
  let s = plate(K, 0, 0, 84, 44);
  // Closed run: two tapes meeting, teeth alternating across the seam
  let g = `<rect class="f tint" x="4" y="${Y - 12}" width="${SX - 2}" height="10"/><rect class="f tint" x="4" y="${Y + 2}" width="${SX - 2}" height="10"/>`;
  for (let x = 5; x < SX + 1; x += 3) g += `<rect class="f paper" x="${x}" y="${Y - 3}" width="1.8" height="4.4" rx=".3"/><rect class="f paper" x="${x + 1.5}" y="${Y - 1.4}" width="1.8" height="4.4" rx=".3"/>`;
  // Open run: the tapes part, each with its own row of teeth
  const arm = (sgn: number) => {
    let a = `<rect class="f tint" x="0" y="${sgn > 0 ? 2 : -12}" width="40" height="10"/>`;
    for (let x = 1; x < 39; x += 3) a += `<rect class="f paper" x="${x}" y="${sgn > 0 ? .2 : -3.4}" width="1.8" height="3.2" rx=".3"/>`;
    return `<g transform="translate(${SX + 2} ${Y}) rotate(${sgn * 17})">${a}</g>`;
  };
  g += arm(-1) + arm(1) + `<rect class="f body" x="2" y="${Y - 2}" width="3" height="4" rx=".4"/>`;
  s += K.on(K.TOP(0, 0, 4), g);
  // Slider with its pull tab
  s += lit(prism(K, [[SX - 4, Y - 6], [SX + 5, Y - 4], [SX + 5, Y + 4], [SX - 4, Y + 6]], 4, 3.2, 'paper', 'body') + K.box(SX - 1, Y - 1.5, 7.2, 4, 3, 1.4, 'paper', 'body') +
    prism(K, [[SX - 14, Y - 2.6], [SX + 2, Y - 2], [SX + 2, Y + 2], [SX - 14, Y + 2.6]], 7.4, 1, 'body', 'body') + K.on(K.TOP(SX - 11, Y, 8.4), '<rect class="det" x="0" y="-1" width="6" height="2" rx="1"/>'));
  return s;
});

// ── Shape sorter: matched audience lists. A box with shaped holes in its lid; a triangular block (live) goes in only
// through its own hole, a cube waits beside it.
const SS = kernel([[0, 0, 0], [62, 0, 0], [0, 52, 0], [62, 52, 0], [30, 24, 56]], 12);
const sorter = icon(SS, 'A shape-sorter box with round, square and triangular holes, a triangular block right over its hole.', () => {
  const K = SS, X = 10, Y = 8, W = 42, D = 32, H = 24, Z = 4 + H;
  let s = plate(K, 0, 0, 62, 52) + K.box(X, Y, 4, W, D, H, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + D, Z), `<rect class="det" x="3" y="3" width="${W - 6}" height="${H - 6}" rx="1"/>`) + K.on(K.SIDE(X + W, Y + D, Z), `<rect class="det" x="3" y="3" width="${D - 6}" height="${H - 6}" rx="1"/>`);
  const tri: P2[] = [[X + 30, Y + 10], [X + 36, Y + 22], [X + 24, Y + 22]];
  s += K.on(K.TOP(X, Y, Z), `<circle class="f blk" cx="10" cy="10" r="4.6"/><rect class="f blk" x="5.6" y="18" width="8.8" height="8.8" rx=".4"/>`) +
    K.poly(tri.map(([x, y]) => [x, y, Z] as V3), 'f blk');
  // The triangular block, hovering right over its hole
  s += lit(prism(K, tri, Z + 6, 7, 'body', 'body'));
  // A cube beside the box
  s += K.box(18, 42, 4, 8, 8, 8, 'paper', 'body', 'tint') + K.on(K.TOP(18, 42, 12), '<circle class="det" cx="4" cy="4" r="1.6"/>');
  return s;
});

// ── Bobber: the no-deal warm leads finder. A rod in its holder over a tub of water; the float (live) is bobbing — a
// bite, but nothing landed yet.
const BB = kernel([[0, 0, 0], [70, 0, 0], [0, 52, 0], [70, 52, 0], [6, 8, 52], [46, 30, 66]], 12);
const bobber = icon(BB, 'A fishing rod in a holder over a tub of water; the float on its line is dipping in the ripples.', () => {
  const K = BB, TX = 44, TY = 30, BX = 48, BY = 31, WZ = 15;
  let s = plate(K, 0, 0, 70, 52);
  // Rod holder: a base, the post, a fork at the top
  s += K.box(6, 8, 4, 10, 10, 2.4, 'paper', 'body', 'tint') + K.cyl(11, 13, 6.4, 1.6, 22, 'paper', 'body') + K.box(9, 11, 28.4, 4, 4, 2, 'paper', 'body');
  // Tub with its rim, the water, ripples round the float
  s += K.cyl(TX, TY, 4, 17, WZ - 4, 'paper', 'body') + K.line(K.ring(TX, TY, 8, 17, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det');
  s += K.on(K.TOP(TX, TY, WZ), `<circle class="f tint" r="15.4"/><circle class="det" cx="${BX - TX}" cy="${BY - TY}" r="4.4"/><circle class="det dashed" cx="${BX - TX}" cy="${BY - TY}" r="8"/>`);
  // Line from the rod tip down to the float; the float, half under, tipped by the bite
  s += K.line([[TX + 2, TY - 2, 64], [BX, BY, WZ + 8]], 'det');
  s += lit(K.on(face(K, [BX, BY, WZ]), `<g transform="rotate(14) scale(1.6)"><path class="f body" d="M-3.6 0A3.6 3.6 0 0 1 3.6 0Z"/><path class="f paper" d="M-1.4 -3.2L1.4 -3.2L.6 -7.6L-.6 -7.6Z"/><path class="det" d="M-3.6 0H3.6"/></g>`));
  // The rod: butt behind the holder, through the fork, out over the tub; a reel near the butt
  s += rope(K, [[2, 4, 18], [11, 13, 30], [TX + 2, TY - 2, 64]], 2.4, 'f body') + K.cyl(6, 8, 21, 3, 2.4, 'paper', 'tint');
  return s;
});

// ── Incubator: the no-deal warm leads finder. A tray of eggs kept warm under a heat lamp (live): warm, not hatched.
const IN = kernel([[0, 0, 0], [68, 0, 0], [0, 46, 0], [68, 46, 0], [30, 22, 62]], 12);
const incubator = icon(IN, 'A tray of eggs in their cups under a heat lamp on an arm.', () => {
  const K = IN, X0 = 6, Y0 = 8, Z = 12;
  let s = plate(K, 0, 0, 68, 46);
  // Lamp post at the back right, the tray with egg cups
  s += K.cyl(58, 10, 4, 3.6, 2, 'paper', 'body') + K.cyl(58, 10, 6, 1.6, 50, 'paper', 'body');
  s += K.box(X0, Y0 + 4, 4, 48, 30, 8, 'paper', 'body', 'tint') + K.on(K.FRONT(X0, Y0 + 34, Z), '<rect class="det" x="18" y="2.4" width="12" height="3.4" rx=".5"/>');
  const cells: P2[] = [[16, 19], [30, 19], [44, 19], [16, 32], [30, 32], [44, 32]];
  s += K.on(K.TOP(0, 0, Z), cells.map(([x, y]) => `<circle class="f tint" cx="${x}" cy="${y}" r="5"/>`).join(''));
  s += cells.map(([x, y]) => K.on(face(K, [x, y, Z + 5.4]), '<ellipse class="f paper" rx="4" ry="5.4"/><path class="det" d="M-2.4 -2.6A3 3.6 0 0 1 -.6 -4.4"/>')).join('');
  // Arm out over the tray, the hood hanging from it (live)
  s += K.cylX(30, 58, 10, 56, 1.2, 'paper', 'body') + K.cyl(30, 10, 46, 1, 10, 'paper', 'body');
  s += lit(K.cyl(30, 10, 38, 9, 3, 'body', 'body') + dome(K, 30, 10, 41, 9, 'f body') + K.cyl(30, 10, 44, 2.4, 2, 'body', 'body'));
  return s;
});

export const ALTS: Record<string, Alt> = {
  'alt-turnstile-1': { of: 'i-turnstile', idea: 'Пункт оплати проїзду зі шлагбаумом: кожен проїзд коштує монету в кошику', piece: tollgate },
  'alt-turnstile-2': { of: 'i-turnstile', idea: 'Автомат із великою кнопкою і монетоприймачем: кожне натискання — платне', piece: coinbutton },
  'alt-metronome-1': { of: 'i-metronome', idea: 'Свічковий годинник зі шпилькою на позначці: чи згоріло стільки, скільки мало до цієї години', piece: candleclock },
  'alt-metronome-2': { of: 'i-metronome', idea: 'Крапельна маслянка з голчастим вентилем: подача йде з заданим темпом, крапля за краплею', piece: dripoiler },
  'alt-siphon-1': { of: 'i-siphon', idea: 'Залізнична стрілка з важелем: потік переводять з одного шляху на інший', piece: points },
  'alt-siphon-2': { of: 'i-siphon', idea: 'Стоси монет у лотку: монету знімають з високого й кладуть на низький', piece: coinstacks },
  'alt-regulator-1': { of: 'i-regulator', idea: 'Газовий пальник на найменшій позначці, де полум’я ще горить', piece: burner },
  'alt-regulator-2': { of: 'i-regulator', idea: 'Шлюзова засувка, опущена так, що під нею ще біжить тонкий струмінь', piece: sluice },
  'alt-passcard-1': { of: 'i-passcard', idea: 'Рулон вхідних квитків і монета: ціна одного допущеного учасника', piece: ticketroll },
  'alt-passcard-2': { of: 'i-passcard', idea: 'Ряд пішаків, на одному — цінник: скільки коштує кожен учасник аудиторії', piece: pawns },
  'alt-stanchions-1': { of: 'i-stanchions', idea: 'Скороварка з вантажним клапаном: тиск стравлюється раніше, ніж стане забагато', piece: relief },
  'alt-stanchions-2': { of: 'i-stanchions', idea: 'Запобіжник у пружинних клемах: тонкий дріт здається першим і береже решту', piece: fuse },
  'alt-adapter-1': { of: 'i-adapter', idea: 'Блискавка: зубці двох стрічок замикаються одне в одне за бігунком', piece: zipper },
  'alt-adapter-2': { of: 'i-adapter', idea: 'Сортер форм: трикутний брусок проходить лише у свій отвір', piece: sorter },
  'alt-keyrack-1': { of: 'i-keyrack', idea: 'Поплавок, що смикається: клює, але риби ще не витягли', piece: bobber },
  'alt-keyrack-2': { of: 'i-keyrack', idea: 'Яйця під лампою-обігрівачем: теплі, але ще не вилупились', piece: incubator },
};
