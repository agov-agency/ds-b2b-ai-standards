// Alternatives for the scenario figures "LinkedIn fit gate" (baggage) and "Signal loop" (analyzer).
import { kernel, hue, k, keys, f, EASY, IN, OUT, type Piece, type V3, type Ease } from '../iso';
import type { Alt } from './index';

const TAU = 2 * Math.PI, LIN: Ease = [0, 0, 1, 1];
const lit = (s: string, a = 1) => (a > .01 ? `<g class="lit"${a < .999 ? ` style="opacity:${f(a)}"` : ''}>${s}</g>` : '');
type KK = ReturnType<typeof kernel>;
// The screen outline of an axis box (its silhouette hexagon): clips what shows through an opening into that box
const slab = (K: KK, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
  'M' + ([[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y1, z1]] as V3[]).map((p) => K.P(...p).map(f).join(' ')).join('L') + 'Z';

// ── Shape sorter: LinkedIn fit gate. Blocks of three shapes rise onto the lid and slide over a triangular cut-out; only
// the triangle fits and drops through (live), the square and the round block ride on into the return hopper.
const sorter = (() => {
  const BZ = 12, ZT = BZ + 38, CY = 20, H = 12, XH = 22, XO = 80, XE = 138, STEP = 1.6;
  const SEQ = ['tri', 'sq', 'tri', 'rnd'], PERIOD = SEQ.length * STEP;
  const K = kernel([[-16, -16, 0], [204, -16, 0], [-16, 56, 0], [204, 56, 0], [122, 2, ZT + 26], [0, 0, ZT + 14]], 18);
  const { on, poly, line, box, prism, cyl, TOP, FRONT, SIDE } = K;
  const tri = (x: number, r: number): [number, number][] => [0, 1, 2].map((i) => [x + r * Math.cos(i * TAU / 3), CY + r * Math.sin(i * TAU / 3)]);
  // A block standing at x with its base at z; whatever is below the lid is inside the sorter and is not drawn
  function block(kind: string, x: number, z: number, top0 = 'paper') {
    const z0 = Math.max(z, ZT), h = z + H - z0;
    if (h < .05) return '';
    const top = z0 + h;
    if (kind === 'tri') return prism(tri(x, 8.7), z0, h, top0, 'body', 'tint') + poly(tri(x, 5.2).map(([a, b]) => [a, b, top] as V3), 'det');
    if (kind === 'sq') return box(x - 6, CY - 6, z0, 12, 12, h, 'paper', 'body', 'tint') + line([[x - 3.5, CY - 3.5, top], [x + 3.5, CY - 3.5, top], [x + 3.5, CY + 3.5, top], [x - 3.5, CY + 3.5, top], [x - 3.5, CY - 3.5, top]], 'det');
    return cyl(x, CY, z0, 6.8, h, 'paper', 'body') + line(K.ring(x, CY, top, 4), 'det');
  }
  // Block j, u seconds after it starts rising: up out of the hatch, over to the cut-out, then down it or on to the hopper
  function at(j: number, u: number) {
    const kind = SEQ[j % SEQ.length], fits = kind === 'tri';
    if (u < 0 || u > 3.3) return null;
    const z = ZT + keys(u, [[0, -H - 2, OUT], [.6, 0]]) + (fits ? keys(u, [[1.85, 0, IN], [2.25, -H - 2]]) : 0);
    const x = keys(u, fits ? [[.7, XH, EASY], [1.7, XO]] : [[.7, XH, EASY], [1.7, XO], [2.05, XO, EASY], [3.1, XE]]);
    return { kind, x, z, glow: fits ? k(u, 1.2, 1.75) : 0 };
  }
  function draw(t: number) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    const j = Math.floor(t / STEP), u = t - j * STEP;
    const bs = [0, 1, 2].map((b) => at(j - b + SEQ.length, u + b * STEP)).filter((b) => b !== null).sort((p, q) => p!.x - q!.x);
    let s = K.plinth(-16, -16, 220, 72);
    // The sorter: a body with seams and a sight panel, a lid with an overhang
    s += box(0, 0, BZ, 150, 40, ZT - 4 - BZ, 'paper', 'body', 'tint');
    s += on(FRONT(0, 40, ZT - 4), [30, 60, 90, 120].map((x) => `<line class="det" x1="${x}" y1="3" x2="${x}" y2="${ZT - 4 - BZ - 3}"/>`).join('') + `<rect class="det" x="8" y="7" width="16" height="10" rx="1"/>`);
    s += on(SIDE(150, 40, ZT - 4), `<rect class="det" x="6" y="6" width="28" height="${ZT - BZ - 16}" rx="1"/>`);
    s += box(-2, -2, ZT - 4, 154, 44, 4, 'paper', 'body', 'tint');
    // On the lid: the hatch the blocks rise from, the triangular cut-out with its lip, the back guide rail
    s += on(TOP(XH - 10, CY - 10, ZT), `<rect class="f blk" width="20" height="20"/>`);
    s += poly(tri(XO, 12.6).map(([a, b]) => [a, b, ZT] as V3), 'f tint') + poly(tri(XO, 10.4).map(([a, b]) => [a, b, ZT] as V3), 'f blk');
    s += box(0, 5, ZT, 122, 3, 3, 'paper', 'body');
    s += bs.map((b) => { return block(b!.kind, b!.x, b!.z) + lit(block(b!.kind, b!.x, b!.z, 'body'), b!.glow); }).join('');
    s += box(0, 32, ZT, 122, 3, 3, 'paper', 'body');
    // Return hopper on the lid's end, and the chute from it down into the reject bin on the bench
    s += box(122, 2, ZT, 28, 36, 24, 'paper', 'body', 'tint') + on(TOP(122, 2, ZT + 24), `<rect class="det" x="4" y="4" width="20" height="28" rx="1"/>`);
    s += box(164, 4, BZ, 32, 32, 16, 'tint', 'body', 'tint') + on(TOP(164, 4, BZ + 16), `<rect class="f paper" x="2.5" y="2.5" width="27" height="27"/><rect class="f tint" x="4" y="4" width="24" height="24"/>`);
    s += poly([[150, 10, ZT + 6], [176, 10, BZ + 22], [176, 30, BZ + 22], [150, 30, ZT + 6]], 'f tint') + poly([[150, 30, ZT + 6], [176, 30, BZ + 22], [176, 30, BZ + 26], [150, 30, ZT + 10]], 'f body');
    s += box(166, 26, BZ + 16, 3, 3, 4, 'paper', 'body');
    return hue('a', s);
  }
  return { aria: 'A shape sorter. Blocks of three shapes rise onto its lid and slide over a triangular cut-out; only the triangle drops through, the others ride on into the return hopper.', period: PERIOD, rest: 1.6 + 1.9, viewBox: K.viewBox, focus: [0.45, 0.5], draw } as Piece;
})();

