// What editors see under each illustration in the pickers: the item it was drawn for, not its code name.
// Rules: "Rule NN"; skills and scenarios: a short form of the title. Stored values stay the code names.
export const ART_LABELS: Record<string, string> = {
  // Scenario figures
  sorter: 'Warm-lead handoff', orrery: 'Account audit', galton: 'Targeting vs buyers', lineshaft: 'Account routing',
  baggage: 'LinkedIn fit gate', analyzer: 'Signal loop', pumpjack: 'Social signals', burnin: 'Conversion weekly check',
  // Skill icons
  puzzle: 'Account engagement', clipboard: 'Account health', bell: 'Ad-hoc query', thermometer: 'Benchmark comparison',
  siphon: 'Budget re-allocation', trophies: 'Group scoreboard', knocker: 'Capping', passcard: 'Cost per retargetable',
  charger: 'Creative decay', gauge: 'CRM health', turnstile: 'Landing-page CPC', drilled: 'ABM penetration',
  sieve: 'Audience demographics', mirror: 'Benchmark context', bits: 'Creative performance', dial: 'Performance KPIs',
  regulator: 'Lowest bid', logbook: 'Monthly report', rulers: 'Market benchmark', adapter: 'Matched audiences',
  abacus: 'Multichannel rollup', keyrack: 'No-deal warm leads', metronome: 'Pacing check', lockout: 'Pausing ads',
  stanchions: 'Retargeting guardrails', periscope: 'Silent watchers', patchpanel: 'Traffic analysis', reels: 'Video quality',
  plug: 'Waste budget', weekpad: 'Weekly reporting', tagcounter: 'Buying-page visitors',
  // Rule icons
  clock: 'Rule 01', rollerstamp: 'Rule 02', bolts: 'Rule 03', billboard: 'Rule 04', wedge: 'Rule 05', balance: 'Rule 06',
  drawer: 'Rule 07', xray: 'Rule 08', springscale: 'Rule 09', cascade: 'Rule 10', aperture: 'Rule 11', canisters: 'Rule 12',
  airlock: 'Rule 13', chain: 'Rule 14', magnet: 'Rule 15',
};
export const artLabel = (name: string) => ART_LABELS[name] ?? name;
