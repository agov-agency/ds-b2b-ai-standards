// Skill icons, in the style of the pilot (icons.ts): one object on a plate, its telling details, one live part.
import { kernel, f, type V3 } from './iso';
import { prism, bar, dot, screws, lit, plate, rope, icon, planeAt, type K, type P2 } from './icons';

const ring = (K: K, cx: number, cy: number, z: number, r: number, n = 8, rr = .7) => Array.from({ length: n }, (_, i) => { const a = i * 2 * Math.PI / n; return dot(K, cx + Math.cos(a) * r, cy + Math.sin(a) * r, z, rr); }).join('');

// ── Regulator: lowest bid that still spends the budget. An inline flow valve whose dial has notches; the pointer sits on
// the first notch where the line still runs.
const RG = kernel([[-8, 0, 0], [78, 0, 0], [-8, 44, 0], [78, 44, 0], [35, 22, 46]], 12);
const regulator = icon(RG, 'A flow regulator valve on a pipe; its dial has notches and the pointer rests on the lowest one that still lets flow through.', () => {
  const K = RG, CY = 22, Z = 16;
  let s = plate(K, -8, 0, 86, 44);
  // Pipe on two saddles, flanged at both ends of the valve
  for (const x of [4, 62]) s += K.box(x - 3, CY - 6, 4, 6, 12, Z - 9, 'paper', 'body', 'tint');
  s += K.cylX(-6, 22, CY, Z, 4.6) + K.cylX(22, 25, CY, Z, 8, 'paper', 'tint');
  s += K.box(24, CY - 10, 6, 22, 20, 18, 'paper', 'body', 'tint') + K.on(K.FRONT(24, CY + 10, 24), screws([[3, 3], [19, 3], [3, 15], [19, 15]]) + `<rect class="det" x="6" y="5" width="10" height="8" rx=".6"/>`);
  s += K.cylX(46, 49, CY, Z, 8, 'paper', 'tint') + K.cylX(49, 78, CY, Z, 4.6);
  // Bonnet and the notched dial on top, the pointer on the live notch
  s += K.cyl(35, CY, 24, 6, 6, 'paper', 'body') + K.cyl(35, CY, 30, 14, 2.4, 'paper', 'body');
  const A0 = Math.PI * .75, notch = (i: number) => A0 + i * Math.PI * 1.5 / 8;
  s += K.on(K.TOP(35, CY, 32.4), Array.from({ length: 9 }, (_, i) => { const a = notch(i); return `<path class="f blk" d="M${f(Math.cos(a - .05) * 13.6)} ${f(Math.sin(a - .05) * 13.6)}L${f(Math.cos(a) * 11.6)} ${f(Math.sin(a) * 11.6)}L${f(Math.cos(a + .05) * 13.6)} ${f(Math.sin(a + .05) * 13.6)}Z"/>`; }).join('') + `<circle class="det" r="9"/>`);
  s += lit(prism(K, bar(35, CY, notch(2), -3, 11, 3.2), 32.4, 2.4, 'paper', 'body')) + K.cyl(35, CY, 34.8, 3.6, 3, 'paper', 'body');
  return s;
});

// ── Pass card: cost per retargetable member. A punched membership card standing in its holder, a coin beside it.
const PC = kernel([[-4, 0, 0], [78, 0, 0], [-4, 46, 0], [78, 46, 0], [8, 22, 54]], 12);
const passcard = icon(PC, 'A punched membership card standing in a holder, with a coin lying beside it.', () => {
  const K = PC;
  let s = plate(K, -4, 0, 82, 46);
  s += K.box(4, 14, 4, 50, 14, 8, 'paper', 'body', 'tint') + K.on(K.TOP(4, 14, 12), `<rect class="f blk" x="3" y="6" width="44" height="2"/>`);
  // The card: a thin board, a band across its top, two rows of punch positions with some punched
  s += K.box(6, 20, 10, 46, 2, 40, 'paper', 'body', 'paper');
  const holes = Array.from({ length: 16 }, (_, i) => { const x = 6 + (i % 8) * 4.8, y = 22 + Math.floor(i / 8) * 6, on = [1, 4, 6, 9, 10, 14].includes(i); return `<circle class="${on ? 'f blk' : 'det'}" cx="${f(x)}" cy="${y}" r="1.3"/>`; }).join('');
  s += K.on(K.FRONT(6, 22, 50), `<rect class="f tint" x="0" y="4" width="46" height="9"/>${holes}`);
  // Coin lying flat, a second one under it
  s += K.cyl(64, 32, 4, 9, 2.2, 'paper', 'body') + lit(K.cyl(63, 31, 6.2, 9, 2.4, 'body', 'body') + K.on(K.TOP(63, 31, 8.6), '<circle class="det" r="6.8"/><circle class="det" r="2.4"/>'));
  return s;
});

// ── Stanchions: retargeting guardrails. Two posts and the rope that sags between them.
const ST = kernel([[-6, 2, 0], [86, 2, 0], [-6, 30, 0], [86, 30, 0], [14, 16, 58], [70, 16, 58]], 12);
const stanchions = icon(ST, 'Two stanchion posts with a rope hanging between them.', () => {
  const K = ST, Y = 16, H = 48;
  let s = plate(K, -6, 2, 92, 28);
  const post = (x: number) => K.cyl(x, Y, 4, 9, 2.4, 'paper', 'body') + K.cyl(x, Y, 6.4, 6.6, 2, 'paper', 'tint') + K.cyl(x, Y, 8.4, 2.4, H - 4, 'paper', 'body') +
    K.cyl(x, Y, H + 4, 3.8, 3, 'paper', 'body') + K.cyl(x, Y, H + 7, 2.4, 2.2, 'paper', 'tint');
  // Rope: hooks on the posts' sides, a catenary between them
  const pts: V3[] = Array.from({ length: 25 }, (_, i) => { const u = i / 24, x = 20 + (64 - 20) * u; return [x, Y, H + 1 - 15 * Math.sin(Math.PI * u) - 1.5 * Math.sin(2 * Math.PI * u) * 0]; });
  s += post(12) + post(72);
  s += lit(rope(K, pts, 3.4)) + K.cylX(14, 20, Y, H + 1, 2.2, 'paper', 'body') + K.cylX(64, 70, Y, H + 1, 2.2, 'paper', 'body');
  return s;
});

// ── Adapter: matched audience lists. A travel plug adapter: one standard's socket on top, the other's prongs out the side.
const AD = kernel([[0, 0, 0], [78, 0, 0], [0, 50, 0], [78, 50, 0], [30, 25, 42]], 12);
const adapter = icon(AD, 'A plug adapter: a socket on top for one standard, prongs for another sticking out of its side.', () => {
  const K = AD, X = 12, Y = 10, W = 40, D = 32, H = 30;
  let s = plate(K, 0, 0, 78, 50);
  s += K.box(X - 2, Y - 2, 4, W + 4, D + 4, 3, 'paper', 'body', 'tint') + K.box(X, Y, 7, W, D, H, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + D, 7 + H), `<line class="det" x1="0" y1="10" x2="${W}" y2="10"/><rect class="f paper" x="${W - 14}" y="16" width="9" height="5" rx="1"/><rect class="f body" x="${W - 13}" y="17" width="3.6" height="3" rx=".6"/>`);
  s += K.on(K.SIDE(X + W, Y + D, 7 + H), `<line class="det" x1="0" y1="10" x2="${D}" y2="10"/>`);
  // Socket face on top: a recessed plate, two flat slots and the earth hole
  s += K.on(K.TOP(X, Y, 7 + H), `<rect class="f tint" x="5" y="4" width="${W - 10}" height="${D - 8}" rx="2"/><rect class="f blk" x="${W / 2 - 8}" y="10" width="2" height="7" rx=".4"/><rect class="f blk" x="${W / 2 + 6}" y="10" width="2" height="7" rx=".4"/><circle class="f blk" cx="${W / 2 + 1}" cy="${D - 9}" r="2"/>`);
  // Prongs out of the side face: round pins on a raised boss
  s += K.cylX(X + W, X + W + 3, Y + D / 2, 20, 9, 'paper', 'tint');
  s += lit(K.cylX(X + W + 3, X + W + 16, Y + D / 2 - 4.5, 20, 1.8, 'body', 'body') + K.cylX(X + W + 3, X + W + 16, Y + D / 2 + 4.5, 20, 1.8, 'body', 'body'));
  return s;
});

