// Token values for places CSS variables can't reach (social card images,
// web manifest). Read from the DTCG files Terrazzo compiles, so there is
// still one source of truth.
import semantic from "../../tokens/color/semantic.tokens.json";
import light from "../../tokens/color/scales.light.tokens.json";
import dark from "../../tokens/color/scales.dark.tokens.json";

type Tree = Record<string, any>;
const sets = { light: [light, semantic], dark: [dark, semantic] } as const;

type Value = { colorSpace: "oklch"; components: [number, number, number]; hex: string };

function lookup(name: string, theme: "light" | "dark"): Value {
  const m = name.match(/^(teal|seq-teal|seq-plum|seq-indigo|div|biv|cat)-(.+)$/);
  const path = m ? [...m[1].split("-"), m[2]] : [name];
  for (const set of sets[theme]) {
    let node: Tree | undefined = (set as Tree).color;
    for (const p of path) node = node?.[p];
    if (node?.$value) {
      const v = node.$value;
      if (typeof v === "string") {
        // alias like {color.teal.10}
        const ref = v
          .slice(1, -1)
          .replace(/^color\./, "")
          .replace(/\./g, "-");
        return lookup(ref, theme);
      }
      return v as Value;
    }
  }
  throw new Error(`Unknown color token: ${name}`);
}

/**
 * sRGB hex of a color token by its CSS name, e.g. "teal-10", "biv-22", "ink":
 * the fallback the token files carry for places that can't read OKLCH
 * (Satori social cards, the web manifest, chart interpolation).
 */
export const color = (name: string, theme: "light" | "dark" = "light"): string =>
  lookup(name, theme).hex;

/** The token's design value, as an `oklch(L C H)` CSS string. */
export function oklch(name: string, theme: "light" | "dark" = "light"): string {
  const [l, c, h] = lookup(name, theme).components;
  return `oklch(${l} ${c} ${h})`;
}
