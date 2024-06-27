// src/slices/Text/index.tsx

import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Text`.
 */
export type TextProps = SliceComponentProps<Content.TextSlice>;

/**
 * Component for "Text" Slices.
 */
export default function Text({ slice }: TextProps): JSX.Element {
  return (
    <section className="bg-white px-6 py-28 text-slate-500 md:px-10">
      <div className="mx-auto grid w-full max-w-prose gap-6">
        <PrismicRichText
          field={slice.primary.text}
          components={{
            heading3: ({ children }) => (
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                {children}
              </p>
            ),
            heading1: ({ children }) => (
              <h2 className="text-4xl font-semibold text-slate-800">
                {children}
              </h2>
            ),
          }}
        />
      </div>
    </section>
  );
}
