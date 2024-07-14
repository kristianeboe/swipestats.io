import { type Metadata } from "next";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { posts, type BlogPost } from "./BlogSection";
import { BlogArticleCard } from "./BlogArticleCard";
import Image from "next/image";
import { Text } from "../_components/ui/text";
import NewsletterCTA from "../NewsletterCTA";
import Link from "next/link";
import {
  type Author,
  blogPostGraphQuery,
  getAuthorFromBlog,
} from "@/lib/utils/prismic.utils";

const externalPosts = [
  ...posts,

  // ... include all posts, including featured ones
];

export default async function BlogPage() {
  const client = createClient();
  const pages = await client.getAllByType("blog_post", {
    graphQuery: blogPostGraphQuery,
  });

  // const page = await client.getSingle("blog_home_page");

  //return <SliceZone slices={page.data.slices} components={components} />;
  return (
    <div className="container max-w-7xl pt-12 md:pt-24">
      <Text.MarketingH1 className="pb-12 text-center md:pb-24">
        Blog
      </Text.MarketingH1>
      {/* <FeaturedPost post={externalPosts[0]!} /> */}
      <FeaturedArticleFlex post={externalPosts[0]!} />
      <div className="mt-20 grid items-center gap-4 md:grid-cols-3 lg:gap-20">
        <div className="md:col-span-2">
          <NewsletterCTA />
        </div>
        {/* <SecondaryFeaturedPost2 post={externalPosts[1]!} /> */}
        {/* <FeaturedArticle post={externalPosts[1]!} /> */}
        <SecondaryFeaturedPost3 post={externalPosts[1]!} />
        {/* <BlogArticleCard post={externalPosts[1]!} /> */}
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Prismic Articles
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {pages.map(
            (post) => {
              const publishedDate =
                post.last_publication_date || new Date().toISOString();
              // console.log("post.data.author", post.data.author);
              // console.log("publishedDate", {
              //   publishedDate,
              //   firstPublisheDate: post.first_publication_date,
              //   lastPublicationDate: post.last_publication_date,
              // });
              // console.log("post", post.data);
              // console.log("full post", post);

              const author = getAuthorFromBlog(post.data);

              return (
                <article
                  key={post.id}
                  className="flex max-w-xl flex-col items-start justify-between"
                >
                  <div className="flex items-center gap-x-4 text-xs">
                    <time
                      dateTime={publishedDate.toString()}
                      className="text-gray-500"
                    >
                      {publishedDate.toString()}
                    </time>
                    {/* <a
                  href={post.category.href}
                  className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                >
                  {post.category.title}
                </a> */}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={`${post.url}`}>
                        <span className="absolute inset-0" />
                        {post.data.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {post.data.description}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    {/* <img
                  alt=""
                  src={post.data.author author.imageUrl}
                  className="h-10 w-10 rounded-full bg-gray-50"
                /> */}
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        <a href="#">
                          <span className="absolute inset-0" />
                          {author.name}
                        </a>
                      </p>
                      <p className="text-gray-600">{author.role}</p>
                    </div>
                  </div>
                </article>
              );
            },
            // <BlogArticleCard key={post.id} post={{
            //   author: {
            //     href: "/#",

            //   }
            // }} />
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Prismic articles 2
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((post) => {
            const publishedDate =
              post.last_publication_date || new Date().toISOString();
            const author = getAuthorFromBlog(post.data);
            return (
              <BlogArticleCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.data.title!,
                  description: post.data.description!,
                  date: publishedDate.toString(),
                  readTime: "5 min read",
                  datetime: publishedDate.toString(),
                  href: post.url!,
                  imageUrl:
                    post.data.meta_image.url ??
                    `https://swipestats.io/api/og/blog/${post.data.title}`,
                  category: {
                    title: "Article",
                    href: "#",
                  },
                  author: {
                    href: author.instagramurl!,
                    imageUrl: author.profile_image.url!,
                    name: author.name!,
                    role: author.role!,
                  },
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Latest Articles
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {externalPosts.map((post) => (
            <BlogArticleCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      {/* 
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {externalPosts.slice(4).map((post) => (
              <CompressedBlogEntry2 key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}

// TODO FIx
//  export async function generateMetadata(): Promise<Metadata> {
//    const client = createClient();
//    const page = await client.getSingle("blog_home_page");

//    return {
//      title: page.data.meta_title,
//      description: page.data.meta_description,
//    };
//  }

const FeaturedArticleFlex = ({ post }: { post: BlogPost }) => {
  return (
    <Link href={"/blog/test-blog"} className="group">
      <div className="mb-10 flex flex-col gap-10 overflow-hidden md:h-96 md:flex-row">
        <div className="flex-none md:w-1/2 lg:w-3/5">
          <Image
            src={post.imageUrl}
            alt={`Title image with the text: ${post.title}`}
            width={1200}
            height={384}
            className="h-96 w-full rounded-2xl object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Text.H2 className="line-clamp-3 group-hover:text-rose-600">
            {post.title}
          </Text.H2>
          <Text.P>{post.description}</Text.P>
          <div className="text-neutrals-400 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.25 12.75H5.75C5.19772 12.75 4.75 13.1977 4.75 13.75V16.25C4.75 16.8023 5.19772 17.25 5.75 17.25H9.25C9.80228 17.25 10.25 16.8023 10.25 16.25V13.75C10.25 13.1977 9.80228 12.75 9.25 12.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M18.25 12.75H14.75C14.1977 12.75 13.75 13.1977 13.75 13.75V16.25C13.75 16.8023 14.1977 17.25 14.75 17.25H18.25C18.8023 17.25 19.25 16.8023 19.25 16.25V13.75C19.25 13.1977 18.8023 12.75 18.25 12.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M16.75 6.75L19.25 13.25V15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M7.25 6.75L4.75 13.25V15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M13.5 14.25H10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span className="typography-caption1 inline-block font-normal">
                {post.readTime}
              </span>
            </div>
            <span className="typography-caption1 inline-block font-normal">
              {post.date}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                alt={`Headshot photo of ${post.author.name}, ${post.author.role}`}
                loading="lazy"
                width="56"
                height="56"
                decoding="async"
                className="rounded"
                src={post.author.imageUrl}
                style={{ color: "transparent" }}
              />
              <div className="flex flex-col">
                <h3 className="typography-headline3 inline-block font-medium">
                  {post.author.name}
                </h3>
                <span className="typography-body1 inline-block font-normal">
                  {post.author.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeaturedArticle = ({ post }: { post: BlogPost }) => {
  return (
    <div className="mb-10 grid gap-10 overflow-hidden md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-3">
        {/* <img
          alt={`Title image with the text: ${post.title}`}
          fetchPriority="high"
          width="1200"
          height="630"
          decoding="async"
          className="rounded-2xl object-cover"
          src={post.imageUrl}
          style={{ color: "transparent" }}
        /> */}
        <Image
          src={post.imageUrl}
          alt={`Title image with the text: ${post.title}`}
          width={1200}
          height={384}
          className="h-96 rounded-2xl object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 lg:col-span-2">
        <Text.H2 className="group-hover:text-rose-600">{post.title}</Text.H2>
        {/* <h2 className="group-hover:text-matcha-300 font-serif text-[28px] font-medium leading-[30px] tracking-[-0.8px] transition-colors lg:text-[40px] lg:leading-tight">
        </h2> */}
        {/* <span className="typography-body1 inline-block font-normal">
          {post.description}
        </span> */}
        <Text.P>{post.description}</Text.P>
        <div className="text-neutrals-400 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.25 12.75H5.75C5.19772 12.75 4.75 13.1977 4.75 13.75V16.25C4.75 16.8023 5.19772 17.25 5.75 17.25H9.25C9.80228 17.25 10.25 16.8023 10.25 16.25V13.75C10.25 13.1977 9.80228 12.75 9.25 12.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M18.25 12.75H14.75C14.1977 12.75 13.75 13.1977 13.75 13.75V16.25C13.75 16.8023 14.1977 17.25 14.75 17.25H18.25C18.8023 17.25 19.25 16.8023 19.25 16.25V13.75C19.25 13.1977 18.8023 12.75 18.25 12.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M16.75 6.75L19.25 13.25V15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M7.25 6.75L4.75 13.25V15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M13.5 14.25H10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="typography-caption1 inline-block font-normal">
              {post.readTime}
            </span>
          </div>
          <span className="typography-caption1 inline-block font-normal">
            {post.date}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              alt={`Headshot photo of ${post.author.name}, ${post.author.role}`}
              loading="lazy"
              width="56"
              height="56"
              decoding="async"
              className="rounded"
              src={post.author.imageUrl}
              style={{ color: "transparent" }}
            />
            <div className="flex flex-col">
              <h3 className="typography-headline3 inline-block font-medium">
                {post.author.name}
              </h3>
              <span className="typography-body1 inline-block font-normal">
                {post.author.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SecondaryFeaturedPost3(props: { post: BlogPost }) {
  const post = props.post;
  return (
    <article
      key={post.id}
      className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-48 md:h-96"
    >
      <img
        alt=""
        src={post.imageUrl}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
      <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

      <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
        <time dateTime={post.datetime} className="mr-8">
          {post.date}
        </time>
        <div className="-ml-4 flex items-center gap-x-4">
          <svg
            viewBox="0 0 2 2"
            className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
          >
            <circle r={1} cx={1} cy={1} />
          </svg>
          <div className="flex gap-x-2.5">
            <img
              alt=""
              src={post.author.imageUrl}
              className="h-6 w-6 flex-none rounded-full bg-white/10"
            />
            {post.author.name}
          </div>
        </div>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
        <a href={post.href}>
          <span className="absolute inset-0" />
          {post.title}
        </a>
      </h3>
    </article>
  );
}

const CompressedBlogEntry: React.FC<{ post: BlogPost }> = ({ post }) => (
  <li className="flex justify-between gap-x-6 py-5">
    <div className="flex min-w-0 gap-x-4">
      <img
        className="h-12 w-12 flex-none rounded-full bg-gray-50"
        src={post.author.imageUrl}
        alt=""
      />
      <div className="min-w-0 flex-auto">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {post.title}
        </p>
        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
          {post.author.name}
        </p>
      </div>
    </div>
    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
      <p className="text-sm leading-6 text-gray-900">{post.category.title}</p>
      <p className="mt-1 text-xs leading-5 text-gray-500">{post.date}</p>
    </div>
  </li>
);

function CompressedBlogEntry2(props: { post: BlogPost }) {
  const post = props.post;
  return (
    <article
      key={post.id}
      className="relative isolate flex flex-col gap-8 lg:flex-row"
    >
      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
        <img
          alt=""
          src={post.imageUrl}
          className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div>
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime={post.datetime} className="text-gray-500">
            {post.date}
          </time>
          <a
            href={post.category.href}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            {post.category.title}
          </a>
        </div>
        <div className="group relative max-w-xl">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <a href={post.href}>
              <span className="absolute inset-0" />
              {post.title}
            </a>
          </h3>
          <p className="mt-5 text-sm leading-6 text-gray-600">
            {post.description}
          </p>
        </div>
        <div className="mt-6 flex border-t border-gray-900/5 pt-6">
          <div className="relative flex items-center gap-x-4">
            <img
              alt=""
              src={post.author.imageUrl}
              className="h-10 w-10 rounded-full bg-gray-50"
            />
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">
                <a href={post.author.href}>
                  <span className="absolute inset-0" />
                  {post.author.name}
                </a>
              </p>
              <p className="text-gray-600">{post.author.role}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
