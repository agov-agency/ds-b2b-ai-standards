// One-off, safe to re-run: one fully filled sample per directory type (author, scenario, skill, rule), to see a complete page.
// Each copies a real item and fills every field it leaves empty. Delete the four `*-sample` documents when real content is complete.
// The scenario figure and rule icon come from outside the CMS pools, so they never clash with a real item's pick.
// Run: npx sanity exec migrations/2026-10-28-samples.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const r = (_ref: string) => ({ _type: 'reference', _ref });
const img = (id: string) => ({ _type: 'image', asset: r(id) });
let n = 0;
const k = <T extends object>(xs: T[]) => xs.map((x) => ({ _key: `s${n++}`, ...x }));
const base = async (id: string) => {
  const { _rev, _createdAt, _updatedAt, ...d } = await client.getDocument(id) as any;
  return d;
};
const SHOT = ['image-74c002f1e6201f98db09a939834053f4fc6506f9-2048x1280-png', 'image-ae2712a453eefb6099b68d89d32a09830b9beadb-2048x1280-png', 'image-fd055c970fce5a82568b4652323be76c0feedaf2-2048x1280-png'];
const gallery = (what: string) => k(['Ranked list', 'Weekly summary', 'Change log'].map((title, i) => ({ title, caption: `Sample ${what} output: ${title.toLowerCase()}`, src: img(SHOT[i]) })));
const cta = { _type: 'cta', headline: 'Run it on your own account.', context: 'Sample closing card: every field of the CTA is filled.', button: 'Get it', note: 'Free. Reads your data, changes nothing.' };

const author = {
  _id: 'author-sample', _type: 'author', name: 'Sample Author', role: 'Head of Paid Social', company: 'Sample Co',
  photo: img('image-49c0253cdc108bd7ab0f957417a220f740ad2935-320x320-jpg'),
  about: 'Sample author with every field filled: photo, role, company, a bio of about forty words and all four link types. Runs LinkedIn Ads for B2B software companies and writes down what works so other teams can run it too.',
  links: k([['linkedin', 'LinkedIn', 'https://www.linkedin.com/'], ['x', 'X', 'https://x.com/'], ['github', 'GitHub', 'https://github.com/'], ['web', 'Website', 'https://example.com/']].map(([icon, label, url]) => ({ icon, label, url }))),
  slug: { _type: 'slug', current: 'sample-author' }, featured: false, order: 99,
};

const sc = await base('scenario-targeting-vs-who-actually-buys');
const scenario = {
  ...sc, _id: 'scenario-sample', title: 'Sample scenario, every field filled', slug: { _type: 'slug', current: 'sample-scenario' }, order: 99,
  author: r('author-sample'), firstRun: 'About ten minutes', art: { _type: 'scenarioArt', piece: 'scenarios', variant: 'color', zoom: 1 },
  rules: k([r('rule-sample'), r('rule-count-an-audience-as-warm-only-once-it-can-serve')]),
  skills: k([r('skill-sample'), r('skill-multichannel-performance-rollup')]),
  page: {
    ...sc.page,
    catches: {
      headline: 'Most of the budget reaches people who never buy.', context: 'This section shows what the scenario finds on a real account.',
      body: 'First paragraph of the body text. It explains what the scenario looks at and why it matters.\n\nSecond paragraph, after a blank line, to show the paragraph break.',
      note: 'Example from a sample B2B account, Q3 2026',
      findings: k([['38% of spend on junior titles', 'Interns and coordinators took over a third of impressions.'], ['Two profiles drive 70% of pipeline', 'Directors in finance and operations.'], ['One campaign never converts', 'Its audience overlaps no buying committee.']].map(([title, text]) => ({ title, text }))),
    },
    comesBack: { headline: 'What comes back.', context: 'Three outputs, one slide each.', items: gallery('scenario') },
    usingHead: { _type: 'headline', headline: 'Using it week to week.', context: 'What changes once it runs on a schedule.' },
    using: k([['week', 'Monday check', 'A short list of what moved since last week.'], ['coins', 'Budget moves', 'Spend shifts toward profiles that buy.'], ['audience', 'Cleaner audiences', 'Exclusions grow as junior titles are found.']].map(([icon, title, text]) => ({ icon, title, text }))),
    steps: sc.page.steps.map((s: any, i: number) => ({ ...s, note: `Sample note under step ${i + 1}`, ...(i === 0 && { skill: r('skill-sample') }), key: i === 3 })),
    cta,
  },
};

const sk = await base('skill-multichannel-performance-rollup');
const skill = {
  ...sk, _id: 'skill-sample', title: 'Sample skill, every field filled', slug: { _type: 'slug', current: 'sample-skill' }, order: 99,
  author: r('author-sample'), firstRun: 'About five minutes', icon: undefined, // no icon: every skill icon belongs to a real skill, so the sample shows its category's
  rules: k([r('rule-sample'), r('rule-count-an-audience-as-warm-only-once-it-can-serve')]),
  page: {
    ...sk.page,
    steps: k([['Read the exports', 'One file per platform, same dates.'], ['Match currencies', 'Totals only where currencies match.'], ['Line up results', 'Each result with its own definition.'], ['Add pipeline', 'CRM pipeline next to paid spend.']].map(([title, text]) => ({ title, text }))),
    stepsNote: { _type: 'headline', headline: 'Then it stops.', context: 'It recommends, you decide.' },
    output: {
      headline: 'One honest view.', context: 'Numbers first, then the slides.',
      stats: k([['49%', 'of spend on LinkedIn'], ['3', 'channels compared'], ['$1.2M', 'pipeline next to spend']].map(([value, label]) => ({ value, label, accent: false }))),
      items: gallery('skill'), note: 'Sample note under the gallery, with **bold** text.',
    },
    prompt: { ...sk.page.prompt, install: k([['Claude Code', 'claude skill add demandsense-labs/linkedin-ads-skills'], ['Codex', 'codex skills install demandsense-labs/linkedin-ads-skills']].map(([label, text]) => ({ label, text }))) },
    useWhen: k([['date', 'Month end', 'When the report is due and the numbers disagree.'], ['pair', 'Two platforms', 'When LinkedIn and Google both claim the same deal.'], ['case', 'Budget review', 'Before moving money between channels.']].map(([icon, title, text]) => ({ icon, title, text }))),
    partOf: 'Sample line in the Related section.',
  },
};

const ru = await base('rule-count-an-audience-as-warm-only-once-it-can-serve');
const rule = {
  ...ru, _id: 'rule-sample', title: 'Sample rule, every field filled', slug: { _type: 'slug', current: 'sample-rule' }, number: 99,
  lead: 'Sample hero text: a longer paragraph than the Why line, shown under the title at the top of the page.',
  author: r('author-sample'), icon: 'reach',
  page: { ...ru.page, advises: { ...ru.page.advises, url: 'https://www.linkedin.com/help/lms' }, voices: ru.page.voices.map((v: any) => ({ context: 'Runs paid social for B2B SaaS', source: 'LinkedIn post, Sep 2026', url: 'https://www.linkedin.com/', note: 'Sample note', ...v })), cta },
};

const tx = client.transaction();
for (const d of [author, rule, skill, scenario]) tx.createOrReplace(d);
await tx.commit({ visibility: 'sync' });
console.log('Created or replaced author-sample, rule-sample, skill-sample, scenario-sample');
