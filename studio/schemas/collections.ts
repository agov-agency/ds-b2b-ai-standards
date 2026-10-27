import { defineField, defineType } from 'sanity';
import { CoverInput, randomCover } from './CoverInput';
import { order } from './shared';
import { IconInput } from './IconInput';
import { LogoInput, LOGOS } from './LogoInput';
import { createElement } from 'react';

// Shared lists other documents reference: rename one here and every item that uses it follows

export const category = defineType({
  name: 'category', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required(), description: 'Chip on cards and pages; filter name on the Skills and Rules pages' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required(), description: 'Used in filter links' }),
    defineField({ name: 'cover', title: 'Colour', type: 'number', description: 'Default pastel for skills and rules in this category that have no colour of their own', components: { input: CoverInput }, initialValue: randomCover, validation: (r) => r.required() }),
    defineField({ name: 'icon', type: 'string', description: 'Default icon for skills and rules in this category that have no icon of their own', components: { input: IconInput }, validation: (r) => r.required() }),
    defineField({ name: 'headline', title: 'Rules page headline (black)', type: 'string', description: 'Headline of this category’s group on the Rules page' }),
    defineField({ name: 'context', title: 'Rules page headline (gray)', type: 'string', description: 'Continues that headline in gray' }),
    order('category'),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title' } },
});

export const cadence = defineType({
  name: 'cadence', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', description: 'As shown on the chip, e.g. “Weekly + monthly”', validation: (r) => r.required() }),
    order('cadence'),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});

// The site already draws Claude, ChatGPT, Gemini, LinkedIn, CRM (three logos), DemandSense and signal sources; others need a logo
export const connector = defineType({
  name: 'connector', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required(), description: 'As shown in the tooltip, e.g. “Google Ads export”' }),
    defineField({ name: 'brand', title: 'Logo', type: 'string', components: { input: LogoInput }, description: 'Pick a logo from the set; “Own” to upload one below' }),
    defineField({ name: 'logo', title: 'Own logo', type: 'image', hidden: ({ parent }) => !!parent?.brand, description: 'Only when the set above has no logo for it. Square SVG or PNG, shown 18px on a white disc' }),
  ],
  preview: { select: { title: 'name', brand: 'brand', media: 'logo' }, prepare: ({ title, brand, media }) => ({ title, media: brand ? createElement('span', { dangerouslySetInnerHTML: { __html: LOGOS.find(([n]) => n === brand)?.[1] ?? '' }, style: { width: '100%', padding: 6 } }) : media }) },
});
