// Converts design-system/tokens.json (the design session's list format) into
// DTCG token files under tokens/, which Terrazzo compiles to CSS variables.
// Re-run with `npm run tokens:export` whenever tokens.json changes.
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

const light = {}, dark = {}, base = {};
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
        letterSpacing: { value: parseFloat(s.letterSpacing ?? "0") , unit: "em" },
      },
    };
  }
}

const dims = (group, prefix) => {
  const o = { [prefix]: {} };
  for (const { name, value, usage } of group.tokens) {
    const key = name.replace(`${prefix}-`, "");
    const unit = value.endsWith("%") ? "%" : "px";
    o[prefix][key] = unit === "%"
      // DTCG dimensions are px/rem only; keep the % in a CSS override.
      ? { $type: "dimension", $value: { value: 0, unit: "px" }, $description: usage,
          $extensions: { "engineer.joost.css": { value } } }
      : { $type: "dimension", $value: { value: parseFloat(value), unit }, $description: usage };
  }
  return o;
};
const opacity = { opacity: {} };
for (const { name, value, usage } of src.opacity.tokens) {
  opacity.opacity[name] = { $type: "number", $value: Number(value), $description: usage };
}

const w = (f, d) => writeFileSync(new URL(f, out), JSON.stringify(d, null, 2) + "\n");
w("color/scales.light.tokens.json", light);
w("color/scales.dark.tokens.json", dark);
w("color/semantic.tokens.json", base);
w("typography.tokens.json", type);
w("space.tokens.json", dims(src.spacing, "space"));
w("radius.tokens.json", dims(src.radius, "radius"));
w("opacity.tokens.json", opacity);
console.log("Wrote DTCG tokens to tokens/");
