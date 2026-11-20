import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    type: z.enum(["experiments", "maps", "notes"]),
    texture: z.enum(["drawing", "contours", "s2", "h3", "a5"]).optional(),
    ogFigure: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
