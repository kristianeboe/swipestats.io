import type { FC } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import CTAFooter from "@/components/cta/CTAFooter";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";

/**
 * Props for `CtaFooter`.
 */
export type CtaFooterProps = SliceComponentProps<Content.CtaFooterSlice>;

/**
 * Component for "CtaFooter" Slices.
 */
const CtaFooter: FC<CtaFooterProps> = ({ slice }) => {
  // Extract title from rich text
  const titleText = slice.primary.title?.[0]?.text ?? "Transform Your Dating Profile";
  
  // Extract subtitle from rich text
  const subtitleText = slice.primary.subtitle?.[0]?.text ?? "Our AI turns your ordinary photos into optimal dating profile pictures that get results";
  
  // Extract description from rich text
  const descriptionText = slice.primary.description?.[0]?.text ?? "Upload your photos and get professionally enhanced versions in 48 hours";
  
  // Extract button text from rich text
  const buttonText = slice.primary.buttontext?.[0]?.text ?? "Check It Out";
  
  // Extract button link
  const buttonUrl = getPrismicLinkUrl(slice.primary.buttonlink) ?? "/";

  // Extract before images (if any)
  const beforeImages = slice.primary.beforeimages?.map(item => ({
    field: item.image,
    alt: item.image?.alt ?? "Original casual photo"
  })) ?? [];

  // Extract after images (if any)
  const afterImages = slice.primary.afterimages?.map(item => ({
    field: item.image,
    alt: item.image?.alt ?? "AI Enhanced photo"
  })) ?? [];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <CTAFooter
        title={titleText}
        subtitle={subtitleText}
        description={descriptionText}
        buttonText={buttonText}
        buttonUrl={buttonUrl}
        beforeImages={beforeImages}
        afterImages={afterImages}
        theme="swipestats"
      />
    </section>
  );
};

export default CtaFooter;