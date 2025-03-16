import { Button } from "@/app/_components/ui/button";
import { SLink } from "@/app/_components/ui/SLink";
import { cn } from "@/lib/utils";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";
import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { type JSX } from "react";
/**
 * Props for `HeroSection`.
 */
export type HeroSectionProps = SliceComponentProps<Content.HeroSectionSlice>;

/**
 * Component for "HeroSection" Slices.
 */
const HeroSection = ({ slice }: HeroSectionProps): JSX.Element => {
  if (slice.variation === "simple" || slice.variation === "simpleimageleft") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="relative isolate"
      >
        <div className="mx-auto max-w-7xl">
          <div
            className={cn("grid grid-cols-1 items-center gap-8 lg:grid-cols-2")}
          >
            <div className="relative h-full w-full">
              <img
                src={slice.primary.image1?.url ?? "/default-image.jpg"}
                alt={slice.primary.image1?.alt ?? "Photographer with camera"}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col py-16">
              <h2 className="text-center text-3xl font-bold text-gray-900">
                {slice.primary.title}
              </h2>
              <div className="prose mt-6 text-lg leading-8 sm:max-w-md lg:max-w-none">
                <PrismicRichText field={slice.primary.rich_description} />
              </div>
              {slice.primary.primaryctabuttontext && (
                <div className="flex justify-center">
                  <SLink
                    href={getPrismicLinkUrl(slice.primary.primaryctabuttonhref)}
                    className="mt-6 inline-block rounded bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
                  >
                    {slice.primary.primaryctabuttontext}
                  </SLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (slice.variation === "withAngledImageOnRight") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="relative isolate"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>

            <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                {slice.primary.title_eyebrow && (
                  <div className="hidden sm:mb-10 sm:flex">
                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                      {slice.primary.title_eyebrow}{" "}
                      {slice.primary.title_eyebrow_cta && (
                        <a
                          href={getPrismicLinkUrl(
                            slice.primary.title_eyebrow_cta_link,
                          )}
                          className="whitespace-nowrap font-semibold text-rose-600"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {slice.primary.title_eyebrow_cta}
                          <span aria-hidden="true">&rarr;</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  {slice.primary.title}
                </h1>
                <div className="prose mt-6 text-lg leading-8 sm:max-w-md lg:max-w-none">
                  <PrismicRichText field={slice.primary.rich_description} />
                </div>

                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href={getPrismicLinkUrl(slice.primary.primaryctabuttonhref)}
                    className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    {slice.primary.primaryctabuttontext}
                  </a>
                  <a
                    href={getPrismicLinkUrl(slice.primary.ctalinkHref)}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {slice.primary.ctalinktext ?? "Learn more"}{" "}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            alt={slice.primary.image.alt ?? ""}
            src={
              slice.primary.image.url ??
              "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80"
            }
            className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative isolate"
    >
      <div>
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
        <div
          aria-hidden="true"
          className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
        >
          <div
            style={{
              clipPath:
                "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
            }}
            className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          />
        </div>
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  {slice.primary.title}
                </h1>
                {slice.variation === "withRichText" &&
                slice.primary.rich_description ? (
                  <div className="prose mt-6 text-lg leading-8 sm:max-w-md lg:max-w-none">
                    <PrismicRichText field={slice.primary.rich_description} />
                  </div>
                ) : (
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    {slice.primary.description}
                  </p>
                )}

                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href={getPrismicLinkUrl(slice.primary.primaryctabuttonhref)}
                  >
                    <Button>Book today</Button>
                  </Link>

                  <SLink href="#">
                    {slice.primary.ctalinktext ?? "Learn more"}{" "}
                    <span aria-hidden="true">→</span>
                  </SLink>
                </div>
              </div>
              <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                  <div className="relative">
                    <img
                      alt={slice.primary.image1.alt ?? ""}
                      src={slice.primary.image1.url!}
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                  <div className="relative">
                    <img
                      alt={slice.primary.image2.alt ?? ""}
                      src={slice.primary.image2.url!}
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                    <img
                      alt={slice.primary.image3.alt ?? ""}
                      src={slice.primary.image3.url!}
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                  <div className="relative">
                    <img
                      alt={slice.primary.image4.alt ?? ""}
                      src={slice.primary.image4.url!}
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                    <img
                      alt={slice.primary.image5.alt ?? ""}
                      src={slice.primary.image5.url!}
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
