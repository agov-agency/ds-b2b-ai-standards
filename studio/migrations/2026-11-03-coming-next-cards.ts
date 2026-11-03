// One-off, safe to re-run: Agov's "Coming-next card copy" doc of 2 Nov 2026.
// Fills the six grey cards (status → ready), removes three AJ skills with no skill behind them and Competitor watch,
// adds the scenario "LinkedIn Campaign Early Read" and the skill "LinkedIn Creative Fatigue Report".
// Output screenshots come later from Nick's test runs: scenario galleries carry the captions with placeholders.
// Backup before the run: project files cms/backups/2026-11-03-skills-scenarios.json.
// Run: npx sanity exec migrations/2026-11-03-coming-next-cards.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const r = (_ref: string) => ({ _type: 'reference', _ref });
const k = <T extends object>(p: string, xs: T[]) => xs.map((x, i) => ({ _key: `${p}${i}`, ...x }));
const GH = 'https://github.com/demandsense-labs/linkedin-ads-skills/tree/main/';
const RULE: Record<number, string> = {
  1: 'read-frequency-and-penetration-together', 2: 'separate-frequency-targets-cold-warm', 3: 'call-it-fatigue-only-when',
  4: 'judge-awareness-formats-on-reach-and-cpm', 8: 'check-who-your-ads-actually-reach', 9: 'count-an-audience-as-warm-only-once-it-can-serve',
  10: 'spend-on-warm-audiences-before-cold', 11: 'start-lead-gen-forms-early', 12: 'report-exposure-influence-attribution-separately',
  13: 'give-sales-a-weekly-ranked-list', 14: 'grow-a-signal-list-from-the-same-market', 15: 'judge-cold-ads-by-the-warm-audience-they-build',
};
const rules = (...ns: number[]) => k('r', ns.map((n) => r(`rule-${RULE[n]}`)));
const conn = (...ids: string[]) => k('c', ids.map((id) => r(`connector-${id}`)));

// New "Runs with" entries; no logo in the set yet, so the generic list mark
const CONNECTORS = { 'apollo': 'Apollo', 'web-analytics-export': 'Web analytics export', 'website-visitors-export': 'Website visitors export', 'post-engagers-export': 'Post engagers export' };

const skillPage = (name: string, folder: string, bring: string, back: string) => ({
  does: { headline: 'It reads your exports.', context: 'And changes nothing in your accounts.', body: [`You bring: ${bring}`, `You get back: ${back}`] },
  prompt: {
    headline: 'Paste it into your AI.', context: 'Attach your exports first. It reads them and changes nothing', source: GH + folder,
    tabs: k('t', [{ label: 'Your exports', text: `Load the ${name} skill from ${GH + folder} and run it on the exports I’ve attached.` }]),
  },
});

const gallery = (headline: string, context: string, items: [string, string][]) =>
  ({ headline, context, items: k('o', items.map(([title, caption]) => ({ title, caption }))) });

const scenarioGet = (name: string, folder: string, context: string) => ({
  intro: 'Paste one prompt.', context, source: GH + folder, sourceNote: 'Skill folder on GitHub',
  options: k('g', [
    { label: 'Your exports', text: `Load the ${name} scenario from ${GH + folder} and run it on the exports I’ve attached.` },
    { label: 'DemandSense', text: `Load the ${name} scenario from ${GH + folder} and run it on my DemandSense workspace. Pull the data through the connector rather than asking me for exports.` },
  ]),
});
const steps = (xs: [string, string][]) => k('s', xs.map(([title, text]) => ({ title, text })));

