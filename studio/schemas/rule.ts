import { defineField, defineType } from 'sanity';
import { str, txt, slugField, ref, areaField, obj, list, featured, unique, coverField } from './shared';
import { IconInput } from './IconInput';

export const rule = defineType({
  name: 'rule', type: 'document',
  fields: [
    defineField({ name: 'number', type: 'number', validation: (r) => r.required().integer() }),
    str('title', 'Title', true), slugField(), txt('why', 'Why (one line under the title)', true), areaField('area', 'Category'), featured,
    { ...ref('author', 'author'), description: 'Empty = DemandSense' },
    defineField({ name: 'icon', type: 'string', description: 'Rules use icons from their own set, never a skill’s. Empty = the category icon', components: { input: IconInput }, options: { pool: 'rule' } as any, validation: (r) => r.custom(unique('icon')) }),
    coverField('Pastel behind the card and the page hero. Empty = the category colour; a new rule gets a random one'),
    { ...txt('lead', 'Hero text'), description: 'The paragraph under the title at the top of the rule page. Empty = the Why line is used' },
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