// ── Grading rails: LinkedIn fit gate. Two rails spread apart; balls roll out of the hopper and each drops through the
// gap where it stops fitting, into its own hole; only the biggest rolls the whole way into the end box (live).
const rails = (() => {
  const BZ = 12, ZR = BZ + 44, CY = 22, XB = 152, XE = XB + 26, V = 40, G = 520, STEP = 2.2;
  const SIZES = [7, 5, 9], PERIOD = SIZES.length * STEP, X0 = -26;
  const gap = (x: number) => 6 + Math.max(0, Math.min(x, XB)) * 10 / XB;           // inner gap between the rails at x
  const dropX = (r: number) => (2 * r - 6) * XB / 10, fallT = Math.sqrt(2 * (ZR - BZ) / G);
  const HOLE = (r: number) => dropX(r) + V * fallT;                                // where a ball of radius r lands
  const K = kernel([[-40, -6, 0], [222, -6, 0], [-40, 52, 0], [222, 52, 0], [-36, CY - 18, ZR + 30], [XE + 30, CY - 17, ZR + 24]], 18);
  const { P, on, line, box, prism, TOP, FRONT, SIDE } = K;
  const ball = (x: number, z: number, r: number, cls = 'paper') => {
    const [sx, sy] = P(x, CY, z);
    return `<circle class="f ${cls}" cx="${f(sx)}" cy="${f(sy)}" r="${r}"/><path class="det" d="M${f(sx - r * .62)} ${f(sy - r * .1)}A${r * .7} ${r * .7} 0 0 1 ${f(sx + r * .1)} ${f(sy - r * .62)}"/>`;
  };
  const rail = (side: number) => {
    const e0 = CY + side * 3, e1 = CY + side * 8, w = side * 2.2;
    return prism([[0, e0], [XB, e1], [XB, e1 + w], [0, e0 + w]], ZR - 2.4, 2.4, 'paper', 'body') + prism([[XB, e1], [XE, e1], [XE, e1 + w], [XB, e1 + w]], ZR - 2.4, 2.4, 'paper', 'body');
  };
  const posts = (side: number) => [6, 104, XB + 10].map((x) => box(x - 1.5, CY + side * (gap(x) / 2 + 1.1) - 1.5, BZ, 3, 3, ZR - 2.4 - BZ, 'paper', 'body')).join('');
  // Ball j, u seconds after it leaves the back of the hopper: rolls, settles into the widening gap, drops or rolls on
  function at(j: number, u: number) {
    const r = SIZES[j % SIZES.length], x = X0 + V * u;
    if (u < 0) return null;
    const xd = r === 9 ? Infinity : dropX(r);
    if (x < xd) return x - r > XE + 4 ? null : { r, x, z: ZR + Math.sqrt(Math.max(0, r * r - gap(x) * gap(x) / 4)), hole: 0 };
    const τ = (x - xd) / V, z = ZR - G * τ * τ / 2;
    return z < BZ - r - 1 ? null : { r, x, z, hole: z < BZ + r + 3 ? HOLE(r) : 0 };
  }
  const MOUTH = [CY - 12, CY + 12, ZR - 4, ZR + 20];
  function draw(t: number) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    const j = Math.floor(t / STEP), u = t - j * STEP;
    const bs = [0, 1, 2].map((b) => at(j - b + SIZES.length, u + b * STEP)).filter((b) => b !== null).sort((p, q) => p!.x - q!.x);
    let s = K.plinth(-40, -6, 262, 58);
    // The two holes in the bench, one for each size that falls out
    for (const r of [5, 7]) { const w = 2 * r + 6, x = HOLE(r); s += on(TOP(x - w / 2 - 2, CY - w / 2 - 2, BZ), `<rect class="f tint" width="${w + 4}" height="${w + 4}"/><rect class="f blk" x="2" y="2" width="${w}" height="${w}"/>`); }
    // Hopper with spare balls on top, a mouth over the rails
    s += box(-36, CY - 18, BZ, 36, 36, ZR + 30 - BZ, 'paper', 'body', 'tint') + on(TOP(-36, CY - 18, ZR + 30), `<rect class="f tint" x="3" y="3" width="30" height="30"/>`);
    s += [[-26, CY - 6, 7], [-12, CY - 8, 5], [-18, CY + 6, 9], [-6, CY + 6, 7]].map(([x, y, r]) => { const [sx, sy] = P(x, y, ZR + 30); return `<circle class="f paper" cx="${f(sx)}" cy="${f(sy - r * .5)}" r="${r}"/>`; }).join('');
    s += on(SIDE(0, CY + 18, ZR + 30), `<rect class="f paper" x="${CY + 18 - MOUTH[1] - 3}" y="${ZR + 30 - MOUTH[3] - 3}" width="${MOUTH[1] - MOUTH[0] + 6}" height="${MOUTH[3] - MOUTH[2] + 3}"/><rect class="f blk" x="${CY + 18 - MOUTH[1]}" y="${ZR + 30 - MOUTH[3]}" width="${MOUTH[1] - MOUTH[0]}" height="${MOUTH[3] - MOUTH[2]}"/><rect class="det" x="6" y="6" width="24" height="12" rx="1"/>`);
    s += posts(-1) + rail(-1);
    s += bs.map((b, i) => {
      const g = b!.r === 9 ? ball(b!.x, b!.z, b!.r) + lit(ball(b!.x, b!.z, b!.r, 'body')) : ball(b!.x, b!.z, b!.r);
      if (b!.x - b!.r < 0) return `<clipPath id="a3-rm${i}"><path d="${slab(K, 0, 400, MOUTH[0], MOUTH[1], MOUTH[2], MOUTH[3])}"/></clipPath><g clip-path="url(#a3-rm${i})">${g}</g>`;
      if (b!.hole) { const w = b!.r + 3; return `<clipPath id="a3-rh${i}"><path d="${slab(K, b!.hole - w, b!.hole + w, CY - w, CY + w, BZ, 300)}"/></clipPath><g clip-path="url(#a3-rh${i})">${g}</g>`; }
      return g;
    }).join('');
    s += rail(1) + posts(1);
    // End box: the balls that fit all the way roll in through its back
    s += box(XE, CY - 17, BZ, 30, 34, ZR + 24 - BZ, 'paper', 'body', 'tint') + on(FRONT(XE, CY + 17, ZR + 24), `<rect class="det" x="5" y="6" width="20" height="14" rx="1"/>`) + on(TOP(XE, CY - 17, ZR + 24), `<rect class="det" x="4" y="4" width="22" height="26" rx="1"/>`);
    return hue('a', s);
  }
  return { aria: 'Two grading rails spread apart over a bench. Balls roll out of a hopper and each drops through the gap where it stops fitting; only the biggest rolls the whole way into the end box.', period: PERIOD, rest: 4.6, viewBox: K.viewBox, focus: [0.5, 0.5], draw } as Piece;
})();

