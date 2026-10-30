// One place for names that may change (the brief: "Scenarios" may be renamed again).
export const T = {
  scenario: 'Scenario', scenarios: 'Scenarios',
  skill: 'Skill', skills: 'Skills',
  rule: 'Rule', rules: 'Rules',
  authors: 'Authors',
};

// Categories (former areas) live in content/categories or the CMS: see src/areas.ts

// Two levels of navigation: the site header (every page) and the library tab bar (Collection and the three hubs only)
export const SITE_NAV = [
  { href: '/collection', label: 'Collection', match: ['/collection', '/scenarios', '/skills', '/rules'], badge: 'New' }, // badge hardcoded for now
  { href: '/authors', label: T.authors, match: ['/authors'] },
];
export const LIB_NAV = [
  { href: '/collection', label: 'Collection' },
  { href: '/scenarios', label: T.scenarios },
  { href: '/skills', label: T.skills },
  { href: '/rules', label: T.rules },
];

export const CONTRIBUTE_URL = '/contribute';
export const REPO_URL = 'https://github.com/demandsense/the-ai-standard';

// Opening statements on Home (client copy, 28 Oct 2026); the post builder reuses them as quote posts
export const QUOTES = [
  { name: 'Iurii Znak', company: 'DemandSense', photo: '/authors/iurii-znak.jpg', text: 'There’s a trust problem with AI in LinkedIn Ads. The people we work with every day have tried it, and they still check every answer by hand. That’s why we built the Standard: one open set of rules for running LinkedIn Ads with AI, written with the experts and kept up to date.' },
  { name: 'AJ Wilcox', company: 'B2Linked', photo: '/authors/aj-wilcox.jpg', text: 'AI in LinkedIn Ads needs rules because it was trained on recommendations from the platform itself, and advanced practitioners all agree that taking LinkedIn’s recommendations for setting up your ads is a first-class ticket to negative ROI.' },
  { name: 'Justin Rowe', company: 'Impactable', photo: '/authors/justin-rowe.jpg', text: 'Pretty soon, everyone can “talk with your data”, but raw data needs to be interpreted with actual frameworks, doctrines, and a real point of view. That’s exactly what the Standard delivers.' },
];
