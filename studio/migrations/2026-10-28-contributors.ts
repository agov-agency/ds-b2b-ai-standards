// Safe to re-run: every contributor from the Contributors tab of the tracker sheet as an author, with company, LinkedIn,
// job title and photo (both read from LinkedIn into $CONTRIB_DIR/linkedin.json + photos/) and a one-line About from their piece.
// Backs up all author documents to $CONTRIB_DIR first. DRY=1 prints the plan without writing.
// Run: CONTRIB_DIR=<folder> npx sanity exec migrations/2026-10-28-contributors.ts --with-user-token
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const dir = process.env.CONTRIB_DIR;
if (!dir) throw new Error('Set CONTRIB_DIR to the folder with linkedin.json and photos/');
const dry = !!process.env.DRY;
const li: Record<string, { role?: string; photo?: string | null }> = JSON.parse(readFileSync(join(dir, 'linkedin.json'), 'utf8'));

// slug, name, company, LinkedIn, About (empty until their piece is in)
const PEOPLE: [string, string, string, string, string?][] = [
  ['justin-rowe', 'Justin Rowe', 'Impactable', 'https://www.linkedin.com/in/justin-rowe-4043339b/', 'Author of the warm-lead handoff scenario in the Standard.'],
  ['roman-slobodzianyk', 'Roman Slobodzianyk', 'Impactable', 'https://www.linkedin.com/in/roman-slobodzianyk-b67549140/', 'Author of the account audit by cadence scenario in the Standard: eight checks on a schedule.'],
  ['george-coudounaris', 'George Coudounaris', 'The B2B Playbook', 'https://www.linkedin.com/in/b2b-marketing-expert/', 'Author of the monthly targeting review scenario in the Standard: targeting versus who actually buys.'],
  ['joshua-stout', 'Joshua Stout', 'Beyond The Funnel', 'https://www.linkedin.com/in/joshua-stout/', 'Author of the company-level account routing scenario in the Standard.'],
  ['jonathan-belliveau', 'Jonathan Belliveau', 'GrowthMotiv', 'https://www.linkedin.com/in/jonathan-belliveau/', 'Author of the LinkedIn fit gate skill and the daily fit check in the Standard.'],
  ['bogdan-liutic', 'Bogdan Liutic', 'CR8', 'https://www.linkedin.com/in/bgdn/', 'Author of the signal loop scenario in the Standard.'],
  ['alfredo-talib', 'Alfredo Talib', 'Cornersight', 'https://www.linkedin.com/in/alfredo-iscandar-talib/', 'Author of the scenario in the Standard that turns social signals into pipeline.'],
  ['moby-hayat', 'Moby Hayat', 'The Fire Show', 'https://www.linkedin.com/in/moby/', 'Author of the weekly check for conversion campaigns in the Standard.'],
  ['ivars-krutainis', 'Ivars Krutainis', 'Otter', 'https://www.linkedin.com/in/krutainis/', 'Author of the landing-page CPC report skill in the Standard.'],
  ['aj-wilcox', 'AJ Wilcox', 'B2Linked', 'https://www.linkedin.com/in/wilcoxaj/', 'Proposed four skills for the Standard, from the lowest bid that still spends to retargeting guardrails.'],
  ['ivan-falco', 'Ivan Falco', 'Frontal AI', 'https://www.linkedin.com/in/ivanfalco/', 'Commented on 13 of the Standard’s 15 rules.'],
  ['fivos-aresti', 'Fivos Aresti', 'Workflows.io', 'https://www.linkedin.com/in/fivosaresti/'],
  ['kristof-bardos', 'Kristof Bardos', 'Marketixa', 'https://www.linkedin.com/in/kristof-bardos/'],
  ['mason-cosby', 'Mason Cosby', 'Scrappy ABM', 'https://www.linkedin.com/in/masoncosby/'],
  ['sheila-coque', 'Sheila Coque', 'ads2in', 'https://www.linkedin.com/in/sheila-coque/'],
  ['tim-davidson', 'Tim Davidson', 'B2B Rizz', 'https://www.linkedin.com/in/tadavidson41/'],
  ['sam-kuehnle', 'Sam Kuehnle', 'Dereva', 'https://www.linkedin.com/in/samkuehnle/'],
  ['patrick-cumming', 'Patrick Cumming', 'Ad Juice', 'https://www.linkedin.com/in/patrick-james-cumming/'],
  ['rob-muldoon', 'Rob Muldoon', 'Tuned Social', 'https://www.linkedin.com/in/robmuldoon/'],
];

const before = await client.fetch<any[]>('*[_type == "author"]');
writeFileSync(join(dir, `backup-authors-${new Date().toISOString().replace(/[:.]/g, '-')}.json`), JSON.stringify(before, null, 2));
const existing = new Map(before.filter((d) => !d._id.startsWith('drafts.')).map((d) => [d._id, d]));
let next = Math.max(0, ...before.filter((d) => (d.order ?? 0) < 99).map((d) => d.order ?? 0)) + 1;

const tx = client.transaction();
for (const [slug, name, company, url, about] of PEOPLE) {
  const _id = `author-${slug}`;
  const { role, photo } = li[slug] ?? {};
  const set: Record<string, unknown> = { name, company };
  if (role) set.role = role;
  if (about) set.about = about;
  const file = photo && join(dir, photo);
  if (file && existsSync(file) && !existing.get(_id)?.photo) {
    if (!dry) {
      const asset = await client.assets.upload('image', createReadStream(file), { filename: `${slug}.jpg` });
      set.photo = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    } else set.photo = file;
  }
  // New people go last and stay off the home page until their piece is in
  tx.createIfNotExists({ _id, _type: 'author', name, slug: { _type: 'slug', current: slug }, featured: false, order: existing.has(_id) ? undefined : next++ });
  tx.patch(_id, (p) => p.set(set).setIfMissing({ links: [{ _key: 'li', icon: 'linkedin', label: 'LinkedIn', url }] }));
  console.log(existing.has(_id) ? 'update' : 'create', slug, JSON.stringify(set));
}
if (dry) console.log('DRY: nothing written');
else { await tx.commit({ visibility: 'sync' }); console.log(`${PEOPLE.length} contributors in place; backup in ${dir}`); }
