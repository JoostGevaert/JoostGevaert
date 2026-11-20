// Token values for places CSS variables can't reach (social card images,
// web manifest). Read from the DTCG files Terrazzo compiles, so there is
// still one source of truth.
import semantic from "../../tokens/color/semantic.tokens.json";
import light from "../../tokens/color/scales.light.tokens.json";
import dark from "../../tokens/color/scales.dark.tokens.json";

type Tree = Record<string, any>;
const sets = { light: [light, semantic], dark: [dark, semantic] } as const;

/** Hex value of a color token by its CSS name, e.g. "teal-10", "biv-22", "ink". */
export function color(name: string, theme: "light" | "dark" = "light"): string {
  const m = name.match(/^(teal|seq-teal|seq-plum|seq-indigo|div|biv|cat)-(.+)$/);
  const path = m ? [...m[1].split("-"), m[2]] : [name];
  for (const set of sets[theme]) {
    let node: Tree | undefined = (set as Tree).color;
    for (const p of path) node = node?.[p];
    if (node?.$value) {
      const v = node.$value;
      if (typeof v === "string") {
        // alias like {color.teal.10}
        const ref = v.slice(1, -1).replace(/^color\./, "").replace(/\./g, "-");
        return color(ref, theme);
      }
      return v.hex;
    }
  }
  throw new Error(`Unknown color token: ${name}`);
}
