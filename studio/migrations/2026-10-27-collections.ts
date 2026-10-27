// One-off, safe to re-run: moves the first import onto the current schema.
// - categories, cadences and connectors become their own documents; items reference them instead of holding text
// - author links get an icon from their label
// - illustrations move to the per-type figure fields
// - the scenario lead number and the finding numbers go
// Run: npx sanity exec migrations/2026-10-27-collections.ts --with-user-token
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ref = (_ref: string) => ({ _type: 'reference', _ref });
const key = () => Math.random().toString(36).slice(2, 10);
const tx = client.transaction();

const dir = '../site/content/categories';
for (const f of readdirSync(dir)) {
  const slug = f.slice(0, -3), d = parse(readFileSync(`${dir}/${f}`, 'utf8').split(/^---$/m)[1]);
  tx.createIfNotExists({ _id: `category-${slug}`, _type: 'category', slug: { _type: 'slug', current: slug }, ...d });
}

const docs = await client.fetch<any[]>('*[_type in ["rule", "skill", "scenario", "author"] && !(_id in path("drafts.**"))]');
const CADENCES = ['Daily', 'Weekly', 'Monthly', 'Weekly + monthly', 'Quarterly'];
const cadences = [...new Set([...CADENCES, ...docs.filter((d) => typeof d.cadence === 'string').map((d) => d.cadence)])];
cadences.forEach((title, i) => tx.createIfNotExists({ _id: `cadence-${slugify(title)}`, _type: 'cadence', title, order: i + 1 }));
const names = [...new Set(docs.flatMap((d) => (d.connectors ?? []).filter((c: unknown) => typeof c === 'string')))] as string[];
for (const name of names) tx.createIfNotExists({ _id: `connector-${slugify(name)}`, _type: 'connector', name });

const ICON: Record<string, string> = { linkedin: 'linkedin', x: 'x', github: 'github', website: 'web' };
let patched = 0;
for (const d of docs) {
  const set: Record<string, unknown> = {};
  for (const f of ['area', 'category']) if (typeof d[f] === 'string') set[f] = ref(`category-${d[f]}`);
  if (typeof d.cadence === 'string') set.cadence = ref(`cadence-${slugify(d.cadence)}`);
  if (d.connectors?.some((c: unknown) => typeof c === 'string')) set.connectors = d.connectors.map((c: any) => (typeof c === 'string' ? { _key: key(), ...ref(`connector-${slugify(c)}`) } : c));
  if (d.art?._type === 'art') set['art._type'] = d._type === 'skill' ? 'skillArt' : 'scenarioArt';
  if (d._type === 'author' && d.links?.some((l: any) => !l.icon)) set.links = d.links.map((l: any) => l.icon ? l
    : ICON[l.label.toLowerCase()] ? { ...l, icon: ICON[l.label.toLowerCase()] } : { ...l, icon: 'web', label: 'custom', customLabel: l.label });
  const unset = d._type === 'skill' ? ['icon', 'illustration'].filter((f) => d[f]) : d._type === 'scenario' ? ['illustration', 'stat'].filter((f) => d[f]) : [];
  // "What it catches" lost its numbers: findings keep title and text only
  (d.page?.catches?.findings ?? []).forEach((f: any) => f.value !== undefined && unset.push(`page.catches.findings[_key=="${f._key}"].value`));
  if (Object.keys(set).length || unset.length) { tx.patch(d._id, (p) => p.set(set).unset(unset)); patched++; }
}
await tx.commit({ visibility: 'sync' });
console.log(`${cadences.length} cadences, ${names.length} connectors, ${patched} documents moved onto the new schema`);
