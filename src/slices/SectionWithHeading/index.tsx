import { Text } from "@/app/_components/ui/text";
import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { type JSX } from "react";
/**
 * Props for `SectionWithHeading`.
 */
export type SectionWithHeadingProps =
  SliceComponentProps<Content.SectionWithHeadingSlice>;

/**
 * Component for "SectionWithHeading" Slices.
 */
const SectionWithHeading = ({
  slice,
}: SectionWithHeadingProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mt-10"
    >
      <Text.H2>{slice.primary.title}</Text.H2>
      <Text.Prose>
        <PrismicRichText field={slice.primary.content} />
      </Text.Prose>
    </section>
  );
};

export default SectionWithHeading;
