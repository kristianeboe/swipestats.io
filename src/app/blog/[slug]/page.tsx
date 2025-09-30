import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

import { env } from "@/env";

import { ExitPopup } from "../mdx/ExitPopup";
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

  const ogImageUrl = `${env.NEXT_PUBLIC_BASE_URL}/api/og/v0/${slug}`;
  const socialImageUrl = ogImageUrl;

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { content, ...meta } = post;
  const showSticky = meta.showStickyVisual === true;

  // Simple traditional layout without sticky visual
  if (!showSticky) {
    return (
      <div className="mt-12 bg-white">
        {/* Background decoration */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#CF364C] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-base font-semibold text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="mt-8">
              <h1 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
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
                        src={
                          meta.authorImage.startsWith("/")
                            ? meta.authorImage
                            : `/images/people/${meta.authorImage}`
                        }
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
              {meta.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {meta.tags.map((tag) => (
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
                      src={
                        meta.authorImage.startsWith("/")
                          ? meta.authorImage
                          : `/images/people/${meta.authorImage}`
                      }
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

        {/* Exit popup */}
        <ExitPopup />
      </div>
    );
  }

  // Sticky visual layout (opt-in)
  return (
    <div className="mt-12 bg-white">
      {/* Hero Section with Sticky CTA */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#CF364C] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>

        {/* Sticky CTA Sidebar - Desktop Only, Absolutely Positioned */}
        <div className="hidden lg:block">
          <div className="fixed right-8 top-24 z-10 w-80">
            <div className="rounded-xl border border-rose-200/60 bg-gradient-to-r from-white via-gray-50 to-white p-6 shadow-lg">
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900">
                Stop Wasting Money on Dating Apps
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Fix the real problem instead. Our undetectable AI photos show
                you from your best side.
              </p>

              {/* Guarantee badge */}
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-rose-600">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                More matches or your money back.
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 space-y-2">
                <Link
                  href="/ai-dating-photos"
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-rose-700 hover:to-rose-800 hover:shadow-xl"
                >
                  Check it out
                </Link>

                <Link
                  href="/newsletter"
                  className="flex w-full items-center justify-center rounded-lg border border-rose-300 bg-transparent px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  Or join our newsletter
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-5 space-y-1.5 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure payment
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Privacy protected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-2xl py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {meta.title}
            </h1>
            {meta.description && (
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {meta.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-3xl">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-base font-semibold text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Article meta */}
          <div className="mb-12 flex items-center gap-x-6 text-sm">
            {meta.author && (
              <div className="flex items-center gap-x-2">
                {meta.authorImage ? (
                  <Image
                    src={
                      meta.authorImage.startsWith("/")
                        ? meta.authorImage
                        : `/images/people/${meta.authorImage}`
                    }
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
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                ⭐ Featured Post
              </span>
            </div>
          )}

          {/* Tags */}
          {meta.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Article content */}
          <div className="max-w-none">
            <Prose>
              <MDXContent code={content} />
            </Prose>
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
                    src={
                      meta.authorImage.startsWith("/")
                        ? meta.authorImage
                        : `/images/people/${meta.authorImage}`
                    }
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
      />

      {/* Exit popup */}
      <ExitPopup />
    </div>
  );
}
