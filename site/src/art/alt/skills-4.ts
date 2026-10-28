// Alternative skill icons, batch 4 (drilled … patchpanel): each a different object for the same meaning, in the style of
// icons-skills.ts: one object on a plate, its telling details, one live part.
import { kernel, f, type V3 } from '../iso';
import { prism, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from '../icons';
import type { Alt } from './index';

// ── Office tower: ABM account penetration. One account is one building; the lit windows are the people reached, scattered
// over the floors; the lit windows are live.
const TW = kernel([[0, 0, 0], [64, 0, 0], [0, 44, 0], [64, 44, 0], [31, 22, 76]], 12);
const tower = icon(TW, 'An office tower on its podium; a few windows on different floors are lit, the rest dark.', () => {
  const K = TW, X = 17, Y = 10, W = 28, D = 24, Z = 7, H = 58, ZT = Z + H;
  let s = plate(K, 0, 0, 64, 44) + K.box(X - 4, Y - 4, 4, W + 8, D + 8, 3, 'paper', 'body', 'tint') + K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint');
  const win = (x: number, y: number, on: boolean) => `<rect class="f ${on ? 'body' : 'paper'}" x="${x}" y="${y}" width="4" height="4.4" rx=".3"/>`;
  const FL = 7, onF = ['1-2', '3-0', '4-3', '6-1'], onS = ['2-1', '5-2'];
  let fr = '', sd = '', lf = '', ls = '';
  for (let r = 0; r < FL; r++) {
    const y = 4 + r * 6.6;
    for (let c = 0; c < 4; c++) { const x = 3 + c * 6.6, on = onF.includes(`${r}-${c}`); if (on) lf += win(x, y, true); else fr += win(x, y, false); }
    for (let c = 0; c < 3; c++) { const x = 3.4 + c * 6.8, on = onS.includes(`${r}-${c}`); if (on) ls += win(x, y, true); else sd += win(x, y, false); }
    fr += `<line class="det" x1="0" y1="${f(y + 5.5)}" x2="${W}" y2="${f(y + 5.5)}"/>`; sd += `<line class="det" x1="0" y1="${f(y + 5.5)}" x2="${D}" y2="${f(y + 5.5)}"/>`;
  }
  // Entrance at the foot of the front: a canopy over glazed doors
  fr += `<rect class="f blk" x="${W / 2 - 4}" y="${H - 8}" width="8" height="8"/><line class="det" x1="${W / 2}" y1="${H - 8}" x2="${W / 2}" y2="${H}"/>`;
  s += K.on(K.FRONT(X, Y + D, ZT), fr) + K.on(K.SIDE(X + W, Y + D, ZT), sd);
  s += K.box(X + W / 2 - 6, Y + D, Z + 8, 12, 3, 1.2, 'paper', 'body', 'tint');
  // Roof: parapet line, a plant room, an aerial
  s += K.on(K.TOP(X, Y, ZT), `<rect class="det" x="1.5" y="1.5" width="${W - 3}" height="${D - 3}"/>`) + K.box(X + 5, Y + 4, ZT, 10, 8, 4, 'paper', 'body', 'tint') + K.cyl(X + 21, Y + 8, ZT, .7, 8, 'paper', 'body');
  s += lit(K.on(K.FRONT(X, Y + D, ZT), lf) + K.on(K.SIDE(X + W, Y + D, ZT), ls));
  return s;
});

// ── Nesting dolls: ABM account penetration. A row of dolls from the outer shell to the smallest inner one; how far in you
// got is the smallest doll, which is live.
const ND = kernel([[0, 4, 0], [76, 4, 0], [0, 36, 0], [76, 36, 0], [12, 20, 40]], 12);
const dolls = icon(ND, 'A row of nesting dolls from the opened outer shell down to the smallest, innermost doll.', () => {
  const K = ND, Y = 20;
  let s = plate(K, 0, 4, 76, 32);
  const doll = (x: number, r: number, live = false) => {
    const hb = r * 1.4, z1 = 4 + hb, hr = r * .62, [hx, hy] = K.P(x, Y, z1 + r * .5 + hr);
    let g = K.cyl(x, Y, 4, r, hb * .55, 'paper', live ? 'body' : 'tint') + K.cyl(x, Y, 4 + hb * .55, r, hb * .45, 'paper', 'paper') + K.cyl(x, Y, z1, r * .82, r * .5, 'paper', 'paper');
    // Apron on the front of the body, head with a scarf and the face
    const [ax, ay] = K.P(x + r * .7, Y + r * .7, 4 + hb * .5);
    g += `<ellipse class="det" cx="${f(ax)}" cy="${f(ay)}" rx="${f(r * .45)}" ry="${f(r * .6)}"/>`;
    g += `<circle class="f ${live ? 'body' : 'tint'}" cx="${f(hx)}" cy="${f(hy)}" r="${f(hr)}"/><circle class="f paper" cx="${f(hx + hr * .12)}" cy="${f(hy + hr * .12)}" r="${f(hr * .56)}"/>`;
    g += `<circle class="f blk" cx="${f(hx + hr * .02)}" cy="${f(hy + hr * .06)}" r="${f(hr * .08)}"/><circle class="f blk" cx="${f(hx + hr * .28)}" cy="${f(hy + hr * .06)}" r="${f(hr * .08)}"/>`;
    return g;
  };
  // The outer doll opened: its bottom half with the rim showing, its top half standing next to it
  const R = 9, hb = R * 1.4;
  s += K.cyl(10, Y, 4, R, hb * .55, 'paper', 'tint') + K.on(K.TOP(10, Y, 4 + hb * .55), `<circle class="f blk" r="${R - 1.4}"/>`);
  s += doll(28, R);
  s += doll(46, 6.6) + doll(60, 4.8) + lit(doll(71, 3.2, true));
  return s;
});

// ── Hat shelf: audience demographics. A shelf of hats, a hard hat, a top hat, a flat cap, a bowler: who the audience is
// reads off what they wear; the top hat is live.
const HS = kernel([[0, 2, 0], [90, 2, 0], [0, 40, 0], [90, 40, 0], [36, 21, 44]], 12);
const hats = icon(HS, 'A low shelf with four different hats on it: a hard hat, a top hat, a flat cap and a bowler.', () => {
  const K = HS, Y = 21, Z = 13, c = (x: number, z: number, r: number, h: number, side = 'tint') => K.cyl(x, Y, Z + z, r, h, 'paper', side);
  let s = plate(K, 0, 2, 90, 38);
  for (const x of [8, 76]) s += K.box(x, Y - 9, 4, 6, 18, Z - 6, 'paper', 'body', 'tint');
  s += K.box(3, Y - 12, Z - 2, 84, 24, 2, 'paper', 'body', 'tint');
  const hard = (x: number) => c(x, 0, 10.4, 1, 'body') + c(x, 1, 8, 5) + c(x, 6, 7, 3) + c(x, 9, 5.2, 2) + c(x, 11, 2.8, 1);
  const top = (x: number) => c(x, 0, 9.2, 1, 'body') + c(x, 1, 5.8, 2.8, 'body') + c(x, 3.8, 5.8, 13, 'body') + K.line(K.ring(x, Y, Z + 3.8, 5.8, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det');
  // Flat cap: a crown pulled forward over a stiff peak
  const cap = (x: number) => { const pk: P2[] = Array.from({ length: 13 }, (_, i) => { const a = -Math.PI * .05 + Math.PI * .6 * i / 12; return [x + Math.cos(a) * 11, Y + Math.sin(a) * 11] as P2; }); return prism(K, [...pk, [x, Y]], Z, 1, 'paper', 'body') + K.cyl(x - 1.6, Y - 1.6, Z, 7.6, 3.2, 'paper', 'tint') + K.cyl(x - 1.6, Y - 1.6, Z + 3.2, 6.2, 1, 'paper', 'tint') + dot(K, x - 1.6, Y - 1.6, Z + 4.2, 1.1); };
  const bowler = (x: number) => c(x, 0, 8.6, 1, 'body') + c(x, 1, 6.2, 2, 'body') + c(x, 3, 6.2, 5) + c(x, 8, 5.2, 2.4) + c(x, 10.4, 3.6, 1.2);
  s += hard(16) + lit(top(36)) + cap(56) + bowler(75);
  return s;
});

// ── Chocolate box: audience demographics. An assortment box: mostly rounds, a few domes, two squares; what the audience
// is made of reads as the mix in the tray. The squares are live.
const CB2 = kernel([[0, 0, 0], [74, 0, 0], [0, 50, 0], [74, 50, 0], [37, 25, 16]], 12);
const chocolates = icon(CB2, 'An open box of assorted chocolates in a tray: mostly round ones, a few domed ones and two square ones.', () => {
  const K = CB2, X = 7, Y = 7, W = 60, D = 36, Z = 4, H = 6, N = 5, M = 3, cw = W / N, ch = D / M, ZT = Z + H;
  let s = plate(K, 0, 0, 74, 50) + K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + D, ZT), `<rect class="f paper" x="${W / 2 - 8}" y="1.6" width="16" height="2.8" rx=".4"/>`);
  s += K.on(K.TOP(X, Y, ZT), `<rect class="det" x="1.4" y="1.4" width="${W - 2.8}" height="${D - 2.8}"/>` + Array.from({ length: N * M }, (_, q) => { const i = q % N, j = Math.floor(q / N); return `<rect class="f tint" x="${f(i * cw + 2)}" y="${f(j * ch + 2)}" width="${f(cw - 4)}" height="${f(ch - 4)}" rx="1"/>`; }).join(''));
  const round = (x: number, y: number) => K.cyl(x, y, ZT, 4, 2.6, 'paper', 'body') + K.on(K.TOP(x, y, ZT + 2.6), '<path class="det" d="M-2.4 .4Q-1.2 -1.2 0 .4T2.4 .4"/>');
  const dome = (x: number, y: number) => K.cyl(x, y, ZT, 4, 1.6, 'paper', 'body') + K.cyl(x, y, ZT + 1.6, 3, 1.2, 'paper', 'tint') + K.cyl(x, y, ZT + 2.8, 1.6, .8, 'paper', 'tint');
  const square = (x: number, y: number) => K.box(x - 3.4, y - 3.4, ZT, 6.8, 6.8, 2.8, 'paper', 'body', 'body') + K.on(K.TOP(x - 3.4, y - 3.4, ZT + 2.8), '<path class="det" d="M1.4 1.4L5.4 5.4M5.4 1.4L1.4 5.4"/>');
  const mix = ['RRSRD', 'RDRRR', 'RRRDS'];
  let sq = '';
  for (let j = 0; j < M; j++) for (let i = 0; i < N; i++) {
    const x = X + (i + .5) * cw, y = Y + (j + .5) * ch, t = mix[j][i];
    // drawn in rows, back to front; the squares wait for the live group at the end (they sit low, nothing in front covers them)
    if (t === 'S') sq += square(x, y); else s += t === 'R' ? round(x, y) : dome(x, y);
  }
  return s + lit(sq);
});

// ── Site map: benchmark context. A "you are here" board on two posts: a map of the market with your spot marked on it;
// the spot is live.
const YH = kernel([[0, 0, 0], [70, 0, 0], [0, 34, 0], [70, 34, 0], [8, 16, 60], [62, 16, 60]], 12);
const sitemap = icon(YH, 'A map board on two posts showing streets and blocks, with a you-are-here marker on it.', () => {
  const K = YH, X = 8, Y = 15, W = 54, T = 3, Z0 = 20, ZT = 56;
  let s = plate(K, 0, 0, 70, 34);
  for (const x of [X + 6, X + W - 10]) s += K.box(x - 2, Y - 2, 4, 8, T + 4, 2, 'paper', 'body', 'tint') + K.box(x, Y, 6, 4, T, ZT - 6, 'paper', 'body', 'tint');
  s += K.box(X, Y, Z0, W, T, ZT - Z0, 'paper', 'body', 'tint') + K.box(X - 2, Y - 2, ZT, W + 4, T + 5, 2.4, 'paper', 'body', 'tint');
  const H = ZT - Z0;
  let map = `<rect class="f paper" x="3" y="3" width="${W - 6}" height="${H - 6}"/>`;
  map += [[6, 6, 10, 7], [19, 6, 8, 7], [30, 6, 14, 7], [6, 16, 8, 12], [17, 16, 12, 5], [17, 24, 12, 4], [32, 16, 6, 12], [41, 16, 7, 12]].map(([x, y, w, h]) => `<rect class="f tint" x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('');
  map += `<path class="det" d="M3 ${H - 9}Q20 ${H - 5} 30 ${H - 7}T${W - 3} ${H - 8}"/><circle class="det" cx="44" cy="10" r="2.4"/>` + screws([[5, 4.6], [W - 5, 4.6], [5, H - 4.6], [W - 5, H - 4.6]]);
  const face = K.FRONT(X, Y + T, ZT);
  s += K.on(face, map) + lit(K.on(face, `<circle class="det" cx="30.5" cy="22.5" r="4.4"/><circle class="f body" cx="30.5" cy="22.5" r="2"/>`));
  return s;
});

// ── Level and staff: benchmark context. A surveyor's level on its tripod sighting a graduated staff: your height read
// against a fixed bench mark; the reading on the staff is live.
const LV = kernel([[0, 0, 0], [76, 0, 0], [0, 40, 0], [76, 40, 0], [20, 20, 56], [66, 20, 62]], 12);
const level = icon(LV, 'A surveyor\'s level on a tripod, its sight line running to a graduated staff standing on a bench mark.', () => {
  const K = LV, HX = 20, HY = 20, HZ = 40, SX = 64, SY = 18;
  let s = plate(K, 0, 0, 76, 40);
  const leg = (x: number, y: number) => rope(K, [[HX + (x - HX) * .08, HY + (y - HY) * .08, HZ], [x, y, 4]], 2.2, 'f body') + K.cyl(x, y, 4, 1.6, 1, 'paper', 'body');
  s += leg(8, 8) + leg(32, 10);
  s += K.cyl(HX, HY, HZ - 3, 4.4, 3, 'paper', 'body') + leg(18, 34);
  // The instrument: levelling base, body, telescope with sunshade and eyepiece, a bubble vial on top
  s += K.cyl(HX, HY, HZ, 5, 1.6, 'paper', 'tint') + K.box(HX - 5, HY - 3, HZ + 1.6, 10, 6, 5, 'paper', 'body', 'tint');
  s += K.cylX(HX - 11, HX - 8, HY, HZ + 9.6, 1.6, 'paper', 'body') + K.cylX(HX - 8, HX + 10, HY, HZ + 9.6, 2.8, 'paper', 'tint') + K.cylX(HX + 10, HX + 13, HY, HZ + 9.6, 3.4, 'paper', 'body');
  s += K.box(HX - 3, HY - 1, HZ + 12.4, 6, 2, 1.6, 'paper', 'body');
  // Bench mark plate in the ground under the staff, the staff with its E pattern
  s += K.cyl(SX + 1.5, SY + 1.5, 4, 5, 1, 'paper', 'body') + K.box(SX, SY, 5, 3, 3, 56, 'paper', 'body', 'tint');
  const marks = Array.from({ length: 13 }, (_, i) => `<rect class="f blk" x="0" y="${2 + i * 4}" width="${i % 5 === 4 ? 2.6 : 1.4}" height="2"/>`).join('');
  s += K.on(K.FRONT(SX, SY + 3, 61), marks);
  s += `<path class="dash" d="M${K.P(HX + 13.4, HY, HZ + 9.6).map(f).join(' ')}L${K.P(SX, SY + 1.5, HZ + 9.6).map(f).join(' ')}"/>`;
  s += lit(K.on(K.FRONT(SX, SY + 3, 61), `<rect class="f body" x="-.6" y="${f(61 - HZ - 9.6 - 1.3)}" width="4.2" height="2.6"/>`));
  return s;
});

// ── Tackle box: creative performance. An open box of lures, each a different shape and colour; the one that got the bite
// lies out in front, live.
const TB = kernel([[0, 0, 0], [80, 0, 0], [0, 46, 0], [80, 46, 0], [30, 10, 38]], 12);
const tackle = icon(TB, 'An open tackle box with lures of different shapes in its compartments; one lure lies out in front of it.', () => {
  const K = TB, X = 8, Y = 12, W = 46, D = 24, Z = 4, H = 11;
  let s = plate(K, 0, 0, 80, 46);
  // Lid swung up behind, hinge pins, handle on its top edge
  s += K.box(X, Y - 3, Z + H, W, 3, 22, 'paper', 'body', 'tint') + K.on(K.FRONT(X, Y, Z + H + 22), `<rect class="det" x="3" y="3" width="${W - 6}" height="16" rx=".6"/>`);
  s += K.box(X + W / 2 - 7, Y - 2.4, Z + H + 22, 14, 1.8, 2.6, 'paper', 'body');
  s += K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint') + K.on(K.FRONT(X, Y + D, Z + H), `<rect class="f body" x="${W / 2 - 3}" y="1.6" width="6" height="3.4" rx=".5"/>` + screws([[4, 3.2], [W - 4, 3.2]]));
  // Compartments and the lures in them, seen from above
  const cw = (W - 3) / 3, ch = (D - 3) / 2;
  let top = `<rect class="f tint" x="1.5" y="1.5" width="${W - 3}" height="${D - 3}"/>`;
  top += `<path class="f paper" d="M${1.5 + cw} 1.5h.8v${D - 3}h-.8ZM${1.5 + 2 * cw} 1.5h.8v${D - 3}h-.8ZM1.5 ${1.5 + ch}H${W - 1.5}v.8H1.5Z"/>`;
  const fish = (x: number, y: number) => `<path class="f paper" d="M${x - 5} ${y}Q${x - 1} ${y - 3} ${x + 3} ${y}Q${x - 1} ${y + 3} ${x - 5} ${y}ZM${x + 3} ${y}L${x + 5.4} ${y - 2}V${y + 2}Z"/><circle class="f blk" cx="${x - 3}" cy="${y - .4}" r=".5"/>`;
  const spoon = (x: number, y: number) => `<ellipse class="f body" cx="${x}" cy="${y}" rx="5" ry="2.4"/><path class="det" d="M${x + 5} ${y}h2.4"/>`;
  const spin = (x: number, y: number) => `<path class="det" d="M${x - 6} ${y}H${x + 6}"/><ellipse class="f paper" cx="${x - 2}" cy="${y}" rx="2.6" ry="1.6"/><circle class="f blk" cx="${x + 3}" cy="${y}" r="1"/>`;
  const jig = (x: number, y: number) => `<circle class="f body" cx="${x - 3}" cy="${y}" r="2"/><path class="det" d="M${x - 1} ${y}L${x + 5} ${y - 2}M${x - 1} ${y}L${x + 5} ${y}M${x - 1} ${y}L${x + 5} ${y + 2}"/>`;
  const c = (i: number) => 1.5 + cw * (i + .5), r = (j: number) => 1.5 + ch * (j + .5);
  top += fish(c(0), r(0)) + spoon(c(1), r(0)) + spin(c(2), r(0)) + jig(c(0), r(1)) + spin(c(1), r(1)) + spoon(c(2), r(1));
  s += K.on(K.TOP(X, Y, Z + H), top);
  // The lure that worked: a minnow plug lying on the plate, lip, eye, a treble hook under its belly
  const plan: P2[] = [[58, 31], [63, 26.6], [70, 25.4], [77, 27.8], [75, 32], [66, 34.4]];
  s += lit(prism(K, plan, 4, 3, 'body', 'body') + K.on(K.TOP(0, 0, 7), `<path class="det" d="M66 27.2L66.4 33.2M70 26.8L70.2 32.4"/><circle class="f paper" cx="62.6" cy="29.6" r="1"/>`));
  s += K.on(K.TOP(0, 0, 4), `<path class="det" d="M68 33.2V37.4M66.4 37.6Q68 39.4 69.6 37.6M58.2 31.2L60 31"/>`) + K.box(56.6, 30.2, 5, 3, 2, .8, 'paper', 'tint');
  return s;
});

// ── Spinning tops: creative performance. A handful of different tops spun at once; the rest have fallen over, one is
// still spinning upright (live).
const DT = kernel([[0, 0, 0], [84, 0, 0], [0, 52, 0], [84, 52, 0], [22, 18, 36]], 12);
const tops = icon(DT, 'Four spinning tops on a board: three have fallen on their sides, one still spins upright.', () => {
  const K = DT;
  let s = plate(K, 0, 0, 84, 52);
  // A top as steps from the tip to the shoulder, a cap and the handle: [radius, length] from the tip
  const steps = [[1.2, 2.2], [3.2, 2.2], [5.2, 2.2], [7.2, 2.2], [9, 3.2], [6.8, 1.6], [1.6, 6.4]];
  const lying = (x: number, y: number, dir: 'x' | 'y', sideA = 'tint') => {
    let g = '', u = 0; const zc = 4 + 9;
    for (const [r, l] of steps) { g += dir === 'x' ? K.cylX(x + u, x + u + l, y, zc - (9 - r), r, 'paper', r === 9 ? 'body' : sideA) : K.cylY(y + u, y + u + l, x, zc - (9 - r), r, 'paper', r === 9 ? 'body' : sideA); u += l; }
    return g;
  };
  const up = (x: number, y: number) => {
    let g = '', z = 4;
    for (const [r, l] of steps) { g += K.cyl(x, y, z, r, l, 'paper', r === 9 ? 'body' : 'tint'); z += l; }
    return g + K.line(K.ring(x, y, 4 + 7, 13, Math.PI * .05, Math.PI * .7, 24), 'dash');
  };
  s += lying(44, 10, 'x') + lit(up(20, 18)) + lying(64, 20, 'y') + lying(26, 38, 'x');
  return s;
});

// ── Growth marks: LinkedIn performance KPIs. A door jamb with height marks pencilled up it; the pale mark is last period,
// the square resting on the jamb marks where it is now (live).
const GM = kernel([[0, 4, 0], [68, 4, 0], [0, 40, 0], [68, 40, 0], [26, 12, 68]], 12);
const growth = icon(GM, 'A door jamb with pencilled height marks; a pale mark for last time and a square resting on the jamb at the new, higher mark.', () => {
  const K = GM, X = 26, Y = 12, W = 9, D = 7, ZT = 66, now = 52, last = 44;
  let s = plate(K, 0, 4, 68, 36);
  // The wall to the left of the opening, its skirting, then the jamb with its stop bead
  s += K.box(2, Y, 4, X - 2, 4, ZT - 4, 'paper', 'body', 'tint') + K.box(2, Y + 4, 4, X - 2, 1.2, 5, 'paper', 'body', 'tint');
  s += K.box(X, Y, 4, W, D, ZT - 4, 'paper', 'body', 'tint') + K.box(X + W, Y + 1, 4, 1.6, 3, ZT - 4, 'paper', 'body');
  const face = K.FRONT(X, Y + D, ZT), y = (z: number) => f(ZT - z);
  s += K.on(face, [20, 26, 31, 36, 40].map((z) => `<line class="det" x1="1" y1="${y(z)}" x2="5" y2="${y(z)}"/>`).join('') + `<rect class="f tint" x="0" y="${y(last + .6)}" width="${W}" height="1.2"/>`);
  // Square: the blade flat on the head's height, the stock against the jamb
  s += lit(K.on(face, `<rect class="f body" x="0" y="${y(now + .6)}" width="${W}" height="1.2"/>`) + K.box(X + 1, Y + D, now - 6, 2.2, 1.6, 7.4, 'paper', 'body') + K.box(X + 1, Y + D, now + .2, 2.2, 16, 1.2, 'paper', 'body'));
  // A carpenter's pencil on the floor
  s += K.box(42, 30, 4, 18, 3, 1.6, 'paper', 'tint') + K.box(60, 30.6, 4.2, 2.6, 1.8, 1.2, 'paper', 'body');
  return s;
});

// ── Split-flap board: LinkedIn performance KPIs. A departures-style board of flap units, the numbers standing; one flap
// is falling to the new figure, live.
const SF = kernel([[0, 4, 0], [76, 4, 0], [0, 36, 0], [76, 36, 0], [38, 14, 42], [62, 34, 40]], 12);
const splitflap = icon(SF, 'A split-flap display of four units on feet; one unit\'s upper flap is falling forward to show the next figure.', () => {
  const K = SF, X = 6, Y = 12, W = 64, D = 10, Z = 9, H = 28, ZT = Z + H, U = 4, UW = 12, UH = 20, gap = (W - U * UW) / (U + 1), seam = H / 2;
  let s = plate(K, 0, 4, 76, 32);
  for (const x of [X + 6, X + W - 14]) s += K.box(x, Y, 4, 8, D, Z - 4, 'paper', 'body', 'tint');
  s += K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint') + K.box(X - 1, Y - 1, ZT, W + 2, D + 2, 2, 'paper', 'body', 'tint');
  const segs = [[[1, 0, 1, 1, 1], [1, 1, 0, 1, 1], [0, 1, 1, 1, 0], [1, 1, 1, 0, 1]], [[1, 1, 0, 1, 1], [0, 1, 1, 1, 1], [1, 0, 1, 1, 0], [1, 1, 1, 1, 1]]];
  // A stroke figure in five segments: top, upper right, middle, lower right, bottom (half cards each)
  const glyph = (x: number, [t, ur, m, lr, b]: number[], half: 0 | 1) => half === 0
    ? (t ? `<rect class="f blk" x="${x + 3.4}" y="${seam - UH / 2 + 2}" width="5.2" height="1.4"/>` : '') + (ur ? `<rect class="f blk" x="${x + 7.2}" y="${seam - UH / 2 + 2}" width="1.4" height="7"/>` : '') + `<rect class="f blk" x="${x + 3.4}" y="${seam - UH / 2 + 2}" width="1.4" height="7"/>`
    : (m ? `<rect class="f blk" x="${x + 3.4}" y="${seam + .4}" width="5.2" height="1.4"/>` : '') + (lr ? `<rect class="f blk" x="${x + 7.2}" y="${seam + .4}" width="1.4" height="7.2"/>` : '') + (b ? `<rect class="f blk" x="${x + 3.4}" y="${seam + 6.2}" width="5.2" height="1.4"/>` : '');
  let face = '';
  for (let i = 0; i < U; i++) {
    const x = gap + i * (UW + gap), g = segs[i === 2 ? 1 : 0][i];
    face += `<rect class="f tint" x="${x - 1}" y="${seam - UH / 2 - 1}" width="${UW + 2}" height="${UH + 2}" rx=".6"/><line class="det" x1="${x}" y1="${seam}" x2="${x + UW}" y2="${seam}"/><rect class="f paper" x="${x}" y="${seam - UH / 2}" width="${UW}" height="${UH / 2 - .4}" rx=".4"/><rect class="f paper" x="${x}" y="${seam + .4}" width="${UW}" height="${UH / 2 - .4}" rx=".4"/>` + glyph(x, g, 0) + glyph(x, g, 1);
  }
  s += K.on(K.FRONT(X, Y + D, ZT), face + screws([[2.4, 3], [W - 2.4, 3], [2.4, H - 3], [W - 2.4, H - 3]]));
  // The falling flap: hinged on the seam of the third unit, swung 60° out towards the viewer; it carries the old figure's top
  const x2 = X + gap + 2 * (UW + gap), th = Math.PI * .42, zs = ZT - seam;
  const pl = planeAt(K, [x2, Y + D, zs], [1, 0, 0], [0, Math.sin(th), Math.cos(th)]);
  s += lit(K.on(pl, `<rect class="f body" x="0" y=".4" width="${UW}" height="${UH / 2 - .4}" rx=".4"/><rect class="f paper" x="3.4" y="2" width="5.2" height="1.4"/><rect class="f paper" x="3.4" y="2" width="1.4" height="7"/><rect class="f paper" x="7.2" y="2" width="1.4" height="7"/>`));
  return s;
});

// ── Tiffin carrier: multichannel rollup. Separate tins of different depth, one per channel, clamped into one stack you
// carry by a single handle; the frame and handle are live.
const TF = kernel([[0, 0, 0], [60, 0, 0], [0, 44, 0], [60, 44, 0], [30, 22, 70]], 12);
const tiffin = icon(TF, 'A tiffin carrier: three stacked tins of different depth with a lid, held together by two side rails and one handle.', () => {
  const K = TF, CX = 30, CY = 22, R = 12, tiers: [number, string][] = [[12, 'tint'], [9, 'paper'], [7, 'tint']];
  let s = plate(K, 0, 0, 60, 44) + K.cyl(CX, CY, 4, R - 1, 1.6, 'paper', 'body');
  let z = 5.6;
  const zs: number[] = [];
  for (const [h, cls] of tiers) { s += K.cyl(CX, CY, z, R, h, 'paper', cls) + K.cyl(CX, CY, z + h - 1.2, R + .7, 1.2, 'paper', 'body'); zs.push(z + h / 2); z += h; }
  s += K.cyl(CX, CY, z, R - .6, 2, 'paper', 'body') + K.cyl(CX, CY, z + 2, 3, 1.6, 'paper', 'tint') + K.cyl(CX, CY, z + 3.6, 1.6, 1.4, 'paper', 'body');
  // Rails on the two silhouette edges, a clip on each tin, the handle arching over the lid
  const ZT = z + 9, A = [Math.PI * 3 / 4, -Math.PI / 4].map((a) => [CX + (R + 1.8) * Math.cos(a), CY + (R + 1.8) * Math.sin(a)]);
  let g = '';
  for (const [x, y] of A) g += K.box(x - 1, y - 1, 6.4, 2, 2, ZT - 6.4, 'paper', 'body', 'body') + zs.map((zz) => K.box(x - 1.6, y - 1.6, zz - 1.2, 3.2, 3.2, 2.4, 'paper', 'body', 'body')).join('');
  g += rope(K, K.curve([A[0][0], A[0][1], ZT], [CX, CY, ZT + 14], [A[1][0], A[1][1], ZT], 24), 2.2, 'f body');
  return s + lit(g);
});

// ── Bundle: multichannel rollup. A bundle of different tools, pencils, pens, a brush, chalk, held as one by a band round
// the middle; the band is live.
const BU = kernel([[0, 4, 0], [76, 4, 0], [0, 40, 0], [76, 40, 0], [40, 22, 26]], 12);
const bundle = icon(BU, 'A bundle of different writing tools lying on their side, tied together by a band round the middle.', () => {
  const K = BU, X0 = 10, X1 = 58, CY = 22, CZ = 13, r = 3;
  let s = plate(K, 0, 4, 76, 36);
  // Pencil, pen, brush, chalk, marker, pencil: same length, different ends; sections packed in three layers
  const rods: [number, number, string][] = [[CY - 6.2, CZ - 4.6, 'pen'], [CY, CZ - 4.6, 'chalk'], [CY + 6.2, CZ - 4.6, 'pencil'], [CY - 3.1, CZ + .8, 'brush'], [CY + 3.1, CZ + .8, 'marker'], [CY, CZ + 6.2, 'pencil']];
  const end = (y: number, z: number, kind: string) => {
    if (kind === 'pencil') return K.cylX(X1, X1 + 3.4, y, z, r * .62, 'tint', 'tint') + K.cylX(X1 + 3.4, X1 + 5, y, z, r * .26, 'blk', 'body');
    if (kind === 'pen') return K.cylX(X1, X1 + 2, y, z, r * .7, 'paper', 'body') + K.cylX(X1 + 2, X1 + 3.6, y, z, r * .3, 'blk', 'body');
    if (kind === 'brush') return K.cylX(X1, X1 + 3, y, z, r * .8, 'paper', 'body') + K.cylX(X1 + 3, X1 + 7, y, z, r * .66, 'tint', 'tint');
    if (kind === 'marker') return K.cylX(X1, X1 + 4, y, z, r + .3, 'paper', 'body');
    return '';
  };
  rods.forEach(([y, z, kind]) => {
    const side = kind === 'chalk' ? 'paper' : kind === 'marker' ? 'body' : 'tint';
    s += K.cylX(X0, X1, y, z, r, 'paper', side) + end(y, z, kind);
  });
  // The band: a wide strap round the middle with its buckle, over the rods
  const BX = 31, BW = 6, BR = r + 6.6, arc = (x: number, a0: number, a1: number, n = 24): V3[] => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [x, CY + BR * Math.cos(a), CZ + .6 + BR * Math.sin(a)] as V3; });
  const wall = [...arc(BX, -Math.PI / 4, Math.PI * 3 / 4), ...arc(BX + BW, -Math.PI / 4, Math.PI * 3 / 4).reverse()];
  s += lit(K.poly(wall, 'f body') + K.box(BX - .6, CY - 2.6, CZ + .6 + BR - .4, BW + 1.2, 5.2, 1.6, 'paper', 'body'));
  return s;
});

// ── Fingerpost: traffic analysis. A signpost with arms pointing every way people come from; the busiest way is live.
const FP = kernel([[2, 0, 0], [68, 0, 0], [2, 46, 0], [68, 46, 0], [34, 22, 66], [8, 2, 56], [62, 40, 34]], 12);
const fingerpost = icon(FP, 'A fingerpost with four pointed arms at different heights, each pointing a different way.', () => {
  const K = FP, PX = 34, PY = 22, PH = 60, L = 26, BH = 6.4, T = 1.3;
  let s = plate(K, 2, 0, 66, 46) + K.box(PX - 5, PY - 5, 4, 10, 10, 3, 'paper', 'body', 'tint');
  const arms: [number, number, boolean?][] = [[-1.2, 54], [2.6, 46], [-.2, 38, true], [2.0, 30]];
  const arm = ([a, z, live]: [number, number, boolean?]) => {
    const c = Math.cos(a), sn = Math.sin(a), sg = -sn + c > 0 ? 1 : -1, n: V3 = [-sn * sg, c * sg, 0];
    const board = (off: number, cls: string, inner = '') => K.on(planeAt(K, [PX + c * 2.2 + n[0] * off, PY + sn * 2.2 + n[1] * off, z], [c, sn, 0], [0, 0, -1]), `<path class="f ${cls}" d="M0 0H${L - 4}L${L} ${BH / 2}L${L - 4} ${BH}H0Z"/>${inner}`);
    const g = board(-T / 2, 'body') + board(T / 2, live ? 'body' : 'paper', `<path class="det" d="M2.4 1.6H${L - 6}M2.4 ${BH - 1.6}H${L - 6}"/>`);
    return live ? lit(g) : g;
  };
  const back = arms.filter(([a]) => Math.cos(a) + Math.sin(a) < 0), front = arms.filter(([a]) => Math.cos(a) + Math.sin(a) >= 0);
  s += back.map(arm).join('');
  s += K.box(PX - 2, PY - 2, 7, 4, 4, PH - 3, 'paper', 'body', 'tint') + K.box(PX - 2.8, PY - 2.8, 4 + PH, 5.6, 5.6, 1.6, 'paper', 'body') + K.cyl(PX, PY, 5.6 + PH, 1.6, 2.4, 'paper', 'tint');
  s += front.map(arm).join('');
  return s;
});

// ── Rotameter bank: traffic analysis. Three flow tubes on one manifold, one per way in; the float in each shows how much
// comes through it. The highest float is live.
const RM = kernel([[0, 4, 0], [76, 4, 0], [0, 36, 0], [76, 36, 0], [38, 20, 60]], 12);
const rotameters = icon(RM, 'A bank of three flow meters on a manifold: glass tubes with a float in each, sitting at different heights.', () => {
  const K = RM, Y = 20, Z0 = 12, Z1 = 52, X = [20, 38, 56], lvl = [.3, .78, .5], G0 = Z0 + 6, GH = Z1 - Z0 - 12;
  let s = plate(K, 0, 4, 76, 32);
  for (const x of [8, 68]) s += K.box(x - 3, Y - 5, 4, 6, 10, Z0 - 7, 'paper', 'body', 'tint');
  s += K.cylX(2, 74, Y, Z0, 4, 'paper', 'tint') + K.box(8, Y - 2, Z0 + 2, 4, 4, Z1 - Z0 - 2, 'paper', 'body', 'tint') + K.box(64, Y - 2, Z0 + 2, 4, 4, Z1 - Z0 - 2, 'paper', 'body', 'tint');
  s += K.cylX(6, 70, Y, Z1, 3.4, 'paper', 'tint');
  X.forEach((x, i) => {
    s += K.box(x - 3.4, Y - 3.4, Z0 + 2, 6.8, 6.8, 4, 'paper', 'body', 'tint') + K.box(x - 3.4, Y - 3.4, Z1 - 6, 6.8, 6.8, 3.6, 'paper', 'body', 'tint');
    s += K.cyl(x, Y, G0, 2.8, GH, 'paper', 'paper');
    s += Array.from({ length: 7 }, (_, q) => K.line([[x + 2, Y + 2, G0 + 3 + q * (GH - 6) / 6], [x + 2.9, Y + 2.9, G0 + 3 + q * (GH - 6) / 6]], 'det')).join('');
    const fz = G0 + 2 + (GH - 6) * lvl[i], fl = K.cyl(x, Y, fz - 1.6, .9, 1.6, 'paper', 'body') + K.cyl(x, Y, fz, 2.1, 2.2, 'paper', 'body');
    s += i === 1 ? lit(fl) : fl;
    s += K.line([[x - 2.8 * Math.SQRT1_2, Y + 2.8 * Math.SQRT1_2, G0], [x - 2.8 * Math.SQRT1_2, Y + 2.8 * Math.SQRT1_2, G0 + GH]], 'det');
  });
  return s;
});

export const ALTS: Record<string, Alt> = {
  'alt-drilled-1': { of: 'i-drilled', idea: 'Офісна вежа, де світяться окремі вікна на різних поверхах: скільки людей усередині акаунта охоплено', piece: tower },
  'alt-drilled-2': { of: 'i-drilled', idea: 'Матрьошки від зовнішньої до найменшої: наскільки глибоко ви дійшли всередину акаунта', piece: dolls },
  'alt-sieve-1': { of: 'i-sieve', idea: 'Полиця з різними капелюхами: каска, циліндр, кепка, котелок — хто в аудиторії, видно з того, що вони носять', piece: hats },
  'alt-sieve-2': { of: 'i-sieve', idea: 'Коробка цукерок-асорті: здебільшого круглі, кілька куполків і дві квадратні — склад аудиторії видно з суміші', piece: chocolates },
  'alt-mirror-1': { of: 'i-mirror', idea: 'Мапа «ви тут» на стійці: ваша точка на карті ринку', piece: sitemap },
  'alt-mirror-2': { of: 'i-mirror', idea: 'Нівелір на тринозі і рейка на репері: ваш рівень зчитано відносно сталої позначки', piece: level },
  'alt-bits-1': { of: 'i-bits', idea: 'Відкрита скринька з блешнями різних форм, а та, що спрацювала, лежить попереду', piece: tackle },
  'alt-bits-2': { of: 'i-bits', idea: 'Дзиґи, запущені разом: більшість упала, одна ще крутиться — це креатив, що досі працює', piece: tops },
  'alt-dial-1': { of: 'i-dial', idea: 'Одвірок із позначками зросту: бліда риска минулого разу, косинець на новій, вищій', piece: growth },
  'alt-dial-2': { of: 'i-dial', idea: 'Табло з перекидними цифрами: одна пластина падає на нове значення показника', piece: splitflap },
  'alt-abacus-1': { of: 'i-abacus', idea: 'Тифін-судок: окремі ємності різної глибини, по одній на канал, стягнуті в одну стопку з однією ручкою', piece: tiffin },
  'alt-abacus-2': { of: 'i-abacus', idea: "Пучок різних інструментів (олівці, ручка, пензель, крейда), стягнутий одним ремінцем", piece: bundle },
  'alt-patchpanel-1': { of: 'i-patchpanel', idea: 'Дороговказ зі стрілками в усі боки: звідки приходять люди, найлюдніший напрям світиться', piece: fingerpost },
  'alt-patchpanel-2': { of: 'i-patchpanel', idea: 'Блок ротаметрів на одному колекторі: поплавок у кожній трубці показує, скільки йде цим входом', piece: rotameters },
};
