import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `TldrBox`.
 */
export type TldrBoxProps = SliceComponentProps<Content.TldrBoxSlice>;

/**
 * Component for "TldrBox" Slices.
 */
const TldrBox = ({ slice }: TldrBoxProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for tldr_box (variation: {slice.variation}) Slices
    </section>
  );
};

export default TldrBox;
