// Data colors (BRAND.md, Data: teal, plum and indigo), from the token files.
// Fills (sequential, diverging, bivariate) are identical in both themes;
// categorical colors have a lighter dark-mode version.
//
// Continuous scales interpolate in OKLab through the token steps, and
// `field(u, v)` samples the design system's color field: the 3x3 bivariate
// grid extended to deep teal / plum / indigo, bilinear in OKLab (ported from
// the design session's dataviz sheet).
import { color } from "../tokens";

export type Theme = "light" | "dark";
const steps = (prefix: string, n: number) =>
  Array.from({ length: n }, (_, i) => color(`${prefix}-${i + 1}`));

export const CATEGORIES = ["teal", "plum", "indigo", "violet", "gray"] as const;
/** Categorical colors in their fixed order; gray is "other". */
export const categorical = (theme: Theme = "light") =>
  CATEGORIES.map((c) => color(`cat-${c}`, theme));

export const sequential = {
  teal: steps("seq-teal", 7),
  plum: steps("seq-plum", 7),
  indigo: steps("seq-indigo", 7),
} as const;
export type Hue = keyof typeof sequential;

/** Plum <- gray -> teal, nine steps. */
export const diverging = steps("div", 9);

/** Bivariate 3x3: key "xy", x = teal class (0-2), y = plum class (0-2). */
export const bivariate: Record<string, string> = Object.fromEntries(
  ["00", "10", "20", "01", "11", "21", "02", "12", "22"].map((k) => [k, color(`biv-${k}`)]),
);

// ---------- OKLab ----------
type Lab = [number, number, number];
const s2l = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const l2s = (c: number) => {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};

export function toLab(h: string): Lab {
  const [r, g, b] = [1, 3, 5].map((i) => s2l(parseInt(h.slice(i, i + 2), 16) / 255));
  const [l, m, s] = [
    0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
    0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
    0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
  ].map(Math.cbrt);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export function toHex([L, a, b]: Lab): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return (
    "#" +
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
      .map((v) =>
        Math.round(l2s(v) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
const mix = (a: Lab, b: Lab, f: number): Lab =>
  [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * f) as Lab;

/** Interpolator t in [0, 1] -> hex, piecewise in OKLab through `colors`. */
export function interpolate(colors: readonly string[]): (t: number) => string {
  const labs = colors.map(toLab),
    n = labs.length - 1;
  return (t) => {
    const x = Math.max(0, Math.min(1, t)) * n,
      i = Math.min(n - 1, Math.floor(x));
    return toHex(mix(labs[i], labs[i + 1], x - i));
  };
}

// ---------- the color field ----------
const G4: Lab[][] = (() => {
  const g = (x: number, y: number) => toLab(bivariate[`${x}${y}`]);
  const E = {
    t: toLab(sequential.teal[6]),
    p: toLab(sequential.plum[6]),
    i: toLab(sequential.indigo[6]),
  };
  const M: Lab[][] = [];
  for (let y = 0; y < 4; y++) {
    M[y] = [];
    for (let x = 0; x < 4; x++) {
      if (x < 3 && y < 3) M[y][x] = g(x, y);
      else if (y === 0) M[y][x] = E.t;
      else if (x === 0) M[y][x] = E.p;
      else if (x === 3 && y === 3) M[y][x] = E.i;
      else if (x === 3) M[y][x] = mix(E.t, E.i, y / 3);
      else M[y][x] = mix(E.p, E.i, x / 3);
    }
  }
  return M;
})();

/** Sample the color field: u along teal (0-1), v along plum (0-1); indigo where both are high. */
export function field(u: number, v: number): string {
  const gx = Math.max(0, Math.min(1, u)) * 3,
    gy = Math.max(0, Math.min(1, v)) * 3;
  const i = Math.min(2, Math.floor(gx)),
    j = Math.min(2, Math.floor(gy)),
    fx = gx - i,
    fy = gy - j;
  const c = (x: number, y: number) => G4[y][x];
  return toHex(
    [0, 1, 2].map(
      (k) =>
        (1 - fx) * (1 - fy) * c(i, j)[k] +
        fx * (1 - fy) * c(i + 1, j)[k] +
        (1 - fx) * fy * c(i, j + 1)[k] +
        fx * fy * c(i + 1, j + 1)[k],
    ) as Lab,
  );
}
