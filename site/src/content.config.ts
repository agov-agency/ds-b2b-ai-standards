import { defineCollection, reference, z } from 'astro:content';
import { source } from './sanity';
import { AREAS } from './site';

const area = z.enum(Object.keys(AREAS) as [keyof typeof AREAS]);

// Animated figure picked in the CMS: a piece from src/art by name, plus how it sits (option A in docs/cms.md)
const art = z.object({
  piece: z.string(),
  variant: z.enum(['color', 'mono', 'dark']).default('color'),
  accent: z.enum(['scenario', 'skill', 'rule', 'brand']).optional(),
  zoom: z.number().default(1),
}).optional();

// Scenario page sections
const detailPage = z.object({
  catches: z.object({
    headline: z.string(),
    context: z.string().optional(),
    body: z.string().optional(),
    note: z.string().optional(),
    findings: z.array(z.object({ value: z.string(), title: z.string(), text: z.string() })).default([]),
  }).optional(),
  comesBack: z.object({
    headline: z.string(),
    context: z.string().optional(),
    items: z.array(z.object({ title: z.string(), caption: z.string(), src: z.string().optional() })).default([]),
  }).optional(),
  get: z.object({
    intro: z.string(),
    context: z.string().optional(),
    options: z.array(z.object({ label: z.string(), text: z.string() })).min(1),
    note: z.string().optional(),
    source: z.string().url().optional(),
    sourceNote: z.string().optional(),
  }).optional(),
  // Headline under the "Using it" marker: every marker carries a headline
  usingHead: z.object({ headline: z.string(), context: z.string().optional() }).optional(),
  using: z.array(z.object({ icon: z.string().optional(), title: z.string(), text: z.string() })).default([]),
  steps: z.array(z.object({
    phase: z.string().optional(),
    title: z.string(),
    text: z.string(),
    note: z.string().optional(),
    skill: reference('skills').optional(),
    key: z.boolean().default(false),
  })).default([]),
  // Closing CTA above the footer; the template falls back to default copy for any missing field
  cta: z.object({ headline: z.string().optional(), context: z.string().optional(), button: z.string().optional(), note: z.string().optional() }).optional(),
}).default({});

const authors = defineCollection({
  loader: source('authors'),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),       // job position
    company: z.string().optional(),
    photo: z.string().optional(),       // /illustrations/... or remote URL; initials show until it arrives
    about: z.string().optional(),       // ~40 words
    // icon: a ready glyph (linkedin, x, github, web) or 'custom' with a logo URL; old entries carry only the label
    links: z.array(z.object({ label: z.string(), url: z.string().url(), icon: z.string().optional(), logo: z.string().optional() })).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const rules = defineCollection({
  loader: source('rules'),
  schema: z.object({
    number: z.number().int(),
    title: z.string(),
    why: z.string(),                    // one line under the title
    area,
    featured: z.boolean().default(false),
    author: reference('authors').default('demandsense'),
    lead: z.string().optional(),        // hero lead; falls back to `why`
    // Rule page sections (owned by the rule page template); each one renders only when present
    page: z.object({
      advises: z.object({ text: z.string(), source: z.string().optional(), url: z.string().url().optional() }).optional(),
      adds: z.string().optional(),
      reason: z.string().optional(),
      mattersLess: z.string().optional(),
      signs: z.array(z.object({ see: z.string(), do: z.string() })).default([]),
      voices: z.array(z.object({
        name: z.string(),
        author: reference('authors').optional(),
        company: z.string().optional(),
        context: z.string().optional(),
        quote: z.string(),
        source: z.string().optional(),
        url: z.string().url().optional(),
        note: z.string().optional(),
      })).default([]),
      cta: z.object({ headline: z.string().optional(), context: z.string().optional(), button: z.string().optional(), note: z.string().optional() }).optional(),
    }).default({}),
  }),
});

const skills = defineCollection({
  loader: source('skills'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    area,
    status: z.enum(['ready', 'next']),
    author: reference('authors').optional(),
    rules: z.array(reference('rules')).default([]),
    icon: z.string().optional(),
    order: z.number().default(99),
    // Skill page (Figma 919:23317): hero facts, then what it does, the prompt, the output, how it works, use it when, related
    changes: z.string().optional(),     // "Reads your data, changes nothing"
    firstRun: z.string().optional(),
    connectors: z.array(z.string()).default([]),
    illustration: z.string().optional(),
    art,
    page: z.object({
      does: z.object({ headline: z.string(), context: z.string().optional(), body: z.array(z.string()).default([]) }).optional(),
      prompt: z.object({
        headline: z.string(),
        context: z.string().optional(),
        tabs: z.array(z.object({ label: z.string(), text: z.string() })).min(1),
        install: z.array(z.object({ label: z.string(), text: z.string() })).default([]),
        source: z.string().url().optional(),
      }).optional(),
      output: z.object({
        headline: z.string(),
        context: z.string().optional(),
        stats: z.array(z.object({ value: z.string(), label: z.string(), accent: z.boolean().default(false) })).default([]),
        items: z.array(z.object({ title: z.string(), caption: z.string(), src: z.string().optional() })).default([]),
        note: z.string().optional(),      // **bold** allowed
      }).optional(),
      steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      stepsNote: z.object({ headline: z.string(), context: z.string().optional() }).optional(),
      useWhen: z.array(z.object({ icon: z.string().optional(), title: z.string(), text: z.string() })).default([]),
      partOf: z.string().optional(),       // one line on the scenario card under Related
    }).default({}),
  }),
});

const scenarios = defineCollection({
  loader: source('scenarios'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: area,
    cadence: z.string(),
    status: z.enum(['ready', 'soon']),
    author: reference('authors'),
    stat: z.object({ value: z.string(), label: z.string() }).optional(),
    firstRun: z.string().optional(),
    youNeed: z.string().optional(),
    youGet: z.string().optional(),
    connectors: z.array(z.string()).default([]),
    skills: z.array(reference('skills')).default([]),
    rules: z.array(reference('rules')).default([]),
    illustration: z.string().optional(),
    art,
    cover: z.number().int().min(1).max(20).optional(),   // --pastel-N behind the cover art
    order: z.number().default(99),
    page: detailPage,
  }),
});

export const collections = { authors, rules, skills, scenarios };
