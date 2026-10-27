// Hairline icons from the shared illustrations folder, inlined so CSS tokens can colour them
const raw = import.meta.glob('../../illustrations/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const icon = (name: string) => raw[`../../illustrations/icons/${name}.svg`] ?? '';
// What the CMS can pick: rules and skills draw from separate sets, so a rule never shares an icon with a skill.
// A new icon goes into illustrations/icons, then its name into one list here (category fallbacks may come from either)
export const ICON_POOLS: Record<'rule' | 'skill', string[]> = {
  rule: ['badge', 'coins', 'date', 'free', 'podium', 'reach', 'stage', 'week'],
  skill: ['audience', 'case', 'name', 'page', 'pair', 'plug', 'steps'],
};
