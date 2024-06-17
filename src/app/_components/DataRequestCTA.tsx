import Image from "next/image";
import Link from "next/link";

import { track } from "@vercel/analytics";

export default function DataRequestCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto py-16 ">
        <div className="overflow-hidden rounded-lg bg-rose-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pb-12 pt-10 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:px-20 xl:py-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">
                  Looking to create your own article or paper?
                </span>
                {/* <span className="block">article or paper?</span> */}
              </h2>
              <p className="mt-4 text-lg leading-6 text-rose-200">
                Get your own dataset with a Swipestats Data Request and receive
                access to 1000 anonymized profiles
              </p>
              <Link
                href="/#pricing"
                // onClick={() => track("Get Dataset CTA", {})}
                className="mt-8 inline-flex items-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-rose-600 shadow hover:bg-rose-50"
              >
                Get your dataset today
              </Link>
            </div>
          </div>
          <div className="aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 -mt-6">
            <Image
              className="translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
              src="/images/SwipestatsArticle.png"
              alt="Swipestats medium article screenshot"
              width={500}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
