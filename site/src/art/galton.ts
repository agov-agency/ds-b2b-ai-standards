// Scenario "Targeting vs who actually buys": a Galton board. The budget drops as balls through the pins into bins;
// only two bins have a trapdoor into the deals tray below. Turning the screw on the side moves the deflector under
// the hopper, and the pile shifts over to the bins that actually pay out.
import { kernel, hue, k, lerp, f, type Piece } from './iso';

const PERIOD = 8, BW = 150, BT = 14, BZ = 34, BH = 214, TOP = BZ + BH;       // board width, thickness, bottom, height
const PIN0 = 70, ROWS = 8, PH = 9, PW = 9, BIN0 = 154, NB = 8, BINW = (BW - 20) / NB, BALL = 3.1;
const PAY = [5, 6];                                                          // the bins that drop into the deals tray
const A = [1, 3, 5, 6, 4, 2, 1, 1], B = [0, 1, 2, 3, 4, 3, 2, 1];             // balls per bin before / after the turn
const K = kernel([[-6, -6, 0], [BW + 26, BT + 40, 0], [-6, BT + 40, 0], [BW + 26, -6, TOP + 6], [-6, -6, TOP + 6]], 22);
const { on, box, cylX, SIDE, FRONT, TOP: TOPF, arrow } = K;
const sphere = (x: number, y: number, z: number, cls = 'body') => { const [sx, sy] = K.P(x, y, z + BALL); return circ(cls, sx, sy); };

