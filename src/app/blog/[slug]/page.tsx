import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

import { env } from "@/env";

import { MDXContent } from "../mdx/MDXContent";
import { Prose } from "../mdx/Prose";
import { RelatedPosts } from "../RelatedPosts";
import { posts } from ".velite";

export const dynamic = "force-static";

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const ogImageUrl = new URL("/api/sharing", env.NEXT_PUBLIC_BASE_URL);
  ogImageUrl.searchParams.set("title", post.title);
  if (post.description) {
    ogImageUrl.searchParams.set("description", post.description);
  }
  if (post.tags.length > 0) {
    ogImageUrl.searchParams.set("tag", post.tags[0]!);
  }
  const socialImageUrl = ogImageUrl.toString();

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : [],
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [socialImageUrl],
    },
  };
}

// Helper function to get gradient classes
function getGradientClasses(title: string): string {
  const gradients = [
    "from-blue-400 to-purple-500",
    "from-purple-400 to-pink-500",
    "from-pink-400 to-red-500",
    "from-red-400 to-orange-500",
    "from-orange-400 to-yellow-500",
    "from-green-400 to-blue-500",
  ];
  const index = title.length % gradients.length;
  return gradients[index]!;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { content, ...meta } = post;
  const readingTime = meta.readingTime || 5; // Default to 5 min if not specified
  const showSticky = meta.showStickyVisual === true;

  // Simple traditional layout without sticky visual
  if (!showSticky) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-base font-semibold text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="mt-8">
            {meta.tags.length > 0 && (
              <p className="text-base font-semibold leading-7 text-blue-600">
                #{meta.tags[0]}
              </p>
            )}

            <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {meta.title}
            </h1>

            {meta.description && (
              <p className="mt-6 text-xl leading-8 text-gray-700">
                {meta.description}
              </p>
            )}

            {/* Article meta */}
            <div className="mt-8 flex items-center gap-x-6 text-sm">
              {meta.author && (
                <div className="flex items-center gap-x-2">
                  {meta.authorImage ? (
                    <Image
                      src={`/images/people/${meta.authorImage}`}
                      alt={meta.author}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-sm font-semibold text-white">
                        {meta.author.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">{meta.author}</p>
                    <p className="text-gray-600">Author</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-x-6 text-gray-500">
                {meta.date && (
                  <div className="flex items-center gap-x-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={meta.date}>
                      {format(parseISO(meta.date), "MMM dd, yyyy")}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{meta.readingTime} min read</span>
                </div>
              </div>
            </div>

            {/* Featured badge */}
            {meta.featured && (
              <div className="mt-6">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                  ⭐ Featured Post
                </span>
              </div>
            )}

            {/* Tags */}
            {meta.tags.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {meta.tags.slice(1).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article content */}
          <div className="mt-16 max-w-none">
            <Prose>
              <MDXContent code={content} />
            </Prose>
          </div>
        </div>

        {/* Author section */}
        {meta.author && (
          <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-pretty text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                  About the Author
                </h2>
                <div className="mt-8 flex items-center gap-x-6">
                  {meta.authorImage ? (
                    <Image
                      src={`/images/people/${meta.authorImage}`}
                      alt={meta.author}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover shadow-lg ring-4 ring-white"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xl font-semibold text-white">
                        {meta.author.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {meta.author}
                    </h3>
                    <p className="text-gray-600">
                      Founder of homi and real estate enthusiast.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related posts */}
        <RelatedPosts posts={posts.filter((p) => p.slug !== meta.slug)} />
      </div>
    );
  }

  // Sticky visual layout (opt-in)
  return (
    <div className="bg-white">
      {/* Hero Section with Sticky Visual */}
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Content */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <Link
                  href="/blog-velite"
                  className="inline-flex items-center gap-2 text-base font-semibold text-blue-600 hover:text-blue-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>

                {meta.tags.length > 0 && (
                  <p className="mt-2 text-base font-semibold leading-7 text-blue-600">
                    #{meta.tags[0]}
                  </p>
                )}

                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {meta.title}
                </h1>

                {meta.description && (
                  <p className="mt-6 text-xl leading-8 text-gray-700">
                    {meta.description}
                  </p>
                )}

                {/* Article meta */}
                <div className="mt-8 flex items-center gap-x-4 text-sm">
                  {meta.author && (
                    <div className="flex items-center gap-x-2">
                      {meta.authorImage ? (
                        <Image
                          src={`/images/people/${meta.authorImage}`}
                          alt={meta.author}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                          <span className="text-sm font-semibold text-white">
                            {meta.author.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">
                          {meta.author}
                        </p>
                        <p className="text-gray-600">Author</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-x-6 text-gray-500">
                    {meta.date && (
                      <div className="flex items-center gap-x-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={meta.date}>
                          {format(parseISO(meta.date), "MMM dd, yyyy")}
                        </time>
                      </div>
                    )}
                    <div className="flex items-center gap-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </div>

                {/* Featured badge */}
                {meta.featured && (
                  <div className="mt-6">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                      ⭐ Featured Post
                    </span>
                  </div>
                )}

                {/* All tags */}
                {meta.tags.length > 1 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {meta.tags.slice(1).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured image/visual */}
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            {meta.image ? (
              <Image
                src={`/images/blog/${meta.image}`}
                alt={meta.title}
                width={912}
                height={684}
                className="aspect-[4/3] w-[48rem] max-w-none rounded-xl object-cover shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              />
            ) : (
              <div
                className={`aspect-[4/3] w-[48rem] max-w-none rounded-xl bg-gradient-to-br ${getGradientClasses(meta.title)} shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]`}
              >
                <div className="flex h-full items-center justify-center">
                  <div className="text-8xl font-bold text-white/30">
                    {meta.title.charAt(0)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Article content */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <Prose>
                  <MDXContent code={content} />
                </Prose>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author section */}
      {meta.author && (
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-pretty text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                About the Author
              </h2>
              <div className="mt-8 flex items-center gap-x-6">
                {meta.authorImage ? (
                  <Image
                    src={`/images/people/${meta.authorImage}`}
                    alt={meta.author}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover shadow-lg ring-4 ring-white"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-xl font-semibold text-white">
                      {meta.author.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {meta.author}
                  </h3>
                  <p className="text-gray-600">
                    Founder of homi and real estate enthusiast.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related posts */}
      <RelatedPosts
        posts={posts
          .filter((p) => p.slug !== meta.slug)
          .filter((p) => p.tags.some((tag) => meta.tags.includes(tag)))}
        basePath="/blog-velite"
      />
    </div>
  );
}
