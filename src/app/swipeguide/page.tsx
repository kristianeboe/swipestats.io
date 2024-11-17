import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createPrismicClient } from "@/prismicio";
import { components } from "@/slices";

export default async function SwipeGuidePage() {
  const client = createPrismicClient();
  const page = await client
    .getByUID("product_page", "swipeguide")
    .catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createPrismicClient();
  const page = await client
    .getByUID("product_page", "swipeguide")
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}
