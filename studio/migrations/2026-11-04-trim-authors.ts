// One-off, safe to re-run: Agov's author-cards doc of 4 Nov 2026 is the full author list (11 authors + DemandSense).
// Deletes the eight contributors not in it; none is referenced by a scenario, skill or rule.
// The doc's twelve already match Sanity field for field. "Sample Author" stays: a Studio template, never on the site.
// Backup before the run: project files cms/backups/2026-11-04-authors.json.
// Run: npx sanity exec migrations/2026-11-04-trim-authors.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const GONE = ['fivos-aresti', 'kristof-bardos', 'mason-cosby', 'sheila-coque', 'tim-davidson', 'sam-kuehnle', 'patrick-cumming', 'rob-muldoon'];
const ids = GONE.flatMap((s) => [`author-${s}`, `drafts.author-${s}`]);

const refs = await client.fetch(`*[references($ids)]{_id}`, { ids });
if (refs.length) throw new Error(`Still referenced by ${refs.map((r: any) => r._id).join(', ')}`);
const tx = client.transaction();
ids.forEach((id) => tx.delete(id));
await tx.commit();
console.log(`Deleted ${GONE.length} authors`, await client.fetch(`*[_type == "author"] | order(order asc).name`));
