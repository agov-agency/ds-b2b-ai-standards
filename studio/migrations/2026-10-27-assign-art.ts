// One-off, safe to re-run: gives every scenario its figure and every skill and rule its icon (the code-drawn `i-<name>` set, 28 Oct names).
// Run: npx sanity exec migrations/2026-10-27-assign-art.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const ART: Record<string, string> = {
  'warm-lead-handoff': 'sorter', 'account-audit-by-cadence': 'orrery', 'targeting-vs-who-actually-buys': 'galton',
  'company-level-account-routing': 'lineshaft', 'linkedin-fit-gate': 'baggage', 'signal-loop': 'analyzer',
  'turn-social-signals-into-pipeline': 'pumpjack', 'weekly-check-for-conversion-campaigns': 'burnin',
};
const SKILL: Record<string, string> = {
  'landing-page-cpc-report': 'turnstile', 'lowest-bid-that-still-spends-the-budget': 'regulator', 'cost-per-retargetable-member': 'passcard',
  'retargeting-guardrails': 'stanchions', 'matched-audience-lists': 'adapter', 'no-deal-warm-leads-finder': 'keyrack',
  'silent-watchers-finder': 'periscope', 'account-health-check': 'clipboard', 'crm-data-health-check': 'gauge',
  'whos-looking-at-your-buying-pages': 'tagcounter', 'creative-decay-watchlist': 'charger', 'video-quality-check': 'reels',
  'waste-budget-detection': 'plug', 'campaign-group-scoreboard': 'trophies', 'market-benchmark-comparison': 'rulers',
  'manager-monthly-report': 'logbook', 'pausing-low-performing-ads': 'lockout', 'weekly-reporting': 'weekpad',
  'capping-recommendation': 'knocker', 'pacing-check-against-schedule': 'metronome', 'budget-re-allocation': 'siphon',
  'account-engagement': 'puzzle', 'ad-hoc-query': 'bell', 'benchmark-comparison': 'thermometer',
  'linkedin-abm-account-penetration': 'drilled', 'linkedin-audience-demographics': 'sieve', 'linkedin-benchmark-context': 'mirror',
  'linkedin-creative-performance': 'bits', 'linkedin-performance-kpis': 'dial', 'multichannel-performance-rollup': 'abacus',
  'traffic-analysis': 'patchpanel',
};
const RULE: Record<string, string> = {
  'read-frequency-and-penetration-together': 'clock', 'separate-frequency-targets-cold-warm': 'rollerstamp', 'call-it-fatigue-only-when': 'bolts',
  'judge-awareness-formats-on-reach-and-cpm': 'billboard', 'split-campaigns-only-when-a-segment-outperforms': 'wedge',
  'watch-for-budget-drifting-to-junior-roles': 'balance', 'to-exclude-sdrs-exclude-sales': 'drawer', 'check-who-your-ads-actually-reach': 'xray',
  'count-an-audience-as-warm-only-once-it-can-serve': 'springscale', 'spend-on-warm-audiences-before-cold': 'cascade',
  'start-lead-gen-forms-early': 'aperture', 'report-exposure-influence-attribution-separately': 'canisters',
  'give-sales-a-weekly-ranked-list': 'airlock', 'grow-a-signal-list-from-the-same-market': 'chain', 'judge-cold-ads-by-the-warm-audience-they-build': 'magnet',
};

const tx = client.transaction();
for (const [slug, piece] of Object.entries(ART)) tx.patch(`scenario-${slug}`, (p) => p.set({ art: { _type: 'scenarioArt', piece, variant: 'color', zoom: 1 } }));
for (const [slug, icon] of Object.entries(SKILL)) tx.patch(`skill-${slug}`, (p) => p.set({ icon }));
for (const [slug, icon] of Object.entries(RULE)) tx.patch(`rule-${slug}`, (p) => p.set({ icon }));
await tx.commit({ visibility: 'sync' });
console.log(`Set ${Object.keys(ART).length} figures, ${Object.keys(SKILL).length} skill icons, ${Object.keys(RULE).length} rule icons`);
