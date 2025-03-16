import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import { type JSX } from "react";
/**
 * Props for `ValuesSection`.
 */
export type ValuesSectionProps =
  SliceComponentProps<Content.ValuesSectionSlice>;

/**
 * Component for "ValuesSection" Slices.
 */
const ValuesSection = ({ slice }: ValuesSectionProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8"
    >
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {slice.primary.heading}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {slice.primary.description}
        </p>
      </div>
      <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {slice.primary.values.map((value) => (
          <div key={value.name}>
            <dt className="font-semibold text-gray-900">{value.name}</dt>
            <dd className="mt-1 text-gray-600">{value.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ValuesSection;
