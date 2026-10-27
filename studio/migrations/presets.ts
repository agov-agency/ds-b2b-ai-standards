// One-off, safe to re-run: author links imported as free text get an icon from their label.
// Run: npx sanity exec migrations/presets.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const ICON: Record<string, string> = { linkedin: 'linkedin', x: 'x', github: 'github', website: 'web' };
const client = getCliClient({ apiVersion: '2025-02-19' });

const authors = await client.fetch<{ _id: string; links: { _key: string; label: string; icon?: string }[] }[]>(
  '*[_type == "author" && count(links[!defined(icon)]) > 0]{_id, links}',
);
for (const d of authors) {
  const at = (k: string, f: string) => `links[_key=="${k}"].${f}`;
  const patch = client.patch(d._id);
  for (const l of d.links.filter((l) => !l.icon)) {
    const icon = ICON[l.label.toLowerCase()];
    patch.set(icon ? { [at(l._key, 'icon')]: icon } : { [at(l._key, 'icon')]: 'web', [at(l._key, 'label')]: 'custom', [at(l._key, 'customLabel')]: l.label });
  }
  await patch.commit();
}
console.log(`${authors.length} authors: link icons set`);

