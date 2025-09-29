import { env } from "@/env";

import { BlogGrid } from "./BlogGrid";
import { posts as allPosts } from ".velite";

const ogImageUrl = `${env.NEXT_PUBLIC_BASE_URL}/api/sharing?title=${encodeURIComponent("Homi Blog")}&description=${encodeURIComponent("Smart real estate insights and data-driven strategies")}&tag=insights`;

export const metadata = {
  title: "Blog | Homi - Smart Real Estate Insights",
  description:
    "Smart real estate insights, data-driven strategies, and expert advice for better property decisions.",
  keywords: [
    "real estate blog",
    "house hunting strategies",
    "property investment",
    "real estate technology",
    "data-driven decisions",
    "algorithmic approach",
    "property research",
    "market insights",
  ],
  openGraph: {
    title: "Homi Blog - Smart Real Estate Insights",
    description:
      "Smart real estate insights and data-driven strategies for better property decisions.",
    type: "website",
    url: "/blog",
    siteName: "Homi",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Homi Blog (Velite) - Smart Real Estate Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Homi Blog - Smart Real Estate Insights",
    description:
      "Smart real estate insights and data-driven strategies for better property decisions.",
    images: [ogImageUrl],
    creator: "@homi_dev",
  },
  alternates: {
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
};

export default function BlogPage() {
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const featuredPosts = sortedPosts.filter((post) => post.featured);
  const regularPosts = sortedPosts.filter((post) => !post.featured);

  return (
    <>
      <BlogGrid
        posts={regularPosts}
        title="Smart Real Estate Insights"
        description="Expert insights and data-driven strategies to help you make smarter real estate decisions."
        showFeatured={true}
        featuredPosts={featuredPosts}
      />
    </>
  );
}
