import { createPrismicClient } from "@/prismicio";
import { type MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createPrismicClient();

  const products = await client.getAllByType("product_page");
  const blogPosts = await client.getAllByType("blog_post");

  return [
    {
      url: "https://swipestats.io",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://swipestats.io/upload",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://swipestats.io/ai-dating-photos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...products.map((product) => ({
      url: `https://swipestats.io/products/${product.uid}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    {
      url: "https://swipestats.io/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...blogPosts.map((blogPost) => ({
      url: `https://swipestats.io/blog/${blogPost.uid}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
    {
      url: "https://swipestats.io/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: "https://swipestats.io/tos",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
