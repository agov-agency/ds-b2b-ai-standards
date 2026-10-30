// Scenarios hub hero: a wind-up music-box movement. The drum (case, a) turns by itself; its pins (skills, b) pluck the
// comb's teeth (rules, c) one after another, each tooth flexing and lighting as its pin passes. The key unwinds and the
// governor fan spins: a routine that runs itself on a cadence, chaining skills through rules.
import { kernel, hue, k, f, type Piece, type V3 } from './iso';

const PERIOD = 8, TAU = 2 * Math.PI;
const X0 = 30, X1 = 170, R = 34, CY = 60, ZP = 16, ZF = 8, CZ = ZP + 8 + R;  // bedplate top ZP on feet; drum along x
const N = 8, PITCH = (X1 - X0) / N, TW = PITCH - 4, TIP = CY + R + 2, ROOT = TIP + 36, BASE = ROOT + 22, TZ = CZ + 1;
const TUNE = [0, 2, 4, 6, 7, 5, 3, 1, 0, 3, 5, 7, 6, 4, 2, 1, 3, 5, 7, 6, 4, 2, 0, 1], M = TUNE.length, PIN = 7, RH = R + PIN; // tooth per pin, pins evenly round
const A = 5, REL = -.02;                                                     // a pin bends its tooth's tip down by A, slips off at drum angle REL
const ez = (a: number) => ((ROOT - CY - RH * Math.cos(a)) / (ROOT - TIP)) ** 2; // tooth bend profile (e²) under the pin head
const LIFT = RH * Math.sin(REL) + A * ez(REL);                                // head height over the axis at first touch, so the press ends at exactly -A
// The tooth only moves while the head rides on it: its surface under the head stays LIFT - 1 below the head centre.
const press = (a: number) => (Math.abs(a) < .5 ? Math.min(0, (RH * Math.sin(a) - LIFT) / ez(a)) : 0);
const BX = X1 + 30, BY = 22, BR = 20, BH = 32, KZ = ZP + BH + 9;             // spring barrel, key root
const GX = X1 + 34, GY = 120, GZ = ZP + 32;                                  // governor bracket top
const PY0 = -8, PX = X1 + 64, PY = BASE + 14;
const K = kernel([[0, PY0, 0], [PX, PY0, 0], [0, PY, 0], [PX, PY, 0], [0, PY0, ZP], [X0, CY, CZ + R + PIN + 4], [X0 - 6, CY, CZ + R + 22], [BX, BY, KZ + 26], [GX, GY, GZ + 28]], 60);
const { P, D, TOP, SIDE, on, poly, line, box, cyl, cylX, ring } = K;

const tx = (i: number) => X0 + 2 + i * PITCH;                                // left edge of tooth / track i
const arc = (x: number, r: number, a0: number, a1: number, n = 24): V3[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [x, CY + r * Math.cos(a), CZ + r * Math.sin(a)] as V3; });
const wrap = (a: number) => { a = ((a % TAU) + TAU) % TAU; return a > Math.PI ? a - TAU : a; };
const seen = (a: number) => Math.cos(a) + Math.sin(a) > 0;                   // drum normal faces the viewer
const uv = (r: number, a: number) => `${f(-r * Math.cos(a))} ${f(-r * Math.sin(a))}`; // drum angle on a SIDE plane (u = -y, v = -z)
const circ = (cls: string, cx: number | string, cy: number | string, r: number) => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}"/>`;
// A vertical plane through (x, y, z) turned phi about z; local x along the turn, y down.
const vplane = (x: number, y: number, z: number, phi: number) =>
  `matrix(${[...D(Math.cos(phi), Math.sin(phi), 0), ...D(0, 0, -1), ...P(x, y, z)].map((n) => n.toFixed(3)).join(' ')})`;

const pin = (j: number, a: number) => {
  const x = tx(TUNE[j]) + TW / 2, b = P(x, CY + R * Math.cos(a), CZ + R * Math.sin(a)), h = P(x, CY + RH * Math.cos(a), CZ + RH * Math.sin(a));
  return `<path class="f" d="M${f(b[0])} ${f(b[1])}L${f(h[0])} ${f(h[1])}"/>` + circ('f body', f(h[0]), f(h[1]), 3.8);
};

// One tongue of the comb, its tip bent by w (cantilever curve), lit by g.
const tooth = (i: number, w: number, g: number) => {
  const edge = (x: number, dz: number) => Array.from({ length: 7 }, (_, n) => { const e = n / 6; return [x, ROOT - (ROOT - TIP) * e, TZ + dz + w * e * e] as V3; });
  const r = edge(tx(i) + TW, 0), top = [...edge(tx(i), 0), ...[...r].reverse()];
  return poly([...r, ...edge(tx(i) + TW, -2).reverse()], 'f body') + poly(top, 'f tint') +
    (g > .01 ? `<g class="lit" style="opacity:${g.toFixed(2)}">${poly(top, 'f body')}</g>` : '');
};

