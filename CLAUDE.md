# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Statement

**DemandSense AI Resource** — a resource landing page that introduces a course-like resource, framed explicitly as a *resource* (community-built, free, maintained by DemandSense) rather than a product. The current live version is https://the-ai-standard.vercel.app/ ("The B2B AI Standard for LinkedIn Ads"). We keep its page structure and rebuild the UI with the DemandSense report design language.

### Tasks

Tracked in [`TASKS.md`](TASKS.md).

### Sources

- Local report project: `../DS Report/` (`prototype/` static HTML/CSS/JS with `DESIGN.md`, `illustrations/`)
- Figma file `jiNJOOlaeRo2jTiNU64MQh` (DS Report):
  - Tool landing page: https://www.figma.com/design/jiNJOOlaeRo2jTiNU64MQh/DS-Report?node-id=788-45522
  - Report: https://www.figma.com/design/jiNJOOlaeRo2jTiNU64MQh/DS-Report?node-id=516-88440
  - All canvas: https://www.figma.com/design/jiNJOOlaeRo2jTiNU64MQh/DS-Report?node-id=408-47603
  - Components: https://www.figma.com/design/jiNJOOlaeRo2jTiNU64MQh/DS-Report?node-id=119-2806
- Structure reference: https://the-ai-standard.vercel.app/

## Skills

Installed at project level (`.claude/skills/`, `.claude/agents/`, `.claude/settings.json`):

| Skill | Source | Use for |
| --- | --- | --- |
| `emil-design-engineering` | `.claude/skills/emil-design-engineering/` (from provided archive) | Animations, UI polish, forms, touch/a11y, component patterns, marketing pages, performance |
| `impeccable` | `npx impeccable install` | Design, critique, audit, polish, typeset, colorize, animate, extract, design context (`/impeccable init`) |
| `hallmark` | `npx skills add nutlope/hallmark` | Anti-AI-slop pages, audits, redesigns, design extraction from URLs/screenshots |
| `mattpocock-skills` | `claude plugins install mattpocock-skills` | Engineering workflow: grill-me, to-spec, to-tickets, tdd, diagnosing-bugs, code-review, handoff |
| `caveman` | https://github.com/juliusbrussee/caveman | Terse replies (token saving), terse commits/reviews |
| `ponytail` | https://github.com/dietrichgebert/ponytail | Lazy-senior bias: smallest working diff, no over-engineering |
| `hairline-create` / `hairline-adopt` | `npx skills add lucasmarkes/hairline` (source in `.agents/skills/`, symlinked into `.claude/skills/`) | Illustrations: isometric line figures that react to the pointer (see below) |
| `anatomy` | `npx skills add wheresryan22/anatomy` (source in `.agents/skills/`, symlinked into `.claude/skills/`) | Detailed shaded isometric SVG machines that explain an idea (see below) |

Security note: `hallmark` and `hairline` scored "Med Risk" (`anatomy`: Low Risk) on Snyk in the installer; skim `.claude/skills/hallmark/` and `.agents/skills/hairline-*/` before trusting them.

### Illustrations (hairline)

Chosen illustration skill for the landing: **hairline**. Reasons: monochrome line style fits the report language (lines over fills, no shadows), colors come from theme variables so they map to our tokens (neutral 950, primary blue `--primary-450` as the single accent; `--primary-300` on black), and it ships as an npm component (`@lucasmarkes/hairline`) as well as standalone HTML.

- `/hairline-create <idea>`: new figure. It offers 2-3 concepts first; pick one, don't skip. Output is one self-contained `hairline-<name>.html`. Run it from a scratch folder (e.g. `illustrations/`), not the repo root.
- `/hairline-adopt <file.svg>`: rebuild an existing SVG (icon, logo, stage plan) as a figure. Use this for the top-view stage illustration.
- Rules: one figure = one idea; a concept that needs a label is not a concept. Never edit `kernel.js` or `bench.html`. Do not hand over a figure the validator (`validate.mjs`) rejects. `look.mjs` needs a browser (installs `playwright-core` once).
- Map the hairline theme variables (plate, highlight, edge, mid/low tone, stroke width) to DS tokens; one accent colour only, on the live part: primary blue (`--primary-450`, `--primary-300` on black), never orange (orange stays for "your part" in UI). No text drawn inside the figure.
- Edgy, not soft: every illustration (figures, icons, anatomy) uses tight corners, radius about 0.5–1.2 world units; cylinders and discs stay round. Rich in real detail (lattice, fins, rails, fixtures) rather than plain blocks.
- Embedding: prefer the npm component (`npm i @lucasmarkes/hairline`) over iframing the HTML. Respect `prefers-reduced-motion` (no auto tour), and give each figure a static fallback.
- Use sparingly: big figures only in the 2-3 slots the brief names (stage in spotlight/benefits, optional hero graphic). Small icons stay simple line icons, not interactive figures.
- `iso-glow` is global in `~/.claude/skills` (dark glow aesthetic); don't use it here unless asked.

### Illustrations (anatomy, secondary)

Installed, but off-style by default: it draws solid, four-tone-shaded isometric machines (many small parts), which is heavier than the report's flat lines-and-whitespace look. Hairline is the default; use anatomy only when a slot needs a detailed "object as explanation" figure, and then restyle it to our palette.

