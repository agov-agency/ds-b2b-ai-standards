import { defineField, defineType } from 'sanity';
import { str, txt, slugField, ref, refs, areaField, obj, list, order, gallery, connectorsField, unique, coverField, desc, fieldsets, inSet } from './shared';
import { IconInput } from './IconInput';

const labelText = (name: string, title: string, label: string, text: string) => list(name, title, [desc(str('label', 'Label', true), label), desc(txt('text', 'Text', true), text)], 'label');

// Fields follow the skill page top to bottom: hero (also the card in lists), the page sections, then settings
export const skill = defineType({
  name: 'skill', type: 'document',
  fieldsets: fieldsets(
    ['hero', 'Hero', 'Top of the page. Title, description, category and icon also make the card in lists'],
    ['settings', 'Settings'],
  ),
  fields: [
    ...inSet('hero',
      desc(str('title', 'Title', true), 'Page headline and card title'),
      desc(txt('description', 'Description', true), 'Lead under the title, and the card text in lists'),
      desc(areaField(), 'First chip; also groups the skill in filters and gives the default colour and icon'),
      desc(ref('author', 'author'), 'Shown as “By …” in the hero, links to the author page'),
      desc(str('changes', 'Changes'), 'Fact under the lead, e.g. “Reads your data, changes nothing”'),
      desc(str('firstRun', 'First run'), 'Fact under the lead, e.g. “About five minutes”'),
      defineField({ name: 'icon', type: 'string', description: 'Line icon on the right of the hero, on the card and in the closing CTA. Skills have their own set, never a rule’s. Empty = the category icon', components: { input: IconInput }, options: { pool: 'skill' } as any, validation: (r) => r.custom(unique('icon')) }),
      coverField('Pastel behind the hero, the card and the closing CTA; the icon takes its hue. Empty = the category colour; a new skill gets a random one'),
    ),
    obj('page', 'Page sections', [
      desc(obj('does', 'What it does', [
        desc(str('headline', 'Headline', true), 'Section headline, black'),
        desc(txt('context'), 'Continues the headline in gray'),
        defineField({ name: 'body', type: 'array', of: [{ type: 'text', rows: 3 }], description: 'Paragraphs under the headline, one per item' }),
      ]), 'First section after the hero'),
      desc(list('steps', 'How it works', [desc(str('title', 'Title', true), 'Step title'), desc(txt('text', 'Text', true), 'Step text')]), 'Timeline inside “What it does”, under its paragraphs'),
      defineField({ name: 'stepsNote', title: 'Line after the steps', type: 'headline', description: 'Closing line at the end of the timeline' }),
      desc(obj('output', 'What you get', [
        desc(str('headline', 'Headline', true), 'Section headline, black'),
        desc(txt('context'), 'Continues the headline in gray'),
        desc(list('stats', 'Numbers', [desc(str('value', 'Value', true), 'The number, e.g. “49%”'), desc(str('label', 'Label', true), 'What it counts'), defineField({ name: 'accent', type: 'boolean', initialValue: false, description: 'Not used on the page yet' })], 'value'), 'Row of numbers above the gallery'),
        gallery(),
        desc(txt('note', 'Note'), 'Line under the gallery; **bold** works'),
      ]), 'Gallery of what the skill hands back'),
      desc(obj('prompt', 'The prompt', [
        desc(str('headline', 'Headline', true), 'Section headline, black'),
        desc(txt('context'), 'Continues the headline in gray'),
        desc(labelText('tabs', 'Tabs', 'Tab name, e.g. “Claude”', 'The prompt for that tool; gets a Copy button'), 'One tab per AI tool'),
        desc(labelText('install', 'Install', 'Name of the option, e.g. “Claude Code”', 'The install command'), 'Command blocks under the tabs, for people who would rather not paste a prompt'),
        desc(defineField({ name: 'source', type: 'url' }), 'Link to the source; also shown as “Source on GitHub” in the hero'),
      ]), 'The prompt to copy. The closing CTA button jumps here'),
      desc(list('useWhen', 'When to use it', [desc(str('icon'), 'Optional line icon name from illustrations/icons'), desc(str('title', 'Title', true), 'Tile title'), desc(txt('text', 'Text', true), 'Tile text')]), 'Tiles: the moments it pays off'),
      desc(str('partOf', 'Related: line'), 'Gray line in the “Related” section. Empty = a default line'),
    ]),
    desc(refs('rules', 'rule', 'Rules it checks'), 'Rule cards in the “Related” section near the end of the page'),
    ...inSet('settings',
      desc(slugField(), 'Page address: /skills/<slug>'),
      defineField({ name: 'status', type: 'string', initialValue: 'next', options: { list: [{ title: 'Ready', value: 'ready' }, { title: 'Next', value: 'next' }], layout: 'radio', direction: 'horizontal' }, validation: (r) => r.required(), description: 'Only ready skills get a page; next ones show as a muted card' }),
      { ...connectorsField, description: 'Tools it works with. Not shown on the skill page yet' },
      order('skill'),
    ),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