// Toothed outline on the drum end face, turned by th.
const gear = (r0: number, r1: number, th: number, teeth = 36) =>
  'M' + Array.from({ length: teeth * 4 }, (_, q) => uv(q % 4 < 2 ? r1 : r0, th + q * TAU / (teeth * 4))).join('L') + 'Z';

// Bearing block: a screwed flange and a pillar carrying the axle.
const block = (x: number, stub: boolean) =>
  box(x - 4, CY - 18, ZP, 20, 36, 4) + on(TOP(x - 4, CY - 18, ZP + 4), circ('f paper', 10, 4.5, 2.4) + circ('f paper', 10, 31.5, 2.4)) +
  box(x, CY - 10, ZP + 4, 12, 20, CZ + 12 - ZP - 4) +
  (stub ? on(SIDE(x + 12, CY, CZ), circ('f tint', 0, 0, 7)) + cylX(x + 12, x + 16, CY, CZ, 4, 'paper', 'body') : '');

const ratchet = (z: number, th: number, cls: string) => on(TOP(BX, BY, z), `<path class="f ${cls}" d="M` +
  Array.from({ length: 24 }, (_, q) => { const a = th + (q >> 1) * TAU / 12 + (q % 2) * TAU / 12.6, r = q % 2 ? 13 : 10; return `${f(r * Math.cos(a))} ${f(r * Math.sin(a))}`; }).join('L') + 'Z"/>');