// ── Key rack: the no-deal warm leads finder. A board of hooks with tagged keys; one hook is empty, one tag is the live one.
const KR = kernel([[0, 4, 0], [76, 4, 0], [0, 40, 0], [76, 40, 0], [0, 20, 66], [76, 20, 66]], 12);
const keyrack = icon(KR, 'A key board with hooks; tagged keys hang from most of them, one hook is empty.', () => {
  const K = KR, Y = 20, H = 62;
  let s = plate(K, 0, 4, 76, 36);
  s += K.box(8, Y - 8, 4, 8, 14, 5, 'paper', 'body', 'tint') + K.box(60, Y - 8, 4, 8, 14, 5, 'paper', 'body', 'tint');
  s += K.box(4, Y - 3, 9, 68, 4, H - 9, 'paper', 'body', 'tint') + K.box(2, Y - 4, H, 72, 6, 3, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(4, Y + 1, H), screws([[4, 5], [64, 5], [4, H - 14], [64, H - 14]]));
  const hooks = [14, 28, 42, 56], keyOn = [true, true, false, true], live = 1;
  hooks.forEach((x, i) => {
    s += K.cylY(Y + 1, Y + 6, x, H - 12, 1.4, 'paper', 'body');
    if (!keyOn[i]) return;
    // Key and tag hang in a plane just in front of the board
    // Split ring over the hook's tip, the key's bow and the tag's string both through it
    const ring = `<path class="f paper" fill-rule="evenodd" d="M3.6 3A3.6 3.6 0 1 1 -3.6 3A3.6 3.6 0 1 1 3.6 3ZM2.2 3A2.2 2.2 0 1 0 -2.2 3A2.2 2.2 0 1 0 2.2 3Z"/>`;
    const key = `<circle class="f paper" cx="0" cy="10" r="4"/><circle class="det" cx="0" cy="10" r="1.4"/><path class="f paper" d="M-1.2 14H1.2V27H-1.2Z"/><path class="f paper" d="M1.2 22H4V24H2.6V26H1.2Z"/>`;
    const tag = `<path class="f nofill" d="M-2.6 5.6Q-4.6 8 -6 11"/><path class="f ${i === live ? 'body' : 'paper'}" d="M-10 11H-2V23L-6 26L-10 23Z"/><circle class="det" cx="-6" cy="13.6" r="1"/>`;
    const pl = K.FRONT(x, Y + 6, H - 12);
    s += K.on(pl, key + (i === live ? '' : tag)) + (i === live ? lit(K.on(pl, tag)) : '') + K.on(pl, ring);
  });
  return s;
});

// ── Periscope: the silent watchers finder. A square tube on a stand, the head window up top (live), the eyepiece low.
const PS = kernel([[0, 0, 0], [70, 0, 0], [0, 56, 0], [70, 56, 0], [26, 26, 84], [52, 26, 80]], 12);
const periscope = icon(PS, 'A periscope: a square tube with a window at the top head and an eyepiece at the bottom.', () => {
  const K = PS, X = 20, Y = 18, W = 14;
  let s = plate(K, 0, 0, 70, 56);
  s += K.box(X - 6, Y - 6, 4, W + 12, W + 12, 4, 'paper', 'body', 'tint') + K.cyl(X + W / 2, Y + W / 2, 8, 6, 4, 'paper', 'body');
  // Eyepiece box at the foot, facing the viewer, with a rubber cup
  s += K.box(X, Y, 12, W, W + 12, 14, 'paper', 'body', 'tint') + K.cylY(Y + W + 12, Y + W + 16, X + W / 2, 19, 5, 'paper', 'body') + K.on(K.FRONT(X + W / 2, Y + W + 16, 19), '<circle class="f blk" r="3"/>');
  // Tube with band clamps, the 45° mirror line visible on its side
  s += K.box(X, Y, 26, W, W, 44, 'paper', 'body', 'tint');
  for (const z of [36, 58]) s += K.poly([[X - .8, Y + W + .8, z], [X + W + .8, Y + W + .8, z], [X + W + .8, Y + W + .8, z + 3], [X - .8, Y + W + .8, z + 3]], 'f tint') + K.poly([[X + W + .8, Y - .8, z], [X + W + .8, Y + W + .8, z], [X + W + .8, Y + W + .8, z + 3], [X + W + .8, Y - .8, z + 3]], 'f body');
  // Head turned towards +x, its window the live part
  s += K.box(X, Y, 70, W + 14, W, 14, 'paper', 'body', 'tint') + K.box(X - 1, Y - 1, 84, W + 16, W + 2, 2, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y + W, 84), `<path class="det" d="M2 12L12 2"/>` + screws([[W + 10, 4], [W + 10, 10]]));
  s += lit(K.on(K.SIDE(X + W + 14, Y + W, 84), `<rect class="f body" x="2" y="2.5" width="${W - 4}" height="9" rx=".6"/><path class="det" d="M4 10L9 4"/>`));
  return s;
});

const tick = (x: number, y: number, sz = 4) => `<path class="det" d="M${x - sz / 2} ${y}l${sz * .35} ${sz * .4}l${sz * .65} ${-sz * .8}"/>`;

// ── Clipboard: account health check. A clipboard leaning on its strut, a checklist under the clip; one tick is live.
const CB = kernel([[0, -10, 0], [64, -10, 0], [0, 40, 0], [64, 40, 0], [10, 14, 66]], 12);
const clipboard = icon(CB, 'A clipboard leaning back on its strut, with a checklist of ticked boxes under the clip.', () => {
  const K = CB, th = .26, W = 44, H = 58, X = 10, YB = 30;
  const sn = Math.sin(th), cs = Math.cos(th), top: V3 = [X, YB - H * sn, 6 + H * cs];
  let s = plate(K, 0, -10, 64, 50) + K.box(X - 2, YB - 3, 4, W + 4, 6, 3, 'paper', 'body', 'tint');
  // Strut behind, then the board's thickness on its right edge, then the face
  s += K.poly([[X + W / 2 - 3, YB - 34, 4], [X + W / 2 + 3, YB - 34, 4], [X + W / 2 + 3, top[1] + 14 * sn, top[2] - 14 * cs], [X + W / 2 - 3, top[1] + 14 * sn, top[2] - 14 * cs]], 'f body');
  s += K.poly([[X + W, YB, 6], [X + W, top[1], top[2]], [X + W, top[1] - 2 * cs, top[2] - 2 * sn], [X + W, YB - 2 * cs, 6 - 2 * sn]], 'f body');
  const pl = planeAt(K, top, [1, 0, 0], [0, sn, -cs]);
  let face = `<rect class="f tint" width="${W}" height="${H}"/><rect class="f paper" x="5" y="10" width="${W - 10}" height="${H - 14}"/>`;
  for (let i = 0; i < 5; i++) { const y = 18 + i * 7.6; face += `<rect class="f paper" x="9" y="${y}" width="5" height="5"/><rect class="f tint" x="17" y="${y + 1.4}" width="${[18, 12, 16, 10, 14][i]}" height="2.2"/>` + (i < 3 && i !== 1 ? tick(11.5, y + 2.4) : ''); }
  face += `<rect class="f body" x="${W / 2 - 11}" y="-2" width="22" height="9" rx="1"/><rect class="f paper" x="${W / 2 - 7}" y="-5" width="14" height="5" rx="2"/>` + screws([[W / 2 - 8, 3], [W / 2 + 8, 3]]);
  s += K.on(pl, face) + lit(K.on(pl, tick(11.5, 18 + 7.6 + 2.4, 5)));
  return s;
});

