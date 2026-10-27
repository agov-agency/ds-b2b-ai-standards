# CMS (Sanity)

Directory content (authors, skills, scenarios, rules, their pages and illustrations) lives in Sanity. Home and Contribute stay in code.

## How it fits

- `studio/`: Sanity Studio (the editor). Schemas in `studio/schemas/`, one per type; shared fields in `shared.ts`. Hosted by Sanity at https://ds-b2b-ai-standards.sanity.studio (`npm run deploy` in `studio/`).
- `site/src/sanity.ts`: the site's content source. With `SANITY_PROJECT_ID` set (Vercel), it reads published documents from the public dataset at build time; without it (local), it reads `site/content/*.md`. Queries turn references into slugs and images into CDN URLs, so pages see the same data either way.
- Publishing: Publish in Studio → Sanity webhook → Vercel Deploy Hook → static rebuild (1–2 min). No server.

## Content model

- Items: `scenario`, `skill`, `rule`, `author`.
- Shared lists, referenced by items: `category` (title, colour, fallback icon, Rules hub headline), `cadence`, `connector` (logo picked from `design-system/logos`, or an uploaded one; the standard set is `studio/connectors.json`, loaded by `migrations/2026-10-27-connectors.ts`). Locally, categories come from `site/content/categories/*.md`.
- Pictures, each type from its own pool, never shared: scenarios and skills get an illustration (animated figure), rules get an icon (`illustrations/icons`). Studio rejects a figure or icon already used by another item of the same type.

## Illustrations (option A)

Figures are code: `site/src/art/*.ts`, each a `Piece` with `draw(t)`. The CMS stores which figure and how it sits (`art`: piece, variant color/mono/dark, zoom). Colour is not stored: every colour group and the live part take the hue of the cover the figure sits on (`--cover-450`), as the hairline icons do. The pickers list only `ART_POOLS.scenario` / `ART_POOLS.skill` from `site/src/art/index.ts` (hub heroes are in neither) and preview them live. A new figure = add a module, add it to `pieces` and to one pool, redeploy the Studio. `ItemArt.astro` renders it (cards get the still frame), else the fallback (scenario cover, category icon). An unknown name falls back instead of breaking the build.

## Setup (once)

1. Project in sanity.io/manage, dataset `production` (public).
2. `studio/env.ts`: project id (or `SANITY_STUDIO_PROJECT_ID`).
3. `cd studio && npm install && npx sanity login && npm run import`: builds `seed/content.ndjson` from the Markdown files and imports it with images (`--replace`: re-running overwrites the same ids).
4. `npm run deploy` for the hosted Studio.
5. Vercel → ds-b2b-ai-standards → Settings → Environment Variables: `SANITY_PROJECT_ID` (+ `SANITY_DATASET` if not `production`).
6. Vercel → Settings → Git → Deploy Hooks: hook for the production branch. Sanity → API → Webhooks: POST to that URL, on create/update/delete, filter `_type in ["author","rule","skill","scenario"]`, drafts off.
7. Sanity → Members: invite editors (Free plan: Administrator or Viewer only).

After the import is checked, Sanity is the source; the Markdown files stay only as the local fallback until they are removed.
