import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `CtaSection`.
 */
export type CtaSectionProps = SliceComponentProps<Content.CtaSectionSlice>;

/**
 * Component for "CtaSection" Slices.
 */
const CtaSection = ({ slice }: CtaSectionProps): JSX.Element => {
  if (slice.variation === "simpleCentered") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
      >
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {slice.primary.heading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              {slice.primary.body}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href={getPrismicLinkUrl(slice.primary.cta_href)}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {slice.primary.cta_label}
              </a>
              {slice.primary.secondary_cta_label && (
                <a
                  href={getPrismicLinkUrl(slice.primary.secondary_cta_href)}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {slice.primary.secondary_cta_label}{" "}
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {slice.primary.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            {slice.primary.body}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href={getPrismicLinkUrl(slice.primary.cta_href)}
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {slice.primary.cta_label}
            </a>
            {slice.primary.secondary_cta_label && (
              <a
                href={getPrismicLinkUrl(slice.primary.secondary_cta_href)}
                className="text-sm font-semibold leading-6 text-white"
              >
                {slice.primary.secondary_cta_label}{" "}
                <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
