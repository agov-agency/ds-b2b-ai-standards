# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Statement

**The B2B AI Standard for LinkedIn Ads** — a community-built, free library of scenarios, skills and rules for running LinkedIn Ads with AI, maintained by DemandSense and framed as a *resource*, not a product. The original site is https://the-ai-standard.vercel.app/; we keep its content and structure and rebuild the UI in the DemandSense report design language. Two parts: `site/` (the tool: Home, Directory, Scenarios, Skills, Rules, Authors, Contribute) and `landing/` (the earlier promo landing, frozen).

## Repo, branches, deploys

- Repository: **github.com/agov-agency/ds-b2b-ai-standards** only. The old `aftermoonest/demandsense-ai-resource` repo and its Vercel projects are frozen: never push to or deploy from them. Local checkouts on the Mac may still point at the old remote, so check `git remote -v` before pushing.
- Git: commit and push to **`dev`** only. Never push or merge to `main` without explicit approval from Agov.
- Vercel: account agov.agency, project `ds-b2b-ai-standards` (framework Astro, builds `site/`, Node 24). Git deploys per branch:
  - `main` → production https://ds-b2b-ai-standards.vercel.app
  - `dev` → https://ds-b2b-ai-standards-dev.vercel.app (also `ds-b2b-ai-standards-git-dev-agov-agency.vercel.app`)
  - Vercel Authentication / password protection is off, so previews open without login.
  - Env: `SANITY_PROJECT_ID=t6leg115` on all targets (`SANITY_DATASET` defaults to `production`). Without it the build reads the local Markdown.
- The root `vercel.json` (rewrite `/` → `/landing/`) belongs to the old static landing deploy; the current project does not serve `landing/`.

## Run and build

- Site (Astro 5): `cd site && npm install && npm run dev` → http://127.0.0.1:4321 (`.claude/launch.json` → `site`). `npm run build` → `site/dist/`, `npm run preview` to check it.
  - Locally, content comes from `site/content/*.md` unless `SANITY_PROJECT_ID=t6leg115` is set (then it reads the published Sanity data, as Vercel does).
  - A scenario or skill naming a missing author, skill or rule fails the build (`site/src/check.ts`).
  - `site/public/design-system` and `site/public/illustrations` are symlinks to the repo-root folders; keep them.
  - The dev server uses file polling (`astro.config.mjs`) because the native watcher missed edits.
  - `/art-lab` previews the code-drawn figures.
- Studio (Sanity 6, Node ≥ 22.12): `cd studio && npm install && npm run dev` → http://localhost:3333. `npm run deploy` publishes the hosted Studio.
- Static servers for the design system, landing and lab: `.claude/launch.json` (`python3 -m http.server`, serve from the repo root because of root-absolute paths).

## CMS (Sanity)

Full notes: `docs/cms.md`. Read it before touching schemas or `site/src/sanity.ts`.

- Project `t6leg115` (org AGOV Agency, Free plan), dataset `production` (public, no token needed to read). Studio: https://ds-b2b-ai-standards.sanity.studio, source in `studio/` (`sanity.config.ts`, `sanity.cli.ts`, `env.ts`).
- In the CMS: directory content only. **Home and Contribute stay in code** (`site/src/pages/index.astro`, `contribute.astro`, `site/src/copy.ts`).
- Schemas (`studio/schemas/`, one file per type, shared fields in `shared.ts`):
  - Items: `author`, `rule`, `skill`, `scenario`. Detail-page sections live in a nested `page` object on each item.
  - Collections, referenced by items (rename once, every item follows; `collections.ts`): **Categories** (title, slug, cover colour, fallback icon, Rules hub headline), **Cadences**, **Connectors** (name + logo picked from `design-system/logos`, or an uploaded own logo; standard set in `studio/connectors.json`).
  - `order` is hidden and set automatically (a new document goes last). Cover colour is a dropdown of the 20 pastel hues, random by default.
- Site side: `site/src/sanity.ts` is the content loader. With `SANITY_PROJECT_ID` it queries published documents at build time (GROQ projects references to slugs and images to CDN URLs, so entries have the same shape as the Markdown); without it, it reads `site/content/{scenarios,skills,rules,authors,categories}/`. Connectors exist only in Sanity (empty locally). Field schemas: `site/src/content.config.ts`.
- Illustrations stay in code and are only *picked* in the CMS:
  - Figures: `site/src/art/*.ts`, each a `Piece` with `draw(t)`, registered in `pieces` in `site/src/art/index.ts`. The CMS stores which figure and how it sits (`art`: piece, variant, zoom), never colour.
  - Separate, non-overlapping sets: **scenarios get a figure** (`ART_POOLS.scenario`; for now every existing figure, hub heroes included, as placeholders), **rules and skills get a line icon** (`illustrations/icons`), each from its own list (`ICON_POOLS` in `site/src/icons.ts`). Studio rejects a figure or icon already used by another item of the same type. No pick = the fallback (scenario cover, category icon).
  - Accent colour follows the background hue: every colour group and the live part take the cover's hue (`--cover-450`).
  - New figure: add a module, add it to `pieces` and to one pool, redeploy the Studio. `ItemArt.astro` renders it; an unknown name falls back instead of breaking the build.
  - The Studio's art picker imports `../site/src/art`, so `sanity.cli.ts` allows `..` in Vite.
