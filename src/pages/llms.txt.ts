// /llms.txt (llmstxt.org): a plain-text map of the site for agents. Each post
// links its source on GitHub as raw Markdown/MDX, so an agent reads the text and
// the glossary links without scraping HTML.
import type { APIRoute } from "astro";
import { getPosts } from "../lib/posts";
import { site } from "../site.config";

const raw = (path: string) =>
  `https://raw.githubusercontent.com/${site.github.handle}/${site.github.handle}/main/${path}`;

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const lines = [
    "# joost.engineer",
    "",
    "> Joost Gevaert's blog for his (thought) experiments and side projects. Each post's source is Markdown (MDX) on GitHub; web-development terms link to one glossary.",
    "",
    "## Posts",
    "",
    ...posts.map((post) =>
      `- [${post.data.title}](${raw(post.filePath ?? "")}): ${post.data.description ?? ""}`.trimEnd(),
    ),
    "",
    "## Design system",
    "",
    `- [BRAND.md](${raw("design-system/BRAND.md")}): the brand rules in plain English, each with its reason`,
    `- [tokens.json](${raw("design-system/tokens.json")}): every value of the design system as a named token, with its use`,
    `- [AGENTS.md](${raw("AGENTS.md")}): how agents work on this site`,
    "",
    "## Reference",
    "",
    `- [Glossary](${raw("src/content/glossary.md")}): web-development terms, one meaning each`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
