// One-off, safe to re-run: generic exports get their own line icons instead of the shared list icon,
// and Cornerr (cornerr.io) joins as a connector on "Turn social signals into pipeline". Backup: cms/backups/2026-11-04-connectors.json
// Run: npx sanity exec migrations/2026-11-04-tool-icons-cornerr.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const brands = { 'connector-post-engagers-export': 'engagers', 'connector-website-visitors-export': 'visitors', 'connector-web-analytics-export': 'analytics', 'connector-csv-export': 'table' };
const tx = client.transaction();
for (const [id, brand] of Object.entries(brands)) tx.patch(id, (p) => p.set({ brand }));
tx.createIfNotExists({ _id: 'connector-cornerr', _type: 'connector', name: 'Cornerr', brand: 'cornerr' });
await tx.commit();

const id = 'scenario-turn-social-signals-into-pipeline';
const refs: { _ref: string }[] = (await client.fetch(`*[_id == $id][0].connectors`, { id })) ?? [];
if (!refs.some((r) => r._ref === 'connector-cornerr')) {
  // after the exports, before DemandSense (optional)
  const ds = refs.findIndex((r) => r._ref === 'connector-demandsense-optional');
  const item = { _key: 'cornerr', _type: 'reference', _ref: 'connector-cornerr' };
  await client.patch(id).setIfMissing({ connectors: [] }).insert(ds < 0 ? 'after' : 'before', ds < 0 ? 'connectors[-1]' : `connectors[${ds}]`, [item]).commit();
}
console.log('Connector icons updated, Cornerr added to', id);
