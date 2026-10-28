// Scenario "Account audit by cadence": a brass orrery. The account is the ball in the middle; eight arms carry the
// checks round it at four speeds (daily, weekly, monthly, quarterly). Each time an arm passes the inspection post its
// ball raises a flag. The crank at the base never turns: the machine flags, a person decides.
import { kernel, hue, k, f, type Piece, type V3 } from './iso';

const PERIOD = 9, TAU = 2 * Math.PI;
const BR = 64, BZ = 12, CZ = 92, CR = 15;                                    // base radius / height, centre ball height / radius
const ARMS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
  r: 30 + i * 4.6, z: 26 + i * 5.2, turns: [4, 4, 3, 3, 2, 2, 1, 1][i], ph: i * 2.1, ball: [4, 4.5, 5.5, 5, 6.5, 6, 7.5, 7][i], drop: 6 + (i % 3) * 5,
}));
const LIVE = [1, 4, 6];                                                       // checks that carry the accent all the way round
const POST = Math.PI / 4 + .62;                                               // inspection post angle (front right)
const K = kernel([[-BR, -BR, 0], [BR, BR, 0], [-BR, BR, 0], [BR, -BR, 0], [0, 0, CZ + CR + 4], [BR + 18, 0, 20], [BR + 20, BR + 20, 80]], 22);
const { P, on, poly, line, cyl, ring, cylX, TOP } = K;

const ball = (x: number, y: number, z: number, r: number, cls = 'paper') => {
  const [sx, sy] = P(x, y, z);
  return `<circle class="f ${cls}" cx="${f(sx)}" cy="${f(sy)}" r="${r}"/><path class="det" d="M${f(sx - r * .62)} ${f(sy - r * .1)}A${r * .7} ${r * .7} 0 0 1 ${f(sx + r * .1)} ${f(sy - r * .62)}"/>`;
};
const near = (a: number) => { const d = ((a - POST) % TAU + TAU) % TAU; return d > Math.PI ? d - TAU : d; };

function arm(i: number, a: number) {
  const A = ARMS[i], x = A.r * Math.cos(a), y = A.r * Math.sin(a), bz = A.z - A.drop;
  // Flag: a hinged vane on top of the ball, folded back along the path; it tips up as the arm crosses the post and
  // folds down after. It takes the accent as it rises.
  const d = near(a), up = k(d, -.5, -.1) * (1 - k(d, .35, .8)), phi = .12 + (Math.PI / 2 - .12) * up;
  const bk = [Math.sin(a), -Math.cos(a)], rx = Math.cos(a), ry = Math.sin(a), L = 10;
  const hz = bz + A.ball, p = [bk[0] * Math.cos(phi), bk[1] * Math.cos(phi), Math.sin(phi)];
  const top: V3 = [x + p[0] * L, y + p[1] * L, hz + p[2] * L], at = (u: number, o: number): V3 => [top[0] - p[0] * u + rx * o, top[1] - p[1] * u + ry * o, top[2] - p[2] * u];
  const vane = poly([top, at(2.5, 6.5), at(5, 0)], 'f paper');
  const rod: V3[] = [[5.5 * Math.cos(a), 5.5 * Math.sin(a), A.z], [x, y, A.z], [x, y, hz]];
  const g = line(rod, 'tube-o') + line(rod, 'tube-i');
  const flag = line([[x, y, hz], top], 'f') + vane + (up > .01 ? `<g class="lit" style="opacity:${f(up)}">${poly([top, at(2.5, 6.5), at(5, 0)], 'f body')}</g>` : '');
  // The folded vane lies behind the ball when its arm points away from us; draw it first then
  const behind = bk[0] + bk[1] < 0 && up < .5;
  const b = LIVE.includes(i) ? `<g class="lit">${ball(x, y, bz, A.ball, 'body')}</g>` : ball(x, y, bz, A.ball);
  return g + (behind ? flag : '') + b + (behind ? '' : flag);
}

function draw(t: number) {
  t = ((t % PERIOD) + PERIOD) % PERIOD;
  const as = ARMS.map((A) => A.ph + TAU * A.turns * t / PERIOD);
  // Base: stepped drum with a scale ring, the inspection post and the idle crank
  let s = cyl(0, 0, 0, BR, BZ - 4, 'paper', 'body') + cyl(0, 0, BZ - 4, BR - 4, 4, 'paper', 'tint') +
    on(TOP(0, 0, BZ), Array.from({ length: 48 }, (_, q) => { const a = q * TAU / 48, r0 = BR - 10, r1 = BR - (q % 4 ? 7 : 5); return `<path class="det" d="M${f(r0 * Math.cos(a))} ${f(r0 * Math.sin(a))}L${f(r1 * Math.cos(a))} ${f(r1 * Math.sin(a))}"/>`; }).join('') + `<circle class="det" r="${BR - 12}"/>`) +
    cyl(0, 0, BZ, 12, 6, 'paper', 'body');
  s += cylX(BR - 2, BR + 8, 0, 6, 3) + K.box(BR + 8, -2.5, 3, 3, 5, 20, 'paper', 'body') + cylX(BR + 11, BR + 19, 0, 20, 2.4, 'blk', 'blk');
  // Arms behind the column, the column and the account, then the arms in front
  const order = ARMS.map((_, i) => i).sort((p, q) => {
    const dp = ARMS[p].r * (Math.cos(as[p]) + Math.sin(as[p])), dq = ARMS[q].r * (Math.cos(as[q]) + Math.sin(as[q]));
    return dp - dq;
  });
  const back = order.filter((i) => Math.cos(as[i]) + Math.sin(as[i]) < 0), front = order.filter((i) => Math.cos(as[i]) + Math.sin(as[i]) >= 0);
  const c = Math.cos(POST), sn = Math.sin(POST), px = (BR + 12) * c, py = (BR + 12) * sn;
  const post = cyl(px, py, 0, 7, 4, 'paper', 'body') + cyl(px, py, 4, 2.6, 70, 'paper', 'body') +
    line([[px, py, 72], [(BR - 20) * c, (BR - 20) * sn, 72]], 'tube-o') + line([[px, py, 72], [(BR - 20) * c, (BR - 20) * sn, 72]], 'tube-i') + cyl((BR - 20) * c, (BR - 20) * sn, 66, 1.6, 6, 'blk', 'blk');
  const postBack = Math.cos(POST) + Math.sin(POST) < 0;
  s += (postBack ? post : '') + back.map((i) => arm(i, as[i])).join('');
  s += cyl(0, 0, BZ + 6, 3.2, CZ - CR - BZ - 4, 'paper', 'body') + ARMS.map((A) => cyl(0, 0, A.z - 1.5, 5.5, 3, 'paper', 'body')).join('') + ball(0, 0, CZ, CR, 'tint');
  s += front.map((i) => arm(i, as[i])).join('') + (postBack ? '' : post);
  return hue('a', s);
}

export const orrery: Piece = {
  aria: 'A brass orrery. Eight arms turn round a central ball at four speeds; each raises a small flag as it passes an inspection post, while the crank at the base stays still.',
  period: PERIOD, rest: 1.3, viewBox: K.viewBox, focus: [0.5, 0.45], draw,
};
