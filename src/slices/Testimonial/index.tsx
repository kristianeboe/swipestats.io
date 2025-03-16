import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import Image from "next/image";
import { type JSX } from "react";
/**
 * Props for `Testimonial`.
 */
export type TestimonialProps = SliceComponentProps<Content.TestimonialSlice>;

/**
 * Component for "Testimonial" Slices.
 */
const Testimonial = ({ slice }: TestimonialProps): JSX.Element => {
  return (
    <figure
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mt-10 border-l border-indigo-600 pl-9"
    >
      <blockquote className="font-semibold text-gray-900">
        <p>“{slice.primary.quote}”</p>
      </blockquote>
      <figcaption className="mt-6 flex gap-x-4">
        <Image
          src={slice.primary.author_image.url!}
          alt={slice.primary.author_image.alt ?? ""}
          className="h-6 w-6 flex-none rounded-full bg-gray-50"
          width={24}
          height={24}
        />
        <div className="text-sm leading-6">
          <strong className="font-semibold text-gray-900">
            {slice.primary.author_name}
          </strong>{" "}
          –{slice.primary.author_title}
        </div>
      </figcaption>
    </figure>
  );
};

export default Testimonial;
