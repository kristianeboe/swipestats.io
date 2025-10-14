import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      author: s.string().optional(),
      authorImage: s.string().optional(),
      featured: s.boolean().default(false),
      image: s.string().optional(),
      readingTime: s.number().optional(),
      // Velite will handle MDX content processing and expose it as 'content'
      content: s.mdx(),
      // Auto-generate slug from file path
      slug: s.path().transform((path) => path.replace(/^posts\//, "")),
    })
    .transform((data) => ({
      ...data,
      permalink: `/blog/${data.slug}`,
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    // We can add remark/rehype plugins here if needed in the future
  },
});
