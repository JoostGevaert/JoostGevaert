# AGENTS.md

Instructions for coding agents working on joost.engineer, Joost Gevaert's blog.
Developer notes, commands and the full stack are in [DEVELOPMENT.md](DEVELOPMENT.md).

## Style

Before changing anything visual, read design-system/BRAND.md.
Every value comes from design-system/tokens.json:
a missing value becomes a token.

- Style with Tailwind utilities only. A missing value becomes a token, missing
  behavior an `@utility` in `src/styles/global.css`, a repeated set of utilities
  a component. No arbitrary values (`w-[37px]`): `pnpm lint` fails on them.
- After changing `design-system/tokens.json`, run `pnpm tokens:export`.
- Fonts ship with the site; no font CDNs, no analytics.
- American English, sentence case, first person (BRAND.md, Voice).

## Posts

- Posts are MDX in `src/content/posts/`. Link web-dev terms to the glossary,
  `src/content/glossary.md`, as `[term](../glossary.md#term)`; add a `###` term
  there first if it's missing.

## Checks

Run `pnpm lint`, `pnpm test` and `pnpm build` before you finish.
