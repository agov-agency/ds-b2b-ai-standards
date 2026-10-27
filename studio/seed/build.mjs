// One-off import of site/content/*.md into Sanity: writes seed/content.ndjson for `sanity dataset import`.
// Ids are `<type>-<slug>`, so re-running replaces the same documents instead of duplicating them.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '../../site');
const read = (dir) => readdirSync(`${site}/content/${dir}`).filter((f) => f.endsWith('.md')).map((f) => ({
  slug: f.slice(0, -3),
  data: parse(readFileSync(`${site}/content/${dir}/${f}`, 'utf8').split(/^---$/m)[1]),
}));

const ref = (type, slug) => slug && { _type: 'reference', _ref: `${type}-${slug}` };
const image = (src) => {
  if (!src) return undefined;
  if (/^https?:/.test(src)) return { _type: 'image', _sanityAsset: `image@${src}` };
  const file = `${site}/public${src}`;
  if (!existsSync(file)) { console.warn(`missing image ${src}`); return undefined; }
  return { _type: 'image', _sanityAsset: `image@file://${file}` };
};
const images = (items = []) => items.map(({ src, ...i }) => ({ ...i, src: image(src) }));
// Every object in an array needs a _key in Sanity
let n = 0;
const keyed = (v) => Array.isArray(v) ? v.map((x) => x && typeof x === 'object' && !x._ref ? { _key: `k${(n++).toString(36)}`, ...keyed(x) } : keyed(x))
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, keyed(x)])) : v;
const doc = (type, slug, data) => keyed({ _id: `${type}-${slug}`, _type: type, slug: { _type: 'slug', current: slug }, ...data });

const out = [];
// Shared lists (category, cadence, connector) first; items reference them
const slugify = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const CADENCES = ['Daily', 'Weekly', 'Monthly', 'Weekly + monthly', 'Quarterly'];
for (const { slug, data: d } of read('categories')) out.push(doc('category', slug, d));
const scenarioData = read('scenarios'), skillData = read('skills');
const cadences = [...new Set([...CADENCES, ...scenarioData.map((x) => x.data.cadence)])];
cadences.forEach((title, i) => out.push(keyed({ _id: `cadence-${slugify(title)}`, _type: 'cadence', title, order: i + 1 })));
const BRANDS = JSON.parse(readFileSync('connectors.json', 'utf8')); // standard set with logos, plus any name the content uses
const connectorNames = [...new Set([...Object.keys(BRANDS), ...[...scenarioData, ...skillData].flatMap((x) => x.data.connectors ?? [])])];
for (const name of connectorNames) out.push(keyed({ _id: `connector-${slugify(name)}`, _type: 'connector', name, brand: BRANDS[name] ?? undefined }));
const cat = (key) => ref('category', key);
const conns = (list) => list?.map((n) => ref('connector', slugify(n)));
const ICON = { linkedin: 'linkedin', x: 'x', github: 'github', website: 'web' };
const link = (l) => ICON[l.label.toLowerCase()] ? { ...l, icon: ICON[l.label.toLowerCase()] } : { ...l, icon: 'web', label: 'custom', customLabel: l.label };
for (const { slug, data: d } of read('authors')) out.push(doc('author', slug, { ...d, photo: image(d.photo), links: d.links?.map(link) }));
for (const { slug, data: d } of read('rules')) {
  const p = d.page ?? {};
  out.push(doc('rule', slug, { ...d, area: cat(d.area), author: ref('author', d.author), page: { ...p, voices: p.voices?.map((v) => ({ ...v, author: ref('author', v.author) })) } }));
}
for (const { slug, data: d } of skillData) {
  const p = d.page ?? {};
  out.push(doc('skill', slug, {
    ...d, area: cat(d.area), connectors: conns(d.connectors), author: ref('author', d.author), rules: d.rules?.map((r) => ref('rule', r)), illustration: undefined,
    page: { ...p, output: p.output && { ...p.output, items: images(p.output.items) } },
  }));
}
for (const { slug, data: d } of scenarioData) {
  const p = d.page ?? {};
  out.push(doc('scenario', slug, {
    ...d, category: cat(d.category), cadence: ref('cadence', slugify(d.cadence)), connectors: conns(d.connectors), illustration: undefined, author: ref('author', d.author), skills: d.skills?.map((r) => ref('skill', r)), rules: d.rules?.map((r) => ref('rule', r)),
    page: { ...p, comesBack: p.comesBack && { ...p.comesBack, items: images(p.comesBack.items) }, steps: p.steps?.map((s) => ({ ...s, skill: ref('skill', s.skill) })) },
  }));
}
writeFileSync(resolve(here, 'content.ndjson'), out.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`${out.length} documents → seed/content.ndjson`);
