import { defineField, defineType } from 'sanity';
import { CoverInput } from './CoverInput';
import { IconInput } from './IconInput';

// Shared lists other documents reference: rename one here and every item that uses it follows

export const category = defineType({
  name: 'category', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'cover', title: 'Colour', type: 'number', description: 'Behind skill and rule cards in this category', components: { input: CoverInput }, validation: (r) => r.required() }),
    defineField({ name: 'icon', type: 'string', description: 'Fallback for rules and skills here that have no picture of their own', components: { input: IconInput }, validation: (r) => r.required() }),
    defineField({ name: 'headline', title: 'Rules hub headline (black)', type: 'string' }),
    defineField({ name: 'context', title: 'Rules hub headline (gray)', type: 'string' }),
    defineField({ name: 'order', type: 'number', initialValue: 99 }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title' } },
});

export const cadence = defineType({
  name: 'cadence', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', description: 'As shown on the chip, e.g. “Weekly + monthly”', validation: (r) => r.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 99 }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});

// The site already draws Claude, ChatGPT, Gemini, LinkedIn, CRM (three logos), DemandSense and signal sources; others need a logo
export const connector = defineType({
  name: 'connector', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required(), description: 'As shown in the tooltip, e.g. “Google Ads export”' }),
    defineField({ name: 'logo', type: 'image', description: 'Only for connectors the site has no logo for. Square SVG or PNG, shown 18px on a white disc' }),
  ],
  preview: { select: { title: 'name', media: 'logo' } },
});
