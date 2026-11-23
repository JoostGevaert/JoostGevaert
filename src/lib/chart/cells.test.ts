import { describe, expect, it } from "vitest";
import { a5Cells as cells } from "../../components/charts/a5-cells";
import { centroid, classify, pathData, quantiles } from "./cells";

describe("cells", () => {
  it("finds a polygon's centroid", () => {
    expect(
      centroid([
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
      ]),
    ).toEqual([1, 1]);
  });

  // As in the design system's maps: a value equal to a break stays in the lower class.
  it("splits values into quantile classes", () => {
    const toClass = quantiles([1, 2, 3, 4, 5, 6], 3);
    expect([1, 2, 3, 4, 5, 6].map(toClass)).toEqual([0, 0, 0, 1, 1, 2]);
  });

  it("uses every class on the real A5 cells", () => {
    const classes = classify(cells, 1.3, 7);
    expect(new Set(classes)).toEqual(new Set([0, 1, 2, 3, 4, 5, 6]));
    expect(classes).toHaveLength(cells.length);
  });

  it("writes SVG path data", () => {
    expect(
      pathData([
        [0, 0],
        [1, 0],
        [1, 1],
      ]),
    ).toBe("M0,0L1,0L1,1Z");
  });
});
