import { StarIcon } from "@heroicons/react/20/solid";
import { track } from "@vercel/analytics";
import React from "react";
import { Button } from "./ui/button";

export default function RoastBanner() {
  return (
    <div className="relative overflow-hidden sm:py-16">
      <div className="mx-auto overflow-hidden">
        <div className="relative overflow-hidden rounded-2xl bg-rose-600 px-6 py-10 shadow-xl sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -mt-72 flex sm:-mt-32 md:mt-0"
          >
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 1463 360"
            >
              <path
                className="text-rose-500 text-opacity-40"
                fill="currentColor"
                d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
              />
              <path
                className="text-rose-700 text-opacity-40"
                fill="currentColor"
                d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
              />
            </svg>
          </div>
          <div className="relative">
            <div className="">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl lg:max-w-xl">
                Your photos are the #1 deciding factor on dating apps
              </h2>
              <p className=" mt-6 max-w-xl text-lg text-white">
                Get premium AI dating photos that actually get you out on real life dates.
              </p>
            </div>

            <div className="mt-12 sm:flex sm:max-w-lg">
              <a
                href="https://www.getdates.ai"
                target={"_blank"}
                rel="noreferrer"
              >
                <div className="mt-4 sm:mt-0">
                  <button
                    // onClick={() => track("Try Roast CTA", {})}
                    type="submit"
                    className="block w-full rounded-md border border-transparent bg-black  px-5 py-3 text-base font-medium text-white shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-600 sm:px-10"
                  >
                    Try now
                  </button>
                </div>
              </a>
            </div>
            <div className="mt-5 text-white sm:flex sm:space-x-4">
              <div className="flex flex-shrink-0 pr-5">
                <StarIcon className="h-5 w-5" aria-hidden="true" />
                <StarIcon className="h-5 w-5" aria-hidden="true" />
                <StarIcon className="h-5 w-5" aria-hidden="true" />
                <StarIcon className="h-5 w-5" aria-hidden="true" />
                <StarIcon className="h-5 w-5 " aria-hidden="true" />
              </div>
              <span>More matches guaranteed</span>
            </div>
          </div>
          <div className="absolute -right-96 -top-16 hidden w-3/4 items-center overflow-hidden lg:flex ">
            <img
              src="/images/roastPeople.png"
              className="overflow-hidden"
              alt="roast dating cta image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
