// Every piece by name: the animated figures plus the static skill and rule icons (`i-<name>`). Each module exports a Piece (see iso.ts).
import { figures } from './figures';
import { turnstile_i, metronome_i, siphon_i } from './icons';
import { SKILL_ICONS } from './icons-skills';
import { RULE_ICONS } from './icons-rules';
import { ALT_RULES } from './alt-rules';
import { ALT_SKILLS_A } from './alt-skills-1';
import type { Piece } from './iso';

export const pieces: Record<string, Piece> = { ...figures, 'i-turnstile': turnstile_i, 'i-metronome': metronome_i, 'i-siphon': siphon_i,
  ...Object.fromEntries(Object.entries({ ...SKILL_ICONS, ...RULE_ICONS }).map(([n, p]) => [`i-${n}`, p])),
  // Alternatives on /art-review (`x-<name>`), not in any pool until picked
  ...Object.fromEntries(Object.entries({ ...ALT_RULES, ...ALT_SKILLS_A }).map(([n, p]) => [`x-${n}`, p])) };

// What the CMS can pick: only scenarios use figures (skills and rules use the `i-<name>` icons, pools in src/icons.ts); hub heroes are not in it.
// A new figure goes into `pieces`, then its name here.
export const ART_POOLS: Record<'scenario', string[]> = { scenario: ['sorter', 'orrery', 'galton', 'lineshaft', 'baggage', 'analyzer', 'pumpjack', 'burnin'] };
