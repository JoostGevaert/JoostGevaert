import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

// Tokens whose CSS value DTCG can't express (percentage radii) carry the exact
// CSS string in this extension.
const CSS_OVERRIDE_EXT = "engineer.joost.css";

// Color variables drop the "color." prefix so they match the design system's
// names (--teal-10, --bg, --cat-plum); everything else dash-joins its path
// (--space-4, --radius-pill, --font-sans, --type-display-font-size).
const variableName = (token) =>
  `--${token.id.replace(/^color\./, "").replace(/\./g, "-")}`;

// Tokens that change with the theme: everything defined in the theme files.
const themed = ["color.teal.*", "color.bg", "color.surface", "color.ink", "color.ink-muted",
  "color.line", "color.guide", "color.grid-cell", "color.logo-dot", "color.texture", "color.cat.*"];

export default defineConfig({
  tokens: "./tokens/joost.resolver.json",
  outDir: "./src/styles/",
  plugins: [
    css({
      filename: "tokens.css",
      variableName,
      transform: (token) => token.$extensions?.[CSS_OVERRIDE_EXT]?.value,
      permutations: [
        { input: { theme: "light" }, prepare: (c) => `:root {\n${c}\n}` },
        {
          // System default: dark when the OS asks for it and no explicit choice is stored.
          input: { theme: "dark" },
          include: themed,
          prepare: (c) => `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${c}\n  }\n}`,
        },
        {
          input: { theme: "dark" },
          include: themed,
          prepare: (c) => `:root[data-theme="dark"] {\n${c}\n}`,
        },
      ],
    }),
  ],
});
