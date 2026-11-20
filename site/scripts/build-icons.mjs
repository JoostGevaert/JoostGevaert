// Builds the favicon set in public/ from the design system's j.e tiles.
// Run with `npm run icons` when the tiles change; outputs are committed.
//   favicon.svg          switches tile with prefers-color-scheme
//   favicon.ico          16/32/48 (PNG-in-ICO), light-chrome tile
//   favicon-32.png, apple-touch-icon.png (180), icon-192.png, icon-512.png
//   site.webmanifest
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const asset = (f) => new URL(`../design-system/assets/logos/${f}`, import.meta.url);
const pub = (f) => new URL(`../public/${f}`, import.meta.url);
const light = readFileSync(asset("je-tile-light.svg"), "utf8"); // ink tile, for light chrome
const dark = readFileSync(asset("je-tile-dark.svg"), "utf8");   // light tile, for dark chrome

// favicon.svg: the light-chrome tile with its fills moved into classes, plus a
// prefers-color-scheme block that swaps in the dark-chrome tile's colors.
const fills = (svg) => ({
  tile: svg.match(/rx="[^"]+" fill="(#[0-9a-f]{6})"/i)[1],
  letters: [...svg.matchAll(/fill="(#[0-9a-f]{6})"/gi)].map((m) => m[1]),
});
const L = fills(light), D = fills(dark);
const [lTile, lInk, lDot] = [L.tile, ...new Set(L.letters.slice(1))];
const [dTile, dInk, dDot] = [D.tile, ...new Set(D.letters.slice(1))];
let svg = light
  .replace(/ width="\d+" height="\d+"/, "")
  .replace(`fill="${lTile}"`, 'class="t"')
  .replaceAll(`fill="${lInk}"`, 'class="i"')
  .replaceAll(`fill="${lDot}"`, 'class="d"')
  .replace(/>/, `><style>.t{fill:${lTile}}.i{fill:${lInk}}.d{fill:${lDot}}` +
    `@media (prefers-color-scheme:dark){.t{fill:${dTile}}.i{fill:${dInk}}.d{fill:${dDot}}}</style>`);
writeFileSync(pub("favicon.svg"), svg);

const png = (size, src = light) => sharp(Buffer.from(src), { density: 300 }).resize(size, size).png().toBuffer();

// ICO with embedded PNGs (supported by every current browser).
const sizes = [16, 32, 48];
const imgs = await Promise.all(sizes.map((s) => png(s)));
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let offset = head.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  head.writeUInt8(s, e); head.writeUInt8(s, e + 1);
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(imgs[i].length, e + 8); head.writeUInt32LE(offset, e + 12);
  offset += imgs[i].length;
});
writeFileSync(pub("favicon.ico"), Buffer.concat([head, ...imgs]));

writeFileSync(pub("favicon-32.png"), await png(32));
writeFileSync(pub("icon-192.png"), await png(192));
writeFileSync(pub("icon-512.png"), await png(512));
// Apple draws its own rounded mask, so the touch icon is the full square
// tile color with the mark at the same 76% fill.
const square = light.replace(/ rx="[^"]+"/, "");
writeFileSync(pub("apple-touch-icon.png"), await png(180, square));

writeFileSync(pub("site.webmanifest"), JSON.stringify({
  name: "joost.engineer",
  short_name: "j.e",
  description: "Joost Gevaert's blog for his (thought) experiments and side projects.",
  start_url: "/",
  display: "standalone",
  background_color: "#fcfcfd",
  theme_color: "#1c2024",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
}, null, 2) + "\n");
console.log("Icons written to public/");
