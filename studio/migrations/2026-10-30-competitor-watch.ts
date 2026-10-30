// One-off, safe to re-run: adds the DemandSense scenario "Competitor watch" (coming soon until the skill ships), from Agov's
// draft of 30 Oct 2026. FIGURE is the picked illustration (options on /art-competitor). Backup of all scenarios before
// the run: project files cms/backups/2026-10-30-scenarios.json.
// Run: npx sanity exec migrations/2026-10-30-competitor-watch.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const FIGURE = 'seismo';
const client = getCliClient({ apiVersion: '2025-02-19' });
const r = (_ref: string) => ({ _type: 'reference', _ref });
const k = <T extends object>(p: string, xs: T[]) => xs.map((x, i) => ({ _key: `${p}${i}`, ...x }));

const order = (await client.fetch<number | null>('max(*[_type == "scenario" && _id != "scenario-sample" && !(_id in path("drafts.**"))].order)')) ?? 0;
const existing = await client.fetch<{ order?: number } | null>('*[_id == "scenario-competitor-watch"][0]{order}');

await client.createOrReplace({
  _id: 'scenario-competitor-watch', _type: 'scenario',
  title: 'Competitor watch',
  description: 'Once a week you find out what your competitors changed: what their websites now say and what their LinkedIn ads are selling. You see it early, before it turns up on a sales call or in a lost deal.',
  category: r('category-ads-creative'), cadence: r('cadence-weekly'), author: r('author-demandsense'),
  youNeed: 'Your list of competitors with their websites. The DemandSense Competitor Monitoring adds their LinkedIn ads.',
  youGet: 'A weekly note on each competitor that changed something: what changed and what it means for you.',
  connectors: k('c', [r('connector-demandsense-optional')]),
  art: { _type: 'scenarioArt', piece: FIGURE, variant: 'color', zoom: 1 },
  cover: 9,
  page: {
    steps: k('s', [
      ['List your competitors', 'Give each a priority, from main rival down to just keeping an eye on.'],
      ['Check what changed', 'Once a week, check their websites for changes and go through their new ads in the LinkedIn Ad Library (or through DemandSense Competitor Monitoring).'],
      ['Pick what matters', 'Who changed something that matters: a new offer or price, a new claim, a new audience, a switch in ad format, an ad they keep running.'],
      ['Write what it means', 'For each of those, write what changed and what it means for you: what to answer, what not to repeat, what to test.'],
    ].map(([title, text]) => ({ title, text }))),
  },
  rules: k('r', [r('rule-call-it-fatigue-only-when'), r('rule-judge-awareness-formats-on-reach-and-cpm')]),
  slug: { _type: 'slug', current: 'competitor-watch' },
  status: 'soon',
  order: existing?.order ?? order + 1,
});
console.log(`Created or replaced scenario-competitor-watch (figure ${FIGURE})`);
