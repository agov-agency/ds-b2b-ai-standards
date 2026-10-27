---
title: "Warm leads from a signal list"
description: "A target list built from dated signals rather than firmographics, checked monthly to see it is still warm, dosed weekly so the same people aren’t burned, and routed to a person while the signal still means something"
category: "signal-to-sales"
cadence: "Weekly + monthly"
cover: 9
status: "ready"
author: "bogdan-liutic"
firstRun: "About fifteen minutes"
youNeed: "Nothing for the sample. A company engagement export and your signal sources"
youGet: "An exclusion list, a dose readout and the accounts to route"
connectors:
  - Claude
  - ChatGPT
  - Gemini
  - LinkedIn Ads export
  - Signal sources
skills:
  - placeholder-page-check
  - list-dose-check
  - signal-list-check
  - warm-account-router
rules:
  - separate-frequency-targets-cold-warm
  - check-who-your-ads-actually-reach
  - give-sales-a-weekly-ranked-list
order: 2
page:
  catches:
    headline: "Half the clicks you paid for went to a company that doesn’t exist."
    context: "Struck from the list before any of it reaches a rep"
    body: "350 of 708 paid clicks on one ad set came from people listing the same placeholder employer. Read the cost line first and the set looks cheap and healthy. Rank the companies as they come and that page is your best account"
    note: "One ad set, 7 Aug to 5 Sep 2026, read by Bogdan on his own account. It ran a 176,823-member list at 11% of the suggested bid"
    findings:
      - title: "A list that has gone cold"
        text: "Fewer than 300 companies still carrying a dated signal means there is no warm list this week, whatever its size. The fix is more signals, never a wider filter"
      - title: "A list being burned"
        text: "Views per person against the target. Catches the slice carrying the whole campaign while the rest of the list has seen nothing at all"
      - title: "An account pulling ahead of its ads"
        text: "Ten paid engagements in thirty days, or three plus a second signal. Under fifty staff, four paid clicks in fourteen. Past that line it goes to a person, not a queue"
  comesBack:
    headline: "Three short reports a week, and one list you act on."
    context: "None of it writes anywhere"
    # Placeholder screenshots (Notion template gallery) until the real outputs arrive
    items:
      - title: "The exclusion list"
        caption: "49% of clicks: the placeholder employers to exclude by exact name, on every page carrying that name"
        src: "/outputs/placeholder/notion-1.png"
      - title: "The dose readout"
        caption: "Views per person for the month, how many are above the target, and how much of the list has seen nothing"
        src: "/outputs/placeholder/notion-2.png"
      - title: "The routed card"
        caption: "One per account that crossed the line: who engaged, what they did, when, and whether it goes to an owner or a queue"
        src: "/outputs/placeholder/notion-3.png"
  get:
    intro: "One command."
    context: "The skills and the scenario that runs them come in one install"
    options:
      - label: "Claude Code"
        text: |-
          /plugin marketplace add bogdanl-rgb/cr8-plugins
          /plugin install signal-loop
    note: "Run it in Claude Code. Read-only: it never writes to your ad account, and nothing runs until you ask it to"
    source: "https://github.com/bogdanl-rgb/cr8-plugins"
    sourceNote: "Text under CC BY 4.0, scripts under MIT"
  usingHead:
    headline: "Every Monday, plus one monthly check."
    context: "What it needs, what it leaves alone and what makes it stop"
  using:
    - icon: "week"
      title: "When to run it"
      text: "The signal list check once a month. The other three every Monday, before the week’s budget goes out. About fifteen minutes the first time"
    - icon: "plug"
      title: "What you need"
      text: "A company engagement export by month, your signal sources with their dates, and your campaign exclusions. Sample data ships inside the plugin if you want to watch it run first"
    - icon: "page"
      title: "What it changes"
      text: "Nothing. All four skills read. They write one list and one set of flags; applying an exclusion or calling an account is still a person’s decision"
    - icon: "badge"
      title: "What stops it"
      text: "A list where fewer than 300 companies carry a dated signal. That isn’t a warm list yet, and the weekly loop is pointless on it. Add a second signal list from the same market rather than widening the one you have"
  steps:
    - phase: "Once a month"
      title: "Signal list check"
      text: "Counts how many companies still carry a dated signal, and how old those signals are. This is the gate: everything below only makes sense on a list that is still warm"
      note: "Under 300 with a dated signal, there is no warm list yet. Widen the signals, or add a second list from the same market: never widen the filter to fill it"
      skill: "signal-list-check"
    - phase: "Every Monday, before the week’s budget goes out"
      title: "Placeholder page check"
      text: "Strikes the employers that don’t exist before any cost line is read. This is where the 49% above came from"
      skill: "placeholder-page-check"
      key: true
    - phase: "Every Monday, before the week’s budget goes out"
      title: "List dose check"
      text: "Views per person per month across the list, against a target of about five"
      skill: "list-dose-check"
    - phase: "Every Monday, before the week’s budget goes out"
      title: "Warm account router"
      text: "Finds the companies engaging far above what their ad exposure explains, and sends open deals to their owner rather than into the SDR queue"
      skill: "warm-account-router"
  cta:
    headline: "Check your own list this Monday."
    context: "The first thing it tells you is how much of last month’s clicks went to companies that don’t exist"
    note: "Reads your exports. Changes nothing. Four skills, two cadences"
---
