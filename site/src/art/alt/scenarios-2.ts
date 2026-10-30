// Alternative takes on two scenario figures: "Targeting vs who actually buys" (galton) and "Company-level account
// routing" (lineshaft). Each piece keeps its own kernel and constants inside its closure.
import { kernel, hue, k, keys, f, EASY, type Piece, type V3 } from '../iso';
import type { Alt } from './index';

const TAU = 2 * Math.PI;
type P2 = [number, number];
type K = ReturnType<typeof kernel>;
const wrap = (t: number, p: number) => ((t % p) + p) % p;
const lit = (s: string, a = 1) => (a > .01 ? `<g class="lit"${a < .999 ? ` style="opacity:${f(a)}"` : ''}>${s}</g>` : '');
// A flat part lying in the x-z plane between y0 and y1 (after pumpjack): the side walls we see, then the front face
function slab(K: K, pts: P2[], y0: number, y1: number, face = 'paper', side = 'body') {
  let s = '';
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], nx = b[1] - a[1], nz = a[0] - b[0];
    if (nx + nz > 0) s += K.poly([[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], `f ${side}`);
  });
  return s + K.poly(pts.map(([x, z]) => [x, y1, z] as V3), `f ${face}`);
}
const rot = (cx: number, cz: number, a: number, pts: P2[]) => pts.map(([x, z]) => [cx + x * Math.cos(a) - z * Math.sin(a), cz + x * Math.sin(a) + z * Math.cos(a)] as P2);
// Spokes of a wheel turned to angle a, drawn flat on a face plane
const spokes = (n: number, a: number, r0: number, r1: number) => Array.from({ length: n }, (_, q) => {
  const b = a + q * TAU / n; return `<path class="det" d="M${f(r0 * Math.cos(b))} ${f(r0 * Math.sin(b))}L${f(r1 * Math.cos(b))} ${f(r1 * Math.sin(b))}"/>`;
}).join('');
// An open crate: inside and rim first; after whatever falls in, the near walls that hide it
const crateIn = (K: K, x: number, y: number, w: number, d: number, h: number, z = 12) =>
  K.box(x, y, z, w, d, h, 'paper', 'body', 'tint') + K.on(K.TOP(x, y, z + h), `<rect class="f blk" x="2.5" y="2.5" width="${w - 5}" height="${d - 5}"/>`);
const crateOut = (K: K, x: number, y: number, w: number, d: number, h: number, z = 12) => {
  const z1 = z + h;
  return K.poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z1], [x + w - 2.5, y + d - 2.5, z1], [x + 2.5, y + d - 2.5, z1], [x, y + d, z1]], 'f tint') +
    K.poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z1], [x + w - 2.5, y + d - 2.5, z1], [x + w - 2.5, y + 2.5, z1], [x + w, y, z1]], 'f body');
};