// Fields set on existing documents (page is replaced whole, which drops the old skill steps); art, cover, icon, order and slug stay
const PATCHES: Record<string, Record<string, unknown>> = {
  'skill-landing-page-cpc-report': {
    status: 'ready', author: r('author-ivars-krutainis'), area: r('category-ads-creative'),
    changes: 'Reads your data, changes nothing',
    description: 'Shows what one visit to your website really costs in LinkedIn Ads: spend divided by the clicks that reached your landing page, not all clicks. Ranks ad sets from cheapest to dearest and compares formats like for like.',
    connectors: conn('linkedin-ads-export'),
    page: skillPage('Landing-Page CPC Report', 'landing-page-cpc-report',
      'The Campaign Performance export from Campaign Manager for one ad account and a date range (last 30 days), with the Clicks to Landing Page column. Optional: the Ad Performance export for the same dates, for the format comparison, and the word that marks thought leader ads in your ad names.',
      'A headline with the blended landing-page cost per click, a ranked table of ad sets, lead-gen ad sets shown apart, a format comparison (thought leader, video, image, dynamic) and an accuracy line to match against Campaign Manager. It reports and takes no action.'),
    rules: rules(4),
  },
  'skill-cost-per-retargetable-member': {
    status: 'ready', author: r('author-aj-wilcox'), area: r('category-ads-creative'),
    changes: 'Reads your data, changes nothing',
    description: 'Measures cold ad sets by what it costs to add one person to your retargeting audience: spend divided by the actions your retargeting pools are built from. Finds the ad type and objective that build the warm audience cheapest, and shows what each change you made did to the number.',
    connectors: conn('linkedin-ads-export'),
    page: skillPage('Cost Per Retargetable Member', 'cost-per-retargetable-member',
      'The ad-level Ad Performance export for the last 30 days (daily rows if you want before-and-after readings), plus earlier months for a trend. How you mark stage and format in ad set names (for example S01 for cold, TLA-VID and TLA-SI for thought leader ads). The actions your retargeting audiences use per ad type, if different from the defaults. A list of dated changes: new creative, bid, budget, targeting. Optional: actual retargeting audience sizes and last run’s history table.',
      'The data check, cost per retargetable member by ad type and objective, then by ad set and ad with its band and a volume check, where the cost is too high and the question to ask, the monthly trend, before and after each change, up to 8 recommendations, and a history table to paste into the next run.'),
    rules: rules(15, 10, 9),
  },
  'scenario-linkedin-fit-gate': {
    status: 'ready', author: r('author-jonathan-belliveau'), category: r('category-budget-reach'), cadence: r('cadence-daily-then-weekly'),
    description: 'Grades a prospecting campaign by the companies it actually reached against your ICP, then says pass, run one more week, or rebuild. Runs daily after launch to catch new fails and leaked exclusions.',
    youNeed: 'The Companies tab export for one campaign since launch, your fit gate (countries, employee range, one buyer signal, exclusions) and a fit source with one row per company: Apollo, your CRM or a CSV. Or the DemandSense MCP.',
    youGet: 'A status line (fit rate, margin, companies graded, verdict), fail reasons per gate, leaked exclusions and the exclusion list as a CSV, and for the daily check what changed since the last run.',
    connectors: conn('linkedin-ads-export', 'apollo', 'crm-export', 'csv-export', 'demandsense-optional'),
    page: {
      comesBack: gallery('A verdict on who the campaign reached.', 'Pass, one more week, or rebuild', [
        ['The ask', 'One line to Claude: run the fit gate on the campaign’s Companies export'],
        ['The status line', 'Fit rate, margin, companies graded and the verdict'],
        ['The fail reasons', 'Which gate each company failed, leaked exclusions first'],
        ['The exclusion list', 'The fails as a CSV, ready to upload to LinkedIn'],
      ]),
      get: scenarioGet('Audience Fit Check', 'audience-fit-check', 'It grades and recommends, and changes nothing'),
      steps: steps([
        ['Set the gate', 'Once, before launch: countries, employee range, one buyer signal (for example “runs paid ads”) and exclusions: your own domain, customers, open deals, competitors.'],
        ['Pull the companies reached', 'The Companies tab export for one campaign, since launch.'],
        ['Catch the leaks', 'Clean the domains; any excluded company that was reached is a leaked exclusion and goes to the top.'],
        ['Grade the fit', 'Check each domain in Apollo, the CRM or your CSV and apply the gate. Fit rate by count and weighted by impressions.'],
        ['Verdict', 'Once enough companies are graded: pass, extend a week, or rebuild. Fails go to an exclusion CSV for LinkedIn.'],
        ['Daily check', 'New companies reached, new fails and leaked exclusions since the last run.'],
      ]),
    },
    rules: rules(8, 1),
  },
  'scenario-signal-loop': {
    status: 'ready', author: r('author-bogdan-liutic'), category: r('category-signal-to-sales'), cadence: r('cadence-weekly-monthly'),
    description: 'Runs the weekly routine for LinkedIn ads that go only to a list of named target companies, so a person knows which companies to write to this week and why now. It never sends or changes anything.',
    youNeed: 'Your target list, a signals file (date and evidence link per signal) and a CRM export with deal stages. For Mondays: the Companies export of the last 30 days, a weekly delivery table from Campaign Manager and last month’s list file. Optional: site visits and leads by company. The DemandSense MCP adds ad engagement, site visits, CRM status and lead forms on top of the exports.',
    youGet: 'A, B and C lists with a holdout and LinkedIn upload files, the A queue, the placeholder band and names to exclude, a dose verdict per ad set, up to 5 cards to approve with a CRM hand-off file, and at quarter end the served-versus-holdout counts.',
    connectors: conn('linkedin-ads-export', 'signal-sources', 'crm-export', 'demandsense-optional'),
    page: {
      comesBack: gallery('Who to write to this week.', 'And why now', [
        ['The ask', 'One line to Claude: run Monday’s checks on the signal list'],
        ['The A, B and C lists', 'The list sorted by fresh dated signals, with the holdout and upload files'],
        ['Monday’s cards', 'Up to five warm accounts to approve, each with the signal to write about'],
        ['The hand-off file', 'The approved cards as a CRM hand-off file'],
      ]),
      get: scenarioGet('Signal List Routine', 'signal-list-routine', 'It never sends or changes anything'),
      steps: steps([
        ['Sort the list', 'Monthly: A (two or more fresh dated signals), B (one signal), C (fit only). Hold out about 100 B companies with no ads all quarter.'],
        ['Strike placeholders', 'Monday: clicks from fake employer pages like “Stealth AI Startup” come out before anything is read.'],
        ['Check the dose', 'Monday: is each list still reaching new people, at about 5 views a person a month on warm lists?'],
        ['Route warm accounts', 'Monday: companies engaging far above the ads become cards to approve, up to five, with the public signal as the reason to write, plus a CRM hand-off file.'],
        ['Read the holdout', 'Quarter end: which signals sat on won deals, served against holdout as two counts, never a percentage.'],
      ]),
    },
    rules: rules(13, 14, 12, 2),
  },
  'scenario-turn-social-signals-into-pipeline': {
    status: 'ready', author: r('author-alfredo-talib'), category: r('category-signal-to-sales'), cadence: r('cadence-on-demand'),
    description: 'Turns people who engaged with LinkedIn posts (a competitor’s, a topic’s, or your own company page’s) into two company-level lists: companies for sales review and companies for nurture. It sends nothing and looks no one up.',
    youNeed: 'An export of post engagers from your social-engagement tool (company, domain or LinkedIn page, post, date), the Companies tab export from Campaign Manager and a website visits export by company, all for the last 30 days. Your ICP and your own company name. Optional: a CRM export. Or the engagers export plus the DemandSense MCP.',
    youGet: 'A headline count, a ranked sales-review table and a nurture table with a one-line reason per company, the companies dropped for ICP or that couldn’t be matched, and questions about the ICP and the buying pages.',
    connectors: conn('post-engagers-export', 'linkedin-ads-export', 'website-visitors-export', 'demandsense-optional'),
    page: {
      comesBack: gallery('Two lists: sales review and nurture.', 'With a one-line reason per company', [
        ['The ask', 'One line to Claude: turn last month’s post engagers into company lists'],
        ['The sales-review list', 'ICP fits with an organic signal plus a site visit or high ad engagement, ranked'],
        ['The nurture list', 'Everyone else who fits, with the reason they wait'],
        ['The dropped companies', 'Left out for ICP or because they couldn’t be matched'],
      ]),
      get: scenarioGet('Social Signals to Pipeline', 'social-signals-to-pipeline', 'It sends nothing and looks no one up'),
      steps: steps([
        ['Pick the source', 'Posts anywhere on LinkedIn, your company page, or both.'],
        ['Group by company', 'The engagers, grouped by the company they work for.'],
        ['Add your own signals', 'What each company did with you: website sessions, pricing or demo page views, ad engagement level.'],
        ['Keep the ICP fits', 'Industries, size, named companies if you have them.'],
        ['Split the lists', 'Sales review is ICP fit plus the organic signal plus a website visit or high ad engagement. Everyone else goes to nurture. Companies already in pipeline go to the deal owner.'],
      ]),
    },
    rules: rules(13, 12),
  },
  'scenario-weekly-check-for-conversion-campaigns': {
    status: 'ready', author: r('author-moby-hayat'), category: r('category-ads-creative'), cadence: r('cadence-weekly'),
    description: 'Judges every Lead Gen Form and Message ad against your goal cost per lead: which ads to pause, which winners to copy into new versions, and what to check when every ad in an ad set is expensive. It gives recommendations to approve and changes nothing.',
    youNeed: 'The Ad Performance export with a daily breakdown (from each ad’s first day, or the last 37 days), the Campaign Performance export with audience penetration and frequency, and a short note per ad set: goal cost per lead, cold or retargeting, bid. Optional: your ICP with the top 100 companies of the saved audience, and last week’s table. Or the DemandSense MCP.',
    youGet: 'A headline count of ads to pause, a table of flagged ads with the numbers behind each, winners to copy with their headlines, a diagnosis for ad sets where every ad is expensive, and a table to paste next week.',
    connectors: conn('linkedin-ads-export', 'demandsense-optional'),
    page: {
      comesBack: gallery('What to pause, what to copy.', 'Every ad against your goal cost per lead', [
        ['The ask', 'One line to Claude: run the weekly check on last week’s conversion ads'],
        ['The pause list', 'Flagged ads with the numbers behind each'],
        ['The winners', 'Ads at or under goal, with the headlines to copy'],
        ['The ad-set diagnosis', 'Delivery, audience size and audience quality where every ad is expensive'],
      ]),
      get: scenarioGet('Weekly Check for Conversion Ads', 'conversion-ad-weekly-check', 'It recommends and changes nothing'),
      steps: steps([
        ['Scope', 'Lead gen and Message ad sets that spent in the last 7 days. Any without a goal cost per lead is skipped.'],
        ['No leads', 'Flag for pause once the ad has spent twice the goal cost per lead.'],
        ['Expensive leads', 'Flag for pause when cost per lead reaches 1.5 times the ad set’s own baseline.'],
        ['Winners', 'Ads at or under goal. The top two become the source for new versions with the same offer.'],
        ['Whole ad set expensive', 'Check delivery (spend against daily budget, manual bid), audience size (penetration under 10% means the budget is too small or the audience too big; 20% and up is where you want it) and audience quality (share of engaging companies that fit the ICP).'],
        ['Approve', 'One recommendation per flagged ad or ad set.'],
      ]),
    },
    rules: rules(11, 1),
  },
};

