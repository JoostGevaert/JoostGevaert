// Post-build step after `tz build`: Terrazzo writes the light theme to :root
// and the dark theme's color tokens to a second :root block (see
// terrazzo.config.mjs). This merges them into one set of tokens, each themed
// color emitted once as light-dark(<light>, <dark>), and puts
// `color-scheme: light dark` on :root so light-dark() follows the system
// until the theme switch sets color-scheme itself.
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../src/styles/tokens.css", import.meta.url);
const css = readFileSync(file, "utf8");
const MARKER = "/* dark permutation, merged by scripts/light-dark.mjs */";

const at = css.indexOf(MARKER);
if (at < 0) throw new Error("tokens.css has no dark permutation: run `tz build` first");
const darkBlock = css.slice(at);
const dark = new Map(
  [...darkBlock.matchAll(/^\s*(--[\w-]+):\s*(.+);$/gm)].map((m) => [m[1], m[2]]),
);

let merged = 0;
const out = css
  .slice(0, at)
  .trimEnd()
  .replace(/^(\s*)(--[\w-]+):\s*(.+);$/gm, (line, indent, name, light) => {
    const d = dark.get(name);
    if (d === undefined || d === light) return line;
    merged++;
    return `${indent}${name}: light-dark(${light}, ${d});`;
  })
  .replace(/^:root \{\n/m, ":root {\n  color-scheme: light dark;\n");

writeFileSync(file, out + "\n");
console.log(`light-dark: merged ${merged} themed tokens into src/styles/tokens.css`);
