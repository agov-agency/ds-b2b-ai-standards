// One-off: author links imported before the icon picker get their icon from the label.
// Run: npx sanity exec migrations/link-icons.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const ICON: Record<string, string> = { linkedin: 'linkedin', x: 'x', github: 'github', website: 'web' };
const client = getCliClient({ apiVersion: '2025-02-19' });
const docs = await client.fetch<{ _id: string; links: { _key: string; label: string; icon?: string }[] }[]>(
  '*[_type == "author" && count(links[!defined(icon)]) > 0]{_id, links}',
);
for (const d of docs) {
  const patch = client.patch(d._id);
  for (const l of d.links.filter((l) => !l.icon)) {
    const icon = ICON[l.label.toLowerCase()];
    patch.set(icon ? { [`links[_key=="${l._key}"].icon`]: icon } : { [`links[_key=="${l._key}"].icon`]: 'web', [`links[_key=="${l._key}"].label`]: 'custom', [`links[_key=="${l._key}"].customLabel`]: l.label });
  }
  await patch.commit();
  console.log(`${d._id}: ${d.links.length} links`);
}
console.log(`${docs.length} authors patched`);
