// Hairline icons from the shared illustrations folder, inlined so CSS tokens can colour them
const raw = import.meta.glob('../../illustrations/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const icon = (name: string) => raw[`../../illustrations/icons/${name}.svg`] ?? '';
// What the CMS can pick: rules and skills draw from separate sets, so a rule never shares an icon with a skill.
// A new icon goes into illustrations/icons, then its name into one list here (category fallbacks may come from either)
export const ICON_POOLS: Record<'rule' | 'skill', string[]> = {
  rule: ['clock', 'rollerstamp', 'bolts', 'billboard', 'wedge', 'tilttray', 'binbar', 'xray', 'springscale', 'cascade', 'aperture', 'canisters', 'airlock', 'chain', 'magnet'],
  skill: ['turnstile', 'regulator', 'passcard', 'stanchions', 'adapter', 'keyrack', 'periscope', 'clipboard', 'table', 'tagcounter', 'batteries', 'reels', 'tap', 'trophies', 'rulers', 'logbook',
    'lockout', 'weekpad', 'knocker', 'metronome', 'siphon', 'puzzle', 'bell', 'thermometer', 'drilled', 'sieve', 'mirror', 'bits', 'dial', 'abacus', 'patchpanel'],
};
