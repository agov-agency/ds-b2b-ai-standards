---
title: "Warm leads from ad signals"
description: "Every account that engaged last month, cleaned of the companies that were never real, matched to the CRM and handed to sales as one line a rep can say out loud"
category: "signal-to-sales"
cadence: "Monthly"
cover: 17
status: "ready"
author: "justin-rowe"
firstRun: "About ten minutes"
youNeed: "Nothing for the sample. Four CSV exports for your own"
youGet: "A ranked sheet: who to reach out to, and why"
connectors:
  - Claude
  - ChatGPT
  - Gemini
  - LinkedIn Ads export
  - CRM export
  - DemandSense (optional)
skills:
  - account-signal-sheet
rules:
  - check-who-your-ads-actually-reach
  - give-sales-a-weekly-ranked-list
  - report-exposure-influence-attribution-separately
order: 1
page:
  catches:
    headline: "One person was seven of your best accounts."
    context: "Nothing in the export said so, and the list would have sent an SDR to call every one"
    body: "A single shared profile, listed at seven different employers, accounted for more than half of September’s engagement. Ranked straight out of the export, all seven would have reached the top of the list, and an SDR would have called every one"
    note: "From one run on Northwind Merch, the sample client that ships with the skill"
    findings:
      - title: "Companies nobody could call"
        text: "Your own staff, competitors, ISPs, bots and placeholder employer pages, struck before anything was ranked"
      - title: "A pull that came back short"
        text: "The LinkedIn export stopped at 60 rows. More than half the real total was missing, and nothing in Campaign Manager said so"
      - title: "A source that went quiet"
        text: "Website sessions stopped reporting mid-window. The run halted rather than build a list on a month with a hole in it"
      - title: "Accounts your AE was already working"
        text: "Matched against the CRM before anyone picked up the phone, so open deals went to their owner and customers were never counted as new business"
  comesBack:
    headline: "A spreadsheet of ten tabs."
    context: "Sales works one of them: six accounts, each with a person’s name and a reason to call"
    # Placeholder screenshots (Notion template gallery) until the real outputs arrive
    items:
      - title: "Act now"
        caption: "Six of sixteen accounts, each with a named person, what they read and the next step"
        src: "/outputs/placeholder/notion-1.png"
      - title: "Expansion list"
        caption: "Accounts that fit the ICP and are warming up, for the next round of outreach"
        src: "/outputs/placeholder/notion-2.png"
      - title: "Exclusions"
        caption: "Companies to strip from targeting, handed to whoever runs the ads"
        src: "/outputs/placeholder/notion-3.png"
      - title: "Cleaning report"
        caption: "What was struck before ranking, and why"
        src: "/outputs/placeholder/notion-4.png"
      - title: "Output 5"
        caption: "Placeholder output 5"
        src: "/outputs/placeholder/notion-5.png"
      - title: "Output 6"
        caption: "Placeholder output 6"
        src: "/outputs/placeholder/notion-1.png"
      - title: "Output 7"
        caption: "Placeholder output 7"
        src: "/outputs/placeholder/notion-2.png"
      - title: "Output 8"
        caption: "Placeholder output 8"
        src: "/outputs/placeholder/notion-3.png"
      - title: "Output 9"
        caption: "Placeholder output 9"
        src: "/outputs/placeholder/notion-4.png"
      - title: "Output 10"
        caption: "Placeholder output 10"
        src: "/outputs/placeholder/notion-5.png"
      - title: "Output 11"
        caption: "Placeholder output 11"
        src: "/outputs/placeholder/notion-1.png"
      - title: "Output 12"
        caption: "Placeholder output 12"
        src: "/outputs/placeholder/notion-2.png"
      - title: "Output 13"
        caption: "Placeholder output 13"
        src: "/outputs/placeholder/notion-3.png"
      - title: "Output 14"
        caption: "Placeholder output 14"
        src: "/outputs/placeholder/notion-4.png"
      - title: "Output 15"
        caption: "Placeholder output 15"
        src: "/outputs/placeholder/notion-5.png"
      - title: "Output 16"
        caption: "Placeholder output 16"
        src: "/outputs/placeholder/notion-1.png"
      - title: "Output 17"
        caption: "Placeholder output 17"
        src: "/outputs/placeholder/notion-2.png"
      - title: "Output 18"
        caption: "Placeholder output 18"
        src: "/outputs/placeholder/notion-3.png"
      - title: "Output 19"
        caption: "Placeholder output 19"
        src: "/outputs/placeholder/notion-4.png"
      - title: "Output 20"
        caption: "Placeholder output 20"
        src: "/outputs/placeholder/notion-5.png"
  get:
    intro: "One command."
    context: "The skills and the scenario that runs them come in one install"
    options:
      - label: "Claude Code"
        text: |-
          /plugin marketplace add demandsense/the-ai-standard
          /plugin install account-signal-routine
    note: "Run it in Claude Code. Read-only: it never writes to your ad account, and nothing runs until you ask it to"
    source: "https://github.com/demandsense/the-ai-standard/tree/main/skills/account-signal-sheet"
    sourceNote: "before you run it on a client account"
  usingHead:
    headline: "Once a month, before the report."
    context: "What it needs, what it leaves alone and what makes it stop"
  using:
    - icon: "week"
      title: "When to run it"
      text: "Monthly, before any impact report, QBR or EBR. It reads the last three complete months plus month to date. About ten minutes the first time, under five after that"
    - icon: "plug"
      title: "What you need"
      text: "Nothing, to watch it work: a sample client ships inside the skill. For your own accounts, four CSV exports: companies by month, site visitors by company, CRM companies and deals, and leads. With DemandSense connected, the pulls and the CRM join happen for you"
    - icon: "page"
      title: "What it changes"
      text: "Nothing in your account: not a campaign, not an audience, not a CRM record. It writes one spreadsheet and one cleaning report. Routing is a column a person acts on, not a write-back"
    - icon: "badge"
      title: "What stops it"
      text: "A capped export, or a source with no data for part of the window. Both come back as blocking, naming the source. Fix that one thing and run it again: the sheet is never built on partial data"
    - icon: "date"
      title: "Doing it monthly"
      text: "Keep last month’s sheet in the same Claude Project and the run reports what moved: which accounts heated up, which went quiet, which open deals picked up new signals"
  steps:
    - title: "Clean the signal"
      text: "Strips your own company, competitors, ISPs and bots, then catches one profile showing up as several companies. Everything above was found here"
      note: "Stops the whole run if an export came back capped or a source went dark. Nothing is ranked on half the data"
      key: true
    - title: "Score fit and heat"
      text: "What survives goes through your ICP filter and gets ranked on who engaged, how often and how recently. Off-profile companies leave as an exclusion list"
    - title: "Match to the CRM"
      text: "Each account comes back as new, an open deal or a customer, so nobody cold-pitches a company that is already mid-deal"
    - title: "Hand off"
      text: "One line per account a rep can say out loud, with a column for recording what was decided"
  cta:
    headline: "Find out what’s in your own list."
    context: "The first thing it tells you is how much of last month’s engagement came from companies nobody can call"
    note: "Reads your exports. Changes nothing. About ten minutes the first time"
---
