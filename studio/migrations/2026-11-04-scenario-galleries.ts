// Safe to re-run: the "What you get" gallery on all nine scenarios, from Nick's demo runs (sample accounts, 4 Nov).
// Screenshots: migrations/assets/<scenario slug>/. Replaces page.comesBack on the published document and its draft;
// backs both up to $BACKUP_DIR (default: current folder) first. DRY=1 prints the plan and writes nothing.
// Run from studio/: npx sanity exec migrations/2026-11-04-scenario-galleries.ts --with-user-token
import { createReadStream, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const dry = !!process.env.DRY;

type Slide = [file: string, title: string, caption: string];
const GALLERIES: Record<string, { headline: string; context: string; items: Slide[] }> = {
  'turn-social-signals-into-pipeline': {
    headline: 'Two lists: sales review and nurture.', context: 'With a one-line reason per company',
    items: [
      ['brief.png', 'The brief', 'Nine companies for sales review, eight for nurture, and three questions that move the lists'],
      ['sales.png', 'The sales-review list', 'ICP fits with a social signal plus a site visit or High ad engagement, ranked'],
      ['nurture.png', 'The nurture list', 'Everyone else who fits, with the reason they wait, and who was left out'],
      ['posts.png', 'The posts behind it', 'Which posts drew the engagement, and the people inside each sales company'],
      ['checks.png', 'How the files were joined', 'What matched across the exports, what didn’t, and what it couldn’t check'],
    ],
  },
  'signal-loop': {
    headline: 'Who to write to this week.', context: 'And why now',
    items: [
      ['brief.png', 'The Monday brief', 'Companies to write to, cards to approve, and the placeholder pages to exclude first'],
      ['cards.png', 'Cards to approve', 'Up to five warm accounts, each with the public signal to write about and who to write to'],
      ['queue.png', 'The queue and hand-off', 'Every A company in signal order, the CRM hand-off file and the weekly chain'],
    ],
  },
  'linkedin-campaign-early-read': {
    headline: 'One call, before conversions exist.', context: 'And up to three fixes for the next read',
    items: [
      ['call.png', 'The call and the fixes', 'The verdict, and up to three fixes with a number to reach by the next read'],
      ['delivery.png', 'The delivery check', 'Daily views against what the spend should buy, with the settings behind them'],
      ['audience.png', 'Right companies and people', 'The share of views outside your ICP, the biggest leaks and what they cost'],
      ['leads.png', 'From view to trial', 'The funnel, and the accounts to act on grouped by next step'],
    ],
  },
  'targeting-vs-who-actually-buys': {
    headline: 'Who you pay to reach, against who buys.', context: 'With the titles to exclude and the calls to approve',
    items: [
      ['brief.png', 'The monthly review', 'What each ad set paid to reach, graded on-target, adjacent or off-target'],
      ['pipeline.png', 'Spend against pipeline', 'Each buyer profile’s share of spend next to its share of pipeline'],
      ['exclusions.png', 'Titles safe to exclude', 'Off-target titles to drop as a 30-day test, and the ones to keep for now'],
      ['decisions.png', 'Recommendations to decide', 'Eight calls, each with the number that confirms it'],
    ],
  },
  'linkedin-fit-gate': {
    headline: 'A verdict on who the campaign reached.', context: 'Pass, one more week, or rebuild',
    items: [
      ['2-grade.png', 'The grade', 'Fit rate, margin and companies graded, with the counts behind the verdict'],
      ['3-fixes.png', 'The fail reasons', 'Leaked exclusions first, then which gate each company failed'],
      ['4-handoff.png', 'The exclusion list', 'All failed companies as a CSV, ready to upload to LinkedIn'],
      ['5-daily.png', 'The daily check', 'New companies reached, new fails and leaked exclusions since yesterday'],
    ],
  },
  'company-level-account-routing': {
    headline: 'Who takes your impressions.', context: 'And what to do about each account',
    items: [
      ['coverage.png', 'Where impressions go', 'The accounts taking a big share of impressions, each with an outcome'],
      ['targets.png', 'Your target accounts', 'Which listed accounts were reached, which are aware, and which are underserved'],
      ['engagement.png', 'Who engages', 'ICP accounts rising, new or fading against the month before, with a route for each'],
      ['decisions.png', 'Eight recommendations', 'Each checked on fit, list, campaign job and CRM, with the number to confirm next run'],
    ],
  },
  'warm-lead-handoff': {
    headline: 'A call list for this week.', context: 'Who to call, who takes them, and what to say',
    items: [
      ['brief.png', 'The brief', 'Accounts to act on now, the call to make first, and what was removed before ranking'],
      ['priority-1.png', 'Priority 1', 'Five accounts to hand off this week, each with a line a rep can say out loud'],
      ['act-now.png', 'The rest of Act now', 'Priority 2 and 3 accounts with their route and hand-off line'],
      ['routes.png', 'Customers, deals and exclusions', 'Customers and open deals to their owners, fits to confirm, and the ad exclusion list'],
      ['decisions.png', 'Recommendations', 'Three calls, each with the evidence and the number that confirms it'],
    ],
  },
  'weekly-check-for-conversion-campaigns': {
    headline: 'What to pause, what to copy.', context: 'Every ad against your goal cost per lead',
    items: [
      ['brief.png', 'The weekly check', 'Every ad against its goal cost per lead: pause, keep or too early'],
      ['winners.png', 'Pause and replace', 'The winners to build new versions from, with their headline and intro text'],
      ['diagnosis.png', 'The ad-set diagnosis', 'Delivery, audience size and audience quality where every ad is expensive'],
      ['decisions.png', 'Your decisions', 'Six recommendations to approve, and how last week’s decisions worked out'],
    ],
  },
  'account-audit-by-cadence': {
    headline: 'Each check on its own cadence.', context: 'And only the flags that need you today',
    items: [
      ['brief.png', 'The Monday run', 'Which checks are due, and every flag sorted into act today, this week and monitor'],
      ['bids.png', 'Bids and pacing', 'Budget use and bid moves per ad set, and where the month will land'],
      ['fatigue.png', 'The fatigue review', 'Click rate by week for every ad, with a rotation call and a significance test'],
      ['decisions.png', 'Recommendations to decide', 'Ten calls, each with the number that confirms it'],
    ],
  },
};

const ids = Object.keys(GALLERIES).map((s) => `scenario-${s}`);
const docs = await client.fetch<any[]>('*[_id in $ids || _id in $drafts]', { ids, drafts: ids.map((id) => `drafts.${id}`) });
const missing = ids.filter((id) => !docs.some((d) => d._id === id));
if (missing.length) throw new Error(`Missing: ${missing.join(', ')}`);
writeFileSync(join(process.env.BACKUP_DIR ?? '.', `backup-scenario-galleries-${new Date().toISOString().replace(/[:.]/g, '-')}.json`), JSON.stringify(docs, null, 2));

const tx = client.transaction();
for (const [slug, { headline, context, items }] of Object.entries(GALLERIES)) {
  const slides = [];
  for (const [file, title, caption] of items) {
    const src = dry ? file
      : { _type: 'image', asset: { _type: 'reference', _ref: (await client.assets.upload('image', createReadStream(join(process.cwd(), 'migrations/assets', slug, file)), { filename: `${slug}-${file}` }))._id } };
    slides.push({ _key: file.replace('.png', ''), title, caption, src });
  }
  // Drafts too, or publishing one would bring the old gallery back
  for (const d of docs.filter((d) => d._id.replace('drafts.', '') === `scenario-${slug}`)) {
    tx.patch(d._id, (p) => p.setIfMissing({ page: {} }).set({ 'page.comesBack': { headline, context, items: slides } }));
    console.log(d._id, slides.length, 'slides');
  }
}
if (dry) console.log('DRY: nothing written');
else console.log('committed', (await tx.commit()).results.length, 'patches');
