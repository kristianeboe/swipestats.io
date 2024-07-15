import { cn } from "@/lib/utils";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `LogoCloud`.
 */
export type LogoCloudProps = SliceComponentProps<Content.LogoCloudSlice>;

/**
 * Component for "LogoCloud" Slices.
 */
const LogoCloud = ({ slice }: LogoCloudProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn(
        "bg-white py-24 sm:py-32",
        slice.primary.dark_background && "bg-slate-900",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            alt="Elite Daily"
            src="https://images.prismic.io/swipestats/ZpTLix5LeNNTxJYN_elite-daily-logo.png?auto=format,compress"
            width={158}
            height={48}
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />

          <img
            alt="Yahoo"
            src="https://images.prismic.io/swipestats/ZpTLHh5LeNNTxJYJ_yahoo-logo.png?auto=format,compress"
            width={158}
            height={48}
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />

          <img
            alt="New York Post"
            src="https://images.prismic.io/swipestats/ZpTLHR5LeNNTxJYI_new-york-post-logo.png?auto=format,compress"
            width={158}
            height={48}
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
          <img
            alt="Ask Men"
            src="https://images.prismic.io/swipestats/ZpTLHB5LeNNTxJYH_ask-men-logo.png?auto=format,compress"
            width={158}
            height={48}
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
          />
          <img
            alt="The Match Artist"
            src="https://images.prismic.io/swipestats/ZpTLDh5LeNNTxJYG_the-match-artist-logo.png?auto=format,compress"
            width={158}
            height={48}
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
          />
        </div>
      </div>

      {/* <div className="mt-16 flex justify-center">
        <p className="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/5">
          <span className="hidden md:inline">
            Over 2500 companies use our tools to better their business.
          </span>
          <a href="#" className="font-semibold text-indigo-600">
            <span aria-hidden="true" className="absolute inset-0" /> Read our
            customer stories <span aria-hidden="true">&rarr;</span>
          </a>
        </p>
      </div> */}
    </section>
  );
};

export default LogoCloud;
