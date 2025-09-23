import type { FC } from "react";
import type { Content } from "@prismicio/client";
import { asText } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import CTANewsletterCompact from "@/components/cta/CTANewsletterCompact";

/**
 * Props for `NewsletterCta`.
 */
export type NewsletterCtaProps =
  SliceComponentProps<Content.NewsletterCtaSlice>;

/**
 * Component for "NewsletterCta" Slices.
 */
const NewsletterCta: FC<NewsletterCtaProps> = ({ slice }) => {
  // Extract title from rich text
  const titleText = slice.primary.title
    ? asText(slice.primary.title)
    : "💡 Expert Dating Insights";

  // Extract description from rich text
  const descriptionText = slice.primary.description
    ? asText(slice.primary.description)
    : "Join thousands getting insider data and optimization tips from our SwipeStats dating experts.";

  // Extract button text
  const buttonText = slice.primary.buttontext ?? "Join SwipeStats Community";

  // Extract placeholder from rich text
  const placeholderText = slice.primary.placeholdertext
    ? asText(slice.primary.placeholdertext)
    : "your@email.com";

  // Extract privacy text from rich text
  const privacyText = slice.primary.privacytext
    ? asText(slice.primary.privacytext)
    : "No spam. Unsubscribe anytime.";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <CTANewsletterCompact
        title={titleText}
        description={descriptionText}
        buttonText={buttonText}
        placeholder={placeholderText}
        privacyText={privacyText}
        theme="swipestats"
      />
    </section>
  );
};

export default NewsletterCta;
