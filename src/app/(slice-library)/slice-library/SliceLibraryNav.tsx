/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React from "react";
import { Disclosure } from "@headlessui/react";
import { type SharedSlice } from "@prismicio/types";
import Image from "next/image";
import { imgixLoader } from "@prismicio/next";

import { type SliceLibrary } from "./page";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SliceLibraryNav({
  libraries,
}: {
  libraries: SliceLibrary[];
}) {
  return (
    <div>
      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pb-4 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Image
              className="h-8 w-auto"
              src="https://images.prismic.io/prismicio/9430ed67-a303-4fb6-85a9-bad872f3eb2a_Prismic-logo.png?auto=compress,format"
              alt="Prismic"
              width={64}
              height={64}
              loader={imgixLoader}
            />
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav
              className="flex-1 space-y-1 bg-white px-2"
              aria-label="Sidebar"
            >
              {libraries.map((library) => (
                <NavElementLibrary key={library.name} library={library} />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavElementLibrary({ library }: { library: SliceLibrary }) {
  return (
    <Disclosure as="div" className="space-y-1">
      {({ open }) => (
        <>
          <Disclosure.Button className="group flex w-full items-center rounded-md bg-white py-2 pr-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <svg
              className={classNames(
                open ? "rotate-90 text-gray-400" : "text-gray-300",
                "mr-2 h-6 w-6 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400",
              )}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
            </svg>
            {library.name}
          </Disclosure.Button>
          <Disclosure.Panel className="space-y-1">
            {library.slices.map(({ model }) => (
              <NavElementSlice
                key={model.name}
                libraryName={library.name}
                slice={model}
              />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function NavElementSlice({
  libraryName,
  slice,
}: {
  libraryName: string;
  slice: SharedSlice;
}) {
  return (
    <Disclosure as="div" className="space-y-1">
      {({ open }) => (
        <>
          <Disclosure.Button className="group flex w-full items-center rounded-md bg-white py-2 pl-[2rem] pr-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <svg
              className={classNames(
                open ? "rotate-90 text-gray-400" : "text-gray-300",
                "mr-2 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400",
              )}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
            </svg>
            {/* @ts-expect-error it works */}
            {slice.name}
          </Disclosure.Button>
          <Disclosure.Panel className="space-y-1">
            {/* @ts-expect-error it works */}
            {slice.variations.map((variation: any) => (
              <a
                key={variation.id}
                href={`#${libraryName}-${slice.id}-${variation.id}`}
                className="group flex w-full items-center rounded-md py-2 pl-20 pr-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                {variation.name}
              </a>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
