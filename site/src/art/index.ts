// Every hero / CTA piece by name. Each module exports a Piece (see iso.ts).
import { directory } from './catalogue';
import { cta } from './tray';
import { typewriter } from './typewriter';
import { scenarios } from './musicbox';
import { skills } from './press';
import { rules } from './gauge';
import { sorter } from './sorter';
import { orrery } from './orrery';
import { galton } from './galton';
import { lineshaft } from './lineshaft';
import { baggage } from './baggage';
import { analyzer } from './analyzer';
import { pumpjack } from './pumpjack';
import { burnin } from './burnin';
import { turnstile_i, metronome_i, siphon_i } from './icons';
import type { Piece } from './iso';

export const pieces: Record<string, Piece> = { directory, scenarios, skills, rules, cta, typewriter, sorter, orrery, galton, lineshaft, baggage, analyzer, pumpjack, burnin, 'i-turnstile': turnstile_i, 'i-metronome': metronome_i, 'i-siphon': siphon_i };

// What the CMS can pick: only scenarios use figures (skills and rules use line icons, src/icons.ts); hub heroes are not in it.
// A new figure goes into `pieces`, then its name here.
export const ART_POOLS: Record<'scenario', string[]> = { scenario: ['sorter', 'orrery', 'galton', 'lineshaft', 'baggage', 'analyzer', 'pumpjack', 'burnin'] };
