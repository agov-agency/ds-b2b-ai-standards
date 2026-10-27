import { defineField, defineType } from 'sanity';
import { str, txt, slugField, ref, refs, areaField, obj, list, order, gallery, connectorsField, coverField, desc, fieldsets, inSet } from './shared';

// Fields follow the scenario page top to bottom: hero (also the card in lists), the page sections, then settings
export const scenario = defineType({
  name: 'scenario', type: 'document',
  fieldsets: fieldsets(
    ['hero', 'Hero', 'Top of the page. Title, description, chips and picture also make the card in lists'],
    ['settings', 'Settings'],
  ),
  fields: [
    ...inSet('hero',
      desc(str('title', 'Title', true), 'Page headline and card title'),
      desc(txt('description', 'Description', true), 'Lead under the title, and the card text in lists'),
      desc(areaField('category', 'Category'), 'First chip; also groups the scenario in filters'),
      defineField({ name: 'cadence', type: 'reference', to: [{ type: 'cadence' }], validation: (r) => r.required(), description: 'Second chip: how often it runs. Add new ones under Cadences' }),
      { ...ref('author', 'author'), validation: (r: any) => r.required(), description: 'Shown as “By …” in the hero, links to the author page' },
      desc(str('firstRun', 'First run'), 'Fact under the lead, e.g. “About ten minutes”'),
      desc(str('youNeed', 'You need'), 'Fact under the lead: what to bring'),
      desc(str('youGet', 'You get'), 'Fact under the lead: what comes back'),
      connectorsField,
      defineField({ name: 'art', type: 'scenarioArt', description: 'Figure on the right of the hero, on the card and in the closing CTA. Until one is picked, the default cover shows' }),
      coverField('Pastel behind the hero, the card and the closing CTA; the figure takes its hue. A new scenario gets a random one'),
    ),
    obj('page', 'Page sections', [
      desc(obj('catches', 'What it catches', [
        desc(str('headline', 'Headline', true), 'Section headline, black'),
        desc(txt('context'), 'Continues the headline in gray'),
        desc(txt('body'), 'Larger text under the headline. A blank line starts a new paragraph'),
        desc(txt('note'), 'Small mono line under the text: where the example comes from'),
        desc(list('findings', 'Findings', [desc(str('title', 'Title', true), 'Card title'), desc(txt('text', 'Text', true), 'Card text')]), 'Grid of cards under the text; add or remove as many as needed'),
      ]), 'First section after the hero'),
      desc(obj('comesBack', 'What you get', [desc(str('headline', 'Headline', true), 'Section headline, black'), desc(txt('context'), 'Continues the headline in gray'), gallery()]), 'Gallery of what the scenario hands back'),
      desc(obj('get', 'Get it', [
        desc(txt('intro', 'Intro', true), 'Headline of the black band'),
        desc(txt('context'), 'Continues the headline in gray'),
        desc(list('options', 'Options', [desc(str('label', 'Label', true), 'Name of the option, e.g. “Claude Code”'), desc(txt('text', 'Text', true), 'The command or prompt; gets a Copy button')], 'label'), 'One code block per way to install it'),
        desc(txt('note'), 'Small line under the code blocks'),
        desc(defineField({ name: 'source', type: 'url' }), 'Link to the source, e.g. GitHub'),
        desc(str('sourceNote'), 'Text next to the source link'),
      ]), 'Black band with the install commands. The closing CTA button jumps here'),
      defineField({ name: 'usingHead', title: 'Using it: headline', type: 'headline', description: 'Headline of the “Using it” tiles below' }),
      desc(list('using', 'Using it', [desc(str('icon'), 'Optional line icon name from illustrations/icons'), desc(str('title', 'Title', true), 'Tile title'), desc(txt('text', 'Text', true), 'Tile text')]), 'Tiles: what using it looks like week to week'),
      desc(list('steps', 'How it runs', [
        desc(str('phase'), 'Optional label above the timeline, shared by the steps that follow'),
        desc(str('title', 'Title', true), 'Step title'),
        desc(txt('text', 'Text', true), 'Step text'),
        desc(txt('note'), 'Small line under the step'),
        desc(ref('skill', 'skill'), 'The skill that does this step; linked from the step'),
        defineField({ name: 'key', title: 'Key step', type: 'boolean', initialValue: false, description: 'Highlights this step on the timeline' }),
      ]), 'Timeline, one column per step'),
      defineField({ name: 'cta', type: 'cta' }),
    ]),
    desc(refs('rules', 'rule', 'Rules it applies'), 'Rule cards on the page, between “How it runs” and the closing CTA'),
    ...inSet('settings',
      desc(slugField(), 'Page address: /scenarios/<slug>'),
      defineField({ name: 'status', type: 'string', initialValue: 'soon', options: { list: [{ title: 'Ready', value: 'ready' }, { title: 'Coming soon', value: 'soon' }], layout: 'radio', direction: 'horizontal' }, validation: (r) => r.required(), description: 'Only ready scenarios get a page; coming-soon ones show as a muted card' }),
      desc(refs('skills', 'skill', 'Skills it uses'), 'Links this scenario from those skills’ pages (“Part of a scenario”)'),
      order('scenario'),
    ),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
