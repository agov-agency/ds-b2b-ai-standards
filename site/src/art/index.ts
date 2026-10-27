// Every hero / CTA piece by name. Each module exports a Piece (see iso.ts).
import { directory } from './catalogue';
import { cta } from './tray';
import { typewriter } from './typewriter';
import { scenarios } from './musicbox';
import { skills } from './press';
import { rules } from './gauge';
import type { Piece } from './iso';

export const pieces: Record<string, Piece> = { directory, scenarios, skills, rules, cta, typewriter };

// What the CMS can pick, per item type. Each type has its own figures and never shares one with another type
// (hub heroes above are in neither). Add a figure to `pieces`, then its name here.
export const ART_POOLS: Record<'scenario' | 'skill', string[]> = { scenario: [], skill: [] };
