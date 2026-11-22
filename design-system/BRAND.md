# joost.engineer

joost.engineer is Joost Gevaert's blog for his (thought) experiments and side projects. Its brand is built from the Source type family, Bedrock.engineer's teal and a handful of shapes computed from real data. Precise, but personal. (Subsurface work lives on the Bedrock.engineer blog, not here.)

![joost.engineer wordmark](assets/logos/wordmark-light.svg)

## Principles

- **Show the construction.** The brand is engineered, and it lets you see how: dimensioned drawings, real grid cells, measured spacing. Nothing is decorative unless it was computed from something.
- **One interface hue.** Teal is the only color of the interface. Teal, plum and indigo together are the colors of every chart, map, illustration and social card.
- **Borders, not shadows.** Surfaces are separated by `line` hairlines and the `surface`/`bg` step. No drop shadows.
- **Data in mono.** Anything that is data (dates, tags, units, code, the logo itself) is set in Source Code Pro. Titles are Sans, reading is Serif.

## Voice

Rigorous, warm and opinionated. American English.

- **Rigorous.** Numbers with units, sources linked, uncertainty stated. If it was measured, say how. *"The phone counts 31.4 strokes per minute; the coach's watch says 31. Measured over 12 sessions."*
- **Warm.** First person, plain words, credit to the people and tools that made it possible. *"I got this working thanks to Felix Palmer's A5 library."*
- **Opinionated.** Take a position and give the reason. Hedging is for when you really don't know. *"Write the thought experiment down before you build anything. Here's why."*

Write dates as `2026-11-20`. Use sentence case for titles and labels. No exclamation marks in titles.

## Logo

The wordmark is **joost.engineer** in Source Code Pro SemiBold, tracked −0.04 em, with **three teal dots**: the dot on the j, the period and the dot on the i. It is the primary logo, wherever there is room for it.

**j.e** is its short form, for places too small for the full name: favicon, app tile, avatar, mobile navigation. It is the same face, tracked −0.20 em so the three characters close up, with **two teal dots**:

- Both dots are identical circles, the size of the period (⌀ 204 font units). The dot on the j stays where Source Code Pro puts it.
- The round shapes overshoot: the e rises 11 units above the x-height (493) and drops 17 below the baseline. The period sits on that same −17 line.
- The period is centered optically between the j's stem and the e's bowl, measured along its own center line (gaps of 146 and 147 units).

| Use | File | Minimum size |
|---|---|---|
| Header, footer, documents | `assets/logos/wordmark-light.svg`, `wordmark-dark.svg` | 96 px wide |
| Navigation on small screens, inline | `assets/logos/je-mark-light.svg`, `je-mark-dark.svg` | 20 px tall |
| Favicon, app icon, avatar | `assets/logos/je-tile-light.svg`, `je-tile-dark.svg` | 16 px |

Rules:

- The logo letters are `ink`, the dots `logo-dot`. Never set the letters in teal, and never recolor the dots in anything but teal.
- Keep clear space of at least the height of the j's dot around the wordmark and the mark.
- On a tile, the mark fills 76% of the side; the tile corner radius is `radius-tile` (22%). On the dark ink tile the dots use teal-11, on the light tile teal-11 of the light scale (`#35717b`).
- Don't retype the logo in a font: use the SVG files. The `wordmark` type style is only for places where an image can't go.
- Don't add the name "Joost Gevaert" into the logo. Where a name is needed, set it in Source Sans 3 SemiBold beside or under the wordmark, in `ink-muted`.

## Large versions

The j.e mark has two large forms, for places where the logo is the picture rather than a label. Files in `assets/large/`.

- **Octree** (`je-octree-*.svg`) is the signature large version: social cards, avatars, print. The letters are filled with a quadtree, the 2D slice of an octree: large squares inside, small ones along the edges, each dot its own centered tree.
- **Technical drawing** (`je-drawing-*.png`) shows the mark as a dimensioned construction drawing in font units: drawing paper, reference lines, center marks, overshoot and the two gaps around the period. Used on the about page and as a background texture.

## Color

### Interface: teal

