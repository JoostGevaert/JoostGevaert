import { describe, expect, it } from "vitest";
import { initialHeaderScroll, nextHeaderScroll, type HeaderScroll } from "./header-scroll";

const TOP = 80;

/** Scroll through the positions in order and return the final state. */
const scroll = (from: number, ...ys: number[]): HeaderScroll =>
  ys.reduce((s, y) => nextHeaderScroll(s, y, TOP), initialHeaderScroll(from));

describe("nextHeaderScroll", () => {
  it("shows near the top, even when scrolling down", () => {
    expect(scroll(0, 20, 60, 80).hidden).toBe(false);
  });

  it("hides when scrolling down past the header", () => {
    expect(scroll(0, 100, 200, 400).hidden).toBe(true);
  });

  it("shows again when scrolling up mid-page", () => {
    expect(scroll(0, 200, 800, 790).hidden).toBe(false);
  });

  it("ignores movements smaller than the tolerance", () => {
    expect(scroll(0, 200, 800, 795).hidden).toBe(true);
    expect(scroll(0, 200, 800, 700, 704).hidden).toBe(false);
  });

  it("adds up small steps in one direction", () => {
    expect(scroll(0, 200, 800, 797, 794, 791).hidden).toBe(false);
  });

  it("shows when a page opens mid-way and the reader scrolls up", () => {
    expect(scroll(1500, 1490).hidden).toBe(false);
    expect(scroll(1500, 1520).hidden).toBe(true);
  });

  it("shows on rubber-band scrolling above the top", () => {
    expect(scroll(0, 400, -30).hidden).toBe(false);
  });
});