// ── Spray boom: targeting vs who buys. Water from the tank runs along the boom and rains on a row of pots; only the
// two at the far end have sprouts. Turning the handwheel walks the spray bar along its screw over the sprouts. Live: the sprouts.
// Scenario "Targeting vs who actually buys": an irrigation boom over a row of pots. The water (the budget) comes out of
// the tank, along the boom pipe and down from two nozzles; most of it soaks bare soil. A handwheel turns the lead screw,
// the spray bar walks over the two pots that have sprouts, and the water feeds what grows. Every drop ends in soil.
const boom = ((): Piece => {
  const PERIOD = 10, N = 8, PX0 = 14, PS = 20, PY = 26, PR = 8.5, PH = 13, PAY = 6;  // pots: first x, step, row y, radius, height; sprouts from PAY up
  const RZ = 98, SZ = 88, NZ = 66, ZS = 12 + PH, G = 320, DT = .1;                 // boom pipe, screw, nozzle tip, soil heights; drop gravity, spacing
  const XA = PX0 + PS * 1.5, XB = PX0 + PS * 6.5, XL = -14, XR = PX0 + PS * (N - 1) + 18;  // bar stops (between two pots); posts
  const K = kernel([[-54, 0, 0], [XR + 26, 0, 0], [-54, 52, 0], [XR + 26, 52, 0], [-34, PY, RZ + 6], [XR + 14, PY, SZ + 12]], 22);
  const { P, on, line, box, cyl, cylX, FRONT, SIDE, TOP } = K;
  const pot = (i: number) => PX0 + i * PS;
  const bar = (t: number) => keys(wrap(t, PERIOD), [[0, XA], [3.2, XA, EASY], [4.6, XB], [8.4, XB, EASY], [9.8, XA]]);
  const floor = (x: number) => { const i = Math.round((x - PX0) / PS); return i >= 0 && i < N && Math.abs(x - pot(i)) < PR - 1 ? ZS : 12; };
  const pays = (x: number) => x > pot(PAY) - PS / 2;

  function sprout(x: number) {
    const [sx, sy] = P(x, PY, ZS);
    return `<path class="det" d="M${f(sx)} ${f(sy)}V${f(sy - 13)}"/>` +
      `<path class="f body" d="M${f(sx)} ${f(sy - 7)}c-3 -5 -8 -5 -10 -3c3 3 7 4 10 3Z"/><path class="f body" d="M${f(sx)} ${f(sy - 12)}c2 -5 7 -6 10 -4c-2 3 -6 5 -10 4Z"/>`;
  }
  function draw(t: number) {
    t = wrap(t, PERIOD);
    const cx = bar(t), turn = TAU * 2 * (cx - XA) / (XB - XA);
    let s = K.plinth(-54, 0, XR + 80, 52);
    // Tank (the source) with its level window, and the riser up to the boom
    s += cyl(-34, PY, 12, 14, 58, 'paper', 'tint') + cyl(-34, PY, 70, 9, 3, 'paper', 'body') + on(FRONT(-34, PY + 14, 64), `<rect class="det" x="-3" y="8" width="6" height="34" rx=".8"/><rect class="f body" x="-2" y="24" width="4" height="17"/>`);
    s += cyl(-34, PY, 73, 3, RZ - 73, 'paper', 'body');
    s += box(XL - 3, PY - 3, 12, 6, 6, RZ - 15, 'paper', 'body');
    // The pots: bare soil, and the two with sprouts
    for (let i = 0; i < N; i++) {
      const x = pot(i);
      s += cyl(x, PY, 12, PR - 1, PH - 3, 'paper', 'tint') + cyl(x, PY, 12 + PH - 3, PR, 3, 'paper', 'body') + on(TOP(x, PY, ZS), `<circle class="f blk" r="${PR - 1.6}"/>`);
      if (i >= PAY) s += lit(sprout(x));
    }
    // Drops: each leaves a nozzle where the bar was and falls straight until it meets soil (or the plinth between pots)
    const n0 = Math.floor(t / DT);
    for (let j = 0; j < 9; j++) for (const o of [-PS / 2, PS / 2]) {
      const t0 = (n0 - j) * DT, u = t - t0, x = bar(t0) + o, z = NZ - G * u * u / 2;
      if (z < floor(x)) continue;
      const [sx, sy] = P(x, PY, z), c = `<ellipse class="f ${pays(x) ? 'body' : 'paper'}" cx="${f(sx)}" cy="${f(sy)}" rx="1.4" ry="2.2"/>`;
      s += pays(x) ? lit(c) : c;
    }
    // Lead screw and boom pipe between the posts, the far post
    s += cylX(XL, XR, PY, SZ, 1.4, 'paper', 'tint') + Array.from({ length: Math.floor((XR - XL) / 4) }, (_, q) => line([[XL + 2 + q * 4, PY + 1.4, SZ + 1.2], [XL + 3 + q * 4, PY + 1.4, SZ - 1.2]], 'det')).join('');
    s += cylX(-34, XR + 4, PY, RZ, 3.2, 'paper', 'body');
    // Carriage riding the screw, hose loop from the pipe, the spray bar with two nozzles
    s += box(cx - 8, PY - 5, SZ - 6, 16, 10, 14, 'paper', 'body', 'tint') + on(FRONT(cx - 8, PY + 5, SZ + 8), `<rect class="det" x="3" y="3" width="10" height="8" rx=".6"/>`);
    s += cyl(cx, PY, SZ - 14, 2.2, 8, 'paper', 'body') + cylX(cx - PS / 2 - 3, cx + PS / 2 + 3, PY, SZ - 15, 2.4, 'paper', 'body');
    for (const o of [-PS / 2, PS / 2]) s += cyl(cx + o, PY, NZ + 2, 1.8, SZ - 17 - NZ, 'paper', 'body') + cyl(cx + o, PY, NZ, 2.8, 2, 'blk', 'body');
    s += box(XR - 3, PY - 3, 12, 6, 6, RZ - 15, 'paper', 'body');
    // Handwheel on the end of the screw
    s += cylX(XR + 3, XR + 8, PY, SZ, 1.4) + cylX(XR + 8, XR + 11, PY, SZ, 9, 'paper', 'tint') +
      on(SIDE(XR + 11, PY, SZ), `<circle class="det" r="7"/>${spokes(4, turn, 2, 7)}<circle class="f blk" r="1.4"/><circle class="f paper" cx="${f(7 * Math.cos(turn))}" cy="${f(7 * Math.sin(turn))}" r="1.8"/>`);
    return hue('a', s);
  }
  return {
    aria: 'An irrigation boom over a row of pots. Water from a tank rains from two nozzles onto bare soil until a handwheel walks the spray bar over the two pots that have sprouts.',
    period: PERIOD, rest: 6.2, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  };
})();

