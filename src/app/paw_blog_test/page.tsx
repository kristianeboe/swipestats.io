import { type Metadata } from "next";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("paw_blog_test");

  return (
    <main className="container prose py-20">
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("paw_blog_test");

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
