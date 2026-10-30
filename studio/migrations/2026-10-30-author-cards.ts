// Safe to re-run: the approved author cards (role, company, About, links, headshot) for the 11 contributors and DemandSense.
// Overwrites those fields on the published document and its draft; name, slug, order and Top contributor stay as they are.
// Backs up all author documents to $BACKUP_DIR (default: current folder) first. DRY=1 prints the plan without writing.
// Run: PHOTO_DIR=<folder with the headshots> npx sanity exec migrations/2026-10-30-author-cards.ts --with-user-token
import { createReadStream, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });
const dry = !!process.env.DRY;
const dir = process.env.PHOTO_DIR;
if (!dir) throw new Error('Set PHOTO_DIR to the folder with the headshots');

const ICON: Record<string, string> = { LinkedIn: 'linkedin', Website: 'web', GitHub: 'github', X: 'x' };
const CARDS: { slug: string; role: string; company: string; photo: string; about: string; links: [string, string][] }[] = [
  { slug: "justin-rowe", role: "Founder & CEO", company: "Impactable", photo: "justin-rowe.jpg",
    about: "Founder and CEO of Impactable, a LinkedIn-centered B2B demand agency that runs marketing ecosystems as one connected system. Specializes in signal-based targeting and account-level measurement tied to real deals and pipeline.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/justin-rowe-4043339b/'], ['Website', 'https://impactable.com/']] },
  { slug: "roman-slobodzianyk", role: "LinkedIn Ads CoE Leader", company: "Impactable", photo: "roman-slobodzianyk.jpg",
    about: "Leads Impactable's LinkedIn Ads Center of Excellence and manages its team of LinkedIn Ads specialists. Sets the standards, AI-assisted workflows and review routines used across the agency's B2B client accounts.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/roman-slobodzianyk-b67549140/'], ['Website', 'https://impactable.com/']] },
  { slug: "george-coudounaris", role: "Co-founder", company: "The B2B Playbook", photo: "george-coudounaris.webp",
    about: "Runs The B2B Playbook with Kevin Chen, a demand generation agency and consultancy running LinkedIn, Google and Meta ads for B2B teams. Co-hosts The B2B Playbook podcast, now past 200 episodes, and teaches demand generation to B2B marketing and revenue teams through the agency's courses.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/b2b-marketing-expert/'], ['Website', 'https://theb2bplaybook.com/']] },
  { slug: "joshua-stout", role: "Founder", company: "Beyond The Funnel", photo: "joshua-stout.jpg",
    about: "Founder of Beyond The Funnel, a B2B LinkedIn Ads agency. One of 80 LinkedIn Certified Marketing Experts worldwide, he has managed or overseen 1,000+ LinkedIn Ads accounts, helped scale a multimillion-dollar LinkedIn Ads service, and was Director of Advertising at Influent.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/joshua-stout/'], ['Website', 'https://www.beyondthefunnel.ai/']] },
  { slug: "jonathan-belliveau", role: "Founder & Principal Revenue Architect", company: "GrowthMotiv", photo: "jonathan-belliveau.jpg",
    about: "Built GrowthMotiv, which builds the tracking and account intelligence that tie B2B ad spend to closed revenue. Has spent fifteen years running paid budgets across B2C and B2B SaaS, and specialises in account-based marketing built on Apollo.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/jonathan-belliveau/'], ['Website', 'https://growthmotiv.com/']] },
  { slug: "bogdan-liutic", role: "Founder", company: "CR8", photo: "bogdan-liutic.png",
    about: "Runs CR8, a LinkedIn Ads agency that targets companies by their public buying signals. A performance marketer, he built two businesses to seven figures on performance marketing and sales, wrote the LinkedIn ads playbook for Kyle Poyar's Growth Unhinged, and won Clay's 2026 GTM hackathon.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/bgdn/'], ['Website', 'https://cr8.eco/']] },
  { slug: "alfredo-talib", role: "Founder", company: "Cornersight", photo: "alfredo-talib.png",
    about: "Built Cornersight, a tool that turns engagement on LinkedIn posts into leads scored against an ICP.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/alfredo-iscandar-talib/'], ['Website', 'https://www.cornersight.io/']] },
  { slug: "moby-hayat", role: "Founder", company: "Fireshow Media", photo: "moby-hayat.jpg",
    about: "Runs paid media for B2B companies out of Austin, Texas, across LinkedIn, Meta and Google, and writes the ads himself. Has run Fireshow Media since 2016 and hosts Marketing Games, a show where B2B marketing leaders rank tactics.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/moby/'], ['Website', 'https://fireshowmedia.com/']] },
  { slug: "ivars-krutainis", role: "Founder", company: "Otter", photo: "ivars-krutainis.jpg",
    about: "Runs Otter, an agency that runs LinkedIn Ads only, for B2B SaaS companies. Handles strategy and execution on every account himself, from targeting and creative briefs to reporting.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/krutainis/'], ['Website', 'https://www.otterad.com/']] },
  { slug: "aj-wilcox", role: "Founder & CEO", company: "B2Linked", photo: "aj-wilcox.webp",
    about: "Runs B2Linked.com, a LinkedIn Ads agency and official LinkedIn Marketing Partner. Has run LinkedIn Ads since 2011, authored multiple courses for LinkedIn Learning, and hosts the LinkedIn Ads Show podcast.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/wilcoxaj/'], ['Website', 'https://b2linked.com/']] },
  { slug: "ivan-falco", role: "Partner & Head of ABM", company: "Frontal", photo: "ivan-falco.jpg",
    about: "Leads ABM at Frontal, the B2B demand generation agency formerly known as ColdIQ Agency. Runs LinkedIn Ads and ABM programmes for tech companies, and publishes his own LinkedIn Ads skills for Claude.",
    links: [['LinkedIn', 'https://www.linkedin.com/in/ivanfalco/'], ['Website', 'https://frontal.so/']] },
  { slug: "demandsense", role: "Maintainer of the Standard", company: "DemandSense", photo: "demandsense.png",
    about: "Builds software that shows B2B teams which accounts their LinkedIn Ads reach and what that turns into in pipeline. The DemandSense team wrote the Standard's 15 rules and keeps its skills library open on GitHub.",
    links: [['Website', 'https://demandsense.com/'], ['GitHub', 'https://github.com/demandsense-labs/linkedin-ads-skills']] },
];

const all = await client.fetch<any[]>('*[_type == "author"]');
writeFileSync(join(process.env.BACKUP_DIR ?? '.', `backup-authors-${new Date().toISOString().replace(/[:.]/g, '-')}.json`), JSON.stringify(all, null, 2));
const missing = CARDS.filter((c) => !all.some((d) => d.slug?.current === c.slug) || !existsSync(join(dir, c.photo)));
if (missing.length) throw new Error(`No author or no headshot for: ${missing.map((c) => c.slug).join(', ')}`);

const tx = client.transaction();
for (const c of CARDS) {
  const photo = dry ? join(dir, c.photo)
    : { _type: 'image', asset: { _type: 'reference', _ref: (await client.assets.upload('image', createReadStream(join(dir, c.photo)), { filename: c.photo }))._id } };
  const set = { role: c.role, company: c.company, about: c.about, photo,
    links: c.links.map(([label, url]) => ({ _type: 'link', _key: ICON[label], icon: ICON[label], label, url })) };
  // Drafts too, or publishing one would bring the old card back
  for (const d of all.filter((d) => d.slug?.current === c.slug)) tx.patch(d._id, (p) => p.set(set));
  console.log(c.slug, '|', c.role, '·', c.company, '|', c.links.map((l) => l[0]).join(', '));
}
if (dry) console.log('DRY: nothing written');
else console.log('committed', (await tx.commit()).results.length, 'patches');
