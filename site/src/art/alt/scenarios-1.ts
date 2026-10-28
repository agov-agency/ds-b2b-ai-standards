// Alternatives to the scenario figures `sorter` (warm-lead handoff) and `orrery` (account audit by cadence).
import type { Alt } from './index';
import { kernel, hue, k, keys, lerp, f, IN, OUT, EASY, type Piece, type V3 } from '../iso';
import { lit } from '../icons';

const TAU = 2 * Math.PI;
type P2 = [number, number];
// A plan rectangle centred at (cx, cy), long side along the unit axis (ax, ay)
const rect = (cx: number, cy: number, ax: number, ay: number, l: number, w: number): P2[] => {
  const nx = -ay, ny = ax, a = l / 2, b = w / 2;
  return [[cx - ax * a - nx * b, cy - ay * a - ny * b], [cx + ax * a - nx * b, cy + ay * a - ny * b], [cx + ax * a + nx * b, cy + ay * a + ny * b], [cx - ax * a + nx * b, cy - ay * a + ny * b]];
};
// Silhouette of an axis-aligned slab, for clipping a part to the space in front of a face
const slab = (K: ReturnType<typeof kernel>, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
  ([[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y1, z1]] as V3[]).map((p) => K.P(...p).map(f).join(' ')).join('L');

// ── Yard: warm-lead handoff as a shunting yard. Wagons roll out of the depot, the points send each one down its own
// siding into its owner's shed; the stamped wagon (already owned in the CRM) goes to the far siding. Live: the wagon being handed over.
const Y = (() => {
  const PERIOD = 7.5, STEP = 2.5, BZ = 12;
  const LANE = [22, 50, 78], LEAD = 50, XS = 156, XE = 96;                  // sidings y; the lead track; points start / end x
  const SX0 = -40, SX1 = 26, SY0 = 8, SY1 = 92, SH = 42, DW = 22, DH = 24;  // engine shed (the owners); door width / height
  const QX0 = 196, QX1 = 240, QY0 = 34, QY1 = 66, QH = 34;                  // depot the wagons come out of
  const WL = 34, WW = 16, ROUTE = [1, 2, 0], STAMP = 0;                     // wagon length / width; siding per step; the owned one
  const K = kernel([[-50, -6, 0], [250, -6, 0], [-50, 102, 0], [250, 102, 0], [SX0, SY0, BZ + SH + 6], [QX0, QY0, BZ + QH + 40]], 22);
  const { P, on, poly, line, box, prism, SIDE, FRONT, TOP, arrow, curve } = K;
  const sm = (u: number) => u * u * (3 - 2 * u);
  const yAt = (x: number, i: number) => { const u = Math.min(1, Math.max(0, (XS - x) / (XS - XE))); return LEAD + (LANE[i] - LEAD) * sm(u); };
  const slope = (x: number, i: number) => { const u = (XS - x) / (XS - XE); return u <= 0 || u >= 1 ? 0 : -(LANE[i] - LEAD) * 6 * u * (1 - u) / (XS - XE); };

  // Rails and sleepers on the plinth top, for the lead and each branch
  const track = (i: number, x0: number, x1: number) => {
    const n = Math.ceil((x1 - x0) / 4), pts = Array.from({ length: n + 1 }, (_, q) => x0 + (x1 - x0) * q / n);
    const off = (o: number) => pts.map((x) => { const m = slope(x, i), l = Math.hypot(1, m); return `${f(x - m * o / l)} ${f(yAt(x, i) + o / l)}`; }).join('L');
    let s = '';
    for (let x = x0 + 3; x < x1; x += 10) { const y = yAt(x, i), m = slope(x, i), l = Math.hypot(1, m); s += `<path class="det" d="M${f(x + m * 7.5 / l)} ${f(y - 7.5 / l)}L${f(x - m * 7.5 / l)} ${f(y + 7.5 / l)}"/>`; }
    return s + `<path class="f nofill" d="M${off(-5)}"/><path class="f nofill" d="M${off(5)}"/>`;
  };
  const rails = on(TOP(0, 0, BZ), track(1, SX1 - 30, QX0 + 20) + [0, 2].map((i) => track(i, SX1 - 30, XS)).join(''));

  // A box wagon: dark chassis, plank sides, a tag on the roof (black stamp for the owned lead)
  function wagon(cx: number, i: number, stamp: boolean) {
    const m = slope(cx, i), l = Math.hypot(1, m), ax = 1 / l, ay = m / l, cy = yAt(cx, i);
    const z0 = BZ + 2, z1 = z0 + 4, z2 = z1 + 16;
    let s = prism(rect(cx, cy, ax, ay, WL - 6, WW - 4), z0, 4, 'blk', 'blk') + prism(rect(cx, cy, ax, ay, WL, WW), z1, z2 - z1, 'paper', 'body', 'tint');
    const at = (u: number, v: number, z: number): V3 => [cx + ax * u - ay * v, cy + ay * u + ax * v, z];
    s += [5.5, 11].map((z) => line([at(-WL / 2, WW / 2, z1 + z), at(WL / 2, WW / 2, z1 + z)], 'det')).join('') + [-6, 6].map((u) => line([at(u, -WW / 2, z2), at(u, WW / 2, z2)], 'det')).join('');
    s += poly([at(9, -3.5, z2), at(15, -3.5, z2), at(15, 3.5, z2), at(9, 3.5, z2)], stamp ? 'f blk' : 'f tint');
    return s;
  }
  const doorsUV = LANE.map((y) => [SY1 - y - DW / 2, SH - DH]);
  const shedBack = on(SIDE(SX1, SY1, BZ + SH), doorsUV.map(([u, v]) => `<rect class="f blk" x="${f(u)}" y="${v}" width="${DW}" height="${DH}"/>`).join(''));
  const shed = () => {
    const holes = doorsUV.map(([u, v]) => `M${f(u)} ${v}h${DW}v${DH}h${-DW}Z`).join('');
    return poly([[SX0, SY1, BZ], [SX1, SY1, BZ], [SX1, SY1, BZ + SH], [SX0, SY1, BZ + SH]], 'f tint') +
      on(FRONT(SX0, SY1, BZ + SH), [10, 20, 30].map((v) => `<line class="det" x1="4" y1="${v}" x2="${SX1 - SX0 - 4}" y2="${v}"/>`).join('')) +
      on(SIDE(SX1, SY1, BZ + SH), `<path class="f body" fill-rule="evenodd" d="M0 0H${SY1 - SY0}V${SH}H0Z${holes}"/>` +
        doorsUV.map(([u, v]) => `<rect class="det" x="${f(u - 2)}" y="${v - 2}" width="${DW + 4}" height="${DH + 2}"/>`).join('')) +
      poly([[SX0, SY0, BZ + SH], [SX1, SY0, BZ + SH], [SX1, SY1, BZ + SH], [SX0, SY1, BZ + SH]], 'f paper') +
      box(SX0 - 3, SY0 - 3, BZ + SH, SX1 - SX0 + 6, SY1 - SY0 + 6, 4, 'paper', 'body', 'tint');
  };
  const depot = () => box(QX0, QY0, BZ, QX1 - QX0, QY1 - QY0, QH, 'paper', 'body', 'tint') + box(QX0 - 3, QY0 - 3, BZ + QH, QX1 - QX0 + 6, QY1 - QY0 + 6, 4, 'paper', 'body', 'tint') +
    on(SIDE(QX1, QY1, BZ + QH), `<rect class="det" x="6" y="8" width="${QY1 - QY0 - 12}" height="10" rx=".5"/>`) +
    on(FRONT(QX0, QY1, BZ + QH), [12, 24].map((v) => `<line class="det" x1="4" y1="${v}" x2="${QX1 - QX0 - 4}" y2="${v}"/>`).join(''));
  // Ground lever that throws the points: three notches, one per siding
  const lever = (pos: number) => {
    const bx = XS + 6, by = LEAD + 22, a = lerp(-.7, .7, pos / 2), L = 22, tip: V3 = [bx + Math.sin(a) * L, by, BZ + 6 + Math.cos(a) * L];
    return box(bx - 7, by - 4, BZ, 14, 8, 6, 'paper', 'body', 'tint') + on(TOP(bx - 7, by - 4, BZ + 6), [2.5, 7, 11.5].map((u) => `<line class="det" x1="${u}" y1="2" x2="${u}" y2="6"/>`).join('')) +
      line([[bx, by, BZ + 6], tip], 'tube-o') + line([[bx, by, BZ + 6], tip], 'tube-i') + `<circle class="f blk" cx="${f(P(...tip)[0])}" cy="${f(P(...tip)[1])}" r="2.2"/>`;
  };

  function draw(t: number) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    const j = Math.floor(t / STEP), u = t - j * STEP, i = ROUTE[j], stamp = i === STAMP;
    const cx = keys(u, [[0, QX0 + 24, [.45, 0, .5, 1]], [2.35, SX0 + 10]]);
    // The lever moves to this wagon's siding before it arrives, after the last one has cleared the points
    const prev = ROUTE[(j + ROUTE.length - 1) % ROUTE.length], pos = lerp(prev, i, k(u, .05, .45));
    let w = wagon(cx, i, stamp);
    if (!stamp) w = w + lit(w);
    const x0 = cx - WL / 2, inSink = x0 < SX1, outSink = cx + WL / 2 > SX1;
    let s = K.plinth(-50, -6, 300, 108) + rails + shedBack + (inSink ? w : '') + shed();
    if (outSink) s += inSink ? `<clipPath id="a-yard"><path d="M${slab(K, SX1, SX1 + 300, LANE[i] - WW / 2 - 1, LANE[i] + WW / 2 + 1, BZ, BZ + 24)}Z"/></clipPath><g clip-path="url(#a-yard)">${w}</g>` : w;
    s += lever(pos) + depot();
    return hue('a', s) + arrow(curve([QX0 + 30, LEAD, BZ + QH + 44], [QX0 - 4, LEAD, BZ + QH + 40], [QX0 - 14, LEAD, BZ + 26]), { dot: true });
  }
  return {
    aria: 'A shunting yard. Box wagons roll out of a depot; a lever throws the points so each runs down its own siding into a shed, and the stamped wagon goes to the far siding.',
    period: PERIOD, rest: 1.2, viewBox: K.viewBox, focus: [0.5, 0.55], draw,
  } as Piece;
})();

