import { defineField, defineType } from 'sanity';
import { ArtInput } from './ArtInput';

// One value per document of a type: a figure or icon two items share fails validation
export const unique = (field: string) => (v: unknown, ctx: any) => {
  if (!v) return true;
  const id = ctx.document._id.replace(/^drafts\./, '');
  return ctx.getClient({ apiVersion: '2025-02-19' })
    .fetch(`*[_type == $type && ${field} == $v && !(_id in [$id, "drafts." + $id])][0].title`, { type: ctx.document._type, v, id })
    .then((t: string | null) => (t ? `Already used by “${t}”: each picture belongs to one item` : true));
};

export const areaField = (name = 'area', title = 'Category') => defineField({ name, title, type: 'reference', to: [{ type: 'category' }], validation: (r) => r.required() });
export const slugField = (source = 'title') => defineField({ name: 'slug', type: 'slug', options: { source }, validation: (r) => r.required() });
export const str = (name: string, title?: string, required = false) => defineField({ name, title, type: 'string', ...(required && { validation: (r) => r.required() }) });
export const txt = (name: string, title?: string, required = false) => defineField({ name, title, type: 'text', rows: 3, ...(required && { validation: (r) => r.required() }) });
export const ref = (name: string, to: string, title?: string) => defineField({ name, title, type: 'reference', to: [{ type: to }] });
export const refs = (name: string, to: string, title?: string) => defineField({ name, title, type: 'array', of: [{ type: 'reference', to: [{ type: to }] }] });
export const obj = (name: string, title: string, fields: any[], collapsed = true) => defineField({ name, title, type: 'object', options: { collapsible: true, collapsed }, fields });
export const list = (name: string, title: string, fields: any[], preview = 'title') => defineField({
  name, title, type: 'array', of: [{ type: 'object', fields, preview: { select: { title: preview } } }],
});
export const connectorsField = defineField({ name: 'connectors', type: 'array', of: [{ type: 'reference', to: [{ type: 'connector' }] }], description: 'Pick from Connectors; add a new one there (with a logo if the site has none)' });
// Not edited by hand: a new document goes last (highest order of its type + 1); lists sort by it
export const order = (type: string) => defineField({ name: 'order', type: 'number', hidden: true,
  initialValue: async (_: unknown, { getClient }: any) => (await getClient({ apiVersion: '2025-02-19' }).fetch('coalesce(math::max(*[_type == $type].order), 0) + 1', { type })) });
export const featured = defineField({ name: 'featured', type: 'boolean', initialValue: false });

// Closing card above the footer; the page template falls back to default copy for any empty field
export const cta = defineType({ name: 'cta', title: 'Closing CTA', type: 'object', options: { collapsible: true, collapsed: true }, fields: [str('headline'), txt('context'), str('button'), str('note')] });
export const headline = defineType({ name: 'headline', type: 'object', fields: [str('headline', 'Headline (black)', true), txt('context', 'Context (gray)')] });
export const gallery = (name = 'items') => list(name, 'Images', [str('title', 'Title', true), str('caption', 'Caption', true), defineField({ name: 'src', title: 'Image', type: 'image' })]);

// Option A: the figure lives in code (site/src/art); the editor picks one from the item type's own pool and tunes how it sits
const artType = (name: 'scenarioArt', pool: 'scenario') => defineType({
  name, title: 'Illustration', type: 'object', components: { input: ArtInput }, options: { pool } as any,
  fields: [
    defineField({ name: 'piece', title: 'Figure', type: 'string', validation: (r) => r.custom(unique('art.piece')) }),
    defineField({ name: 'variant', type: 'string', initialValue: 'color', options: { list: ['color', 'mono', 'dark'], layout: 'radio', direction: 'horizontal' } }),
    defineField({ name: 'zoom', type: 'number', initialValue: 1, validation: (r) => r.min(0.5).max(3) }),
  ],
});
export const scenarioArt = artType('scenarioArt', 'scenario');
