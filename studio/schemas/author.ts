import { defineField, defineType } from 'sanity';
import { str, txt, slugField, list, order, featured } from './shared';

export const author = defineType({
  name: 'author', type: 'document',
  fields: [
    str('name', 'Name', true), slugField('name'), str('role', 'Job position'), str('company'),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true }, description: 'Initials show until it is set' }),
    txt('about', 'About (~40 words)'),
    list('links', 'Links', [str('label', 'Label', true), defineField({ name: 'url', type: 'url', validation: (r) => r.required() })], 'label'),
    featured, order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'company', media: 'photo' } },
});
