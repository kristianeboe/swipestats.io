import { type Metadata } from "next";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

import {
  blogPostGraphQuery,
  getBlogPostAndAuthor,
} from "@/lib/utils/prismic.utils";
import { AuthorCard } from "./AuthorCard";
import { SliceZone } from "@prismicio/react";
import { env } from "@/env";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const { blog, author } = await getBlogPostAndAuthor(params.uid);
  return (
    <div>
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
        <div className="mx-auto max-w-2xl py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {blog.data.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {blog.data.description}
            </p>
          </div>
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
      </div>
      <div className="container max-w-3xl">
        <SliceZone slices={blog.data.slices} components={components} />
        {author && (
          <div className="mt-20">
            <AuthorCard author={author} />
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { blog } = await getBlogPostAndAuthor(params.uid);

  return {
    title: blog.data.meta_title,
    description: blog.data.meta_description,
    openGraph: {
      images: [
        blog.data.meta_image.url ??
          env.NEXT_PUBLIC_BASE_URL + "/api/og/v0/" + blog.uid,
      ],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  console.log("generate static blog");
  const pages = await client.getAllByType("blog_post", {
    graphQuery: blogPostGraphQuery,
  }); // .catch(() => notFound());

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
