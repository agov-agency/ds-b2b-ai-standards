// Alternatives for the scenario figures pumpjack ("Turn social signals into pipeline") and burnin ("Weekly check for
// conversion campaigns"). Each is a different machine for the same point; preview on /art-alts.
import type { Alt } from './index';
import { kernel, hue, k, keys, spring, lerp, f, IN, EASY, type Piece, type V3 } from '../iso';

const TAU = 2 * Math.PI;
type P2 = [number, number];
const lit = (s: string, a = 1) => (a > .01 ? `<g class="lit" style="opacity:${f(Math.min(1, a))}">${s}</g>` : '');
const wrap = (t: number, p: number) => ((t % p) + p) % p;
const hull = (ps: P2[]) => {
  const p = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (q: P2[]) => q.reduce<P2[]>((h, v) => { while (h.length > 1 && cr(h[h.length - 2], h[h.length - 1], v) <= 0) h.pop(); h.push(v); return h; }, []);
  return [...half(p).slice(0, -1), ...half(p.reverse()).slice(0, -1)];
};
const pathOf = (ps: P2[]) => `M${ps.map((p) => p.map(f).join(' ')).join('L')}Z`;

// ── Shishi-odoshi: pumpjack's point (each company fills on its own, only a full one reaches the pipeline). Three bamboo
// rockers each fill from their own spout, tip when full, pour into the shared channel and swing back; the full rocker is live.
const shishi = (() => {
  const PERIOD = 8, N = 3, ROW = 52, PX = 46, PZ = 50, LB = 34, LM = 32, R = 5.5, A0 = .9, A1 = -.6, MX = 72, D = 166, YE = D + 26;
  const K = kernel([[0, 0, 0], [104, 0, 0], [0, D, 0], [104, D, 0], [MX, YE, 0], [92, 10, 96], [10, 10, 60]], 22);
  const { P, poly, line, box, cyl, cylX, cylY, prism, plinth, on, TOP, arrow } = K;
  const plate = (pts: P2[], y0: number, y1: number, face = 'paper', side = 'body') => {
    let s = '';
    pts.forEach((a, i) => {
      const b = pts[(i + 1) % pts.length], nx = b[1] - a[1], nz = a[0] - b[0];
      if (nx + nz > 0) s += poly([[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], `f ${side}`);
    });
    return s + poly(pts.map(([x, z]) => [x, y1, z] as V3), `f ${face}`);
  };
  // A round tube lying in the x-z plane at y = 0, from a to b: its outline, bamboo node rings, the open mouth at b
  const ringAt = (c: P2, dx: number, dz: number, r: number, a0 = 0, a1 = TAU, n = 24) =>
    Array.from({ length: n + 1 }, (_, i) => { const q = a0 + (a1 - a0) * i / n; return [c[0] - dz * r * Math.sin(q), r * Math.cos(q), c[1] + dx * r * Math.sin(q)] as V3; });
  function tube(a: P2, b: P2, lvl: number) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), dx = (b[0] - a[0]) / L, dz = (b[1] - a[1]) / L;
    const ends = [...ringAt(a, dx, dz, R), ...ringAt(b, dx, dz, R)].map((p) => P(...p) as P2);
    const qc = Math.atan2(dx - dz, 1);
    let s = `<path class="f body" d="${pathOf(hull(ends))}"/>`;
    for (const u of [.3, .62]) s += line(ringAt([lerp(a[0], b[0], u), lerp(a[1], b[1], u)], dx, dz, R, qc - Math.PI / 2, qc + Math.PI / 2, 12), 'det');
    s += poly(ringAt(b, dx, dz, R), 'f paper') + poly(ringAt(b, dx, dz, R * .72), 'f blk');
    if (lvl > .02) s += poly(ringAt(b, dx, dz, R * .72 * lvl), 'f body');
    return s;
  }
  function station(u: number) {
    const fill = Math.min(1, u / 5.2), tipT = 5.2, back = 6.6;
    const ang = u < back ? keys(u, [[tipT, A0, IN], [tipT + .45, A1]]) : spring(u, back, A1, A0, { pace: .7 });
    const lvl = fill * (1 - k(u, 5.5, 6.5)), down = (A0 - ang) / (A0 - A1), pour = k(u, 5.45, 5.7) * (1 - k(u, 6.2, 6.6));
    const a: P2 = [PX - LB * Math.cos(ang), PZ - LB * Math.sin(ang)], b: P2 = [PX + LM * Math.cos(ang), PZ + LM * Math.sin(ang)];
    const leg = (y0: number, y1: number) => plate([[PX - 14, 12], [PX - 10, 12], [PX + 1, PZ - 2], [PX - 1, PZ - 2]], y0, y1) + plate([[PX + 10, 12], [PX + 14, 12], [PX + 1, PZ - 2], [PX - 1, PZ - 2]], y0, y1);
    let s = leg(-10, -7);
    // The stone the heavy end knocks back onto
    s += prism([[18, -5], [27, -6], [31, 1], [25, 6], [17, 3]], 12, 6, 'paper', 'body', 'tint');
    const tb = tube(a, b, lvl);
    s += tb + lit(tb, lvl > .8 ? (lvl - .8) / .15 : Math.min(1, down * 2));
    s += cylY(-10, 10, PX, PZ, 1.8, 'paper', 'body');
    // The pour from the tipped mouth into the channel
    if (pour > .01) s += `<g style="opacity:${f(pour)}">${line([[b[0] + 3, 0, b[1] - 2], [MX - 1, 0, 19]], 'flow')}</g>`;
    s += leg(7, 10);
    // Spout over the mouth: a post standing right of the channel, the water falling into the rocker or past it into the channel
    s += cyl(92, 0, 12, 3, 78, 'paper', 'body') + cylX(64, 92, 0, 87, 2.2, 'paper', 'body') + cyl(92, 0, 90, 3.6, 2, 'paper', 'body');
    s += line([[65.5, 0, 84.8], [65.5, 0, lerp(b[1] + R, 19, down)]], 'flow');
    return { s, pour };
  }
  function draw(t: number) {
    t = wrap(t, PERIOD);
    let s = plinth(0, 0, 104, D), main = 0;
    // The shared channel along the side, out past the plinth
    s += box(MX - 10, 4, 12, 20, YE - 4, 7, 'paper', 'body', 'tint') + on(TOP(MX - 10, 4, 19), `<rect class="f tint" x="3" y="0" width="14" height="${YE - 4}"/>`);
    const rows = Array.from({ length: N }, (_, i) => station(wrap(t - i * PERIOD / N, PERIOD)));
    main = Math.max(...rows.map((r) => r.pour));
    if (main > .01) s += `<g style="opacity:${f(main)}">${line([[MX, 20, 19], [MX, YE, 19]], 'flow')}</g>`;
    rows.forEach((r, i) => { const [dx, dy] = K.D(0, 24 + i * ROW, 0); s += `<g transform="translate(${f(dx)} ${f(dy)})">${r.s}</g>`; });
    return hue('a', s) + arrow([[MX, YE - 8, 30], [MX, YE + 22, 30]], { dot: true });
  }
  const piece: Piece = {
    aria: 'Three bamboo rockers each fill from their own spout; a full one tips, pours into the shared channel along the side and swings back onto its stone.',
    period: PERIOD, rest: 5.9, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  };
  return piece;
})();

