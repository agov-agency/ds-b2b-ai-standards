# Builds seed/directory.json: every author, rule, skill and scenario as of 27 Oct 2026.
# Sources: rule pages copy (Google Doc), contributors directory (sheet), Open-Source DemandSense Skills (sheet).
# Run: python3 seed/directory.py, then npx sanity exec migrations/2026-10-27-rebuild-directory.ts --with-user-token
import json, re, os

slug = lambda v: re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', v.lower()))
ref = lambda i: {'_type': 'reference', '_ref': i}
n = 0
def key():
    global n; n += 1; return f'k{n}'
def refs(ids): return [{'_key': key(), **ref(i)} for i in ids]
def keyed(items): return [{'_key': key(), **x} for x in items]
docs = []

# Authors: name, company and LinkedIn from the contributors directory; DemandSense keeps its own entry
AUTHORS = [
    ('Justin Rowe', 'Impactable', 'https://www.linkedin.com/in/justin-rowe-4043339b/'),
    ('Roman Slobodzianyk', 'Impactable', 'https://www.linkedin.com/in/roman-slobodzianyk-b67549140/'),
    ('George Coudounaris', 'The B2B Playbook', 'https://www.linkedin.com/in/b2b-marketing-expert/'),
    ('Joshua Stout', 'Beyond The Funnel', 'https://www.linkedin.com/in/joshua-stout/'),
    ('Jonathan Belliveau', 'GrowthMotiv', 'https://www.linkedin.com/in/jonathan-belliveau/'),
    ('Bogdan Liutic', 'CR8', 'https://www.linkedin.com/in/bgdn/'),
    ('Alfredo Talib', 'Cornersight', 'https://www.linkedin.com/in/alfredo-iscandar-talib/'),
    ('Moby Hayat', 'The Fire Show', 'https://www.linkedin.com/in/moby/'),
    ('Ivars Krutainis', 'Otter', 'https://www.linkedin.com/in/krutainis/'),
    ('AJ Wilcox', 'B2Linked', 'https://www.linkedin.com/in/wilcoxaj/'),
]
A = {}
for i, (name, company, url) in enumerate(AUTHORS, 1):
    s = slug(name); A[name] = f'author-{s}'
    docs.append({'_id': A[name], '_type': 'author', 'name': name, 'company': company, 'featured': True, 'order': i,
                 'slug': {'_type': 'slug', 'current': s},
                 'links': keyed([{'icon': 'linkedin', 'label': 'LinkedIn', 'url': url}])})
A['DemandSense'] = 'author-demandsense'
docs.append({'_id': 'author-demandsense', '_type': 'author', 'name': 'DemandSense', 'role': 'Maintainer of the Standard', 'featured': False, 'order': len(AUTHORS) + 1,
             'about': 'The LinkedIn Ads analytics company behind the Standard. Writes the base rules every skill checks against, tests each contribution on real accounts before it is published, and keeps the library free',
             'slug': {'_type': 'slug', 'current': 'demandsense'},
             'links': keyed([{'icon': 'linkedin', 'label': 'LinkedIn', 'url': 'https://www.linkedin.com/company/demandsense'}, {'icon': 'web', 'label': 'Website', 'url': 'https://demandsense.com'}])})
COMPANY = {name: company for name, company, _ in AUTHORS}

CAT = {'Reach and frequency': 'reach-frequency', 'Ads and creative': 'ads-creative', 'Who the budget reaches': 'budget-reach',
       'Building the account': 'building-account', 'From signal to sales': 'signal-to-sales'}
cat = lambda c: ref(f'category-{CAT.get(c, c)}')

