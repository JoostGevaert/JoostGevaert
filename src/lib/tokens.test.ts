import { describe, expect, it } from "vitest";
import source from "../../design-system/tokens.json";
import { color } from "./tokens";

// The design session's tokens.json is the fixture: every color must come out
// of the exported DTCG files unchanged, in both themes, aliases resolved.
const resolve = (v: string | Record<string, string>, theme: "light" | "dark"): string => {
  const raw = typeof v === "string" ? v : v[theme];
  const alias = raw.match(/^\{(.+)\}$/);
  if (!alias) return raw;
  const target = source.color.tokens.find((t) => t.name === alias[1])!;
  return resolve(target.value as string | Record<string, string>, theme);
};

describe("color()", () => {
  for (const theme of ["light", "dark"] as const) {
    it(`matches every token in tokens.json (${theme})`, () => {
      for (const t of source.color.tokens) {
        expect(color(t.name, theme), t.name).toBe(
          resolve(t.value as string | Record<string, string>, theme),
        );
      }
    });
  }

  it("throws on an unknown token", () => {
    expect(() => color("teal-13")).toThrow(/Unknown color token/);
  });
});
