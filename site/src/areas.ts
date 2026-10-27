// Categories (content/categories or the CMS), in their order; refs on rules, skills and scenarios resolve through `area()`
import { getCollection } from 'astro:content';

const list = (await getCollection('categories')).sort((a, b) => a.data.order - b.data.order);
const byId = new Map(list.map((c) => [c.id, c.data]));
export const AREA_LIST = list.map((c) => ({ id: c.id, ...c.data }));
export const area = (ref: { id: string } | string) => byId.get(typeof ref === 'string' ? ref : ref.id)!;
