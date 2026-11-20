// Converts design-system/tokens.json (the design session's list format) into
// DTCG token files under tokens/, which Terrazzo compiles to CSS variables.
// Re-run with `pnpm tokens:export` whenever tokens.json changes.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const src = JSON.parse(readFileSync(new URL("../design-system/tokens.json", import.meta.url)));
const out = new URL("../tokens/", import.meta.url);
mkdirSync(new URL("color/", out), { recursive: true });

// Token name -> DTCG path. CSS variable names are the path joined by dashes
// minus the leading "color", so they match the design system (--teal-10, --bg).
const pathOf = (name) => {
  const m = name.match(/^(teal|seq-teal|seq-plum|seq-indigo|div|biv|cat)-(.+)$/);
  return m ? ["color", ...m[1].split("-"), m[2]] : ["color", name];
};
const ref = (v) => {
  const m = typeof v === "string" && v.match(/^\{(.+)\}$/);
  return m ? `{${pathOf(m[1]).join(".")}}` : v;
};
const set = (obj, path, val) => {
  let o = obj;
  for (const p of path.slice(0, -1)) o = o[p] ??= {};
  o[path.at(-1)] = val;
};
// DTCG 2025.10 color object; keeps the design session's hex for reference.
const color = (v) => {
  if (v.startsWith("{")) return ref(v);
  const n = parseInt(v.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => +(x / 255).toFixed(4));
  return { colorSpace: "srgb", components: c, hex: v };
};
const token = (value, usage) => ({ $type: "color", $value: color(value), $description: usage });

const light = {},
  dark = {},
  base = {};
for (const { name, value, usage } of src.color.tokens) {
  const path = pathOf(name);
  // The teal scale stays whole in the theme files, even where steps match.
  const same = typeof value === "string" || value.light === value.dark;
  if (same && !name.startsWith("teal-")) {
    set(base, path, token(typeof value === "string" ? value : value.light, usage));
  } else {
    set(light, path, token(value.light ?? value, usage));
    set(dark, path, token(value.dark ?? value, usage));
  }
}

const type = { font: {}, type: {} };
for (const [k, v] of Object.entries(src.type.families)) {
  type.font[k] = {
    $type: "fontFamily",
    $value: v.split(",").map((s) => s.trim().replace(/^"|"$/g, "")),
  };
}
for (const g of src.type.groups) {
  for (const s of g.styles) {
    type.type[s.name] = {
      $type: "typography",
      $description: s.usage,
      $value: {
        fontFamily: `{font.${g.family}}`,
        fontSize: { value: parseFloat(s.fontSize), unit: "px" },
        lineHeight: s.lineHeight,
        fontWeight: s.fontWeight,
        letterSpacing: { value: parseFloat(s.letterSpacing ?? "0"), unit: "em" },
      },
    };
  }
}

const dims = (group, prefix) => {
  const o = { [prefix]: {} };
  for (const { name, value, usage } of group.tokens) {
    const key = name.replace(`${prefix}-`, "");
    const unit = value.endsWith("%") ? "%" : "px";
    o[prefix][key] =
      unit === "%"
        ? // DTCG dimensions are px/rem only; keep the % in a CSS override.
          {
            $type: "dimension",
            $value: { value: 0, unit: "px" },
            $description: usage,
            $extensions: { "engineer.joost.css": { value } },
          }
        : { $type: "dimension", $value: { value: parseFloat(value), unit }, $description: usage };
  }
  return o;
};
const opacity = { opacity: {} };
for (const { name, value, usage } of src.opacity.tokens) {
  opacity.opacity[name] = { $type: "number", $value: Number(value), $description: usage };
}

