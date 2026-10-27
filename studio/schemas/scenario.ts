import { defineField, defineType } from 'sanity';
import { str, txt, slugField, ref, refs, areaField, obj, list, order, gallery, connectorsField } from './shared';
import { CoverInput, randomCover } from './CoverInput';

export const scenario = defineType({
  name: 'scenario', type: 'document',
  fields: [
    str('title', 'Title', true), slugField(), txt('description', 'Description', true), areaField('category', 'Category'),
    defineField({ name: 'cadence', type: 'reference', to: [{ type: 'cadence' }], validation: (r) => r.required() }),
    defineField({ name: 'status', type: 'string', initialValue: 'soon', options: { list: ['ready', 'soon'], layout: 'radio', direction: 'horizontal' }, validation: (r) => r.required(), description: 'Only ready scenarios get a page' }),
    { ...ref('author', 'author'), validation: (r: any) => r.required() },
    str('firstRun', 'First run'), str('youNeed', 'You need'), str('youGet', 'You get'),
    connectorsField,
    refs('skills', 'skill'), refs('rules', 'rule'),
    defineField({ name: 'art', type: 'scenarioArt', description: 'Until one is picked, the default cover shows' }),
    defineField({ name: 'cover', title: 'Cover colour', type: 'number', description: 'Pastel behind the card and the page hero; a new scenario gets a random one', components: { input: CoverInput }, initialValue: randomCover, validation: (r) => r.integer().min(1).max(20) }),
    order('scenario'),
    obj('page', 'Scenario page', [
      obj('catches', 'What it catches', [
        str('headline', 'Headline', true), txt('context'), { ...txt('body'), description: 'A blank line starts a new paragraph' }, txt('note'),
        list('findings', 'Findings', [str('title', 'Title', true), txt('text', 'Text', true)]),
      ]),
      obj('comesBack', 'What you get', [str('headline', 'Headline', true), txt('context'), gallery()]),
      obj('get', 'Get it', [
        txt('intro', 'Intro', true), txt('context'),
        list('options', 'Options', [str('label', 'Label', true), txt('text', 'Text', true)], 'label'),
        txt('note'), defineField({ name: 'source', type: 'url' }), str('sourceNote'),
      ]),
      defineField({ name: 'usingHead', title: 'Using it: headline', type: 'headline' }),
      list('using', 'Using it', [str('icon'), str('title', 'Title', true), txt('text', 'Text', true)]),
      list('steps', 'How it runs', [
        str('phase'), str('title', 'Title', true), txt('text', 'Text', true), txt('note'),
        ref('skill', 'skill'), defineField({ name: 'key', title: 'Key step', type: 'boolean', initialValue: false }),
      ]),
      defineField({ name: 'cta', type: 'cta' }),
    ]),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
