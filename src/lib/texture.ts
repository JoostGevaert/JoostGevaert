// Which background texture a post gets (BRAND.md, Textures). Pure: no
// Astro imports, so it can be tested on its own.
export type Texture = "drawing" | "contours" | "s2" | "h3" | "a5";
export type PostType = "experiments" | "maps" | "notes";

export interface TexturedPost {
  id: string;
  data: { type: PostType; date: Date; texture?: Texture | undefined };
}

/**
 * The front matter's `texture` wins; otherwise drawing for experiments,
 * contours for maps, and drawing and contours in turn for everything else
 * (alternating by publication order, oldest first).
 */
export function textureFor(post: TexturedPost, all: readonly TexturedPost[]): Texture {
  if (post.data.texture) return post.data.texture;
  if (post.data.type === "experiments") return "drawing";
  if (post.data.type === "maps") return "contours";
  const others = all
    .filter((p) => p.data.type !== "experiments" && p.data.type !== "maps")
    .toSorted((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  return others.findIndex((p) => p.id === post.id) % 2 === 0 ? "drawing" : "contours";
}
