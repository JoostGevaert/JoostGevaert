import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import { remarkGlossary } from "./src/plugins/remark-glossary.mjs";

// Links to src/content/glossary.md#<term> become popup links (src/plugins/remark-glossary.mjs).
const glossary = [remarkGlossary, { glossaryFile: "./src/content/glossary.md" }];

export default defineConfig({
  site: "https://joost.engineer",
  integrations: [mdx()],
  markdown: {
    // unified (remark), not the default Sätteri: the glossary is a remark plugin.
    // MDX posts inherit this processor.
    processor: unified({ remarkPlugins: [glossary] }),
    shikiConfig: { theme: "css-variables" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
