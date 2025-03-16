import { Button } from "@/app/_components/ui/button";

import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { type JSX } from "react";
/**
 * Props for `SuccessPhotosSection`.
 */
export type SuccessPhotosSectionProps =
  SliceComponentProps<Content.SuccessPhotosSectionSlice>;

/**
 * Component for "SuccessPhotosSection" Slices.
 */
const SuccessPhotosSection = ({
  slice,
}: SuccessPhotosSectionProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mt-32 overflow-hidden sm:mt-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
          <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {slice.primary.heading}
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              {slice.primary.description}
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600">
              {slice.primary.content}
            </p>
            <div className="mt-10 flex">
              <Link href={getPrismicLinkUrl(slice.primary.cta_href)}>
                <Button>
                  {slice.primary.cta_label}
                  {/* <span aria-hidden="true">&rarr;</span> */}
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
            <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
              <img
                alt={slice.primary.image_top_right.alt ?? ""}
                src={
                  slice.primary.image_top_right.url ??
                  "https://images.unsplash.com/photo-1670272502246-768d249768ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1152&q=80"
                }
                className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
              />
            </div>
            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
              <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                <img
                  alt={slice.primary.image_bottom_left.alt ?? ""}
                  src={
                    slice.primary.image_bottom_left.url ??
                    "https://images.unsplash.com/photo-1605656816944-971cd5c1407f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&h=604&q=80"
                  }
                  className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                />
              </div>
              <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                <img
                  alt={slice.primary.image_bottom_center.alt ?? ""}
                  src={
                    slice.primary.image_bottom_center.url ??
                    "https://images.unsplash.com/photo-1605656816944-971cd5c1407f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&h=604&q=80"
                  }
                  className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                />
              </div>
              <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                <img
                  alt={slice.primary.image_bottom_right.alt ?? ""}
                  src={
                    slice.primary.image_bottom_right.url ??
                    "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&h=604&q=80"
                  }
                  className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessPhotosSection;