// ── Dish field: Signal loop. Five dishes each listen to their own patch of sky while the sixth stays under its cover;
// two catch the signal (live) and hold, the other three swing round to try somewhere new.
const dishes = (() => {
  const BZ = 12, ZP = BZ + 24, R = 13, EL = .6, PERIOD = 8;
  const POS: [number, number][] = [[0, 0], [46, 0], [92, 0], [0, 52], [46, 52], [92, 52]];
  const AZ = [1.2, -.3, 2.5, -.3, -2.2, 0], HIT = [1, 3], CTRL = 5;
  const SRC = (i: number): V3 => { const n = nrm(AZ[i], EL), [x, y] = POS[i]; return [x + 92 * n[0], y + 92 * n[1], ZP + 92 * n[2]]; };
  const nrm = (az: number, el: number): V3 => [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
  const K = kernel([[-26, -26, 0], [118, -26, 0], [-26, 78, 0], [118, 78, 0], SRC(1), SRC(3)], 18);
  const { P, on, poly, line, box, cyl, TOP } = K;
  const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
  function dish(i: number, az: number, el: number, glow: number) {
    const [px, py] = POS[i], n = nrm(az, el), u: V3 = [-Math.sin(az), Math.cos(az), 0], v: V3 = [-Math.sin(el) * Math.cos(az), -Math.sin(el) * Math.sin(az), Math.cos(el)];
    const piv: V3 = [px, py, ZP], c = add(piv, n, 5), horn = add(c, n, 11);
    const rim = (o: V3, r: number, m = 40) => Array.from({ length: m + 1 }, (_, q) => { const a = q * TAU / m; return add(add(o, u, r * Math.cos(a)), v, r * Math.sin(a)); });
    const facing = n[0] + n[1] + n[2] > 0;
    let s = box(px - 6, py - 6, BZ, 12, 12, 3, 'paper', 'body', 'tint') + cyl(px, py, BZ + 3, 2.4, ZP - BZ - 6, 'paper', 'body') + cyl(px, py, ZP - 3, 4, 3, 'paper', 'body');
    const arm = line([piv, add(c, n, -2.5)], 'tube-o') + line([piv, add(c, n, -2.5)], 'tube-i');
    if (i === CTRL) {
      // Under its cover: a domed canvas cap pointing straight up, two straps over it
      const top = add(c, [0, 0, 1], 3);
      return s + arm + poly(rim(add(c, n, -2.5), R * .96), 'f body') + poly(rim(c, R), 'f body') + poly(rim(top, R * .7), 'f tint') +
        line([add(c, u, R), add(top, u, R * .7), add(top, u, -R * .7), add(c, u, -R)], 'det') + line([add(c, v, R), add(top, v, R * .7), add(top, v, -R * .7), add(c, v, -R)], 'det');
    }
    const [hx, hy] = P(...horn);
    const feed = [1, 5, 9].map((q) => line([rim(c, R * .92, 12)[q], horn], 'det')).join('') + `<circle class="f body" cx="${f(hx)}" cy="${f(hy)}" r="2.4"/>`;
    const face = poly(rim(c, R), facing ? 'f paper' : 'f tint') + (facing ? line(rim(c, R * .62), 'det') + line(rim(c, R * .3), 'det') : '');
    const hot = lit(poly(rim(c, R), 'f body') + line(rim(c, R * .62), 'det') + `<circle class="f body" cx="${f(hx)}" cy="${f(hy)}" r="2.4"/>`, glow);
    if (facing) return s + arm + poly(rim(add(c, n, -2.5), R * .96), 'f body') + face + hot + feed;
    return s + feed + face + poly(rim(add(c, n, -2.5), R * .96), 'f body') + poly(rim(add(c, n, -3.5), 4.2), 'f paper') + arm;
  }
  function draw(t: number) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    const glow = k(t, 1, 1.9) * (1 - k(t, 6.6, 7.7));
    let s = K.plinth(-26, -26, 144, 104);
    // Cables in the bench from every dish to the receiver in the middle
    s += POS.map(([x, y]) => line([[x, y, BZ], [x, 26, BZ], [46, 26, BZ]], 'det')).join('');
    s += box(38, 20, BZ, 16, 12, 9, 'paper', 'body', 'tint') + on(TOP(38, 20, BZ + 9), `<rect class="det" x="2" y="2" width="12" height="8" rx="1"/>`);
    const order = POS.map((_, i) => i).sort((p, q) => POS[p][0] + POS[p][1] - POS[q][0] - POS[q][1]);
    s += order.map((i) => {
      if (i === CTRL) return dish(i, 0, Math.PI / 2, 0);
      if (HIT.includes(i)) return dish(i, AZ[i], EL, glow);
      const q = [0, 2, 4].indexOf(i), turn = keys(t, [[3.1 + q * .35, 0, EASY], [5.9 + q * .35, TAU]]);
      return dish(i, AZ[i] + turn, EL, 0);
    }).join('');
    return hue('a', s);
  }
  return { aria: 'A field of six dish antennas. Five listen to different patches of sky and one stays under its cover; two catch the signal and hold, the other three swing round to try somewhere new.', period: PERIOD, rest: 2.4, viewBox: K.viewBox, focus: [0.45, 0.55], draw } as Piece;
})();

