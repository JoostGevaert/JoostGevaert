import { describe, expect, it } from "vitest";
import source from "../../design-system/tokens.json";
import { color, oklch } from "./tokens";

// The design session's tokens.json is the fixture: every color must come out
// of the exported DTCG files unchanged (in OKLCH), in both themes, aliases
// resolved.
const resolve = (v: string | Record<string, string>, theme: "light" | "dark"): string => {
  const raw = typeof v === "string" ? v : v[theme];
  const alias = raw.match(/^\{(.+)\}$/);
  if (!alias) return raw;
  const target = source.color.tokens.find((t) => t.name === alias[1])!;
  return resolve(target.value as string | Record<string, string>, theme);
};

// "oklch(0.568 0.0641 209.3)" -> [0.568, 0.0641, 209.3]
const numbers = (v: string) => v.match(/[\d.]+/g)!.map(Number);

describe("oklch()", () => {
  for (const theme of ["light", "dark"] as const) {
    it(`matches every token in tokens.json (${theme})`, () => {
      for (const t of source.color.tokens) {
        expect(numbers(oklch(t.name, theme)), t.name).toEqual(
          numbers(resolve(t.value as string | Record<string, string>, theme)),
        );
      }
    });
  }
});

describe("color()", () => {
  it("gives the sRGB fallback of Bedrock's teal", () => {
    expect([9, 10, 11].map((s) => color(`teal-${s}`))).toEqual(["#528e98", "#45818b", "#35717b"]);
    expect(color("teal-11", "dark")).toBe("#89c1ca");
  });

  it("throws on an unknown token", () => {
    expect(() => color("teal-13")).toThrow(/Unknown color token/);
  });
});
