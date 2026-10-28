// Alternative skill icons, second half of the list (skills 17–31 on /art-review): two other ideas per skill, outside
// ICON_POOLS until Agov picks. Same style as icons-skills.ts: one object on a plate, its telling details, one live part.
import { kernel, f, type V3 } from './iso';
import { bar, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from './icons';
import { ann, ball } from './icons-rules';
import { ringY, ringX, rot, spokes } from './alt-rules';

const tube = (K: K, pts: V3[], live = false) => { const d = 'M' + pts.map((p) => K.P(...p).map(f).join(' ')).join('L'); return `<path class="tube-o" d="${d}"/><path class="tube-i" d="${d}"/>` + (live ? lit(`<path class="flow" d="${d}"/>`) : ''); };

// ── Pausing low performers: a handbrake pulled up on its ratchet (live grip).
const HB = kernel([[0, 0, 0], [68, 0, 0], [0, 40, 0], [68, 40, 0], [44, 22, 40]], 12);
const handbrake = icon(HB, 'A handbrake lever pulled up on its ratchet, the release button at the end of the grip.', () => {
  const K = HB, PX = 16, PY = 22, PZ = 14, a = -32;
  let s = plate(K, 0, 0, 68, 40) + K.box(8, 15, 4, 52, 14, 6, 'paper', 'body', 'tint') + K.on(K.FRONT(8, 29, 10), screws([[4, 3], [48, 3]]));
  s += K.box(10, 18, 10, 12, 8, 6, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(PX, PY - 1.6, PZ), `<path class="f tint" d="M0 0L${Array.from({ length: 9 }, (_, i) => { const t = (-70 + i * 6) * Math.PI / 180, r = i % 2 ? 9 : 10.6; return `${f(Math.cos(t) * r)} ${f(Math.sin(t) * r)}`; }).join('L')}Z"/>`);
  const lever = (cls: string) => `<g transform="rotate(${a})"><rect class="f ${cls}" x="-3" y="-2" width="40" height="4" rx="1"/></g>`;
  s += K.on(K.FRONT(PX, PY, PZ), lever('tint')) + K.on(K.FRONT(PX, PY + 2, PZ), lever('paper') + `<g transform="rotate(${a})"><line class="det" x1="4" y1="0" x2="24" y2="0"/></g>`);
  s += lit(K.on(K.FRONT(PX, PY + 2.4, PZ), `<g transform="rotate(${a})"><rect class="f body" x="24" y="-3" width="16" height="6" rx="2"/><path class="det" d="M27 -3V3M30 -3V3M33 -3V3"/><circle class="f paper" cx="41.4" cy="0" r="2"/></g>`));
  s += K.cylY(PY + 2, PY + 4, PX, PZ, 3, 'paper', 'body') + K.on(K.FRONT(PX, PY + 4, PZ), '<circle class="det" r="1.2"/>');
  return s;
});

// ── Pausing low performers: a stopwatch lying on its back, stopped (live crown button).
const SW = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [32, 0, 14]], 12);
const stopwatch = icon(SW, 'A stopwatch lying face up, its hand stopped and the crown button pressed in.', () => {
  const K = SW, CX = 32, CY = 24, R = 14;
  let s = plate(K, 0, 0, 64, 44) + K.on(K.FRONT(CX, 5, 8), ann(3.4, 2, 'f paper')) + lit(K.cylY(5.4, 8.4, CX, 8, 2.6, 'body', 'body') + K.cylY(8.4, 10.6, CX, 8, 1.6, 'body', 'body'));
  s += K.cylY(10, 12, CX - 9, 8, 1.6, 'paper', 'body');
  s += K.cyl(CX, CY, 4, R, 5, 'paper', 'tint') + K.cyl(CX, CY, 9, R - 1, 1, 'paper', 'body');
  s += K.on(K.TOP(CX, CY, 10), `<circle class="det" r="${R - 3}"/>` + Array.from({ length: 60 }, (_, i) => { const t = i * Math.PI / 30, r0 = i % 5 ? R - 3.8 : R - 5; return `<line class="det" x1="${f(Math.cos(t) * r0)}" y1="${f(Math.sin(t) * r0)}" x2="${f(Math.cos(t) * (R - 3))}" y2="${f(Math.sin(t) * (R - 3))}"/>`; }).join('') +
    `<circle class="det" cy="5" r="3"/><path class="f blk" d="M-.6 0L${f(Math.cos(-2) * 9)} ${f(Math.sin(-2) * 9)}L.6 0Z"/><circle class="f paper" r="1.2"/>`);
  return s;
});

// ── Weekly reporting: a seven-day organizer, today's lid flipped open (live).
const SO = kernel([[0, 0, 0], [76, 0, 0], [0, 36, 0], [76, 36, 0], [40, 10, 22]], 12);
const organizer = icon(SO, 'A seven-cell weekly organizer, all lids shut but one flipped open.', () => {
  const K = SO, X = 6, Y = 12, CW = 9, D = 14, H = 6, ZT = 4 + H;
  let s = plate(K, 0, 0, 76, 36);
  for (let i = 0; i < 7; i++) {
    const x = X + i * CW, open = i === 4;
    s += K.box(x, Y, 4, CW, D, H, 'paper', 'body', 'tint') + K.on(K.FRONT(x, Y + D, ZT), `<rect class="det" x="2" y="1.6" width="${CW - 4}" height="1.4" rx=".6"/>`);
    if (open) s += K.on(K.TOP(x, Y, ZT), `<rect class="f blk" x="1" y="1" width="${CW - 2}" height="${D - 2}"/>`) + K.cyl(x + 3.4, Y + 6, 5, 1.6, 1.2, 'paper', 'tint') + K.cyl(x + 5.6, Y + 9, 5, 1.6, 1.2, 'paper', 'tint') + lit(K.on(planeAt(K, [x, Y, ZT], [1, 0, 0], [0, .2, -.98]), `<rect class="f body" x=".4" y="-${D}" width="${CW - .8}" height="${D}" rx=".6"/>`));
    else s += K.box(x + .4, Y + .4, ZT, CW - .8, D - .8, 1, 'paper', 'body', 'tint');
  }
  return s;
});