- Migrations: `studio/migrations/`, one-off scripts, dated, safe to re-run. Run from `studio/`: `npx sanity exec migrations/<file>.ts --with-user-token`. They write to the production dataset, so ask Agov first. Initial import: `npm run import` (builds `seed/content.ndjson` from the Markdown and imports with `--replace`).
- Schema change workflow: edit `studio/schemas` → push to `dev` → run any migration → `npm run deploy` in `studio/` → redeploy `dev` on Vercel. A schema change that needs a migration breaks the Vercel build until the migration runs (the live deploy stays up).
- Publishing: Publish in Studio → Sanity webhook → Vercel Deploy Hook → static rebuild (about a minute). **Live for `dev` since 27 Oct 2026** (webhook POST on create/update/delete, drafts excluded, filter on `author`, `rule`, `skill`, `scenario`, `category`, `cadence`, `connector`). `main` needs its own Deploy Hook + second webhook (the Free plan's other slot) once `dev` is merged.
- Access from cloud sessions: needs network access to `api.sanity.io` and `t6leg115.api.sanity.io` and `SANITY_AUTH_TOKEN` (Editor) in the cloud environment; otherwise run Sanity commands on Agov's Mac (CLI logged in there).

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
| `fun-isometric` | `npx skills add kelvinkn17/skills@fun-isometric` (source in `.agents/skills/`, symlinked into `.claude/skills/`) | Reference only: After Effects-grade motion keys (`kit/motions.ts`) and part-by-part construction. Not its look (thick outlines, sparkles, Riso colours) |

Security note: `hallmark` and `hairline` scored "Med Risk" (`anatomy`: Low Risk) on Snyk in the installer; skim `.claude/skills/hallmark/` and `.agents/skills/hairline-*/` before trusting them.

### Illustrations (hairline)

Chosen illustration skill for the landing: **hairline**. Reasons: monochrome line style fits the report language (lines over fills, no shadows), colors come from theme variables so they map to our tokens (neutral 950, primary blue `--primary-450` as the single accent; `--primary-300` on black), and it ships as an npm component (`@lucasmarkes/hairline`) as well as standalone HTML.

- `/hairline-create <idea>`: new figure. It offers 2-3 concepts first; pick one, don't skip. Output is one self-contained `hairline-<name>.html`. Run it from a scratch folder (e.g. `illustrations/`), not the repo root.
- `/hairline-adopt <file.svg>`: rebuild an existing SVG (icon, logo, stage plan) as a figure. Use this for the top-view stage illustration.
- Rules: one figure = one idea; a concept that needs a label is not a concept. Never edit `kernel.js` or `bench.html`. Do not hand over a figure the validator (`validate.mjs`) rejects. `look.mjs` needs a browser (installs `playwright-core` once).
- Map the hairline theme variables (plate, highlight, edge, mid/low tone, stroke width) to DS tokens; one accent colour only, on the live part. General rule: the accent takes the hue of the pastel behind it (`--cover-450`, `--cover-200`; DESIGN §4.1), on every figure and icon; primary blue (`--primary-450`, `--primary-300` on black) only where there is no cover; never orange (orange stays for "your part" in UI). No text drawn inside the figure.
- Who uses what: scenarios use figures (`site/src/art`, `ART_POOLS`); rules and skills use line icons (`illustrations/icons`), each from its own set (`ICON_POOLS` in `site/src/icons.ts`), never shared.
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
- Stack: Astro (static output) for `site/`, Sanity for content; the landing and lab are static HTML/CSS/JS.

## Repo Layout

- `CLAUDE.md`, `DESIGN.md` (design system, source of truth), `PRODUCT.md`, `TASKS.md`
- `.claude/skills/`, `.claude/agents/`, `.claude/settings.json`, `.agents/skills/` (hairline, anatomy), `skills-lock.json`
- `design-system/` — `tokens.css`, `specimen.html`, `fonts/`, `icons/`, `logos/` (connector logos), `wave/`, `wave.js`, `word-reveal.js`. Shared by site and landing. No images stored: visual reference = Figma node IDs in `DESIGN.md` + the specimen
- `illustrations/` — shared hairline figures and line icons (`icons/`, `icons.js`)
- `site/` — the tool (Astro): `src/pages` (`index` Home, `directory`, `scenarios`, `skills`, `rules`, `authors`, `contribute`, `art-lab`), `src/components`, `src/layouts`, `src/art` (code-drawn figures), `src/sanity.ts` (content loader), `src/content.config.ts`, `src/site.ts` (names, areas, nav), `content/` (Markdown fallback). See `site/README.md`
- `studio/` — Sanity Studio: `schemas/`, `migrations/`, `seed/`, `connectors.json`
- `landing/` — earlier promo landing (`index.html`, `landing.css`, `landing.js`, `assets/`), frozen; root-absolute paths, serve from the repo root
- `lab/` — design experiments, not deployed
- `docs/` — briefs, decisions, specs, `cms.md`
- `.claude/launch.json` — local servers: `design-system` (4180), `landing` (4181, open `/landing/`), `lab` (4182), `site` (4321)
