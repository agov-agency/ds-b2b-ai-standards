# DemandSense Design System

Single source of truth for the AI Resource landing page and anything built in the DS Report language. Code tokens: [design-system/tokens.css](design-system/tokens.css). Visual check: [design-system/specimen.html](design-system/specimen.html).

**Extracted from**

| Source | What it gave us |
|---|---|
| Figma `jiNJOOlaeRo2jTiNU64MQh`, page `components` (`119:2806`) | 12 component sections, all variant axes, exact paddings/radii/fills (read via Plugin API) |
| Figma `Colors` collection + 18 local text styles | Every color and type token below (verified values, not eyeballed) |
| Figma tool landing `788:45522` (`form-fixes`) | Landing section anatomy, 12-column grid, section rhythm |
| Figma report `516:88440` | Black hero, sidebar + main grid, edge lines, section headers, data components |
| Figma `mobile-blockers` (`801:16043`) | The only 375px comps: mobile margins and edge lines |
| `../DS Report/prototype/dist/*.css` | Shipped motion tokens, breakpoints, mobile behavior |
| https://www.sanity.io/ and https://www.bequant.com/ (2026-10-19 study, `docs/proposals-sanity-bequant.md`) | Figure system §8.15: figure card, slots, type chip, corner marks, pipeline frame, index rail, prompt chips, word reveal |
| https://the-ai-standard.vercel.app/ | Content structure we keep. Its visual style (navy glass, glows, Geist sans, gradients) is **replaced** by this system |

**Visual reference = Figma, not stored images.** Open a node with `https://www.figma.com/design/jiNJOOlaeRo2jTiNU64MQh/DS-Report?node-id=<id with - instead of :>` or `get_screenshot` via Figma MCP.

| Section | Node | Section | Node |
|---|---|---|---|
| Landing hero | `795:14889` | Report hero | `516:90732` |
| Landing demo (sample reports) | `788:45613` | Report main column + dividers | `516:88441` |
| Landing feature chess rows | `788:45632` | Report grid (sidebar, edge lines) | `516:90727` |
| Landing testimonials | `788:45675` | Report summary / after | `516:91221`, `516:91351` |
| Landing CTA | `788:45687` | Mobile "progress" (375, renamed from blockers; `803:16313` unreadable via MCP) | `801:15362`, `803:16313` |
| Landing features | `788:46638` | Colors (brand / custom palette) | `103:1084`, `103:1364` |
| Landing numbers | `788:46683` | Dividers (vertical / horizontal) | `206:53015`, `346:57229` |
| Landing FAQ | `788:46697` | Section header | `247:66581` |

Values marked *(derived)* have no Figma comp yet and were set from the shipped report build. Confirm or adjust them in Figma when the mobile landing is designed.

---

## 1. Principles

1. **Structure is drawn with lines, not boxes.** 1px edge-to-edge horizontal dividers, vertical edge lines, and whitespace carry the layout. Cards stay flat: no shadows, no nesting rounded cards inside rounded cards.
2. **One headline, two tones.** A section speaks in one sentence split into black (the claim) and gray (the context). No headline plus body paragraph.
3. **Black frames the story, white carries the content.** Hero and CTAs are black. Everything else is white.
4. **Two voices.** Inter Medium is the human voice (headlines, body). Geist Mono SemiBold uppercase is the machine voice (labels, buttons, tabs, numbers, metadata).
5. **Monochrome first, color means something.** Neutrals do the work. Orange marks sections and focus. Blue is the conversion action. Chart and brand colors appear only inside data.
6. **Numbers are evidence.** Mono, tabular, large. Demo or scripted numbers carry a visible "Demo" label.
7. **Motion explains state change.** Every change transitions with `ease-out`; nothing animates for decoration; reduced motion keeps opacity and drops movement.

---

## 2. Surfaces

| Surface | Background | Used for | Text | Lines |
|---|---|---|---|---|
| **Black** (`.surface-black`) | `neutral/1000` #000 | Hero (always), CTA sections (always), strategic summary in report | white / `neutral/300` | `neutral/800` #2d2f33 |
| **White** (default) | `neutral/0` #fff | Every other section | `neutral/950` / `neutral/500` | `neutral/100` #e2e3e6 |
Rules
- Hero is black, always. CTA sections are black, always. The rest is white. Never alternate white/gray section backgrounds.
- Figma still shows a navy CTA card (`primary/900`) on the landing and a blue `#004ebf` CTA band in the report. Both are superseded: CTAs are black.
- The black hero carries the live wave (§8.12) behind the right side. Copy stays on solid black on the left.
- A white card on black (hero form card) is allowed: `neutral/0`, radius 4, padding 40, `backdrop-blur 40`.
- Flipping a surface flips semantic tokens, not component markup. Components read `--text`, `--line`, `--action`.

---

## 3. Headlines

The headline is one continuous text block with two color spans. Same size, same weight, same line height. The black part states the point; the gray part adds context. Gray can come first when the context leads ("What each brand **keeps saying**, and what it **offers to get the click**").

```html
<h2 class="headline t-h2">Read a full report before you request yours. <span class="tone-2">Three full reports from SaaS, agencies and IT services.</span></h2>
```

| Surface | Tone 1 | Tone 2 |
|---|---|---|
| White | `neutral/950` #0b0c0d | `neutral/500` #767980 |
| Black | `neutral/0` #fff | `neutral/300` #aaadb3 (report uses #767980 on large sizes) |

- Sizes in use: hero 48 (landing) / 56 (report), section 40, report section 28, feature block 24, quote 28/1.4.
- **Page title (h1) = `display`** (`.t-display`, 48 / 1.05, mobile 36) on every page of the landing and the tool: Directory, hubs and detail pages alike (Agov, 22 Oct). One h1 per page; no other size for page titles.
- Optional **section marker** above: 8px accent square (orange; the item type colour on scenario, skill and rule pages, §4.6) + Geist Mono 12 uppercase (`chip`, micro). It labels the section ("FAQ", "WHAT YOU'LL GET"). It is not a second headline and never a sentence.
- No body paragraph under the section headline. If one line of support is unavoidable (form card: "Pick the two your buyers mention most"), use `p1` in `neutral/800`, 8px below.
- Quotes use the same trick inverted: gray sentence, black highlights on the key phrases.
- Max line: 650px for hero and section headlines, 514px in report headers.
- The two tones stay on one line flow: never force the gray span onto its own line (no `display: block` on `.tone-2`); it wraps only when the width runs out ("Rule Says what good looks like").
- **No full stop at the very end of any text**: headlines, body, captions, list items, buttons. The last sentence of a block ends bare. Periods between sentences inside a block stay; `?` and `!` stay.

### 3.1 Section header split *(landing, decided 2026-10-19)*

Every section's main header (the top-level headline and its body) divides the content width into two halves:

- **Left:** section marker (overline) above the headline.
- **Right:** the body, which is the support copy for the headline. This is the one place a section body is allowed; it replaces the "one support line under the headline" case above.
- Headlines run **at least two lines** at every breakpoint (shorten the max line or balance with `text-wrap: balance` so a one-line headline never occurs). Exception: short explainer headlines ("How a rule works") stay on one line.
- A section with no body leaves the right half empty; it does not centre or widen the headline.
- Applies only to the main section header, not to card, feature or sub-block headlines.
- Mobile (<700px): stacks, marker → headline → body, 16 gaps.

---

## 4. Color

### 4.1 Primitives (Figma `Colors` collection, all 66 variables)

**Neutral**: 0 `#ffffff` · 25 `#f8f8f9` · 50 `#f0f1f2` · 75 `#e9eaec` · 100 `#e2e3e6` · 200 `#c6c8cc` · 300 `#aaadb3` · 500 `#767980` · 800 `#2d2f33` · 850 `#212326` · 900 `#161719` · 950 `#0b0c0d` · 1000 `#000000`. Alpha: `0-10` `#ffffff1a`, `1000-10` `#0000001a`. Transparent stops for fade gradients: `25-0` `#f8f8f900`, `800-0` `#2d2f3300`, `1000-0` `#00000000` (in the Figma file, not in the earlier 66-variable count).

**Primary (blue)**: 200 `#a4bcff` · 300 `#7ba0ff` · 450 `#3875f6` · 850 `#001a4c` · 900 `#00113a` · side `#78d7ff`.

**Secondary (orange)**: 300 `#fa8c16` · 400 `#d47300`.

**Status**: danger 450 `#d64c53` · 550 `#b2313a`; success 300 `#49b94b` · 450 `#169027`.

**Brand slots** (the compared companies, in order): first `#fa8c16` · second `#02bcfd` · third `#1764ff`, each with `-10` (10%) and `-25` (25%) alpha tints.

**Chart (categorical)**: 1 `#531aa0` · 2 `#7e003f` · 3 `#7c0f99` · 4 `#00ac6f` · 5 `#ff6a4b` · 6 `#55c0f9` · 7 `#ffae6f` · 8 `#ffb900` · 9 `#55e4db` · 10 `#c0526e` · 11 `#0080a4`.

**Pastel** (scenario cover backgrounds, Figma `colors/custom-palette` `942:23484`, step 25 of each hue column): 1 `#fff2f4` · 2 `#fff2f1` · 3 `#fff2ef` · 4 `#fff3ed` · 5 `#fef3e9` · 6 `#fff4e0` · 7 `#fefa85` · 8 `#e5ffad` · 9 `#dbffd1` · 10 `#d5ffe4` · 11 `#cffff2` · 12 `#cefeff` · 13 `#e4f9ff` · 14 `#ecf6fe` · 15 `#f0f5ff` · 16 `#f4f4ff` · 17 `#f7f3ff` · 18 `#fbf2ff` · 19 `#fff1fc` · 20 `#fff2f6`. Tokens `--pastel-1` … `--pastel-20`. A scenario picks one with `cover: <1–20>` in its frontmatter; without it the cover falls back to `--bg-subtle`. Skill cards take a cover by area (`AREA_COVER` in `site/src/site.ts`).