// ── Weekly reporting: a segment timer, the pins for the report hours pushed down (live pins).
const ST = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [30, 22, 30]], 12);
const segtimer = icon(ST, 'A plug-in segment timer: a dial ringed with pins, a few of them pushed down for the hours it runs.', () => {
  const K = ST, CX = 30, CY = 22, R = 14, Z = 14;
  let s = plate(K, 0, 0, 60, 44) + K.box(12, 4, 4, 36, 36, 10, 'paper', 'body', 'tint') + K.on(K.FRONT(12, 40, 14), '<rect class="det" x="6" y="3" width="8" height="4" rx=".5"/><circle class="f blk" cx="28" cy="5" r="1"/>');
  s += K.cyl(CX, CY, Z, R + 2, 2, 'paper', 'body');
  const pins = Array.from({ length: 24 }, (_, i) => { const t = i * Math.PI / 12, x = CX + Math.cos(t) * R, y = CY + Math.sin(t) * R, on = i >= 6 && i <= 9; return { t, x, y, on, d: x + y }; }).sort((p, q) => p.d - q.d);
  s += pins.filter((p) => p.d < CX + CY).map((p) => p.on ? lit(K.prism(rot(p.x, p.y, 1.6, 2.4, p.t), Z + 2, 1, 'body', 'body', 'body')) : K.prism(rot(p.x, p.y, 1.6, 2.4, p.t), Z + 2, 3, 'paper', 'body', 'tint')).join('');
  s += K.cyl(CX, CY, Z + 2, R - 2, 3, 'paper', 'tint') + K.on(K.TOP(CX, CY, Z + 5), `<circle class="det" r="${R - 5}"/>${spokes(12, 3, 0).replace(/x1="0" y1="0"/g, 'x1="0" y1="0"')}<circle class="f paper" r="3.2"/><path class="f blk" d="M-1 -${R - 5}L0 -${R - 2}L1 -${R - 5}Z"/>`);
  s += pins.filter((p) => p.d >= CX + CY).map((p) => p.on ? lit(K.prism(rot(p.x, p.y, 1.6, 2.4, p.t), Z + 2, 1, 'body', 'body', 'body')) : K.prism(rot(p.x, p.y, 1.6, 2.4, p.t), Z + 2, 3, 'paper', 'body', 'tint')).join('');
  return s;
});

// ── Capping: a door on its chain, open only as far as the chain allows (live chain).
const DC = kernel([[0, 0, 0], [64, 0, 0], [0, 48, 0], [64, 48, 0], [14, 10, 64]], 12);
const doorchain = icon(DC, 'A door held part-open by a door chain stretched taut between its track on the frame and the door.', () => {
  const K = DC, FX = 10, FY = 10, H = 56, a = .55;
  let s = plate(K, 0, 0, 64, 48) + K.box(FX - 6, FY - 4, 4, 6, 4, H + 4, 'paper', 'body', 'tint') + K.box(FX - 6, FY - 4, H + 4, 36, 4, 4, 'paper', 'body', 'tint');
  s += K.box(FX - 4, FY, 4, 4, 30, H, 'paper', 'body', 'tint') + K.on(K.SIDE(FX, FY + 30, H + 4), '<rect class="f paper" x="8" y="18" width="3" height="10" rx=".6"/><rect class="f blk" x="9" y="19.4" width="1" height="7"/>');
  const door = rot(FX + Math.cos(a) * 15, FY + 30 - 30 + Math.sin(a) * 15, 30, 2.6, a);
  s += K.prism(door, 4, H, 'paper', 'body', 'tint');
  const dx = FX + Math.cos(a) * 9, dy = FY + Math.sin(a) * 9 + 1.6;
  s += K.on(planeAt(K, [FX + Math.cos(a) * 3, FY + Math.sin(a) * 3 + 1.4, H], [Math.cos(a), Math.sin(a), 0], [0, 0, -1]), '<rect class="det" x="3" y="4" width="20" height="20" rx=".6"/><rect class="det" x="3" y="28" width="20" height="22" rx=".6"/><circle class="f paper" cx="25" cy="27" r="1.6"/>');
  const p0: V3 = [FX + .4, FY + 23, 46], p1: V3 = [dx, dy, 46];
  s += lit(Array.from({ length: 7 }, (_, i) => { const t = i / 6, p = [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, p0[2] - Math.sin(t * Math.PI) * .8] as V3, [x, y] = K.P(...p); return `<ellipse class="f body" cx="${f(x)}" cy="${f(y)}" rx="1.6" ry="1"/>`; }).join('') + dot(K, dx, dy, 46.6, 1.2));
  return s;
});

// ── Capping: a flyball governor, the balls swung out at the set speed (live balls).
const FG = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [30, 22, 66], [8, 22, 44], [52, 22, 44]], 12);
const governor = icon(FG, 'A flyball governor: two weighted balls swung out on their arms round a spindle above a gearbox.', () => {
  const K = FG, CX = 30, CY = 22, ZT = 60, L = 22, a = .75;
  let s = plate(K, 0, 0, 60, 44) + K.box(16, 10, 4, 28, 24, 14, 'paper', 'body', 'tint') + K.on(K.FRONT(16, 34, 18), screws([[3, 3], [25, 3], [3, 11], [25, 11]]));
  s += K.cylX(44, 52, CY, 11, 2.4, 'paper', 'body') + K.cyl(CX, CY, 18, 4, 3, 'paper', 'body') + K.cyl(CX, CY, 21, 1.4, ZT - 21, 'paper', 'tint') + K.cyl(CX, CY, ZT, 2.6, 2.4, 'paper', 'body');
  const cz = 34;
  const arm = (sgn: number) => { const bx = CX + sgn * Math.sin(a) * L, bz = ZT - Math.cos(a) * L; return rope(K, [[CX, CY, ZT], [bx, CY, bz]], 1.6, 'f paper') + rope(K, [[CX, CY, cz], [CX + sgn * Math.sin(a) * L * .5, CY, ZT - Math.cos(a) * L * .5]], 1.2, 'f paper') + lit(ball(K, bx, CY, bz, 5, 'f body')); };
  s += arm(-1) + K.cyl(CX, CY, cz - 2, 3.4, 4, 'paper', 'body') + arm(1);
  return s;
});

// ── Pacing: an hourglass in its frame, sand running at an even rate (live sand).
const HG = kernel([[0, 0, 0], [52, 0, 0], [0, 44, 0], [52, 44, 0], [26, 22, 70]], 12);
const hourglass = icon(HG, 'An hourglass between two end plates on turned posts, half the sand run through.', () => {
  const K = HG, CX = 26, CY = 22, Z0 = 8, Z1 = 60, MZ = (Z0 + Z1) / 2, R = 10;
  let s = plate(K, 0, 0, 52, 44) + K.cyl(CX, CY, 4, 14, 4, 'paper', 'body');
  const posts = [0, 2.09, 4.19].map((t) => [CX + Math.cos(t - .6) * 12, CY + Math.sin(t - .6) * 12] as P2);
  s += posts.filter(([x, y]) => x + y < CX + CY).map(([x, y]) => K.cyl(x, y, Z0, 1.2, Z1 - Z0, 'paper', 'tint')).join('');
  const bulb = (z0: number, z1: number) => { const n = 10; return Array.from({ length: n }, (_, i) => { const u = i / n, z = z0 + (z1 - z0) * u, r = 1.6 + (R - 1.6) * Math.sin(Math.PI * (z0 < MZ ? 1 - u : u) / 2 + 0) ** .7; return K.cyl(CX, CY, z, Math.max(1.6, r), (z1 - z0) / n, 'paper', 'paper'); }).join(''); };
  s += bulb(Z0, MZ);
  s += lit(K.cyl(CX, CY, Z0, 8.6, 6, 'body', 'body') + K.poly([...K.ring(CX, CY, Z0 + 6, 8.6, -Math.PI / 4, Math.PI * 3 / 4, 12), [CX, CY, Z0 + 12]], 'f body') + rope(K, [[CX, CY, MZ], [CX, CY, Z0 + 12]], .8, 'f body'));
  s += bulb(MZ, Z1) + lit(K.cyl(CX, CY, MZ + 4, 5, 6, 'body', 'body'));
  s += posts.filter(([x, y]) => x + y >= CX + CY).map(([x, y]) => K.cyl(x, y, Z0, 1.2, Z1 - Z0, 'paper', 'tint')).join('') + K.cyl(CX, CY, Z1, 14, 4, 'paper', 'body') + K.cyl(CX, CY, Z1 + 4, 3, 1.6, 'paper', 'body');
  return s;
});

