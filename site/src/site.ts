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
  { href: '/', label: 'Collection', match: ['/', '/scenarios', '/skills', '/rules'], badge: 'New' }, // badge hardcoded for now; '/' matches only itself
  { href: '/authors', label: T.authors, match: ['/authors'] },
  { href: '/why-we-exist', label: 'Why we exist', match: ['/why-we-exist'] },
];
export const LIB_NAV = [
  { href: '/', label: 'Collection' },
  { href: '/scenarios', label: T.scenarios },
  { href: '/skills', label: T.skills },
  { href: '/rules', label: T.rules },
];

export const CONTRIBUTE_URL = '/contribute';
// Community waitlist: placeholder until the waitlist page is live, then swap the URL here
export const COMMUNITY_URL = '/contribute';
// One plugin installs every skill and scenario; pages use it unless their own content sets an install block
export const INSTALL = [{ label: 'Claude Code', text: '/plugin install linkedin-ads-skills --marketplace demandsense-labs/linkedin-ads-skills' }];
export const REPO_URL = 'https://github.com/demandsense/the-ai-standard';

// Opening statements on Home (client copy, 28 Oct 2026); the post builder reuses them as quote posts
export const QUOTES = [
  { name: 'Justin Rowe', company: 'Impactable', photo: '/authors/justin-rowe.jpg', text: 'Pretty soon, everyone can “talk with your data”, but raw data needs to be interpreted with actual frameworks, doctrines, and a real point of view. That’s exactly what the Standard delivers.' },
  { name: 'Iurii Znak', company: 'DemandSense', photo: '/authors/iurii-znak.jpg', text: 'The people we work with every day tried AI on their LinkedIn accounts and loved how fast it was. Then they found themselves checking every answer by hand. The Standard is what we wrote down with them: the checks, as one open set of rules, kept up to date.' },
  { name: 'AJ Wilcox', company: 'B2Linked', photo: '/authors/aj-wilcox.jpg', text: 'AI in LinkedIn Ads needs rules because it was trained on recommendations from the platform itself, and advanced practitioners all agree that taking LinkedIn’s recommendations for setting up your ads is a first-class ticket to negative ROI.' },
];
