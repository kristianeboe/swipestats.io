import { createPrismicClient } from "@/prismicio";
import { type MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createPrismicClient();

  const products = await client.getAllByType("product_page");
  const blogPosts = await client.getAllByType("blog_post");

  return [
    {
      url: "https://www.swipestats.io",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://www.swipestats.io/upload",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://www.swipestats.io/swipeguide",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://www.swipestats.io/ai-dating-photos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...products.map((product) => ({
      url: `https://www.swipestats.io/products/${product.uid}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    {
      url: "https://www.swipestats.io/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...blogPosts.map((blogPost) => ({
      url: `https://www.swipestats.io/blog/${blogPost.uid}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
    {
      url: "https://www.swipestats.io/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: "https://www.swipestats.io/tos",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