// Motion: easing curves (DTCG cubicBezier) and durations. CSS keywords are
// spelled out as their cubic-bezier control points.
const keywordCurves = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
};
const curve = (v) => {
  const m = v.match(/^cubic-bezier\(([^)]+)\)$/);
  const points = m ? m[1].split(",").map(Number) : keywordCurves[v];
  if (!points || points.length !== 4) throw new Error(`Unsupported easing: ${v}`);
  return points;
};
const motion = { ease: {}, duration: {} };
for (const { name, value, usage } of src.easing.tokens) {
  motion.ease[name.replace("ease-", "")] = {
    $type: "cubicBezier",
    $value: curve(value),
    $description: usage,
  };
}
for (const { name, value, usage } of src.duration.tokens) {
  const m = value.match(/^([\d.]+)(ms|s)$/);
  if (!m) throw new Error(`Unsupported duration: ${value}`);
  motion.duration[name.replace("duration-", "")] = {
    $type: "duration",
    $value: { value: Number(m[1]), unit: m[2] },
    $description: usage,
  };
}

const w = (f, d) => writeFileSync(new URL(f, out), JSON.stringify(d, null, 2) + "\n");
w("color/scales.light.tokens.json", light);
w("color/scales.dark.tokens.json", dark);
w("color/semantic.tokens.json", base);
w("typography.tokens.json", type);
w("space.tokens.json", dims(src.spacing, "space"));
w("radius.tokens.json", dims(src.radius, "radius"));
w("opacity.tokens.json", opacity);
w("motion.tokens.json", motion);
console.log("Wrote DTCG tokens to tokens/");

// ---------- Tailwind theme ----------
// src/styles/theme.css maps every token onto Tailwind's theme namespaces, so
// utilities exist for exactly the design system's values: `text-ink`,
// `bg-teal-3`, `rounded-md`, `font-mono`, `type-display`. Values stay in
// tokens.css (themed at runtime), the theme refers to them with var().
const tw = [
  "/* Generated by scripts/export-tokens.mjs from design-system/tokens.json. Do not edit. */",
  "@theme inline {",
  "  --color-*: initial;",
  "  --font-*: initial;",
  "  --radius-*: initial;",
  "  --text-*: initial;",
  "  --shadow-*: initial;",
  "  --inset-shadow-*: initial;",
  "  --drop-shadow-*: initial;",
  "  --ease-*: initial;",
  "  --color-transparent: transparent;",
  "  --color-current: currentColor;",
];
for (const { name } of src.color.tokens) tw.push(`  --color-${name}: var(--${name});`);
for (const k of Object.keys(src.type.families)) tw.push(`  --font-${k}: var(--font-${k});`);
// Spacing: space-1 (4 px) is the base unit; every space-* step is a whole
// multiple of it (space-3 = 16 px = p-4, space-4 = 24 px = p-6, ...).
const unit = parseFloat(src.spacing.tokens.find((t) => t.name === "space-1").value);
for (const { name, value } of src.spacing.tokens) {
  if (parseFloat(value) % unit) throw new Error(`${name} is not a multiple of space-1`);
}
tw.push(`  --spacing: var(--space-1);`);
for (const { name } of src.radius.tokens)
  tw.push(`  --radius-${name.replace("radius-", "")}: var(--${name});`);
tw.push("}", "");
// Type styles as utilities: the font shorthand plus letter spacing.
for (const g of src.type.groups) {
  for (const s of g.styles) {
    tw.push(`@utility type-${s.name} {`, `  font: var(--type-${s.name});`);
    if (s.letterSpacing) tw.push(`  letter-spacing: var(--type-${s.name}-letter-spacing);`);
    tw.push("}");
  }
}
for (const { name } of src.opacity.tokens) {
  tw.push(`@utility opacity-${name} {`, `  opacity: var(--opacity-${name});`, "}");
}
// Easing and duration as utilities: `ease-overshoot`, `duration-swing`. They
// also set Tailwind's --tw-ease / --tw-duration, which transition-* utilities
// read, so they win whatever order the utilities are emitted in.
for (const { name } of src.easing.tokens) {
  tw.push(`@utility ${name} {`, `  --tw-ease: var(--${name});`);
  tw.push(`  transition-timing-function: var(--${name});`, "}");
}
for (const { name } of src.duration.tokens) {
  tw.push(`@utility ${name} {`, `  --tw-duration: var(--${name});`);
  tw.push(`  transition-duration: var(--${name});`, "}");
}
writeFileSync(new URL("../src/styles/theme.css", import.meta.url), tw.join("\n") + "\n");
console.log("Wrote src/styles/theme.css");