// ── Gauge: CRM data health check. A pressure gauge on its manifold, the needle up in the top zone (live).
const TB = kernel([[0, 0, 0], [70, 0, 0], [0, 46, 0], [70, 46, 0], [35, 22, 68]], 12);
const gauge = icon(TB, 'A round pressure gauge on a stem over a manifold block, its needle up at the top of the scale.', () => {
  const K = TB, CX = 35, Y = 18, CZ = 44, R = 18;
  let s = plate(K, 0, 0, 70, 46);
  // Manifold: block on the plate, pipe stubs out both ends, the stem up with a hex nut
  s += K.cylX(6, 14, Y + 6, 10, 3.4, 'paper', 'tint') + K.box(14, Y - 2, 4, 42, 16, 12, 'paper', 'body', 'tint') + K.on(K.FRONT(14, Y + 14, 16), screws([[4, 3], [38, 3], [4, 9], [38, 9]]));
  s += K.cylX(56, 64, Y + 6, 10, 3.4, 'paper', 'tint') + K.cyl(CX, Y + 6, 16, 2.4, CZ - R - 12, 'paper', 'body');
  s += prism(K, Array.from({ length: 6 }, (_, i) => [CX + 3.6 * Math.cos(i * Math.PI / 3), Y + 6 + 3.6 * Math.sin(i * Math.PI / 3)] as P2), 18, 3, 'paper', 'body');
  s += K.box(CX - 2.6, Y + 3.4, CZ - R - 1, 5.2, 5.2, 3, 'paper', 'body', 'tint');
  // The case, its bezel and the face
  s += K.cylY(Y, Y + 8, CX, CZ, R, 'paper', 'body') + K.cylY(Y + 8, Y + 10, CX, CZ, R + .6, 'paper', 'tint');
  const face = K.FRONT(CX, Y + 10, CZ), A0 = Math.PI * .75, SW = Math.PI * 1.5, a = (q: number) => A0 + SW * q, r = R - 3;
  const arc = (q0: number, q1: number, r0: number, r1: number, cls: string) => `<path class="${cls}" d="M${f(Math.cos(a(q0)) * r1)} ${f(Math.sin(a(q0)) * r1)}A${r1} ${r1} 0 0 1 ${f(Math.cos(a(q1)) * r1)} ${f(Math.sin(a(q1)) * r1)}L${f(Math.cos(a(q1)) * r0)} ${f(Math.sin(a(q1)) * r0)}A${r0} ${r0} 0 0 0 ${f(Math.cos(a(q0)) * r0)} ${f(Math.sin(a(q0)) * r0)}Z"/>`;
  s += K.on(face, `<circle class="f paper" r="${R - 1}"/>` + Array.from({ length: 21 }, (_, i) => { const t = a(i / 20), r0 = r - (i % 5 ? 2 : 3.6); return `<line class="det" x1="${f(Math.cos(t) * r0)}" y1="${f(Math.sin(t) * r0)}" x2="${f(Math.cos(t) * r)}" y2="${f(Math.sin(t) * r)}"/>`; }).join(''));
  const t = a(.92), n = 1.2;
  s += lit(K.on(face, arc(.8, 1, r - 3.6, r, 'f body') + `<path class="f body" d="M${f(-Math.sin(t) * n)} ${f(Math.cos(t) * n)}L${f(Math.cos(t) * (r - 1))} ${f(Math.sin(t) * (r - 1))}L${f(Math.sin(t) * n)} ${f(-Math.cos(t) * n)}L${f(-Math.cos(t) * 3.4)} ${f(-Math.sin(t) * 3.4)}Z"/>`));
  s += K.on(face, '<circle class="f paper" r="2"/>');
  return s;
});

// ── Tag counter: who's looking at your buying pages. A hand tally counter with a price tag tied to its ring.
const TC = kernel([[0, 0, 0], [76, 0, 0], [0, 50, 0], [76, 50, 0], [34, 22, 60]], 12);
const tagcounter = icon(TC, 'A hand tally counter standing on a plate, with a price tag tied to its finger ring.', () => {
  const K = TC, CX = 32, Y0 = 16, Y1 = 26, CZ = 30, R = 18;
  let s = plate(K, 0, 0, 76, 50) + K.box(CX - 10, Y0 - 2, 4, 20, 14, CZ - R - 4, 'paper', 'body', 'tint');
  // Finger ring at the left, the button on top (live), then the body and its window of blank number wheels
  s += K.cylY(Y0 + 3, Y1 - 3, CX - R - 6, CZ - 4, 7, 'paper', 'body') + K.on(K.FRONT(CX - R - 6, Y1 - 3, CZ - 4), '<circle class="f tint" r="4.4"/>');
  s += K.cyl(CX, (Y0 + Y1) / 2, CZ + R - 2, 3.6, 4, 'paper', 'body') + lit(K.cyl(CX, (Y0 + Y1) / 2, CZ + R + 2, 5, 5, 'body', 'body'));
  s += K.cylY(Y0, Y1, CX, CZ, R, 'paper', 'body') + K.cylY(Y1, Y1 + 1.6, CX, CZ, R - 2, 'paper', 'tint');
  s += K.on(K.FRONT(CX, Y1 + 1.6, CZ), `<rect class="f body" x="-13" y="-6" width="26" height="10" rx="1"/>` + [0, 1, 2, 3].map((i) => `<rect class="f paper" x="${-12 + i * 6.2}" y="-5" width="5.4" height="8" rx=".5"/>`).join('') +
    `<circle class="f paper" cx="10" cy="10" r="2.6"/><line class="det" x1="8.4" y1="10" x2="11.6" y2="10"/>`);
  // The tag lying on the plate, its string up to the ring
  s += K.on(K.TOP(46, 30, 4), `<path class="f paper" d="M0 4L6 0H22V12H6Z"/><circle class="det" cx="6" cy="6" r="1.4"/><rect class="f tint" x="10" y="3" width="9" height="2"/><rect class="f tint" x="10" y="7" width="6" height="2"/>`);
  s += rope(K, [[CX - R - 6, Y1 - 2, CZ - 10], [CX - R - 4, Y1 + 6, 12], [20, 34, 5], [40, 36, 4.4], [52, 36, 4.4]], 1, 'f paper');
  return s;
});

// ── Charger: creative decay watchlist. Two batteries in a charging dock: one topped up, one charging (live).
const BT = kernel([[0, 0, 0], [76, 0, 0], [0, 46, 0], [76, 46, 0], [22, 18, 60], [50, 28, 60]], 12);
const charger = icon(BT, 'Two batteries seated in a charging dock, its cord running to a plug; one battery is full, the other is charging.', () => {
  const K = BT, H = 36, R = 9, ZD = 14;
  let s = plate(K, 0, 0, 76, 46);
  // Cord out of the dock's back to a plug on the plate
  s += rope(K, [[62, 14, 6], [68, 12, 4.6], [70, 6, 4.6], [64, 2, 4.6]], 1.4, 'f paper') + K.box(56, 0, 4, 8, 5, 4, 'paper', 'body', 'tint');
  s += K.box(8, 8, 4, 56, 30, ZD - 4, 'paper', 'body', 'tint') + K.on(K.TOP(8, 8, ZD), `<rect class="det" x="2" y="2" width="52" height="26" rx="1"/>`);
  const cell = (x: number, y: number, lvl: number, live: boolean) => {
    let g = K.on(K.TOP(x, y, ZD), `<circle class="f body" r="${R + 1.4}"/>`) + K.cyl(x, y, ZD, R, H, 'paper', 'tint');
    for (const z of [ZD + 5, ZD + H - 4]) g += K.line(K.ring(x, y, z, R, -Math.PI / 4, Math.PI * 3 / 4, 24), 'det');
    g += K.cyl(x, y, ZD + H, R - 3, 1.6, 'paper', 'body') + K.cyl(x, y, ZD + H + 1.6, 3, 2.6, 'paper', 'body');
    const gx = x + R * .72 + .8, gy = y + R * .72 + .8, fill = K.cyl(gx, gy, ZD + 7, 1.3, (H - 12) * lvl, 'body', 'body');
    g += K.cyl(gx, gy, ZD + 6, 2.1, H - 10, 'paper', 'paper') + (live ? lit(fill) : fill);
    return g;
  };
  // Indicator lamps on the dock's front, one per bay
  const led = (u: number, live: boolean) => { const l = K.on(K.FRONT(8, 38, ZD), `<rect class="f ${live ? 'body' : 'tint'}" x="${u - 2.6}" y="3" width="5.2" height="2.6" rx="1.3"/>`); return live ? lit(l) : l; };
  return s + cell(22, 18, .95, false) + cell(50, 28, .62, true) + led(14, false) + led(42, true);
});

