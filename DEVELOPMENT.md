# Developing joost.engineer

Joost Gevaert's blog for his (thought) experiments and side projects. Astro + MDX, with design tokens compiled by Terrazzo.

```sh
pnpm install
pnpm dev         # tokens + dev server
pnpm build       # tokens + static build to dist/
```

## Tokens

`design-system/tokens.json` is the design session's token list. `pnpm tokens:export` converts it to DTCG files in `tokens/` (light/dark resolver: `tokens/joost.resolver.json`), and `tz build` compiles those to `src/styles/tokens.css`. Never paste values into stylesheets by hand. The brand book is `design-system/BRAND.md`.
