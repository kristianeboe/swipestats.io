import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `YouMayAlsoLike`.
 */
export type YouMayAlsoLikeProps =
  SliceComponentProps<Content.YouMayAlsoLikeSlice>;

/**
 * Component for "YouMayAlsoLike" Slices.
 */
const YouMayAlsoLike = ({ slice }: YouMayAlsoLikeProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for you_may_also_like (variation: {slice.variation})
      Slices
    </section>
  );
};

export default YouMayAlsoLike;
