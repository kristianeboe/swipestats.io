import { type Metadata } from "next";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Image from "next/image";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("blogwithphotos");

  return (
    <main>
      <div className="w-full">
        <Image
          src={page.data.coverPhoto.url!}
          alt={page.data.coverPhoto.alt ?? ""}
          width={1200}
          height={400}
          className="h-[400px] w-full rounded-t-lg object-cover object-center"
        />

        <div className="px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {page.data.pagetitle}
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl">
              Discover the transformative power of mindfulness and how it can
              enrich your daily life.
            </p>
          </div>
        </div>
      </div>
      <div className="container max-w-3xl">
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("blogwithphotos");

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
