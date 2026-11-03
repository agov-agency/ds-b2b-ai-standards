// One-off, safe to re-run: removes the "What you get" galleries that only hold placeholders (no screenshots yet) from the
// five scenarios filled on 3 Nov. Captions are in 2026-11-03-coming-next-cards.ts; add the gallery back with Nick's screenshots.
// Run: npx sanity exec migrations/2026-11-03-hide-output-placeholders.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const ids = ['scenario-linkedin-fit-gate', 'scenario-signal-loop', 'scenario-turn-social-signals-into-pipeline', 'scenario-weekly-check-for-conversion-campaigns', 'scenario-linkedin-campaign-early-read'];
const tx = client.transaction();
for (const id of ids) tx.patch(id, (p) => p.unset(['page.comesBack']));
await tx.commit({ visibility: 'sync' });
console.log(`Removed placeholder galleries from ${ids.length} scenarios`);
