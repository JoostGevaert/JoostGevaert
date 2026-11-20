import { getCollection, type CollectionEntry } from "astro:content";

export { textureFor, type Texture, type PostType } from "./texture";
export type Post = CollectionEntry<"posts">;

/** Published posts, newest first. Drafts show only in `pnpm dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", (p) => import.meta.env.DEV || !p.data.draft);
  return posts.toSorted((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
