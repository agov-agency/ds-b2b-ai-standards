// Safe to re-run: every contributor from the Contributors tab of the tracker sheet as an author, with company, LinkedIn,
// job title and photo (both read from LinkedIn into $CONTRIB_DIR/linkedin.json + photos/).
// About stays empty until the authors send their bios.
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

// slug, name, company, LinkedIn
const PEOPLE: [string, string, string, string][] = [
  ['justin-rowe', 'Justin Rowe', 'Impactable', 'https://www.linkedin.com/in/justin-rowe-4043339b/'],
  ['roman-slobodzianyk', 'Roman Slobodzianyk', 'Impactable', 'https://www.linkedin.com/in/roman-slobodzianyk-b67549140/'],
  ['george-coudounaris', 'George Coudounaris', 'The B2B Playbook', 'https://www.linkedin.com/in/b2b-marketing-expert/'],
  ['joshua-stout', 'Joshua Stout', 'Beyond The Funnel', 'https://www.linkedin.com/in/joshua-stout/'],
  ['jonathan-belliveau', 'Jonathan Belliveau', 'GrowthMotiv', 'https://www.linkedin.com/in/jonathan-belliveau/'],
  ['bogdan-liutic', 'Bogdan Liutic', 'CR8', 'https://www.linkedin.com/in/bgdn/'],
  ['alfredo-talib', 'Alfredo Talib', 'Cornersight', 'https://www.linkedin.com/in/alfredo-iscandar-talib/'],
  ['moby-hayat', 'Moby Hayat', 'The Fire Show', 'https://www.linkedin.com/in/moby/'],
  ['ivars-krutainis', 'Ivars Krutainis', 'Otter', 'https://www.linkedin.com/in/krutainis/'],
  ['aj-wilcox', 'AJ Wilcox', 'B2Linked', 'https://www.linkedin.com/in/wilcoxaj/'],
  ['ivan-falco', 'Ivan Falco', 'Frontal AI', 'https://www.linkedin.com/in/ivanfalco/'],
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
for (const [slug, name, company, url] of PEOPLE) {
  const _id = `author-${slug}`;
  const { role, photo } = li[slug] ?? {};
  const set: Record<string, unknown> = { name, company };
  if (role) set.role = role;
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