// Governor: a worm shaft held by a bracket, topped by a two-vane air brake that spins fast and keeps the cadence.
const governor = (phi: number) => {
  const vane = (s: number) => on(vplane(GX, GY, GZ + 22, phi), `<rect class="f tint" x="${s > 0 ? 3 : -19}" y="0" width="16" height="13" rx=".8"/>`);
  const back = Math.cos(phi) + Math.sin(phi) < 0 ? 1 : -1;                   // the vane on the far side goes first
  let g = box(GX - 10, GY - 18, ZP, 20, 28, 3) + on(TOP(GX - 10, GY - 18, ZP + 3), circ('f paper', 4.5, 23.5, 2.2) + circ('f paper', 15.5, 23.5, 2.2));
  g += box(GX - 4, GY - 17, ZP + 3, 8, 6, GZ - ZP - 3) + cyl(GX, GY, ZP + 3, 2.2, GZ - ZP - 3);
  for (let z = ZP + 8; z < GZ - 6; z += 3.5) g += cyl(GX, GY, z, 4.6, 2.2, 'paper', 'body');
  g += box(GX - 4, GY - 17, GZ, 8, 22, 4) + on(TOP(GX - 4, GY - 17, GZ + 4), circ('det', 4, 17, 3.4));
  return g + vane(back) + cyl(GX, GY, GZ + 4, 2.2, 22) + vane(-back) + cyl(GX, GY, GZ + 24, 3.2, 3, 'paper', 'body');
};

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;                                        // exact wrap: draw(t) === draw(t + PERIOD)
  const th = -TAU * t / PERIOD, as = TUNE.map((_, j) => wrap(TAU * j / M + th + .4));
  // Each pin's time from release s (-half a loop … +half a loop) drives its tooth: pressed while the head rides it,
  // ringing after; the tooth's colour fades in as its pin arrives and out as it rings down. A pin's own colour fades in
  // as it turns into view and out once it has slipped under the comb, so no colour pops at a paint-order change.
  const w = Array(N).fill(0), g = Array(N).fill(0), lv: number[] = [];
  const ss = as.map((a) => { const s = (((REL - a) % TAU + TAU) % TAU) / TAU * PERIOD; return s >= PERIOD / 2 ? s - PERIOD : s; });
  as.forEach((a, j) => {
    const s = ss[j], i = TUNE[j];
    w[i] += s < 0 ? press(a) : -A * Math.cos(TAU * 6 * s) * Math.exp(-s / .14);
    g[i] = Math.max(g[i], s < 0 ? k(s, -.5, 0) : 1 - k(s, .2, 1.1));
    lv[j] = k(Math.sin(a + Math.PI / 4), 0, .45) * (s < 0 ? 1 : 1 - k(s, 0, .45));
  });
  // A front pin sits over the comb while its head is above its tooth's surface (it changes side only as the freed tooth snaps past it).
  const over = as.map((a, j) => (Math.abs(a) < .5 ? RH * Math.sin(a) - 1 > w[TUNE[j]] * ez(a) : a > 0));
  const pins = (pick: (j: number) => boolean) => {
    const js = as.map((_, j) => j).filter(pick), lit = js.filter((j) => lv[j] > .01);
    return hue('b', js.map((j) => pin(j, as[j])).join('') +
      (lit.length ? `<g class="lit">${lit.map((j) => `<g style="opacity:${lv[j].toFixed(2)}">${pin(j, as[j])}</g>`).join('')}</g>` : ''));
  };

  let svg = '';
  for (const [x, y] of [[16, PY0 + 16], [PX - 16, PY0 + 16], [16, PY - 16], [PX - 16, PY - 16]]) svg += hue('a', cyl(x, y, 0, 7, ZF, 'body', 'body'));
  svg += hue('a', box(0, PY0, ZF, PX, PY - PY0, ZP - ZF, 'paper', 'body', 'blk') +
    on(TOP(0, PY0, ZP), [[9, 9], [PX - 9, 9], [9, PY - PY0 - 9], [PX - 9, PY - PY0 - 9]].map(([x, y]) => circ('f paper', x, y, 2.6)).join('')) +
    block(X0 - 20, false));
  svg += pins((j) => !seen(as[j]));
  svg += hue('a', cylX(X0, X1, CY, CZ, R, 'paper', 'tint') + line(arc(X0 + 4, R, -Math.PI / 4, 3 * Math.PI / 4), 'det') + line(arc(X1 - 4, R, -Math.PI / 4, 3 * Math.PI / 4), 'det'));
  svg += pins((j) => seen(as[j]) && !over[j]);
  // Comb: tongues, the raised block it sits on, its solid back clamped by a screwed bar
  let comb = '';
  for (let i = 0; i < N; i++) comb += tooth(i, w[i], g[i]);
  svg += hue('c', comb) + hue('a', box(X0 + 4, ROOT + 4, ZP, X1 - X0 - 8, BASE - ROOT - 8, TZ - 6 - ZP, 'paper', 'body', 'tint') +
    line([[X0 + 4, BASE - 4, ZP + 7], [X1 - 4, BASE - 4, ZP + 7], [X1 - 4, ROOT + 4, ZP + 7]], 'det'));
  svg += hue('c', box(X0 - 2, ROOT, TZ - 6, X1 - X0 + 4, BASE - ROOT, 6, 'tint', 'body') + box(X0 + 4, ROOT + 6, TZ, X1 - X0 - 8, 11, 4, 'paper', 'body') +
    on(TOP(X0 + 4, ROOT + 6, TZ + 4), [10, 38, 66, 94, 122].map((x) => circ('f paper', x, 5.5, 3) + `<path class="det" d="M${x - 2} 5.5h4"/>`).join('')));
  svg += pins((j) => seen(as[j]) && over[j]);
  // Great wheel on the drum end, turning with it
  svg += hue('a', on(SIDE(X1, CY, CZ), `<path class="f body" d="${gear(R - 3, R + 1, th)}"/>`) + cylX(X1, X1 + 4, CY, CZ, R - 3, 'paper', 'body') +
    on(SIDE(X1 + 4, CY, CZ), `<path class="f paper" d="${gear(R - 3, R + 1, th)}"/><circle class="det" r="${R - 7}"/>` +
      [0, 1, 2, 3].map((q) => `<circle class="f tint" r="5" transform="translate(${uv(R - 16, th + q * TAU / 4)})"/>`).join('')));
  // Spring barrel with ratchet and butterfly key (the one dark part), unwinding half a turn per loop
  const phi = Math.PI * t / PERIOD;
  svg += hue('a', cyl(BX, BY, ZP, BR, BH, 'paper', 'body') + line(ring(BX, BY, ZP + BH - 7, BR, -Math.PI / 4, 3 * Math.PI / 4, 24), 'det') +
    ratchet(ZP + BH, phi, 'body') + ratchet(ZP + BH + 3, phi, 'paper') + cyl(BX, BY, ZP + BH + 3, 3.5, 6, 'paper', 'body')) +
    on(vplane(BX, BY, KZ, phi - 1.24), `<path class="f blk" d="M-3 0V-5C-3-9-16-9-16-17C-16-25-6-26 0-19C6-26 16-25 16-17C16-9 3-9 3-5V0Z"/>` + circ('f paper', -8.5, -17, 2.6) + circ('f paper', 8.5, -17, 2.6));
  svg += hue('a', block(X1 + 8, true) + governor(TAU * 4 * t / PERIOD + 1.86));
  return svg;
}

export const scenarios: Piece = {
  aria: 'A wind-up music box. Pins on a turning drum pluck the teeth of a steel comb one after another while the key unwinds and the governor spins.',
  period: PERIOD, rest: 1.16, viewBox: K.viewBox, draw,
};
