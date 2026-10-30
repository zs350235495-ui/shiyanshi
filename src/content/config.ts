import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('反重力网络实验室'),
    tags: z.array(z.string()),
    category: z.string(),
    featured: z.boolean().default(false),
    readTime: z.string().default('8 min'),
    badge: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