// ── Pacing: a conveyor carrying boxes at even spacing (live boxes).
const CV = kernel([[0, 0, 0], [80, 0, 0], [0, 40, 0], [80, 40, 0], [40, 20, 32]], 12);
const conveyor = icon(CV, 'A short conveyor on legs carrying identical boxes spaced evenly along the belt.', () => {
  const K = CV, Y = 12, D = 16, Z = 14;
  let s = plate(K, 0, 0, 80, 40) + [[8, Y + 1], [68, Y + 1], [8, Y + D - 3], [68, Y + D - 3]].map(([x, y]) => K.box(x, y, 4, 3, 2, Z - 6, 'paper', 'body', 'tint')).join('');
  s += K.cylY(Y, Y + D, 6, Z, 3, 'paper', 'body') + K.box(6, Y, Z - 3, 66, D, 6, 'paper', 'body', 'tint') + K.on(K.TOP(6, Y, Z + 3), Array.from({ length: 11 }, (_, i) => `<line class="det" x1="${3 + i * 6}" y1="1" x2="${3 + i * 6}" y2="${D - 1}"/>`).join(''));
  s += K.on(K.FRONT(6, Y + D, Z + 3), Array.from({ length: 6 }, (_, i) => `<circle class="f paper" cx="${4 + i * 11.6}" cy="3" r="1.4"/>`).join('')) + K.cylY(Y, Y + D, 72, Z, 3, 'paper', 'body');
  s += lit([12, 28, 44, 60].map((x) => K.box(x, Y + 3, Z + 3, 9, 10, 8, 'body', 'body', 'body') + K.on(K.TOP(x, Y + 3, Z + 11), '<path class="det" d="M4.5 0V10"/>')).join(''));
  return s;
});

// ── Budget re-allocation: a jib crane lifting a crate from one pallet over to another (live crate).
const JC = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [12, 12, 66], [60, 12, 64]], 12);
const jibcrane = icon(JC, 'A jib crane on a post: its trolley and hook carry a crate from one pallet over to another.', () => {
  const K = JC, PX = 12, PY = 12, ZA = 58, TX = 44;
  let s = plate(K, 0, 0, 76, 44) + K.box(PX - 6, PY - 6, 4, 12, 12, 3, 'paper', 'body', 'tint') + K.cyl(PX, PY, 7, 2.6, ZA - 3, 'paper', 'tint');
  s += K.box(PX, PY - 1.4, ZA, 50, 2.8, 4, 'paper', 'body', 'tint') + rope(K, [[PX, PY, ZA - 16], [PX + 22, PY, ZA]], 1.4, 'f paper') + K.cyl(PX, PY, ZA + 4, 3, 2, 'paper', 'body');
  const pallet = (x: number, y: number) => K.box(x, y, 4, 18, 14, 1.4, 'paper', 'body', 'tint') + K.box(x, y, 5.4, 18, 14, 1.6, 'paper', 'body', 'tint') + K.on(K.FRONT(x, y + 14, 7), '<rect class="f blk" x="3" y=".4" width="4" height=".8"/><rect class="f blk" x="11" y=".4" width="4" height=".8"/>');
  s += pallet(6, 26) + K.box(9, 28, 7, 12, 10, 8, 'paper', 'body', 'tint') + pallet(50, 26);
  s += K.box(TX - 4, PY - 3, ZA - 3, 8, 6, 3, 'paper', 'body', 'tint') + K.line([[TX, PY, ZA - 3], [TX, PY, 40]], 'det') + rope(K, [[TX - 1, PY, 40], [TX, PY, 38.4], [TX + 1.2, PY, 39.4]], 1, 'f paper');
  s += K.line([[TX, PY, 39], [TX - 5, PY + 1, 34]], 'det') + K.line([[TX, PY, 39], [TX + 5, PY - 1, 34]], 'det');
  s += lit(K.box(TX - 6, PY - 5, 24, 12, 10, 10, 'body', 'body', 'body') + K.on(K.TOP(TX - 6, PY - 5, 34), '<path class="det" d="M6 0V10M0 5H12"/>'));
  return s;
});

// ── Budget re-allocation: communicating vessels, the level the same in every one (live liquid).
const CVS = kernel([[0, 0, 0], [72, 0, 0], [0, 50, 0], [72, 50, 0], [36, 22, 52], [20, 40, 52]], 12);
const vessels = icon(CVS, 'Three glass vessels of different shapes joined at the foot by one pipe; the liquid stands at the same level in all three.', () => {
  const K = CVS, LV = 34, B = 10, P: P2[] = [[18, 40], [36, 22], [54, 4]];
  let s = plate(K, 0, 0, 72, 50) + K.prism(rot(36, 22, 66, 14, -Math.PI / 4), 4, 3, 'paper', 'body', 'tint');
  s += tube(K, [[P[2][0], P[2][1], B], [P[0][0], P[0][1], B]]);
  const glass = ([x, y]: P2, rs: number[], hs: number[]) => { let z = B - 2, g = '', l = ''; rs.forEach((r, i) => { g += K.cyl(x, y, z, r, hs[i], 'paper', 'paper'); const h = Math.max(0, Math.min(hs[i], LV - z)); if (h > 0) l += K.cyl(x, y, z, r - .6, h, 'body', 'body'); z += hs[i]; }); return g + lit(l) + K.cyl(x, y, z, rs[rs.length - 1] + .6, 1, 'paper', 'paper'); };
  s += glass(P[2], [2.2, 2.2], [20, 26]) + glass(P[1], [3, 6, 9], [8, 10, 26]) + glass(P[0], [6, 6], [20, 26]);
  return s;
});

// ── Account engagement: a dovetail joint sliding home (live tails).
const DV = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [38, 20, 26]], 12);
const dovetail = icon(DV, 'Two blocks joined by a dovetail: the tails of one slide into the matching sockets of the other.', () => {
  const K = DV, Y = 10, D = 20, Z = 4, H = 14, J = 34, G = 2;
  const tail = (y: number): P2[] => [[J, y + 1.4], [J + 7, y], [J + 7, y + 8], [J, y + 6.6]];
  let s = plate(K, 0, 0, 76, 40);
  s += lit(K.box(6, Y, Z, J - 6, D, H, 'body', 'body', 'body') + K.on(K.FRONT(6, Y + D, Z + H), '<path class="det" d="M3 4H24M3 8H24M3 11H18"/>') + [Y + 1, Y + 11].map((y) => K.prism(tail(y), Z, H, 'body', 'body', 'body')).join(''));
  s += K.box(J + 7 + G, Y, Z, 28, D, H, 'paper', 'body', 'tint') + K.on(K.TOP(0, 0, Z + H), [Y + 1, Y + 11].map((y) => `<path class="f blk" d="M${J + 7 + G} ${y}L${J + 14 + G} ${y + 1.4}L${J + 14 + G} ${y + 6.6}L${J + 7 + G} ${y + 8}Z"/>`).join(''));
  s += K.on(K.FRONT(J + 7 + G, Y + D, Z + H), '<path class="det" d="M3 4H24M3 8H24M3 11H18"/>');
  return s;
});

