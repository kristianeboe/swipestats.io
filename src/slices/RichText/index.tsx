import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `RichText`.
 */
export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

/**
 * Component for "RichText" Slices.
 */
const RichText = ({ slice }: RichTextProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="prose lg:prose-xl"
    >
      <PrismicRichText field={slice.primary.rich_text_block} />
    </section>
  );
};

export default RichText;
