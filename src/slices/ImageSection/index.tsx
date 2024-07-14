import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import Image from "next/image";

/**
 * Props for `ImageSection`.
 */
export type ImageSectionProps = SliceComponentProps<Content.ImageSectionSlice>;

/**
 * Component for "ImageSection" Slices.
 */
const ImageSection = ({ slice }: ImageSectionProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8"
    >
      <Image
        src={
          slice.primary.image.url ??
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
        }
        alt={slice.primary.image.alt ?? ""}
        className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
        width={1440}
        height={1000}
      />
    </section>
  );
};

export default ImageSection;