// ── Account engagement: a zip, closed behind the slider and open ahead of it (live slider).
const ZP = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [38, 22, 10]], 12);
const zipper = icon(ZP, 'A zip lying flat: its teeth interlocked behind the slider and parted ahead of it.', () => {
  const K = ZP, Z = 4.6, SX = 40;
  let s = plate(K, 0, 0, 76, 44) + K.box(4, 8, 4, 68, 28, .6, 'tint', 'body', 'tint');
  const teeth = (y0: number, y1: number, x0: number, x1: number, n: number) => Array.from({ length: n }, (_, i) => { const u = i / (n - 1), x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u; return `<rect class="f paper" x="${f(x)}" y="${f(y - 1.4)}" width="1.8" height="2.8" rx=".4"/>`; }).join('');
  s += K.on(K.TOP(0, 0, Z), teeth(21, 21, 6, SX - 2, 14) + teeth(23, 23, 7, SX - 1, 14) + teeth(18, 10, SX + 6, 70, 10) + teeth(26, 34, SX + 6, 70, 10) + '<path class="det" d="M6 19.4H40M6 24.6H40"/>');
  s += lit(K.prism([[SX - 3, 19], [SX + 6, 17], [SX + 6, 27], [SX - 3, 25]], Z, 3, 'body', 'body', 'body') + K.box(SX + 2, 20.6, Z + 3, 2, 2.8, 1.4, 'body', 'body', 'body') + K.box(SX + 4, 20.6, Z + 3, 10, 2.8, .8, 'body', 'body', 'body') + K.on(K.TOP(SX + 4, 20.6, Z + 3.8), '<rect class="f paper" x="6" y=".8" width="2.6" height="1.2" rx=".6"/>'));
  return s;
});

// ── Ad-hoc query: a searchlight on its yoke, thrown on (live lens and beam).
const SL = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [26, 20, 46], [76, 4, 48]], 12);
const searchlight = icon(SL, 'A searchlight drum on a yoke and turntable, its lens lit and a beam reaching out.', () => {
  const K = SL, CX = 26, CY = 20, CZ = 30, R = 9;
  let s = plate(K, 0, 0, 76, 40) + K.box(14, 10, 4, 24, 20, 4, 'paper', 'body', 'tint') + K.cyl(CX, CY, 8, 8, 3, 'paper', 'body');
  s += K.box(CX - 1.6, CY - R - 4, 11, 3.2, 3, CZ - 11, 'paper', 'body', 'tint') + K.box(CX - 7, CY - R - 4, 11, 14, 2 * R + 8, 2, 'paper', 'body', 'tint');
  s += K.cylX(CX - 12, CX + 10, CY, CZ, R, 'paper', 'tint') + [CX - 6, CX + 2].map((x) => K.line(ringX(x, CY, CZ, R), 'det')).join('') + K.cylX(CX - 15, CX - 12, CY, CZ, 6, 'paper', 'body');
  s += lit(K.poly([[CX + 11, CY, CZ + R], [76, 4, CZ + 16], [76, 36, CZ - 10], [CX + 11, CY, CZ - R]], 'f body'), .25);
  s += K.cylX(CX + 10, CX + 12, CY, CZ, R + 1, 'paper', 'body') + lit(K.on(K.SIDE(CX + 12, CY, CZ), `<circle class="f body" r="${R - .6}"/>` + [-4, 0, 4].map((v) => `<line class="det" x1="${v}" y1="${-R + 1.6}" x2="${v}" y2="${R - 1.6}"/>`).join('')));
  s += K.box(CX - 1.6, CY + R + 1, 11, 3.2, 3, CZ - 11, 'paper', 'body', 'tint') + K.cylY(CY + R + 4, CY + R + 6, CX, CZ, 2.4, 'paper', 'body');
  return s;
});

// ── Ad-hoc query: a telegraph key, ready to send (live knob).
const TK = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [36, 20, 26]], 12);
const telegraph = icon(TK, 'A telegraph key on its board: the lever on a pivot with a knob, a contact under it and two terminal posts with wires.', () => {
  const K = TK, Y = 20;
  let s = plate(K, 0, 0, 72, 40) + K.box(6, 8, 4, 60, 24, 4, 'paper', 'body', 'tint');
  for (const x of [14, 22]) s += K.cyl(x, 14, 8, 2.4, 4, 'paper', 'body') + K.cyl(x, 14, 12, 1.6, 2, 'paper', 'tint');
  s += rope(K, [[14, 14, 12], [10, 6, 6], [4, 4, 5]], 1, 'f paper') + rope(K, [[22, 14, 12], [20, 4, 6], [16, 2, 5]], 1, 'f paper');
  s += K.box(28, Y - 5, 8, 8, 10, 8, 'paper', 'body', 'tint') + K.cylY(Y - 5, Y + 5, 32, 14, 1.4, 'paper', 'body');
  s += K.cyl(50, Y, 8, 2.2, 2, 'paper', 'body') + K.cyl(50, Y, 10, 1, 2, 'paper', 'tint') + [12.6, 14, 15.4].map((z) => K.line(K.ring(42, Y, z, 1.4, -Math.PI / 4, Math.PI * 3 / 4, 8), 'det')).join('');
  s += K.box(22, Y - 1.4, 14, 40, 2.8, 2, 'paper', 'body', 'tint') + K.cyl(26, Y, 16, 1.6, 2, 'paper', 'body');
  s += lit(K.cyl(58, Y, 16, 2.4, 2, 'body', 'body') + K.cyl(58, Y, 18, 5, 2.6, 'body', 'body') + K.on(K.TOP(58, Y, 20.6), '<circle class="det" r="3.2"/>'));
  return s;
});

// ── Benchmark comparison: a colour swatch fan, one strip turned out to match (live strip).
const SF = kernel([[0, 0, 0], [72, 0, 0], [0, 48, 0], [72, 48, 0], [20, 24, 14]], 12);
const swatches = icon(SF, 'A colour swatch fan spread out on its pivot bolt, one strip turned out further than the rest.', () => {
  const K = SF, PX = 14, PY = 34, Z = 4;
  let s = plate(K, 0, 0, 72, 48);
  const strip = (a: number, i: number, cls: string) => K.on(K.TOP(PX, PY, Z + i * .6), `<g transform="rotate(${f(a)})"><path class="f ${cls}" d="M-3 -3H44V3H-3Z"/><rect class="f tint" x="22" y="-2" width="6" height="4"/><rect class="det" x="30" y="-2" width="6" height="4"/><rect class="f ${cls === 'body' ? 'paper' : 'body'}" x="38" y="-2" width="5" height="4"/></g>`);
  const angs = [-62, -50, -38, -26, -14, -2];
  s += angs.map((a, i) => strip(a, i, i % 2 ? 'paper' : 'tint')).join('') + lit(strip(-80, 6, 'body'));
  s += K.cyl(PX, PY, Z + 4.2, 2.4, 1.6, 'paper', 'body') + K.on(K.TOP(PX, PY, Z + 5.8), '<line class="det" x1="-1.4" y1="0" x2="1.4" y2="0"/>');
  return s;
});

