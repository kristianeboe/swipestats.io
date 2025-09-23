import type { FC } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import ExitPopup from "@/components/cta/ExitPopup";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";

/**
 * Props for `ExitPopup`.
 */
export type ExitPopupSliceProps = SliceComponentProps<Content.ExitPopupSlice>;

// Icon mapping for the component
const getIconSvg = (iconType: string, className: string) => {
  const icons = {
    star: (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    clock: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    lock: (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    ),
    check: (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    shield: (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  };
  return icons[iconType as keyof typeof icons] || icons.star;
};

/**
 * Component for "ExitPopup" Slices.
 */
const ExitPopupSlice: FC<ExitPopupSliceProps> = ({ slice }) => {
  // Extract basic fields
  const titleText = slice.primary.title?.[0]?.text ?? "Wait! Don't Leave Yet...";
  const subtitleText = slice.primary.subtitle?.[0]?.text ?? "You're just one step away from getting game-changing photos";
  const descriptionText = slice.primary.offertext?.[0]?.text ?? "Most people struggle with dating apps because their photos don't showcase their best self. Our AI creates professional-quality photos of you that actually get results.";
  const buttonText = slice.primary.buttontext?.[0]?.text ?? "Yes, Get My AI Photos";
  const buttonUrl = getPrismicLinkUrl(slice.primary.buttonlink) ?? "/";
  const closeButtonText = slice.primary.closebuttontext?.[0]?.text ?? "No thanks, I don't want more matches";

  // Extract repeatable items and build arrays
  const socialProofStats = slice.items.map(item => ({
    text: item.stat_text ?? "",
    iconType: item.stat_icon ?? "star"
  })).filter(stat => stat.text); // Only include items with text

  const trustIndicators = slice.items.map(item => ({
    fullText: item.trust_text ?? "",
    shortText: item.trust_text_mobile ?? "",
    iconType: item.trust_icon ?? "lock"
  })).filter(indicator => indicator.fullText); // Only include items with text

  return (
    <ExitPopup
      title={titleText}
      subtitle={subtitleText}
      description={descriptionText}
      primaryButtonText={buttonText}
      primaryButtonUrl={buttonUrl}
      secondaryButtonText={closeButtonText}
      theme="swipestats"
      socialProofStats={socialProofStats}
      trustIndicators={trustIndicators}
    />
  );
};

export default ExitPopupSlice;
