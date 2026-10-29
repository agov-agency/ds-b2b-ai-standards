// Safe to re-run: marks the agreed top contributors (Top contributor on) and gives them order 1–7 in the agreed sequence;
// every other author keeps its relative order after them. Replaces the hardcoded list in the home spotlight (Meet.astro).
// Backs up all author documents to $BACKUP_DIR (default: current folder) first. DRY=1 prints the plan without writing.
// Run: npx sanity exec migrations/2026-10-29-top-contributors.ts --with-user-token
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const dry = !!process.env.DRY;
const TOP = ['justin-rowe', 'joshua-stout', 'jonathan-belliveau', 'aj-wilcox', 'bogdan-liutic', 'ivars-krutainis', 'ivan-falco'];

const all = await client.fetch<any[]>('*[_type == "author"]');
writeFileSync(join(process.env.BACKUP_DIR ?? '.', `backup-authors-${new Date().toISOString().replace(/[:.]/g, '-')}.json`), JSON.stringify(all, null, 2));
const docs = all.filter((d) => !d._id.startsWith('drafts.'));
const slug = (d: any) => d.slug?.current;
const missing = TOP.filter((s) => !docs.some((d) => slug(d) === s));
if (missing.length) throw new Error(`No published author for: ${missing.join(', ')}`);

// Top ones in the agreed order, then the rest as they were (DemandSense and other 99s stay last)
const rest = docs.filter((d) => !TOP.includes(slug(d))).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
const plan = new Map<string, { top: boolean; order: number }>();
TOP.forEach((s, i) => plan.set(docs.find((d) => slug(d) === s)!._id, { top: true, order: i + 1 }));
rest.forEach((d, i) => plan.set(d._id, { top: false, order: (d.order ?? 99) >= 99 ? d.order ?? 99 : TOP.length + i + 1 }));

// Drafts get the same values, or publishing one would bring its old order back
const tx = client.transaction();
for (const d of all) {
  const set = plan.get(d._id.replace(/^drafts\./, ''));
  if (!set) continue;
  tx.patch(d._id, (p) => p.set(set));
  console.log(String(set.order).padStart(3), set.top ? 'TOP' : '   ', d._id);
}
if (dry) console.log('DRY: nothing written');
else console.log('committed', (await tx.commit()).results.length, 'patches');
