// Every animated piece (hero, CTA, scenario figures) by name. The page script imports only this, so the
// static skill and rule icons never ship to the browser.
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
import type { Piece } from './iso';

export const figures: Record<string, Piece> = { directory, scenarios, skills, rules, cta, typewriter, sorter, orrery, galton, lineshaft, baggage, analyzer, pumpjack, burnin };
