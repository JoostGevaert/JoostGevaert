// Web versions of the background textures in public/textures/:
// SVG textures through svgo (1 decimal is plenty at texture opacity; the
// contours drop from ~600 KB to ~150 KB), the drawing PNGs as WebP.
// Run with `npm run textures` when the design system's textures change.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { optimize } from "svgo";
import sharp from "sharp";

const src = (f) => new URL(`../design-system/assets/${f}`, import.meta.url);
const out = new URL("../public/textures/", import.meta.url);
mkdirSync(out, { recursive: true });

for (const kind of ["contours", "s2", "h3", "a5"]) {
  for (const theme of ["light", "dark"]) {
    const svg = readFileSync(src(`textures/je-${kind}-${theme}.svg`), "utf8");
    const { data } = optimize(svg, { floatPrecision: 1, multipass: true });
    writeFileSync(new URL(`${kind}-${theme}.svg`, out), data);
  }
}
for (const theme of ["light", "dark"]) {
  await sharp(readFileSync(src(`large/je-drawing-${theme}.png`)))
    .webp({ quality: 82 })
    .toFile(new URL(`drawing-${theme}.webp`, out).pathname);
}
console.log("Textures written to public/textures/");
