import { defineField, defineType } from 'sanity';
import { str, txt, slugField, order, featured } from './shared';

// Ready icons are the glyphs the author page draws (site/src/pages/authors/[slug].astro); names match the labels already in content
const ICONS = [{ title: 'LinkedIn', value: 'linkedin' }, { title: 'X', value: 'x' }, { title: 'GitHub', value: 'github' }, { title: 'Website', value: 'web' }, { title: 'Custom logo', value: 'custom' }];
const NAMES = [...['LinkedIn', 'X', 'GitHub', 'Website'].map((v) => ({ title: v, value: v })), { title: 'Custom', value: 'custom' }];

export const author = defineType({
  name: 'author', type: 'document',
  fields: [
    str('name', 'Name', true), slugField('name'), str('role', 'Job position'), str('company'),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true }, description: 'Initials show until it is set' }),
    txt('about', 'About (~40 words)'),
    defineField({
      name: 'links', type: 'array',
      of: [{
        type: 'object', name: 'link',
        fields: [
          defineField({ name: 'icon', type: 'string', initialValue: 'linkedin', validation: (r) => r.required(), options: { list: ICONS, layout: 'radio', direction: 'horizontal' } }),
          defineField({ name: 'logo', title: 'Custom logo', type: 'image', description: 'One-colour SVG or PNG on transparent; drawn in the button colour', hidden: ({ parent }) => parent?.icon !== 'custom', validation: (r) => r.custom((v, c: any) => c.parent?.icon !== 'custom' || v ? true : 'Upload a logo or pick a ready icon') }),
          defineField({ name: 'label', title: 'Name', type: 'string', initialValue: 'LinkedIn', validation: (r) => r.required(), options: { list: NAMES, layout: 'radio', direction: 'horizontal' } }),
          defineField({ name: 'customLabel', title: 'Custom name', type: 'string', hidden: ({ parent }) => parent?.label !== 'custom', validation: (r) => r.custom((v, c: any) => c.parent?.label !== 'custom' || v ? true : 'Type a name') }),
          defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
        ],
        preview: { select: { label: 'label', custom: 'customLabel', url: 'url', media: 'logo' }, prepare: ({ label, custom, url, media }) => ({ title: label === 'custom' ? custom : label, subtitle: url, media }) },
      }],
    }),
    featured, order('author'),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'company', media: 'photo' } },
});
