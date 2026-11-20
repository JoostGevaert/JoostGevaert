import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "joost.engineer",
    description: "Joost Gevaert's blog for his (thought) experiments and side projects.",
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/posts/${p.id}/`,
      categories: [p.data.type],
    })),
    customData: "<language>en-us</language>",
  });
}