# Rules: the rule pages copy, section by section. Voices: (name, quote, note)
RULES = [
 dict(n=1, slug='read-frequency-and-penetration-together', cat='Reach and frequency', title='Read frequency and penetration together',
  why="One number alone doesn't tell you what to fix.",
  advises='Campaign Manager reports reach, average frequency and audience penetration for each campaign.',
  adds='Read penetration and accounts reached first, then frequency, then CTR, and decide from the combination. Read them at 30, 60 and 90 days.',
  reason='An average frequency of 3 can mean part of the list saw the ad a dozen times while most of it saw nothing. Once penetration stops growing, more budget only raises frequency on the people already reached.',
  less='Average frequency on its own is enough when the audience is small and penetration is high, because most people are close to the average.',
  signs=[('Frequency under target, penetration healthy', 'Add budget, or narrow the audience so the same budget repeats more.'),
         ('Penetration stalls around 50% with frequency on target', "That's a reachability ceiling. Export the accounts with no impressions and reach them through other channels, like Meta, programmatic or outbound."),
         ('Frequency above target, CTR falling', 'Rotate the weakest ads before you touch budget (rule 03).')],
  voices=[('Bogdan Liutic', '“Read them together, and over 90 days, not one week. On a signal list low reach is still the usual problem, so I check how much of the list has seen me at all before I touch the average.”', None)]),
 dict(n=2, slug='separate-frequency-targets-cold-warm', cat='Reach and frequency', title='Set separate frequency targets for cold and warm audiences',
  why='Cold audiences run low and wide. Warm audiences need repetition.',
  advises='Campaign Manager reports average frequency for each campaign. Frequency targets are left to the advertiser.',
  adds='Cold: low and wide, reach first. Warm in-feed: around 15 to 25 impressions per person over 90 days (our current working range).',
  reason="Cold advertising is there to reach people and fill the warm audiences, so repetition is mostly wasted on it. Warm audiences already know you, and that's where repetition turns into trust and action.",
  less='One target for the whole account is fine while it runs a single audience layer, such as a new account that only runs cold campaigns.',
  signs=[('One frequency target for the whole account', 'Set one for cold and a higher one for warm.'),
         ('Cold frequency rising while penetration stays flat', 'Widen reach before you add repetition.'),
         ('Warm audiences under 15 impressions a person in 90 days', 'Move budget into the warm layer until it reaches its range.')],
  voices=[('Bogdan Liutic', '“Two targets, yes. But to me, a company with a fresh, dated signal is warm whether it clicked or not, and a company that only fits stays cold. Run a signal company in the cold band, under 3 to 5 views in 90 days, and it barely sees you right when it has a reason to buy. So I plan about 5 a month.”', None),
          ('Ivars Krutainis', '“I aim for a frequency of 3–5 for cold audiences and 10–15 for warm, and try not to go over 15.”', 'Runs it differently')]),
 dict(n=3, slug='call-it-fatigue-only-when', cat='Ads and creative', title='Call it fatigue only when frequency is high and CTR keeps falling',
  why="Either signal on its own isn't fatigue.",
  advises='LinkedIn recommends several ads per ad set and shifts delivery toward the ads it predicts will perform best.',
  adds="Rotate the losers, never the proven winners. A winner keeps running until the data says it's tired.",
  reason='An ad that has run for a while has collected likes, comments and shares, and that social proof lowers its cost per click. Refreshing everything on a calendar throws that away along with the ads that were actually tired.',
  less='Letting LinkedIn favour the strongest ads is the right default. It already moves delivery away from the weak ones, so most weeks there is nothing to change by hand.',
  signs=[('Frequency high, CTR holding', "Leave it. Winners keep the social proof they've built."),
         ('CTR down for one week', 'Check again next week.'),
         ('Frequency above target, CTR down two to three weeks running', 'Replace the weakest ads. Keep the winners.')],
  voices=[('AJ Wilcox', "“Falling CTR is the best indicator of fatigue in my mind. The frequency number is so opaque (you can't actually tell how often the most active audience members are being reached) that I use it as a precursor clue to what's happening, and then confirm with falling CTR. Sometimes CTR starts to fall even when frequency looks OK.”", 'Runs it differently'),
          ('Ivars Krutainis', '“Correct. I look for a trend of CTR dropping over several weeks.”', None)]),
 dict(n=4, slug='judge-awareness-formats-on-reach-and-cpm', cat='Reach and frequency', title='Judge Text, Spotlight and Follower ads on reach and CPM, not CTR',
  why='These formats are there for efficient visibility, so clicks are the wrong measure.',
  advises="Campaign Manager reports every format on the same metrics, so you choose which one fits each format's job.",
  adds='Single image and video carry the message and the ask. Text, Spotlight and Follower ads give low-cost presence under warm audiences, on a 180-day window. They also work as low-cost broad reach.',
  reason="Coverage formats cost a fraction of in-feed per thousand impressions. Judged on CTR they always lose, which is why many accounts switch off the cheapest way to stay visible across a long sales cycle. They're desktop-only and run alongside in-feed, never in place of it.",
  less='CTR is the right measure for in-feed formats whose job is the click: single image, video, document and carousel ads.',
  signs=[('Text ads with a tiny CTR and a high cost per click', 'Judge them on CPM, impressions and accounts reached.'),
         ('Coverage ads switched off over cost per lead', 'Turn them back on under warm audiences, or as low-cost broad reach, and measure them on reach.'),
         ('Coverage ads running on 90-day audiences', 'Move them to 180-day audiences.')],
  voices=[('AJ Wilcox', "“Very much agree with this. Also judge them by CPC, since they're so cheap. And judge Follower ads by cost per follow if company follows are actually the goal of the ad set.”", None),
          ('Ivars Krutainis', '“I use them less and less. They skew the total performance numbers (they lower CPM) but have minimal impact on overall campaign performance.”', 'Runs it differently')]),
 dict(n=5, slug='split-campaigns-only-when-a-segment-outperforms', cat='Who the budget reaches', title='Split campaigns only when one segment clearly outperforms the rest',
  why='A segment earns its own campaign by performing two to three times better or worse than the rest.',
  advises='Campaign Manager has built-in A/B tests for comparing audiences, creative and placements.',
  adds='Retargeting and cold both start broad. A split comes when a gap shows up in the data, not up front.',
  reason='Every split divides the budget and the creative work. Splitting early gives each campaign too little spend to learn from, so the segments that deserve their own budget never show themselves.',
  less='Once a segment stands out, a LinkedIn A/B test is the clean way to confirm it before you split the budget for good.',
  signs=[('One industry or size band is two to three times more efficient', 'Give it its own campaign, budget and message.'),
         ('Many small campaigns, none with much budget', 'Merge them. Split again when a segment stands out.'),
         ('The biggest companies on a list take most of the impressions', 'Split the list into company-size bands with their own budgets.')],
  voices=[('Bogdan Liutic', "“I'd add a floor before any split. Each part's ad set has to clear 300 member accounts, and its budget still has to pay for about 5 views a person a month. If it can't, keep it in one ad set.”", None)]),
 dict(n=6, slug='watch-for-budget-drifting-to-junior-roles', cat='Who the budget reaches', title='Watch for budget drifting to junior roles',
  why='Junior roles click more and cost less, so a campaign with mixed seniorities slowly shifts its budget to them.',
  advises='Seniority is a targeting option, and delivery is optimized toward the result you choose, such as clicks or leads.',
  adds="When delivery shows the drift, decision-makers get their own campaign and budget, so cheaper clicks can't take it.",
  reason='Junior researchers often click two to three times more than VPs, while VPs cost more per impression. Optimizing for the cheapest result follows whoever acts most, so a mixed audience drifts junior unless you split it.',
  less='One blended campaign is fine when every seniority in it can buy, or while the budget is too small to split (rule 05).',
  signs=[('Junior seniorities take a large share of impressions', 'Put decision-makers in their own campaign, with their own budget and bid.'),
         ('Cost per lead falling while the junior share rises', 'Check lead quality by seniority before calling it a win.'),
         ('Lead quality varies by seniority, all in one campaign', 'Split senior titles out so their budget is set on purpose.')],
  voices=[('AJ Wilcox', "“Where this is an issue, I like to break seniorities up into separate ad sets. LinkedIn can't cheat you by giving you too many junior folks in an ad set that's set up only for junior roles.”", None),
          ('Joshua Stout', "“Often it's not really a junior position but a practitioner or end-user role. For example, Data Architect and Data Scientist count as Entry in job seniority. ... I tend to segment by practitioners, their leaders (management or upper-level leadership), and then executives.”", None),
          ('Ivars Krutainis', "“Seniority isn't a reliable indicator. A specialist can sometimes be quite a senior decision-maker but still be tagged as a specialist. I rely more on specific job titles than on seniority.”", None)]),
 dict(n=7, slug='to-exclude-sdrs-exclude-sales', cat='Who the budget reaches', title='To exclude SDRs, exclude Sales, not Business Development',
  why='Excluding Business Development to remove SDRs removes the decision-makers too.',
  advises='Job function is a standard targeting option, and any function can be excluded.',
  adds='In our experience, founders, owners, CEOs and presidents of smaller companies sit under Business Development, while SDRs and BDRs sit under Sales. To exclude sales-floor roles, exclude Sales or junior seniorities, never Business Development.',
  reason="At smaller companies, founders, owners and CEOs often sit under Business Development in LinkedIn's job-function data, while SDRs and BDRs sit under Sales. Exclude Business Development to lose the SDRs and you lose the buyer at exactly the companies where the founder signs.",
  less="Excluding Business Development can be right when your buyers work at large companies, where BD teams aren't part of the deal.",
  signs=[('Business Development excluded to keep SDRs out', 'Exclude Sales, or junior seniorities in Sales, instead.'),
         ('Founder-led companies targeted by job title', 'Target the function with senior seniorities instead.'),
         ('You sell to sales leaders', 'Exclude junior seniorities in Sales, not the whole function, or you remove the buyer.')],
  voices=[('AJ Wilcox', "“This is super important, and LinkedIn doesn't make it clear, so most advertisers get it wrong. If I want to reach CEOs, presidents and owners, I'll use the Business Development job function with CXO seniority. If I want to reach business development folks, I'll use the Business Development function with the lower seniorities. I don't often exclude SDRs specifically, but I like the idea of excluding the Sales function, or even business development titles.”", None),
          ('Bogdan Liutic', "“Put job titles in an ad set and Campaign Manager won't let you exclude seniorities or functions at all. I hit ‘Job Seniorities may not be excluded when Job Titles is included.’ on my own account in September. So it's titles or those exclusions. You don't get both.”", None)]),
 dict(n=8, slug='check-who-your-ads-actually-reach', cat='Who the budget reaches', title='Check every month who your ads actually reach',
  why="Campaign totals don't show who the budget actually reached. LinkedIn's demographics report does.",
  advises='The demographics report in Campaign Manager breaks delivery down by seniority, job function, company size and more.',
  adds='Once a month, check the demographics report by seniority, function and company size, and read the last ten profiles that engaged or became leads.',
  reason='Targeting choices interact. An expansion setting, an overlapping attribute or a missed exclusion can widen delivery without anyone noticing, and a monthly look at the report plus ten real profiles catches it early.',
  less='If the report matches your targeting month after month, a quick look is enough.',
  signs=[("Company sizes or seniorities you didn't plan for", 'Fix the setting that widened delivery, then read ten engaged profiles.'),
         ('A function or seniority you never targeted shows up', 'Check Audience Expansion is set the way you meant, then exclude it.'),
         ('Totals look fine, so nobody checks', 'Open the demographics report once a month.')],
  voices=[('Bogdan Liutic', '“Open it by company too, not just by seniority and size. From 7 Aug to 5 Sep 2026, one of my ad sets got 49% of its clicks (350 of 708) from people listed at ‘Stealth AI Startup’, a placeholder page people pick instead of a real employer. Strike those out by exact name before you read any CTR.”', None),
          ('Ivars Krutainis', '“I check demographics weekly. Monthly is too slow to adjust.”', 'Runs it differently')]),
 dict(n=9, slug='count-an-audience-as-warm-only-once-it-can-serve', cat='Building the account', title="Count an audience as warm only once it's big enough to serve ads",
  why="Traffic and followers only count once they're in a matched audience big enough to run.",
  advises="Matched audiences only collect people from the day they're created, and need 300 members before they serve.",
  adds='Warm-first only applies to audiences that can serve today. A new account behaves like a cold one for its first weeks, even with real traffic. Create every audience on day one, and plan from the matched count, not the rows uploaded.',
  reason='Plenty of plans stall because they assumed warm audiences that existed in principle but not in the ad account. Checking what can actually serve fixes the pacing before any money goes in.',
  less='Starting with retargeting is right when the account already has matched audiences that can serve, or a CRM list to upload.',
  signs=[('A new account with no tag history plans to start with retargeting', 'Start cold to build the audience. Add retargeting once it can serve.'),
         ('A retargeting audience under about 1,000 members', 'Keep feeding it before you spend on it.'),
         ('A CRM or email list ready to upload', "Upload it on day one. It's warm right away. Plan from the matched count.")],
  voices=[('AJ Wilcox', "“I don't mind creating an ad set while the audience is still too small, because I know that as soon as it hits 300, LinkedIn can start serving impressions right away. Since it wasn't large enough to run before, there's no danger to reported traffic, followers or spend, because there wouldn't be any.”", None),
          ('Joshua Stout', "“I've always believed you start retargeting as soon as the audience is usable at 300. I want my ads in front of a prospect as early as possible. You can always start at $10 a day and increase the budget as the audience grows.”", 'Runs it differently'),
          ('Bogdan Liutic', "“A CRM or email contact has had a touchpoint with you, so it's not fully cold. But a dated signal beats familiarity. A company that just hired a new VP is warmer than someone you emailed a year ago. So I rank a fresh signal first and the familiar contact second.”", None)]),
 dict(n=10, slug='spend-on-warm-audiences-before-cold', cat='Building the account', title='Spend on warm audiences before cold ones',
  why='A colder audience earns budget once the warmer ones reach their frequency range.',
  advises='Budget is set per campaign, so the order you fund audiences in is up to you.',
  adds='Order: your own data first (CRM, past leads, site visitors, engaged accounts), then in-market search, then account lists built from signals, then broad targeting.',
  reason="Unused first-party data is the cheapest audience you'll ever have. Spreading a small budget across many cold campaigns gives each one too little to show anything. Cold still runs from month one in most accounts, because it builds the audience everything else draws from.",
  less='Funding cold first is right on a new account, before any warm audience can serve (rule 09).',
  signs=[('Most budget on cold while warm sits underused', 'Fund warm up to its frequency target first.'),
         ('More campaigns than the budget can support', 'Run fewer. About $20 a day per campaign is the floor for one to learn.'),
         ('Warm audiences at their frequency range', 'Open the next colder audience, in order.')],
  voices=[('Bogdan Liutic', "“Agree, fill warm first. When warm is full I add a second signal list from the same market, and the cold fit-only list carries whatever's left. I never widen a signal list just for size.”", None),
          ('Ivars Krutainis', "“I'd tend to disagree, as I get most of my results from cold audiences. Warm audiences get saturated very quickly for most clients, so the opportunity is in cold. I rarely spend more than 20–25% on retargeting and warm audiences.”", 'Runs it differently')]),
 dict(n=11, slug='start-lead-gen-forms-early', cat='Building the account', title='Start Lead Gen Forms early, then narrow them to recent engagers',
  why='Open the conversion layer as soon as a warm audience can serve, then tighten it to recent engagers.',
  advises="Lead Gen Forms pre-fill members' profile details, which makes them the easiest way to convert on LinkedIn.",
  adds='Start the form on the 90-day audience. Once the 30-day audience can serve, the form moves there and the 90-day audience gets nurture and trust content.',
  reason='Opening the conversion layer early starts offer testing sooner. Narrowing it later keeps the ask on people whose interest is recent.',
  less='A form to a cold audience can work for a light offer people want straight away, like a report or a checklist.',
  signs=[('Demo or sales-call offers running to cold audiences', 'Move the demo to warm. Give cold something lighter.'),
         ('Forms held back for a calendar date', 'Launch on the first warm audience that can serve: day one with a CRM list, usually weeks 4 to 8 on a cold start. Sync the form to the CRM the day it launches.'),
         ('One form running to the whole warm audience', 'Start on the 90-day audience, then move it to 30-day engagers once that can serve.')],
  voices=[('AJ Wilcox', "“So good! Especially with small budgets, I usually start with any retargeting audiences I can get my hands on, since we really need a large enough audience. But once that audience has grown and is actively serving, we know that someone who interacted with our ads yesterday is more likely to re-engage than someone who interacted 350 days ago. It's hard to remember to actually do, but it's such good practice to go back in and tighten the time window, so retargeting audiences hold only the most recent engagers, the people who can be expected to remember interacting with the brand.”", None)]),
 dict(n=12, slug='report-exposure-influence-attribution-separately', cat='From signal to sales', title='Report exposure, influence and attribution separately',
  why='Exposed, influenced and attributed are three different claims.',
  advises='Conversion tracking credits conversions inside the click and view windows you set. LinkedIn also offers revenue attribution reporting for CRM-connected accounts.',
  adds='Use the lowest word the evidence supports. Leave out renewals and existing customers before claiming influence on new business. Report the three as separate numbers, never added together.',
  reason='B2B deals take longer than any click window, so last touch undercounts LinkedIn. Overclaiming wins one meeting and loses the next. A smaller number you can defend lasts longer.',
  less='Conversion windows are the right tool for comparing campaigns with each other, and for short cycles where the deal closes inside the window.',
  signs=[('An account saw your ads', 'Report it as exposed.'),
         ('Months of impressions before the deal was created', 'Report it as influenced, with the dates beside the deal date. Leave renewals and existing customers out.'),
         ('A tracked click or conversion ties LinkedIn to the deal', 'Report it as attributed, on its own line.')],
  voices=[('Bogdan Liutic', '“If you want to say caused, hold out about 100 companies with a signal that get no ads and no messages all quarter. Report meetings as two counts with both group sizes, never a percentage, because a percentage on half a meeting means nothing.”', None),
          ('Ivars Krutainis', '“Yes, but in practice every client has their own take on what counts as influenced.”', None)]),
 dict(n=13, slug='give-sales-a-weekly-ranked-list', cat='From signal to sales', title='Give sales a weekly ranked list of warm accounts, checked against the CRM',
  why='Hot accounts, ranked, with who engaged and where they sit in the CRM. Never a raw visitor feed.',
  advises='The Company Engagement Report in Campaign Manager shows which companies are engaging with your ads, and how much.',
  adds='Filter to ICP fit, then rank by how many people and roles engaged over time. Check the CRM before sales touches anything. Open deals go to their owner, customers to their account manager, new accounts to SDRs.',
  reason="Outreach on a single signal reaches good accounts at the wrong moment, and an SDR pitching an account that's mid-deal embarrasses everyone. Context turns a signal into a reason to reach out.",
  less='For a short account list with one owner, the Company Engagement Report can be enough on its own to brief sales.',
  signs=[('One visit, or one intent spike', 'Watch list, until more signals follow.'),
         ('Two or more people in different roles at one account, back for pricing or case studies', "Top of this week's list, with who engaged and what they read."),
         ('A warm account with an open deal', 'Send it to the deal owner. Keep SDRs off it.')],
  voices=[('Bogdan Liutic', '“Count companies on your list, not clicks or people. My default line is 10 or more paid engagements in 30 days, or 3 plus a second signal, and a company with an open deal goes to the deal owner. When someone writes, they name the public signal, never the ad, the click or the visit.”', None),
          ('Ivars Krutainis', '“Yes, big fan. We report the list of engaged companies weekly for sales to follow up.”', None)]),
 dict(n=14, slug='grow-a-signal-list-from-the-same-market', cat='Who the budget reaches', author='Bogdan Liutic', title='Grow a signal list by adding signal lists from the same market',
  why="LinkedIn's audience size guidance fits audiences built from filters. A list built from buying signals starts smaller and grows a different way.",
  advises='An ad set needs at least 300 members to run. To drive results, LinkedIn recommends larger audiences: 50,000 members, and 300,000 for Sponsored Content.',
  adds='Those sizes fit audiences built from targeting filters. A signal list starts smaller, around 1,000 companies and 5,000 to 10,000 people. Grow it by adding signal lists from the same market, and leave fit-only companies in the cold layer. Never widen a signal list just to hit a size.',
  reason="A signal list is small because it's specific: these companies have a reason to buy now. Pad it with companies that only fit, and delivery spreads across them while the signal companies see you less.",
  less="For broad demand generation built from targeting filters, LinkedIn's sizes are a fair target.",
  signs=[("A signal list well under LinkedIn's suggested size", 'Run it once it clears 300 members. Add signal lists from the same market to grow it.'),
         ('A signal list padded with fit-only companies to reach a size', 'Move them out to the cold layer.'),
         ('A market too small to fill even one signal list', 'Check the market is big enough for paid LinkedIn before you build more lists.')],
  voices=[('Bogdan Liutic', "“My lists start at 1,000 companies, and 10,000 is better. I get to LinkedIn's number by adding signal lists from the same market. My floor is the market: at least 10,000 decision-makers and deals worth $10,000 or more.”", None)]),
 dict(n=15, slug='judge-cold-ads-by-the-warm-audience-they-build', cat='Ads and creative', title='Judge cold ads by the warm audience they build',
  why="A cold ad's real output is the people who engage with it, because they become your retargeting audience. Leads from cold are a bonus.",
  advises='Campaign Manager reports cold and retargeting campaigns on the same metrics, and lets you build retargeting audiences from video viewers and ad engagers.',
  adds='Measure cold in-feed on reach into your target accounts and on cost per new engager or video viewer. Build cold creative to earn that engagement, with video and document ads people can watch or read without leaving the feed.',
  reason='People rarely convert the first time they see a brand, so a cold campaign judged on leads looks like a failure and gets cut. When it goes, the retargeting audiences it was filling stop growing, and a few weeks later the warm campaigns run out of people.',
  less='Cost per lead is a fair verdict for a cold campaign built to convert on first contact, like a light content offer on a Lead Gen Form (rule 11).',
  signs=[('A cold campaign paused for a high cost per lead', 'Count the engagers, viewers and engaged accounts it added before you write it off.'),
         ('Cold ads asking for a form fill or a demo', 'Lead with something to watch or read. Keep the ask for warm (rule 11).'),
         ('90-day engager and viewer audiences stopped growing', 'Refresh the cold creative or open a new segment.')],
  voices=[('AJ Wilcox', '“Love this concept! One of my skills is going to play into this. I measure cold ad sets by very different standards than my warm stages. For cold, I calculate a metric called Cost Per Retargetable Member (CPRM), which measures how much it costs per member of my retargeting audience.”', None),
          ('Bogdan Liutic', "“Agree, with one catch. One of my ad sets ran on a company list built from engagement data plus LinkedIn's own engaged-companies segment, and it got 49% of its clicks from people listed at ‘Stealth AI Startup’. So strip placeholder pages before an engager audience becomes your retargeting list.”", None)]),
]
R = {}
for r in RULES:
    R[r['n']] = f"rule-{r['slug']}"
    docs.append({'_id': R[r['n']], '_type': 'rule', 'number': r['n'], 'title': r['title'], 'why': r['why'], 'area': cat(r['cat']),
                 'author': ref(A[r.get('author', 'DemandSense')]), 'featured': False, 'cover': (r['n'] * 7) % 20 + 1,
                 'slug': {'_type': 'slug', 'current': r['slug']},
                 'page': {'advises': {'text': r['advises'], 'source': 'LinkedIn Campaign Manager'}, 'adds': r['adds'], 'reason': r['reason'], 'mattersLess': r['less'],
                          'signs': keyed([{'see': s, 'do': d} for s, d in r['signs']]),
                          'voices': keyed([{'name': nm, 'author': ref(A[nm]), 'company': COMPANY[nm], 'quote': q, **({'note': note} if note else {})} for nm, q, note in r['voices']])}})

