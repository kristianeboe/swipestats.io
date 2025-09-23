import type { FC } from "react";
import type { Content } from "@prismicio/client";
import { asText } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import CTAProductLinks from "@/components/cta/CTAProductLinks";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";

/**
 * Props for `GetDatesProductLinks`.
 */
export type GetDatesProductLinksProps =
  SliceComponentProps<Content.GetDatesProductLinksSlice>;

/**
 * Component for "GetDatesProductLinks" Slices.
 */
const GetDatesProductLinks: FC<GetDatesProductLinksProps> = ({ slice }) => {
  // Extract title from rich text
  const titleText = slice.primary.title
    ? asText(slice.primary.title)
    : "📸 Got Boring Photos?";

  // Extract description from rich text
  const descriptionText = slice.primary.description
    ? asText(slice.primary.description)
    : "Swipestats analysis reveals that profile photos are the driving factor in getting you likes and matches. Get eye-catching photos that make you stand out from the crowd and actually get dates.";

  // Extract button text and URL
  const buttonText = slice.primary.button_text ?? "Check It Out";
  const buttonUrl = getPrismicLinkUrl(slice.primary.cta_link) ?? "/";

  // Map product images from Prismic to component format - only include images that actually exist
  const productImages = slice.primary.product_images
    .filter((item) => item.image?.url) // Only include items with actual images
    .map((item, index) => ({
      field: item.image, // Pass the entire Prismic image field
      alt: item.image.alt ?? `AI Enhanced Dating Photo ${index + 1}`,
    }));

  // Extract features from rich text - convert to simple strings
  const featuresList = slice.primary.features_list
    ?.map((item) => asText([item]))
    .filter(Boolean) ?? [
    "More matches or your money back",
    "AI-generated photos",
    "48-hour turnaround",
  ];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <CTAProductLinks
        title={titleText}
        description={descriptionText}
        buttonText={buttonText}
        buttonUrl={buttonUrl}
        productImages={productImages}
        featuresList={featuresList}
        theme="swipestats"
      />
    </section>
  );
};

export default GetDatesProductLinks;
