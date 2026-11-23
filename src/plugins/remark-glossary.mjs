// Glossary links, after bedrock-docs (bedrock-engineer/bedrock-docs,
// src/plugins/remark-glossary.mjs).
// - The glossary is one Markdown file, src/content/glossary.md. A term is a ###
//   heading; its first paragraph is the definition. Aliases in parentheses at the
//   end of the heading are link targets too: "Design token (token)" answers #token.
// - A post links a term with a plain relative link, `[token](../glossary.md#token)`,
//   which also works when the source is read on GitHub or by an agent. Here it
//   becomes a <popup-link> carrying the definition (src/scripts/popup-link.ts shows
//   it in a card), pointing at /glossary/#token.
// - The terms a post links are listed under "Key terms" at its end.
import { readFileSync } from "node:fs";
import path from "node:path";
import GithubSlugger, { slug as slugify } from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { popupLinkProperties, popupLinkTag } from "./popup-link.mjs";

const glossaryTerm = ({ title, definition }) => ({
  hName: popupLinkTag,
  hProperties: popupLinkProperties({ term: title, definition }),
});

function aliasSlugs(heading) {
  const match = heading.match(/^(.*\S)\s*\(([^)]+)\)$/);
  if (!match) {
    return [];
  }
  const [, name, aliases] = match;
  return [name, ...aliases.split(",")].map((alias) => slugify(alias.trim()));
}

export function readGlossary(source) {
  const tree = unified().use(remarkParse).parse(source);
  const slugger = new GithubSlugger();
  const terms = {};
  tree.children.forEach((node, index) => {
    if (node.type !== "heading") {
      return;
    }
    const heading = toString(node);
    const id = slugger.slug(heading);
    const next = tree.children[index + 1];
    if (node.depth !== 3 || next?.type !== "paragraph") {
      return;
    }
    const term = { title: heading, definition: toString(next), id };
    for (const slug of [id, ...aliasSlugs(heading)]) {
      if (terms[slug] && terms[slug] !== term) {
        throw new Error(`Glossary: "${slug}" names both "${terms[slug].title}" and "${heading}".`);
      }
      terms[slug] = term;
    }
  });
  return terms;
}

// On the glossary page each alias needs an element with its id, so #token jumps
// to "Design token (token)".
function addAliasAnchors(tree) {
  visit(tree, "heading", (node, index, parent) => {
    const anchors = aliasSlugs(toString(node)).map((id) => ({
      type: "glossaryAlias",
      data: { hName: "span", hProperties: { id, className: ["block", "scroll-mt-24"] } },
      children: [],
    }));
    if (node.depth !== 3 || anchors.length === 0) {
      return;
    }
    parent.children.splice(index, 0, ...anchors);
    return index + anchors.length + 1;
  });
}

const termLink = /(?:^|\/)glossary(?:\.mdx?|\/)?#([\w-]+)$/;

export function remarkGlossary({ glossaryFile, route = "/glossary/" }) {
  const terms = readGlossary(readFileSync(glossaryFile, "utf8"));
  return (tree, file) => {
    if (file.path && path.resolve(file.path) === path.resolve(glossaryFile)) {
      addAliasAnchors(tree);
      return;
    }
    const used = new Map();
    visit(tree, "link", (node, index, parent) => {
      const slug = node.url.match(termLink)?.[1];
      if (!slug) {
        return;
      }
      const term = terms[slug];
      if (!term) {
        throw new Error(`Glossary: no term "${slug}" (linked from ${file.path}).`);
      }
      if (parent.type === "glossaryTerm") {
        return;
      }
      node.url = `${route}#${slug}`;
      if (!used.has(term.id)) {
        used.set(term.id, term);
      }
      parent.children[index] = { type: "glossaryTerm", data: glossaryTerm(term), children: [node] };
    });
    if (used.size === 0) {
      return;
    }
    tree.children.push(
      { type: "heading", depth: 2, children: [{ type: "text", value: "Key terms" }] },
      {
        type: "list",
        ordered: false,
        spread: false,
        children: [...used.values()].map((term) => ({
          type: "listItem",
          spread: false,
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "glossaryTerm",
                  data: glossaryTerm(term),
                  children: [
                    {
                      type: "link",
                      url: `${route}#${term.id}`,
                      children: [{ type: "text", value: term.title }],
                    },
                  ],
                },
              ],
            },
          ],
        })),
      },
    );
  };
}
