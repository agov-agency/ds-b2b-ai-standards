import { defineField, defineType } from 'sanity';
import { AREAS } from '../../site/src/site';
import { ArtInput } from './ArtInput';

// Same lists the site validates against (site/src/site.ts, site/src/art)
export const areaField = (name = 'area', title = 'Area') => defineField({
  name, title, type: 'string', validation: (r) => r.required(),
  options: { list: Object.entries(AREAS).map(([value, title]) => ({ value, title })), layout: 'radio' },
});
export const slugField = (source = 'title') => defineField({ name: 'slug', type: 'slug', options: { source }, validation: (r) => r.required() });
export const str = (name: string, title?: string, required = false) => defineField({ name, title, type: 'string', ...(required && { validation: (r) => r.required() }) });
export const txt = (name: string, title?: string, required = false) => defineField({ name, title, type: 'text', rows: 3, ...(required && { validation: (r) => r.required() }) });
export const ref = (name: string, to: string, title?: string) => defineField({ name, title, type: 'reference', to: [{ type: to }] });
export const refs = (name: string, to: string, title?: string) => defineField({ name, title, type: 'array', of: [{ type: 'reference', to: [{ type: to }] }] });
export const obj = (name: string, title: string, fields: any[], collapsed = true) => defineField({ name, title, type: 'object', options: { collapsible: true, collapsed }, fields });
export const list = (name: string, title: string, fields: any[], preview = 'title') => defineField({
  name, title, type: 'array', of: [{ type: 'object', fields, preview: { select: { title: preview } } }],
});
// Connectors are free tags; a tag that contains a connector document's name gets its logo (built-in ones need no document)
export const connectorsField = defineField({ name: 'connectors', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, description: 'Built in: Claude, ChatGPT, Gemini, LinkedIn…, …CRM…, DemandSense, …signal/source…. Anything else needs a logo under Connectors, or shows a generic icon' });
export const order = defineField({ name: 'order', type: 'number', initialValue: 99, description: 'Lower comes first' });
export const featured = defineField({ name: 'featured', type: 'boolean', initialValue: false });

// Closing card above the footer; the page template falls back to default copy for any empty field
export const cta = defineType({ name: 'cta', title: 'Closing CTA', type: 'object', options: { collapsible: true, collapsed: true }, fields: [str('headline'), txt('context'), str('button'), str('note')] });
export const headline = defineType({ name: 'headline', type: 'object', fields: [str('headline', 'Headline (black)', true), txt('context', 'Context (gray)')] });
export const gallery = (name = 'items') => list(name, 'Images', [str('title', 'Title', true), str('caption', 'Caption', true), defineField({ name: 'src', title: 'Image', type: 'image' })]);

// Option A: the animated figure lives in code (site/src/art); the editor picks one and tunes how it sits
export const art = defineType({
  name: 'art', title: 'Illustration', type: 'object', components: { input: ArtInput },
  fields: [
    defineField({ name: 'piece', title: 'Figure', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'variant', type: 'string', initialValue: 'color', options: { list: ['color', 'mono', 'dark'], layout: 'radio', direction: 'horizontal' } }),
    defineField({ name: 'accent', type: 'string', options: { list: ['scenario', 'skill', 'rule', 'brand'], layout: 'radio', direction: 'horizontal' }, description: 'Colour of the live part' }),
    defineField({ name: 'zoom', type: 'number', initialValue: 1, validation: (r) => r.min(0.5).max(3) }),
  ],
});