// ── Index table: warm-lead handoff as a rotary indexing table. Parcels drop from the magazine onto the table; each
// quarter turn brings one to its owner's ram, which pushes it off into that owner's hatch; the stamped parcel rides round
// to the last hatch. Live: the parcel being pushed to its owner.
const T = (() => {
  const PERIOD = 9, STEP = 3, BZ = 12, TR = 50, TZ = 46, PR = 34, PS = 18, PH = 11;  // table radius / top; parcel radius, size, height
  const HR = 66, RAM0 = 15, RAM1 = 25, HUBZ = TZ + 6;                          // hatch radius; ram rest r, tip at rest; ram height
  const LOAD = -Math.PI / 2, DEST = [1, 2, 3], STAMP = 3;                       // load at the back; quarter turns to each parcel's hatch
  const MZ = TZ + 18, MY = -PR;                                                 // magazine bottom, its centre y
  const K = kernel([[-86, -86, 0], [86, -86, 0], [-86, 86, 0], [86, 86, 0], [0, MY, MZ + 54], [0, -78, MZ + 60]], 22);
  const { P, on, poly, line, box, prism, cyl, TOP, arrow, curve } = K;
  const at = (a: number, r: number): P2 => [r * Math.cos(a), r * Math.sin(a)];

  // A parcel: a square box turned with the table (sides along radial / tangential), tape across the top, a tag or the
  // owner stamp. Below the plinth top it is inside the hatch: cut at BZ.
  function parcel(a: number, r: number, z: number, stamp: boolean) {
    if (z + PH <= BZ + .05) return '';
    const [cx, cy] = at(a, r), ca = Math.cos(a), sa = Math.sin(a), z0 = Math.max(z, BZ), zt = z + PH;
    const pt = (u: number, v: number): V3 => [cx + ca * u - sa * v, cy + sa * u + ca * v, zt];
    return prism(rect(cx, cy, ca, sa, PS, PS), z0, zt - z0, 'paper', 'body', 'tint') + line([pt(-PS / 2, 0), pt(PS / 2, 0)], 'det') +
      poly([pt(2, 2.5), pt(6.5, 2.5), pt(6.5, 6.5), pt(2, 6.5)], stamp ? 'f blk' : 'f tint');
  }
  // Table at angle th: rim, a nest pad at each quarter, a scale of ticks
  const table = (th: number) => cyl(0, 0, TZ - 5, TR, 5, 'paper', 'body') + on(TOP(0, 0, TZ),
    [0, 1, 2, 3].map((q) => { const a = th + q * Math.PI / 2, [x, y] = at(a, PR); return `<rect class="f tint" x="${f(-PS / 2 - 2)}" y="${f(-PS / 2 - 2)}" width="${PS + 4}" height="${PS + 4}" transform="translate(${f(x)} ${f(y)}) rotate(${f(a * 180 / Math.PI)})"/>`; }).join('') +
    Array.from({ length: 32 }, (_, q) => { const a = th + q * TAU / 32, r1 = TR - (q % 4 ? 3 : 5); return `<path class="det" d="M${f(TR * Math.cos(a))} ${f(TR * Math.sin(a))}L${f(r1 * Math.cos(a))} ${f(r1 * Math.sin(a))}"/>`; }).join(''));
  const hatch = (a: number) => { const [x, y] = at(a, HR); return on(TOP(x, y, BZ), `<rect class="f paper" x="-14" y="-14" width="28" height="28"/><rect class="f blk" x="-12" y="-12" width="24" height="24"/>`); };
  // A ram on the fixed hub: cylinder block, rod, push pad; ext 0…1
  const ram = (a: number, ext: number) => {
    const ca = Math.cos(a), sa = Math.sin(a), tip = RAM1 + ext * (HR - PS / 2 - RAM1 - 2), p = (r: number): V3 => [r * ca, r * sa, HUBZ];
    return prism(rect(...at(a, (7 + RAM0) / 2), ca, sa, RAM0 - 7, 9), HUBZ - 4.5, 9, 'paper', 'body', 'tint') + line([p(RAM0), p(tip - 1.5)], 'tube-o') + line([p(RAM0), p(tip - 1.5)], 'tube-i') +
      prism(rect(...at(a, tip - 1.5), ca, sa, 3, 13), HUBZ - 5, 10, 'paper', 'body', 'tint');
  };

  function draw(t: number) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    const j = Math.floor(t / STEP), u = t - j * STEP, turn = j + k(u, 0, .9), th = turn * Math.PI / 2;
    const items: [number, string][] = [];
    // Parcels: p is loaded at step p (it drops at u .9…1.3) and pushed off at step p + DEST; from last loop too
    for (let p = j - 3; p <= j; p++) {
      const d = DEST[((p % 3) + 3) % 3], stamp = d === STAMP, gp = p * STEP, tl = t - gp;           // time since its step began
      if (tl < .9) continue;
      const kick = (p + d) * STEP + 1.1 - gp;                                                   // when its ram starts, from its step
      if (tl > kick + 1.2) continue;
      const a = LOAD + Math.PI / 2 * (Math.min(turn, p + d + 1) - p - 1);
      const r = lerp(PR, HR - 2, keys(tl, [[kick, 0, [.4, 0, .6, 1]], [kick + .55, 1]]));
      const z = tl < 1.3 ? lerp(MZ + 2, TZ, keys(tl, [[.9, 0, IN], [1.3, 1]])) : lerp(TZ, BZ - PH - 2, keys(tl, [[kick + .5, 0, IN], [kick + .95, 1]]));
      let g = parcel(a, r, z, stamp);
      if (!stamp && tl > kick) g += lit(g, 1 - k(tl, kick + .8, kick + 1.2));
      const [x, y] = at(a, r);
      items.push([x + y + (z < TZ - 1 && r > TR ? 0 : .5), g]);
    }
    // Rams at the three hatches; the one at this step's hatch pushes
    const pushAt = DEST.find((d) => ((j - d) % 3 + 3) % 3 === DEST.indexOf(d))!;
    [1, 2, 3].forEach((d) => {
      const a = LOAD + d * Math.PI / 2, e = d === pushAt ? keys(u, [[1.1, 0, [.4, 0, .6, 1]], [1.65, 1, EASY], [2.4, 0]]) : 0;
      const [x, y] = at(a, 16);
      items.push([x + y, ram(a, e)]);
    });
    items.push([-.1, cyl(0, 0, TZ, 6, HUBZ - TZ - 4, 'paper', 'body') + cyl(0, 0, HUBZ - 4, 11, 8, 'paper', 'tint') + cyl(0, 0, HUBZ + 4, 5, 3, 'paper', 'body')]);
    // Magazine over the load nest on its gantry: drawn after the parcel waiting inside it
    items.push([MY + .9, box(-3, -82, BZ, 6, 6, MZ + 46 - BZ, 'paper', 'body') + box(-3, -82, MZ + 46, 6, 82 + MY - 12, 5, 'paper', 'body', 'tint') +
      box(-12, MY - 12, MZ, 24, 24, 48, 'paper', 'body', 'tint') + on(TOP(-12, MY - 12, MZ + 48), `<rect class="f tint" x="3" y="3" width="18" height="18"/>`) +
      on(K.FRONT(-12, MY + 12, MZ + 48), `<rect class="det" x="6" y="8" width="12" height="30" rx=".8"/>`)]);
    items.push([MY + .2, parcel(LOAD, PR, MZ + 2, false)]);                                          // the next one, waiting in the magazine
    const back = items.filter(([d]) => d < -40), front = items.filter(([d]) => d >= -40);
    let s = K.plinth(-86, -86, 172, 172) + [1, 2, 3].map((d) => hatch(LOAD + d * Math.PI / 2)).join('');
    s += back.sort((p, q) => p[0] - q[0]).map((p) => p[1]).join('');
    s += cyl(0, 0, BZ, 18, TZ - 5 - BZ, 'paper', 'body') + table(th);
    s += front.sort((p, q) => p[0] - q[0]).map((p) => p[1]).join('');
    return hue('a', s) + arrow(curve([-40, MY, MZ + 72], [-16, MY, MZ + 84], [0, MY, MZ + 56]), { dot: true });
  }
  return {
    aria: 'A rotary indexing table. Parcels drop from a magazine onto it; each quarter turn brings a parcel to its owner\'s ram, which pushes it into a hatch, and the stamped parcel rides round to the last hatch.',
    period: PERIOD, rest: 4.4, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  } as Piece;
})();

