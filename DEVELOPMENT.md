# Developing joost.engineer

Joost Gevaert's blog for his (thought) experiments and side projects. Astro + MDX, styled with Tailwind v4, design tokens compiled by Terrazzo. The brand book is [`design-system/BRAND.md`](design-system/BRAND.md).

```sh
pnpm install
pnpm dev       # tokens + dev server
pnpm build     # tokens, type-check (tsc), static build to dist/
pnpm preview   # serve dist/
pnpm test      # Vitest on the pure core in src/lib
pnpm lint      # ESLint (incl. Tailwind classes) + Stylelint
pnpm format    # Prettier
pnpm deploy    # run the GitHub Pages workflow on main (pushing to main does the same)
```

## Tokens and styling

`design-system/tokens.json` is the design session's token list. `pnpm tokens:export` turns it into:

- DTCG files in `tokens/` (light/dark resolver `tokens/joost.resolver.json`), which `tz build` compiles to `src/styles/tokens.css`;
- `src/styles/theme.css`, Tailwind's theme: token colors (`text-ink`, `bg-teal-3`), fonts, radii, `space-1` as the spacing unit (so `p-4` = 16 px = `space-3`, `p-6` = 24 px = `space-4`), and `type-*` and `opacity-texture-*` utilities.

Style with utilities only. A missing value becomes a token, missing behavior an `@utility` in `src/styles/global.css`, and a repeated set of utilities a component. No class rules in stylesheets and no arbitrary values (`w-[37px]`): ESLint and Stylelint fail on both. Class strings kept in a variable are named `*Classes` so the linter checks them.

## Fonts

Self-hosted from `@fontsource-variable/*`, bundled at build (`src/styles/fonts.css`, written by `pnpm fonts`). No font CDN: it would send every visitor's IP address to a third party.

## Other generated files

- `pnpm icons`: favicons and manifest icons in `public/` from the j.e tiles.
- `pnpm textures`: optimized textures in `public/textures/`.

## Type checking and linting

TypeScript 7 (`tsc`) checks `.ts` files. It has no JS API yet, so typescript-eslint and `astro check` can't run: ESLint parses TypeScript with `@babel/eslint-parser`.