// ── Reels: video quality check. Two film reels on a rewind bench with the film running between them (live).
const RL = kernel([[0, 4, 0], [84, 4, 0], [0, 40, 0], [84, 40, 0], [20, 22, 58], [64, 22, 58], [20, 18, 56]], 12);
const reels = icon(RL, 'Two film reels on a rewind bench with a strip of film running between them.', () => {
  const K = RL, Y = 20, CZ = 34, R = 18;
  let s = plate(K, 0, 4, 84, 36);
  const reel = (x: number) => {
    let g = K.box(x - 3, Y - 6, 4, 6, 6, CZ - 4, 'paper', 'body', 'tint') + K.cylY(Y - 6, Y, x, CZ, 3, 'paper', 'body') + K.cylY(Y, Y + 6, x, CZ, R, 'paper', 'tint');
    g += K.on(K.FRONT(x, Y + 6, CZ), [0, 1, 2].map((q) => { const a = q * 2.094 - 1.57; return `<circle class="f blk" cx="${f(Math.cos(a) * 9.5)}" cy="${f(Math.sin(a) * 9.5)}" r="4.6"/>`; }).join('') + `<circle class="det" r="${R - 2}"/><circle class="f paper" r="3.4"/><circle class="f body" r="1.6"/>`);
    return g;
  };
  // The film first, over the tops of both reels, so their discs cover its ends
  const z0 = CZ + R - .6;
  s += lit(K.poly([[20, Y + .6, z0], [64, Y + .6, z0], [64, Y + 5.4, z0], [20, Y + 5.4, z0]], 'f body') + K.poly([[20, Y + 5.4, z0], [64, Y + 5.4, z0], [64, Y + 5.4, z0 - 1], [20, Y + 5.4, z0 - 1]], 'f body'));
  s += Array.from({ length: 10 }, (_, i) => dot(K, 24 + i * 4, Y + 1.8, z0, .5) + dot(K, 24 + i * 4, Y + 4.2, z0, .5)).join('');
  s += reel(20) + reel(64);
  return s;
});

// ── Plug: waste budget detection. A basin with its tap shut and the drain stoppered; the plug on its chain is live.
const TP = kernel([[0, 0, 0], [70, 0, 0], [0, 50, 0], [70, 50, 0], [34, 6, 44]], 12);
const plug = icon(TP, 'A basin with its tap turned off and a plug on a chain sitting in the drain.', () => {
  const K = TP;
  let s = plate(K, 0, 0, 70, 50) + K.box(8, 0, 4, 54, 46, 16, 'paper', 'body', 'tint');
  // The well: floor and the two far walls inside the rim, the drain; the back deck is wide enough for the tap
  // Everything inside is cut to the opening, so the floor never spills over the near rim
  const open = ([[14, 18], [56, 18], [56, 42], [14, 42]] as P2[]).map(([x, y]) => K.P(x, y, 20).map(f).join(' ')).join(' ');
  let inside = K.poly([[14, 18, 12], [56, 18, 12], [56, 42, 12], [14, 42, 12]], 'f tint') + K.poly([[14, 18, 12], [56, 18, 12], [56, 18, 20], [14, 18, 20]], 'f body') + K.poly([[14, 18, 12], [14, 42, 12], [14, 42, 20], [14, 18, 20]], 'f body');
  inside += K.on(K.TOP(35, 35, 12), '<circle class="f paper" r="4.6"/>') + lit(K.cyl(35, 35, 12, 4, 1.8, 'body', 'body') + K.cyl(35, 35, 13.8, 1, 1.6, 'body', 'body'));
  s += `<clipPath id="pl-open"><polygon points="${open}"/></clipPath><g clip-path="url(#pl-open)">${inside}</g>`;
  // The plug's chain over the back rim to the tap's base
  s += lit(rope(K, [[35, 35, 15.4], [35, 26, 13.4], [35, 19, 19], [35, 15, 20.2], [35, 11.6, 20.4]], 1, 'f body'));
  // Faucet on the back deck: base, pillar, spout out over the drain, the lever on top
  s += K.cyl(35, 8, 20, 4.4, 2, 'paper', 'body') + K.cyl(35, 8, 22, 2.6, 12, 'paper', 'body') + K.cylY(8, 35, 35, 32, 2.2, 'paper', 'body') + K.cyl(35, 35, 26, 2, 6.2, 'paper', 'body');
  s += K.cyl(35, 8, 34, 3.4, 3.6, 'paper', 'tint') + prism(K, bar(35, 8, -.6 + Math.PI / 2, 0, 11, 2.4), 37.6, 2, 'paper', 'body');
  return s;
});

// ── Trophies: campaign group scoreboard. A three-step podium with a cup on each step; the winner's cup is live.
const TR = kernel([[0, 0, 0], [84, 0, 0], [0, 40, 0], [84, 40, 0], [40, 21, 62]], 12);
const cup = (K: K, x: number, y: number, z: number, sc: number, live = false) => {
  const r = 6 * sc, zs = z + 3, zb = zs + 6 * sc, hb = 9 * sc, B = live ? 'body' : 'paper';
  // Handles in the plane square to the view, so one sits either side of the bowl on screen
  const at = (d: number, z: number): V3 => [x + d * .707, y - d * .707, z];
  const handle = (sx: number) => K.curve(at(sx * r * .92, zb + hb - 1.4 * sc), at(sx * (r + 7 * sc), zb + hb * .8), at(sx * r * .55, zb + .6 * sc), 12);
  // Square foot, stem with a knop, a two-tier bowl, loop handles either side
  let g = K.box(x - 4.4 * sc, y - 4.4 * sc, z, 8.8 * sc, 8.8 * sc, 3, 'paper', 'body', 'tint') + K.cyl(x, y, zs, 1.3 * sc, 6 * sc, B, 'body') + K.cyl(x, y, zs + 2.2 * sc, 2.6 * sc, 1.4 * sc, 'paper', 'body');
  g += rope(K, handle(-1), 1.6 * sc, 'f body') + rope(K, handle(1), 1.6 * sc, 'f body') + K.cyl(x, y, zb, r * .6, 2.6 * sc, B, B) + K.cyl(x, y, zb + 2.6 * sc, r, hb - 2.6 * sc, 'tint', B);
  g += K.on(K.TOP(x, y, zb + hb), `<circle class="det" r="${f(r - 1.3)}"/>`);
  return live ? lit(g) : g;
};
const trophies = icon(TR, 'A three-step podium with a cup on each step; the winner on the top step holds the biggest one.', () => {
  const K = TR, Y = 8, D = 24;
  let s = plate(K, 0, 0, 84, 40);
  const steps: [number, number, number][] = [[10, 14, .95], [32, 26, 1.2], [54, 7, .85]];
  steps.forEach(([x, h, sc], i) => {
    s += K.box(x, Y, 4, 22, D, h, 'paper', 'body', 'tint') + K.on(K.FRONT(x, Y + D, 4 + h), `<rect class="det" x="4" y="2.6" width="14" height="${h - 5.2}" rx=".6"/>`);
    s += cup(K, x + 11, Y + D / 2, 4 + h, sc, i === 1);
  });
  return s;
});

// ── Rulers: market benchmark comparison. A working rule laid beside a reference bar on its V-blocks; the cursor on the
// rule marks where the reference ends.
const RU = kernel([[0, 0, 0], [92, 0, 0], [0, 40, 0], [92, 40, 0], [10, 10, 24]], 12);
const rulers = icon(RU, 'A ruler lying beside a reference bar on two V-blocks, with a cursor on the ruler set to the end of the reference.', () => {
  const K = RU;
  let s = plate(K, 0, 0, 92, 40);
  // Reference bar: two V-blocks, the bar with its datum groove and darker end caps
  for (const x of [22, 60]) s += K.box(x - 4, 6, 4, 8, 12, 6, 'paper', 'body', 'tint') + K.on(K.FRONT(x - 4, 18, 10), '<path class="det" d="M1.6 0L4 3.4L6.4 0"/>');
  s += K.box(8, 9, 10, 4, 6, 6, 'paper', 'body', 'body') + K.box(12, 9, 10, 56, 6, 6, 'tint', 'body', 'tint') + K.box(68, 9, 10, 4, 6, 6, 'paper', 'body', 'body');
  s += K.on(K.TOP(12, 9, 16), '<line class="det" x1="0" y1="3" x2="56" y2="3"/>');
  // The rule: long flat strip with ticks, the live cursor at the reference's end
  s += K.box(4, 23, 4, 84, 9, 2.4, 'paper', 'body', 'tint');
  s += K.on(K.TOP(4, 23, 6.4), Array.from({ length: 41 }, (_, i) => `<line class="det" x1="${2 + i * 2}" y1="0" x2="${2 + i * 2}" y2="${i % 5 ? 2 : 4}"/>`).join(''));
  s += lit(K.box(70, 21.4, 4, 4, 12.2, 4.4, 'body', 'body', 'body') + K.on(K.TOP(70, 21.4, 8.4), '<path class="f paper" d="M2 .4L3.2 3H.8Z"/>'));
  return s;
});

