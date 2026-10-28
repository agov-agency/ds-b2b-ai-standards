// One-off, safe to re-run: adds Ivan Falco's (Frontal) quotes from the rule pages copy doc to the 13 rules that have one.
// Appended after the other voices, as in the doc. Rules that already quote him are skipped.
// Run: npx sanity exec migrations/2026-10-28-ivan-falco-quotes.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const DIFF = 'Runs it differently';
const QUOTES: [number, string, string?][] = [
  [1, 'Often the job titles with no impressions aren\'t active on LinkedIn, but they are on other platforms, so those accounts can be reached through outbound and other ad platforms. To increase penetration on LinkedIn, I use an impression cap. That way the budget moves through the whole account list instead of going to the same few accounts and people.'],
  [2, 'I run separate campaigns for each stage: TOF, MOF and BOF. Each one has its own frequency benchmark over the last 30 days: TOF 1–2, MOF 4–5, BOF 8–10.'],
  [3, 'I look for at least a two-week pattern. Two weeks of the trend going down is when the fatigue trigger should fire. Then I decide whether to pause, based on frequency being high and CTR going down.'],
  [4, 'A lot of these ads get missed. Text ads can get a good cost per click to the landing page. CTR is always low, but impressions are cheap, so the cost per landing-page click can be really good. That\'s the number I look at.', DIFF],
  [5, 'It depends on audience size. Very small audiences rarely justify the split. It\'s better to exclude the low-performing segments and trim the audience, so the budget moves to the segments that perform better. When the biggest companies take most of the impressions, an impression cap is another option to splitting.', DIFF],
  [6, 'Agree. Judge on qualified leads and pipeline, not cost per click.'],
  [8, 'For campaigns aimed at a list of target companies, I also check every month which of them got ads and which got none.'],
  [9, 'This rule is really about whether the audience can run. A CRM list can only run if LinkedIn matches enough of it, so check the match rate after upload, and enrich the contacts first so more of the list matches.'],
  [10, 'If you can, always start with warm audiences. If not, go to cold.'],
  [11, 'Cost per lead is not everything. A very broad lead gen offer can have a very low cost per lead, and a high-intent one a very high cost per lead. So before dropping a form over cost per lead, look at the intent of the offer and the quality of the leads.'],
  [12, 'To show the ads caused anything, split the target companies into two cohorts: one that gets ads and one that doesn\'t. Then compare replies and pipeline between the two. That\'s what we\'re running at Frontal now.'],
  [13, 'This is how I run LinkedIn Ads with outbound. Ad engagement decides which accounts outbound reaches next, and accounts with an open deal go to the deal owner, not to an SDR.'],
  [15, 'Count the target companies that engaged, not the number of people. A big engager audience from the wrong companies won\'t buy.'],
];

const rules: { _id: string; number: number; names: string[] | null }[] = await client.fetch(
  `*[_type == "rule" && !(_id in path("drafts.**")) && number in $ns]{ _id, number, "names": page.voices[].name }`,
  { ns: QUOTES.map(([n]) => n) },
);
const tx = client.transaction();
let added = 0;
for (const [n, quote, note] of QUOTES) {
  const rule = rules.find((r) => r.number === n);
  if (!rule) throw new Error(`No rule ${n}`);
  if (rule.names?.includes('Ivan Falco')) continue;
  const voice = { _key: `ivan-falco-${n}`, name: 'Ivan Falco', company: 'Frontal', quote: `“${quote}”`, ...(note ? { note } : {}) };
  tx.patch(rule._id, (p) => p.setIfMissing({ page: {} }).setIfMissing({ 'page.voices': [] }).append('page.voices', [voice]));
  added++;
}
if (added) await tx.commit({ visibility: 'sync' });
console.log(`Added ${added} Ivan Falco quotes (${QUOTES.length - added} already there)`);
