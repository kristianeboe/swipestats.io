import { Alert } from "@/app/_components/tw/Alert";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `CtaInfo`.
 */
export type CtaInfoProps = SliceComponentProps<Content.CtaInfoSlice>;

/**
 * Component for "CtaInfo" Slices.
 */
const CtaInfo = ({ slice }: CtaInfoProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mt-10"
    >
      <div className="max-w-xl rounded-xl border-l-8 border-rose-300 bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
        <h2 className="text-xl font-bold text-rose-300">
          {slice.primary.emoji} {slice.primary.heading}
        </h2>
        <p className="text-sm leading-6 text-gray-900">
          {slice.primary.body}
          {/* This website uses cookies to supplement a balanced diet and provide a
          much deserved reward to the senses after consuming bland but
          nutritious meals. Accepting our cookies is optional but recommended,
          as they are delicious. See our{" "}
          <a href="#" className="font-semibold text-indigo-600">
            cookie policy
          </a> .*/}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <button
            type="button"
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Accept all
          </button>
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Reject all
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaInfo;
