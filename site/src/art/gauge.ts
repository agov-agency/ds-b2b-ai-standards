// Rules hub hero: a go / no-go gauge on an inspection bench. Parts (a) ride a rail toward a notched jaw (c, rules).
// The ones that fit slip through the notch and on into the outlet; the oversized one stops at the jaw, a spring
// pusher kicks it into the reject bin and the lid drops shut. A rule is a check you apply before trusting a number.
import { kernel, hue, k, type Piece, type V3 } from './iso';

const BW = 110, BD = 232, ZF = 14, ZT = 26, RX = 40, RW = 70, RT = 36, CX = RX + RW / 2; // bench, rail (along y)
const G = 104, GT = 14, GH = 30, NX = CX - 18, NW = 36, NH = 21;   // gate front y, depth, height; notch x, width, height
const HF = G - 50, HB = 4, FB = G + 92, FF = G + 124;              // outlet hood front / back, feed hood back / front
const PITCH = 50, YS = G + 13, MOVE = .7;                          // slot spacing, slot-0 centre, seconds per index move
const GO = .9, REJ = 1.75, PERIOD = 2 * GO + REJ, SHUT = 2.1;      // two go steps, the reject step; lid shut (s into it)
const TX = BW + 1, TW = 54, TY = G, TD = 30, TZ = 14;               // reject bin hung on the bench side, lid clear of the knob
const K = kernel([[0, BD, 0], [BW, BD, 0], [TX + TW, TY + TD, TZ], [TX + TW + 9, TY, RT + TW], [RX, HB, RT + 26], [CX, -56, RT + 38], [BW, 0, ZT]], 64);
const { on, poly, line, box, cylX, cylY, FRONT, TOP, SIDE } = K;
const m3 = (a: number) => ((a % 3) + 3) % 3;
const sm = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
const screw = (x: number, y: number) => `<circle class="f paper" cx="${x}" cy="${y}" r="3.2"/><path class="det" d="M${x - 2} ${y + 2}L${x + 2} ${y - 2}"/>`;

// A part: go parts are small, the reject is the same part made too wide. Bored hole on top.
// lit (0..1) cross-fades in the live colour (blue on the dark hero) over the plain part, so it never pops.
const part = (x: number, y: number, z: number, big: boolean, lit = 0) => {
  const [w, d, h] = big ? [46, 18, 14] : [22, 14, 14];
  const g = hue('a', box(x - w / 2, y - d / 2, z, w, d, h, 'paper', 'body', 'tint') + on(TOP(x, y, z + h), `<circle class="det" r="${big ? 5 : 4}"/>`));
  return (lit < 1 ? g : '') + (lit > .005 ? `<g class="lit" style="opacity:${lit.toFixed(3)}">${g}</g>` : '');
};

// A block sitting on the rail with the notch cut from its bottom edge (the gate, and the outlet hood's mouth).
const uFace = (y: number, h: number, extra = '', face = 'tint') => on(FRONT(RX, y, RT + h),
  `<path class="f ${face}" d="M0 0H${RW}V${h}H${NX - RX + NW}V${h - NH}H${NX - RX}V${h}H0Z"/>` + extra);
const block = (y0: number, y1: number, h: number, front = '', face?: string) =>
  poly([[BW, y0, RT], [BW, y1, RT], [BW, y1, RT + h], [BW, y0, RT + h]], 'f body') +
  poly([[RX, y0, RT + h], [BW, y0, RT + h], [BW, y1, RT + h], [RX, y1, RT + h]], 'f paper') + uFace(y1, h, front, face);

let ticks = '';
for (let i = 4, c = 0; i < FF - HB - 2; i += 6, c++) ticks += `M${i} 0v${c % 5 ? 3 : 6}`;
const BENCH = hue('c',
  [[8, 8], [BW - 22, 8], [8, BD - 22], [BW - 22, BD - 22]].map(([x, y]) => box(x, y, 0, 14, 14, ZF, 'body')).join('') +
  box(0, 0, ZF, BW, BD, 4, 'blk', 'blk', 'blk') + box(0, 0, ZF + 4, BW, BD, ZT - ZF - 4, 'tint', 'body', 'body') +
  on(TOP(0, 0, ZT), screw(20, 14) + screw(20, BD - 14)) +
  box(RX, HB, ZT, RW, FF - HB, RT - ZT, 'paper', 'body', 'body') + on(SIDE(BW, FF, RT), `<path class="det" d="${ticks}"/>`) +
  line([[CX - 27, HB, RT], [CX - 27, FF, RT]], 'det') + line([[CX + 27, HB, RT], [CX + 27, FF, RT]], 'det'));