// ── Pendulums: account audit by cadence as a frame of four pendulums. The shortest swings fastest (daily), the longest
// slowest (quarterly); at the front of each swing the bob trips its own semaphore. Live: a semaphore arm as it rises.
const W = (() => {
  const PERIOD = 8, BZ = 12, TZ = 168, A = .42, FW = 176;                      // beam height, swing amplitude (rad), frame width
  const PEND = [{ x: 34, L: 46, n: 4, r: 6 }, { x: 70, L: 70, n: 3, r: 7 }, { x: 106, L: 96, n: 2, r: 8 }, { x: 142, L: 124, n: 1, r: 9 }];
  const K = kernel([[-14, -66, 0], [FW + 14, -66, 0], [-14, 72, 0], [FW + 14, 72, 0], [-10, 0, TZ + 14], [FW + 10, 0, TZ + 14]], 22);
  const { P, on, line, box, cyl, cylX, FRONT, TOP, arrow, curve } = K;
  const ball = (x: number, y: number, z: number, r: number, cls = 'paper') => {
    const [sx, sy] = P(x, y, z);
    return `<circle class="f ${cls}" cx="${f(sx)}" cy="${f(sy)}" r="${r}"/><path class="det" d="M${f(sx - r * .62)} ${f(sy - r * .1)}A${r * .7} ${r * .7} 0 0 1 ${f(sx + r * .1)} ${f(sy - r * .62)}"/>`;
  };
  // Phase of a swing: 0…1 per beat, the bob is at the front at .25
  const phase = (i: number, t: number) => { const v = PEND[i].n * t / PERIOD + i * .19; return v - Math.floor(v); };
  const theta = (i: number, t: number) => A * Math.sin(TAU * phase(i, t));
  // Semaphore post in front of each bob's front stop; up 0…1 lifts the arm
  function post(i: number, up: number) {
    const { x, L, r } = PEND[i], y = L * Math.sin(A) + r + 5, z = TZ - L * Math.cos(A), h = z + 16 - BZ;
    const a = lerp(-1.35, .35, up), pv: V3 = [x, y + 2, z + 14];
    const arm = (cls: string) => on(FRONT(pv[0], pv[1], pv[2]), `<g transform="rotate(${f(-a * 180 / Math.PI)})"><path class="f ${cls}" d="M2 -3.4H23L26 0L23 3.4H2Z"/><line class="det" x1="17" y1="-3.4" x2="17" y2="3.4"/><circle class="f paper" cx="0" cy="0" r="1.8"/></g>`);
    return box(x - 6, y - 4, BZ, 12, 8, 3, 'paper', 'body', 'tint') + box(x - 2, y - 2, BZ + 3, 4, 4, h - 3, 'paper', 'body') +
      box(x - 4.5, y - 4.5, z - 4, 9, 2.5, 8, 'paper', 'body', 'tint') + arm('paper') + lit(arm('body'), up);
  }
  function draw(t: number) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    const items: [number, string][] = [];
    PEND.forEach(({ x, L, r }, i) => {
      const th = theta(i, t), by = L * Math.sin(th), bz = TZ - L * Math.cos(th), ph = phase(i, t);
      const rod: V3[] = [[x, 0, TZ - 3], [x, by, bz]];
      items.push([x + by, line(rod, 'tube-o') + line(rod, 'tube-i') + ball(x, by, bz, r)]);
      const up = k(ph, .19, .25) * (1 - k(ph, .32, .6));
      items.push([x + L * Math.sin(A) + r + 5, post(i, up)]);
    });
    const frame = (x: number) => box(x - 5, -44, BZ, 10, 88, 4, 'paper', 'body', 'tint') + box(x - 3, -3, BZ + 4, 6, 6, TZ - BZ - 4, 'paper', 'body') +
      [-1, 1].map((sd) => line([[x, sd * 40, BZ + 4], [x, sd * 3, BZ + 60]], 'tube-o') + line([[x, sd * 40, BZ + 4], [x, sd * 3, BZ + 60]], 'tube-i')).join('');
    let s = K.plinth(-14, -66, FW + 28, 138) + frame(0);
    s += box(-8, -5, TZ, FW + 16, 10, 8, 'paper', 'body', 'tint') + PEND.map(({ x }) => box(x - 4, -4, TZ - 4, 8, 8, 4, 'paper', 'body') + cylX(x - 5, x + 5, 0, TZ - 2, 1.8, 'blk', 'blk')).join('');
    s += items.sort((p, q) => p[0] - q[0]).map((p) => p[1]).join('') + frame(FW);
    return hue('a', s);
  }
  return {
    aria: 'Four pendulums of different lengths hang from one beam. The shortest swings fastest and the longest slowest; at the front of each swing a bob lifts its own semaphore arm.',
    period: PERIOD, rest: 1.3, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  } as Piece;
})();