// ── Tuning forks: Signal loop. A mallet runs along a sounding box and taps five forks while the sixth wears a damper;
// two ring (live), the three that stayed silent sink into the box and fresh ones rise in their slots for next week.
const forks = (() => {
  const BZ = 12, ZB = BZ + 14, FY = 12, PERIOD = 8, N = 6, CTRL = 5, HIT = [1, 3];
  const XF = (i: number) => 18 + i * 27, XL = -2, XR = 170, T0 = .8, T1 = 4.8;
  const K = kernel([[-12, -6, 0], [184, -6, 0], [-12, 48, 0], [184, 48, 0], [0, FY, ZB + 46], [170, FY, ZB + 46]], 18);
  const { on, line, box, cyl, cylY, TOP, FRONT, SIDE } = K;
  // Parts below the box top are inside the box: cut boxes and cylinders at z = ZB
  const cbox = (x: number, y: number, z: number, w: number, d: number, h: number, ...c: string[]) => z + h <= ZB + .05 ? '' : box(x, y, Math.max(z, ZB), w, d, z + h - Math.max(z, ZB), ...c);
  const ccyl = (x: number, y: number, z: number, r: number, h: number, ...c: string[]) => z + h <= ZB + .05 ? '' : cyl(x, y, Math.max(z, ZB), r, z + h - Math.max(z, ZB), ...c);
  const prong = (x: number, z: number, c = 'paper') => cbox(x, FY - 1, z + 13, 2.2, 2, 26, c, 'body', c === 'paper' ? 'tint' : c);
  function fork(x: number, z: number, dx: number, damper: boolean) {
    let s = cbox(x - 6, FY - 3, z, 12, 6, 4, 'paper', 'body', 'tint') + ccyl(x, FY, z + 4, 1.4, 6, 'paper', 'body') + cbox(x - 5, FY - 1, z + 10, 10, 2, 3, 'paper', 'body', 'tint');
    s += prong(x - 5 - dx, z) + prong(x + 2.8 + dx, z);
    if (damper) s += box(x - 6.5, FY - 2.2, z + 22, 13, 4.4, 7, 'paper', 'body', 'body') + on(FRONT(x - 6.5, FY + 2.2, z + 29), `<line class="det" x1="3" y1="0" x2="3" y2="7"/><line class="det" x1="10" y1="0" x2="10" y2="7"/>`) + cyl(x, FY - 2.2 - 1, z + 25.5, 1.2, 0, 'paper', 'body');
    return s;
  }
  // Rings of sound off both prong tips, spreading while the fork rings
  const waves = (x: number, t: number) => [0, 1, 2].map((q) => {
    const r = 3 + ((t * 14 + q * 5) % 15), a = .7, o = 1 - r / 19;
    return [1, -1].map((sd) => `<path class="det" style="opacity:${f(o)}" d="M${f(sd * (5 + r * Math.cos(a)))} ${f(-r * Math.sin(a))}A${f(r)} ${f(r)} 0 0 ${sd > 0 ? 1 : 0} ${f(sd * (5 + r * Math.cos(a)))} ${f(r * Math.sin(a))}"/>`).join('');
  }).join('');
  function draw(t: number) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    const cx = keys(t, [[T0, XL, LIN], [T1, XR], [5.3, XR, EASY], [7.4, XL]]);
    let s = K.plinth(-12, -6, 196, 54);
    // Sounding box with its slots and the sound hole in its end
    s += box(0, 0, BZ, 170, 24, ZB - BZ, 'paper', 'body', 'tint') + on(SIDE(170, 24, ZB), `<rect class="f blk" x="7" y="4" width="10" height="6" rx="1"/>`) + on(FRONT(0, 24, ZB), `<rect class="det" x="4" y="3" width="162" height="8" rx="1"/>`);
    for (let i = 0; i < N; i++) s += on(TOP(XF(i) - 6.5, FY - 3.5, ZB), `<rect class="f blk" width="13" height="7"/>`);
    let ring = '';
    for (let i = 0; i < N; i++) {
      const x = XF(i), ti = T0 + (x - XL) / (XR - XL) * (T1 - T0), d = Math.max(0, t - ti);
      if (i === CTRL) { s += fork(x, ZB, 0, true); continue; }
      if (HIT.includes(i)) {
        const env = t < ti ? 0 : Math.exp(-d / 2.2) * (1 - k(t, 6.4, 7.6)), dx = .6 * env * Math.sin(t * 70);
        s += fork(x, ZB, dx, false) + lit(prong(x - 5 - dx, ZB, 'body') + prong(x + 2.8 + dx, ZB, 'body'), Math.min(1, env * 1.5));
        ring += lit(on(FRONT(x, FY + 1, ZB + 37), waves(x, t)), env);
        continue;
      }
      // A silent fork: a short knock when the mallet passes, then down into the box, and a fresh one comes up
      const dx = t < ti ? 0 : .5 * Math.exp(-d / .1) * Math.sin(t * 70), z = ZB + keys(t, [[5.1, 0, IN], [5.7, -42, OUT], [6.3, -42, EASY], [7.1, 0]]);
      s += fork(x, z, dx, false);
    }
    s += ring;
    // Rail and the mallet carriage in front of the box
    s += box(-8, 30, BZ, 186, 4, 3, 'paper', 'body');
    s += box(cx - 7, 28, BZ + 3, 14, 8, 6, 'paper', 'body', 'tint') + cyl(cx, 32, BZ + 9, 1.6, 27, 'paper', 'body') + cylY(FY + 6, 31, cx, BZ + 38, 1, 'paper', 'body') + cylY(FY + 1.4, FY + 6, cx, BZ + 38, 3, 'paper', 'body');
    return hue('a', s);
  }
  return { aria: 'Six tuning forks on a sounding box. A mallet runs along and taps five while the sixth wears a damper; two ring, the three that stayed silent sink into the box and fresh ones rise in their slots.', period: PERIOD, rest: 4.4, viewBox: K.viewBox, focus: [0.5, 0.5], draw } as Piece;
})();

export const ALTS: Record<string, Alt> = {
  'alt-baggage-1': { of: 'baggage', idea: 'Сортер фігур: на кришці один трикутний виріз, крізь нього падає лише трикутник, решта їде у повернення', piece: sorter },
  'alt-baggage-2': { of: 'baggage', idea: 'Калібрувальні рейки, що розходяться: кожна куля випадає там, де перестає пасувати, до кінця доїжджає лише потрібна', piece: rails },
  'alt-analyzer-1': { of: 'analyzer', idea: 'Поле тарілок-антен: п\'ять слухають різне небо, шоста під чохлом як контроль; дві, що впіймали сигнал, тримають курс, решта шукає далі', piece: dishes },
  'alt-analyzer-2': { of: 'analyzer', idea: 'Камертони на резонаторі: молоточок простукує п\'ять, шостий у демпфері; відгукуються два, мовчазні йдуть у скриньку і їх змінюють нові', piece: forks },
};