// ── Logbook: manager monthly report. A closed hardbound log with a strap round it and the ribbon marker hanging out (live).
const LB = kernel([[0, 0, 0], [78, 0, 0], [0, 54, 0], [78, 54, 0], [40, 26, 26]], 12);
const logbook = icon(LB, 'A closed hardbound logbook with a strap round it and a ribbon bookmark hanging out of the pages.', () => {
  const K = LB, X = 14, Y = 8, W = 50, D = 34, Z = 4;
  let s = plate(K, 0, 0, 78, 54);
  s += K.box(X - 2.6, Y, Z, 3, D, 12.6, 'paper', 'body', 'body') + K.box(X, Y, Z, W, D, 1.6, 'paper', 'body', 'body');
  s += K.box(X + .4, Y + .8, Z + 1.6, W - 2, D - 2.4, 9.4, 'paper', 'paper', 'paper');
  const lines = (n: number, len: number) => Array.from({ length: n }, (_, i) => `<line class="det" x1="0" y1="${1.6 + i * 1.6}" x2="${len}" y2="${1.6 + i * 1.6}"/>`).join('');
  s += K.on(K.FRONT(X + .4, Y + D - 1.6, Z + 11), lines(5, W - 2)) + K.on(K.SIDE(X + W - 1.6, Y + D - 1.6, Z + 11), lines(5, D - 2.4));
  s += K.box(X, Y, Z + 11, W, D, 1.6, 'paper', 'body', 'body');
  s += K.on(K.TOP(X, Y, Z + 12.6), `<rect class="det" x="14" y="9" width="22" height="13" rx=".6"/><path class="f tint" d="M${W} ${D}h-7l7 -7Z"/><path class="f tint" d="M${W} 0h-7l7 7Z"/>`);
  // Strap across the cover and down the front, then the ribbon out of the page block
  s += K.poly([[X + W - 14, Y, Z + 12.7], [X + W - 10, Y, Z + 12.7], [X + W - 10, Y + D, Z + 12.7], [X + W - 14, Y + D, Z + 12.7]], 'f tint') + K.poly([[X + W - 14, Y + D + .1, Z + 12.7], [X + W - 10, Y + D + .1, Z + 12.7], [X + W - 10, Y + D + .1, Z], [X + W - 14, Y + D + .1, Z]], 'f tint');
  s += lit(rope(K, [[X + 22, Y + D - 1.6, Z + 9], [X + 22.4, Y + D, Z + 6], [X + 22.8, Y + D + .8, Z + 1.2], [X + 24, Y + D + 3, Z + .2], [X + 27, Y + D + 9, Z + .2]], 3));
  return s;
});

// ── Lockout: pausing low-performing ads. A wall switch thrown to off, its hasp held by a padlock (live).
const LO = kernel([[0, 0, 0], [78, 0, 0], [0, 44, 0], [78, 44, 0], [38, 9, 70]], 12);
const lockout = icon(LO, 'A wall-mounted isolator switch with its lever down in the off position and a padlock through the hasp.', () => {
  const K = LO, PZ = 40, PY = 16.5;
  let s = plate(K, 0, 0, 78, 44) + K.box(10, 6, 4, 56, 6, 62, 'paper', 'body', 'tint') + K.on(K.FRONT(10, 12, 66), screws([[4, 4], [52, 4], [4, 58], [52, 58]]));
  s += K.box(20, 12, 24, 28, 9, 30, 'paper', 'body', 'tint') + K.on(K.FRONT(20, 21, 54), `<rect class="det" x="3" y="3" width="22" height="24" rx=".6"/><path class="det" d="M7 20h14M7 23h9"/>`);
  // Lever on the side: pivot boss, the arm hanging down, the grip
  s += K.cylX(48, 51, PY, PZ, 3.4) + K.box(51, PY - 1.6, 24, 2.4, 3.2, PZ - 24, 'paper', 'body', 'tint') + K.cylX(51, 53.4, PY, PZ, 2) + K.cylX(50, 60, PY, 25, 2.4);
  // Hasp tab out of the housing's foot, the padlock hanging through its hole
  s += K.box(31, 21, 22, 6, 8, 2, 'paper', 'body', 'tint') + K.on(K.TOP(31, 21, 24), '<circle class="f blk" cx="3" cy="5" r="1.4"/>');
  const arc: V3[] = [[34, 26, 17], [34, 26, 25.6], ...Array.from({ length: 9 }, (_, i) => { const a = Math.PI - i * Math.PI / 8; return [36.6 + Math.cos(a) * 2.6, 26, 25.6 + Math.sin(a) * 2.6] as V3; }), [39.2, 26, 25.6], [39.2, 26, 17]];
  s += lit(rope(K, arc, 1.6) + K.box(32, 24.4, 8, 9.2, 3.4, 9.4, 'body', 'body', 'body') + K.on(K.FRONT(32, 27.8, 15), '<circle class="f blk" cx="4.6" r="1"/><rect class="f blk" x="4.2" y=".6" width=".8" height="2.2"/>') );
  return s;
});

// ── Week pad: weekly reporting. A tent desk calendar open on a week, three index tabs on its edge; one tab is live.
const WP = kernel([[0, -10, 0], [70, -10, 0], [0, 44, 0], [70, 44, 0], [12, 10, 56], [64, 10, 50]], 12);
const weekpad = icon(WP, 'A tent desk calendar showing one week in seven columns, with three index tabs on its edge.', () => {
  const K = WP, th = .34, W = 46, H = 46, X = 12, Y0 = 10;
  const sn = Math.sin(th), cs = Math.cos(th), ZT = 4 + H * cs, top: V3 = [X, Y0, ZT];
  let s = plate(K, 0, -10, 70, 54);
  s += K.poly([[X, Y0, ZT], [X + W, Y0, ZT], [X + W, Y0 - H * sn, 4], [X, Y0 - H * sn, 4]], 'f body');
  s += K.poly([[X + W, Y0, ZT], [X + W, Y0 + H * sn, 4], [X + W, Y0 + H * sn - 1.6 * cs, 4 + 1.6 * sn], [X + W, Y0 - 1.6 * cs, ZT + 1.6 * sn - .2]], 'f body');
  const pl = planeAt(K, top, [1, 0, 0], [0, sn, -cs]);
  let face = `<rect class="f paper" width="${W}" height="${H}"/><rect class="f tint" x="3" y="6" width="${W - 6}" height="7"/>`;
  for (let i = 0; i < 7; i++) face += `<rect class="det" x="${f(3 + i * (W - 6) / 7)}" y="16" width="${f((W - 6) / 7)}" height="${H - 20}"/><rect class="f tint" x="${f(4.4 + i * (W - 6) / 7)}" y="17.4" width="2.6" height="2.2"/>`;
  const tabs = [12, 22, 32].map((y, i) => `<rect class="f ${i === 1 ? 'body' : 'tint'}" x="${W - 3}" y="${y}" width="7.6" height="7" rx=".6"/>`);
  // Tabs first, so the page's edge covers where they go in between the leaves
  s += K.on(pl, tabs[0] + tabs[2]) + lit(K.on(pl, tabs[1])) + K.on(pl, face);
  // Wire binding along the ridge
  s += Array.from({ length: 9 }, (_, i) => K.on(planeAt(K, [X + 4 + i * 4.75, Y0, ZT + .6], [0, 1, 0], [0, 0, -1]), '<ellipse class="f nofill" rx="1.8" ry="2"/>')).join('');
  return s;
});