# Skills. GitHub skills (DemandSense, ready): title, folder, category, description, input files, output
GH = 'https://github.com/demandsense-labs/linkedin-ads-skills/tree/main/'
DS_SKILLS = [
 ('No-Deal Warm Leads Finder', 'no-deal-warm-leads-finder', 'From signal to sales', 'Finds companies that engage with your LinkedIn ads or website but are not customers and have no open deal, so sales knows who to call. Screens out agencies, schools and noise, and ranks the rest in tiers.', 'LinkedIn Companies export (last 90 days). Website visitors-by-company export from your visitor identification tool (optional, recommended). CRM companies and deals exports.', "A ranked top-20 list in tiers (companies engaged on both channels first), a short 'check by hand' list, and the full list as a CSV when it is long."),
 ('Silent Watchers Finder', 'silent-watchers-finder', 'Reach and frequency', 'Finds companies that saw your LinkedIn ads in each of the last three months but never clicked, engaged, visited the site or entered the CRM, so you can test a different message or suppress them.', 'LinkedIn Companies exports for the last 30, 60 and 90 days, all taken on the same day with no filters. Website visitors export and CRM companies export (optional).', "A top-20 table with impressions per month and a trend (rising, steady, fading), a 'check by hand' list, a suggested next step, and the full list as a CSV."),
 ('Account Health Check', 'account-health-check', 'Building the account', 'Audits your marketing account and lists what to fix first: data freshness, delivery, structure, results, tracking and the link between engaged companies and the CRM.', 'LinkedIn campaign exports (last 30 days, the 30 days before, and 90 days if possible). Website sessions export by source, medium and campaign. CRM companies and deals exports. LinkedIn Companies export.', 'A prioritised list of at most 10 items (P1 fix now, P2 this month, P3 tidy-up), each with evidence, the fix and the expected impact, plus what could not be checked.'),
 ('CRM Data Health Check', 'crm-data-health-check', 'From signal to sales', 'Checks whether your CRM pipeline data can be trusted: missing or contradictory fields, deal hygiene, win rate by source and industry, and how win rate and sales speed have trended.', 'CRM companies export and CRM deals export (HubSpot, Salesforce, Attio or similar), ideally 12 months or more of history.', "A scorecard of checks (OK, watch, broken, can't check) with counts, the five most important problems with fixes, win rate by source and industry, and a monthly win-rate trend."),
 ("Who's Looking at Your Buying Pages", 'whos-looking-at-your-buying-pages', 'From signal to sales', 'Shows who recently visited your high-intent pages (pricing, demo, contact, trial), at the level your visitor tool allows, ranked by seniority and checked against the CRM, with a light first step for the top few.', 'Website visitor export from an identification tool (last 14 days, person or company level). CRM companies and deals exports. Your website address and the buying-page URLs you care about.', 'A table of plausible buyers (title, company, pages viewed, latest visit, CRM status), poor-fit visitors in one line each, counts, and first steps for the top few.'),
 ('Creative Decay Watchlist', 'creative-decay-watchlist', 'Ads and creative', 'Finds LinkedIn ads whose click-through rate has slid for several weeks, tells you whether the ad or the whole campaign is the cause, and lists ads that improved with age and should be kept.', "LinkedIn Ad performance export, last 120 days, daily breakdown, with format and video columns. Each campaign's average frequency over 90 days from LinkedIn's campaign report.", "Summary counts that add up, a coverage-format table, flagged, watchlist and keep lists with the week the decline started, and a CSV for long 'too little data' lists."),
 ('Video Quality Check', 'video-quality-check', 'Ads and creative', 'Ranks your LinkedIn video campaigns by how many viewers actually finish the video and by cost per completed view, and flags unusually high rates for checking.', 'LinkedIn ad set performance export (last 90 days) with the video columns: views, completions, impressions, clicks, spend. Optional: ad-level export.', 'A ranking by completion rate per view and by cost per completed view, odd rates separated, the best and worst ad per campaign, and capped recommendations.'),
 ('Waste Budget Detection', 'waste-budget-detection', 'Who the budget reaches', 'Finds LinkedIn campaigns that spent money in the last 30 days without producing what they were built for, and says what to pause or fix first.', 'LinkedIn ad set exports for the last 30 days and the 30 days before: status, objective, budget, spend, clicks, leads, conversions.', 'Live waste candidates ranked by spend (pause or fix), ad sets already stopped, too new or too thin, a tracking check, and campaigns that are not built to produce leads.'),
 ('Campaign Group Scoreboard', 'campaign-group-scoreboard', 'Building the account', 'Ranks your LinkedIn campaign groups by efficiency and shows the two best campaigns in each group.', 'LinkedIn ad set performance export for the date range, with the campaign group, ad set, status, spend, clicks, engagement and leads.', "A scoreboard of groups (cost per lead and cost per click ranked separately), each group's share of spend and leads, top two campaigns per group, and observations."),
 ('Market Benchmark Comparison', 'market-benchmark-comparison', 'Building the account', 'Compares your LinkedIn campaigns with a published market benchmark and shows where you are strong and where you need to improve, campaign group by campaign group.', 'LinkedIn ad set performance export (last 90 days) and your industry. The assistant finds and names a published benchmark, or you can supply one. Optional: the previous period.', 'The benchmark source and how well it fits, a per-group comparison table (ahead, near, behind), strengths and gaps, and capped recommendations.'),
 ('Manager Monthly Report', 'manager-monthly-report', 'Building the account', 'Prepares a monthly LinkedIn performance report with what to optimise, what to stop and how you compare with the market.', 'LinkedIn ad set exports for the month and the previous month, and the ad performance export for the month. Optional: CRM export and a benchmark source.', 'A report with headline, totals against last month, campaigns by funnel job, best and weakest ads, up to six optimisations, a stop list, a benchmark section and next-month actions.'),
 ('Pausing Low-Performing Ads', 'pausing-low-performing-ads', 'Ads and creative', 'Analyses the ads of one LinkedIn campaign, finds the best ad and the ads worth stopping, and shows the statistical basis for each call.', 'LinkedIn ad performance export for one campaign (default last month or 90 days): impressions, clicks, spend, leads or conversions.', 'The best performer, stop candidates with the significance test, ads to keep, ads with not enough data, and what more data would settle them.'),
 ('Weekly Reporting', 'weekly-reporting', 'Building the account', 'Prepares a weekly breakdown by campaign across LinkedIn, Google Ads and Meta, with week-over-week changes and the main drivers.', 'Daily campaign exports for each platform for the last three weeks (spend, impressions, clicks, conversions or leads, currency). Optional: website sessions export.', 'Per-platform weekly tables, the drivers of the biggest changes (budget, price or response), flags such as tracking drops, and up to five next steps.'),
 ('Capping Recommendation', 'capping-recommendation', 'Reach and frequency', 'Shows how many times your ads reach the same companies and recommends impression caps and an exclusion list to avoid overexposure.', 'LinkedIn Companies export (last 90 days) and the ad set export with reach, frequency and audience penetration for the same period.', 'Exposure distribution, response by exposure band, recommended caps with the share of impressions they would redirect, an over-exposed company list (CSV) and how to apply it.'),
 ('Pacing Check Against Schedule', 'pacing-check-against-schedule', 'Building the account', 'Checks whether each LinkedIn campaign is spending in line with its daily budget and schedule, and says what to do about the ones that are not.', 'LinkedIn ad set export (status, start date, daily budget, spend, impressions) and a daily breakdown export so delivery days can be counted.', 'A pacing table (expected against actual spend, ratio, status, recommendation), the three biggest gaps in money, dark and paused campaigns.'),
 ('Budget Re-allocation', 'budget-re-allocation', 'Building the account', 'Builds a plan to move LinkedIn budget from ended or paused campaigns to the campaigns that earn it.', 'LinkedIn ad set export for the last 90 to 180 days with all statuses, budgets, spend and results. Your goal and, if fixed, your monthly budget.', 'Ended campaigns and the budget they free, a reallocation plan (from, to, amount, estimated impact, risk, confirming number), where not to add money, and a two-step sequence.'),
 ('Account Engagement', 'account-engagement', 'From signal to sales', 'Shows which companies engage with your LinkedIn ads and website and how that engagement ties to the CRM pipeline: warm accounts, engaged accounts in pipeline, and the gap list of engaged companies missing from the CRM.', 'LinkedIn Companies export (last 90 days). Website visitors-by-company export. CRM companies and deals exports.', 'Counts by how companies engaged and by pipeline bucket, a top-25 table, the gap list, customers shown separately, firmographics where a file has them, and recommendations.'),
 ('Ad-Hoc Query', 'ad-hoc-query', 'Building the account', 'Answers open-ended ad performance questions: how did we do, what changed, trends, campaign breakdowns, budget pacing, video and lead form completion, campaign groups, pipeline and win rate.', 'The platform exports the question needs (LinkedIn, Google Ads, Meta; daily or campaign level) and, for pipeline questions, a CRM deals export.', 'The answer first with the window and source columns, a table where useful, what it means, and what to check next.'),
 ('Benchmark Comparison', 'benchmark-comparison', 'Building the account', 'Places individual LinkedIn metrics (CTR, CPC, CPM, cost per lead and more) inside a published benchmark range, using the comparison group that fits your account.', 'LinkedIn ad set export (last 90 days), your industry and the metrics you ask about. A benchmark source is found and named by the assistant, or you supply one.', 'The benchmark source and fit, your account profile, a table of metric against benchmark with the position read by direction, both time windows, and capped recommendations.'),
 ('LinkedIn ABM Account Penetration', 'linkedin-abm-account-penetration', 'Reach and frequency', 'Shows which of your target accounts engage with your LinkedIn ads, at what level, whether they are in the CRM, and which show no recorded activity.', 'Your target-account list (CSV). LinkedIn Companies export (last 90 days). Optional: CRM companies export and the ad set export for audience penetration.', 'Match rates, accounts engaging by level (not a reach percentage), paid against organic, coverage gaps, CRM status, audience penetration per ad set, and recommendations.'),
 ('LinkedIn Audience Demographics', 'linkedin-audience-demographics', 'Who the budget reaches', 'Describes who your LinkedIn ads reach and who responds, by seniority, job function, job title, industry, company size and location.', 'The Campaign Manager Demographics report for the period (one file with ten tables). For response comparisons, an export limited to in-feed campaigns.', 'Shares and response indexes by segment, who you reach, who responds more or less than their share, a campaign-mix caveat, and capped recommendations.'),
 ('LinkedIn Benchmark Context', 'linkedin-benchmark-context', 'Building the account', 'Compares your LinkedIn performance with your own history first and with market benchmarks second.', 'Monthly LinkedIn ad set exports for the last 3 to 6 months, your industry, and optionally a benchmark source.', 'Your latest month against the earlier average, best and worst month, cost per lead two ways, a market comparison table, a plain-words verdict and capped recommendations.'),
 ('LinkedIn Creative Performance', 'linkedin-creative-performance', 'Ads and creative', 'Ranks your LinkedIn ads by the measure that fits their job, including video completion and lead form completion, and shows pause candidates checked inside each campaign.', 'LinkedIn Ad performance export (default last 30 days, 90 for video and lead forms) with ad ID, campaign, spend, impressions, clicks, leads, lead forms opened and video columns.', 'A ranking table, video and lead form tables when asked, pause candidates with per-campaign checks and counts, and capped recommendations.'),
 ('LinkedIn Performance KPIs', 'linkedin-performance-kpis', 'Building the account', 'Reports LinkedIn spend, CTR, CPC, CPM, cost per lead and more for a period against the previous period, broken down by campaign, group, objective, format or status, with pacing.', 'LinkedIn ad set exports for the period and the previous period of the same length. A daily export for trends and pacing.', 'A KPI table with changes, cost per lead account-wide and on lead generation only, breakdown tables, where the money went, and capped recommendations.'),
 ('Multichannel Performance Rollup', 'multichannel-performance-rollup', 'Building the account', 'Combines the exports of several ad platforms into one honest view: spend and results per channel, what can be added together and what cannot, and paid spend next to CRM pipeline.', 'One export per platform for the same dates (LinkedIn, Google Ads, Meta, others) with the billing currency of each account. Optional: CRM deals export.', 'A channel table with currencies, totals only where currencies match, results side by side with definitions, pipeline next to spend, and capped recommendations.'),
 ('Traffic Analysis', 'traffic-analysis', 'Building the account', 'Shows where website traffic comes from (paid, organic, email, referral, direct), compares it with the previous period, breaks paid traffic down by platform and campaign, and checks how clean your UTM tagging is.', 'Web analytics sessions export with date, source, medium, campaign and sessions, for the last 30 days and the 30 days before. Your own domains.', 'A channel table with change against the previous period, an Other/Unclassified list, a tagging check with exact values and counts, and capped recommendations.'),
]
# Expert skills from the contributors directory, not on GitHub yet: title, author, category, description, steps, output, runs on
EXPERT_SKILLS = [
 ('Landing-page CPC report', 'Ivars Krutainis', 'Ads and creative', 'Ranks campaigns by what each website visit really costs (spend divided by landing-page clicks), so formats can be compared like for like.',
  [('Pull the numbers', 'Get spend, clicks and landing-page clicks per campaign for a date range. Stop if there are no landing-page clicks.'),
   ('Keep campaigns that spent', 'Lead Gen Form campaigns go in a separate block.'),
   ('Work out the costs', 'Landing-page CPC, regular CPC and the share of clicks that reach the site.'),
   ('Sort', 'Best to worst. Campaigns with no site clicks go last.'),
   ('Roll up', 'Blended totals for the account and a rollup by format (Thought Leader, image, video, Spotlight).'),
   ('Show the totals', 'Print the totals used, so they can be matched against Campaign Manager.')],
  'A dashboard with landing-page CPC as the main number, a bar chart by campaign, a format rollup and the full table. No recommendations in v1.', 'LinkedIn API or a Campaign Manager export. DemandSense MCP later.'),
 ('Lowest bid that still spends the budget', 'AJ Wilcox', 'Building the account', "Finds the lowest manual bid that still spends the full daily budget, because a higher bid doesn't buy a better audience.",
  [('Export', 'Export ad data by day.'),
   ('Check two days', 'On Wednesday, check average daily spend for Monday and Tuesday. On Monday, check last Thursday and Friday.'),
   ('Lower the bid', 'If average spend is at or above the daily budget, lower the bid.'),
   ('Repeat', 'Repeat after each bid change until the bid just barely spends the budget.')],
  'A bid recommendation per ad set.', 'Campaign Manager daily export.'),
 ('Cost per retargetable member', 'AJ Wilcox', 'Ads and creative', 'Measures cold ad sets by what it costs to add each person to your retargeting audience, to find the most efficient ad type and objective.',
  [('Pick the action', 'Pick the retargeting action each cold ad set feeds (for example 50% video viewers or document engagers).'),
   ('Divide', 'Divide cost by the number of those actions.'),
   ('Compare', 'Compare ad type and objective combinations and track them over time.')],
  "Cost per retargetable member per ad set and format. AJ's example: video Thought Leader ads around $0.50, static about twice that.", 'Campaign Manager export.'),
 ('Retargeting guardrails', 'AJ Wilcox', 'Who the budget reaches', "Adds exclusions to website and company page retargeting, so job seekers, students and people selling to you don't use up the budget.",
  [('Export', 'Export the demographics report of the retargeting audience.'),
   ('Flag', 'AI flags segments outside the target audience.'),
   ('Exclude', 'Add exclusions, for example the Marketing and Sales functions, or a Manager-and-above seniority floor.')],
  'A list of suggested exclusions for each retargeting audience.', 'Campaign Manager demographics export.'),
 ('Matched audience lists', 'AJ Wilcox', 'Building the account', "Formats any company or contact list into LinkedIn's matched audience upload templates.",
  [('Save the templates', "Save LinkedIn's company and contact CSV templates."),
   ('Give AI the inputs', 'The templates, the source list and how to fill each column.'),
   ('Upload', 'Get an upload-ready CSV. Contact lists hold personal data, so AJ processes them with a local model only.')],
  'An upload-ready CSV for LinkedIn.', "Your own lists plus LinkedIn's templates."),
]
SKILL_RULES = {'creative-decay-watchlist': [3], 'capping-recommendation': [1], 'linkedin-audience-demographics': [8], 'cost-per-retargetable-member': [15]}

