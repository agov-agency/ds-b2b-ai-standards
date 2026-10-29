// Collection hero: a card-catalogue cabinet, one bank of drawers per library (scenarios a, skills b, rules c).
// A drawer in each bank opens in turn and an index card lifts out: everything in the Standard, filed and findable.
import { kernel, hue, k, f, type Piece } from './iso';

const CW = 210, CD = 110, Z0 = 24, CH = 190, FY = CD, TOPZ = Z0 + CH;
const XS = [10, 77, 144], DW = 56, DH = 36, ROWS = [166, 122, 78, 34], HUES = ['a', 'b', 'c'] as const, SLIDE = 56;
const K = kernel([[0, 0, 0], [0, FY + SLIDE + 12, 0], [CW, FY + SLIDE, 0], [-6, -6, TOPZ + 24], [CW + 6, -6, TOPZ + 8], [CW + 70, 40, 0], [CW + 44, -36, TOPZ + 40]], 14);
const { on, poly, box, arrow, FRONT, SIDE, TOP } = K;

// Label holder and pull, on a drawer front (local x right, y down).
const furniture = (x: number, y: number) =>
  `<rect class="f paper" x="${x + 18}" y="${y + 7}" width="20" height="9" rx=".5"/><line class="det" x1="${x + 22}" y1="${y + 11.5}" x2="${x + 34}" y2="${y + 11.5}"/>` +
  `<rect class="f paper" x="${x + 20}" y="${y + 22}" width="16" height="6" rx="3"/>`;

// An index card standing parallel to the front, at depth y, bottom at z. Cards are shorter than the opening so they
// never poke through the cabinet front while the drawer slides.
const card = (x: number, y: number, z: number, h: number, tab = false) =>
  poly([[x, y, z], [x + DW - 14, y, z], [x + DW - 14, y, z + h], [x, y, z + h]], 'f paper') +
  (tab ? on(FRONT(x, y, z + h), `<rect class="f body" x="6" y="-7" width="14" height="7" rx="1"/><line class="det" x1="6" y1="8" x2="34" y2="8"/><line class="det" x1="6" y1="14" x2="26" y2="14"/>`) : '');

interface Open { col: number; row: number; s: number; lift: number }

function cabinet(open: Open, extra = '') {
  let svg = '';
  // Feet (black punctuation), then the carcass with its top board
  for (const [x, y] of [[8, 8], [190, 8], [8, 90], [190, 90]]) svg += box(x, y, 0, 12, 12, Z0, 'blk', 'blk', 'blk');
  svg += hue('a', box(0, 0, Z0, CW, CD, CH, 'paper', 'body', 'paper') + box(-6, -6, TOPZ, CW + 12, CD + 12, 8, 'paper', 'body', 'blk'));
  svg += on(TOP(-6, -6, TOPZ + 8), `<rect class="det" x="6" y="6" width="${CW}" height="${CD}" rx="1"/>`);
  svg += on(SIDE(CW, CD, TOPZ), `<rect class="det" x="10" y="12" width="${CD - 20}" height="${CH - 24}" rx="1"/><rect class="det" x="16" y="18" width="${CD - 32}" height="${CH - 36}" rx="1"/>`);
  // A loose stack of cards on top
  svg += hue('c', box(24, 16, TOPZ + 8, 70, 46, 3, 'paper') + box(28, 13, TOPZ + 11, 70, 46, 3, 'paper') + box(31, 10, TOPZ + 14, 70, 46, 3, 'tint'));
  svg += on(TOP(31, 10, TOPZ + 17), `<line class="det" x1="8" y1="10" x2="52" y2="10"/><line class="det" x1="8" y1="17" x2="40" y2="17"/>`);
  // Drawer fronts on the carcass face; the open drawer leaves a dark cavity
  let face = '';
  XS.forEach((x, c) => ROWS.forEach((zb, r) => {
    const y = TOPZ - zb - DH;
    face += open.col === c && open.row === r && open.s > 0.5 ? `<rect class="f blk" x="${x}" y="${y}" width="${DW}" height="${DH}" rx="1"/>`
      : hue(HUES[c], `<rect class="f tint" x="${x}" y="${y}" width="${DW}" height="${DH}" rx="1"/>` + furniture(x, y));
  }));
  svg += on(FRONT(0, FY, TOPZ), face);
  svg += extra;
  // The drawer takes its bank's colour as it slides out and gives it back as it closes (a lit copy fading over the plain one)
  if (open.s > 0.5) svg += drawer(open) + `<g class="lit" style="opacity:${f((open.s / SLIDE) ** 2)}">${drawer(open)}</g>`;
  return svg;
}

function drawer({ col, row, s, lift }: Open) {
  const x = XS[col], zb = ROWS[row], w = DW, fz = zb + 3, wall = 28;
  let g = poly([[x + 3, FY, fz], [x + w - 3, FY, fz], [x + w - 3, FY + s - 4, fz], [x + 3, FY + s - 4, fz]], 'f tint');
  g += poly([[x + 3, FY, fz], [x + 3, FY + s - 4, fz], [x + 3, FY + s - 4, zb + wall], [x + 3, FY, zb + wall]], 'f body');
  for (let yc = FY + 6; yc < FY + s - 8; yc += 7) {
    const last = yc + 7 >= FY + s - 8;
    g += card(x + 7, yc, fz, 30 + (last ? lift : 0), last);
  }
  g += poly([[x + w, FY, zb], [x + w, FY + s - 4, zb], [x + w, FY + s - 4, zb + wall], [x + w, FY, zb + wall]], 'f body');
  g += box(x, FY + s - 4, zb, w, 4, DH, 'paper', 'body', 'tint');
  g += on(FRONT(x, FY + s, zb + DH), furniture(0, 0));
  return hue(HUES[col], g);
}

const rise = K.curve([CW + 44, 52, 0], [CW + 84, -8, 110], [CW + 34, -26, TOPZ + 34]);

export const directory: Piece = {
  aria: 'A card catalogue with three banks of drawers. One drawer at a time slides open and an index card lifts out.',
  period: 7.2, rest: 3.55, viewBox: K.viewBox, focus: [0.42, 0.58],
  draw(t) {
    // One bank after another, 2.4 s each: slide out, lift the card as the drawer settles, lower it, slide back
    const i = Math.floor((t % 7.2) / 2.4), u = (t % 7.2) - i * 2.4;
    const s = SLIDE * (k(u, 0, .6) - k(u, 1.75, 2.35)), lift = 40 * (k(u, .5, 1.05) - k(u, 1.3, 1.85));
    return cabinet({ col: i, row: [1, 2, 0][i], s, lift }, arrow(rise, { dot: true }));
  },
};
