import { type Metadata } from "next";
import { SliceZone } from "@prismicio/react";

import { createPrismicClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page() {
  const client = createPrismicClient();
  const page = await client.getSingle("ai_dating_photos");

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createPrismicClient();
  const page = await client.getSingle("ai_dating_photos");

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
