import { defineField, defineType } from 'sanity';
import { ArtInput } from './ArtInput';
import { CoverInput, randomCover } from './CoverInput';
import { Part, SectionTitle } from './Section';

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
// Pastel behind the card and the page hero; new items start on a random one
export const coverField = (description = 'Pastel behind the card and the page hero; a new one gets a random colour') =>
  defineField({ name: 'cover', title: 'Cover colour', type: 'number', description, components: { input: CoverInput }, initialValue: randomCover, validation: (r) => r.integer().min(1).max(20) });

// Adds the editor help line under a field's title
export const desc = <T extends object>(field: T, description: string) => ({ ...field, description });
// Form hierarchy (Section.tsx). part(): a big heading between the page's parts; it has no input and never stores a value.
// section(): a page section's field drawn under a level-2 heading
export const part = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: 'string', readOnly: true, components: { field: Part, input: () => null } });
export const section = <T extends object>(field: T) => ({ ...field, components: { ...(field as any).components, field: SectionTitle } });

// Sections open under a plain title, not as accordions (easier to scan and fill)
export const obj = (name: string, title: string, fields: any[]) => section(defineField({ name, title, type: 'object', options: { collapsible: false }, fields }));
// The object holding all page sections: its title is a level-1 part
export const pageObj = (fields: any[]) => defineField({ name: 'page', title: 'Page sections', description: 'In the order they appear on the page', type: 'object', options: { collapsible: false }, fields, components: { field: Part } });
export const list = (name: string, title: string, fields: any[], preview = 'title') => defineField({
  name, title, type: 'array', of: [{ type: 'object', fields, preview: { select: { title: preview } } }],
});
export const connectorsField = defineField({ name: 'connectors', title: 'Runs with', type: 'array', of: [{ type: 'reference', to: [{ type: 'connector' }] }], description: 'Logo row in the hero (“Runs with”). Pick from Connectors; add a new one there' });
// Not edited by hand: a new document goes last (highest order of its type + 1); lists sort by it
export const order = (type: string) => defineField({ name: 'order', type: 'number', hidden: true,
  initialValue: async (_: unknown, { getClient }: any) => (await getClient({ apiVersion: '2025-02-19' }).fetch('coalesce(math::max(*[_type == $type].order), 0) + 1', { type })) });
export const featured = defineField({ name: 'featured', type: 'boolean', initialValue: false });

// Closing card above the footer; the page template falls back to default copy for any empty field
export const cta = defineType({ name: 'cta', title: 'Closing CTA', type: 'object', options: { collapsible: false }, description: 'The coloured card at the end of the page. Any field left empty keeps the site’s default text',
  fields: [desc(str('headline'), 'Big black line'), desc(txt('context'), 'Gray line after the headline'), desc(str('button'), 'Button label'), desc(str('note'), 'Small print under the button')] });
export const headline = defineType({ name: 'headline', type: 'object', fields: [desc(str('headline', 'Headline (black)', true), 'The claim, in black'), desc(txt('context', 'Context (gray)'), 'Continues the headline in gray, same size')] });
export const gallery = (name = 'items') => desc(list(name, 'Images', [desc(str('title', 'Title', true), 'Name of the output on the slide'), desc(str('caption', 'Caption', true), 'One line about it'), desc(defineField({ name: 'src', title: 'Image', type: 'image' }), 'Screenshot of the output, about 4:3')]), 'Slides of the gallery, swiped sideways');

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
