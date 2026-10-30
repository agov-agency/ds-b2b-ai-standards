// Scenario "Competitor watch" (option): a strip-chart recorder. One pen per competitor, the main rival on the heaviest
// pen; blank paper unrolls under the pens and winds onto the take-up roll, a tick across it every week. Most weeks the
// lines barely wander; when a rival changes something that matters, its pen kicks and the kick rides the paper away.
import { kernel, hue, f, type Piece, type V3 } from './iso';
import { lit, rope } from './icons';

const PERIOD = 9, TAU = 2 * Math.PI;
const BW = 132, BD = 168, BZ = 12, TZ = 36;                                   // plinth; table top
const X0 = 22, X1 = 110, Y0 = 26, Y1 = 142, R0 = 10, R1 = 13;                   // paper edges; supply roll at Y0, take-up at Y1
const PY = 64, V = 120 / PERIOD;                                                 // pen line; paper speed (one loop = 120 of paper)
const L = V * PERIOD, WEEK = L / 3;
const LANES = [{ x: 40, tip: 3.4, k: 1 }, { x: 66, tip: 2.6, k: .6 }, { x: 92, tip: 2, k: .35 }]; // main rival down to keep an eye on
const KICK = 0, AT = WEEK * .55;                                                 // the lane that kicks, where on the paper
const K = kernel([[0, 0, 0], [BW, 0, 0], [0, BD, 0], [BW, BD, 0], [X0, PY - 40, TZ + 40], [X1 + 12, Y1, 0]], 20);
const { P, on, line, box, cyl, cylX, TOP } = K;

// Pen value at paper coordinate m (fixed to the paper): a small wander, plus the kick on the main rival's lane
const bump = (m: number) => { const d = ((m - AT) % L + L) % L; return d < 14 ? Math.sin(Math.PI * d / 14) ** 2 * (d < 7 ? 1 : -.55) : 0; };
const val = (j: number, m: number) => LANES[j].k * (1.4 * Math.sin(TAU * 5 * m / L + j * 2) + .8 * Math.sin(TAU * 13 * m / L + j)) + (j === KICK ? 11 * bump(m) : 0);

const roll = (y: number, r: number, a: number) => {
  const cz = TZ - r;
  return box(X0 - 12, y - 4, BZ, 6, 8, cz - BZ + 3, 'paper', 'body') + box(X1 + 6, y - 4, BZ, 6, 8, cz - BZ + 3, 'paper', 'body', 'tint') +
    cylX(X0 - 6, X1 + 6, y, cz, r, 'paper', 'tint') + cylX(X1 + 6, X1 + 12, y, cz, 3, 'paper', 'body') +
    line([[X1 + 6, y, cz], [X1 + 6, y + r * .8 * Math.cos(a), cz + r * .8 * Math.sin(a)]], 'det');
};

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const off = V * t, m = (y: number) => y - PY - off; // paper written at y left the pen (y - PY) / V ago
  let s = K.plinth(0, 0, BW, BD);
  s += box(X0 - 4, Y0 + 6, BZ, X1 - X0 + 8, Y1 - Y0 - 12, TZ - BZ - 1, 'paper', 'body', 'tint');
  s += roll(Y0, R0, -off / R0);
  // Paper: blank above the pens, written below; weekly ticks ride along with it
  let g = `<rect class="f paper" x="0" y="0" width="${X1 - X0}" height="${Y1 - Y0}"/>`;
  for (let q = -3; q < 4; q++) { const y = PY + off % WEEK + q * WEEK - Y0; if (y > 2 && y < Y1 - Y0 - 2) g += `<path class="det dashed" d="M0 ${f(y)}H${X1 - X0}"/>`; }
  s += on(TOP(X0, Y0, TZ), g);
  let kick = '';
  LANES.forEach((ln, j) => {
    const pts: string[] = [];
    for (let y = PY; y <= Y1 - 2; y += 1.5) pts.push(P(ln.x + val(j, m(y)), y, TZ).map(f).join(' '));
    s += `<path class="det" d="M${pts.join('L')}"/>`;
    if (j === KICK) {
      const seg: V3[] = [];
      for (let y = PY; y <= Y1 - 2; y += .75) if (bump(m(y)) !== 0) seg.push([ln.x + val(j, m(y)), y, TZ]);
      if (seg.length > 1) kick = rope(K, seg, 1.8, 'f body');
    }
  });
  s += lit(kick);
  // Pen bridge: a rail across the back, each pen on an arm from its pivot to the tip on the pen line
  s += box(X0 - 8, PY - 40, TZ, 6, 6, 18, 'paper', 'body') + box(X1 + 2, PY - 40, TZ, 6, 6, 18, 'paper', 'body', 'tint') + K.cylX(X0 - 8, X1 + 8, PY - 37, TZ + 18, 2.6);
  LANES.forEach((ln, j) => {
    const tip: V3 = [ln.x + val(j, m(PY)), PY, TZ], pv: V3 = [ln.x, PY - 37, TZ + 18], hot = j === KICK && bump(m(PY)) !== 0;
    const arm = line([pv, [tip[0], tip[1] - 4, TZ + 6]], 'tube-o') + line([pv, [tip[0], tip[1] - 4, TZ + 6]], 'tube-i') + cyl(ln.x, PY - 37, TZ + 14, 3.4, 8, 'paper', 'body');
    const pen = cyl(tip[0], tip[1], TZ + .5, ln.tip, 8, 'paper', 'body') + cyl(tip[0], tip[1], TZ + 8.5, ln.tip * .55, 3, 'paper', 'tint');
    s += arm + (hot ? lit(pen) : pen);
  });
  s += roll(Y1, R1, off / R1);
  // Drive: a motor box beside the take-up roll
  s += box(X1 + 14, Y1 - 14, BZ, 14, 22, 20, 'paper', 'body', 'tint') + cyl(X1 + 21, Y1 - 3, BZ + 20, 4, 3, 'paper', 'body');
  return hue('a', s) + K.arrow([[X1 + 18, Y0 + 14, TZ + 2], [X1 + 18, Y1 - 30, TZ + 2]], { dot: true });
}

export const seismo: Piece = {
  aria: 'A strip-chart recorder with one pen per competitor. Paper unrolls under the pens week by week; the main rival’s pen kicks when it changes something, and the kick rides the paper onto the take-up roll.',
  period: PERIOD, rest: .9, viewBox: K.viewBox, focus: [0.5, 0.5], draw,
};
