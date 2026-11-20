// Stylesheets hold the theme and the few rules utilities can't express.
// No class selectors at all; element and attribute selectors only where the
// markup can't take classes, each behind a disable comment giving the reason.
export default {
  ignoreFiles: ["dist/**", "src/styles/fonts.css", "src/styles/tokens.css", "src/styles/theme.css"],
  rules: {
    "selector-max-class": 0,
    "selector-max-type": 0,
    "selector-max-attribute": 0,
    "selector-max-id": 0,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "theme",
          "utility",
          "custom-variant",
          "variant",
          "apply",
          "source",
          "plugin",
          "reference",
        ],
      },
    ],
  },
  overrides: [{ files: ["**/*.astro"], customSyntax: "postcss-html" }],
  reportNeedlessDisables: true,
  reportDescriptionlessDisables: true,
};
