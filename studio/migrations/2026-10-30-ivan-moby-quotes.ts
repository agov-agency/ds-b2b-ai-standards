// One-off, safe to re-run: makes Ivan Falco's and Moby Hayat's rule quotes match Agov's final list (30 Oct 2026).
// Each quote is set in place (text, company, chip, link to the author page) or appended; a quote of theirs on a rule not listed is removed.
// Run: npx sanity exec migrations/2026-10-30-ivan-moby-quotes.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const DIFF = 'Runs it differently';
const PEOPLE = {
  'Ivan Falco': { slug: 'ivan-falco', company: 'Frontal' },
  'Moby Hayat': { slug: 'moby-hayat', company: 'Fireshow Media' },
} as const;
type Name = keyof typeof PEOPLE;
const QUOTES: [number, Name, string, string?][] = [
  [1, 'Ivan Falco', 'Often the job titles with no impressions aren\'t active on LinkedIn, but they are on other platforms, so those accounts can be reached through outbound and other ad platforms. To increase penetration on LinkedIn, I use an impression cap. That way the budget moves through the whole account list instead of going to the same few accounts and people.'],
  [2, 'Ivan Falco', 'I run separate campaigns for each stage: TOF, MOF and BOF. Each one has its own frequency benchmark over the last 30 days: TOF 1–2, MOF 4–5, BOF 8–10.'],
  [3, 'Ivan Falco', 'I look for at least a two-week pattern. Two weeks of the trend going down is when the fatigue trigger should fire. Then I decide whether to pause, based on frequency being high and CTR going down.'],
  [4, 'Ivan Falco', 'A lot of these ads get missed. Text ads can get a good cost per click to the landing page. CTR is always low, but impressions are cheap, so the cost per landing-page click can be really good. That\'s the number I look at.', DIFF],
  [5, 'Ivan Falco', 'It depends on audience size. Very small audiences rarely justify the split. It\'s better to exclude the low-performing segments and trim the audience, so the budget moves to the segments that perform better. When the biggest companies take most of the impressions, an impression cap is another option to splitting.', DIFF],
  [6, 'Ivan Falco', 'Agree. Judge on qualified leads and pipeline, not cost per click.'],
  [8, 'Ivan Falco', 'For campaigns aimed at a list of target companies, I also check every month which of them got ads and which got none.'],
  [8, 'Moby Hayat', 'Strongly agree. LinkedIn\'s targeting is very imperfect, from super titles to reaching some of the companies you\'ve excluded. Sometimes you want to crossvertise.'],
  [9, 'Ivan Falco', 'This rule is really about whether the audience can run. A CRM list can only run if LinkedIn matches enough of it, so check the match rate after upload, and enrich the contacts first so more of the list matches.'],
  [9, 'Moby Hayat', 'Agree. People assume LinkedIn works like Meta, where retargeting audiences are stored natively even before you create the audience. That\'s not the case.'],
  [10, 'Ivan Falco', 'If you can, always start with warm audiences. If not, go to cold.'],
  [10, 'Moby Hayat', 'The pushback I\'d have is when your cold audience is small, under 10,000. When you\'re branching into a TAM where you don\'t have a large presence, it\'s worth focusing on building that warm audience.', DIFF],
  [11, 'Ivan Falco', 'Cost per lead is not everything. A very broad lead gen offer can have a very low cost per lead, and a high-intent one a very high cost per lead. So before dropping a form over cost per lead, look at the intent of the offer and the quality of the leads.'],
  [12, 'Ivan Falco', 'To show the ads caused anything, split the target companies into two cohorts: one that gets ads and one that doesn\'t. Then compare replies and pipeline between the two. That\'s what we\'re running at Frontal now.'],
  [13, 'Ivan Falco', 'This is how I run LinkedIn Ads with outbound. Ad engagement decides which accounts outbound reaches next, and accounts with an open deal go to the deal owner, not to an SDR.'],
  [13, 'Moby Hayat', 'You can also cross-reference titles in your demographics report to give sales a list of priority titles who are likely to have seen the ads. If you\'re giving contacts, you can research whether they\'re active on LinkedIn, what they post about, and whether they\'ve been on any podcasts or panels, so sales has more openers.'],
  [15, 'Ivan Falco', 'Count the target companies that engaged, not the number of people. A big engager audience from the wrong companies won\'t buy.'],
];

const authors: string[] = await client.fetch(`*[_type == "author" && _id in $ids]._id`, { ids: Object.values(PEOPLE).map((p) => `author-${p.slug}`) });
for (const p of Object.values(PEOPLE)) if (!authors.includes(`author-${p.slug}`)) throw new Error(`No author-${p.slug}`);

const rules: { _id: string; number: number; voices: { _key: string; name: string }[] | null }[] = await client.fetch(
  `*[_type == "rule" && !(_id in path("drafts.**"))]{ _id, number, "voices": page.voices[]{ _key, name } }`,
);
const tx = client.transaction();
let set = 0, added = 0, removed = 0;
for (const rule of rules) {
  const voices = rule.voices ?? [];
  for (const name of Object.keys(PEOPLE) as Name[]) {
    const want = QUOTES.find(([n, who]) => n === rule.number && who === name);
    const have = voices.find((v) => v.name === name);
    if (!want) {
      if (have) { tx.patch(rule._id, (p) => p.unset([`page.voices[_key=="${have._key}"]`])); removed++; }
      continue;
    }
    const { slug, company } = PEOPLE[name];
    const fields = { name, company, quote: `“${want[2]}”`, author: { _type: 'reference', _ref: `author-${slug}` } };
    if (have) {
      const base = `page.voices[_key=="${have._key}"]`;
      tx.patch(rule._id, (p) => {
        p = p.set(Object.fromEntries(Object.entries(fields).map(([k, v]) => [`${base}.${k}`, v])));
        return want[3] ? p.set({ [`${base}.note`]: want[3] }) : p.unset([`${base}.note`]);
      });
      set++;
    } else {
      const voice = { _key: `${slug}-${rule.number}`, ...fields, ...(want[3] ? { note: want[3] } : {}) };
      tx.patch(rule._id, (p) => p.setIfMissing({ page: {} }).setIfMissing({ 'page.voices': [] }).append('page.voices', [voice]));
      added++;
    }
  }
}
for (const [n] of QUOTES) if (!rules.some((r) => r.number === n)) throw new Error(`No rule ${n}`);
await tx.commit({ visibility: 'sync' });
console.log(`Updated ${set}, added ${added}, removed ${removed}`);
