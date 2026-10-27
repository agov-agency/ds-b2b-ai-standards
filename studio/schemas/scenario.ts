import { defineField, defineType } from 'sanity';
import { str, txt, slugField, ref, refs, areaField, obj, list, order, gallery } from './shared';
import { CadenceInput } from './CadenceInput';

// Hue names for the --pastel-N ramp in design-system/tokens.css
const COVERS = ['pink', 'red', 'coral', 'orange', 'amber', 'yellow', 'olive', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'azure', 'blue', 'periwinkle', 'indigo', 'violet', 'purple', 'magenta'];

export const scenario = defineType({
  name: 'scenario', type: 'document',
  fields: [
    str('title', 'Title', true), slugField(), txt('description', 'Description', true), areaField('category', 'Category'),
    defineField({ name: 'cadence', type: 'string', components: { input: CadenceInput }, validation: (r) => r.required() }),
    defineField({ name: 'status', type: 'string', initialValue: 'soon', options: { list: ['ready', 'soon'], layout: 'radio', direction: 'horizontal' }, validation: (r) => r.required(), description: 'Only ready scenarios get a page' }),
    { ...ref('author', 'author'), validation: (r: any) => r.required() },
    { ...obj('stat', 'Lead number', [str('value', 'Value', true), str('label', 'Label', true)]), description: 'Big number at the start of “What it catches” on the scenario page (only Value is shown there now)' },
    str('firstRun', 'First run'), str('youNeed', 'You need'), str('youGet', 'You get'),
    defineField({ name: 'connectors', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    refs('skills', 'skill'), refs('rules', 'rule'),
    defineField({ name: 'art', type: 'art' }),
    defineField({ name: 'illustration', title: 'Static illustration (if no figure)', type: 'image' }),
    defineField({ name: 'cover', title: 'Cover colour', type: 'number', description: 'Pastel behind the card and hero; empty = neutral', options: { list: COVERS.map((c, i) => ({ value: i + 1, title: `${i + 1} · ${c}` })) } }),
    order,
    obj('page', 'Scenario page', [
      obj('catches', 'What it catches', [
        str('headline', 'Headline', true), txt('context'), txt('body'), txt('note'),
        list('findings', 'Findings', [str('value', 'Value', true), str('title', 'Title', true), txt('text', 'Text', true)]),
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