def connectors(text):
    t = text.lower(); out = []
    if 'linkedin' in t or 'campaign manager' in t: out.append('connector-linkedin-ads-export')
    if 'crm' in t: out.append('connector-crm-export')
    if 'google ads' in t: out.append('connector-google-ads')
    if 'meta' in t: out.append('connector-meta-ads')
    if 'web analytics' in t: out.append('connector-google-analytics')
    if 'csv' in t: out.append('connector-csv-export')
    if 'demandsense' in t: out.append('connector-demandsense-optional')
    return refs(out)

def prompt(title, folder):
    base = f'Load the {title} skill from {GH}{folder} and run it on '
    return {'headline': 'Paste it into your AI.', 'context': 'Attach your exports first. It reads them and changes nothing',
            'tabs': keyed([{'label': 'Your exports', 'text': base + 'the exports I’ve attached.'},
                           {'label': 'DemandSense', 'text': base + 'my DemandSense workspace. Pull the data through the connector rather than asking me for exports.'}]),
            'source': GH + folder}

S = {}
order = 0
for title, folder, c, desc, inputs, output in DS_SKILLS:
    order += 1; S[folder] = f'skill-{folder}'
    docs.append({'_id': S[folder], '_type': 'skill', 'title': title, 'description': desc, 'area': cat(c), 'author': ref(A['DemandSense']),
                 'status': 'ready', 'order': order, 'cover': (order * 3) % 20 + 1, 'changes': 'Reads your data, changes nothing',
                 'slug': {'_type': 'slug', 'current': folder}, 'connectors': connectors(inputs + ' demandsense'),
                 'rules': refs([R[n] for n in SKILL_RULES.get(folder, [])]),
                 'page': {'does': {'headline': 'It reads your exports.', 'context': 'And changes nothing in your accounts.',
                                   'body': [f'You bring: {inputs}', f'You get back: {output}']},
                          'prompt': prompt(title, folder)}})