**Art on a pastel cover stays in its cover's colour family** (rule, 2026-10-23; made general 2026-10-27: it holds for every figure, hairline icon and cover on every page, card and Studio pick, rules and skills included). Every illustration or icon on a `--pastel-N` cover takes its accents (lit screen, beacon, keys, cards, cable, glow, the icon's highlight stroke) from the same hue column of Figma `colors/custom-palette` `946:35915`, never from primary blue or another hue: `--pastel-N-450` is the accent, `--pastel-N-200` the light accent. Neutrals (plates, edges, detail lines) stay neutral. The card sets `--cover-450` / `--cover-200` on the cover; `ScenarioCover`, every hairline icon (`.hl` in `site.css`) and every CMS figure (`ItemArt`: all colour groups and the live part) read them, so nothing on a cover picks its own colour (fallback: primary 450 / 200 only where there is no cover). A new art piece on a cover reads these two variables rather than hardcoding a colour.

The extended Figma palette (4 ramps and the 20×20 hue grid, Figma `colors/custom-palette` `103:1364`) is a picking source, not a token set. Promote a value to a variable before using it.

### 4.2 Semantic roles

| Role | White surface | Black surface |
|---|---|---|
| `--text` (headline tone 1, body) | 950 | 0 |
| `--text-2` (headline tone 2) | 500 | 300 |
| `--text-body` (support copy under h5/h6) | 800 | 300 |
| `--text-meta` (disabled, decorative; not readable copy on white) | 300 | 500 |
| `--line` (dividers, edge lines) | 100 | 800 |
| `--line-card` (card, media border) | 75 | 850 |
| `--bg-subtle` (row hover) | 25 | 900 |
| `--bg-muted` (inactive pill, open FAQ/feature) | 50 | 850 |
| `--action` (primary button) | 950 | 0 |
| `--action-brand` (form submit) | primary/450 | primary/450 |
| `--accent` (section marker, focus ring, current) | secondary/300 | secondary/300 |
| `--accent-on` (number or label on an accent fill) | 950 | 950 |

On a scenario, skill or rule page `--accent` becomes that item's type colour (§4.6).

### 4.3 Interaction

From Figma `neutral/interaction/*`: hovered solid fills step one notch toward contrast (0 → 200, 950 → 800, 50 → 200, 100 → 300); pressed fills go to `neutral/500`. `interaction/1000` (loading tab) matches 950: hovered `#2d2f33`, pressed `#767980`. Hover and pressed are now real Figma variants (`state` axis, §8.1–8.4), not only variables. Alpha fills: hover `#0000001a → #00000040`, pressed `#00000066` (white equivalents `#ffffff40` / `#ffffff59`). Inputs and FAQ rows hover by darkening their bottom line to `neutral/950`.

### 4.4 Color in data

- Funnel: awareness chart/2, consideration chart/9, retargeting chart/5.
- CTA strength: hard chart/3, medium chart/6, soft chart/4.
- Proof types: chart/1, chart/10, chart/7, chart/11, chart/5.
- Severity chips: Critical danger/550, Important secondary/400, Strategic success/450.
- Brands are always first/second/third in the same order across every chart.
- Empty chart tracks: `neutral/100` on white, `neutral/800` on black.

### 4.5 Contrast

Measured WCAG ratios:

| Pair | Ratio | Verdict |
|---|---|---|
| `neutral/500` on white | 4.36 | Large text only (≥24px): fine for headline tone 2 at 24–56px. Below 24px use `neutral/800` (13.4). |
| `neutral/300` on white | 2.25 | Decorative only (dividers, disabled). Never for readable text on white. |
| `neutral/300` on black | 9.34 | Any size. |
| `neutral/500` on black | 4.82 | OK for ≥14px; avoid for 10px labels. |
| White on `primary/450` | 4.16 | **Fails AA** for the 14px button label. Darken the conversion button to `#2f68e0` (5.03) or confirm in Figma. |
| `primary/200` on `primary/900` | 9.83 | Any size. |

Figma components that miss AA as drawn (measured in the rendered specimen). Kept faithful until the design decision is made:

| Element | Ratio | Proposed fix |
|---|---|---|
| Number badge "01" (white 12px on `primary/450`) | 4.16 | Same as the conversion button: darken to `#2f68e0` |
| Status chip "Important" (white on `secondary/400`) | 3.36 | `#b35f00` fill, or `neutral/950` label |
| Status chip "Strategic" (white on `success/450`) | 4.16 | `#127a21` fill |
| Insight header labels (`neutral/950` at 50% opacity on brand-10 tint) | ~3.6 | 70% opacity, or `neutral/800` solid |
| Inactive tab index / feature index (`neutral/500` 12–14px on `neutral/50` or white) | 3.85–4.36 | `neutral/800` index, keep the label at 950 |

---

### 4.6 Item type colours *(AI Resource site, decided 2026-10-23)*

Each item type has its own accent. It replaces the orange `--accent` everywhere the accent belongs to that item: the section marker squares, the active step dot, quote and gate bars, focus rings.

| Type | Token | Hex | `--accent-on` |
|---|---|---|---|
| Scenario | `--scenario-300` | `#fa8c16` (same as secondary/300) | neutral/950 |
| Skill | `--skill-300` | `#02bcfd` | neutral/950 |
| Rule | `--rule-300` | `#1764ff` | neutral/0 (950 on this blue is 4.2:1, white 5:1) |

The hexes match the brand slots (first/second/third) but the names are separate: brand slots stay for compared companies in charts.

How it is applied: `[data-type="scenario|skill|rule"]` (tokens.css) re-points `--accent` and `--accent-on`. `Base` takes `type` and sets it on `body` for the hub and detail pages of that type; `ScenarioCard`, `SkillCard` and `RuleRow` carry their own `data-type`, so a rule row on a skill page stays blue; Directory sections carry the type of what they list. Components keep reading `--accent`; never hardcode a type hex.

Stays brand orange (`secondary/300`): pages that are not one item type (landing, Directory hero and Featured authors, author pages, art lab), the header, tab bar, submit band and footer, the wave, severity chips. Illustrations follow their own rules (§4.1, §8.17).

Contrast: like orange, skill cyan as text on white is under 3:1 (2.2:1), so use it for fills and large numbers only, never for body copy.

## 5. Typography

Fonts: **Inter** (Medium 500 everywhere; SemiBold 600 only for side tabs and brand names) and **Geist Mono** (Medium 500 for numbers, SemiBold 600 for labels). Both are bundled locally in the report (`assets/InterVariable.ttf`, `GeistMono-Medium.ttf`, `GeistMono-SemiBold.ttf`). No other weights.

| Token | Font | Size / LH / Tracking | Use |
|---|---|---|---|
| headline/h1 | Inter 500 | 56 / 1.05 / -4% | Report hero title |
| display | Inter 500 | 48 / 1.05 / -4% | Page title (h1) on every page: landing hero, tool Directory, hubs, detail pages |
| headline/h2 | Inter 500 | 40 / 1.1 / -4% | Landing section headline |
| headline/h3 | Inter 500 | 32 / 1.1 / -4% | Report summary headlines |
| headline/h4 | Inter 500 | 28 / 1.1 / -4% | Report section header, form card title |
| quote | Inter 500 | 28 / 1.4 / -4% | Testimonial body |
| headline/h5 | Inter 500 | 24 / 1.2 / -4% | Feature block title, card title |
| headline/h6 | Inter 500 | 20 / 1.2 / -4% | FAQ question, insight title, power-move card |
| headline/h7, body/p0 | Inter 500 | 18 / 1.4 / -4% | Lead, input value (large) |
| body/p1 | Inter 500 | 16 / 1.4 / -4% | Body, list rows |
| body/p2 | Inter 500 | 14 / 1.4 / -3% | Card body, FAQ answer, tooltip |
| body/p3 | Inter 500 | 12 / 1.4 / -3% | Captions |
| num/n1 | Geist Mono 500 | 64 / 1 / -4% | Big metric |
| num/n2 | Geist Mono 600 | 40 / 1 / 0, uppercase | Score labels |
| num/n3 | Geist Mono 500 | 24 / 1 / -4% | Inline stats (250 ADS ANALYZED) |
| label/l0 | Geist Mono 600 | 14 / 1.4 / 0, uppercase | Buttons default |
| label/l1 | Geist Mono 600 | 12 / 1.4 / 0, uppercase | Section marker, tabs, chips, small buttons, metric captions |
| label/l2 | Geist Mono 600 | 10 / 1.4 / 0, uppercase | Field labels, legal, micro meta |

`display` (48) and `quote` (28/1.4) are not local Figma styles (raw text on the landing hero and testimonial); the other 17 are. In the report main column (`516:88441`) a `headline/h6` binding resolves to 16/1.4 instead of 20/1.2: treat as an override, h6 stays 20.

Rules: tracking is negative for Inter, zero for mono. Mono is always uppercase. Numbers always `tabular-nums`. Use `text-wrap: balance` on headlines. Never bold Inter for emphasis: emphasis is color (tone 1 vs tone 2).

---

## 6. Grid and spacing

### 6.1 Desktop (design canvas 1512, applies ≥1000px)

