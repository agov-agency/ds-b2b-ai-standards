// One-off, safe to re-run: Cornerr was the wrong company; Cornersight (cornersight.io) replaces it on "Turn social signals into pipeline".
// Run: npx sanity exec migrations/2026-11-04-cornersight.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const id = 'scenario-turn-social-signals-into-pipeline';
await client.createIfNotExists({ _id: 'connector-cornersight', _type: 'connector', name: 'Cornersight', brand: 'cornersight' });
const refs: { _key: string; _ref: string }[] = (await client.fetch(`*[_id == $id][0].connectors`, { id })) ?? [];
const old = refs.find((r) => r._ref === 'connector-cornerr');
if (old) await client.patch(id).set({ [`connectors[_key=="${old._key}"]`]: { _key: 'cornersight', _type: 'reference', _ref: 'connector-cornersight' } }).commit();
if (await client.fetch(`count(*[references("connector-cornerr")])`) === 0) await client.delete('connector-cornerr');
console.log('Cornersight replaces Cornerr on', id);
