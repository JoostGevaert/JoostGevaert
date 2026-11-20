// ESLint 10. TypeScript 7 has no JS API, so typescript-eslint can't run:
// TypeScript is parsed by Babel (types stripped), and `tsc` does the type
// checking. Tailwind classes are checked against the real theme in
// src/styles/global.css by eslint-plugin-better-tailwindcss.
import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";
import astro from "eslint-plugin-astro";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
import { MatcherType, SelectorKind } from "eslint-plugin-better-tailwindcss/types";
import globals from "globals";

const babelOptions = (plugins) => ({
  requireConfigFile: false,
  babelOptions: { babelrc: false, configFile: false, parserOpts: { plugins } },
});

export default [
  { ignores: ["dist/", ".astro/", "node_modules/", "src/styles/fonts.css"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,ts}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: babelOptions(["typescript"]),
      globals: { ...globals.node, ...globals.browser },
    },
  },
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: { parser: babelParser, ...babelOptions(["typescript", "jsx"]) },
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["**/*.{astro,ts}"],
    plugins: { "better-tailwindcss": betterTailwind },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/styles/global.css",
        selectors: [
          ...getDefaultSelectors(),
          // Class strings kept in variables: name them *Classes.
          {
            kind: SelectorKind.Variable,
            name: "Classes$",
            match: [{ type: MatcherType.String }, { type: MatcherType.ObjectValue }],
          },
        ],
      },
    },
    rules: {
      ...betterTailwind.configs["recommended-error"].rules,
      // Prettier owns line length; class order still enforced.
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      // Every value comes from the theme: no arbitrary values like w-[37px].
      "better-tailwindcss/no-restricted-classes": [
        "error",
        {
          restrict: [
            {
              pattern: "\\[.*\\]",
              message: "Arbitrary values are not allowed: add a theme token or @utility.",
            },
          ],
        },
      ],
    },
  },
  {
    // TypeScript-only syntax the JS rules misread.
    files: ["**/*.{ts,astro}"],
    rules: { "no-undef": "off", "no-unused-vars": "off" },
  },
];
