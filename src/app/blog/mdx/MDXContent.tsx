"use client";

import * as runtime from "react/jsx-runtime";

// Import all the custom components that might be used in MDX
import { AuthorCard } from "./AuthorCard";
import { CalloutBox } from "./CalloutBox";
import { CTA } from "./CTA";
import { FeatureGrid } from "./FeatureGrid";
import { MdxImage } from "./MdxImage";
import { Quote } from "./Quote";
import { Stats } from "./Stats";

// Global components available to all MDX content
const sharedComponents = {
  AuthorCard,
  CalloutBox,
  CTA,
  FeatureGrid,
  MdxImage,
  Quote,
  Stats,
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