// ── Stamp mill: account audit by cadence as a cam shaft with four stamps over one block (the account). The cams carry
// 4, 3, 2 and 1 lobes, so one turn of the shaft lifts the stamps daily, weekly, monthly, quarterly. Live: a stamp while it is up.
const M = (() => {
  const PERIOD = 9, BZ = 12, ZS = 104, SY = 22, W = 196, LIFT = 13, RC = 10;   // shaft height, stamp line y, frame width, lift, cam base
  const ST = [{ x: 44, n: 4, ph: 0 }, { x: 86, n: 3, ph: .5 }, { x: 128, n: 2, ph: 1.1 }, { x: 170, n: 1, ph: 2.3 }];
  const MZ = BZ + 16, SHOE = 9, STEM = ZS + RC - (MZ + SHOE);                   // mortar top, shoe height, stem length to the tappet
  const K = kernel([[-6, -16, 0], [W + 30, -16, 0], [-6, 44, 0], [W + 30, 44, 0], [0, -10, ZS + 50], [W, 0, ZS + 50], [W + 26, 0, ZS + 22]], 22);
  const { on, poly, line, box, cyl, cylX, SIDE, FRONT, TOP, arrow, curve } = K;
  // Cam profile: each lobe rises slowly over RISE radians, then drops off a cliff; the stamp falls with it
  const RISE = .95;
  const rad = (psi: number, n: number) => { const q = TAU / n, u = ((psi % q) + q) % q; return RC + (u < RISE ? LIFT * (1 - Math.cos(u / RISE * Math.PI)) / 2 : u < RISE + .3 ? LIFT * (1 + Math.cos((u - RISE) / .3 * Math.PI)) / 2 : 0); };
  const camPath = (rot: number, n: number) => Array.from({ length: 121 }, (_, q) => {
    const a = q * TAU / 120, r = rad(a - rot, n) + 0;
    return `${q ? 'L' : 'M'}${f(-r * Math.cos(a))} ${f(-r * Math.sin(a))}`;
  }).join('') + 'Z';
  // Lift of a stamp: the cam radius straight up (plane angle π/2 on the side face, which points to +z)
  const lift = (rot: number, n: number) => rad(Math.PI / 2 - rot, n) - RC;
  function stamp(x: number, h: number) {
    const z0 = MZ + h;
    return box(x - 6, SY - 6, z0, 12, 12, SHOE, 'paper', 'body', 'tint') + box(x - 2.5, SY - 2.5, z0 + SHOE, 5, 5, STEM + 22, 'paper', 'body') +
      box(x - 3.5, -8, z0 + SHOE + STEM, 7, SY - 8 + 3, 4, 'paper', 'body', 'tint');
  }
  function draw(t: number) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    const rot = -TAU * t / PERIOD;
    let s = K.plinth(-6, -16, W + 36, 60);
    s += box(14, SY - 9, BZ, W - 18, 18, MZ - BZ, 'paper', 'body', 'tint') + on(TOP(14, SY - 9, MZ), ST.map(({ x }) => `<rect class="f tint" x="${x - 14 - 8}" y="1" width="16" height="16"/>`).join(''));
    s += box(0, -8, BZ, 12, 16, ZS + 14 - BZ, 'paper', 'body', 'tint');
    s += cylX(12, W - 6, 0, ZS, 3.5);
    ST.forEach(({ x, n, ph }) => {
      const r = rot + ph, cam = camPath(r, n);
      s += [-3, -1.5, 0, 1.5].map((dx) => on(SIDE(x + dx, 0, ZS), `<path class="f body" d="${cam}"/>`)).join('') + on(SIDE(x + 3, 0, ZS), `<path class="f paper" d="${cam}"/><circle class="f body" r="3.5"/>`);
      const h = lift(r, n), g = stamp(x, h);
      s += g + lit(g, k(h, LIFT * .2, LIFT * .7));
    });
    // Guides the stems run through, the far standard, the drive pulley
    s += box(14, SY - 5, MZ + 34, W - 18, 10, 5, 'paper', 'body', 'tint');
    s += box(W - 6, -8, BZ, 12, 16, ZS + 14 - BZ, 'paper', 'body', 'tint') + box(W - 6, -8, ZS + 14, 12, SY + 13, 4, 'paper', 'body', 'tint');
    s += cylX(W + 6, W + 14, 0, ZS, 3.5) + cylX(W + 14, W + 22, 0, ZS, 18, 'paper', 'body') + on(SIDE(W + 22, 0, ZS),
      [0, 1, 2, 3].map((q) => { const a = rot + q * TAU / 4; return `<path class="det" d="M${f(-3 * Math.cos(a))} ${f(-3 * Math.sin(a))}L${f(-15 * Math.cos(a))} ${f(-15 * Math.sin(a))}"/>`; }).join('') + `<circle class="det" r="15.5"/><circle class="f blk" r="2"/>`);
    return hue('a', s);
  }
  return {
    aria: 'A stamp mill: one cam shaft with four cams of four, three, two and one lobes lifts four stamps over one block, so they fall at four different rates.',
    period: PERIOD, rest: 2, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  } as Piece;
})();

export const ALTS: Record<string, Alt> = {
  'alt-sorter-1': { of: 'sorter', idea: 'Сортувальна станція: стрілка розводить вагони по коліях у депо власників, вагон із печаткою — на окрему колію', piece: Y },
  'alt-sorter-2': { of: 'sorter', idea: 'Поворотний стіл: кожна чверть оберту підводить посилку до штовхача її власника, посилка з печаткою їде до останнього люка', piece: T },
  'alt-orrery-1': { of: 'orrery', idea: 'Чотири маятники різної довжини: короткий б’є щодня, довгий раз на квартал, кожен піднімає свій семафор', piece: W },
  'alt-orrery-2': { of: 'orrery', idea: 'Товчея на кулачковому валу: кулачки з 4, 3, 2 і 1 виступом піднімають молоти над тим самим рахунком з різною частотою', piece: M },
};
