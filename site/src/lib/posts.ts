import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type Texture = "drawing" | "contours" | "s2" | "h3" | "a5";

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", (p) => import.meta.env.DEV || !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * A post's texture (BRAND.md, Textures): its front matter wins; otherwise
 * drawing for experiments, contours for maps, and drawing and contours in
 * turn for everything else (alternating by publication order).
 */
export function textureFor(post: Post, all: Post[]): Texture {
  if (post.data.texture) return post.data.texture;
  if (post.data.type === "experiments") return "drawing";
  if (post.data.type === "maps") return "contours";
  const others = all
    .filter((p) => p.data.type !== "experiments" && p.data.type !== "maps")
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  return others.findIndex((p) => p.id === post.id) % 2 === 0 ? "drawing" : "contours";
}

/** Category color token per post type: experiments teal, maps indigo, notes plum. */
export const typeColor = { experiments: "cat-teal", maps: "cat-indigo", notes: "cat-plum" } as const;
