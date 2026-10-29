# site

The tool: the community-built B2B AI Standard for LinkedIn Ads as a browsable site. Astro, static output.

- Run: `npm install` then `npm run dev` (port 4321) in this folder. Build: `npm run build` → `dist/`.
- Content: Sanity in production (`src/sanity.ts`, see `docs/cms.md`); locally, one Markdown file per item in `content/{scenarios,skills,rules,authors}/`. Fields and links between them are defined in `src/content.config.ts`. A scenario or skill that names a missing author, skill or rule fails the build (`src/check.ts`).
- Names that may change ("Scenarios"), areas and nav live in `src/site.ts`.
- Shared design system: `public/design-system` and `public/illustrations` are symlinks to the repo-root folders, so pages use the same `/design-system/...` paths as the landing. Base styles: `src/styles/site.css`; each component keeps its own styles.
- Shared components (`src/components/`): `SiteHeader`, `TabBar`, `SectionHead`, `ScenarioCard`, `SkillCard`, `RuleRow`, `AuthorCard`, `SubmitBand`, `SiteFooter`. Layout: `src/layouts/Base.astro`.
- Pages: `/` Home, `/collection` (library; `/directory` redirects), `/scenarios`, `/skills`, `/rules`, `/authors` (hubs + `[slug]` detail pages), `/contribute`, `/art-lab` (figure previews).