```
|<40>|<-64->|<----------------- 1304 grid ----------------->|<-64->|<40>|
     ^ edge line (x=40)                               edge line (x=1472) ^
            |c1|16|c2|16| ... 12 columns, col 94px, gutter 16 ... |c12|
            ^ content starts at x=104                 ends at x=1408 ^
```

- **12 columns**, column **94px**, **gutter 16px**, **margin 104px** (= 40 to the edge line + 64 from the line to content). Grid width 1304.
- **The edge line sits outside the grid.** It never moves content: every section, ruled or not, aligns to the same 104px grid, so text lines up down the page. The 64px between line and content is a minimum and applies to everything, including headlines, cards, and cell rows.
- Above 1512 the grid stays 1304 wide and centered; the lines stay 64px outside it (at 1800 wide: line x=184, content x=248).
- This matches the Figma `divider` component: a 104px strip with the line at 40, so the line lands 40 from the edge and 64 from whatever follows.
- Span widths:

| Span | Width | Where |
|---|---|---|
| 3 col | 314 (326 as a gutterless cell) | Metric cell (4 per row, separated by vertical dividers instead of gutters) |
| 4 col | 424 | Sample report card (carousel) |
| 5 col | 534 | FAQ intro column |
| 6 col | 644 | Testimonial halves, "features" halves (6+6) |
| 7 col | 754 | FAQ list |
| 12 col | 1304 | Section header, full-width bands |

- Hero: copy 7 col (754) + form card 5 col (534). The Figma form card is 650 on the old 40px grid; at 534 it keeps its 40 padding.
- Feature **chess rows**: two halves of 612 with an **80px gap** (not the 16 gutter). Rows are 650 high, 128 apart.
- Cell rows (numbers, sample reports, testimonials): cells sit inside the grid and are separated by 1px vertical dividers instead of gutters.

*Figma's landing frames were drawn on a 40px margin with no vertical lines. The 104px grid supersedes them; measured Figma widths (708, 829, 676…) map to the spans above.*

**Report layout** (Figma `516:90727`): sidebar 220 at x=40 → vertical line at x=300 → main column 1172 (x=300–1472) whose content sits 64px inside the line (1044 wide at x=364) → right line at x=1472 → 40 margin. Both vertical lines run the full height of the analysis area (7,464px), from the bottom of the black hero to the summary. They do not continue into the black hero.

### 6.2 Spacing

Spacing scale (4px base): 2 · 4 · 6 · 8 · 12 · 16 · 24 · 32 · 40 · 64 · 80 · 128 · 160. Nothing off-scale except fixed component heights. Measured from the Figma auto-layout frames; desktop values, mobile in §6.4.

**Between sections**

| Gap | Desktop | Where it comes from |
|---|---|---|
| Hero → first section | 128 | `spaceholder/128` |
| Section → section (landing) | 208 (tablet 160, mobile 104) | `--section-gap` |
| Section → section (report main column) | 128 band, divider line at 64 | `divider` 1172×128 |
| Chess row → chess row | 128 | report-features stack gap |
| Report hero rows (title / insights / gauges / cards) | 40 above + 40 below each full-bleed line | report hero |

**Section header** (marker → headline → tabs / actions → content)

| Gap | Value |
|---|---|
| Marker → headline | 16 |
| Headline → tabs or one support line | 24 (landing FAQ intro: headline → support line 16, support line → button 24) |
| Header → content | 40 (one exception: report "offers" uses 32; treat as 40) |
| Header actions (carousel arrows) → headline | aligned to headline bottom, arrows 8 apart, 24 from the headline column |
| Content block → next content block in the same section | 40 (`spaceholder/40`) |

**Headline → body**: by rule there is no body paragraph under a section headline. Where a block does carry copy (features column, content card, form card), the gaps are:

| Block | Headline → body | Body → action | Action → note |
|---|---|---|---|
| Features copy column | 16 | 16 | 8 (button → check row) |
| Content card | 4 (h5 → p2) | 24 | — |
| Form card | 8 (title → support) | — fields block follows at 40; fields 24 apart; fields → submit 80 | 16 (submit → legal) |
| Chess copy column | 16 (marker → headline → list, all 16) | list rows pad 16 / 0 | testimonial strip at bottom, 40 top padding, 24 between photo and text |

**Inside components**

| Component | Padding | Gap |
|---|---|---|
| Hero (landing) | 106 top (40 under the 66 site header), 40 sides, 40 bottom | 80 between headline group and list; 16 inside headline group; 8 list label → list |
| Hero form card | 40 | 80 fields → submit |
| Trust row under form | 40 above | 40 between rating and badges, 24 between badges |
| Sample report card | body 40 / 24 | 24 |
| Testimonial card | 40 | 40 logo+quote → person; 24 photo → name |
| Metric cell | 80 / 40 | 12 |
| `card/feature` row | 16 (active 16/16/20/16) | 16 icon → text, 12 inside text |
| `card/faq` row | 0 / 32 outer, 24 / 0 inner | 16 |
| Insight card | 4 outer, 6 / 12 header, 12 panel | 4 |
| Section marker | — | 6 icon → label |

### 6.3 Tablet (700–999px) *(derived from report build)*

- **8 columns**, gutter 16. Edge line at 24, content 40 inside it → **margin 64**.
- Two-column splits stack: copy first, media/form second, 32px apart.
- Carousels keep horizontal scroll-snap; cards become 300px wide.
- Section gap 120, hero gap 96, header→content 32.
- Horizontal dividers in the report become an 80px band with the line at 40.

### 6.4 Mobile (<700px, design base 375) *(Figma mobile comps + derived)*

```
|16|16|<----------- 311 grid ----------->|16|16|
 ^ edge line x=16 (fades 5% top/bottom)      ^ edge line x=359
       ^ content x=32                ends x=343 ^
```

- **4 columns**, column 65.75px, gutter 16, **margin 32** (= 16 to the edge line + 16 from the line to content; matches the Figma 375 frames). Edge lines at x=16 and x=359, 1px `neutral/100`, gradient-faded over the first and last 5% (Figma `divider` 32px strip).
- Horizontal dividers run between the edge lines (16 → 359), not to the screen edge.
- All content, including cell rows, sits 16px inside the lines (311 wide).
- Section gap 80, hero gap 64, header→content 24.
- Type steps down: display 36, h2 32, h4 24, n1 48 (report build uses `clamp(36px, 7.5vw, 64px)` for its hero).
- Everything stacks to one column. Metric cells go 2×2. FAQ goes full width under its intro. Buttons go full width in forms only.
- Minimum touch target 44px: xs (32) and small (36) buttons get padding or an invisible hit area on touch.

### 6.5 Breakpoints

| Name | Range | Columns | Edge line | Line → content | Grid margin |
|---|---|---|---|---|---|
| sm | < 700 | 4 | 16 | 16 | 32 |
| md | 700–999 | 8 | 24 | 40 | 64 |
| lg | 1000–1511 | 12 | 40 | 64 | 104 (fluid columns) |
| xl | ≥ 1512 | 12 | 64 outside the grid | 64 | grid stays 1304, centered |

Tokens: `--edge`, `--edge-inset`, `--margin` (= edge + inset), `--content-max` (1304), `--bleed` (§8.14).

The report build has two extra cut points, both in component CSS, not tokens:
- **1000–1350**: wide rows that bleed to the edge (ad library, wide tables) get `width: calc(100% + 80px)`, `margin: 0 -40px`, `padding-left: 40px`, and the divider line starts at `left: 0`. Content width is too tight for the full 64 inset there.
- **700 vs 699**: the share popup collapses at `max-width: 700px`, everything else at 699. Use 699.
- **Touch** (`hover: none`, `pointer: coarse`): chart keys get `cursor: pointer`; tooltips open on tap (§10).


### 6.6 Section spacing *(AI Resource site, decided 2026-10-23)*

One set of vertical gaps for every site page: Directory, the four hubs, scenario / skill / rule detail pages and the author profile. Values are tokens in `design-system/tokens.css`; pages use the tokens, never their own numbers. `Sec.astro` and `SectionHead.astro` already apply them, so a new section gets them for free.

| Gap | Token | Desktop | Tablet (700–999) | Mobile (<700) |
|---|---|---|---|---|
| Overline (section marker) → headline | `--gap-overline` | 16 | 16 | 16 |
| Headline → body | `--gap-body` | 16 | 16 | 16 |
| Header (headline, or body if any) → section content | `--header-gap` | 40 | 32 | 24 |
| Divider → next overline | `--section-ruled-top` | 120 | 104 | 80 |
| Section content → next divider | `--section-ruled-bottom` | 80 | 80 | 64 |
| Section → section with no divider (content → next overline) | `--section-gap` | 208 | 160 | 104 |

- **Headline → body** is the rule-page hero rhythm (title → lead). It holds wherever a body follows a headline: page heroes, the closing card, a stacked section header (§3.1 on mobile). When the body sits beside the headline (§3.1 split) there is no vertical gap.
- **With a divider** the line is the separator: 120 above the next overline, 80 under the last content. The gap is deliberately asymmetric so the line reads as belonging to the section below it.
- **A surface edge counts as a divider**: hero → first section, white → black band and back ("Get it", "The prompt", Featured authors), detail sidebar border on tablet. Inside a black band the same 120 / 80 apply.
- **Without a divider** (two white sections in a row with no line, as on the landing) the whole gap is `--section-gap`, split however the sections need, never less.
- A section that ends on a bordered grid (`.flush`) has no bottom gap: the grid's own border meets the next divider.
- The first section in a column with no line or edge above it (author profile, level with the card) starts at 0; its top is set by what it aligns to.
- Not covered here: hero internals, card internals, the closing band's card, component padding (§6.2).

