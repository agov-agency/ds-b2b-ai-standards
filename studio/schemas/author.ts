import { defineField, defineType } from 'sanity';
import { str, txt, slugField, order, featured, desc, part } from './shared';

// Ready icons are the glyphs the author page draws (site/src/pages/authors/[slug].astro); names match the labels already in content
const ICONS = [{ title: 'LinkedIn', value: 'linkedin' }, { title: 'X', value: 'x' }, { title: 'GitHub', value: 'github' }, { title: 'Website', value: 'web' }, { title: 'Custom logo', value: 'custom' }];
const NAMES = [...['LinkedIn', 'X', 'GitHub', 'Website'].map((v) => ({ title: v, value: v })), { title: 'Custom', value: 'custom' }];

export const author = defineType({
  name: 'author', type: 'document',
  // Fields follow the author page: name, role and photo at the top, the About text, then the link buttons
  fields: [
    desc(str('name', 'Name', true), 'Page headline; also on bylines and author cards'),
    desc(str('role', 'Job position'), 'Line under the name, e.g. “Head of Paid Social”'),
    desc(str('company'), 'After the job position'),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true }, description: 'Square portrait. Initials show until it is set' }),
    desc(txt('about', 'About'), 'Short bio on the author page, about 40 words'),
    defineField({
      name: 'links', type: 'array', description: 'Buttons under the bio, e.g. LinkedIn or a website',
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
    part('settingsPart', 'Settings', 'Address, featuring and other housekeeping'),
    desc(slugField('name'), 'Page address: /authors/<slug>'), desc(featured, 'Featured authors show on the home page and in the Collection; DemandSense stays unfeatured'), order('author'),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'company', media: 'photo' } },
});
