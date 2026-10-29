// One-off, safe to re-run: deletes the test rule "Sample rule, every field filled" (rule-sample).
// The sample scenario and skill reference it, so those links are removed first; the samples themselves stay.
// Run: npx sanity exec migrations/2026-10-29-delete-sample-rule.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const ID = 'rule-sample';

const refs: { _id: string }[] = await client.fetch(`*[references($id)]{ _id }`, { id: ID });
const tx = client.transaction();
for (const { _id } of refs) tx.patch(_id, (p) => p.unset([`rules[_ref=="${ID}"]`]));
tx.delete(ID).delete(`drafts.${ID}`);
await tx.commit({ visibility: 'sync' });
console.log(`Unlinked from ${refs.map((r) => r._id).join(', ') || 'nothing'}; deleted ${ID}`);