---

## 7. Dividers and edge lines

The defining layout device. All lines are 1px, `--line` (`neutral/100` on white, `neutral/800` on black).

Three scales of line, from widest to narrowest:

| Line | Spans | Where |
|---|---|---|
| Band horizontal | Solid across the grid and 64px past it (to the edge lines), then fades to 0 opacity toward the viewport edge | Report hero rows; top and bottom of landing cell bands (sample reports, testimonials, numbers); report summary sections |
| Framed horizontal | Between the two vertical lines only (report: 300 → 1472) | Report section dividers (`divider` 1172×128, line at y=64) |
| Column horizontal | Inside one column | List rows: feature list, FAQ, hero inbox list, `container` rows |

**Vertical edge lines (left and right).** They sit **outside the grid**: 40px from the viewport edge, then at least **64px of space before any content** (mobile 16 + 16). Adding or removing a line never shifts content; every section aligns to the same grid whether it is ruled or not.
- Desktop: lines at x=40 and x=1472, content 104 → 1408. Above 1512 the lines follow the centered grid, always 64 outside it. Mobile: x=16 and x=359, content 32 → 343.
- **Report**: same rule. The left line at x=300 is the sidebar/main boundary and content starts 64 later at x=364; the right line is at x=1472 with content ending at 1408. Both run the full height of the analysis area as one continuous rule, and the framed horizontal dividers stop at them.
- **Landing**: lines frame content bands (ruled sections and CTAs). Full-bleed horizontal lines close the band top and bottom, so each band reads as a ruled box that bleeds horizontally.
- **Mobile**: one continuous pair, fading over the first and last 5% of their height (Figma `divider` 32px strip with a gradient stroke).
- Figma component `divider` (`206:53015`): a 104px-wide strip, line at 40 (`left`), 64 (`right`), or 52 (`full`). It encodes the rule directly: 40 to the edge, 64 to content.

**Vertical, between cells.** Inside a bordered row, cells are separated by single vertical lines (metric cells, report hero brand gauges, category/edge split with 16px padding each side of the line).

**Horizontal band divider.** `divider` 1172×128 with the line centered (y=64) separates report sections; `is-transparent` keeps the space without the line.

Band horizontals are not edge-to-edge (updated 2026-10-19): `border-image: linear-gradient(90deg, transparent, var(--line) X, var(--line) calc(100% - X), transparent)` where X is the edge-line position. Figma still draws them full-bleed; update the comps.

Never: double lines, lines with gaps at the ends (except the band and mobile fades), dashed lines outside charts, shadows instead of lines.

---

## 8. Components

All measurements from Figma. `pad` is top/right/bottom/left.

### 8.1 Button

Axes: `type` filled · outlined · blur · ghost; `class` text-only · leading-icon · trailing-icon · icon-only; `size` default · small · xs; `surface` on-white · on-black; `state` enabled · hovered · pressed (Figma `355:23069`, e.g. hovered `863:23461`; no disabled or focus variant).

| Size | Height | Padding | Gap | Label | Icon |
|---|---|---|---|---|---|
| default | 40 | 10 / 16 (icon-only 11 / 20) | 16 | l0 14px | 18 |
| small | 36 | 9.5 / 14 | 12 | l1 12px | 16 |
| xs | 32 | 7.5 / 12 (icon-only 8 / 16) | 10 | l1 12px | 16 |

| Type | On white | On black |
|---|---|---|
| filled | `neutral/950` fill, white label | white fill, `neutral/950` label |
| outlined | 1px `neutral/100` stroke (padding −1), black label | 1px `neutral/800`, white label |
| blur | `neutral/1000-10` fill + background blur 24 | `neutral/0-10` + blur 24 |
| ghost | no fill | no fill |

- All buttons: radius 100, Geist Mono SemiBold uppercase.
- **Conversion button** (landing form): `primary/450`, full width, pad 16 / 24 / 16 / 28, label l0 + a row of 10px mono check items (FREE · NO CREDIT CARD · …) at 60% luminosity beneath, 28px arrow on the right.
- **Carousel arrows**: icon-only pair; previous = outlined, next = filled.
- States: hover per §4.3 (report build uses `filter: brightness(.94)`); pressed `neutral/500`; focus ring 2px `secondary/300`, offset 4px.
- Figma state fills: filled hover = interaction/950 `#2d2f33` (on black: interaction/0 `#c6c8cc`), pressed `#767980`; outlined keeps its 1px stroke and takes the same fills; ghost hover `#c6c8cc`; blur hover `#00000040`.
- Missing in Figma: disabled and loading. Use 40% opacity + `cursor: not-allowed`; loading swaps the icon for a 16px spinner, label stays.

### 8.2 Text field

- Underline field, no box. Height 48 (default) / 53 (large). Bottom border 1px `neutral/1000-10` (on black `neutral/800`); hover and focus: `neutral/950` (on black white). Padding bottom 8, inner gap 4.
- Label above value: label/l2 10px, `neutral/800` (on black `neutral/500`).
- Placeholder (empty field) is p2 14px `neutral/500`; the typed value is p1 16px `neutral/950`; large uses 18px. Axes: `state` enabled · hovered · pressed, `is-filled`, `size`, `surface` (`408:46777`). Hovered: underline and placeholder go `neutral/950`. Pressed = focus: underline `neutral/950` plus a 1×20 caret `neutral/950`.
- Fields stack 24px apart inside a form card.
- Missing in Figma: error and success. Error: underline and helper text `danger/550`, helper l2 under the line, 4px gap. Success: `success/450`.

### 8.3 Toggle

Switch 40×20, radius 1000. Off track `neutral/100`, on track `neutral/950`, knob 24×16 white (pill knob, not a circle). Labeled toggle: l1 label + switch, pad 8, gap 8, height 36. States (`319:43441`, `319:43447`): hovered/pressed fill follows §4.3 (on = 950 → `#2d2f33` → `#767980`; labeled row hovered `#aaadb3`).

### 8.4 Tabs

- **Pill tab** (`tab`): 36 high, pad 9.5 / 16, gap 16, radius 100. Index number + label in l1. Active: `neutral/950` fill, number `neutral/300`, label white. Inactive: `neutral/50` fill, number `neutral/500`, label `neutral/950`. `is-progress` adds an angular-gradient 2px ring that fills over time (auto-advancing tabs).
- **Compact tab** (`tab` 220×32): 28px square index badge (radius 1, active black with icon, inactive white with mono number) + l1 label.
- **Loading tab** (`tab` 68×36, `387:94095`): black pill, pad 6 / 16, gap 8, 24px loader (`primary/300` bars) + l1 label in white. `Variant2` = label only (pad 9.5, 45% opacity, 36×36 without text). Hover `#2d2f33`, pressed `#767980`. Shown while a report is generating.
- **States**: pill, compact, side and loading tabs all have `state` enabled · hovered · pressed. Inactive pill hover `#c6c8cc` (label stays 950, index 500); compact hover `#c6c8cc`, pressed `#767980`; side tab hover `#c6c8cc` with its 1px `neutral/75` border.
- **Side tab** (`tab/side`): 40 high, pad 12, gap 6, radius 8, 16px icon + Inter SemiBold 14. Active: white fill + 1px `neutral/75`; inactive: no fill, `neutral/500`. Report sidebar navigation.

### 8.5 Chips and markers

| Chip | Spec | Use |
|---|---|---|
| Section marker | 16px icon (8px orange square) + l1, gap 6, no fill | Above every section headline |
| Outline chip | pad 4/8, radius 6, 1px `neutral/100` (black: `neutral/850`), Inter 14 | Filters, tags in text |
| Filled chip | pad 4/8, radius 2, `neutral/50` (black: `neutral/800`), p2 | Visual motifs, inline values ("+15%") |
| Status chip | pad 4/8, radius 2, l1 white on danger/550 · secondary/400 · success/450 | Severity |
| Tone chip | 28 high, radius 2, fill `#f0f1f2` (hardcoded, same as `neutral/50`), pad 6 / 5.5, p3-size Inter 12 labels each with a count pill (white, radius 100, pad 8 / 2, l1), "/" in `neutral/300` | Tone scales |
| Logo chip | white pill, 1px `neutral/75`, pad 6.5/12/6.5/15, logo + l1 | Hero eyebrow ("LinkedIn · FREE LINKEDIN COMPETITOR ANALYSIS") |
| Tooltip | white, radius 2, pad 4/8, p2 black, 8×4 caret, 4 above the chip (`709:30557`; status chips have `state=hovered` showing it, `709:30567`) | Chip hover |

### 8.6 Cards

All cards: radius 4 (dark card radius 2), no shadow.