const REMOVE = ['skill-lowest-bid-that-still-spends-the-budget', 'skill-retargeting-guardrails', 'skill-matched-audience-lists', 'scenario-competitor-watch'];

const last = async (type: string) => (await client.fetch<number | null>(`*[_type == $type && !(_id in ["skill-sample", "scenario-sample"]) && !(_id in path("drafts.**"))] | order(order desc)[0].order`, { type })) ?? 0;
const keep = async (id: string) => (await client.fetch<{ order?: number } | null>('*[_id == $id][0]{order}', { id }))?.order;

const tx = client.transaction();
for (const [slug, name] of Object.entries(CONNECTORS)) tx.createOrReplace({ _id: `connector-${slug}`, _type: 'connector', name, brand: 'list' });
for (const [id, set] of Object.entries(PATCHES)) tx.patch(id, (p) => p.set(set));
for (const id of REMOVE) { tx.delete(id); tx.delete(`drafts.${id}`); }

tx.createOrReplace({
  _id: 'scenario-linkedin-campaign-early-read', _type: 'scenario',
  title: 'LinkedIn Campaign Early Read',
  description: 'A first read on one LinkedIn campaign 7 to 14 days after launch, before conversions exist: is it delivering as expected, is it reaching the right companies and people, who is engaging with the ads and on your site, and which accounts are worth acting on now. It only recommends and changes nothing.',
  category: r('category-building-account'), cadence: r('cadence-once-days-7-to-14'), author: r('author-demandsense'),
  youNeed: 'For one campaign (ad set) and its dates: the Campaign Performance export with a daily breakdown, the Ad Performance export, the Companies tab export and the Demographics report, plus firmographics for the companies reached, website sessions and key events, and a short note of the job, ICP, settings and UTM tag. Optional: a CRM export and your usual click rate and costs. Or the DemandSense MCP.',
  youGet: 'One call with a confidence label and up to three fixes, each with a number to reach by the next read; four state tiles; the view-to-trial funnel with the broken step; up to 10 leads grouped by next step; the delivery check; the company and people fit with the dollar leak; and conversions.',
  connectors: conn('linkedin-ads-export', 'web-analytics-export', 'demandsense-optional'),
  art: { _type: 'scenarioArt', piece: 'seismo', variant: 'color', zoom: 1 }, // freed by Competitor watch
  cover: 9,
  page: {
    comesBack: gallery('One call, before conversions exist.', 'And up to three fixes for the next read', [
      ['The ask', 'One line to Claude: read the campaign’s first two weeks'],
      ['The call and the fixes', 'The verdict with a confidence label, and up to three fixes with a number to reach'],
      ['The funnel', 'View to trial, with the broken step marked'],
      ['The leads', 'Up to 10 accounts grouped by next step'],
    ]),
    get: scenarioGet('LinkedIn Campaign Early Read', 'linkedin-campaign-early-read', 'It only recommends and changes nothing'),
    steps: steps([
      ['Delivery check', 'Spend against budget, impressions and clicks against your usual rates, for the days since launch.'],
      ['Company fit', 'The companies reached against your ICP, and the share of spend that went to companies outside it (the dollar leak).'],
      ['People fit', 'The Demographics report against who the campaign was meant to reach.'],
      ['Engagement', 'Who engaged with the ads and on your site, read as a view-to-trial funnel with the broken step marked.'],
      ['The call', 'One verdict with a confidence label, up to three fixes with a number to reach by the next read, and up to 10 leads grouped by next step.'],
    ]),
  },
  rules: rules(8, 1, 13),
  skills: [],
  slug: { _type: 'slug', current: 'linkedin-campaign-early-read' },
  status: 'ready',
  order: (await keep('scenario-linkedin-campaign-early-read')) ?? (await last('scenario')) + 1,
});

