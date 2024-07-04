import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Callout`.
 */
export type CalloutProps = SliceComponentProps<Content.CalloutSlice>;

/**
 * Component for "Callout" Slices.
 */
const Callout = ({ slice }: CalloutProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex rounded-md border border-gray-200 bg-gray-50 p-4"
    >
      <div className="mr-4">{slice.primary.emoji}</div>
      <PrismicRichText field={slice.primary.richtest} />
    </section>
  );
};

export default Callout;