- **card/ad**: 362 wide, white, 1px `neutral/75`. Header row pad 16 (40px avatar + name/meta), media 16:9 with top/bottom line, body pad 24 with h6-ish text.
- **Sample report card** (landing demo): 467 wide cell with left/right lines, image 260 high, body: logo + market chip, h5-sized question (24/1.2), three `n3` stats with l1 captions.
- **Content card** (`card` 359): white, pad 40, gap 24: marker → h5 title + p2 body (gap 4) → outlined button.
- **Article card** (`card` 350, `608:19428`): no fill or border; 16:9 image radius 4, gap 24, chip (16px icon + l1) → 12 → h6 20 title → 4 → p2 `neutral/800` body (ellipsis).
- **Dark card** (`card` 300×250): `neutral/900`, radius 2, pad 24, gap 80; label l1 `neutral/500` at the bottom. Report "power moves" on black (emoji/icon, h6 title, p2 body, l1 index).
- **card/faq**: row pad 0 / 32, inner pad 24 / 0, bottom line `neutral/100`; hover: line `neutral/950`; open: `neutral/50` fill, radius 4, no line, answer p2 `neutral/800`. Plus/minus icon 20px right.
- **card/feature** (accordion list): row pad 16, gap 16, bottom line. Collapsed: 28px mono index `neutral/500` + h6 label. Active: `neutral/50` fill, radius 4, index badge becomes black square with check, body + small filled button revealed. `is-last` drops the line.
- **card/insight**: outer pad 4, radius 4, fill `brand/*-10` (on black `-25`). Header pad 6 / 12: l2 "Insight from" + brand + l2 id at 50%. Inner panel radius 2, white (on black `neutral/1000`), pad 12: h6 title + p2 body. Hypothesis variant: black outer, `neutral/850` inner.
- **Testimonial card**: 708 cell with left/right lines, pad 40, gap 40: logo, quote (28/1.4, gray with black highlights), 120px photo (radius 4, 1px `neutral/100`) + name h6 20 + role l0 14 `neutral/500` + G2 rating (l0 black, 16px stars); side lines `neutral/100`; quote highlight `#0b0c0d` (hardcoded).
- **Form card** (hero/CTA): white, radius 4, pad 40, gap 80 between fields block and submit block. Title h4 two-tone, support p1 `neutral/800`.

- **Step dot** (`site/src/components/StepDot.astro`, Figma `number` `938:23476`): the one timeline marker. 48px: 24px disc in `--line` with a mono number in `--text`, halos at 36px (`--line` 50%) and 48px (`--line` 25%), on `--bg` so it masks the timeline line. `active`: `--accent` disc, `--accent-on` number, two ripples scaling 1 → 2 and fading .45 → 0 over 2.4s, 1.2s apart; under reduced motion one static ring (scale 1.5, 25%). Works on white and black surfaces through tokens. Use it for every numbered timeline (Scenarios hub "How trying one works", scenario page "How it finds them").

### 8.7 Data components

- **metric**: cell 358 × 270, pad 80 / 40, gap 12, centered: n1 64px value + l1 caption `neutral/800` (2 lines max).
- **Inline stat**: n3 24px value over l1 caption, 40px between stats.
- **Gauge**: segmented half-ring, segments 2px apart, filled in brand color, empty `neutral/800` on black. Value in h5/n2 + l1 caption inside.
- **Segmented bar**: rectangular segments with 2px gaps, filled left to right by category color; empty track `neutral/100`.
- **scale** (tone spectrum): row 52 high, pad 8, two pill labels at the ends (stroke `neutral/50` 2px), tick scale between with brand markers (avatar pins). Hover: row fill `neutral/50`, labels go black.
- **legend**: 16px square swatch (8px fill) + l1, or l2 only; gap 6.
- **point**: 20px numbered bullet + p2 (on black).
- **Number badge**: 24×24, `primary/450`, radius 1, l1 white centered ("01"). Used in the hero "what lands in your inbox" list.
- **Chart tooltip** (code): `neutral/950`, radius 6, pad 12 / 14, shadow-pop, n3 24px value, l1 rank line under a `#ffffff22` rule.

### 8.8 Layout components

- **header** (section header): type 1 = marker → 16 → headline (514 max in report) → 24 → tabs; type 2 = marker left column, headline + tabs right column; type 3 = type 1 + action button aligned to the headline baseline. Landing variant: headline 40px, carousel arrows right (124 wide, gap 8).
- **container** (bordered stack): row pad 24 / 0, top line, gap 24; `is-last` drops bottom padding.
- **divider**: see §7.
- **spaceholder**: 40 / 64 / 80 / 128 / 160 fixed spacers. Use them, not ad-hoc margins.
- **Site header and footer**: the main demandsense.com chrome (white bar, Inter 14, `#356ee7` Start free, blue newsletter card in footer). It is a different system; embed as-is, do not restyle to match.

### 8.9 Media and brand

- Logo: DemandSense wordmark 204×24, on-white and on-black versions.
- Avatars 80 (and 40, 20) circles with 1px `neutral/850` ring.
- Ad previews: 16:9 (200×113), 1:1, vertical 200×233. Always a 1px `neutral/75` inner border.
- Product screenshots sit on a saturated gradient panel (blue `primary/450` → `primary/side`, teal, or violet), 708×700, no radius, cards floating with soft blur. One panel per feature row, opposite the copy (chess layout).
- Trust row: G2 logo + 5.0 + five stars, certificate badges (GDPR, SOC 2, High Performer) 64 high, 24 apart.

### 8.10 Icons

24×24 line icons, `currentColor`, exported from Figma as SVG (never redrawn).

