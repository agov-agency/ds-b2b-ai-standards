// Content source: Sanity when SANITY_PROJECT_ID is set (production), else the Markdown files in content/ (local, until the import).
// The dataset is public and only published documents are read, so no token is needed.
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
import { existsSync } from 'node:fs';

const PROJECT = process.env.SANITY_PROJECT_ID, DATASET = process.env.SANITY_DATASET || 'production';

// GROQ returns null for empty fields; zod's optional/default only handle missing ones
const clean = (v: any): any => Array.isArray(v) ? v.filter((x) => x != null).map(clean)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([, x]) => x != null).map(([k, x]) => [k, clean(x)])) : v;

// Each query projects references to slugs and images to URLs, so entries match the Markdown shape
const IMG = (f: string) => `"${f}": ${f}.asset->url`;
const SLUG = (f: string) => `"${f}": ${f}->slug.current`;
const ITEMS = `items[]{..., ${IMG('src')}}`;
const AREA = (f = 'area') => `"${f}": ${f}->slug.current`;
const CONNECTORS = '"connectors": connectors[]->name';
const QUERIES: Record<string, string> = {
  categories: `*[_type == "category"]`,
  authors: `*[_type == "author"]{..., ${IMG('photo')}, links[]{url, icon, "label": select(label == "custom" => customLabel, label), ${IMG('logo')}}}`,
  rules: `*[_type == "rule"]{..., ${AREA()}, ${SLUG('author')}, page{..., voices[]{..., ${SLUG('author')}}}}`,
  skills: `*[_type == "skill"]{..., ${AREA()}, ${CONNECTORS}, ${SLUG('author')}, "rules": rules[]->slug.current, ${IMG('illustration')}}`,
  scenarios: `*[_type == "scenario"]{..., ${AREA('category')}, "cadence": cadence->title, ${CONNECTORS}, ${SLUG('author')}, "skills": skills[]->slug.current, "rules": rules[]->slug.current, ${IMG('illustration')},
    page{..., comesBack{..., ${ITEMS}}, steps[]{..., ${SLUG('skill')}}}}`,
  connectors: `*[_type == "connector" && (defined(brand) || defined(logo))]{..., "slug": {"current": _id}, ${IMG('logo')}}`,
};

const sanity = (dir: string): Loader => ({
  name: `sanity-${dir}`,
  async load({ store, parseData, logger }) {
    const url = `https://${PROJECT}.api.sanity.io/v2025-02-19/data/query/${DATASET}?perspective=published&query=${encodeURIComponent(QUERIES[dir])}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity ${dir}: ${res.status} ${await res.text()}`);
    const docs = (await res.json()).result as any[];
    store.clear();
    for (const d of docs) {
      const id = d.slug?.current;
      if (!id) { logger.warn(`${dir}: ${d._id} has no slug, skipped`); continue; }
      store.set({ id, data: await parseData({ id, data: clean(d) }) });
    }
    logger.info(`${docs.length} ${dir} from Sanity`);
  },
});

// CMS-only collections (connectors) have no Markdown folder and stay empty locally
const none: Loader = { name: 'none', load: async ({ store }) => store.clear() };
export const source = (dir: string): Loader => PROJECT ? sanity(dir) : existsSync(`./content/${dir}`) ? glob({ pattern: '*.md', base: `./content/${dir}` }) : none;
