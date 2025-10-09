"use client";

import * as runtime from "react/jsx-runtime";

/**
 * MDX Content Components
 *
 * Available components for use in blog posts:
 *
 * CONTENT COMPONENTS:
 * - <TLDR /> - Article summary with pros/cons
 * - <CalloutBox /> - Highlighted information boxes
 * - <Quote /> - Styled quote blocks
 * - <Stats /> - Display statistics
 * - <FeatureGrid /> - Grid of features
 * - <MdxImage /> - Enhanced image component
 *
 * CTA COMPONENTS:
 * - <CtaNewsletter /> - Newsletter signup (mid-article)
 * - <CtaCarousel /> - Product promotion with carousel
 * - <CtaShowcase /> - Large footer CTA with before/after
 * - CtaCard /> - "Visualize Your Tinder Data" card CTA
 * - <CTA /> - General purpose CTA
 * - <ExitPopup /> - Exit intent popup (auto-triggers)
 */

// Import all the custom components that might be used in MDX
import { CalloutBox } from "./CalloutBox";
import { CTA } from "./CTA";
import { CtaCard } from "./CtaCard";
import { CtaCarousel } from "./CtaCarousel";
import { CtaNewsletter } from "./CtaNewsletter";
import { CtaShowcase } from "./CtaShowcase";
import { ExitPopup } from "./ExitPopup";
import { FeatureGrid } from "./FeatureGrid";
import { MdxImage } from "./MdxImage";
import { Quote } from "./Quote";
import { Stats } from "./Stats";
import { TLDR } from "./TLDR";

// Global components available to all MDX content
const sharedComponents = {
  CalloutBox,
  CTA,
  CtaShowcase,
  CtaNewsletter,
  CtaCarousel,
  CtaCard,
  ExitPopup,
  FeatureGrid,
  MdxImage,
  Quote,
  Stats,
  TLDR,
};

// Parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string) => {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(code);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return fn({ ...runtime }).default;
};

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

// MDXContent component
export function MDXContent({ code, components }: MDXProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
