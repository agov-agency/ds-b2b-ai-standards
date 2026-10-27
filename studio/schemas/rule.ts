import { defineField, defineType } from 'sanity';
import { str, txt, slugField, ref, areaField, obj, list, featured, unique, coverField, desc, fieldsets, inSet } from './shared';
import { IconInput } from './IconInput';

// Fields follow the rule page top to bottom: hero (also the card in lists), the page sections, then settings
export const rule = defineType({
  name: 'rule', type: 'document',
  fieldsets: fieldsets(
    ['hero', 'Hero', 'Top of the page. Number, title, Why line, category and icon also make the card in lists'],
    ['settings', 'Settings'],
  ),
  fields: [
    ...inSet('hero',
      defineField({ name: 'number', type: 'number', validation: (r) => r.required().integer(), description: 'Shown as “Rule 03” on the chip; rules list in this order' }),
      desc(str('title', 'Title', true), 'Page headline and card title'),
      desc(txt('why', 'Why', true), 'One line on the card under the title. Also the hero text when “Hero text” is empty'),
      { ...txt('lead', 'Hero text'), description: 'Paragraph under the title at the top of the page. Empty = the Why line' },
      desc(areaField('area', 'Category'), 'First chip; also groups the rule on the Rules page and gives the default colour and icon'),
      { ...ref('author', 'author'), description: 'Shown as “By …” in the hero. Empty = DemandSense' },
      defineField({ name: 'icon', type: 'string', description: 'Line icon on the right of the hero, on the card and in the closing CTA. Rules have their own set, never a skill’s. Empty = the category icon', components: { input: IconInput }, options: { pool: 'rule' } as any, validation: (r) => r.custom(unique('icon')) }),
      coverField('Pastel behind the hero, the card and the closing CTA; the icon takes its hue. Empty = the category colour; a new rule gets a random one'),
    ),
    obj('page', 'Page sections', [
      desc(obj('advises', 'The rule: what LinkedIn advises', [
        desc(txt('text', 'Text', true), 'LinkedIn’s own advice, in a sentence or two'),
        desc(str('source'), 'Where it says so, e.g. “LinkedIn Marketing Solutions help”'),
        desc(defineField({ name: 'url', type: 'url' }), 'Link for the source'),
      ]), 'Left box of the first section'),
      desc(txt('adds', 'The rule: what the Standard adds'), 'Right box of the first section'),
      desc(txt('reason', 'The rule: why it holds'), 'Box under them'),
      desc(txt('mattersLess', 'The rule: when it matters less'), 'Box next to “Why it holds”'),
      desc(list('signs', 'If you see this', [desc(txt('see', 'You see', true), 'Left column: what shows up in the account'), desc(txt('do', 'You do', true), 'Right column: what to do about it')], 'see'), 'Table of signs, one row each'),
      desc(list('voices', 'Who runs it this way', [
        desc(str('name', 'Name', true), 'Specialist’s name'),
        desc(ref('author', 'author', 'Author page'), 'Optional: links the name to their author page'),
        desc(str('company'), 'Their company'),
        desc(str('context'), 'Their role or setting, one short line'),
        desc(txt('quote', 'Quote', true), 'In their own words'),
        desc(str('source'), 'Where they said it, e.g. “LinkedIn post, Sep 2026”'),
        desc(defineField({ name: 'url', type: 'url' }), 'Link for the source'),
        desc(str('note'), 'Small line under the quote'),
      ], 'name'), 'Quote cards from specialists'),
      defineField({ name: 'cta', type: 'cta', description: 'The coloured card at the end of the page, after “Run it” (filled in automatically from the skills and scenarios that use the rule). Any field left empty keeps the site’s default text' }),
    ]),
    ...inSet('settings',
      desc(slugField(), 'Page address: /rules/<slug>'),
      desc(featured, 'Featured rules come first in the Directory'),
    ),
  ],
  orderings: [{ title: 'Number', name: 'number', by: [{ field: 'number', direction: 'asc' }] }],
  preview: { select: { title: 'title', n: 'number' }, prepare: ({ title, n }) => ({ title, subtitle: `Rule ${n ?? ''}` }) },
});
