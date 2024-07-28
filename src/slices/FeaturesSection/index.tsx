import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import {
  SparklesIcon,
  SquaresPlusIcon,
  ClockIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

import {
  ArrowUpTrayIcon,
  AdjustmentsHorizontalIcon,
  BellAlertIcon,
} from "@heroicons/react/20/solid";

/**
 * Props for `FeaturesSection`.
 */
export type FeaturesSectionProps =
  SliceComponentProps<Content.FeaturesSectionSlice>;

/**
 * Component for "FeaturesSection" Slices.
 */
const FeaturesSection = ({ slice }: FeaturesSectionProps): JSX.Element => {
  const featureIcons = {
    squaresPlus: SquaresPlusIcon,
    lookGood: SparklesIcon,
    clock: ClockIcon,
    link: LinkIcon,

    bellAlertSolid: BellAlertIcon,
    uploadSolid: ArrowUpTrayIcon,
    settingsSolid: AdjustmentsHorizontalIcon,
  } as const;

  if (slice.variation === "containedInPanel")
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="py-24"
      >
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-20 sm:rounded-3xl sm:px-10 sm:py-24 lg:py-24 xl:px-24">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
              <div className="lg:row-start-2 lg:max-w-md">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {slice.primary.heading}
                </h2>
                {slice.primary.description && (
                  <p className="mt-6 text-lg leading-8 text-gray-300">
                    {slice.primary.description}
                  </p>
                )}
              </div>
              <img
                alt="Product screenshot"
                src="/ss2.png"
                width={2432}
                height={1442}
                className="relative -z-20 min-w-full max-w-xl rounded-xl shadow-xl ring-1 ring-white/10 lg:row-span-4 lg:w-[64rem] lg:max-w-none"
              />
              <div className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10">
                <dl className="max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                  {slice.primary.features.map((feature) => {
                    const IconComponent = featureIcons[feature.icon];
                    return (
                      <div key={feature.name} className="relative">
                        <dt className="ml-9 inline-block font-semibold text-white">
                          <IconComponent
                            aria-hidden="true"
                            className="absolute left-1 top-1 h-5 w-5 text-rose-500"
                          />
                          {feature.name}
                        </dt>{" "}
                        <dd className="inline">{feature.description}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-12 top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-3xl lg:bottom-[-12rem] lg:top-auto lg:translate-y-0 lg:transform-gpu"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-25"
              />
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-rose-600">
            {slice.primary.eyebrow}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {slice.primary.heading}
          </p>
          {slice.primary.description && (
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {slice.primary.description}
            </p>
          )}
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {slice.primary.features.map((feature) => {
              const IconComponent = featureIcons[feature.icon];
              return (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-600">
                      {/* <icon aria-hidden="true" className="h-6 w-6 text-white" /> */}
                      {/*   <feature.icon aria-hidden="true" className="h-6 w-6 text-white" /> */}
                      <IconComponent
                        aria-hidden="true"
                        className="h-6 w-6 text-white"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
