// Safe to re-run: the "What you get" gallery on Warm-lead handoff, four screenshots of a real run (sample data).
// Sets page.comesBack on the published document and its draft; backs both up to $BACKUP_DIR (default: current folder) first. DRY=1 prints the plan.
// Run from studio/: npx sanity exec migrations/2026-10-30-warm-lead-gallery.ts --with-user-token
import { createReadStream, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const dry = !!process.env.DRY;
const dir = join(process.cwd(), 'migrations/assets/warm-lead-handoff');
const ID = 'scenario-warm-lead-handoff';

const SLIDES = [
  ['1-ask.png', 'The ask', 'One line to Claude: run the skill on last month’s LinkedIn Ads engagement'],
  ['2-summary.png', 'The summary', 'Who to call this week, in counts, with the top ten accounts and why'],
  ['3-call-list.png', 'The call list', 'Every account with its priority, CRM state, who takes it and the line a rep can say'],
  ['4-hand-off.png', 'The hand-off', 'The call list and the exclusion list as CSV files, ready for the team'],
];

const docs = await client.fetch<any[]>('*[_id in [$id, "drafts." + $id]]', { id: ID });
if (!docs.length) throw new Error(`No ${ID}`);
writeFileSync(join(process.env.BACKUP_DIR ?? '.', `backup-${ID}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`), JSON.stringify(docs, null, 2));

const items = [];
for (const [file, title, caption] of SLIDES) {
  const src = dry ? file
    : { _type: 'image', asset: { _type: 'reference', _ref: (await client.assets.upload('image', createReadStream(join(dir, file)), { filename: `warm-lead-handoff-${file}` }))._id } };
  items.push({ _key: file.replace('.png', ''), title, caption, src });
  console.log(title, '|', caption);
}
const comesBack = { headline: 'A call list for this week.', context: 'Who to call, who takes them, and what to say', items };

const tx = client.transaction();
// Drafts too, or publishing one would bring the empty gallery back
for (const d of docs) tx.patch(d._id, (p) => p.setIfMissing({ page: {} }).set({ 'page.comesBack': comesBack }));
if (dry) console.log('DRY: nothing written', docs.map((d) => d._id));
else console.log('committed', (await tx.commit()).results.length, 'patches');