// ── Ropewalk twister: pumpjack's point (thin signals from many companies become one line to sales). Four bobbins pay
// out strands into a spinning head that twists them into one rope, wound onto the drum; the rope and drum are live.
const ropewalk = (() => {
  const PERIOD = 8, BY = [20, 43, 66, 89], HX = 74, HY = 52, HZ = 40, DX = 120, DZ = 36, DR = 12;
  const K = kernel([[0, 0, 0], [140, 0, 0], [0, 100, 0], [140, 100, 0], [DX, 30, DZ + DR + 30], [18, 20, 50]], 22);
  const { P, line, box, cyl, cylY, plinth, on, SIDE, FRONT, TOP, arrow } = K;
  function bobbin(y: number, a: number) {
    let s = cyl(18, y, 18, 8, 2, 'paper', 'body') + cyl(18, y, 20, 6.2, 15, 'tint', 'tint');
    for (const z of [23, 26.5, 30, 33.5]) s += line(K.ring(18, y, z, 6.2, -Math.PI / 4, 3 * Math.PI / 4, 12), 'det');
    s += cyl(18, y, 35, 8, 2, 'paper', 'body');
    const [cx, cy] = P(18, y, 37);
    return s + `<path class="det" d="M${f(cx)} ${f(cy)}L${f(cx + 6 * Math.cos(a))} ${f(cy + 3 * Math.sin(a))}"/><ellipse class="f blk" cx="${f(cx)}" cy="${f(cy)}" rx="1.6" ry=".8"/>`;
  }
  function draw(t: number) {
    t = wrap(t, PERIOD);
    const w = TAU * t / PERIOD;
    let s = plinth(0, 0, 140, 100);
    // Creel: the bench of bobbins at the back, one per company, each paying out its strand
    s += box(8, 6, 12, 20, 90, 6, 'paper', 'body', 'tint');
    BY.forEach((y, i) => { s += bobbin(y, 2 * w + i * 1.3); });
    BY.forEach((y) => { s += line([[24, y, 28], [HX - 4, HY, HZ]], 'f'); });
    // Twisting head: a post with a spinning faceplate, the strands go in at the back, one rope comes out of the eye
    s += box(HX - 8, HY - 6, 12, 8, 12, 42, 'paper', 'body', 'tint');
    const sp = [0, 1, 2].map((q) => { const b = 4 * w + q * TAU / 3; return `M${f(6 + 1.8 * Math.cos(b))} ${f(14 + 1.8 * Math.sin(b))}L${f(6 + 5 * Math.cos(b))} ${f(14 + 5 * Math.sin(b))}`; }).join('');
    s += on(SIDE(HX, HY + 6, HZ + 14), `<circle class="f paper" cx="6" cy="14" r="5.6"/><path class="det" d="${sp}"/><circle class="f blk" cx="6" cy="14" r="1.6"/>`);
    // Drum stands, then the rope and the drum it winds onto (live), the front stand with its turning crank
    s += box(DX - 7, 26, 12, 14, 6, DZ - 12 + 3, 'paper', 'body', 'tint');
    const a = P(HX, HY, HZ), b = P(DX - 1.5, HY, DZ + DR - .5), L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, H = 2.2;
    const rope = `<path class="f body" d="M${f(a[0] - uy * H)} ${f(a[1] + ux * H)}L${f(b[0] - uy * H)} ${f(b[1] + ux * H)}L${f(b[0] + uy * H)} ${f(b[1] - ux * H)}L${f(a[0] + uy * H)} ${f(a[1] - ux * H)}Z"/>`;
    const twist = Array.from({ length: 10 }, (_, j) => (j + 8 * t / PERIOD) % 10 / 10).filter((u) => u > .04 && u < .96).map((u) => {
      const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
      return `M${f(x - uy * H - ux * 1.6)} ${f(y + ux * H - uy * 1.6)}L${f(x + uy * H + ux * 1.6)} ${f(y - ux * H + uy * 1.6)}`;
    }).join('');
    let drum = cylY(34, 70, DX, DZ, DR, 'paper', 'body');
    for (let j = 0; j < 8; j++) {
      const q = wrap(-2 * w + j * TAU / 8 + Math.PI, TAU) - Math.PI;
      if (q > -Math.PI / 4 + .05 && q < 3 * Math.PI / 4 - .05) drum += line([[DX + DR * Math.cos(q), 35, DZ + DR * Math.sin(q)], [DX + DR * Math.cos(q), 69, DZ + DR * Math.sin(q)]], 'det');
    }
    drum += on(FRONT(DX, 70, DZ), `<circle class="det" r="${DR * .55}"/><circle class="f blk" r="2"/>`);
    s += lit(drum + rope + `<path class="det" d="${twist}"/>`);
    s += box(DX - 7, 72, 12, 14, 6, DZ - 12 + 3, 'paper', 'body', 'tint') + cylY(70, 80, DX, DZ, 2, 'paper', 'body');
    const c = P(DX, 80, DZ), ca = -2 * w;
    s += `<path class="f paper" d="M${f(c[0])} ${f(c[1])}l${f(10 * Math.cos(ca) * .87)} ${f(10 * Math.sin(ca) - 10 * Math.cos(ca) * .5)}"/>`;
    const [kx, ky] = [c[0] + 10 * Math.cos(ca) * .87, c[1] + 10 * Math.sin(ca) - 10 * Math.cos(ca) * .5];
    s += `<circle class="f paper" cx="${f(kx)}" cy="${f(ky)}" r="2.2"/>`;
    s += on(TOP(8, 6, 18), '<path class="det" d="M3 4H17M3 86H17"/>');
    return hue('a', s) + arrow(K.curve([HX + 4, HY, HZ + 16], [96, HY, HZ + 34], [DX - 6, HY, DZ + DR + 14]), { dot: true });
  }
  const piece: Piece = {
    aria: 'A rope-making twister. Four bobbins pay out strands into a spinning head that twists them into one rope, wound onto a drum.',
    period: PERIOD, rest: 3, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  };
  return piece;
})();

