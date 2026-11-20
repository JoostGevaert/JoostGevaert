/** Dates are written 2026-11-20 everywhere (BRAND.md, Voice). */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
