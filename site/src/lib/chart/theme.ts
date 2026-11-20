// Observable Plot theme for joost.engineer. Applies the token scales and
// re-renders charts when the theme switches (categorical colors and ink
// change with it; fills don't).
//
//   import { renderPlot } from "../lib/chart/theme";
//   renderPlot(el, ({ plot, scales, Plot }) =>
//     plot({ color: scales.categorical(), marks: [Plot.lineY(data, { x: "t", y: "v", stroke: "rower" })] }));
import * as Plot from "@observablehq/plot";
import { color } from "../tokens";
import { categorical, sequential, diverging, bivariate, interpolate, field, type Hue, type Theme } from "./color";

export const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

export function kit(theme: Theme) {
  const ink = color("ink", theme), muted = color("ink-muted", theme), line = color("line", theme);
  const cat = categorical(theme);

  const scales = {
    /** Several series, in brand order: teal, plum, indigo, violet, gray ("other"). */
    categorical: (domain?: unknown[]) => ({ type: "categorical" as const, domain, range: cat }),
    /** Amounts. Continuous by default; pass `classes` for 7 stepped classes. */
    sequential: (hue: Hue = "teal", opts: { classes?: boolean; domain?: [number, number] } = {}) =>
      opts.classes
        ? { type: "quantize" as const, n: 7, range: sequential[hue], domain: opts.domain }
        : { type: "linear" as const, interpolate: interpolate(sequential[hue]), domain: opts.domain },
    /** Data with a meaningful middle: plum <- gray -> teal. */
    diverging: (opts: { pivot?: number; classes?: boolean; domain?: [number, number] } = {}) =>
      opts.classes
        ? { type: "quantize" as const, n: 9, range: diverging, domain: opts.domain }
        : { type: "diverging" as const, pivot: opts.pivot ?? 0, interpolate: interpolate(diverging), domain: opts.domain },
  };

  /**
   * Bivariate fill for two variables already split into classes 0..2
   * (or 0..1 for the 2x2 corners-only version of small charts).
   */
  const bivariateFill = (teal: number, plum: number, classes: 2 | 3 = 3) => {
    const k = (v: number) => (classes === 2 ? v * 2 : v);
    return bivariate[`${k(teal)}${k(plum)}`];
  };

  /** Plot.plot with the house style; options you pass win. */
  const plot = (options: Plot.PlotOptions) =>
    Plot.plot({
      marginTop: 24,
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: muted,
        background: "transparent",
        overflow: "visible",
        ...(typeof options.style === "object" ? options.style : {}),
      },
      ...options,
    });

  return {
    theme, Plot, plot, scales, bivariateFill, field, interpolate,
    /** One series: the brand color. */
    brand: color("brand", theme),
    cat, ink, muted, line,
    /** Hairline grid and rules in `line`. */
    grid: { stroke: line, strokeOpacity: 1 },
  };
}
export type ChartKit = ReturnType<typeof kit>;

/** Render a chart into `el` now and again whenever the theme changes. */
export function renderPlot(el: Element, build: (k: ChartKit) => Element) {
  let last: Theme | undefined;
  const draw = () => {
    const t = currentTheme();
    if (t === last) return;
    last = t;
    el.replaceChildren(build(kit(t)));
  };
  draw();
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}
