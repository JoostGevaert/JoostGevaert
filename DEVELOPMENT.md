# Developing joost.engineer

Joost Gevaert's blog for his (thought) experiments and side projects. Astro + MDX, with design tokens compiled by Terrazzo.

```sh
npm install
npm run dev     # tokens + dev server
npm run build   # tokens + static build to dist/
```

## Tokens

`design-system/tokens.json` is the design session's token list. `npm run tokens:export` converts it to DTCG files in `tokens/` (light/dark resolver: `tokens/joost.resolver.json`), and `tz build` compiles those to `src/styles/tokens.css`. Never paste values into stylesheets by hand. The brand book is `design-system/BRAND.md`.