const MOUTH = on(FRONT(NX, HF, RT + NH), `<rect class="f blk" width="${NW}" height="${NH}"/>`);
const OUTLET = hue('c', block(HB, HF, 26, screw(8, 3) + screw(RW - 8, 3)) +
  on(TOP(RX, HB, RT + 26), [14, 22].map((y) => `<line class="det" x1="14" y1="${y}" x2="${RW - 14}" y2="${y}"/>`).join('')));
const NOTCH = hue('c', poly([[NX, G - GT, RT], [NX, G + 3, RT], [NX, G + 3, RT + NH], [NX, G - GT, RT + NH]], 'f body'));
// Hardened insert around the notch, standing 3 proud of the gate face: the part a reject actually hits.
const IX = NX - 6, IW = NW + 12, IH = NH + 6;
const INSERT = hue('c', poly([[IX, G, RT + IH], [IX + IW, G, RT + IH], [IX + IW, G + 3, RT + IH], [IX, G + 3, RT + IH]], 'f paper') +
  poly([[IX + IW, G, RT], [IX + IW, G + 3, RT], [IX + IW, G + 3, RT + IH], [IX + IW, G, RT + IH]], 'f body') +
  on(FRONT(IX, G + 3, RT + IH), `<path class="f tint" d="M0 0H${IW}V${IH}H${IW - 6}V6H6V${IH}H0Z"/><path class="det" d="M${IW / 2 - 3} 1.5H${IW / 2 + 3}L${IW / 2} 4.5Z"/>`));
const knurl = [-30, 0, 30, 60, 90, 120].map((a) => { const r = a * Math.PI / 180, y = G - GT / 2 + 7 * Math.cos(r), z = RT + 17 + 7 * Math.sin(r); return line([[BW + 5, y, z], [BW + 14, y, z]], 'det'); }).join('');
const GATE = hue('c', block(G - GT, G, GH, screw(8, 5) + screw(RW - 8, 5), 'paper') +
  cylX(BW, BW + 5, G - GT / 2, RT + 17, 3.5) + cylX(BW + 5, BW + 14, G - GT / 2, RT + 17, 7, 'paper', 'tint') + knurl +
  on(SIDE(BW + 14, G - GT / 2, RT + 17), '<circle class="det" r="2.5"/>'));
const stack = [0, 1, 2].map((i) => `<rect class="f body" x="6" y="${4 + i * 8}" width="18" height="6" rx=".5"/>`).join('');
const FEED = hue('c', box(RX, FB, RT, RW, FF - FB, 20, 'paper', 'body', 'tint') + on(FRONT(RX, FF, RT + 20), screw(8, 6) + screw(RW - 8, 6)) +
  box(CX - 15, FB + 6, RT + 20, 30, 20, 30, 'paper', 'body', 'tint') +
  on(FRONT(CX - 15, FB + 26, RT + 50), `<rect class="f paper" x="4" y="2" width="22" height="28" rx=".5"/>${hue('a', stack)}`));

// Spring pusher beside the rail, in line with the reject and clear of the insert face (y > G + 3); e = paddle travel.
const pusher = (e: number) => {
  const py = G + 12, pz = RT + 5, px = 45 + e;
  const coil: V3[] = Array.from({ length: 73 }, (_, i) => { const a = i / 72 * 10 * Math.PI; return [40 + (px - 41) * i / 72, py + 4 * Math.cos(a), pz + 4 * Math.sin(a)]; });
  return hue('c', box(12, py - 9, ZT, 24, 18, RT + 12 - ZT, 'paper', 'body', 'tint') + on(TOP(12, py - 9, RT + 12), screw(6, 9) + screw(18, 9)) +
    cylX(36, 39, py, pz, 5.5, 'tint') + cylX(39, px, py, pz, 2.5, 'paper', 'body') + line(coil, 'det') + box(px, py - 8, RT + 1, 4, 16, 19, 'paper', 'body', 'tint'));
};