// ── Knocker: capping recommendation. A door with a ring knocker (live); a row of tally marks scratched under it, one
// group closed off.
const KN = kernel([[0, 0, 0], [72, 0, 0], [0, 40, 0], [72, 40, 0], [36, 12, 78]], 12);
const knocker = icon(KN, 'A door with a ring knocker; under it a row of scratched tally marks, the first group of five struck through.', () => {
  const K = KN, X = 8, Y = 16;
  let s = plate(K, 0, 0, 72, 40) + K.box(X - 2, Y - 8, 4, 60, 4, 68, 'paper', 'body', 'tint') + K.box(X, Y - 4, 4, 56, 4, 64, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, Y, 68), `<rect class="det" x="6" y="6" width="44" height="26" rx=".6"/><rect class="det" x="6" y="36" width="44" height="22" rx=".6"/>` +
    [0, 1, 2, 3].map((i) => `<rect class="f blk" x="${12 + i * 2.6}" y="44" width=".8" height="7"/>`).join('') + `<path class="f blk" d="M10.4 50.4L22.4 44.2L22.8 45L10.8 51.2Z"/>` + [0, 1].map((i) => `<rect class="f blk" x="${27 + i * 2.6}" y="44" width=".8" height="7"/>`).join(''));
  s += K.cylY(Y, Y + 2.4, X + 48, 34, 2.6, 'paper', 'body');
  // Knocker: back plate, the boss it hangs from, the strike stud, the ring
  const CX = X + 28, CZ = 46;
  s += K.box(CX - 5, Y, CZ + 2, 10, 1.4, 12, 'paper', 'body', 'tint') + K.cylY(Y, Y + 2.6, CX, CZ + 10, 2, 'paper', 'body') + K.cylY(Y, Y + 2.2, CX, CZ - 8, 2.4, 'paper', 'body');
  const ann = (r0: number, r1: number) => `<path class="f body" fill-rule="evenodd" d="M${r0} 0A${r0} ${r0} 0 1 1 ${-r0} 0A${r0} ${r0} 0 1 1 ${r0} 0ZM${r1} 0A${r1} ${r1} 0 1 0 ${-r1} 0A${r1} ${r1} 0 1 0 ${r1} 0Z"/>`;
  s += lit(K.on(K.FRONT(CX, Y + 2.6, CZ + 2), ann(8, 5.6)) + K.on(K.FRONT(CX, Y + 3.8, CZ + 2), ann(8, 5.6)));
  return s;
});

// ── Puzzle: account engagement. A tray of jigsaw pieces with one gap; the last piece is going into it (live).
// Piece outline on a c×c cell; e = [top, right, bottom, left]: 1 knob out, -1 socket in, 0 flat
const jig = (c: number, e: number[]) => {
  const k = c * .14, side = (x0: number, y0: number, x1: number, y1: number, n: number) => {
    if (!n) return `L${x1} ${y1}`;
    const ux = (x1 - x0) / c, uy = (y1 - y0) / c;
    return `L${f(x0 + ux * (c / 2 - k))} ${f(y0 + uy * (c / 2 - k))}A${f(k * 1.3)} ${f(k * 1.3)} 0 1 ${n > 0 ? 1 : 0} ${f(x0 + ux * (c / 2 + k))} ${f(y0 + uy * (c / 2 + k))}L${x1} ${y1}`;
  };
  return 'M0 0' + side(0, 0, c, 0, e[0]) + side(c, 0, c, c, e[1]) + side(c, c, 0, c, e[2]) + side(0, c, 0, 0, e[3]) + 'Z';
};
const PZ = kernel([[0, 0, 0], [70, 0, 0], [0, 52, 0], [70, 52, 0], [44, 10, 18]], 12);
const puzzle = icon(PZ, 'A tray of jigsaw pieces with the last piece just above its place, about to drop in.', () => {
  const K = PZ, C = 14, H = [[1, -1], [-1, 1]], V = [1, -1, 1];
  const edges = (i: number, j: number) => [j ? -V[i] : 0, i < 2 ? H[i][j] : 0, j ? 0 : V[i], i ? -H[i - 1][j] : 0];
  let s = plate(K, 0, 0, 70, 52) + K.box(6, 8, 4, 3 * C + 8, 2 * C + 8, 3.6, 'paper', 'body', 'tint');
  let top = `<path class="f tint" transform="translate(${2 * C} 0)" d="${jig(C, edges(2, 0))}"/>`;
  for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) if (i !== 2 || j) top += `<path class="f paper" transform="translate(${i * C} ${j * C})" d="${jig(C, edges(i, j))}"/>`;
  s += K.on(K.TOP(10, 12, 7.6), top);
  const d = jig(C, edges(2, 0)), at = (z: number, cls: string) => K.on(K.TOP(10 + 2 * C, 12, z), `<path class="${cls}" d="${d}"/>`);
  s += lit(at(13, 'f body') + [13.6, 14.2, 14.8].map((z) => at(z, 'body')).join('') + at(15.4, 'f body'));
  return s;
});

// ── Bell: ad-hoc query. A service bell on a small counter; ring it and someone answers (the dome is live).
const BL = kernel([[0, 0, 0], [70, 0, 0], [0, 48, 0], [70, 48, 0], [35, 24, 46]], 12);
const bell = icon(BL, 'A domed service bell on a small counter.', () => {
  const K = BL, CX = 35, CY = 24, ZB = 22, R = 13;
  let s = plate(K, 0, 0, 70, 48) + K.box(12, 8, 4, 46, 32, 4, 'paper', 'body', 'tint') + K.box(14, 10, 8, 42, 28, 11, 'paper', 'body', 'tint') + K.box(12, 8, 19, 46, 32, 3, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(14, 38, 19), '<rect class="det" x="4" y="2.6" width="34" height="5.8" rx=".6"/>');
  s += K.cyl(CX, CY, ZB, R + 3, 3, 'paper', 'body') + K.cyl(CX, CY, ZB + 3, 2.6, 1.2, 'paper', 'body');
  // Dome: the rim ellipse below, the sphere's silhouette above; then the plunger and its button
  const [cx, cy] = K.P(CX, CY, ZB + 3), [ex] = K.P(CX + R * .7071, CY - R * .7071, ZB + 3), rx = ex - cx, ry = rx * .5774;
  s += lit(`<path class="f body" d="M${f(cx - rx)} ${f(cy)}A${f(rx)} ${f(rx)} 0 0 1 ${f(cx + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy)}Z"/><path class="det" d="M${f(cx - rx * .62)} ${f(cy - rx * .45)}A${f(rx * .75)} ${f(rx * .75)} 0 0 1 ${f(cx - rx * .1)} ${f(cy - rx * .8)}"/>`);
  s += K.cyl(CX, CY, ZB + 3 + R, 1.2, 4, 'paper', 'body') + K.cyl(CX, CY, ZB + 6.6 + R, 3, 1.8, 'paper', 'body');
  return s;
});

// ── Thermometer: benchmark comparison. A standing thermometer with its normal range marked; the column sits in it (live).
const TH = kernel([[0, 0, 0], [70, 0, 0], [0, 40, 0], [70, 40, 0], [35, 20, 72]], 12);
const thermometer = icon(TH, 'A standing thermometer on a scale board, a band marking the normal range and the column ending inside it.', () => {
  const K = TH, X = 24, Y = 14, W = 22, Z0 = 10, H = 58, TX = X + W / 2, TY = Y + 6.6;
  let s = plate(K, 0, 0, 70, 40) + K.box(X - 8, Y - 6, 4, W + 16, 18, 6, 'paper', 'body', 'tint') + K.box(X, Y, Z0, W, 4, H, 'paper', 'body', 'tint');
  const ticks = Array.from({ length: 19 }, (_, i) => { const v = 10 + i * 2.4, l = i % 5 ? 2.6 : 4.4; return `<line class="det" x1="${f(W / 2 - 3 - l)}" y1="${f(v)}" x2="${W / 2 - 3}" y2="${f(v)}"/><line class="det" x1="${W / 2 + 3}" y1="${f(v)}" x2="${f(W / 2 + 3 + l)}" y2="${f(v)}"/>`; }).join('');
  s += K.on(K.FRONT(X, Y + 4, Z0 + H), `<rect class="f tint" x="2" y="17" width="${W - 4}" height="10"/>${ticks}` + screws([[3, 4], [W - 3, 4], [3, H - 4], [W - 3, H - 4]]));
  // The glass tube with its bulb, the column inside it
  s += K.cyl(TX, TY, 16, 2.6, H - 12, 'paper', 'paper');
  const [bx, by] = K.P(TX, TY, 15);
  s += lit(K.cyl(TX, TY, 16, 1.3, H - 28, 'body', 'body') + `<circle class="f body" cx="${f(bx)}" cy="${f(by)}" r="4.6"/><path class="det" d="M${f(bx - 2.8)} ${f(by - .4)}A3.2 3.2 0 0 1 ${f(bx + .4)} ${f(by - 2.8)}"/>`);
  s += K.cyl(TX, TY, H + 4, 3, 2, 'paper', 'body');
  return s;
});

