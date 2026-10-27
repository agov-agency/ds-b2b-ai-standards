// One-off, safe to re-run: replaces every author, rule, skill and scenario (published and drafts) with seed/directory.json.
// Categories, connectors and existing cadences stay; new cadences are added if missing. Pictures (art, icons) are picked later.
// Build the data first: python3 seed/directory.py
// Run: npx sanity exec migrations/2026-10-27-rebuild-directory.ts --with-user-token
import { readFileSync } from 'node:fs';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const docs = JSON.parse(readFileSync('seed/directory.json', 'utf8')) as any[];
const keep = new Set(docs.map((d) => d._id));
const old = (await client.fetch<string[]>('*[_type in ["author", "rule", "skill", "scenario"]]._id')).filter((id) => !keep.has(id));

// One transaction: old items go (same ids are simply replaced), new ones arrive, so the site never sees half of each
const tx = client.transaction();
old.forEach((id) => tx.delete(id));
for (const { _create, ...d } of docs) _create === 'ifNotExists' ? tx.createIfNotExists(d) : tx.createOrReplace(d);
await tx.commit({ visibility: 'sync' });
console.log(`Deleted ${old.length} old documents, wrote ${docs.length}`);
