import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";

import type { Post } from ".velite";

interface BlogGridProps {
  posts: readonly Post[];
  title?: string;
  description?: string;
  showFeatured?: boolean;
  featuredPosts?: readonly Post[];
  basePath?: string;
}

// Moved outside component to avoid recreation on every render
function getDisplayImageUrl(post: Post): string {
  return `/api/og/v0/${post.slug}`;
}

// Extract author component to eliminate duplication
function AuthorInfo({
  author,
  authorImage,
  theme = "light",
  className = "mt-8",
}: {
  author: string;
  authorImage?: string;
  theme?: "light" | "dark";
  className?: string;
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={`relative flex cursor-pointer items-center gap-x-4 transition-opacity hover:opacity-70 ${className}`}
    >
      {authorImage ? (
        <Image
          src={
            authorImage.startsWith("/")
              ? authorImage
              : `/images/people/${authorImage}`
          }
          alt={author}
          width={40}
          height={40}
          className={`size-10 flex-none rounded-full object-cover ring-2 ${
            isDark ? "ring-white/20" : "ring-white"
          }`}
        />
      ) : (
        <div
          className={`flex size-10 flex-none items-center justify-center rounded-full ${
            isDark
              ? "bg-white/10"
              : "bg-gradient-to-br from-blue-500 to-purple-600"
          }`}
        >
          <span className="text-sm font-semibold text-white">
            {author.charAt(0)}
          </span>
        </div>
      )}
      <div className="text-sm leading-6">
        <p
          className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {author}
        </p>
        <p className={isDark ? "text-gray-300" : "text-gray-600"}>Author</p>
      </div>
    </div>
  );
}

export function BlogGrid({
  posts,
  title = "From the blog",
  description = "Learn how to grow your business with our expert advice.",
  showFeatured = false,
  featuredPosts = [],
  basePath = "/blog",
}: BlogGridProps) {
  const featuredPost = featuredPosts[0];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">{description}</p>
        </div>

        {/* Featured Post Section */}
        {showFeatured && featuredPost && (
          <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
            <h3 className="mb-8 text-2xl font-semibold text-gray-900">
              Featured
            </h3>
            <article className="group relative isolate mb-16 flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80">
              {/* Background display image */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  backgroundImage: `url(${getDisplayImageUrl(featuredPost)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-2 overflow-hidden text-sm leading-6 text-gray-300">
                <time dateTime={featuredPost.date} className="mr-4">
                  {format(parseISO(featuredPost.date), "MMM dd, yyyy")}
                </time>
                {featuredPost.tags.length > 0 && (
                  <span className="relative z-10 rounded-full bg-gray-50/10 px-3 py-1.5 font-medium text-gray-300 transition-colors hover:bg-gray-50/30 hover:text-white">
                    #{featuredPost.tags[0]}
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-3xl font-semibold leading-6 text-white sm:text-4xl">
                <Link
                  href={`${basePath}/${featuredPost.slug}`}
                  className="transition-colors hover:text-blue-200"
                >
                  {featuredPost.title}
                </Link>
              </h3>

              {featuredPost.description && (
                <Link
                  href={`${basePath}/${featuredPost.slug}`}
                  className="mt-4 line-clamp-3 block text-lg leading-6 text-gray-300 hover:text-white"
                >
                  {featuredPost.description}
                </Link>
              )}

              {featuredPost.author && (
                <AuthorInfo
                  author={featuredPost.author}
                  authorImage={featuredPost.authorImage}
                  theme="dark"
                  className="mt-6"
                />
              )}
            </article>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col items-start justify-between"
            >
              <Link
                href={`${basePath}/${post.slug}`}
                className="relative w-full transition-transform group-hover:scale-[1.02]"
              >
                <Image
                  src={getDisplayImageUrl(post)}
                  alt={post.title}
                  width={640}
                  height={360}
                  className="aspect-video w-full rounded-2xl object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </Link>

              <div className="flex max-w-xl grow flex-col justify-between">
                <div className="mt-8 flex flex-wrap items-center gap-2 text-xs">
                  <time dateTime={post.date} className="text-gray-500">
                    {format(parseISO(post.date), "MMM dd, yyyy")}
                  </time>
                  {post.tags.length > 0 && (
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900">
                      #{post.tags[0]}
                    </span>
                  )}
                </div>

                <div className="relative grow">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                    <Link
                      href={`${basePath}/${post.slug}`}
                      className="hover:text-gray-600"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.description && (
                    <Link
                      href={`${basePath}/${post.slug}`}
                      className="mt-5 line-clamp-3 block text-sm leading-6 text-gray-600 hover:text-gray-900"
                    >
                      {post.description}
                    </Link>
                  )}
                </div>

                {post.author && (
                  <AuthorInfo
                    author={post.author}
                    authorImage={post.authorImage}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
