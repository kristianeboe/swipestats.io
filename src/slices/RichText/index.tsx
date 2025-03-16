import { cn } from "@/lib/utils";
import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { type JSX } from "react";
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
      className={cn(
        "prose mt-10 lg:prose-xl",
        slice.primary.centered && "mx-auto",
      )}
      id={slice.primary.section_id ?? undefined}
    >
      <PrismicRichText field={slice.primary.rich_text_block} />
    </section>
  );
};

export default RichText;
