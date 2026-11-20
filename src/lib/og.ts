// Social cards (BRAND.md, Social cards): 1200 x 630 PNG per post, rendered at
// build time. Layers, bottom to top: surface, the post's texture at 30% (or
// the post's own chart/map on the right, when it sets `ogFigure`), the
// wordmark, the date + type line, the title and the color strip.
// Text is laid out by Satori (to SVG paths) and everything is composited by sharp.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import satori from "satori";
import sharp, { type OverlayOptions } from "sharp";
import { color } from "./tokens";
import type { Texture } from "./posts";

export const W = 1200,
  H = 630;
const root = process.cwd();
const file = (p: string) => readFileSync(resolve(root, p));
const fonts = [
  {
    name: "Source Sans 3",
    weight: 700 as const,
    data: file("node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff"),
  },
  {
    name: "Source Code Pro",
    weight: 600 as const,
    data: file(
      "node_modules/@fontsource/source-code-pro/files/source-code-pro-latin-600-normal.woff",
    ),
  },
];

const TEXTURE_FILES: Record<Texture, string> = {
  drawing: "design-system/assets/large/je-drawing-light.png",
  contours: "design-system/assets/textures/je-contours-light.svg",
  s2: "design-system/assets/textures/je-s2-light.svg",
  h3: "design-system/assets/textures/je-h3-light.svg",
  a5: "design-system/assets/textures/je-a5-light.svg",
};

/** Image at `opacity`, scaled to height H, as a PNG buffer. */
async function layer(src: Buffer, height: number, opacity = 1) {
  const img = sharp(src, { density: 300 }).resize({ height }).ensureAlpha();
  if (opacity === 1) return img.png().toBuffer();
  // Multiply alpha by `opacity` with a tiled 1 px mask (dest-in keeps the
  // image where the mask is, scaled by the mask's alpha).
  const flat = await img.png().toBuffer();
  const mask = {
    input: Buffer.from([0, 0, 0, Math.round(255 * opacity)]),
    raw: { width: 1, height: 1, channels: 4 as const },
    tile: true,
    blend: "dest-in" as const,
  };
  return sharp(flat).composite([mask]).png().toBuffer();
}

export interface CardInput {
  title: string;
  date: string;
  type: string;
  texture: Texture;
  /** Absolute path of the post's own chart/map image, if any. */
  figure?: string;
}

export async function renderCard({
  title,
  date,
  type,
  texture,
  figure,
}: CardInput): Promise<Buffer> {
  const ink = color("ink"),
    surface = color("surface");
  const composites: OverlayOptions[] = [];

  if (figure) {
    // The post's result, at card size, on the right: 640 x 630, cropped to fill.
    const fig = await sharp(readFileSync(figure), { density: 300 })
      .resize(640, H, { fit: "cover" })
      .png()
      .toBuffer();
    composites.push({ input: fig, left: W - 640, top: 0 });
  } else {
    // The texture at 30%, full height, set against the right edge so the j.e
    // sits clear of the title.
    const tex = await layer(file(TEXTURE_FILES[texture]), H, 0.3);
    const { width = 0 } = await sharp(tex).metadata();
    composites.push({ input: tex, left: Math.max(0, W - width), top: 0 });
  }

  const label = {
    fontFamily: "Source Code Pro",
    fontWeight: 600,
    fontSize: 22,
    color: color("link"),
  };
  const tree = {
    type: "div",
    props: {
      style: { width: W, height: H, display: "flex", position: "relative" },
      children: [
        {
          type: "div",
          props: {
            style: { position: "absolute", left: 72, top: 150, ...label },
            children: `${date} · ${type}`,
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 72,
              bottom: 80,
              maxWidth: figure ? 520 : 640,
              fontFamily: "Source Sans 3",
              fontWeight: 700,
              fontSize: 56,
              lineHeight: 1.06,
              letterSpacing: "-0.01em",
              color: ink,
              display: "block",
            },
            children: title,
          },
        },
        // Strip of unequal color blocks along the bottom: indigo, teal, plum.
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 0,
              bottom: 0,
              width: W,
              height: 16,
              display: "flex",
            },
            children: [
              { type: "div", props: { style: { flex: 3, background: color("biv-22") } } },
              { type: "div", props: { style: { flex: 1, background: color("teal-10") } } },
              { type: "div", props: { style: { flex: 1, background: color("biv-02") } } },
            ],
          },
        },
      ],
    },
  };
  const svg = await satori(tree as any, { width: W, height: H, fonts });
  composites.push({ input: Buffer.from(svg), left: 0, top: 0 });

  // Wordmark top left, 32 px type size (≈ 251 px wide), from the logo file.
  const wordmark = await sharp(file("design-system/assets/logos/wordmark-light.svg"), {
    density: 300,
  })
    .resize({ width: 251 })
    .png()
    .toBuffer();
  composites.push({ input: wordmark, left: 72, top: 72 });

  return sharp({ create: { width: W, height: H, channels: 4, background: surface } })
    .composite(composites)
    .png()
    .toBuffer();
}

/** Resolve a post's `ogFigure` (relative to the post file) to an absolute path. */
export const figurePath = (postFile: string, ogFigure: string) =>
  resolve(root, dirname(postFile), ogFigure);