// ── Ball launcher: targeting vs who buys. The barrel aims long and every ball sails over the small basket into the big
// bin; the elevation wheel brings the barrel down and the balls drop into the basket. Live: the basket and the balls bound for it.
// Scenario "Targeting vs who actually buys": a ball-pitching machine. Balls (the budget) come from the hopper and out of
// the barrel; aimed high they all fly past the small basket into the big bin behind it. The elevation wheel lowers the
// barrel and the same balls land in the basket. Each ball leaves the barrel and ends in one of the two boxes.
const launcher = ((): Piece => {
  const PERIOD = 10, DT = .125, PY = 24, V = 165, G = 520, BALL = 4;            // barrel plane y; muzzle speed, gravity
  const PV: P2 = [32, 58], BL = 34, AH = 30 * Math.PI / 180, AL = 0;            // barrel pivot (x, z), length to the muzzle; high and low aim
  const BX0 = 104, BX1 = 136, WX1 = 186, CD = 30, BH = 16, CH = 30, CY = PY - CD / 2;  // basket x range, bin far end; depth, basket and bin height
  const K = kernel([[-10, -2, 0], [WX1 + 8, -2, 0], [-10, 54, 0], [WX1 + 8, 54, 0], [20, PY, 80], [90, PY, 108]], 22);
  const { P, on, box, cylY, FRONT, SIDE, TOP } = K;
  const aim = (t: number) => keys(wrap(t, PERIOD), [[0, AH], [3.2, AH, EASY], [4.6, AL], [8.4, AL, EASY], [9.8, AH]]);
  const muzzle = (a: number): P2 => [PV[0] + BL * Math.cos(a), PV[1] + BL * Math.sin(a)];
  const sphere = (x: number, y: number, z: number, cls: string) => { const [sx, sy] = P(x, y, z); return `<circle class="f ${cls}" cx="${f(sx)}" cy="${f(sy)}" r="${BALL}"/>`; };
  // Where a ball shot at t0 comes down: the x where it falls past the rims decides its box
  const landX = (a: number) => { const [mx, mz] = muzzle(a), vx = V * Math.cos(a), vz = V * Math.sin(a), u = (vz + Math.sqrt(vz * vz + 2 * G * (mz - 12 - BH))) / G; return mx + vx * u; };

  function draw(t: number) {
    t = wrap(t, PERIOD);
    const a = aim(t), turn = TAU * 1.5 * (a - AH) / (AL - AH);
    let s = K.plinth(-10, -2, WX1 + 18, 56);
    // Machine body with vents, the hopper on top with its pile of balls (the source)
    s += box(-2, PY - 14, 12, 44, 28, 36, 'paper', 'body', 'tint') + on(SIDE(42, PY + 14, 48), Array.from({ length: 5 }, (_, i) => `<line class="det" x1="6" y1="${8 + i * 4}" x2="22" y2="${8 + i * 4}"/>`).join(''));
    s += box(0, PY - 12, 48, 22, 24, 12, 'paper', 'body', 'tint') + on(TOP(0, PY - 12, 60), `<rect class="f blk" x="2" y="2" width="18" height="20"/>`);
    for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2], [.5, .5], [.5, 1.5]]) s += sphere(6 + i * 10, PY - 7 + j * 7, 60 + (i % 1 ? 4 : 1), 'paper');
    // Yoke cheeks round the barrel, the barrel (a square tube on its pivot) with the bore at the muzzle
    const cheek = rot(PV[0], PV[1], 0, [[-9, -10], [9, -10], [2, 4], [-2, 4]]);
    const tube = rot(PV[0], PV[1], a, [[-8, -4], [BL, -4], [BL, 4], [-8, 4]]), bore = rot(PV[0], PV[1], a, [[BL, -2.4], [BL, 2.4]]);
    s += slab(K, cheek, PY - 8, PY - 6) + slab(K, tube, PY - 4, PY + 4, 'paper', 'tint');
    s += K.poly([[bore[0][0], PY - 2.4, bore[0][1]], [bore[1][0], PY - 2.4, bore[1][1]], [bore[1][0], PY + 2.4, bore[1][1]], [bore[0][0], PY + 2.4, bore[0][1]]], 'f blk');
    s += slab(K, cheek, PY + 6, PY + 8) + cylY(PY + 8, PY + 10, PV[0], PV[1], 2.4);
    // Elevation wheel on the front of the machine
    s += cylY(PY + 14, PY + 17, 16, 30, 1.6) + cylY(PY + 17, PY + 20, 16, 30, 8, 'paper', 'tint') +
      on(FRONT(16, PY + 20, 30), `<circle class="det" r="6"/>${spokes(3, turn, 1.6, 6)}<circle class="f blk" r="1.2"/>`);
    // Basket (lit) and the big bin, the balls in flight, then the walls in front of them
    s += lit(crateIn(K, BX0, CY, BX1 - BX0, CD, BH)) + crateIn(K, BX1, CY, WX1 - BX1, CD, CH);
    const n0 = Math.floor(t / DT);
    for (let j = 6; j >= 0; j--) {
      const t0 = (n0 - j) * DT, u = t - t0, b = aim(t0), [mx, mz] = muzzle(b);
      const x = mx + V * Math.cos(b) * u, z = mz + V * Math.sin(b) * u - G * u * u / 2;
      if (z < 12 + BALL + 1) continue;
      const pay = landX(b) < BX1, c = sphere(x, PY, z, pay ? 'body' : 'paper');
      s += pay ? lit(c) : c;
    }
    const weave = on(FRONT(BX0, CY + CD, 12 + BH), [6, 12, 18, 24].map((x) => `<line class="det" x1="${x}" y1="2" x2="${x}" y2="${BH - 2}"/>`).join('') + `<line class="det" x1="2" y1="${BH / 2}" x2="${BX1 - BX0 - 2}" y2="${BH / 2}"/>`);
    s += lit(crateOut(K, BX0, CY, BX1 - BX0, CD, BH) + weave) + crateOut(K, BX1, CY, WX1 - BX1, CD, CH);
    return hue('a', s);
  }
  return {
    aria: 'A ball-pitching machine. Aimed high, its balls fly over a small basket into a big bin; the elevation wheel lowers the barrel and the balls land in the basket.',
    period: PERIOD, rest: 6.2, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  };
})();