// ── Benchmark comparison: a set of calibration weights in their case, one lifted out (live).
const CW = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [56, 30, 28], [6, 6, 26]], 12);
const weights = icon(CW, 'An open case of calibration weights in graded sizes, one weight lifted out and standing beside its empty recess.', () => {
  const K = CW, X = 6, Y = 8, W = 44, D = 26;
  let s = plate(K, 0, 0, 72, 44) + K.box(X, Y, 4, W, D, 8, 'paper', 'body', 'tint') + K.on(planeAt(K, [X, Y, 12], [1, 0, 0], [0, .1, -1]), `<rect class="f tint" x="0" y="-14" width="${W}" height="14"/><rect class="det" x="2" y="-12" width="${W - 4}" height="10" rx=".6"/>`);
  const ws = [[12, 15, 4, 9], [24, 15, 3.4, 8], [34, 15, 2.8, 7], [42, 15, 2.2, 6], [12, 26, 2.2, 5], [20, 26, 1.8, 4.6], [28, 26, 1.6, 4], [36, 26, 1.4, 3.4]];
  s += K.on(K.TOP(0, 0, 12), ws.map(([x, y, r]) => `<circle class="f blk" cx="${x}" cy="${y}" r="${r + .6}"/>`).join(''));
  ws.forEach(([x, y, r, h], i) => { if (i) s += K.cyl(x, y, 8, r, h, 'paper', 'tint') + K.cyl(x, y, 8 + h, r * .4, r * .5, 'paper', 'body') + ball(K, x, y, 8 + h + r * .5 + r * .3, r * .32, 'f paper'); });
  s += lit(K.cyl(60, 30, 4, 5, 11, 'body', 'body') + K.cyl(60, 30, 15, 2, 2.4, 'body', 'body') + ball(K, 60, 30, 18.6, 1.8, 'f body'));
  return s;
});

// ── ABM penetration: a dartboard on its stand with darts spread across it (live darts).
const DB = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [32, 14, 66], [32, 30, 50]], 12);
const darts = icon(DB, 'A dartboard on a stand, three darts stuck in different sectors.', () => {
  const K = DB, CX = 32, Y = 14, CZ = 40, R = 20;
  let s = plate(K, 0, 0, 64, 44) + K.box(26, 6, 4, 12, 14, 3, 'paper', 'body', 'tint') + K.box(30, 8, 7, 4, 4, CZ - 7, 'paper', 'body', 'tint');
  s += K.cylY(Y - 3, Y, CX, CZ, R + 1, 'paper', 'tint');
  s += K.on(K.FRONT(CX, Y, CZ), [R, R - 4, R - 7, R - 11, R - 15].map((r, i) => `<circle class="f ${i % 2 ? 'tint' : 'paper'}" r="${r}"/>`).join('') + Array.from({ length: 20 }, (_, i) => { const t = i * Math.PI / 10 + Math.PI / 20; return `<line class="det" x1="${f(Math.cos(t) * 2.4)}" y1="${f(Math.sin(t) * 2.4)}" x2="${f(Math.cos(t) * (R - 4))}" y2="${f(Math.sin(t) * (R - 4))}"/>`; }).join('') + '<circle class="f blk" r="2.4"/>');
  const dart = (lx: number, lz: number) => { const p: V3 = [CX + lx, Y, CZ - lz]; return rope(K, [p, [p[0] + 2, p[1] + 12, p[2] + 2]], 1.6, 'f body') + K.on(planeAt(K, [p[0] + 2, p[1] + 9, p[2] + 2], [0, 1, 0], [0, 0, -1]), '<path class="f body" d="M0 0L5 -3.4L5 0Z"/>') + K.on(planeAt(K, [p[0] + 2, p[1] + 9, p[2] + 2], [0, 1, 0], [-1, 0, 0]), '<path class="f body" d="M0 0L5 -3.4L5 0Z"/>'); };
  s += lit(dart(-8, -6) + dart(9, -3) + dart(-2, 10));
  return s;
});

// ── ABM penetration: a stapler driven through a thick stack of sheets (live staple).
const SP = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [24, 20, 30]], 12);
const stapler = icon(SP, 'A desk stapler pressed down through a thick stack of sheets, the staple driven in.', () => {
  const K = SP, Y = 14, D = 12, ZS = 7 + 6 * 1.2;
  let s = plate(K, 0, 0, 72, 40) + K.box(6, Y, 4, 50, D, 3, 'paper', 'body', 'tint') + K.box(6, Y, 7, 8, D, 7, 'paper', 'body', 'tint');
  for (let i = 0; i < 6; i++) s += K.box(30 - i * .3, Y - 8 + i * .2, 7 + i * 1.2, 34, D + 16, 1.2, 'paper', 'body', 'tint');
  s += K.on(K.TOP(28.5, Y - 6.8, ZS), '<path class="det" d="M26 4H32M26 7H30M24 22H32"/>');
  s += K.cylY(Y + 1, Y + D - 1, 10, 14, 2.4, 'paper', 'body') + K.box(8, Y + 1, ZS, 46, D - 2, 3, 'paper', 'body', 'tint') + K.box(10, Y + 2, ZS + 3, 46, D - 4, 4, 'paper', 'body', 'tint') + K.on(K.FRONT(10, Y + D - 2, ZS + 7), '<path class="det" d="M4 2H38"/>');
  s += lit(K.on(K.TOP(30, Y - 6, ZS), '<rect class="f body" x="18" y="2.6" width="6" height="1.2"/>'));
  return s;
});

// ── Audience demographics: a glass prism splitting one beam into bands (live bands).
const PR = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [34, 22, 36]], 12);
const prism = icon(PR, 'A glass prism on a stand: one beam goes in from a lamp and fans out the other side in separate bands.', () => {
  const K = PR, CX = 34, CY = 22, Z = 14, H = 16;
  let s = plate(K, 0, 0, 76, 44) + K.box(4, 16, 4, 12, 12, 14, 'paper', 'body', 'tint') + K.on(K.SIDE(16, 28, 18), '<circle class="f blk" cx="6" cy="6" r="2.4"/>');
  s += K.box(CX - 9, CY - 9, 4, 18, 18, 4, 'paper', 'body', 'tint') + K.cyl(CX, CY, 8, 2.4, Z - 8, 'paper', 'body');
  s += K.line([[16, 22, 22], [CX - 4, CY, 22]], 'tube-o') + K.line([[16, 22, 22], [CX - 4, CY, 22]], 'tube-i');
  const bands = [-.36, -.18, 0, .18, .36];
  s += lit(bands.map((d, i) => K.poly([[CX + 4, CY + d * 4, 22], [74, 10 + i * 6, 22 - i * 1.6], [74, 14 + i * 6, 21 - i * 1.6], [CX + 4, CY + d * 4 + .6, 21.6]], `f ${['paper', 'tint', 'body', 'tint', 'paper'][i]}`)).join(''));
  s += K.prism([[CX - 6, CY + 6], [CX + 7, CY + 4], [CX - 1, CY - 8]], Z, H, 'paper', 'tint', 'paper') + K.cyl(CX, CY, Z + H, 1.4, 1, 'paper', 'body');
  return s;
});

