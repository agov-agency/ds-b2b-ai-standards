// One place for names that may change (the brief: "Scenarios" may be renamed again).
export const T = {
  scenario: 'Scenario', scenarios: 'Scenarios',
  skill: 'Skill', skills: 'Skills',
  rule: 'Rule', rules: 'Rules',
  authors: 'Authors',
};

// Categories (former areas) live in content/categories or the CMS: see src/areas.ts

// Two levels of navigation: the site header (every page) and the library tab bar (Directory and the three hubs only)
export const SITE_NAV = [
  { href: '/directory', label: 'Directory', match: ['/directory', '/scenarios', '/skills', '/rules'], badge: 'New' }, // badge hardcoded for now
  { href: '/authors', label: T.authors, match: ['/authors'] },
];
export const LIB_NAV = [
  { href: '/directory', label: 'Directory' },
  { href: '/scenarios', label: T.scenarios },
  { href: '/skills', label: T.skills },
  { href: '/rules', label: T.rules },
];

export const CONTRIBUTE_URL = '/contribute';
export const REPO_URL = 'https://github.com/demandsense/the-ai-standard';