// ── Key duplicator: burnin's point (the ad that works is copied). The best key is clamped on the left; a tracer follows
// its teeth while the cutter cuts each blank dropped from the magazine to the same profile; copies slide off into the bin.
const duplicator = (() => {
  const PERIOD = 8, CYC = 4, KZ = 44.6, KY = 18, YC = KY + 36, MX0 = 40, BX0 = 72, TRAVEL = 30, OUT = 112;
  const K = kernel([[10, 0, 0], [120, 0, 0], [10, 162, 0], [120, 162, 0], [94, 24, 94], [24, 54, 66]], 22);
  const { P, poly, box, cyl, cylY, plinth, on, TOP, FRONT, arrow } = K;
  const NOTCH: [number, number][] = [[4, 2.6], [10, 1.2], [16, 3], [22, 1.6], [27, 2.4]];
  const depth = (v: number) => (v < 0 || v > 30 ? 0 : Math.max(0, ...NOTCH.map(([c, d]) => Math.min(d, 1.2 * d - Math.abs(v - c) * .9))));
  // A flat key in its own top plane, bow at the origin, teeth on its +x edge, cut to the master profile from v0 to the tip
  function key(v0: number) {
    const edge: P2[] = [];
    for (let v = 30; v >= 0; v -= .5) edge.push([4 - (v >= v0 ? depth(v) : 0), 6 + v]);
    const blade: P2[] = [[-4, 5], [-4, 36], [-1.5, 40], [2, 40], [4, 37], ...edge];
    return `<path class="f paper" d="${pathOf(blade)}"/><path class="det" d="M-1.2 8V35"/><circle class="f paper" r="7"/><circle class="f blk" cy="-2.5" r="2"/>`;
  }
  // Drawn twice, 1.6 apart, so its thickness shows as an edge
  const keyAt = (x: number, y: number, z: number, v0: number) => on(TOP(x, y, z - 1.6), key(v0).replace(/f (paper|blk)/g, 'f body')) + on(TOP(x, y, z), key(v0));
  const mouth = [[62, 102, 200], [84, 102, 200], [84, 102, 26], [84, 156, 26], [62, 156, 26], [62, 156, 200]].map(([x, y, z]) => P(x, y, z).map(f).join(' ')).join('L');
  function draw(t: number) {
    t = wrap(t, PERIOD);
    const c = t % CYC;
    // Cut on the way out (tip first), copy off the front, carriage back empty for the next blank
    const cy = TRAVEL * keys(c, [[.6, 0, EASY], [2.6, 1], [3.3, 1, EASY], [3.9, 0]]), v = TRAVEL - cy, cx = depth(v);
    const v0 = c < .6 ? 31 : c < 2.6 ? v : 0;
    let s = plinth(10, 0, 110, 162);
    s += box(20, 6, 12, 92, 94, 16, 'paper', 'body', 'tint') + on(TOP(20, 6, 28), '<path class="det" d="M16 4V90M56 4V90"/>');
    // Bin at the front for the copies: inside first, the walls after the falling key
    s += box(62, 102, 12, 22, 54, 14, 'paper', 'body', 'tint') + on(TOP(62, 102, 26), '<rect class="f blk" x="2.5" y="2.5" width="17" height="49"/>');
    s += box(20, YC - 5, 28, 8, 10, 38, 'paper', 'body', 'tint');
    // Carriage with its two vises, the master key (live) and the blank being cut
    s += box(30 + cx, KY - 8 + cy, 28, 50, 56, 6, 'paper', 'body', 'tint');
    s += box(34 + cx, KY - 4 + cy, 34, 9, 48, 9, 'paper', 'body', 'tint') + box(66 + cx, KY - 4 + cy, 34, 9, 48, 9, 'paper', 'body', 'tint');
    s += lit(keyAt(MX0 + cx, KY + cy, KZ, 0));
    if (c < 2.75) s += keyAt(BX0 + cx, KY + cy, KZ + 36 * keys(c, [[0, 1, IN], [.45, 0]]), v0);
    else {
      // The copy slides off the front and drops into the bin; below the rim only what shows through its mouth is drawn
      const sl = keys(c, [[2.75, 0, IN], [3.25, 1]]), z = KZ - 40 * keys(c, [[3.15, 0, IN], [3.5, 1]]);
      const g = keyAt(BX0, lerp(KY + TRAVEL, OUT, sl), z, 0);
      s += z < 26 ? `<clipPath id="s4-bin"><path d="M${mouth}Z"/></clipPath><g clip-path="url(#s4-bin)">${g}</g>` : g;
    }
    // Tracer arm and pin over the master's teeth
    s += box(24, YC - 3, 62, 23, 6, 4, 'paper', 'body', 'tint') + cyl(45.3, YC, KZ, 1.3, 18, 'paper', 'body');
    // Motor housing, the cutter on its front (teeth turning), the blank magazine hung off its side
    s += box(86, 24, 28, 18, 28, 64, 'paper', 'body', 'tint') + on(FRONT(86, 52, 92), '<path class="det" d="M4 8H14M4 11H14M4 14H14"/><rect class="f blk" x="6" y="54" width="6" height="3" rx=".5"/>');
    const spin = TAU * 4 * c / CYC;
    const teeth = Array.from({ length: 12 }, (_, j) => { const b = spin + j * TAU / 12; return `M${f(7.2 * Math.cos(b))} ${f(7.2 * Math.sin(b))}L${f(9 * Math.cos(b + .12))} ${f(9 * Math.sin(b + .12))}`; }).join('');
    s += cylY(YC - 1.5, YC + 1.5, 85, KZ - 1, 9, 'paper', 'body') + on(FRONT(85, YC + 1.5, KZ - 1), `<path class="det" d="${teeth}"/><circle class="det" r="4"/><circle class="f blk" r="1.4"/>`);
    s += box(64, 8, 80, 22, 52, 12, 'paper', 'body', 'tint') + on(FRONT(64, 60, 92), '<rect class="f blk" x="4" y="10" width="14" height="2" rx=".5"/>');
    // The bin's front walls
    s += poly([[62, 156, 12], [84, 156, 12], [84, 156, 26], [81.5, 153.5, 26], [64.5, 153.5, 26], [62, 156, 26]], 'f tint') +
      poly([[84, 102, 12], [84, 156, 12], [84, 156, 26], [81.5, 153.5, 26], [81.5, 104.5, 26], [84, 102, 26]], 'f body');
    return hue('a', s) + arrow(K.curve([MX0 + 2, 74, 54], [56, 76, 70], [BX0 - 2, 74, 54]), { dot: true });
  }
  const piece: Piece = {
    aria: 'A key duplicator. The best key is clamped on the left; a tracer follows its teeth while the cutter cuts each new blank to the same profile, and the copies drop into the bin.',
    period: PERIOD, rest: 1.9, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  };
  return piece;
})();

