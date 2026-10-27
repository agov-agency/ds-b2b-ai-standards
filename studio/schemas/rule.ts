import { defineField, defineType } from 'sanity';
import { str, txt, slugField, ref, areaField, obj, list, featured } from './shared';

export const rule = defineType({
  name: 'rule', type: 'document',
  fields: [
    defineField({ name: 'number', type: 'number', validation: (r) => r.required().integer() }),
    str('title', 'Title', true), slugField(), txt('why', 'Why (one line under the title)', true), areaField(), featured,
    { ...ref('author', 'author'), description: 'Empty = DemandSense' },
    txt('lead', 'Hero lead (falls back to Why)'),
    obj('page', 'Rule page', [
      obj('advises', 'What LinkedIn advises', [txt('text', 'Text', true), str('source'), defineField({ name: 'url', type: 'url' })]),
      txt('adds', 'What the Standard adds'), txt('reason', 'Reason'), txt('mattersLess', 'When it matters less'),
      list('signs', 'Signs', [txt('see', 'You see', true), txt('do', 'You do', true)], 'see'),
      list('voices', 'Voices', [
        str('name', 'Name', true), ref('author', 'author', 'Author page (optional)'), str('company'), str('context'),
        txt('quote', 'Quote', true), str('source'), defineField({ name: 'url', type: 'url' }), str('note'),
      ], 'name'),
      defineField({ name: 'cta', type: 'cta' }),
    ]),
  ],
  orderings: [{ title: 'Number', name: 'number', by: [{ field: 'number', direction: 'asc' }] }],
  preview: { select: { title: 'title', n: 'number' }, prepare: ({ title, n }) => ({ title, subtitle: `Rule ${n ?? ''}` }) },
});
