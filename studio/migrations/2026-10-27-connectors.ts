// Safe to re-run: adds the standard connectors (studio/connectors.json) and gives every one its logo from the site's set.
// Also drops the figure colour picker's old values (figures follow the cover hue now).
// Logos already picked in the Studio are kept; "CRM export" has none, the site draws it as stacked CRM logos.
// Run: npx sanity exec migrations/2026-10-27-connectors.ts --with-user-token
import { readFileSync } from 'node:fs';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const list: Record<string, string | null> = JSON.parse(readFileSync('connectors.json', 'utf8'));
const tx = client.transaction();
for (const [name, brand] of Object.entries(list)) {
  const _id = `connector-${slugify(name)}`;
  tx.createIfNotExists({ _id, _type: 'connector', name });
  if (brand) tx.patch(_id, (p) => p.setIfMissing({ brand }));
}
// Figures took their colour from a picker; now they follow the cover hue, so the old field goes
for (const { _id } of await client.fetch<{ _id: string }[]>('*[defined(art.accent)]{_id}')) tx.patch(_id, (p) => p.unset(['art.accent']));
await tx.commit({ visibility: 'sync' });
console.log(`${Object.keys(list).length} connectors in place`);
