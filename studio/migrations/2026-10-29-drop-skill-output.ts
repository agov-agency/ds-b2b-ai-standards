// One-off, safe to re-run: removes the "What you get" gallery (page.output) from every skill, drafts included.
// The field is gone from the schema and the page; scenarios keep theirs (page.comesBack).
// Run: npx sanity exec migrations/2026-10-29-drop-skill-output.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });

const ids: string[] = await client.fetch(`*[_type == "skill" && defined(page.output)]._id`);
const tx = client.transaction();
for (const id of ids) tx.patch(id, (p) => p.unset(['page.output']));
await tx.commit({ visibility: 'sync' });
console.log(`Removed page.output from ${ids.join(', ') || 'nothing'}`);