// ── Mill race: company-level routing. A flume feeds every waterwheel; the big ones spin under full spouts, the small
// one stands dry behind a shut sluice until its gate is raised. Live: the small wheel.
// Scenario "Company-level account routing": a mill race. Water (the leads) runs from the head tank along a raised flume
// and drops through a spout onto each wheel, then away down the tailrace into the culvert. The two big accounts' wheels
// spin flat out; the small one is dry until its sluice gate lifts and it spins up: the account reached its owner.
const millrace = ((): Piece => {
  const PERIOD = 8, FZ = 96, FY0 = -12, FY1 = 4, WY = 20, XE = 214, TY0 = 8, TY1 = 32;  // flume floor, its y; wheel plane; flume end; tailrace y
  const W = [{ x: 40, r: 28 }, { x: 116, r: 28 }, { x: 186, r: 16 }], GX = 186, SYM = TAU / 8;
  const K = kernel([[-48, -18, 0], [252, -18, 0], [-48, 44, 0], [252, 44, 0], [-48, -18, 112], [GX, WY, FZ + 34]], 22);
  const { on, line, box, cylY, FRONT, SIDE, TOP } = K;
  const gate = (t: number) => k(t, 1.4, 2.2) - k(t, 6, 6.8);
  const drive = (s: number) => k(s, 2, 3.2) - k(s, 6.4, 7.6);
  // The small wheel's angle is the integral of its water, scaled so the loop ends on a whole bucket step
  const integ = (t: number, n = 64) => { let a = 0; for (let i = 0; i < n; i++) a += drive(t * (i + .5) / n) * t / n; return a * TAU * 2.5 / PERIOD; };
  const ALL = integ(PERIOD, 256), turned = (t: number) => integ(t) * Math.max(1, Math.round(ALL / SYM)) * SYM / ALL;
  const flow = (pts: V3[], a = 1) => (a > .01 ? `<g style="opacity:${f(Math.min(1, a))}">${line(pts, 'flow')}</g>` : '');

  function wheel(x: number, r: number, a: number) {
    const cz = 14 + r, buckets = Array.from({ length: 16 }, (_, q) => { const b = a + q * TAU / 16; return `<path class="f body" d="M${f((r - 5) * Math.cos(b))} ${f((r - 5) * Math.sin(b))}L${f(r * Math.cos(b))} ${f(r * Math.sin(b))}L${f(r * Math.cos(b + .22))} ${f(r * Math.sin(b + .22))}Z"/>`; }).join('');
    return cylY(WY - 5, WY + 5, x, cz, r, 'paper', 'body') + on(FRONT(x, WY + 5, cz), buckets + `<circle class="det" r="${r - 5}"/>${spokes(8, a, 3, r - 5)}<circle class="f paper" r="3"/><circle class="f blk" r="1.4"/>`);
  }
  function draw(t: number) {
    t = wrap(t, PERIOD);
    const g = gate(t), th = TAU * 2 * t / PERIOD, small = turned(t);
    let s = K.plinth(-48, -18, 300, 62);
    // Tailrace: floor and back wall, the water running along it to the culvert
    s += on(TOP(-6, TY0, 12), `<rect class="f tint" width="${XE + 26}" height="${TY1 - TY0}"/>`) + box(-6, TY0 - 2, 12, XE + 26, 2, 8, 'paper', 'body', 'paper');
    s += flow([[W[0].x, WY, 13], [XE + 20, WY, 13]]);
    // Head tank (the source), flume trestles, the flume with its water
    s += box(-46, -16, 12, 30, 30, 100, 'paper', 'body', 'tint') + on(FRONT(-46, 14, 112), [20, 46, 72].map((y) => `<line class="det" x1="0" y1="${y}" x2="30" y2="${y}"/>`).join('')) + on(TOP(-46, -16, 112), `<rect class="f blk" x="3" y="3" width="24" height="24"/>`);
    for (const x of [10, 80, 152]) s += box(x, FY0 + 4, 12, 6, 8, FZ - 12, 'paper', 'body');
    s += box(-16, FY0, FZ, XE + 16, FY1 - FY0, 2, 'paper', 'body', 'tint') + flow([[-16, (FY0 + FY1) / 2, FZ + 4], [XE - 4, (FY0 + FY1) / 2, FZ + 4]]);
    s += box(-16, FY0 - 2, FZ, XE + 16, 2, 9, 'paper', 'body', 'paper');
    // A spout off the flume over each wheel; the water drops onto the wheel's crown
    for (const w of W) {
      const on1 = w.x === GX ? g : 1;
      s += box(w.x - 5, FY1, FZ, 10, WY - FY1, 2, 'paper', 'body', 'tint') + flow([[w.x, FY1, FZ + 3], [w.x, WY, FZ + 3]], on1) + flow([[w.x + 3, WY, FZ + 1], [w.x + 3, WY, 14 + 2 * w.r]], on1);
    }
    // The wheels, then the flume's front wall, the tailrace's front wall
    s += W.map((w) => w.x === GX ? lit(wheel(w.x, w.r, small)) : wheel(w.x, w.r, th)).join('');
    s += box(-16, FY1, FZ, XE + 16, 2, 9, 'paper', 'body', 'tint') + W.map((w) => box(w.x - 6, FY1, FZ, 2, WY - FY1, 7, 'paper', 'body') + box(w.x + 4, FY1, FZ, 2, WY - FY1, 7, 'paper', 'body')).join('');
    s += box(-6, TY1, 12, XE + 26, 2, 8, 'paper', 'body', 'tint');
    // Sluice gate on the small wheel's spout: a board in a frame, lifted by its rack handle
    const lift = 12 * g;
    s += box(GX - 7, WY - 6, FZ + 7, 14, 3, 2, 'paper', 'body') + box(GX - 7, WY - 6, FZ + 9, 2, 3, 24, 'paper', 'body') + box(GX + 5, WY - 6, FZ + 9, 2, 3, 24, 'paper', 'body');
    s += box(GX - 5, WY - 5.5, FZ + 2 + lift, 10, 2, 12, 'paper', 'tint', 'tint') + box(GX - 1, WY - 5.5, FZ + 14 + lift, 2, 2, 20, 'paper', 'body') + box(GX - 7, WY - 6, FZ + 33, 14, 3, 2, 'paper', 'body');
    // Culvert at the end of the tailrace
    s += box(XE + 20, TY0 - 6, 12, 24, TY1 - TY0 + 12, 30, 'paper', 'body', 'tint') + on(SIDE(XE + 44, TY1 + 6, 42), `<rect class="det" x="4" y="4" width="${TY1 - TY0 + 4}" height="22"/>`);
    return hue('a', s);
  }
  return {
    aria: 'A mill race. A raised flume drops water onto three waterwheels; the two big ones spin, the small one stays dry until its sluice gate lifts and it spins up.',
    period: PERIOD, rest: 3.6, viewBox: K.viewBox, focus: [0.6, 0.5], draw,
  };
})();

