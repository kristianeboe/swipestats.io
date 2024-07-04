import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `AuthorBox`.
 */
export type AuthorBoxProps = SliceComponentProps<Content.AuthorBoxSlice>;

/**
 * Component for "AuthorBox" Slices.
 */
const AuthorBox = ({ slice }: AuthorBoxProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for author_box (variation: {slice.variation}) Slices
    </section>
  );
};

export default AuthorBox;
