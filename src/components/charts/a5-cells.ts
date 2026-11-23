// Real A5 cells around Amsterdam, projected to a 1000 x 382 view box, from the
// design system's map components. Typed here once for the map figures.
import cells from "./a5-amsterdam.json";
import type { Polygon } from "../../lib/chart/cells";

export const a5Cells = cells as unknown as readonly Polygon[];