// ── Audience demographics: a parts-bin rack, each bin holding its own share (live contents).
const PB = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [32, 12, 56]], 12);
const binrack = icon(PB, 'A rack of open-fronted parts bins in three rows, each bin filled to its own level.', () => {
  const K = PB, X = 10, Y = 8, W = 44, D = 4;
  let s = plate(K, 0, 0, 64, 44) + K.box(X, Y, 4, W, D, 50, 'paper', 'body', 'tint') + K.on(K.FRONT(X, Y + D, 54), screws([[3, 3], [W - 3, 3]]));
  const fills = [[.8, .4, .6], [.3, .9, .5], [.6, .2, .7]];
  [38, 22, 6].forEach((z, r) => { for (let c = 0; c < 3; c++) { const x = X + 2 + c * 14, d = 14; s += K.box(x, Y + D, z, 12, d, 2, 'paper', 'body', 'tint') + K.box(x, Y + D, z + 2, 1, d, 10, 'paper', 'body', 'tint') + lit(K.box(x + 1, Y + D + 1, z + 2, 10, d - 3, 9 * fills[r][c], 'body', 'body', 'body')) + K.box(x + 11, Y + D, z + 2, 1, d, 10, 'paper', 'body', 'tint') + K.box(x, Y + D + d - 1, z + 2, 12, 1, 5, 'paper', 'body', 'tint') + K.on(K.FRONT(x, Y + D + d, z + 7), '<rect class="det" x="3" y="1.4" width="6" height="2.2"/>'); } });
  return s;
});

// ── Benchmark context: a compass set on a map to read where you stand (live needle).
const CM = kernel([[0, 0, 0], [72, 0, 0], [0, 46, 0], [72, 46, 0], [44, 24, 12]], 12);
const compass = icon(CM, 'A folded map open on the plate, a baseplate compass laid on it with its needle settled.', () => {
  const K = CM, Z = 4.6;
  let s = plate(K, 0, 0, 72, 46);
  s += K.on(K.TOP(6, 6, 4), '<rect class="f paper" width="20" height="34"/>') + K.on(K.TOP(26, 6, 4.3), '<rect class="f tint" width="20" height="34"/>') + K.on(K.TOP(46, 6, 4), '<rect class="f paper" width="20" height="34"/>');
  s += K.on(K.TOP(6, 6, Z), '<path class="det" d="M2 30C10 24 14 26 22 18S36 10 44 14S56 8 58 4"/><path class="det" d="M4 8C8 12 6 16 12 18M30 30C34 26 40 28 46 24" stroke-dasharray="2 2"/><circle class="det" cx="44" cy="14" r="2"/>');
  s += K.prism(rot(44, 26, 18, 26, .3), Z, 1.2, 'paper', 'body', 'tint') + K.cyl(44, 24, Z + 1.2, 8, 3, 'paper', 'tint');
  s += K.on(K.TOP(44, 24, Z + 4.2), `<circle class="det" r="6.4"/>` + Array.from({ length: 16 }, (_, i) => { const t = i * Math.PI / 8; return `<line class="det" x1="${f(Math.cos(t) * 5.4)}" y1="${f(Math.sin(t) * 5.4)}" x2="${f(Math.cos(t) * 6.4)}" y2="${f(Math.sin(t) * 6.4)}"/>`; }).join(''));
  s += lit(K.on(K.TOP(44, 24, Z + 4.2), '<g transform="rotate(-30)"><path class="f body" d="M0 -5.4L1.2 0H-1.2Z"/><path class="f paper" d="M0 5.4L1.2 0H-1.2Z"/></g><circle class="f paper" r=".8"/>'));
  return s;
});

// ── Benchmark context: an archive box of past reports, one folder pulled up (live).
const AR = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [32, 20, 42]], 12);
const archive = icon(AR, 'An open archive box of hanging folders, the past reports filed in order and one folder pulled up to read.', () => {
  const K = AR, X = 10, Y = 10, W = 44, D = 24, H = 18, T = 1.6, ZT = 4 + H;
  let s = plate(K, 0, 0, 64, 44) + K.poly([[X, Y + T, 4], [X + W, Y + T, 4], [X + W, Y + T, ZT], [X, Y + T, ZT]], 'f body') + K.poly([[X + T, Y, 4], [X + T, Y + D, 4], [X + T, Y + D, ZT], [X + T, Y, ZT]], 'f body');
  for (let i = 0; i < 8; i++) { const x = X + 4 + i * 5, up = i === 5; const g = K.box(x, Y + 2, up ? 12 : 6, 1, D - 4, up ? 18 : 16, up ? 'body' : 'paper', 'body', up ? 'body' : 'tint') + K.box(x, Y + 3 + (i % 3) * 6, up ? 30 : 22, 1, 5, 2.6, up ? 'body' : 'paper', 'body', up ? 'body' : 'tint'); s += up ? lit(g) : g; }
  s += K.poly([[X, Y + D, 4], [X + W, Y + D, 4], [X + W, Y + D, ZT], [X, Y + D, ZT]], 'f tint') + K.poly([[X + W, Y, 4], [X + W, Y + D, 4], [X + W, Y + D, ZT], [X + W, Y, ZT]], 'f body');
  s += K.on(K.TOP(X, Y, ZT), `<path class="f paper" fill-rule="evenodd" d="M0 0H${W}V${D}H0ZM${T} ${T}H${W - T}V${D - T}H${T}Z"/>`) + K.on(K.FRONT(X, Y + D, ZT), `<rect class="det" x="${W / 2 - 8}" y="5" width="16" height="7" rx=".6"/><rect class="f blk" x="${W / 2 - 4}" y="2" width="8" height="2" rx="1"/>`);
  return s;
});

