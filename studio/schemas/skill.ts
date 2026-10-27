import { defineField, defineType } from 'sanity';
import { str, txt, slugField, ref, refs, areaField, obj, list, order, gallery, connectorsField, unique } from './shared';
import { IconInput } from './IconInput';

const labelText = (name: string, title: string) => list(name, title, [str('label', 'Label', true), txt('text', 'Text', true)], 'label');

export const skill = defineType({
  name: 'skill', type: 'document',
  fields: [
    str('title', 'Title', true), slugField(), txt('description', 'Description', true), areaField(),
    defineField({ name: 'status', type: 'string', initialValue: 'next', options: { list: ['ready', 'next'], layout: 'radio', direction: 'horizontal' }, validation: (r) => r.required() }),
    ref('author', 'author'), refs('rules', 'rule', 'Rules it checks'),
    order('skill'),
    str('changes', 'Changes (e.g. “Reads your data, changes nothing”)'), str('firstRun', 'First run'),
    connectorsField,
    defineField({ name: 'icon', type: 'string', description: 'Skills use icons from their own set, never a rule’s. Empty = the category icon', components: { input: IconInput }, options: { pool: 'skill' } as any, validation: (r) => r.custom(unique('icon')) }),
    obj('page', 'Skill page', [
      obj('does', 'What it does', [str('headline', 'Headline', true), txt('context'), defineField({ name: 'body', type: 'array', of: [{ type: 'text', rows: 3 }] })]),
      obj('prompt', 'The prompt', [str('headline', 'Headline', true), txt('context'), labelText('tabs', 'Tabs'), labelText('install', 'Install'), defineField({ name: 'source', type: 'url' })]),
      obj('output', 'The output', [
        str('headline', 'Headline', true), txt('context'),
        list('stats', 'Stats', [str('value', 'Value', true), str('label', 'Label', true), defineField({ name: 'accent', type: 'boolean', initialValue: false })], 'value'),
        gallery(), txt('note', 'Note (**bold** allowed)'),
      ]),
      list('steps', 'How it works', [str('title', 'Title', true), txt('text', 'Text', true)]),
      defineField({ name: 'stepsNote', title: 'Steps headline', type: 'headline' }),
      list('useWhen', 'Use it when', [str('icon'), str('title', 'Title', true), txt('text', 'Text', true)]),
      str('partOf', 'Part of (line on the related scenario card)'),
    ]),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