**Arrows: only the Figma `icon/arrow` set** (`116:2219`: up, down, right, left), exported to `design-system/icons/arrow-{up,down,left,right}.svg` (filled, `currentColor`). Use them for every arrow: buttons, slider prev/next, links, list marks. Outbound links use the up arrow turned 45°. Never draw or import another arrow (Agov, 23 Oct). In the tool: `arrow(dir, class)` from `site/src/arrows.ts`. Sizes in use: 12 (inside buttons' check rows), 16 (small buttons, chips), 18 (default buttons), 20 (FAQ, feature check), 24, 28 (conversion arrow). Set: arrow ×4, chevron ×4, check, check-circle, cross, link, minus, plus, square, play, no-card, chart-gantt, medal, newspaper, signpost, lightbulb, carousel, file-check, filter, gallery, gift, list, placeholder, scales, smile, speak, target, star, linkedin, g2.

### 8.11 Dot patterns

Dot grids fill empty structural space: the report sidebar below the navigation, the black overview panel behind the radar. They will be used more widely, so they are coded as CSS (`tokens.css`), not images.

**How Figma builds them.** Five 24×24 tiles on the components page (`04 · Patterns`, `358:36667`…`364:42784`), applied as Figma *pattern fills* at scale 0.25 (overview 0.26). That makes a **6px pitch with a 2px dot**, dot centered in its tile.

| Tile | Dot | Background | Used for | CSS |
|---|---|---|---|---|
| Sidebar (`206:54238`, id gone from the file) | 8px `neutral/950` at 25% | white | Report sidebar, 220 × 430 under the nav | `.pattern` |
| Overview (`270:96477`, id gone from the file) | 8px `neutral/900` | transparent, on black | Black overview panel, 1170 × 763, 5% fade on all four edges | `.pattern-on-black .pattern-fade` |
| `358:36667` | 8px `neutral/900` | transparent | Dark texture on white | `.pattern` + `--dot: var(--neutral-900)` |
| `358:36669` | 8px `neutral/0` | transparent | Light dots on black or color | `--dot: var(--neutral-0)` |
| `358:36671` | 16px `neutral/50` | transparent | Coarse, quiet texture | `.pattern-lg` |
| `364:42776` / `364:42784` | 8px 950 on white / 8px white on black | solid | Chart fills, legend swatches | `.pattern` with `--dot` and a background color |

Rules
- Pitch stays 6px for texture fills; scale only in multiples of 6 (12, 24) for chart fills.
- A pattern always sits in a bounded area (a panel or column), never across a whole section behind text.
- On black, always fade the edges (`.pattern-fade`, 5%) so the dots dissolve into the surface. Put the fade on a pattern-only layer: the mask also hides that element's own background.
- The report build approximated the overview with 1.3px `#2d2f33` dots at 55% opacity. Figma is the reference: 2px `neutral/900` dots.

### 8.12 Wave

The live ribbon on black heroes and CTAs. Code: `design-system/wave/` (sources) → `design-system/wave.js` (one self-contained bundle, three.js 0.180 included, 477 KB). Same engine as the Wave Lab study (`~/Documents/ChatGPT/Random/stripe-wave-lab`) and the report (`DS Report/prototype/scripts/wave/`).

```html
<div class="hero-wave" data-wave></div>                  <!-- defaults from wave/settings.json -->
<div class="hero-wave" data-wave='{"speed":0.05}'></div> <!-- per-instance overrides -->
<script src="design-system/wave.js" defer></script>
```

Placement: the host covers the whole hero; the script places the canvas with the live report's hero framing (`DS Report/prototype/scripts/wave/embed.js`, identical to ds-report.vercel.app): canvas at x = 33.13% of the hero width, y = 0, width 80.83%, height 94.94%; scene scale ×1.37; start time −1.5. The canvas overflows the right edge and is clipped by the host. Copy stays on solid black on the left. On mobile the host drops to 50% opacity behind the copy. Override per instance with `data-wave='{"frame":{"x":0,"w":1}}'`.

Behavior: renders only while on screen; `prefers-reduced-motion` draws one still frame; without WebGL the host stays plain black. Pixel ratio capped at 1.5.

Settings (`wave/settings.json`, from the Wave Lab inspector):

| Group | Values |
|---|---|
| Color | Gradient: `#3875F6` (primary/450) → `#FA8C16` (secondary/300) → `#3875F6`; background `#000000` |
| Motion | speed 0.100 · undulation −1.52 · wave frequency X 0.0058 · Z 0.0160 |
| Fold and twist | twist X −0.601 · Y 0.403 · Z −0.608 · falloff X 2.74 · Y 0.57 · Z 4.22 |
| Surface | fine lines 0.148 · glow 0.00 · grain 0.043 · saturation 0.44 · contrast 1.59 · hue shift 0.00 |
| Composition | Same as the live report: position (380, −301.7, −11.1) · rotation (−0.4496, −0.1176, 1.8744) · scale (9, 8, 5) · zoom 1 · time offset 17.5 |

To change the wave: export settings JSON from Wave Lab, replace `wave/settings.json`, run `npm install && npm run build` in `design-system/wave/`.

### 8.13 Feedback and overlays *(from the live report; no Figma comp yet)*

| Piece | Spec |
|---|---|
| **Toast** (`.toast`) | Fixed, centered, 24 from bottom. `neutral/950`, white p2 14px, pad 12 / 20, radius 4. Enters with 16px rise + fade, 200ms `ease-out`. Silent confirmations only ("Link copied"). |
| **Skip link** (`.skip-link`) | Fixed at left 16, parked at top −80, slides to top 16 on `:focus`. White, pad 12 / 20, radius 4, layer `--z-skip`. First focusable element. |
| **Dialog content** | Column, gap 16. Title 28px, tracking −5%. Media `max-height: 65vh`, `object-fit: contain`. Links in mono 14. Close: 28px glyph at top 8 / right 16 (share popup: `neutral/50` pill). Backdrop and shadow: §12, `--shadow-dialog`. |
| **Share popup** | Two columns (art + form); under 700px one column, art hidden, `max-height: 90vh`, submit 32 below the fields. |
| **Full-screen overlay** | Fixed `inset: 0`, `--z-overlay`; inner scroller uses `overscroll-behavior: contain`. Close = 36px blur pill (`neutral/1000-10` + blur 24) at 24 / 24. |
| **Stepper** (`.step`) | Auto-advancing steps. Badge 28 square, radius 1, mono 14 index (`neutral/500`); active badge turns black and swaps the index for an icon. Under the step a 2px `neutral/950` bar fills `width 0 → 100%` in 5s linear (`step-fill`); pauses when off-screen. State is `aria-pressed`. `steps-static` (reduced motion / print) shows every description, hides the bar. |
| **Pinned avatar halo** | Chart avatar on click: `--shadow-halo` (two grey rings, 4 and 8). Rings, not blur. |

Layers: `--z-raised` 1 · `--z-sticky` 10 · `--z-overlay` 50 · `--z-tip` 60 · `--z-skip` 100. Nothing else; no `9999`.

### 8.14 Scroll, bleed, print

- **Rails**: `scroll-snap-type: x mandatory`, children `scroll-snap-align: start`, scrollbar hidden (`.scroll-snap-x`). Arrows and keys still step one card.
- **Rails crop at the vertical edge lines, never at their container** (Agov, 22 Oct): the scroller runs out past the grid to the edge lines (`margin-inline: -edge-inset`, same `padding-inline` and `scroll-padding-inline`; `.to-edges` in the tool), so cards rest on the grid and slide under the lines. Applies to every horizontal rail and tab strip.
- **Overlay scrollers**: `overscroll-behavior: contain` (`.scroll-contain`).
- **Bleed** (`--bleed`): `edge + max(0, (100vw − 1512) / 2)`. Used with negative margins to push a band (ad rows, wide tables) from the main column to the viewport edge on any screen width.
- **Print** (report is printed): hide nav, skip link, toast, dialogs and `[data-action]`; kill transitions and show every reveal in its end state (`opacity: 1; transform: none`, including charts); force colors with `print-color-adjust: exact`; the report scales to `zoom: .65` at 1172 wide; dividers do not break pages (`break-after: avoid`).

### 8.15 Figures and infographics *(from the Sanity + Bequant study, approved 2026-10-19)*

Code: `tokens.css` (section "Figures and infographics"), `word-reveal.js`. Visual check: specimen → Figures.

**Principles**
1. One figure = one mechanism. Build it from 3–5 repeated primitives (slot, packet, line, node). A concept that needs a label inside the drawing is the wrong concept.
2. Monochrome outline (`neutral/500`, 1px) plus **one accent on what changes**: the hue of the pastel it sits on (`--cover-450`, §4.1); primary blue (`--primary-450`; `--primary-300` on black) only where there is no cover. Nothing else gets a color. Orange stays for "your part" in UI, not in drawings.
   Corners are tight (radius about 0.5–1.2 world units, cylinders stay round) and parts carry real detail: lattice, fins, rails, fixtures. Edgy, not soft (Oleksii, 19 Oct).
3. The stage sits in a card: title row above, mono caption (l2) below. Text never lives inside the drawing.
4. The loop shows before → after, ≤ 8s, starts only while the figure is on screen (`.in` set by IntersectionObserver), plays once or loops quietly. Reduced motion: end state, no movement.
5. A number backs the figure (`delta`).
6. Show the real artifact (actual rule text, actual code, actual UI) rather than an icon standing for it.

**Parts**

| Part | Class | Spec |
|---|---|---|
| Figure card | `.fig-card` | `--bg-subtle` (on black `neutral/900`), 1px `--line-card`, radius 4, pad 24, gap 16, no shadow. Stage min-height 200 with 1px guides at top and bottom; optional dot cell (`.fig-dots` + `.pattern-on-black .pattern-fade`, dot `neutral/800`) |
| Type chip | `.fig-tag > b` | Filled chip (§8.5: pad 4/8, radius 2, `--bg-muted`), Geist Mono 600 12 uppercase `--text`; name Inter 16 `--text`. `RULE Active queue management`. Replaces colour-coding of types in figure titles. Never square brackets |
| Expand | `.fig-expand` | 32px icon-only ghost, top-right, `aria-label`, opens a native `<dialog>` with the large figure. Only when the card size makes it unreadable |
| Corner marks | `.crop` | Four 8px corners, 1px `neutral/500`, 8px outside the box. Marks the figure in focus; one per card |
| Slot row | `.slots` `.slot-row` `.slot` | 28×36, radius 4, 1px outline. `.on` = held (`--text` 15%), `.hot` = live (accent fill). Row label l2 at 56px on the left. `.pkt` slots pulse empty → accent → empty, 6s, staggered by `--i` × 240ms |
| Line chart | `.fig-line` | One accent line 1.5px, dotted threshold `neutral/500` (`2 4`), quiet 1px guides. Line draws in 1.6s (`stroke-dashoffset`, `pathLength=1`; with `step-fill`, the only non-transform motion) |
| Delta | `.delta` | l2 caption over `n2` value + 24px circle with arrow (`success/300` outline, an icon, never a fill). Right of a 1px vertical line: name l1, company l2 `--text-meta` |
| Pipeline frame | `.pipe` | Three ruled cells (1px verticals, horizontals top and bottom), pad 24. Header l1; the active cell gets an 8px accent square. Real code or UI inside (mono 12/1.6). Stacks under 1000px. For the worked example and the question → skill → rule → answer flow |
| Index rail | `.tab-index` | Vertical, numbered `01 RULE`, `role=tab`. Active = solid `neutral/950` block with white text, radius 0 (on black: white block). Inactive `--text-body`. Square family: the pill tab (§8.4) stays the default; use the rail where tabs stack beside a panel |
| Scenario switcher | `.tab-switch` | Underline tabs, mono l1, radius 0. Active: `--bg-muted` plate + 2px bottom bar in `--text`. Switches which scenario a diagram plays |
| Hot block | `.hot-block` | The one accent-filled element on a screen: fill `--accent`, text `neutral/950`, radius 4. Never two on screen, never on a figure card. Approved for the landing; for a single "seat" or primary call-out |
| Prompt chips | `.prompt-chips` `.prompt-chip` | Suggested questions, right-aligned in a column, gap 8. `--bg-muted`, radius 2, pad 4/8, l1 `--text-body`. Hover `--text`; tap on touch |
| Stat strip | `.stat-strip` | Optional, bottom of hero. n3 value, l1 caption, `→` at the end of the caption for linked stats. 3 columns, gap 40; 1 column on mobile |
| Word reveal | `[data-word-reveal]` + `word-reveal.js` | Words go `--text-2` → `--text` as the block scrolls through the viewport (progress = scroll position, 150ms colour change per word). Reduced motion: all words at full colour. Markup inside (highlights) is kept. Use on quotes and one thesis sentence per section, not on lists |

**Rejected (do not add):** square brackets anywhere in UI chrome (type tags, action labels `[ CLICK TO CHAT ]`), meta-left list rows, pixel-mosaic photo filter (S9, parked), dotted row dividers, accent-coloured category line above a headline. Mega headline (96–112px) and a 100vh hero are parked. Stat strip stays optional.

---

### 8.16 Site header and library tab bar *(AI Resource site, decided 2026-10-23; do not change without asking)*

The site's own two nav bars (the main site header, and the Directory / Scenarios / Skills / Rules pill tabs on the hub pages). Not the demandsense.com chrome in §8.8.

- **Always black.** Both bars stay on the black surface on every page and at every scroll position. They never flip to white, whatever section is under them.
- **At the very top (page not scrolled), over a black hero** (Directory, hubs, Authors): the site header is transparent (the hero and its wave show through) and has no bottom line.
- **Over a white or light top** (detail pages with a tinted or white hero): the header stays filled black with its line even at the very top. A transparent header over a light surface is never used.
- **Once the page scrolls:** the site header fills black and gets its 1px bottom line (`--line` on black). Fill and line fade in together, 200ms `--ease-out`; nothing else changes.
- **Tab bar:** sits in the black hero; once it sticks under the site header it stays black, tightens its bottom padding (24 → 12) and takes over the single bottom line for the whole stack (the header drops its own while the tabs are stuck).
- Hub heroes reserve four headline lines (`min-height: 4lh` on the h1) so the tabs sit at the same height on all four hubs.

### 8.17 Illustration style *(AI Resource site, extracted 2026-10-23 from 7 reference images in `docs/illustration-refs/`)*

Applies to every illustration on the site: hub heroes, footer CTA, scenario covers, skill and rule art. Metaphors per slot: [`docs/illustration-metaphors.md`](docs/illustration-metaphors.md). Built with `anatomy` (object construction) and `iso-glow` (live parts, travelling pulses), restyled to this spec: their shading and glow are dropped.

**Camera.** True isometric, one angle for every piece (horizontal edges at ±30°). One object or one tight group, centred, floating on a flat field, filling about half the frame with generous air. No ground plane, no horizon, no cast shadow.

**Ink.** One near-black ink, `--neutral-950`, for every line. Never coloured strokes.

**One set of line weights for every illustration** (decided 2026-10-28): scenario figures, item icons, hub heroes and the CTA, light, dark and blue alike. Screen pixels (`vector-effect: non-scaling-stroke`), so a line is the same width at any size. Set once in `tokens.css`; never write a stroke width in a piece or a page.

| Line | Token | Width | Use |
|---|---|---|---|
| Outline | `--art-line` | 0.6px | Outer contour of each part, the live part too |
| Detail | `--art-detail` | 0.45px | Inner edges, ribs, rings, ticks, glyphs, text-stand-in bars |
| Dash | `--art-dash` | 0.9px | Static dashed detail lines; flow inside a tube at 2× |

Round joins and caps. Lines close cleanly at corners; no sketchy overshoot except on figures.

**Fill: three tones of one hue, plus white.** No gradients, no shading ramps, no glow, no blur.

| Role | Token | Where |
|---|---|---|
| Field | `--pastel-N` (cover) | Background behind the object |
| Body | `--pastel-N-200` at ~45% | Side faces, rims, stacked slices, back sheets, "on" keys |
| Tint | `--pastel-N-200` at ~20% | Inner faces, panels, coin faces, grid lines (as stroke at full 200 when thin) |
| Paper | `#fff` | Top faces, front sheets, the face the eye lands on |

Top faces read lightest (paper), sides darker (body). That is the only "lighting".

**Black accents.** Solid `--neutral-950` fills, used sparingly as punctuation, never as a large area:
- *Thickness slab:* one visible edge of a thin object (laptop base, phone, calendar spine, the front sheet of a stack) is a solid black extrusion 3–5 px deep.
- *No arrowheads, pins or dashed motion paths* (decided 2026-10-30): the moving part shows the motion itself.
- *One dark part:* at most one solid black element per piece (a screen, a visor, a slot, a ring binding).

**No dashed motion paths.** Dropped 2026-10-30: dashed arrows with triangle heads and origin dots read as annotations stuck on top of the drawing. Motion is shown by the parts moving; flow inside a tube (`.flow`) stays.

**Glyphs and details.** Outline glyphs (currency, check, plus, percent) drawn as shapes, not type. **No words or numbers inside a drawing** (the "Send" button in ref-3 is the one thing we don't take). Text stand-ins are rounded bars in tint. Motion marks: three short parallel strokes for speed, scalloped arcs for puffs. Repeated identical slices (coin stacks, sheets, keys) give rhythm.

**Corners.** Devices and plates: small radius (about 0.5–1.2 world units, the CLAUDE.md "edgy" rule). Paper and cards: sharp. Discs and cylinders stay round.

**Slot types.**

| Slot | Size | Colour | Motion |
|---|---|---|---|
| Hub heroes (directory, scenarios, skills, rules), footer CTA | Big | Coloured: up to three pastel hues in one piece, each part keeps its hue's three tones; ink and black accents shared | Auto, looping |
| Scenario | Big | Monochrome from the scenario's `cover` hue | Static on card; auto on the scenario page |
| Skill | Small | Monochrome from the skill's area cover | Static |
| Rule | Small | Monochrome from the rule's area cover | Static |

Small slots drop detail-weight lines under ~1px rendered.

**Motion (auto only).** No hover, press, focus or key triggers. The part that does the work moves along iso axes; flow inside tubes marches (`stroke-dashoffset`). Loops of 3–8 s with a rest beat. Every move eases with Figma's "Slow" spring (mass 1, stiffness 80, damping 20: no overshoot, long soft settle), about a second per move; only steady rotations and marching flow run linear. Each frame is redrawn from the piece's pure `draw(t)`, so moving parts stay in correct depth order. Pause when off-screen. `prefers-reduced-motion`: show the rest frame, no loop. Every animated piece ships its rest frame as a static SVG, which is also the card/static variant.

**Heroes and footer CTA: no panel, big, cropped** (decided 2026-10-23). The art sits straight on the section: on the black hub hero and on the white CTA card, with no pastel field behind it. It is scaled up around the piece's `focus` (the part that matters) and bleeds off the hero's right and bottom edges, or the CTA card's edges; the section crops it. On black heroes the art switches to the iso-glow look (`dark`): faces `--neutral-950` (tops) and `--neutral-1000` (sides), hairlines a 55/45 mix of `--neutral-500` and `--neutral-800` at 0.6px (detail `--neutral-800` at 0.45px); only the live part (`.lit`: the open drawer, the plucked teeth and pins, the die and finding card, the parts that pass the gauge) is primary blue with a soft, wide glow (SVG blur 10, 70% opacity). The art fills the right of the hero from under the header to the hero's bottom edge, starts where the headline ends and bleeds off the right; hidden below 1000px. The footer CTA keeps the coloured light version. Pastel fields stay for cards (scenario covers, skill and rule art).

**Build.** Kernel `site/src/art/iso.ts` (projection, `box`, `cyl`, `cylX/Y`, `curve`, `hue`). Each piece is a module exporting a `Piece` with a pure `draw(t)`; register it in `site/src/art/index.ts` and place it with `<IsoArt name="…" field="var(--pastel-N)" />`, which renders the rest frame at build time and replays `draw(t)` every frame while on screen, at 0.6× speed. Hub heroes add `has-art` to `.hero` (`<IsoArt … dark place={[right, top, w, h]} clip={w} class="hero-art" />`): copy then tally stack on the left on every hub (the directory shows entries and practitioners) so all four heroes are one height. Each piece's size and position come from the designer's layout in Figma `962:39212` ("Section 2", at 1512 wide): `place` pins the SVG to the hero's right edge and the top of the black band, `clip` is how far the visible box reaches in from the right. The art runs from under the header to the bottom of the black hero, with 160px fades into the black at the top and the bottom, and never changes the hero's size. The footer CTA art is pinned the same way inside the card, behind the copy; below 1000px it falls back to a fitted 4:3 box above the copy. The footer CTA uses `zoom={1.45}` and bleeds to the card's edges. Hues follow the item type colours (2026-10-23): a = scenario `#FA8C16`, b = skill `#02BCFD`, c = rule `#1764FF` (`--scenario-300`, `--skill-300`, `--rule-300`, set once on `.iso-panel` in `IsoArt.astro`). On a black hero the glow takes the hero's own type (`accent="scenario|skill|rule"`); the directory's open drawer takes its bank's colour. Pieces: directory = card-catalogue cabinet (`catalogue.ts`), footer CTA = card tray with a blank card filing itself (`tray.ts`).

## 9. Page patterns

### 9.1 Section anatomy (white)

```
[ spaceholder 160 ]
[ marker ]                                   (l1, orange square)
[ two-tone headline, max 650 ]   [ arrows ]  (h2 40px)
[ 40 ]
─────────────────────────────────────────── band line, fades past the edge lines (cell rows only)
│ 64 │ cell │ cell │ cell │ 64 │             edge lines outside the grid, 64 to the cells
───────────────────────────────────────────
```

Header alignment: left-aligned by default; centered for the "what you'll get" and "numbers" statement sections.

### 9.2 Hero (black)

Pad 106 top (below 66 site header), 40 sides, 40 bottom. Left column 766: logo chip → 16 → display headline (48, white, max 650) → 16 → lead p1 `neutral/300` with the promise sentence in white → push to bottom → l1 list label `neutral/300` + numbered list (blue badges, white p1, `neutral/800` row lines). Right column 650: white form card + trust row. Wave background behind the right side.

### 9.3 CTA (black)

Black band, full bleed. Left 766: marker + two-tone headline (white + `neutral/300`) + floating data cards (gauges, tone scale) over the wave. Right 650: white form card. Same layout as the hero, so a CTA reads as a return to the opening.

### 9.4 Feature chess rows

Two 6-col halves, 128 between rows. Copy half: marker → 24 two-tone headline (gray-led) → numbered list (mono index `neutral/500`, p1, bottom lines, 48 row height) → testimonial strip at the bottom. Media half: gradient panel with product UI.

### 9.5 Mapping the AI Standard structure onto this system

| Current section | Build with |
|---|---|
| Top bar "A DemandSense resource" + launch note | Logo chip + l1 date, in the black hero |
| Hero: title, maintained-by, deadline, 2 CTAs | Black hero, display two-tone, filled-on-black + outlined-on-black buttons |
| Numbered list (Rule/Skill/Scenario, practitioner, "Your seat") | `card/feature`-style rows: mono index, type chip (status-chip shape, neutral fill), title, practitioner l1; last row = CTA row |
| What we are building + 3 stats | White section, two-tone h2, metric cells in a bordered row |
| Why it is worth your time | Chess row with event photo/data panel |
| Rule / Skill / Scenario explainer | Pill tabs (01. RULE / 02. SKILL / 03. SCENARIO) switching one panel |
| Worked example table | Bordered `container` rows with line separators, mono column labels |
| Step flow (question → skill → rule → data → answer) | Numbered `point` chain on a lined grid; nodes = white cards radius 4 with `neutral/75` border |
| Scenario board | Same nodes on a `neutral/25` panel, connectors 1px `neutral/300`, chart colors only for node types |
| Tool grid | 4-col cells with vertical lines |
| Standard vs typical playbook | Two 6-col cells; left muted (`neutral/500` text), right full contrast; success/danger status chips |
| Credit, joining paths, benefits | `card/feature` accordion + content cards |
| Distribution timeline | Horizontal stepper: l1 phase labels, n3 dates, line connecting, orange dot on current |
| Closing CTA "Take your seat" | Black CTA band with form or email action |
| Footer disclaimer | Site footer + l2 LinkedIn trademark line |

Type badges for Rule / Skill / Scenario: same shape as status chips (pad 4/8, radius 2, l1), all three grey (`--bg-muted` fill, `--text`; on black `neutral/800`). No type colours: the word names the type. In figure titles use the type chip (§8.15).

---

## 10. Hover and pointer

From the report build (`report-v2.css`, `report-v2.js`, `tone-overlay.css`) and Figma interaction variables. All hover styles live inside `@media (hover: hover) and (pointer: fine)`; touch gets tap equivalents, never hover-only information.

| Element | Hover | Press / other |
|---|---|---|
| Button (all types) | One step toward contrast (§4.3); report build shortcut `filter: brightness(.94)` | `scale(.97)` on `:active`, fill `neutral/500` |
| Side nav link | label `neutral/500` → `neutral/950` | current: `neutral/50` fill (`aria-current`) |
| Table / matrix row | row fill `neutral/25`, 150ms | — |
| Card (rule, scenario, skill, author) | fill `neutral/25` (`--bg-subtle`), 150ms; no stroke change, no image scale, no arrow | — |
| Tone scale row | row fill `neutral/50`, both end pills turn black with white text | click or Enter opens the side panel; same style on `:focus-visible` |
| FAQ row | bottom line `neutral/100` → `neutral/950` | open: `neutral/50` fill, line hidden |
| Text field | underline → `neutral/950` | same on focus |
| Ad card | preview image `scale(1.02)`, 300ms, clipped by the 1px frame | — |
| Insight / power-move card (in a rail) | lift `translateY(-2px)` + `0 8px 24px #0000000f`, 240ms | — |
| Chart segment or legend item | **focus + context**: every other segment in the same chart, and in charts that share the data scope, drops to 28% opacity; the hovered key and its legend item stay full | click pins the tooltip; click outside unpins |
| Chart tooltip | follows the pointer at +16px, flips to the other side near the viewport edge; fades in 150ms; re-entering within 300ms shows it instantly (no fade); hides after 40ms | dark `neutral/950`, radius 6 |
| Positioning chart avatar | guide lines grow from the avatar to both axes | — |
| Card rail (carousels) | auto-scrolling rails pause while hovered or focused | mouse drag scrolls after a 5px threshold and suppresses the click; arrow keys and the arrow buttons step one card with an eased scroll |

Never: hover-only content, color-only hover on text below 14px, font-weight change on hover (layout shift), hover on touch devices.

---

## 11. Motion

| Token | Value | Use |
|---|---|---|
| `--t-fast` | 150ms | hover color, opacity, tooltip in |
| `--t-base` | 240ms | enter/exit, accordion, tab swap |
| `--t-build` | 700ms | chart build-in |
| `--ease-out` | cubic-bezier(.23, 1, .32, 1) | default for everything entering or changing |
| `--ease-in-out` | cubic-bezier(.77, 0, .175, 1) | elements moving across the screen |

Shipped patterns to reuse:
- Tab panel crossfade 200ms; text swap out 120ms, in 160ms.
- Segmented bars refill `scaleX(.2 → 1)` from the left, stagger 40ms per row.
- Chart columns `scaleY(0 → 1)` from the bottom, stagger 40ms; segments stagger 4–8ms.
- Gauges/rings fade + `scale(.92 → 1)`.
- Card image hover `scale(1.02)` over 300ms; row hover fills `neutral/25`.
- Toast and tooltip: 8–16px rise + fade.
- Count-up numbers with tabular figures.
- Build-ins start when the block enters the viewport, run once.

Figure loops and scroll word reveal: §8.15.

Reveal on view (`.motion-ready` gate, so no-JS shows everything): list items rise 8px + fade 300ms, stagger `--stagger-row` 30ms; chart bars `--stagger-bar` 40ms; pinned avatars `scale(.7 → 1)` + fade, stagger `--stagger-pin` 80ms, then drop to `--t-fast` once built. Keyframes: `view-in` (opacity), `bar-refill` (was `lvl-refill`: `scaleX(.2 → 1)` + fade), `step-fill` (2px progress, the one place `width` animates). Toast: §8.13.

Rules: animate `transform` and `opacity` only; name the properties (no `transition: all`); hover effects only inside `@media (hover: hover) and (pointer: fine)`; `prefers-reduced-motion: reduce` removes travel and scale, keeps opacity and timing. Accordions animate `grid-template-rows` 0fr → 1fr, not height.

---

## 12. Accessibility

- Focus: `outline: 2px solid var(--accent); outline-offset: 4px` on `:focus-visible` for buttons, links, tabs, summary.
- Skip link to main content.
- Tabs: `role="tablist"`, `aria-selected`, arrow-key navigation. Side nav: `aria-current="location"`.
- FAQ: `<details>/<summary>`. Dialogs: native `<dialog>`, Esc closes, `::backdrop` `#0008` + blur 4.
- Field labels are real `<label>`s; the l2 visual label is the label.
- Touch targets 44px minimum on mobile.
- Never put text under 24px in `neutral/500` on white, or any readable text in `neutral/300` on white (see §4.5).
- Charts get a text equivalent (caption or table) and never rely on color alone: legend labels sit next to values.

---

## 13. Do / Don't

Do
- Split every headline into black + gray in one block.
- Draw structure with 1px lines that reach the edges.
- Keep hero and CTA black, everything else white.
- Put numbers in Geist Mono and let them be large.
- Use `spaceholder` values for vertical gaps.

Don't
- Add a body paragraph under a section headline.
- Use shadows, gradients, or glows on cards (gradient panels behind product shots are the only gradient).
- Round anything except: buttons/tabs/pills (100), cards (4), chips (2/6), side tab and dialog (8), avatars and ring/gauge dots (circle, `50%`).
- Use `z-index` outside the layer scale (§8.13).
- Use Inter bold or any weight other than 500 (600 only for side tabs and brand names).
- Introduce colors outside the token list.
- Carry over the current site's navy glass, glowing orbs, or 3D tilted sheets.

---

## 14. Open questions

0. Figma re-check (see also `side-session-notes`): no disabled or focus variants exist anywhere; `pressed` stands in for focus on the text field. Report has a second CTA frame (`694:72683`) and a landing-style `after` block (`516:91351`: what-next, demo, features, numbers, faq, cta) not described here.

1. No mobile landing comps exist. §6.3–6.4 numbers come from the shipped report and the 375 blocker frames; design one mobile landing in Figma to lock them.
2. Disabled, loading, and error states are not in Figma (§8.1, §8.2 give defaults).
3. Five Figma components miss AA contrast (§4.5 table). Darken or accept.
4. Site header/footer belong to the demandsense.com system. Confirm the resource page embeds them unchanged.
5. §8.13–8.14 (toast, skip link, dialog, stepper, halo, print, 1000–1350 bleed) come from the live report, not Figma. Add comps or confirm.
6. Live report is not an exact match for tokens: it uses short names (`--n950`, `--orange`) and `neutral/200` as `#e9eaec` (our `neutral/75`). Our names follow Figma; do not copy its CSS vars.

---

## 15. AI Resource landing: approved deviations (2026-10-19)

Agreed with Oleksii for the landing rebuild (spec: `docs/superpowers/specs/2026-10-19-landing-rebuild-design.md`). They override §2, §3, §8.1 and §8.12 on the landing only.

- **Surfaces.** Besides hero and CTA, the key-promise section ("What you build with") is black. White sections may hold **dark cards** (`.surface-black`, radius 4, no shadow): "The Standard" card and the "Build a scenario with us" card. Its pair, "Send a skill", is a white card (1px `neutral/75` border, mock on `neutral/50`).
- **Headline + body.** Section headers may carry one body paragraph: marker → 16 → two-tone headline → 24 → p1 `neutral/800`, max 650. Temporary: the Vercel copy has long leads; revisit later.
- **Primary CTA on dark.** Blue filled `primary/450`, white label, not darkened (label contrast 4.16, below AA for 14px; accepted).
- **Wave in cards.** Every dark card hosts its own live `[data-wave]`, framed `{x:0, y:0, w:1.4, h:1.2–1.3}` so the ribbon fills the card with no canvas edge showing. Update: the dark cards ("The Standard", "Build a scenario with us") carry the hero wave scaled to the card width: hero frame `{x:.1296, y:-.0219, w:.8705, h:1.0219}` plus `aspect:1.288` (hero canvas w/h at 1440×952) and `k:1.507` (hero scale +10%), `fiberScale:0.5` (the card ribbon is ~0.49× the hero one; this keeps fibres as wide in pixels as in the hero, finer ones alias into stair-steps), default settings, 50% opacity like the hero, no fade; the canvas fills the card height, the view stays anchored at the top. The white Skill card has no wave. The black key section has no wave.
- **Sticky tabs.** Rule / Skill / Scenario explainers share one sticky pill-tab bar that follows scroll on every breakpoint; tabs also jump to their panel.