// ── Creative performance: a poster flip rack, the best poster turned to the front (live).
const PF = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [12, 22, 60]], 12);
const posterrack = icon(PF, 'A wall flip rack of posters hinged on one rail, the panels fanned out and the best one swung to the front.', () => {
  const K = PF, HX = 12, HY = 10, Z0 = 14, H = 40, W = 30;
  let s = plate(K, 0, 0, 64, 44) + K.box(HX - 6, HY - 4, 4, 6, 4, 56, 'paper', 'body', 'tint') + K.box(HX - 2, HY - 2, 12, 3, 30, 2, 'paper', 'body', 'tint') + K.box(HX - 2, HY - 2, Z0 + H, 3, 30, 2, 'paper', 'body', 'tint');
  const panel = (y: number, a: number, live = false) => { const u: V3 = [Math.cos(a), Math.sin(a), 0], art = `<rect class="f ${live ? 'body' : 'paper'}" width="${W}" height="${H}"/><rect class="${live ? 'f paper' : 'f tint'}" x="4" y="4" width="${W - 8}" height="${H - 18}"/><path class="det" d="M4 ${H - 10}H${W - 4}M4 ${H - 7}H${W - 12}"/>`; const g = K.on(planeAt(K, [HX, y, Z0 + H], u, [0, 0, -1]), art); return live ? lit(g) : g; };
  s += panel(HY + 2, -.2) + panel(HY + 6, .15) + panel(HY + 10, .45) + panel(HY + 14, .75) + panel(HY + 18, 1.05, true);
  s += [HY + 2, HY + 6, HY + 10, HY + 14, HY + 18].map((y) => K.cyl(HX, y, Z0 - 1, 1, H + 2, 'paper', 'body')).join('');
  return s;
});

// ── Creative performance: a hand of cards fanned out, the winner raised above the rest (live).
const FC = kernel([[0, 0, 0], [64, 0, 0], [0, 48, 0], [64, 48, 0], [32, 24, 14]], 12);
const cards = icon(FC, 'A hand of playing cards fanned out on the plate, one card pushed up above the others.', () => {
  const K = FC, PX = 32, PY = 38, Z = 4;
  let s = plate(K, 0, 0, 64, 48);
  const card = (a: number, i: number, lift = 0, live = false) => { const g = K.on(K.TOP(PX, PY, Z + i * .5), `<g transform="rotate(${a}) translate(0 ${-lift})"><rect class="f ${live ? 'body' : 'paper'}" x="-6" y="-30" width="12" height="18" rx="1.2"/><rect class="det" x="-4.4" y="-28.4" width="8.8" height="14.8" rx=".6"/>${[[-2, -25], [2, -25], [0, -21], [-2, -17], [2, -17]].map(([x, y]) => `<circle class="${live ? 'f paper' : 'f tint'}" cx="${x}" cy="${y}" r="1"/>`).join('')}</g>`); return live ? lit(g) : g; };
  s += [-40, -24, -8, 24, 40].map((a, i) => card(a, i > 2 ? i + 1 : i)).join('') + card(8, 3, 5, true);
  return s;
});

// ── Performance KPIs: a mixing desk, its faders set at different levels (live master fader).
const MX = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [36, 14, 26]], 12);
const mixer = icon(MX, 'A mixing desk with a row of channel faders set at different levels and a row of knobs above them.', () => {
  const K = MX, X = 8, Y = 8, W = 56, D = 30, ZB = 8;
  let s = plate(K, 0, 0, 72, 44) + K.box(X, Y, 4, W, D, ZB, 'paper', 'body', 'tint') + K.poly([[X, Y, 4 + ZB], [X + W, Y, 4 + ZB], [X + W, Y, 4 + ZB + 8], [X, Y, 4 + ZB + 8]], 'f tint');
  s += K.box(X, Y - 2, 4, W, 2, ZB + 8, 'paper', 'body', 'tint');
  const lv = [.3, .6, .45, .8, .5, .9];
  for (let i = 0; i < 6; i++) {
    const x = X + 5 + i * 8.4;
    s += K.on(K.TOP(x, Y, 4 + ZB), `<rect class="f blk" x="-.6" y="10" width="1.2" height="17"/>` + [12, 16, 20, 24].map((y) => `<line class="det" x1="1.4" y1="${y}" x2="2.6" y2="${y}"/>`).join(''));
    s += K.cyl(x, Y + 5, 4 + ZB, 2, 2, 'paper', 'body') + K.on(K.TOP(x, Y + 5, 6 + ZB), `<line class="det" x1="0" y1="0" x2="${f(Math.cos(-1 - i) * 1.6)}" y2="${f(Math.sin(-1 - i) * 1.6)}"/>`);
    const cap = K.box(x - 2, Y + 25 - lv[i] * 15, 4 + ZB, 4, 3, 2.4, i === 5 ? 'body' : 'paper', 'body', i === 5 ? 'body' : 'tint');
    s += i === 5 ? lit(cap) : cap;
  }
  return s;
});

// ── Performance KPIs: an oscilloscope with a clean trace on its screen (live trace).
const OS = kernel([[0, 0, 0], [70, 0, 0], [0, 44, 0], [70, 44, 0], [30, 12, 44]], 12);
const scope = icon(OS, 'An oscilloscope on its feet: a waveform traced across the gridded screen, knobs beside it and a probe lead.', () => {
  const K = OS, X = 8, Y = 10, W = 48, D = 22, Z = 6, H = 30;
  let s = plate(K, 0, 0, 70, 44) + [[X + 2, Y + D - 4], [X + W - 6, Y + D - 4]].map(([x, y]) => K.box(x, y, 4, 4, 4, 2, 'paper', 'body', 'tint')).join('');
  s += K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint') + K.on(K.SIDE(X + W, Y + D, Z + H), Array.from({ length: 6 }, (_, i) => `<line class="det" x1="${4 + i * 2.6}" y1="6" x2="${4 + i * 2.6}" y2="18"/>`).join(''));
  const fc = K.FRONT(X, Y + D, Z + H);
  s += K.on(fc, `<rect class="f blk" x="3" y="3" width="28" height="22" rx="1"/>` + [1, 2, 3].map((i) => `<line class="det" x1="${3 + i * 7}" y1="3" x2="${3 + i * 7}" y2="25" stroke-dasharray="1 2"/>`).join('') + `<line class="det" x1="3" y1="14" x2="31" y2="14" stroke-dasharray="1 2"/>` + [[38, 7], [44, 7], [38, 15], [44, 15]].map(([x, y]) => `<circle class="f paper" cx="${x}" cy="${y}" r="2.4"/><line class="det" x1="${x}" y1="${y}" x2="${x}" y2="${y - 2.4}"/>`).join('') + '<rect class="det" x="35" y="21" width="12" height="4" rx=".5"/>');
  s += lit(K.on(fc, `<path class="f body" d="M4 14${Array.from({ length: 27 }, (_, i) => { const x = 4 + i, y = 14 - Math.sin(i * .48) * 6; return `L${x} ${f(y - .5)}`; }).join('')}${Array.from({ length: 27 }, (_, i) => { const x = 30 - i, y = 14 - Math.sin((26 - i) * .48) * 6; return `L${x} ${f(y + .5)}`; }).join('')}Z"/>`));
  s += rope(K, [[X + 42, Y + D, 12], [X + 44, Y + D + 6, 5], [X + 54, Y + D + 8, 5], [X + 60, Y + D + 2, 5]], 1.2, 'f paper') + K.cylX(X + 58, X + 64, Y + D + 2, 5.6, 1.2, 'paper', 'tint');
  return s;
});

