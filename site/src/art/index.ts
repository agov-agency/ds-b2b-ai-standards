// Every hero / CTA piece by name. Each module exports a Piece (see iso.ts).
import { directory } from './catalogue';
import { cta } from './tray';
import { typewriter } from './typewriter';
import { scenarios } from './musicbox';
import { skills } from './press';
import { rules } from './gauge';
import type { Piece } from './iso';

export const pieces: Record<string, Piece> = { directory, scenarios, skills, rules, cta, typewriter };

// What the CMS can pick: only scenarios use figures (skills and rules use line icons, src/icons.ts); hub heroes are not in it. Add a figure to `pieces`, then its name here.
export const ART_POOLS: Record<'scenario', string[]> = { scenario: [] };
