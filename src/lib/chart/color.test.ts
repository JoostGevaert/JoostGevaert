import { describe, expect, it } from "vitest";
import {
  bivariate,
  categorical,
  diverging,
  field,
  interpolate,
  sequential,
  toHex,
  toLab,
} from "./color";

describe("OKLab conversion", () => {
  it("round-trips every data color", () => {
    for (const hex of [
      ...sequential.teal,
      ...sequential.plum,
      ...sequential.indigo,
      ...diverging,
      ...Object.values(bivariate),
    ]) {
      expect(toHex(toLab(hex))).toBe(hex);
    }
  });
});

describe("interpolate", () => {
  it("hits the token steps at their positions", () => {
    const f = interpolate(sequential.teal);
    sequential.teal.forEach((hex, i) => expect(f(i / (sequential.teal.length - 1))).toBe(hex));
  });

  it("clamps outside [0, 1]", () => {
    const f = interpolate(diverging);
    expect(f(-1)).toBe(diverging[0]);
    expect(f(2)).toBe(diverging.at(-1));
  });
});

describe("the color field", () => {
  it("passes through the 3x3 bivariate grid", () => {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) expect(field(x / 3, y / 3)).toBe(bivariate[`${x}${y}`]);
    }
  });

  it("ends in deep teal and deep plum", () => {
    expect(field(1, 0)).toBe(sequential.teal[6]);
    expect(field(0, 1)).toBe(sequential.plum[6]);
  });
});

describe("categorical", () => {
  it("is teal, plum, indigo, violet, gray, lighter in dark mode", () => {
    const light = categorical("light"),
      dark = categorical("dark");
    expect(light).toHaveLength(5);
    light.forEach((c, i) => expect(toLab(dark[i])[0]).toBeGreaterThan(toLab(c)[0]));
  });
});
