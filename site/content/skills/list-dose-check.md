---
title: "List dose check"
description: "Views per person per month across the list, against a target of about five"
area: "reach-frequency"
status: "ready"
author: "bogdan-liutic"
rules:
  - separate-frequency-targets-cold-warm
order: 3
changes: "Reads your data, changes nothing"
firstRun: "About 5 minutes"
connectors:
  - Claude
  - ChatGPT
  - Gemini
  - LinkedIn Ads export
# Placeholder page copy (structure from Figma 919:23317); replace with the author’s own
page:
  does:
    headline: "A list can be burned and untouched at the same time."
    body:
      - "Campaign frequency is an average. On an account list it hides a small slice seeing the ads twenty times while most of the list has seen nothing at all."
      - "This reads views per person per month across the whole list against a target of about five, and shows who is over it and who hasn’t been reached."
  prompt:
    headline: "Paste it into Claude."
    context: "Run it on the sample data first, then on your own export"
    tabs:
      - label: "Sample client"
        text: |-
          Load the list dose check skill from The B2B AI Standard and run it on the bundled sample client, Northwind Merch.

          Read reach and impressions for every campaign on the list, then views per person against a target of five a month.

          Reply with the share of the list above the target, the share not reached at all, and which campaigns are carrying the dose.
      - label: "Your exports"
        text: |-
          Load the list dose check skill from The B2B AI Standard and run it on the exports I’ve attached.

          Read reach and impressions for every campaign on the list, then views per person against a target of five a month.

          Reply with the share of the list above the target, the share not reached at all, and which campaigns are carrying the dose.
      - label: "DemandSense"
        text: |-
          Load the list dose check skill from The B2B AI Standard and run it on my DemandSense workspace. Pull the data through the connector rather than asking me for exports.

          Read reach and impressions for every campaign on the list, then views per person against a target of five a month.

          Reply with the share of the list above the target, the share not reached at all, and which campaigns are carrying the dose.
    install:
      - label: "Claude Code"
        text: |-
          /plugin marketplace add bogdanl-rgb/cr8-plugins
          /plugin install signal-loop
    source: "https://github.com/bogdanl-rgb/cr8-plugins"
  steps:
    - title: "Read reach and frequency"
      text: "Takes the month’s reach and impressions for every campaign on the list."
    - title: "Compare to the target"
      text: "Views per person against about five a month, read together with how much of the list was reached."
    - title: "Report the spread"
      text: "Who is over the target, who is under, and who has seen nothing."
  stepsNote:
    headline: "Frequency and penetration are read together."
    context: "One without the other misleads"
  useWhen:
    - title: "Every Monday, before the budget goes out."
      text: "A weekly check keeps the dose even across the list."
    - title: "Frequency looks fine in Campaign Manager."
      text: "The average hides the spread."
    - title: "A list stops responding."
      text: "Check whether it is burned or simply unreached."
---
