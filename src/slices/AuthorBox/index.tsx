import { AuthorCard } from "@/app/blog/[uid]/AuthorCard";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

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
      className="mt-20"
    >
      <AuthorCard
        author={{
          name: slice.primary.author_name!,
          role: slice.primary.author_role!,
          profile_image: slice.primary.author_image,
          description: slice.primary.author_description!,
          instagramurl: getPrismicLinkUrl(slice.primary.author_instagram),
        }}
      />
    </section>
  );
};

export default AuthorBox;
