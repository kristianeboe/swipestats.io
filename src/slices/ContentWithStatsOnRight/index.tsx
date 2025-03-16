import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import { type JSX } from "react";
/**
 * Props for `ContentWithStatsOnRight`.
 */
export type ContentWithStatsOnRightProps =
  SliceComponentProps<Content.ContentWithStatsOnRightSlice>;

/**
 * Component for "ContentWithStatsOnRight" Slices.
 */
const ContentWithStatsOnRight = ({
  slice,
}: ContentWithStatsOnRightProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8"
    >
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {slice.primary.heading}
        </h2>
        <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
          <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
            <p className="text-xl leading-8 text-gray-600">
              {slice.primary.description}
            </p>
            <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
              <p>{slice.primary.paragraph1}</p>
              <p className="mt-10">{slice.primary.paragraph2}</p>
            </div>
          </div>
          <div className="lg:flex lg:flex-auto lg:justify-center">
            <dl className="w-64 space-y-8 xl:w-80">
              {slice.primary.stats.map((stat) => (
                <div
                  key={stat.stat_text}
                  className="flex flex-col-reverse gap-y-4"
                >
                  <dt className="text-base leading-7 text-gray-600">
                    {stat.stat_description}
                  </dt>
                  <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                    {stat.stat_text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentWithStatsOnRight;
