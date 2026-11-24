// Made-up data on real grid cells, for the map figures. Ported from the design
// system's SequentialMap and BivariateMap components: a smooth field sampled at
// each cell's centroid, classified into quantiles.

export type Point = readonly [number, number];
export type Polygon = readonly Point[];

export const centroid = (polygon: Polygon): Point =>
  polygon.reduce<Point>(
    (sum, [x, y]) => [sum[0] + x / polygon.length, sum[1] + y / polygon.length],
    [0, 0],
  );

/** A smooth, made-up surface; `phase` picks a different but similar-looking one. */
export const field = ([x, y]: Point, phase: number): number =>
  Math.sin(x * 0.012 + phase) * Math.cos(y * 0.02 - phase * 0.7) +
  0.6 * Math.sin((x + y) * 0.008 + phase * 2) +
  0.35 * Math.cos(x * 0.03 - y * 0.02 + phase);

/** Quantile classes: returns a function mapping a value to its class, 0 … n-1. */
export function quantiles(values: readonly number[], n: number): (value: number) => number {
  const sorted = values.toSorted((a, b) => a - b);
  return (value) => {
    let k = 0;
    while (k < n - 1 && value > sorted[Math.floor(((k + 1) * sorted.length) / n)]!) k++;
    return k;
  };
}

/** SVG path data for a polygon. */
export const pathData = (polygon: Polygon): string =>
  `M${polygon.map(([x, y]) => `${x},${y}`).join("L")}Z`;

/** Classify every cell by the field at its centroid, into n quantile classes. */
export function classify(polygons: readonly Polygon[], phase: number, n: number): number[] {
  const values = polygons.map((p) => field(centroid(p), phase));
  const toClass = quantiles(values, n);
  return values.map(toClass);
}
