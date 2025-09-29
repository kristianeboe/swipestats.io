import { env } from "@/env";

import { BlogGrid } from "./BlogGrid";
import { posts as allPosts } from ".velite";

const ogImageUrl = `${env.NEXT_PUBLIC_BASE_URL}/api/og/blog`;

export const metadata = {
  title: "Blog | SwipeStats - Data-Driven Dating Insights",
  description:
    "Expert insights, data-driven strategies, and actionable advice for improving your online dating success.",
  keywords: [
    "dating app blog",
    "online dating tips",
    "dating app statistics",
    "tinder insights",
    "dating app strategy",
    "data-driven dating",
    "match rate optimization",
    "dating profile tips",
  ],
  openGraph: {
    title: "SwipeStats Blog - Data-Driven Dating Insights",
    description:
      "Expert insights and data-driven strategies for online dating success.",
    type: "website",
    url: "/blog",
    siteName: "SwipeStats",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "SwipeStats Blog - Data-Driven Dating Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwipeStats Blog - Data-Driven Dating Insights",
    description:
      "Expert insights and data-driven strategies for online dating success.",
    images: [ogImageUrl],
    creator: "@SwipeStats",
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
        title="Data-Driven Dating Insights"
        description="Expert insights and actionable strategies to help you succeed on dating apps."
        showFeatured={true}
        featuredPosts={featuredPosts}
      />
    </>
  );
}