// Reject bin hooked on the bench side, lid hinged on its outer edge (phi 0 = shut).
const bin = (inner: string, phi: number) => {
  const x1 = TX + TW, y1 = TY + TD, h = RT - TZ, c = Math.cos(phi), s = Math.sin(phi);
  const p = (a: number, b: number, y: number): V3 => [x1 - a * c + b * s, y, RT + a * s + b * c];
  const end = phi > Math.PI / 4 ? TW : 0;
  return hue('c', poly([[TX, TY, TZ + 2], [x1, TY, TZ + 2], [x1, y1, TZ + 2], [TX, y1, TZ + 2]], 'f tint') + box(TX, TY, TZ, TW, 3, h) + box(TX, TY, TZ, 3, TD, h)) + inner +
    hue('c', box(TX, y1 - 3, TZ, TW, 3, h, 'paper', 'body', 'tint') + box(x1 - 3, TY, TZ, 3, TD, h) +
      on(FRONT(TX, y1, RT), `<rect class="f paper" x="14" y="8" width="24" height="10" rx=".5"/><line class="det" x1="18" y1="13" x2="34" y2="13"/>`) +
      poly([p(0, 0, y1), p(TW, 0, y1), p(TW, 3, y1), p(0, 3, y1)], 'f body') + poly([p(end, 0, TY), p(end, 3, TY), p(end, 3, y1), p(end, 0, y1)], 'f body') +
      poly([p(0, 3, TY), p(TW, 3, TY), p(TW, 3, y1), p(0, 3, y1)], 'f paper') + poly([p(6, 3, TY + 6), p(TW - 6, 3, TY + 6), p(TW - 6, 3, y1 - 6), p(6, 3, y1 - 6)], 'det') +
      cylY(TY + 3, TY + 10, x1 + 1, RT + 1.5, 2.5) + cylY(y1 - 10, y1 - 3, x1 + 1, RT + 1.5, 2.5));
};

export const rules: Piece = {
  aria: 'A go / no-go gauge on an inspection bench. Parts ride a rail toward a notched jaw: the ones that fit pass through, an oversized one stops at the jaw and a spring pusher kicks it into the reject bin.',
  period: PERIOD, rest: 2 * GO + .94, viewBox: K.viewBox, // rest: the reject mid-kick, lid open
  draw(t) {
    // Steps 3c and 3c + 1 index a go part to the jaw; step 3c + 2 brings the reject. v = time since that step began,
    // so the lid and pusher can finish while the next index already runs.
    const c = Math.floor(t / PERIOD), r = t - c * PERIOD, i = r < GO ? 0 : r < 2 * GO ? 1 : 2;
    const n = 3 * c + i, u = r - i * GO, v = i === 2 ? u : r + REJ;
    const e = 61 * (k(v, .8, 1.3) - k(v, 1.3, 1.9)); // paddle stops at the rail edge, the part slides on
    const shove = Math.min(63, Math.max(0, 66 * k(v, .8, 1.3) - 3));
    const drop = 20 * Math.min(1, Math.max(0, (v - 1.2) / .2)) ** 2; // once it clears the bin wall
    const phi = 1.75 * (k(v, .2, .8) - k(v, 1.5, SHUT));
    // Part j sits at slot j - n after index step n (slot 0 = at the jaw); every third part is too wide.
    // Painter layers: inside the outlet, outlet to gate, straddling the gate face (under the insert), in front, in the bin.
    const L = ['', '', '', '', ''];
    for (let j = n - 3; j <= n + 2; j++) {
      const big = m3(j) === 2, s = j - n + 1 - k(u, 0, MOVE);
      if (big && (j < n || (j === n && shove > 0))) { // the reject: kicked off the rail, kept until the lid shuts over it
        if (j === n || (j === n - 1 && v < SHUT)) L[4] += part(CX + shove, YS - 1, RT - drop, true);
        continue;
      }
      if (s < -2 || s > 2) continue;
      const y = YS + s * PITCH - (big ? 1 : 0);
      // Colour rides the move: it glows up over the slide out of the feed hood (slot 2 to 1), dims over the slide into the outlet.
      L[y < HF ? 0 : y < G ? 1 : y < G + 3 ? 2 : 3] += part(CX, y, RT, big, big ? 0 : sm(2 + s) * sm(2 - s));
    }
    return BENCH + MOUTH + L[0] + OUTLET + NOTCH + L[1] + GATE + L[2] + INSERT + pusher(e) + L[3] + FEED + bin(L[4], phi);
  },
};
