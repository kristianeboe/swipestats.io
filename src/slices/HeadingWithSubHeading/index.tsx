import { Text } from "@/app/_components/ui/text";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import { type JSX } from "react";
/**
 * Props for `H1WithSubHeading`.
 */
export type H1WithSubHeadingProps =
  SliceComponentProps<Content.H1WithSubHeadingSlice>;

/**
 * Component for "H1WithSubHeading" Slices.
 */
const H1WithSubHeading = ({ slice }: H1WithSubHeadingProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.variation === "default" ? (
        <Text.H1>{slice.primary.title}</Text.H1>
      ) : (
        <Text.H2>{slice.primary.title}</Text.H2>
      )}

      {/* <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {slice.primary.title}
        </h1> */}
      <p className="mt-6 text-xl leading-8">{slice.primary.subheading}</p>
    </section>
  );
};

export default H1WithSubHeading;
