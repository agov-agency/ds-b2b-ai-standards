---
title: "Signal list check"
description: "How many companies on the list still carry a dated signal, and how old those signals are"
area: "signal-to-sales"
status: "ready"
author: "bogdan-liutic"
order: 4
changes: "Reads your data, changes nothing"
firstRun: "About 5 minutes"
connectors:
  - Claude
  - ChatGPT
  - Gemini
  - Signal sources
# Placeholder page copy (structure from Figma 919:23317); replace with the author’s own
page:
  does:
    headline: "A list of thousands can hold no warm accounts."
    body:
      - "Lists are built once and used for months. By then most of the signals that put a company on it have aged out, and the list is warm in name only."
      - "This counts how many companies still carry a dated signal and how old those signals are, and says whether there is a warm list this week at all."
  prompt:
    headline: "Paste it into Claude."
    context: "Run it on the sample data first, then on your own signal sources"
    tabs:
      - label: "Sample client"
        text: |-
          Load the signal list check skill from The B2B AI Standard and run it on the bundled sample client, Northwind Merch.

          Count the companies that still carry a dated signal, and how old each signal is.

          Reply with the count, the age spread, and whether it clears 300. If it doesn’t, name the signal sources worth adding from the same market.
      - label: "Your exports"
        text: |-
          Load the signal list check skill from The B2B AI Standard and run it on the exports I’ve attached.

          Count the companies that still carry a dated signal, and how old each signal is.

          Reply with the count, the age spread, and whether it clears 300. If it doesn’t, name the signal sources worth adding from the same market.
      - label: "DemandSense"
        text: |-
          Load the signal list check skill from The B2B AI Standard and run it on my DemandSense workspace. Pull the data through the connector rather than asking me for exports.

          Count the companies that still carry a dated signal, and how old each signal is.

          Reply with the count, the age spread, and whether it clears 300. If it doesn’t, name the signal sources worth adding from the same market.
    install:
      - label: "Claude Code"
        text: |-
          /plugin marketplace add bogdanl-rgb/cr8-plugins
          /plugin install signal-loop
    source: "https://github.com/bogdanl-rgb/cr8-plugins"
  steps:
    - title: "Read the signals"
      text: "Collects every dated signal per company on the list."
    - title: "Count the warm ones"
      text: "Companies whose signal is still inside its window."
    - title: "Say what to add"
      text: "Names the signal sources worth adding from the same market."
  stepsNote:
    headline: "Under 300, it stops."
    context: "The weekly checks are pointless on a cold list"
  useWhen:
    - title: "Once a month, before the weekly checks."
      text: "Everything else assumes the list is still warm."
    - title: "A list stops producing leads."
      text: "Check whether the signals behind it have simply aged out."
    - title: "You’re tempted to widen the filter."
      text: "Add signals instead."
---
