import type { FC } from "react";
import type { Content } from "@prismicio/client";
import { asText } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import CTASidebar from "@/components/cta/CTASidebar";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";

/**
 * Props for `SidebarCta`.
 */
export type SidebarCtaProps = SliceComponentProps<Content.SidebarCtaSlice>;

/**
 * Component for "SidebarCta" Slices.
 */
const SidebarCta: FC<SidebarCtaProps> = ({ slice }) => {
  // Extract title from rich text
  const titleText = slice.primary.title
    ? asText(slice.primary.title)
    : "Stop Wasting Money on Dating Apps";

  // Extract description from rich text
  const descriptionText = slice.primary.description
    ? asText(slice.primary.description)
    : "Swipestats data reveals the real issue. Bad photos kill your dating prospects before you even get a chance. Get photos that actually attract matches or subscribe for expert advice and exclusive offers.";

  // Extract stats from rich text
  const statsText = slice.primary.stats_text
    ? asText(slice.primary.stats_text)
    : "";

  // Extract button text from rich text
  const buttonText = slice.primary.primarybutton
    ? asText(slice.primary.primarybutton)
    : "Learn More";

  // Extract button link
  const buttonUrl = getPrismicLinkUrl(slice.primary.primarybuttonlink) ?? "/";

  // Extract secondary button fields
  const secondaryButtonText = slice.primary.secondarybuttontext
    ? asText(slice.primary.secondarybuttontext)
    : "";
  const secondaryButtonLink =
    getPrismicLinkUrl(slice.primary.secondarybuttonlink) ?? "";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <CTASidebar
        title={titleText}
        description={descriptionText}
        stats={statsText}
        primaryButtonText={buttonText}
        primaryButtonLink={buttonUrl}
        secondaryButtonText={secondaryButtonText}
        secondaryButtonLink={secondaryButtonLink}
        variant="swipestats"
        theme="swipestats"
      />
    </section>
  );
};

export default SidebarCta;
