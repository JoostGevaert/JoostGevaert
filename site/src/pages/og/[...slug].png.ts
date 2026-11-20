import type { APIRoute, GetStaticPaths } from "astro";
import { getPosts, textureFor, type Post } from "../../lib/posts";
import { renderCard, figurePath } from "../../lib/og";
import { isoDate } from "../../lib/format";

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post, texture: textureFor(post, posts) } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { post, texture } = props as { post: Post; texture: ReturnType<typeof textureFor> };
  const png = await renderCard({
    title: post.data.title,
    date: isoDate(post.data.date),
    type: post.data.type,
    texture,
    figure: post.data.ogFigure && post.filePath ? figurePath(post.filePath, post.data.ogFigure) : undefined,
  });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