for title, author, c, desc, steps, output, runs in EXPERT_SKILLS:
    order += 1; s = slug(title); S[s] = f'skill-{s}'
    docs.append({'_id': S[s], '_type': 'skill', 'title': title, 'description': desc, 'area': cat(c), 'author': ref(A[author]),
                 'status': 'next', 'order': order, 'cover': (order * 3) % 20 + 1, 'changes': 'Reads your data, changes nothing',
                 'slug': {'_type': 'slug', 'current': s}, 'connectors': connectors(runs),
                 'rules': refs([R[n] for n in SKILL_RULES.get(s, [])]),
                 'page': {'does': {'headline': 'What it does.', 'context': desc, 'body': [f'Runs on: {runs}', f'You get back: {output}']},
                          'steps': keyed([{'title': t, 'text': x} for t, x in steps])}})

# Scenarios: contributors directory (Skills and scenarios tab); the four with a GitHub folder are ready
CADENCES = {'Daily to monthly': 7, 'Every 1 to 2 weeks': 8, 'Daily, then weekly': 9, 'On demand': 10}
for t, o in CADENCES.items():
    docs.append({'_id': f'cadence-{slug(t)}', '_type': 'cadence', 'title': t, 'order': o, '_create': 'ifNotExists'})
SCENARIOS = [
 dict(title='Warm-lead handoff', author='Justin Rowe', cat='From signal to sales', cadence='Weekly', folder='warm-lead-handoff',
  desc='Turns engagement from LinkedIn ads, the website and the CRM into a short list of who sales should call this week.',
  steps=[('Clean the signal', 'Remove your own company, competitors, ISPs, bots, and capped or stale exports.'),
         ('Fit and rank', 'Keep accounts that fit your ICP and rank them by how warm they are.'),
         ('Match to the CRM', 'Customers go to their owner as expansion, open deals to the deal owner, new accounts to the SDR queue.'),
         ('Hand off', 'Write a one-line handoff per account: who, what they read, which ad, who owns it.')],
  get='An "Act now" list with a one-line handoff for each account, customers engaging, open deals reached, closed-lost to re-engage, an ad exclusion list, up to five recommendations and the full list as a CSV.',
  need='LinkedIn Companies export, website visitors by company, CRM exports. Or the DemandSense MCP.', rules=[8, 12, 13]),
 dict(title='Account audit by cadence', author='Roman Slobodzianyk', cat='Building the account', cadence='Daily to monthly', folder='account-audit-by-cadence',
  desc='Runs eight account checks on a schedule, so a LinkedIn Ads specialist knows what to fix today, this week and this month.',
  steps=[('Daily: read and flag', 'Bidding and delivery, how ads engage, acquisition costs, audience saturation (frequency per person over 30 and 90 days).', 'Daily'),
         ('Weekly: adjust', 'Bid and pacing adjustments, week-over-week trends, delivery fixes.', 'Weekly'),
         ('Every two weeks: fatigue and pacing', 'Ad fatigue (pause, scale, new tests with 2 to 3 variations per ad set) and a pacing check against the monthly target (within 5%).', 'Every two weeks'),
         ('Monthly: move the budget', 'Review the budget and move it between campaigns, ad sets and funnel stages.', 'Monthly'),
         ('Approve', 'Every change is a recommendation the specialist approves and applies in Campaign Manager.', None)],
  get='Daily flags plus an action list for each cadence, every item waiting for approval.', need='Campaign Manager exports. Or the DemandSense MCP.', rules=[]),
 dict(title='Targeting vs who actually buys', author='George Coudounaris', cat='Who the budget reaches', cadence='Weekly + monthly', folder='monthly-targeting-review',
  desc='Compares who each campaign paid to reach with the people on your deals, and moves budget toward the profiles that buy.',
  steps=[('Job title audit', "Who each campaign paid to reach, graded against that campaign's own targeting.", 'Monthly'),
         ('Read the deal side', "The buying-committee list is the base, titles on deal contacts are evidence (they're often patchy).", 'Monthly'),
         ('Group deals by profile', 'Pipeline created, win rate, deal size.', 'Monthly'),
         ('Spend against pipeline', "Compare each profile's share of spend with its share of pipeline. Flag profiles that get too much budget, too little, or never convert.", 'Monthly'),
         ('Recommend', 'Targeting, exclusion and budget changes per campaign. Before cutting a title, check whether it sits in an account showing buying signals.', 'Monthly'),
         ('Light check', 'Is new spend leaking to off-target titles?', 'Weekly')],
  get="Spend vs pipeline per buyer profile, changes per campaign and an exclusion list that's safe to apply.", need='Campaign Manager demographics export plus CRM deals. Or the DemandSense MCP.', rules=[]),
 dict(title='Company-level account routing', author='Joshua Stout', cat='Who the budget reaches', cadence='Every 1 to 2 weeks', folder='company-account-routing',
  desc='Shows which companies take most of the impressions, which are underserved, and which to prioritize or move into their own audience.',
  steps=[('Coverage', 'Which companies get most of the impressions, which are underserved, and whether the campaign reaches the companies it meant to target.'),
         ('Engagement', "Which companies engage, which don't, and how that changes over time. Flag accounts for retargeting or sales outreach."),
         ('Spend check', 'Is the campaign spending on existing customers, closed-lost or open-deal accounts?'),
         ('Recommend', 'Dynamic exclusion audiences, dedicated campaigns for some accounts, or more segmentation.'),
         ('Review before any change', "Check every recommendation against the ICP, account priorities and strategy. Nothing is excluded automatically.")],
  get='A coverage and engagement view per campaign and a list of recommendations the advertiser decides on.', need='LinkedIn Companies tab export. Or the DemandSense MCP.', rules=[]),
 dict(title='LinkedIn fit gate + daily fit check', author='Jonathan Belliveau', cat='Who the budget reaches', cadence='Daily, then weekly', folder=None,
  desc='Grades a prospecting campaign by the companies it actually reached against your ICP, then says scale, run one more week, or rebuild.',
  steps=[('Set the gate', 'Before launch, once: countries, employee range, one buyer signal (for example "runs paid ads") and exclusions (own domain, customers, open deals, competitors).'),
         ('Pull the companies', 'The companies one campaign reached.'),
         ('Clean domains', 'Any excluded company that was reached is a "leaked exclusion" and goes to the top.'),
         ('Apply the gate', 'Check each domain in the fit source (Apollo, CRM or a CSV).'),
         ('Grade', 'Fit rate and spend-weighted fit. Once 500 companies are graded: 80%+ scale, 70 to 80% one more week with tighter exclusions, under 70% rebuild.'),
         ('Daily check', 'Compare with yesterday (new companies, new fails, new leaks, fit trend) and update the exclusion list.')],
  get='A one-line status, fit rate, fail reasons, a verdict and an exclusion CSV to upload to LinkedIn.', need='DemandSense MCP plus Apollo, CRM or a CSV.', rules=[]),
 dict(title='Signal loop', author='Bogdan Liutic', cat='From signal to sales', cadence='Weekly + monthly', folder=None,
  desc='Turns a list of target companies, sorted by dated public buying signals, into a Monday short list of who to write to this week and why now.',
  steps=[('Signal list check', 'Split the target list into A (2+ fresh signals), B (1 signal) and C (fit only). Hold out 100 B companies with no ads all quarter.', 'Monthly'),
         ('Placeholder page check', 'Strike clicks from fake employer pages like "Stealth AI Startup".', 'Every Monday'),
         ('List dose check', 'Is each list still reaching new people? About 5 views a person a month on warm lists.', 'Every Monday'),
         ('Warm account router', 'Alert at 10+ paid engagements in 30 days, or 3 plus a second signal. Open deals go to their owner. Up to 5 cards a week.', 'Every Monday'),
         ('A person writes', 'A person approves each card and writes from their own account. Messages name the public signal only, never the ad or the visit.', 'Every Monday'),
         ('Retrain', 'Check which signals sat on won deals and retrain the lists.', 'Quarter end')],
  get='A, B and C lists with LinkedIn upload files, names to exclude, up to 5 outreach cards a week and a CRM hand-off CSV.', need='Campaign Manager exports plus your own CSVs. The DemandSense MCP adds engagement, visits, CRM status and lead forms.', rules=[2, 8, 13, 14]),
 dict(title='Turn social signals into pipeline', author='Alfredo Talib', cat='From signal to sales', cadence='On demand', folder=None,
  desc='Takes people engaging with relevant LinkedIn posts, adds what their companies do on your site and with your ads, and splits them into a sales list and a nurture list.',
  steps=[('Pick the source', 'Posts anywhere on LinkedIn (Cornersight), your company page (DemandSense), or both.'),
         ('Collect', 'Collect the engagers and group them by company.'),
         ('Add signals', 'Website sessions, pricing or demo page views, ad engagement level per company.'),
         ('Fit', 'Keep companies that fit the ICP.'),
         ('Split', 'Sales review = ICP fit + organic signal + a website visit or high ad engagement. Everyone else goes to nurture.'),
         ('CRM check', 'Optional: companies already in pipeline go to the deal owner.')],
  get='Two lists (sales review and nurture) with a one-line reason per company. Nothing is written to any tool.', need="Cornersight plus the DemandSense MCP. Or Cornersight's export plus visitor and Companies tab exports.", rules=[]),
 dict(title='Weekly check for conversion campaigns', author='Moby Hayat', cat='Ads and creative', cadence='Weekly', folder=None,
  desc='Judges every Lead Gen Form and Message ad against your goal cost per lead, pauses losers early and builds new versions from the winners.',
  steps=[('Scope', 'Lead gen and Message campaigns that spent in the last 7 days. Skip any without a goal cost per lead.'),
         ('Ads with no leads', 'Flag pause once the ad has spent 2x the goal cost per lead.'),
         ('Ads with leads', "Flag pause when cost per lead reaches 1.5x the campaign's baseline."),
         ('Winners', 'Ads at or under goal. The top 2 become the source for new versions with the same offer.'),
         ('Check the campaign', 'If every ad is expensive: delivery (spend vs daily budget, manual bid), audience size (penetration under 10% means budget too small or audience too big, 20%+ is ideal) and audience quality.'),
         ('Recommend', 'One recommendation per flagged ad or campaign, each approved by the specialist.')],
  get='A pause list, winners to copy and campaign fixes, each with the number behind it and the number that shows it worked next week.', need='Campaign Manager exports (ads by day, campaign penetration and frequency, settings). Or the DemandSense MCP.', rules=[]),
]
for i, s in enumerate(SCENARIOS, 1):
    sl = slug(s['title'].replace('+', ''))
    if s['title'].startswith('LinkedIn fit gate'): sl = 'linkedin-fit-gate'
    page = {'steps': keyed([{'title': st[0], 'text': st[1], **({'phase': st[2]} if len(st) > 2 and st[2] else {})} for st in s['steps']])}
    if s['folder']:
        base = f"Load the {s['title']} scenario from {GH}{s['folder']} and run it on "
        page['get'] = {'intro': 'Paste one prompt.', 'context': 'It reads your exports and changes nothing',
                       'options': keyed([{'label': 'Your exports', 'text': base + 'the exports I’ve attached.'},
                                         {'label': 'DemandSense', 'text': base + 'my DemandSense workspace. Pull the data through the connector rather than asking me for exports.'}]),
                       'source': GH + s['folder'], 'sourceNote': 'Skill folder on GitHub'}
    docs.append({'_id': f'scenario-{sl}', '_type': 'scenario', 'title': s['title'], 'description': s['desc'], 'category': cat(s['cat']),
                 'cadence': ref(f"cadence-{slug(s['cadence'])}"), 'author': ref(A[s['author']]), 'youNeed': s['need'], 'youGet': s['get'],
                 'connectors': connectors(s['need']), 'status': 'ready' if s['folder'] else 'soon', 'order': i, 'cover': (i * 5) % 20 + 1,
                 'slug': {'_type': 'slug', 'current': sl}, 'rules': refs([R[n] for n in s['rules']]), 'skills': [], 'page': page})

out = os.path.join(os.path.dirname(__file__), 'directory.json')
json.dump(docs, open(out, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(Counter(d['_type'] for d in docs))