tx.createOrReplace({
  _id: 'skill-linkedin-creative-fatigue-report', _type: 'skill',
  title: 'LinkedIn Creative Fatigue Report',
  description: 'Shows which of your LinkedIn ads are wearing out, in which ad set, how fast, and whether to pause them. Every ad is judged on the number that matches its objective and only against its own history, and a decline counts only after two weeks in a row.',
  area: r('category-ads-creative'), author: r('author-ivan-falco'),
  changes: 'Reads your data, changes nothing',
  icon: 'regulator', // freed by "Lowest bid that still spends the budget"
  cover: 5,
  connectors: conn('linkedin-ads-export'),
  page: skillPage('LinkedIn Creative Fatigue Report', 'linkedin-creative-fatigue-report',
    'The Ad Performance export with a daily breakdown for the last 6 to 18 complete weeks (Monday to Sunday), and the Campaign Performance (ad set) export for the 30 days ending on the last Sunday, no breakdown, for reach and average frequency. Optional: a short note with the as-of date, the funnel-stage words in your ad set names (TOF, MOF, BOF) and your own frequency lines.',
    'Act now: ads in obvious decline, steepest first, grouped by post and ad set, with the trend, the weekly line, the ad set’s 30-day frequency against the line for its funnel stage, and one action (pause or refresh, or look at the creative and the audience). Then early signs, a watch list, a count of healthy ads, what was left out and why, the full table as a CSV and up to five recommendations. The same post shows in every ad set it runs in, so you can see it worn out in a small retargeting audience and fine in a large cold one.'),
  rules: rules(3, 2, 4),
  slug: { _type: 'slug', current: 'linkedin-creative-fatigue-report' },
  status: 'ready',
  order: (await keep('skill-linkedin-creative-fatigue-report')) ?? (await last('skill')) + 1,
});

await tx.commit({ visibility: 'sync' });
console.log(`Filled ${Object.keys(PATCHES).length}, removed ${REMOVE.length}, added the Early Read scenario and the Creative Fatigue skill`);
