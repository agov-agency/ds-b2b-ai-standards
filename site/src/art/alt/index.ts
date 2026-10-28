// Alternative takes on the item illustrations (scenario figures, skill and rule icons), kept out of `pieces` and the
// CMS pools until Agov picks which go in. Each batch file here exports ALTS: name → { of, idea, piece }, where `of` is
// the piece it is an alternative to ('sorter', 'i-clock'). Preview: /art-alts.
import type { Piece } from '../iso';

export interface Alt { of: string; idea: string; piece: Piece }
const batches = import.meta.glob<{ ALTS: Record<string, Alt> }>(['./*.ts', '!./index.ts'], { eager: true });
export const alts: Record<string, Alt> = Object.assign({}, ...Object.values(batches).map((m) => m.ALTS));