// ── Coupling yard: company-level routing. Three wagons of one company come out of three tunnels, run onto one line,
// couple into one train and go into one shed together. Live: the coupled train.
// Scenario "Company-level account routing": a rail yard. Three wagons with the same company mark (contacts of one
// account) come out of three tunnels, the side tracks curve into the main line, the wagons buffer up into one train and
// the whole train runs into the one shed of its owner. Wagons come out of the tunnels and end inside the shed.
const coupling = ((): Piece => {
  const PERIOD = 9, ZR = 12, WL = 28, WD = 16, WH = 16, GAP = 2;                // rail top; wagon length, width, body height
  const XP = -14, XB = 10, XM = 80, XS = 176, XS1 = 268, X1 = 150, RUN = 100;     // tunnel mouths, curves start / end, shed x range; front wagon stop; run into the shed
  const TR = [-30, 30, 0];                                                       // tracks in the order the wagons come out
  const K = kernel([[-44, -50, 0], [XS1 + 4, -50, 0], [-44, 50, 0], [XS1 + 4, 50, 0], [XS + 20, 0, 70]], 22);
  const { P, on, line, box, prism, FRONT, SIDE, TOP } = K;
  // Each track as a polyline with arc lengths: straight out of its tunnel, an S-curve into the main line, on to the shed
  const path = TR.map((y) => {
    const pts: P2[] = [[-40, y], [XB, y]];
    if (y) for (let i = 1; i <= 24; i++) { const u = i / 24, v = 1 - u; const bx = v * v * v * XB + 3 * v * v * u * (XB + 36) + 3 * v * u * u * (XM - 36) + u * u * u * XM, by = (v * v * v + 3 * v * v * u) * y; pts.push([bx, by]); }
    pts.push([XS1 + 40, 0]);
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, L };
  });
  const along = (i: number, s: number) => {
    const { pts, L } = path[i]; let j = 1;
    while (j < L.length - 1 && L[j] < s) j++;
    const u = (s - L[j - 1]) / (L[j] - L[j - 1]), a = pts[j - 1], b = pts[j];
    return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, a: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  };
  // Arc length on track i of a point x on the main line (x past XM): back from the far end of the last, straight run
  const sAt = (i: number, x: number) => path[i].L[path[i].L.length - 1] - (XS1 + 40 - x);
  const stop = TR.map((_, i) => sAt(i, X1 - i * (WL + GAP)));
  const sOf = (i: number, t: number) => keys(t, [[.3 + i, 0, EASY], [2.5 + i, stop[i]], [5.6, stop[i], EASY], [7.8, stop[i] + RUN]]);
  const glow = (t: number) => k(t, 4.5, 5.1);

  // A wagon at (cx, cy) heading a, its length cut to [l0, ∞) where it comes out of a tunnel mouth
  function wagon(cx: number, cy: number, a: number, l0: number) {
    const c = Math.cos(a), s = Math.sin(a), at = (u: number, v: number): P2 => [cx + u * c - v * s, cy + u * s + v * c];
    const u0 = Math.max(-WL / 2, l0), u1 = WL / 2;
    if (u1 - u0 < .2) return '';
    const quad = (a0: number, a1: number, b0: number, b1: number) => [at(a0, b0), at(a1, b0), at(a1, b1), at(a0, b1)];
    let g = prism(quad(Math.max(u0, -WL / 2 + 2), WL / 2 - 2, -WD / 2 + 1.5, WD / 2 - 1.5), ZR, 5, 'blk', 'blk');
    g += prism(quad(u0, u1, -WD / 2, WD / 2), ZR + 5, WH, 'paper', 'body', 'tint');
    // Company mark on the long side we see: a band and a square badge
    const v = c - s > 0 ? WD / 2 : -WD / 2, m = (u: number, z: number): V3 => [...at(u, v), z] as V3;
    if (u1 - u0 > 4) g += line([m(u0 + .5, ZR + 5 + WH * .62), m(u1 - .5, ZR + 5 + WH * .62)], 'det');
    if (u0 < -4) g += K.poly([m(-4, ZR + 8), m(4, ZR + 8), m(4, ZR + 16), m(-4, ZR + 16)], 'f body');
    // Buffers at the front (and the back, once it is out)
    g += prism(quad(u1, u1 + 2, -1.5, 1.5), ZR + 7, 3, 'paper', 'body');
    if (u0 <= -WL / 2) g += prism(quad(-WL / 2 - 2, -WL / 2, -1.5, 1.5), ZR + 7, 3, 'paper', 'body');
    return g;
  }
  // A track: sleepers across, two rails along
  function track(i: number) {
    const { pts, L } = path[i], end = i === 2 ? L[L.length - 1] : L[L.length - 2];
    let g = '';
    for (let s = 4; s < end; s += 7) {
      const p = along(i, s); if (p.x > XS1) break;
      if (TR[i] && p.x > XB + 20 && Math.abs(p.y) < 14) continue;
      const nx = -Math.sin(p.a) * 9, ny = Math.cos(p.a) * 9, tx = Math.cos(p.a) * 1.4, ty = Math.sin(p.a) * 1.4;
      g += K.poly([[p.x - nx - tx, p.y - ny - ty, ZR], [p.x - nx + tx, p.y - ny + ty, ZR], [p.x + nx + tx, p.y + ny + ty, ZR], [p.x + nx - tx, p.y + ny - ty, ZR]], 'f tint');
    }
    for (const o of [-5, 5]) {
      const rail: V3[] = [];
      for (let s = 0; s < end; s += 3) { const p = along(i, s); if (p.x > XS1) break; rail.push([p.x - Math.sin(p.a) * o, p.y + Math.cos(p.a) * o, ZR + .5]); }
      g += line(rail, 'det');
    }
    return g;
  }
  function tunnel(y: number) {
    const x = -42, w = XP - x, d = 28, h = 40;
    return box(x, y - d / 2, ZR, w, d, h, 'paper', 'body', 'tint') + on(SIDE(XP, y + d / 2, ZR + h), `<path class="f paper" d="M2 ${h}V13A12 12 0 0 1 26 13V${h}Z"/><path class="f blk" d="M4.5 ${h}V14A9.5 9.5 0 0 1 23.5 14V${h}Z"/>`) +
      on(TOP(x, y - d / 2, ZR + h), `<line class="det" x1="3" y1="3" x2="3" y2="${d - 3}"/>`);
  }

  function draw(t: number) {
    t = wrap(t, PERIOD);
    let s = K.plinth(-44, -50, XS1 + 48, 100);
    s += [0, 1, 2].map(track).join('');
    // Tunnels and wagons, back to front
    const items: [number, string][] = TR.map((y) => [-28 + y - 10, tunnel(y)]);
    const gl = glow(t);
    TR.forEach((_, i) => {
      const p = along(i, sOf(i, t)), cut = p.x < XB ? XP - p.x : -1e3;
      if (p.x - WL / 2 > XS + 2 || p.x + WL / 2 < XP) return;
      const g = wagon(p.x, p.y, p.a, cut);
      items.push([p.x + p.y, g + lit(g, gl)]);
    });
    s += items.sort((a, b) => a[0] - b[0]).map((q) => q[1]).join('');
    // The shed the train runs into: walls, a pitched roof, a lantern on the ridge
    const SW = 40, SH = 46, y0 = -SW / 2;
    s += box(XS, y0, ZR, XS1 - XS, SW, SH, 'paper', 'body', 'tint') + on(FRONT(XS, y0 + SW, ZR + SH), [1, 2, 3, 4, 5, 6, 7].map((q) => `<rect class="det" x="${q * 12 - 4}" y="10" width="6" height="8" rx=".5"/>`).join(''));
    s += K.poly([[XS1, y0, ZR + SH], [XS1, y0 + SW, ZR + SH], [XS1, 0, ZR + SH + 14]], 'f body') + K.poly([[XS, y0 + SW, ZR + SH], [XS1, y0 + SW, ZR + SH], [XS1, 0, ZR + SH + 14], [XS, 0, ZR + SH + 14]], 'f paper');
    s += box(XS + 30, -4, ZR + SH + 12, 10, 8, 8, 'paper', 'body', 'tint');
    return hue('a', s);
  }
  return {
    aria: 'A rail yard. Three wagons with the same company mark come out of three tunnels, run onto one line, couple into one train and go into one shed together.',
    period: PERIOD, rest: 5.2, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
  };
})();

export const ALTS: Record<string, Alt> = {
  'alt-galton-1': { of: 'galton', idea: 'Штанга поливу над рядом горщиків: вода ллється на голу землю, доки маховик не пересуне сопла на два горщики з паростками', piece: boom },
  'alt-galton-2': { of: 'galton', idea: 'Машина для подачі м’ячів: м’ячі перелітають кошик у великий бак, доки ствол не опустять — тоді падають у кошик', piece: launcher },
  'alt-lineshaft-1': { of: 'lineshaft', idea: 'Млиновий жолоб із колесами: великі крутяться під повними жолобами, мале стоїть сухе, доки йому не піднімуть заслінку', piece: millrace },
  'alt-lineshaft-2': { of: 'lineshaft', idea: 'Три вагони з однаковою міткою компанії виходять із різних тунелів, зчіплюються в один потяг і заходять в одне депо', piece: coupling },
};