- Invoke: `/anatomy <one-line idea>`. Needs Node 20.10+ and Chrome/Chromium for its checks. Closest example first: `.agents/skills/anatomy/examples/` (`dial-indicator` smallest; `test-rig` is the quality bar). `node examples/<name>/build.mjs --light` for the light theme.
- Principle: the object is the explanation. Invent one real physical thing whose working is the concept; avoid labelled boxes and arrows. One camera angle, one accent on the part to watch, no text inside the drawing (labels sit outside).
- Constraints for this project: light theme on white sections, dark on dark sections; accent = primary blue only (`--primary-300` on black, `--primary-450` on white); tight corners; skip WebGL shaders and 3D mode (weight, reduced-motion); no PDF print or gallery publish. Keep a static SVG fallback and honour `prefers-reduced-motion`.
- Candidate slots: "Rule/Skill/Scenario" explainers (a rule as a gauge, a skill as a machine with role inputs, a scenario as an assembly). Do not put two different illustration styles in the same section.

### UI/UX & Animation Guidelines (CRITICAL)

**Every UI/UX implementation MUST include animations and follow design engineering principles.** When building or modifying any frontend component, page, or interaction:

1. **Always use the `emil-design-engineering` skill** (`.claude/skills/emil-design-engineering/`) as the reference for animations, UI polish, accessibility, and component design patterns.
2. **All state transitions must be animated** — modals, expand/collapse, enter/exit, tab switches, page transitions, loading, hover/focus.
3. **Use Motion (Framer Motion)** for component-level animation if the stack is React; CSS transitions only for simple property changes (color, opacity, border).
4. **Animation defaults:**
   - Enter/exit: `ease-out`, 150–250ms
   - Page transitions: 300–400ms max
   - Hover/focus: `ease`, 100–150ms
   - Springs for draggable/interactive elements
5. **Never ship static UI** — no abrupt show/hide, no jumpy layout shifts.
6. **Accessibility is mandatory:** respect `prefers-reduced-motion`, `aria-label` on icon buttons, 44px tap targets on mobile, `@media (hover: hover)` for hover effects.
7. **Avoid:** `transition: all`, animating `height`/`width` (use `transform`/`opacity`), hover effects on touch, font-weight changes on hover, `z-index: 9999` (use a fixed scale).

Detailed guides:
- Animations & easing: `.claude/skills/emil-design-engineering/animations.md`
- UI polish (typography, shadows, gradients): `.claude/skills/emil-design-engineering/ui-polish.md`
- Forms & controls: `.claude/skills/emil-design-engineering/forms-controls.md`
- Touch & accessibility: `.claude/skills/emil-design-engineering/touch-accessibility.md`
- Component design patterns: `.claude/skills/emil-design-engineering/component-design.md`
- Marketing pages: `.claude/skills/emil-design-engineering/marketing.md`
- Performance: `.claude/skills/emil-design-engineering/performance.md`

### Which skill when

- Building/changing UI → `emil-design-engineering` first, then `impeccable` (shape/polish) and `hallmark` (avoid generic look).
- Reviewing UI → `impeccable audit|critique`, `hallmark audit`.
- Extracting design from Figma/report/screenshots → `impeccable extract|document`, `hallmark study`. (Only when the user says to start.)
- Planning/specs/tickets/TDD → `mattpocock-skills`.
- Keep output small → `ponytail` for code, `caveman` for prose.

## Design Language

`DESIGN.md` is the source of truth; read it before any UI work and use `design-system/tokens.css` instead of raw values. Core rules:
- Hero and CTA sections are black; every other section is white.
- Headlines are one text block in two tones (black claim + gray context). No body paragraph under section headlines.
- Structure is drawn with 1px edge-to-edge lines: horizontal dividers and vertical edge lines. Vertical lines sit outside the grid, 40px from the viewport edge, and keep at least 64px before any content (mobile: 16 + 16).
- 12-column grid: 104px margin, 94px columns, 16px gutter, 1304 wide (8 col / 64 margin at 700–999, 4 col / 32 margin below 700). Sections are 208px apart (160 at 700–999, 104 below 700).
- Inter Medium for text, Geist Mono SemiBold uppercase for labels, buttons, and numbers.

Preview the specimen: start the `design-system` server from `.claude/launch.json` and open `/specimen.html`.

## Code Style Notes

- Minimal comments: only workarounds, design decisions, corner cases.
- Prefer the shortest working solution (ponytail); no speculative abstractions.
- Static HTML/CSS/JS is acceptable (the report prototype is built that way); pick the stack when Task 3 starts.

## Repo Layout

- `CLAUDE.md` — this file
- `TASKS.md` — task tracking
- `.claude/skills/` — emil-design-engineering, impeccable, hallmark
- `.claude/agents/` — impeccable helper agents
- `.claude/settings.json` — project-scope plugins (caveman, ponytail, mattpocock-skills)
- `skills-lock.json` — hallmark install lock
- `DESIGN.md` — the design system
- `design-system/tokens.css` — tokens, surfaces, text styles; `specimen.html` — visual check; `fonts/` — Inter, Geist Mono. No images stored: visual reference = Figma node IDs in `DESIGN.md` + the specimen
- `design-system/tokens.css` and the rest of `design-system/` (wave, word-reveal, specimen) and `illustrations/` (figures, icons) are shared by the landing and the tool
- `landing/` — current promo landing: `index.html`, `landing.css`, `landing.js`, `assets/`. Served at `/landing/`; root `vercel.json` rewrites `/` to it. Uses root-absolute paths (`/design-system/...`, `/illustrations/...`), so serve from the repo root
- `site/` — the tool (scaffold only, see `site/README.md`); content files in `site/content/{scenarios,skills,rules,authors}/`
- `studio/` — Sanity Studio for the directory content (see `docs/cms.md`)
- `lab/` — design experiments, not deployed
- `docs/` — internal briefs, decisions, specs (incl. `landing-rebuild-brief.md`)
- `.claude/launch.json` — local static servers: `design-system` (port 4180, design-system folder), `landing` (port 4181, repo root; open `/landing/`), `lab` (4182, repo root)
