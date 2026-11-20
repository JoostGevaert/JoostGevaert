import { describe, expect, it } from "vitest";
import { textureFor, type TexturedPost } from "./texture";

const post = (
  id: string,
  type: TexturedPost["data"]["type"],
  date: string,
  texture?: TexturedPost["data"]["texture"],
): TexturedPost => ({ id, data: { type, date: new Date(date), texture } });

describe("textureFor", () => {
  const all = [
    post("rowing", "experiments", "2026-01-10"),
    post("delta", "maps", "2026-02-10"),
    post("first-note", "notes", "2026-03-10"),
    post("second-note", "notes", "2026-04-10"),
    post("third-note", "notes", "2026-05-10"),
    post("a5-map", "maps", "2026-06-10", "a5"),
  ];
  const by = (id: string) =>
    textureFor(
      all.find((p) => p.id === id)!,
      all,
    );

  it("uses the drawing for experiments and contours for maps", () => {
    expect(by("rowing")).toBe("drawing");
    expect(by("delta")).toBe("contours");
  });

  it("alternates drawing and contours for other posts, oldest first", () => {
    expect([by("first-note"), by("second-note"), by("third-note")]).toEqual([
      "drawing",
      "contours",
      "drawing",
    ]);
  });

  it("lets front matter override the default", () => {
    expect(by("a5-map")).toBe("a5");
  });
});