const hash = (i: number, r: number) => { const x = Math.sin(i * 127.1 + r * 311.7) * 43758.5453; return x - Math.floor(x); };
const shift = (t: number) => k(t, 3.1, 4.1) - k(t, 7.1, 8);                   // deflector: 0 left, 1 right
const dx = (s: number) => lerp(BW / 2 - 13, BW / 2 + 13, s);
const circ = (cls: string, x: number, y: number, r = BALL) => `<circle class="f ${cls}" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;

// One ball's place on the board face at time t (local x right, y down from the top), or null once it has landed
function ballAt(i: number, t0: number, t: number): [number, number] | null {
  const u = t - t0, fall = 1.5;
  if (u < 0 || u > fall) return null;
  let x = dx(shift(t0)), y = 40 + u / fall * (BIN0 - 40 + 6);
  for (let r = 0; r < ROWS; r++) {
    const yr = PIN0 + r * PH;
    if (y < yr) break;
    const step = hash(i, r) < .5 ? -PW / 2 : PW / 2, e = Math.min(1, (y - yr) / PH);
    x += step * e;
  }
  return [Math.min(BW - 12, Math.max(12, x)), y];
}

function face(t: number) {
  const s = shift(t);
  let g = `<path class="f tint" d="M0 0H${BW}V${BH}H0Z"/>`;
  // Hopper and its throat, the deflector wedge on a slide
  g += `<path class="f paper" d="M14 10H${BW - 14}L${BW / 2 + 8} 40H${BW / 2 - 8}Z"/><path class="det" d="M${BW / 2 - 24} 22H${BW / 2 + 24}"/>`;
  g += `<rect class="f body" x="${BW / 2 - 30}" y="47" width="60" height="4" rx=".5"/>`;
  g += `<g class="lit"><path class="f body" d="M${f(dx(s) - 7)} 58L${f(dx(s))} 46L${f(dx(s) + 7)} 58Z"/></g>`;
  // Pins
  for (let r = 0; r < ROWS; r++) for (let c = -7; c <= 7; c++) {
    const x = BW / 2 + c * PW + (r % 2 ? PW / 2 : 0);
    if (x > 8 && x < BW - 8) g += `<circle class="f paper" cx="${f(x)}" cy="${PIN0 + r * PH}" r="1.5"/>`;
  }
  // Bins: stacks follow the deflector with a lag; paying bins keep draining so they never fill
  const lag = shift(t - .9);
  for (let b = 0; b < NB; b++) {
    const x0 = 10 + b * BINW, pay = PAY.includes(b), n = Math.round(lerp(A[b], B[b], lag));
    for (let q = 0; q < n * 2; q++) g += circ(pay ? 'body' : 'paper', x0 + BINW / 2 + (q % 2 ? 3.4 : -3.4), BH - 8 - Math.floor(q / 2) * 6.4 - (q % 2) * 1.2);
    if (b) g += `<rect class="f paper" x="${x0 - 1.2}" y="${BIN0 - 4}" width="2.4" height="${BH - BIN0 + 4}"/>`;
  }
  // Falling balls (newest first)
  for (let i = 0; i < 64; i++) {
    const t0 = Math.floor(t / .22) * .22 - i * .22, p = ballAt(Math.round(t0 / .22), t0, t);
    if (p) g += circ('paper', p[0], p[1]);
  }
  // Frame lip round the face
  g += `<path class="f paper" fill-rule="evenodd" d="M-4 -4H${BW + 4}V${BH + 4}H-4ZM4 4V${BH - 4}H${BW - 4}V4Z"/>`;
  PAY.forEach((b) => { g += `<rect class="f blk" x="${10 + b * BINW + 2}" y="${BH - 3}" width="${BINW - 4}" height="3"/>`; });
  return g;
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const turn = 2 * Math.PI * 1.5 * shift(t);
  let s = '';
  // Feet, back board, side, top
  for (const x of [10, BW - 26]) s += box(x, -8, 0, 16, BT + 30, BZ, 'paper', 'body', 'tint');
  s += box(-4, -4, BZ - 4, BW + 8, BT + 4, BH + 8, 'paper', 'body', 'paper');
  // Deals tray under the paying bins: balls drop through the trapdoors into it
  const tx = 10 + PAY[0] * BINW - 6, tw = BINW * 2 + 12, ty = BT + 4;
  s += on(FRONT(0, BT, TOP), face(t));
  s += box(tx, ty, 2, tw, 30, 3, 'paper', 'body', 'blk') + box(tx, ty, 5, 3, 30, 10) + box(tx, ty, 5, tw, 3, 10);
  for (let q = 0; q < 5; q++) s += sphere(tx + 9 + q * 6.4, ty + 12 + (q % 2) * 7, 5);
  const v = ((t * 2.2) % 1);
  if (shift(t - .9) > .5) s += `<g class="lit">${sphere(tx + tw / 2, BT + v * 12, BZ - 6 - v * 24)}</g>`;
  s += box(tx, ty + 27, 5, tw, 3, 10, 'paper', 'body', 'tint') + box(tx + tw - 3, ty, 5, 3, 30, 10);
  // Adjusting screw on the right edge: a threaded rod into the board and a knurled knob
  const zk = TOP - 50;
  s += cylX(BW + 4, BW + 12, BT / 2 - 2, zk, 2.2) + cylX(BW + 12, BW + 22, BT / 2 - 2, zk, 7, 'paper', 'tint') +
    on(SIDE(BW + 22, BT / 2 - 2, zk), `<g class="lit"><path class="f body" d="M${f(-5 * Math.sin(turn))} ${f(-5 * Math.cos(turn))}L${f(5 * Math.sin(turn))} ${f(5 * Math.cos(turn))}"/></g><circle class="det" r="2"/>`);
  s += on(TOPF(-4, -4, TOP + 4), `<rect class="det" x="${BW / 2 - 20}" y="3" width="40" height="${BT - 2}" rx="1"/>`);
  return hue('a', s) + arrow(K.curve([BW + 34, BT / 2, zk + 22], [BW + 40, BT / 2 + 6, zk], [BW + 30, BT / 2 + 8, zk - 16]), { dot: true });
}

export const galton: Piece = {
  aria: 'A Galton board. Balls fall through pins into bins and only two bins drop into a tray; a screw on the side moves the deflector and the pile shifts to those bins.',
  period: PERIOD, rest: 5.2, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