// ── Drilled blocks: ABM account penetration. Three blocks drilled from the top, cut open at the front to show how deep
// each hole goes; the one drilled right through is live.
const DR = kernel([[0, 0, 0], [84, 0, 0], [0, 40, 0], [84, 40, 0], [40, 20, 31], [20, 0, 26]], 12);
const drilled = icon(DR, 'Three blocks drilled from the top and cut open at the front: the holes go a quarter, half and all the way through.', () => {
  const K = DR, Y = 10, S = 20;
  let s = plate(K, 0, 0, 84, 40);
  [8, 32, 56].forEach((x, i) => {
    const dep = [6, 11, S][i], hole = `<rect class="f tint" x="${S / 2 - 3}" y="0" width="6" height="${dep}"/><path class="f ${i === 2 ? 'tint' : 'paper'}" d="M${S / 2 - 3} ${dep}L${S / 2} ${dep + (i === 2 ? 0 : 2.4)}L${S / 2 + 3} ${dep}Z"/>`;
    const blk = K.box(x, Y, 4, S, S, S, 'paper', 'body', 'tint') + K.on(K.TOP(x, Y, 4 + S), `<circle class="f blk" cx="${S / 2}" cy="${S / 2}" r="3"/>`) + K.on(K.FRONT(x, Y + S, 4 + S), i === 2 ? '' : hole);
    s += blk + (i === 2 ? lit(K.on(K.FRONT(x, Y + S, 4 + S), `<rect class="f body" x="${S / 2 - 3}" y="0" width="6" height="${S}"/>`)) : '');
  });
  return s;
});

// ── Sieve stack: audience demographics. Three stacked sieves over a pan, each mesh finer than the one above; the middle
// tier is live.
const SV = kernel([[0, 0, 0], [70, 0, 0], [0, 50, 0], [70, 50, 0], [35, 25, 56]], 12);
const sieve = icon(SV, 'A stack of three sieves over a collecting pan, grains on the top mesh.', () => {
  const K = SV, CX = 35, CY = 25, R = 19, T = 10;
  let s = plate(K, 0, 0, 70, 50) + K.cyl(CX, CY, 4, R - 1, 6, 'paper', 'body');
  for (let i = 0; i < 3; i++) {
    const z = 10 + i * T, tier = K.cyl(CX, CY, z, R + 1.2, 1.8, 'paper', 'body') + K.cyl(CX, CY, z + 1.8, R, T - 1.8, 'paper', i === 1 ? 'body' : 'tint') + K.line(K.ring(CX, CY, z + T * .62, R, -Math.PI / 4, Math.PI * 3 / 4, 30), 'det');
    s += i === 1 ? lit(tier) : tier;
  }
  // Top mesh seen inside the rim, a few grains on it
  const zt = 10 + 3 * T, n = 9, grid = Array.from({ length: n * 2 }, (_, q) => { const i = q % n, a = -R + 3 + i * (2 * R - 6) / (n - 1), h = Math.sqrt(Math.max(0, (R - 2) ** 2 - a * a)); return q < n ? `<line class="det" x1="${f(a)}" y1="${f(-h)}" x2="${f(a)}" y2="${f(h)}"/>` : `<line class="det" x1="${f(-h)}" y1="${f(a)}" x2="${f(h)}" y2="${f(a)}"/>`; }).join('');
  s += K.on(K.TOP(CX, CY, zt), `<circle class="f tint" r="${R - 1.6}"/>${grid}`);
  s += [[-6, -3], [4, 5], [7, -8], [-3, 9], [-10, 4], [11, 2]].map(([x, y]) => dot(K, CX + x, CY + y, zt, 1.3)).join('');
  return s;
});

// ── Mirror and windshield: benchmark context. A windscreen on its dash with the rear-view mirror hung in front of it;
// the mirror is live.
const MR = kernel([[0, 0, 0], [76, 0, 0], [0, 50, 0], [76, 50, 0], [10, 30, 64], [66, 30, 64]], 12);
const mirror = icon(MR, 'A windscreen standing on a dashboard, with a rear-view mirror hanging in front of it.', () => {
  const K = MR, X = 10, W = 56, Y0 = 13, ZD = 16, H = 44, th = .2, sn = Math.sin(th), cs = Math.cos(th);
  const top: V3 = [X, Y0 + H * sn, ZD + H * cs];
  let s = plate(K, 0, 0, 76, 50) + K.box(6, 6, 4, 64, 14, ZD - 4, 'paper', 'body', 'tint') + K.on(K.FRONT(6, 20, ZD), '<rect class="det" x="6" y="3" width="52" height="4" rx=".6"/>');
  // The pane's edge, then its face: frame, glass, two glints
  const ed = (v: number): V3 => [X + W - 5 * (1 - v / H), top[1] - v * sn, top[2] - v * cs], th2 = 1.2;
  s += K.poly([ed(H), ed(2.4), [ed(2.4)[0], ed(2.4)[1] - th2 * cs, ed(2.4)[2] + th2 * sn], [ed(H)[0], ed(H)[1] - th2 * cs, ed(H)[2] + th2 * sn]], 'f body');
  const pl = planeAt(K, top, [1, 0, 0], [0, -sn, -cs]);
  s += K.on(pl, `<path class="f body" d="M0 ${H}L5 2Q5.4 0 7.4 0H${W - 7.4}Q${W - 5.4} 0 ${W - 5} 2L${W} ${H}Z"/><path class="f tint" d="M4.2 ${H - 3.4}L8.4 5Q8.7 3.4 10.4 3.4H${W - 10.4}Q${W - 8.7} 3.4 ${W - 8.4} 5L${W - 4.2} ${H - 3.4}Z"/><path class="det" d="M12 ${H - 10}L26 10M17 ${H - 8}L29 16"/>`);
  // Mirror: stem off the top of the glass, the housing, its glass facing us
  const mx = X + W / 2 + 4, my = top[1] + 4, mz = top[2] - 11;
  s += rope(K, [[mx, top[1] - 3 * sn, top[2] - 3 * cs], [mx, my - 1, mz + 4]], 2.4, 'f body') + K.box(mx - 10, my - 2.4, mz - 3.6, 20, 2.4, 7.2, 'paper', 'body', 'body');
  s += lit(K.on(K.FRONT(mx - 10, my, mz + 3.6), '<rect class="f body" x="1" y="1" width="18" height="5.2" rx="1.6"/>'));
  return s;
});

// ── Bits: creative performance. A holder of screwdriver bits, each tip different; the one lifted out is live.
const BI = kernel([[0, 0, 0], [80, 0, 0], [0, 46, 0], [80, 46, 0], [40, 14, 40]], 12);
const hex = (cx: number, cy: number, r: number): P2[] => Array.from({ length: 6 }, (_, i) => [cx + r * Math.cos(i * Math.PI / 3), cy + r * Math.sin(i * Math.PI / 3)]);
const bits = icon(BI, 'A holder with a row of screwdriver bits, each with a different tip; one bit stands lifted out of its slot, a driver handle lies in front.', () => {
  const K = BI, Y = 14, N = 6, live = 3;
  let s = plate(K, 0, 0, 80, 46) + K.box(8, Y - 7, 4, 64, 14, 10, 'paper', 'body', 'tint');
  const tips = ['<path class="det" d="M-1.8 0H1.8"/>', '<path class="det" d="M-1.8 0H1.8M0 -1.8V1.8"/>', '<path class="f blk" d="M-1 -.6L0 -1.2L1 -.6V.6L0 1.2L-1 .6Z"/>', '<path class="det" d="M-1.6 0H1.6M-.8 -1.4L.8 1.4M.8 -1.4L-.8 1.4"/>', '<rect class="f blk" x="-.9" y="-.9" width="1.8" height="1.8"/>', '<circle class="f blk" r="1"/>'];
  for (let i = 0; i < N; i++) {
    const x = 14 + i * 10.4, z = 14 + (i === live ? 8 : 0), h = 12;
    const sd = i === live ? 'body' : 'tint', b = prism(K, hex(x, Y, 2.6), z, h, 'paper', sd) + K.cyl(x, Y, z + h, 1.9, 2.6, 'paper', sd) + K.on(K.TOP(x, Y, z + h + 2.6), tips[i]);
    s += (i === live ? K.on(K.TOP(x, Y, 14), '<circle class="f blk" r="3"/>') + lit(b) : b);
  }
  // The driver handle lying in front
  s += K.cylX(12, 52, 32, 9, 4.6, 'paper', 'tint') + K.line([[14, 32, 13.6], [50, 32, 13.6]], 'det') + K.cylX(52, 58, 32, 9, 3, 'paper', 'body') + K.cylX(58, 66, 32, 9, 1.8, 'paper', 'body');
  return s;
});