// ── Capsule machines: burnin's point (the ad that spends without converting is cut, its budget goes to the best). Coins
// roll from the tube along the counter groove into three machines; the empty one eats two coins, gets its slot shuttered
// and its coins roll on to the best machine. Capsules roll off to the basket; the shutter and the best machine's capsules are live.
const capsules = (() => {
  const PERIOD = 8, MX = [30, 78, 126], GY = 60, TZ = 36, CR = 4.5, V = 70, X0 = 16, DUD = 1, BEST = 2, TY = 78, BX = 152;
  const K = kernel([[0, 0, 0], [178, 0, 0], [0, 96, 0], [178, 96, 0], [30, 40, 82], [126, 40, 82]], 22);
  const { P, poly, box, cyl, plinth, on, TOP, FRONT, arrow } = K;
  const COINS = Array.from({ length: 8 }, (_, j) => ({ t0: .2 + j, to: j % 3 === DUD && j > 4 ? BEST : j % 3 }));
  const dropAt = (c: { t0: number; to: number }) => c.t0 + (MX[c.to] - X0) / V;
  const shut = (t: number) => (t < 1 ? 1 - k(t, .2, .7) : k(t, 5.1, 5.6));
  const SEEDS: P2[] = [[-7, 6], [0, 7.5], [7, 6], [-10, 0], [-3.5, 1.5], [3.5, 1], [10, .5], [-6, -5], [1, -5.5], [8, -4.5]];
  function machine(i: number, crank: number) {
    const x = MX[i];
    let s = box(x - 10, 30, TZ, 20, 20, 12, 'paper', 'body', 'tint') + cyl(x, 40, TZ + 12, 9, 3, 'paper', 'body');
    s += on(FRONT(x - 10, 50, TZ + 12), `<rect class="f blk" x="7" y="7.5" width="6" height="2" rx=".5"/>`);
    const [gx, gy] = P(x, 40, TZ + 30);
    s += `<circle class="f paper" cx="${f(gx)}" cy="${f(gy)}" r="14"/>`;
    if (i !== DUD) for (const [u, w] of SEEDS) s += `<g transform="translate(${f(gx + u)} ${f(gy + w)})"><circle class="f paper" r="3"/><path class="f body" d="M-3 0A3 3 0 0 0 3 0Z"/></g>`;
    s += `<path class="det" d="M${f(gx - 9)} ${f(gy - 5)}A10 10 0 0 1 ${f(gx - 3)} ${f(gy - 10.5)}"/>` + cyl(x, 40, TZ + 43, 5, 3, 'paper', 'body');
    // Crank on the pedestal front: one turn per coin
    const [cx, cy] = P(x, 50, TZ + 5);
    s += `<circle class="f paper" cx="${f(cx)}" cy="${f(cy)}" r="4"/><path class="f paper" d="M${f(cx - 4.2 * Math.cos(crank))} ${f(cy - 4.2 * Math.sin(crank))}L${f(cx + 4.2 * Math.cos(crank))} ${f(cy + 4.2 * Math.sin(crank))}"/>`;
    return s;
  }
  // Where a capsule is, 0 s after it leaves machine i: out of the chute, down into the trough, along it, into the basket
  function capsule(i: number, u: number): V3 | null {
    const x0 = MX[i];
    if (u < 0) return null;
    if (u < .35) { const e = keys(u, [[0, 0, IN], [.35, 1]]); return [x0, lerp(70, TY, e), lerp(24, 18, e)]; }
    const w = u - .35, d = 50 * w + 30 * w * w, L = BX + 6 - x0;
    if (d < L) return [x0 + d, TY, 18];
    const wd = w - (Math.sqrt(2500 + 120 * L) - 50) / 60, z = 18 - 120 * wd * wd - 30 * wd;
    return z < 2 ? null : [BX + 6 + 20 * wd, TY, z];
  }
  function draw(t: number) {
    t = wrap(t, PERIOD);
    let s = plinth(0, 0, 178, 96);
    s += box(6, 24, 12, 144, 46, TZ - 12, 'paper', 'body', 'tint');
    s += on(TOP(6, 24, TZ), `<rect class="f tint" x="0" y="${GY - 27}" width="144" height="6"/>` + MX.map((x) => `<rect class="f blk" x="${x - 6 - 5}" y="${GY - 25}" width="10" height="2" rx=".5"/>`).join(''));
    MX.forEach((x) => { s += on(FRONT(x - 6, 70, 28), '<rect class="f tint" width="12" height="10" rx=".8"/><rect class="f blk" x="2" y="6" width="8" height="3" rx=".5"/>'); });
    // Trough along the front and the basket at its end: back and floor first
    s += box(6, TY - 6, 12, BX - 6, 12, 2, 'paper', 'body', 'tint') + poly([[6, TY - 6, 14], [BX, TY - 6, 14], [BX, TY - 6, 20], [6, TY - 6, 20]], 'f paper');
    s += box(BX, TY - 12, 0, 22, 24, 22, 'paper', 'body', 'tint') + on(TOP(BX, TY - 12, 22), '<rect class="f blk" x="2.5" y="2.5" width="17" height="19"/>');
    // Machines, each cranked one turn after a coin drops in
    const live = (c: { t0: number }) => [t - c.t0, t - c.t0 + PERIOD].find((u) => u >= 0 && u < 6);
    MX.forEach((_, i) => {
      s += machine(i, TAU * COINS.filter((c) => c.to === i).reduce((q, c) => q + k(wrap(t - dropAt(c), PERIOD), .1, .7), 0));
    });
    // The shutter over the empty machine's slot (live once it closes), then the coins in the groove
    const sh = shut(t), sx = MX[DUD] - 7, shutter = box(sx, GY + 4 - 7 * sh, TZ, 14, 6, 1.2, 'paper', 'body', 'tint');
    s += box(sx - 1, GY + 3, TZ, 16, 6, 2.5, 'paper', 'body', 'tint') + (lit(shutter, sh) || shutter);
    const tube = cyl(X0 - 6, GY, TZ, 6.5, 26, 'paper', 'body') + cyl(X0 - 6, GY, TZ + 26, 6.5, 0, 'paper', 'body');
    for (const c of COINS) {
      const u = live(c); if (u === undefined) continue;
      const d = dropAt(c) - c.t0, ph = u - d;
      if (ph > .3) continue;
      const x = ph < 0 ? X0 - 6 + V * u : MX[c.to], z = TZ + CR + (ph < 0 ? 0 : -keys(ph, [[0, 0, IN], [.3, 18]])) + (ph < 0 && Math.abs(x - MX[DUD]) < 8 ? 1.2 * sh : 0);
      const roll = -(x - X0) / CR;
      const g = on(FRONT(x, GY, z), `<circle class="f paper" r="${CR}"/><circle class="det" r="${CR * .62}"/><path class="det" d="M0 0L${f(CR * .62 * Math.cos(roll))} ${f(CR * .62 * Math.sin(roll))}"/>`);
      if (ph >= 0) { const m = MX[c.to], q = [[m - 6, GY, TZ], [m + 6, GY, TZ], [m + 6, GY, TZ + 60], [m - 6, GY, TZ + 60]].map(([a, b, e]) => P(a, b, e).map(f).join(' ')).join('L'); s += `<clipPath id="s4-coin-${c.t0}"><path d="M${q}Z"/></clipPath><g clip-path="url(#s4-coin-${c.t0})">${g}</g>`; }
      else s += g;
    }
    s += tube;
    // Capsules from the two working machines roll off to the basket (the best one's are live)
    const caps: { p: V3; best: boolean }[] = [];
    for (const c of COINS) if (c.to !== DUD) for (const u of [t - dropAt(c) - .6, t - dropAt(c) - .6 + PERIOD]) { const p = capsule(c.to, u); if (p) caps.push({ p, best: c.to === BEST }); }
    caps.sort((a, b) => a.p[0] - b.p[0]).forEach(({ p, best }) => {
      const [x, y] = P(...p), g = `<g transform="translate(${f(x)} ${f(y - 3.5)})"><circle class="f paper" r="3.5"/><path class="f body" d="M-3.5 0A3.5 3.5 0 0 0 3.5 0Z"/></g>`;
      s += best ? lit(g) : g;
    });
    s += poly([[6, TY + 6, 12], [BX, TY + 6, 12], [BX, TY + 6, 20], [6, TY + 6, 20]], 'f body');
    s += poly([[BX, TY + 12, 0], [BX + 22, TY + 12, 0], [BX + 22, TY + 12, 22], [BX + 19.5, TY + 9.5, 22], [BX + 2.5, TY + 9.5, 22], [BX, TY + 12, 22]], 'f tint') +
      poly([[BX + 22, TY - 12, 0], [BX + 22, TY + 12, 0], [BX + 22, TY + 12, 22], [BX + 19.5, TY + 9.5, 22], [BX + 19.5, TY - 9.5, 22], [BX + 22, TY - 12, 22]], 'f body');
    return hue('a', s) + arrow(K.curve([MX[DUD] + 9, GY, TZ + 12], [102, GY, TZ + 30], [MX[BEST] - 8, GY, TZ + 14]), { dot: true });
  }
  const piece: Piece = {
    aria: 'Three capsule machines on a counter. Coins roll along a groove into each; the empty machine eats two coins and gets its slot shuttered, so its coins roll on to the best machine. Capsules roll off to a basket.',
    period: PERIOD, rest: 6, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  };
  return piece;
})();

export const ALTS: Record<string, Alt> = {
  'alt-pumpjack-1': { of: 'pumpjack', idea: 'Ряд бамбукових гойдалок шиші-одоші: кожна наповнюється зі свого носика й виливає в спільний жолоб, лише коли повна', piece: shishi },
  'alt-pumpjack-2': { of: 'pumpjack', idea: 'Канатна крутильня: тонкі пасма з котушок кожної компанії скручуються в один канат, що намотується на барабан', piece: ropewalk },
  'alt-burnin-1': { of: 'burnin', idea: 'Верстат для дублювання ключів: щуп іде по зубцях найкращого ключа, фреза вирізає такі самі копії з заготовок', piece: duplicator },
  'alt-burnin-2': { of: 'burnin', idea: 'Автомати з капсулами: порожній ковтає дві монети, його щілину закривають, і монети котяться до найкращого', piece: capsules },
};
