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

export function BlogGrid({
  posts,
  title = "From the blog",
  description = "Learn how to grow your business with our expert advice.",
  showFeatured = false,
  featuredPosts = [],
  basePath = "/blog",
}: BlogGridProps) {
  // Get OG image URL for blog posts - always use OG route for consistent generation
  const getDisplayImageUrl = (post: Post) => {
    // Use relative OG image route - works for both localhost and production
    return `/api/og/v0/${post.slug}`;
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">{description}</p>
        </div>

        {/* Featured Posts Section */}
        {showFeatured && featuredPosts.length > 0 && (
          <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
            <h3 className="mb-8 text-2xl font-semibold text-gray-900">
              Featured
            </h3>
            {featuredPosts.slice(0, 1).map((post) => {
              return (
                <article
                  key={post.slug}
                  className="group relative isolate mb-16 flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
                >
                  {/* Background display image */}
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      backgroundImage: `url(${getDisplayImageUrl(post)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                  <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                  <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                    <span className="mr-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                      ⭐ Featured
                    </span>
                    {post.date && (
                      <time dateTime={post.date} className="mr-8">
                        {format(parseISO(post.date), "MMM dd, yyyy")}
                      </time>
                    )}
                    {post.tags.length > 0 && (
                      <span className="relative z-10 rounded-full bg-gray-50/10 px-3 py-1.5 font-medium text-gray-300 hover:bg-gray-50/20">
                        #{post.tags[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-3xl font-semibold leading-6 text-white sm:text-4xl">
                    <Link href={`${basePath}/${post.slug}`}>
                      <span className="absolute inset-0" />
                      <span className="transition-colors group-hover:text-blue-200">
                        {post.title}
                      </span>
                    </Link>
                  </h3>

                  {post.description && (
                    <p className="mt-4 line-clamp-3 text-lg leading-6 text-gray-300">
                      {post.description}
                    </p>
                  )}

                  {post.author && (
                    <div className="relative mt-6 flex items-center gap-x-4">
                      {post.authorImage ? (
                        <Image
                          src={
                            post.authorImage.startsWith("/")
                              ? post.authorImage
                              : `/images/people/${post.authorImage}`
                          }
                          alt={post.author}
                          width={40}
                          height={40}
                          className="size-10 flex-none rounded-full object-cover ring-2 ring-white/20"
                        />
                      ) : (
                        <div className="flex size-10 flex-none items-center justify-center rounded-full bg-white/10">
                          <span className="text-sm font-semibold text-white">
                            {post.author.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-white">
                          {post.author}
                        </p>
                        <p className="text-gray-300">Author</p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => {
            return (
              <article
                key={post.slug}
                className="group flex flex-col items-start justify-between"
              >
                <div className="relative w-full">
                  {post.image ? (
                    <Image
                      src={getDisplayImageUrl(post)}
                      alt={post.title}
                      width={640}
                      height={360}
                      className="aspect-video w-full rounded-2xl object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                  ) : (
                    <img
                      src={getDisplayImageUrl(post)}
                      alt={post.title}
                      className="aspect-video w-full rounded-2xl object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                  )}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>

                <div className="flex max-w-xl grow flex-col justify-between">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    {post.date && (
                      <time dateTime={post.date} className="text-gray-500">
                        {format(parseISO(post.date), "MMM dd, yyyy")}
                      </time>
                    )}
                    {post.tags.length > 0 && (
                      <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                        #{post.tags[0]}
                      </span>
                    )}
                    {post.featured && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1.5 font-medium text-yellow-800">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  <div className="group relative grow">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={`${basePath}/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    {post.description && (
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                        {post.description}
                      </p>
                    )}
                  </div>

                  {post.author && (
                    <div className="relative mt-8 flex items-center gap-x-4">
                      {post.authorImage ? (
                        <Image
                          src={
                            post.authorImage.startsWith("/")
                              ? post.authorImage
                              : `/images/people/${post.authorImage}`
                          }
                          alt={post.author}
                          width={40}
                          height={40}
                          className="size-10 rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                          <span className="text-sm font-semibold text-white">
                            {post.author.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">
                          {post.author}
                        </p>
                        <p className="text-gray-600">Author</p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