One hue for the interface: **Bedrock.engineer's teal**, a muted steel blue (OKLCH hue 209.3), as a Radix-style 12-step scale with a light and a dark version:

| Steps | Job |
|---|---|
| 1–2 | Backgrounds |
| 3–5 | Fills: subtle, hover, pressed |
| 6–8 | Borders |
| 9–10 | Solid color. **teal-10 is the brand color** |
| 11–12 | Text |

All colors are written in **OKLCH** (lightness, chroma, hue), the perceptual space the whole palette was built in: equal steps in lightness look equal, and a hue stays the same hue as it gets lighter or darker. The teal scale uses Bedrock.engineer's original values (hue 209.3); the neutrals and data colors are their exact OKLCH equivalents. Every color is **one token with a light and a dark value**: there is no separate dark palette to keep in sync.

Semantic tokens sit on top: `bg`, `surface`, `ink`, `ink-muted`, `line` for the page; `brand` (teal-10) for solid fills; `link` (teal-11) for links and teal text; `logo-dot` for the logo's dots; `focus` (teal-9) for focus rings; `guide` and `grid-cell` for drawings.

Derived colors: don't invent new hex values. A step of the scale covers hover, pressed and tinted fills (`teal-4` for hover on `teal-3`, and so on). Where a color is needed at reduced strength, such as a texture or an overlay, mix it in OKLCH: `color-mix(in oklch, var(--texture) 22%, transparent)`.

Contrast: `ink` on `bg` is over 15:1 in both themes, `ink-muted` 5.9:1 (light) and 9:1 (dark). teal-10 on white is 4.4:1, enough for graphics and large text but not body text: use `link` (teal-11, 5.5:1) for anything you read. The other way round, `on-brand` (white) on a `brand` fill is also 4.4:1: fine for icons and large or bold text; for small text on teal, fill with teal-11 instead.

Links, buttons, focus and the logo dots are always teal. Plum and indigo never appear in the interface for decoration. The one exception is something that *is* data: post-type tags carry a small dot in their category color (experiments teal, maps indigo, notes plum), because the same categories appear in charts.

### Data: teal, plum and indigo

