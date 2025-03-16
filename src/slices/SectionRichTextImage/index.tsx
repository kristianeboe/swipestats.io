import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import { type JSX } from "react";
/**
 * Props for `SectionRichTextImage`.
 */
export type SectionRichTextImageProps =
  SliceComponentProps<Content.SectionRichTextImageSlice>;

/**
 * Component for "SectionRichTextImage" Slices.
 */
const SectionRichTextImage = ({
  slice,
}: SectionRichTextImageProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for section_rich_text_image (variation:{" "}
      {slice.variation}) Slices
    </section>
  );
};

export default SectionRichTextImage;