// ── Dial: LinkedIn performance KPIs. A panel meter: a pale needle where last period ended, the live needle where it is now.
const DL = kernel([[0, 0, 0], [72, 0, 0], [0, 44, 0], [72, 44, 0], [36, 14, 62]], 12);
const dial = icon(DL, 'A panel meter on a stand: a pale needle where last period ended and a bold needle where it is now.', () => {
  const K = DL, X = 12, Y = 10, W = 48, D = 10, Z = 14, H = 44, cx = W / 2, cy = 32, R = 22;
  let s = plate(K, 0, 0, 72, 44) + K.box(X - 4, Y - 4, 4, W + 8, D + 14, 4, 'paper', 'body', 'tint') + K.box(X + 6, Y + 2, 8, W - 12, D - 4, Z - 8, 'paper', 'body', 'tint');
  s += K.box(X, Y, Z, W, D, H, 'paper', 'body', 'tint');
  const a = (q: number) => Math.PI * (1.15 + q * .7);
  const ticks = Array.from({ length: 21 }, (_, i) => { const t = a(i / 20), r0 = R - (i % 5 ? 2.6 : 4.6); return `<line class="det" x1="${f(cx + Math.cos(t) * r0)}" y1="${f(cy + Math.sin(t) * r0)}" x2="${f(cx + Math.cos(t) * R)}" y2="${f(cy + Math.sin(t) * R)}"/>`; }).join('');
  const needle = (q: number, cls: string) => { const t = a(q), n = 1.1; return `<path class="${cls}" d="M${f(cx - Math.sin(t) * n)} ${f(cy + Math.cos(t) * n)}L${f(cx + Math.cos(t) * (R - 3))} ${f(cy + Math.sin(t) * (R - 3))}L${f(cx + Math.sin(t) * n)} ${f(cy - Math.cos(t) * n)}Z"/>`; };
  const face = K.FRONT(X, Y + D, Z + H);
  s += K.on(face, `<rect class="f tint" x="3" y="3" width="${W - 6}" height="${H - 6}" rx="1"/><path class="f paper" d="M${f(cx + Math.cos(a(0)) * (R + 3))} ${f(cy + Math.sin(a(0)) * (R + 3))}A${R + 3} ${R + 3} 0 0 1 ${f(cx + Math.cos(a(1)) * (R + 3))} ${f(cy + Math.sin(a(1)) * (R + 3))}L${cx} ${cy}Z"/>${ticks}${needle(.62, 'f tint')}` + screws([[5.6, 5.6], [W - 5.6, 5.6], [5.6, H - 5.6], [W - 5.6, H - 5.6]]));
  s += lit(K.on(face, needle(.34, 'f body'))) + K.on(face, `<circle class="f paper" cx="${cx}" cy="${cy}" r="2.4"/>`);
  return s;
});

// ── Abacus: multichannel rollup. A frame with three rods, each strung with a different kind of bead; one row is live.
const AB = kernel([[0, 0, 0], [80, 0, 0], [0, 40, 0], [80, 40, 0], [40, 20, 62]], 12);
const abacus = icon(AB, 'An abacus with three rods; each rod carries a different kind of bead, discs, cubes and balls, counted to one side.', () => {
  const K = AB, Y = 20, X0 = 10, X1 = 70, ZS = [44, 31, 18];
  let s = plate(K, 0, 0, 80, 40);
  const post = (x: number) => K.box(x - 4, Y - 8, 4, 8, 16, 4, 'paper', 'body', 'tint') + K.box(x - 2.6, Y - 2.6, 8, 5.2, 5.2, 46, 'paper', 'body', 'tint');
  s += post(X0) + K.box(X0 - 3, Y - 3, 52, X1 - X0 + 6, 6, 3.6, 'paper', 'body', 'tint');
  const rows = ZS.map((z, r) => {
    let g = K.cylX(X0 + 2.6, X1 - 2.6, Y, z, .9, 'paper', 'body');
    const xs = [...[0, 1, 2, 3].map((i) => X0 + 7 + i * 7.4), ...[0, 1].map((i) => X1 - 14 + i * 7.4)].slice(0, [6, 5, 6][r]);
    if (r === 1) xs.splice(3, 0); // cubes: three counted left, two right
    for (const x of (r === 1 ? [X0 + 7, X0 + 14.4, X0 + 21.8, X1 - 14, X1 - 6.6] : xs)) {
      if (r === 0) g += K.cylX(x - 2.4, x + 2.4, Y, z, 3.8, 'paper', 'tint');
      else if (r === 1) g += K.box(x - 3, Y - 3.4, z - 3.4, 6, 6.8, 6.8, 'paper', 'body', 'tint');
      else { const [px, py] = K.P(x, Y, z); g += `<circle class="f tint" cx="${f(px)}" cy="${f(py)}" r="4.4"/><path class="det" d="M${f(px - 2.7)} ${f(py - .4)}A3 3 0 0 1 ${f(px + .4)} ${f(py - 2.7)}"/>`; }
    }
    return r === 1 ? lit(g.replace(/'tint'/g, 'body')) : g;
  });
  s += rows.join('') + post(X1);
  return s;
});

// ── Patch panel: traffic analysis. A rack panel with two rows of jacks, marked patch cables looping between them; one
// cable is live.
const PP = kernel([[0, 0, 0], [80, 0, 0], [0, 46, 0], [80, 46, 0], [40, 10, 42]], 12);
const patchpanel = icon(PP, 'A rack patch panel with two rows of jacks and marked patch cables looping from one jack to another.', () => {
  const K = PP, X = 6, Y = 8, W = 68, ZB = 12, ZT = 36, ZR = [30, 19], YF = Y + 6;
  let s = plate(K, 0, 0, 80, 46);
  for (const x of [X + 4, X + W - 12]) s += K.box(x, Y - 2, 4, 8, 12, ZB - 4, 'paper', 'body', 'tint');
  s += K.box(X, Y, ZB, W, 6, ZT - ZB, 'paper', 'body', 'tint');
  s += K.on(K.FRONT(X, YF, ZT), screws([[3, 4], [W - 3, 4], [3, ZT - ZB - 4], [W - 3, ZT - ZB - 4]]) + ZR.map((z) => Array.from({ length: 8 }, (_, i) => `<rect class="f tint" x="${9 + i * 6.6}" y="${ZT - z - 2.2}" width="4.4" height="4.4" rx=".4"/><rect class="f blk" x="${10.4 + i * 6.6}" y="${ZT - z - .8}" width="1.6" height="1.6"/>`).join('')).join(''));
  const jx = (i: number) => X + 11.2 + i * 6.6;
  const plug = (i: number, z: number) => K.box(jx(i) - 1.7, YF, z - 1.7, 3.4, 3.4, 3.4, 'paper', 'body', 'tint');
  const cable = (a: number, za: number, b: number, zb: number, sag: number, live = false) => {
    const pa = [jx(a), YF + 3.4, za] as V3, pb = [jx(b), YF + 3.4, zb] as V3, m: V3 = [(pa[0] + pb[0]) / 2, YF + 24, Math.min(za, zb) - sag];
    const c = K.curve(pa, m, pb, 20), g = rope(K, c, 2.4, 'f body') + rope(K, c.slice(3, 5), 3.6, 'f tint') + rope(K, c.slice(16, 18), 3.6, 'f tint');
    return plug(a, za) + plug(b, zb) + (live ? lit(g) : g.replace("'f body'", 'f paper').replace('class="f body"', 'class="f paper"'));
  };
  s += cable(0, ZR[1], 2, ZR[0], 20) + cable(5, ZR[0], 7, ZR[1], 20) + cable(1, ZR[0], 4, ZR[1], 28, true) + cable(3, ZR[0], 6, ZR[0], 42);
  return s;
});

export const SKILL_ICONS = { regulator, passcard, stanchions, adapter, keyrack, periscope, clipboard, gauge, tagcounter, charger, reels, plug, trophies, rulers, logbook, lockout, weekpad, knocker, puzzle, bell, thermometer, drilled, sieve, mirror, bits, dial, abacus, patchpanel };
