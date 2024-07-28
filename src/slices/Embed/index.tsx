import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Embed`.
 */
export type EmbedProps = SliceComponentProps<Content.EmbedSlice>;

/**
 * Component for "Embed" Slices.
 */
const Embed = ({ slice }: EmbedProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div dangerouslySetInnerHTML={{ __html: slice.primary.embed }} />
    </section>
  );
};

export default Embed;
