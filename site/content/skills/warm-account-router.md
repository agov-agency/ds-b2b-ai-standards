---
title: "Warm account router"
description: "Companies engaging far beyond what their ad exposure explains, sent to an owner rather than a queue"
area: "signal-to-sales"
status: "ready"
author: "bogdan-liutic"
rules:
  - give-sales-a-weekly-ranked-list
order: 5
changes: "Reads your data, changes nothing"
firstRun: "About 5 minutes"
connectors:
  - Claude
  - ChatGPT
  - Gemini
  - LinkedIn Ads export
  - CRM export
# Placeholder page copy (structure from Figma 919:23317); replace with the author’s own
page:
  does:
    headline: "Some accounts engage far beyond what their ads explain."
    body:
      - "Most engagement tracks exposure: the more an account sees, the more it clicks. The ones worth a call are the accounts pulling well ahead of that line."
      - "This compares each account’s engagement with its share of impressions, applies a fixed line, and sends the ones past it to a person: open deals to their owner, the rest to the queue."
  prompt:
    headline: "Paste it into Claude."
    context: "Run it on the sample data first, then on your own exports"
    tabs:
      - label: "Sample client"
        text: |-
          Load the warm account router skill from The B2B AI Standard and run it on the bundled sample client, Northwind Merch.

          Compare each account’s engagement with its impressions, apply the line, then check the CRM.

          Reply with one card per account past the line: who engaged, what they did, when, and who it goes to.
      - label: "Your exports"
        text: |-
          Load the warm account router skill from The B2B AI Standard and run it on the exports I’ve attached.

          Compare each account’s engagement with its impressions, apply the line, then check the CRM.

          Reply with one card per account past the line: who engaged, what they did, when, and who it goes to.
      - label: "DemandSense"
        text: |-
          Load the warm account router skill from The B2B AI Standard and run it on my DemandSense workspace. Pull the data through the connector rather than asking me for exports.

          Compare each account’s engagement with its impressions, apply the line, then check the CRM.

          Reply with one card per account past the line: who engaged, what they did, when, and who it goes to.
    install:
      - label: "Claude Code"
        text: |-
          /plugin marketplace add bogdanl-rgb/cr8-plugins
          /plugin install signal-loop
    source: "https://github.com/bogdanl-rgb/cr8-plugins"
  steps:
    - title: "Compare engagement to exposure"
      text: "Finds companies engaging well beyond their share of impressions."
    - title: "Apply the line"
      text: "Ten paid engagements in thirty days, or three plus a second signal; under fifty staff, four paid clicks in fourteen days."
    - title: "Route"
      text: "Open deals to their owner, the rest to the queue."
  stepsNote:
    headline: "It routes to a person, not just a queue."
    context: "The signal goes stale in days"
  useWhen:
    - title: "Every Monday, after the dose check."
      text: "So the week’s calls go to accounts that are actually pulling ahead."
    - title: "SDRs call everyone who clicked."
      text: "This narrows it to the accounts engaging beyond their exposure."
    - title: "An open deal goes quiet."
      text: "Fresh ad engagement goes to its owner."
---