// ── Multichannel rollup: three pipes merging into one header (live outlet).
const MG = kernel([[0, 0, 0], [76, 0, 0], [0, 48, 0], [76, 48, 0], [34, 24, 34]], 12);
const merge = icon(MG, 'Three pipes from different sides run into one junction block and leave as one larger pipe.', () => {
  const K = MG, JX = 34, JY = 24, Z = 14;
  let s = plate(K, 0, 0, 76, 48);
  s += tube(K, [[JX, 4, Z], [JX, JY - 6, Z]]) + tube(K, [[4, 10, Z], [16, 10, Z], [16, JY, Z], [JX - 6, JY, Z]]) + K.box(JX - 2, 6, 4, 4, 4, Z - 6, 'paper', 'body', 'tint');
  s += K.box(JX - 6, JY - 6, Z - 6, 12, 12, 12, 'paper', 'body', 'tint') + K.on(K.TOP(JX - 6, JY - 6, Z + 6), screws([[2, 2], [10, 2], [2, 10], [10, 10]]));
  s += tube(K, [[JX, 46, Z - 2], [JX, JY + 6, Z - 2]]) + K.box(JX - 2, 40, 4, 4, 4, Z - 8, 'paper', 'body', 'tint');
  s += K.cylX(JX + 6, JX + 8, JY, Z, 6, 'paper', 'body') + lit(K.cylX(JX + 8, 74, JY, Z, 4.6, 'body', 'body') + K.line(ringX(60, JY, Z, 4.6), 'det'));
  return s;
});

// ── Multichannel rollup: a cable loom, three leads bound into one with a big connector (live connector).
const LM = kernel([[0, 0, 0], [76, 0, 0], [0, 44, 0], [76, 44, 0], [64, 22, 20]], 12);
const loom = icon(LM, 'Three cables from different sides gathered by ties into one loom that ends in a single large connector.', () => {
  const K = LM, Z = 6, Y = 22;
  let s = plate(K, 0, 0, 76, 44);
  const lead = (pts: V3[]) => rope(K, pts, 2.4, 'f tint') + rope(K, pts.map(([x, y, z]) => [x, y, z + .4] as V3), 1, 'f paper');
  s += lead([[6, 6, Z], [20, 12, Z], [30, Y - 1.6, Z], [52, Y - 1.6, Z]]) + lead([[4, Y, Z], [52, Y, Z]]) + lead([[6, 38, Z], [20, 32, Z], [30, Y + 1.6, Z], [52, Y + 1.6, Z]]);
  s += [36, 44].map((x) => K.cylX(x, x + 2, Y, Z, 3.6, 'paper', 'body')).join('');
  s += [[6, 6], [6, 38], [4, Y]].map(([x, y]) => K.box(x - 3, y - 2, 4, 4, 4, 4, 'paper', 'body', 'tint')).join('');
  s += lit(K.cylX(52, 58, Y, Z + 1, 4.6, 'body', 'body') + K.box(58, Y - 6, 1, 12, 12, 12, 'body', 'body', 'body') + K.on(K.SIDE(70, Y + 6, 13), Array.from({ length: 6 }, (_, i) => `<circle class="f blk" cx="${3 + (i % 3) * 3}" cy="${4 + Math.floor(i / 3) * 4}" r=".8"/>`).join('')));
  return s;
});

// ── Traffic analysis: a flow meter on a pipe, the paddle wheel turning behind its window (live wheel).
const FM = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [38, 20, 44]], 12);
const flowmeter = icon(FM, 'A flow meter on a pipe: a round window shows the paddle wheel inside, a dial counter on top.', () => {
  const K = FM, CY = 20, CZ = 18;
  let s = plate(K, 0, 0, 76, 40) + [12, 64].map((x) => K.box(x - 4, CY - 6, 4, 8, 12, 9, 'paper', 'body', 'tint')).join('') + K.cylX(2, 26, CY, CZ, 5, 'paper', 'tint') + K.cylX(26, 28, CY, CZ, 7, 'paper', 'body');
  s += K.box(28, CY - 9, CZ - 10, 20, 18, 18, 'paper', 'body', 'tint') + K.on(K.FRONT(28, CY + 9, CZ + 8), `<circle class="f blk" cx="10" cy="9" r="7"/>` + screws([[2.4, 2.4], [17.6, 2.4], [2.4, 15.6], [17.6, 15.6]]));
  s += lit(K.on(K.FRONT(28, CY + 9, CZ + 8), `<g transform="translate(10 9) rotate(15)">${Array.from({ length: 6 }, (_, i) => `<rect class="f body" x="-.7" y="-6" width="1.4" height="5" transform="rotate(${i * 60})"/>`).join('')}<circle class="f body" r="1.6"/></g>`));
  s += K.on(K.FRONT(28, CY + 9, CZ + 8), '<circle class="det" cx="10" cy="9" r="7"/>') + K.cylX(48, 50, CY, CZ, 7, 'paper', 'body') + K.cylX(50, 74, CY, CZ, 5, 'paper', 'tint');
  s += K.cyl(38, CY, CZ + 8, 6, 4, 'paper', 'body') + K.on(K.TOP(38, CY, CZ + 12), `<circle class="det" r="4.6"/>${Array.from({ length: 10 }, (_, i) => { const t = i * Math.PI / 5; return `<line class="det" x1="${f(Math.cos(t) * 3.8)}" y1="${f(Math.sin(t) * 3.8)}" x2="${f(Math.cos(t) * 4.6)}" y2="${f(Math.sin(t) * 4.6)}"/>`; }).join('')}<path class="f blk" d="M-.5 0L${f(Math.cos(-.8) * 3.6)} ${f(Math.sin(-.8) * 3.6)}L.5 0Z"/>`);
  return s;
});

// ── Traffic analysis: a signpost with three blank arms pointing different ways (live arm).
const SG2 = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [30, 22, 66], [52, 30, 54], [8, 30, 54]], 12);
const signpost = icon(SG2, 'A signpost with three arrow-shaped arms pointing in different directions, one of them picked out.', () => {
  const K = SG2, CX = 30, CY = 22;
  let s = plate(K, 0, 0, 60, 44) + K.box(CX - 6, CY - 6, 4, 12, 12, 3, 'paper', 'body', 'tint');
  const arm = (z: number, a: number, live = false) => { const u: V3 = [Math.cos(a), Math.sin(a), 0], g = K.on(planeAt(K, [CX, CY, z], u, [0, 0, -1]), `<path class="f ${live ? 'body' : 'paper'}" d="M2 0H20L25 4L20 8H2Z"/><path class="det" d="M5 3H17M5 5H14"/>`); return live ? lit(g) : g; };
  s += arm(58, -2.2) + K.box(CX - 1.6, CY - 1.6, 7, 3.2, 3.2, 56, 'paper', 'body', 'tint') + K.cyl(CX, CY, 63, 2.2, 1.6, 'paper', 'body');
  s += arm(48, .3, true) + arm(38, 1.9);
  return s;
});

export const ALT_SKILLS_B = { handbrake, stopwatch, organizer, segtimer, doorchain, governor, hourglass, conveyor, jibcrane, vessels, dovetail, zipper, searchlight, telegraph, swatches, weights, darts, stapler, prism, binrack, compass, archive, posterrack, cards, mixer, scope, merge, loom, flowmeter, signpost };