Teal, plum and indigo are the main colors for **every** data visualization: charts, maps, diagrams. Reach for another palette only when the data prescribes its own colors (geology, land use, temperature, a club's colors), when these colors would make the visualization unclear, or when it needs more than five categories.

All data colors are samples of one **color field**: four corners blended in OKLab (light gray, teal, plum, indigo), continuing past the bivariate grid to deep teal (teal-11), deep plum and deep indigo. Named colors in the field: light gray, light teal, teal, mauve, periwinkle, steel blue, plum, violet and indigo.

| Use | Tokens |
|---|---|
| One series | `brand` (teal-10) |
| Several series, in this order | `cat-teal`, `cat-plum`, `cat-indigo`, `cat-violet`, `cat-gray` (gray is "other"). Lighter in dark mode |
| Amounts (sequential) | `seq-teal-1…7`, `seq-plum-1…7`, `seq-indigo-1…7` |
| Data with a meaningful middle (diverging) | `div-1…9`: plum ← gray → teal |
| Two variables at once (bivariate) | `biv-00…22` (3×3); the four corners only (2×2) for small charts |

Fills (sequential, diverging, bivariate) are the same in both themes: a map shouldn't change with the theme. Lines and points use the categorical colors, which have a lighter dark-mode version.

Live examples, drawn with these tokens in both themes, are the **Data visualization** components: ChartColors, BarCharts, SequentialMap, DivergingMap and BivariateMap. Copy their code as a starting point.

The bivariate grid follows Joshua Stevens' 3×3 scheme, rebuilt around Bedrock teal: first digit teal, second plum, indigo where both are high. Lightness falls steadily toward the indigo corner, so the classes stay apart without relying on hue alone. Don't go beyond 3×3: more classes can't be told apart.

### Pictures: the full palette

Social cards, covers, illustrations and texture backgrounds may use the whole palette, with one rule: one dominant color (usually teal), the others in support. The cover's strip of unequal color blocks is the model.

## Type

The Source family, all open source (SIL OFL) and loaded from Google Fonts.

- **Source Sans 3** (`sans`) for titles and interface: `display`, `heading`, `subheading`, `ui`.
- **Source Serif 4** (`serif`) for reading: `lede`, `body`, `small`. Lines under 70 characters.
- **Source Code Pro** (`mono`) for the logo and anything that is data: `wordmark`, `label`, `code`. Labels are SemiBold in `link` teal.

Titles use sentence case and balanced wrapping. Blog titles are always Sans, never Mono.

- **Fluid titles:** `display` and `heading` scale with the viewport between a minimum and their token size: `display` `clamp(2rem, 1.55rem + 1.6vw, 2.75rem)` (32 → 44 px), `heading` `clamp(1.5rem, 1.3rem + 0.6vw, 1.75rem)` (24 → 28 px), between 320 and 1240 px wide. Everything else stays fixed: reading text doesn't change size.
- **Wrapping:** `text-wrap: balance` on headings, `text-wrap: pretty` on everything else; `overflow-wrap: break-word` so long URLs and repo names never widen the page.
- **No fake styles:** `font-synthesis: none`; load the weights you use.
- **Numbers:** `font-variant-numeric: tabular-nums` where digits must line up (tables, chart axes, timers, stroke rates), not globally.

## Textures

Faint backgrounds behind the hero and post headers, at `texture-hero` (22%) or `texture-card` (18%) opacity, stroked in `texture`. A post sets one in its front matter with `texture:`; the default depends on its type:

| Texture | Default for | File |
|---|---|---|
| `drawing` | experiments and code posts | `assets/large/je-drawing-*.png` |
| `contours` | map and geo posts | `assets/textures/je-contours-*.svg` |
| alternate | everything else: drawing and contours in turn | |
| `s2`, `h3`, `a5` | optional, chosen per post | `assets/textures/je-s2-*.svg` etc. |

The contours come from the distance field of the j.e letters: terraces inside, ripples fading outward. The S2, H3 and A5 textures are j.e rebuilt from real cells of three global grid systems around Amsterdam (Google's S2 at level 15, Uber's H3 at resolution 9, A5 pentagons at resolution 14), drawn as lines: cells inside the letters at full strength, the grid fading out around them. They are precomputed; regenerate them if the mark changes.

## Social cards

The image shown when a link is shared (`og:image`, 1200 × 630 px). Layout: the wordmark top left, a date and post-type line in `label` style, the title in `display` style bottom left, and a strip of unequal color blocks (indigo, teal, plum) along the bottom edge. Behind it by default: the post's texture at 30%. A post with a striking result can show that instead: its own chart or map, at card size, on the right. See the SocialCard component.

## Layout

- Spacing steps `space-1` (4 px) to `space-6` (64 px). Cards pad `space-4`, grids gap `space-3`, sections sit `space-6` apart.
- Radii: `radius-sm` for small parts, `radius-md` for cards and post headers, `radius-lg` for the hero, `radius-pill` for buttons and chips.
- **Content grid** with named lines: `content` (42rem, about 70 characters of body text) for running text, `breakout` (64rem) for figures, charts and maps, `full` for the hero, textures and full-bleed images; gutters 1.5rem. Children pick a track with `grid-column`, so a post never needs wrapper divs to let a map run wider than the text.
- **Flow spacing:** inside a post, `.prose > * + *` gets `margin-block-start: var(--flow-space, 1em)`; headings 2em above, 0.5em below. Elsewhere, parents set spacing with `gap`, children don't carry outer margins.
- **Concentric radius:** a rounded thing inside a rounded thing gets outer radius = inner radius + padding.
- **Hit area:** every control is at least 44 × 44 px to touch, visibly smaller ones (the 36 px header logo buttons, chips) get an invisible `::after` that extends the target.
- **Whole-card links:** a post card is one link (the title's link stretched over the card with `::after`); the focus ring moves to the card via `:has(:focus-visible)`.
- **Focus:** `:focus-visible` only, `outline: max(2px, 0.08em) solid var(--focus)`, `outline-offset: 0.25em`. Never `outline: none`.
- **Hover** styles only under `@media (hover: hover) and (pointer: fine)`, so touch screens don't get stuck hover states.
- **Theme switch:** Bedrock.engineer's triangle toggle (three triangles: Light, Auto, Dark; a rotating triangle marks the choice), restyled: triangles `teal-3` with a `teal-6` hairline (hover `teal-4`), the indicator solid `teal-10` in both themes, Lucide `sun`, `sun-moon` and `moon` at 1.5 px in `ink-muted`, `on-brand` on the indicator, focus ring 2 px `teal-9`. Same size (40 px sides), rotation (`ease-overshoot`, `duration-swing`), keyboard behavior and `localStorage` key as Bedrock's. Auto (follow the system) is the default. Top right of the header.

## Motion

Motion is rare and functional: it shows that something changed state, never decorates. Nothing moves on its own, nothing loops, nothing animates on scroll or page load.

- **Opt-in:** transforms and movement live inside `@media (prefers-reduced-motion: no-preference)`; under `reduce` they happen instantly. Color and opacity fades may stay, they don't move anything.
- **Named properties:** transition `color`, `background-color`, `transform`… by name; never `transition: all`.
- **Short:** interface transitions stay under 300 ms. The theme switch's 450 ms swing is the one deliberate exception: the overshoot needs the time.
- **No `ease-in`** on interface elements: things start fast and settle.
- **Press feedback:** buttons and chips scale to 0.97 on `:active`, over `duration-fast` with `ease-standard`.

| Token | Value | Use |
|---|---|---|
| `ease-overshoot` | `cubic-bezier(0.175, 0.885, 0.32, 1.1)` | Bedrock.engineer's overshooting swing: the theme switch indicator, and other small parts that snap into place |
| `duration-swing` | 450 ms | Swings with `ease-overshoot`: the theme switch indicator's 60° rotation |
| `ease-standard` | `cubic-bezier(0.23, 1, 0.32, 1)` | A strong ease-out for plain changes that shouldn't draw attention: hover and focus colors, press feedback |
| `duration-fast` | 150 ms | Color changes on hover and focus, and press feedback, with `ease-standard` |

## Icons

Lucide as the base, custom icons drawn to the same rules. The rules below are the style: an icon that follows them belongs to the set, whoever or whatever drew it.

- **Base set: [Lucide](https://lucide.dev)** (ISC license), with the stroke set to **1.5 px** instead of Lucide's default 2. The stroke stays 1.5 px at every display size (Lucide's `absoluteStrokeWidth`), so large icons don't turn heavy.
- **Custom icons** fill the gaps (a rowing boat, an A5 pentagon, a turbine blade). They are drawn on demand to the spec below, reuse Lucide's shapes where they can, and must pass the icon lint before they ship.

Spec, for Lucide and custom icons alike:

| Rule | Value |
|---|---|
| Canvas | 24 × 24, `viewBox="0 0 24 24"` |
| Padding | at least 1 px on every side (live area 22 × 22) |
| Stroke | `stroke="currentColor"`, `stroke-width="1.5"`, round caps, round joins |
| Fill | `fill="none"`. No filled shapes, no gradients |
| Grid | coordinates, arc centers and radii on whole or half pixels |
| Elements | `path`, `line`, `polyline`, `polygon`, `rect`, `circle`, `ellipse` only; no transforms, no `style`, no ids |
| Detail | about as much as a Lucide icon: simplify, keep what makes the subject recognizable |
| Names | kebab-case nouns, as in Lucide (`rowing-boat`, `pentagon-cell`) |

Use:

- **Sizes:** relative to the text they sit with, not in px: a box of about 1.25em (Lucide's 1 px padding makes the drawing match the text's cap height), `flex: none`, aligned to the text's center. That comes to about 16 px next to `small` and `label`, 20 px next to `ui` and `body`, 24 px next to headings. In a notice that wraps, the icon box is `1lh` tall and aligns to the first line.
- **Color:** `ink` by default, `ink-muted` for secondary icons. `link` teal only when the icon itself is clickable. Data colors (`cat-*`) only inside a legend or a post-type tag.
- **With words:** in navigation and buttons an icon goes with a word, never instead of one, except for universal controls (close, menu, search, the theme switch).
- **One set:** never mix in icons from another library. If Lucide lacks something, draw it to the spec.

### Brand logos

Logos of other platforms (GitHub, LinkedIn, Mastodon, Bluesky, ORCID, Mattermost…) are not icons: they are trademarks, used as their owners draw them.

- **Source:** [Simple Icons](https://simpleicons.org) (CC0 for the files; each brand's own guidelines still apply). LinkedIn is no longer in Simple Icons: take its "in" logo from LinkedIn's own brand page.
- **Style:** solid, one color, `ink`; `link` teal on hover like any link. Never the brand's own colors, never redrawn in the 1.5 px line style, outlined, cropped or recolored within the shape.
- **Size:** 18 px next to 20 px line icons (solid shapes look bigger), and about the text's cap height when inline.
- **Label:** always the platform's name, visible or as an accessible label.

Where they appear:

| Place | Form |
|---|---|
| Header | GitHub and LinkedIn as icon-only buttons (36 px round hit area) next to the theme switch, with tooltip and label. The only place a logo stands without its name. On narrow screens they move into the menu with their names. |
| End of a post | Pill buttons with logo and word: "Discuss on LinkedIn", "Code on GitHub" plus the repo name in `label` mono. |
| Project cards | A chip with the GitHub logo and the repo name (`owner/repo`); a live site gets Lucide's `arrow-up-right` instead. |
| Inside text | A small logo before a link to a repo or profile, first mention only. |
| About page | "Find me on": a list of logo, platform and handle, GitHub and LinkedIn first. |
| Footer | Logo and name for GitHub and LinkedIn, plus RSS (a Lucide icon). |

## Building with it

The site is built with Astro, with tokens compiled by Terrazzo as in bedrock-web. Export `tokens.json` to DTCG token files and generate CSS custom properties from them; never paste values into stylesheets by hand. Keep the teal scale in Bedrock's original OKLCH values in the DTCG files; Terrazzo writes the hex fallbacks.

CSS foundations (after [good-css.com](https://good-css.com/)):

- **Reset:** `box-sizing: border-box` and `min-width: 0` on everything; form inputs `font-size: max(16px, 1rem)` (no zoom on phones); `scrollbar-gutter: stable`; `touch-action: manipulation` on controls; full-height heroes in `svh`.
- **Themes, one set of tokens:** every color token is emitted once, as `--ink: light-dark(oklch(…), oklch(…))`, with `color-scheme: light dark` on `:root` and `<meta name="color-scheme" content="light dark">`. The theme switch then only sets `color-scheme` on `:root`: `light`, `dark`, or `light dark` for Auto. Native controls and scrollbars follow for free, and there are no duplicated `[data-theme]` blocks to keep in sync. If Terrazzo can't emit `light-dark()`, a small post-build step can. Anything that isn't CSS follows the same `color-scheme`: inline the logo SVGs with `fill: var(--ink)` / `var(--logo-dot)`, because `<picture>` with `prefers-color-scheme` follows the system, not the switch.
- **Logical properties:** `margin-inline`, `padding-block`, `inset-inline-start` and so on, not left/right/top/bottom.
- **Intrinsic grids** for card lists: `repeat(auto-fill, minmax(min(100%, 16rem), 1fr))`, no breakpoints.
- **Container queries** for components that live in different widths (post cards, charts, maps): `container-type: inline-size` on their wrapper.
- **`overflow: clip`** instead of `hidden` where nothing needs to scroll.
- **Single-line labels** (buttons, chips, tags) may use `text-box: trim-both cap alphabetic` for true optical centering.

The step-by-step build plan is the **Build plan** section (`build-plan.md`). Reference material for building sits in `reference/`: Bedrock.engineer's setup files (`reference/bedrock-web/`), rendered HTML sheets of everything in this system (`reference/sheets/`) and the scripts that generated the assets (`reference/scripts/`).
