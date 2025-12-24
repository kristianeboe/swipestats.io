import { defineCollection, defineConfig, s } from "velite";

const AUTHOR_KEYS = ["kristian", "paw", "joe"] as const;
export type AuthorKey = (typeof AUTHOR_KEYS)[number];

type Author = {
  name: string;
  image: string;
  description: string;
};

// `satisfies` ensures the object keys match AuthorKey at compile time
export const AUTHORS = {
  kristian: {
    name: "Kristian",
    image: "/images/blog/authors/kristian.png",
    description: "Founder of SwipeStats.io",
  },
  paw: {
    name: "Paw",
    image: "/images/blog/authors/paw.png",
    description: "Founder of SwipeStats.io",
  },
  joe: {
    name: "Joe Buchoff",
    image: "/images/blog/authors/joe.png",
    description: "Founder of GetDates.io",
  },
} as const satisfies Record<AuthorKey, Author>;

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      author: s.enum(AUTHOR_KEYS).default("paw"),
      featured: s.boolean().default(false),
      image: s.string().optional(),
      // thumbnailImage: s.string().optional(),
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
