/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { type ReactNode } from "react";

import { SliceZone, type SliceZoneLike } from "@prismicio/react";
import {
  type ApiDocument,
  Extensions,
  type LinkResolver,
  type RenderContext,
} from "@prismicio/api-renderer/lib/models";
import { SharedSliceRenderer } from "@prismicio/api-renderer";

// If needed, Add components from all your slice libraries if you have multiple:
// import { components as ecommerceComponents } from '@/slices/blog/index'
// import { components as marketingComponents } from '@/slices/marketing/index'
// const __allComponents = { ...ecommerceComponents, ...marketingComponents }

import { components as __allComponents } from "@/slices/index";

// import Nav which is a client component using @headlessui/react
import SliceLibraryNav from "./SliceLibraryNav";

import { type SliceLibrary } from "./page";

export function SliceLibrary({ libraries }: { libraries: SliceLibrary[] }) {
  return (
    <div className="">
      {/* Static sidebar for desktop */}
      <SliceLibraryNav libraries={libraries} />
      <div className="flex flex-1 flex-col bg-gray-50 md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <div className="m-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Explore your Slice Libraries
            </h1>
          </div>
        </div>
        <main>
          <div className="mx-auto max-w-7xl px-4">
            <SliceList libraries={libraries} />
          </div>
        </main>
      </div>
    </div>
  );
}

function SliceList({ libraries }: { libraries: SliceLibrary[] }) {
  const renderer = SharedSliceRenderer(renderContext);

  return libraries.map((library) =>
    library.slices.map(({ model, mocks }) =>
      model.variations.map((variation) => {
        const id = model.id;
        const key = `${library.name}-${id}-${variation.id}`;

        let variationFragment: ReactNode = (
          <div className="bold flex h-64 flex-wrap content-center justify-center rounded-md border border-gray-200 bg-gray-100 p-1.5 text-xl uppercase text-gray-500">
            Mock missing for this variation
          </div>
        );

        const mock = mocks[variation.id];

        if (mock !== undefined) {
          const renderedMock = renderer.renderV2(model, mock) as object;
          const mockApi = [
            {
              id,
              slice_type: id,
              ...renderedMock,
            },
          ] as SliceZoneLike;

          variationFragment = (
            <div className="isolate rounded-md border border-gray-200 bg-white p-1.5">
              <SliceZone slices={mockApi} components={__allComponents} />
            </div>
          );
        }

        return (
          <div className="py-20" id={key} key={key}>
            <div className="mb-5 border-b border-gray-200 pb-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {model.name}
              </h3>
              <p className="mt-2 max-w-4xl text-sm text-gray-500">
                {variation.name}
              </p>
            </div>
            {variationFragment}
          </div>
        );
      }),
    ),
  );
}

// An empty context that `SharedSliceRenderer` needs to work it's magic
const renderContext: RenderContext = {
  urlRewriter: {
    optimizeImageUrl(originUrl: string) {
      return originUrl;
    },
    rewriteImageUrl(view) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return view.url || "/viewUrlMissing";
    },
    rewriteFileUrl(originUrl: string) {
      return originUrl;
    },
    rewriteS3Bucket(url: string) {
      return url;
    },
    enforceCDN(url: string) {
      return url;
    },
  },
  emptyStringInsteadOfNull: false,
  Extension: {
    DocEncoder: {
      encodeDocId: Extensions.encodeDocId,
    },
    encoders: Extensions.IDEncoders,
  },
  LinkResolver: {
    buildUrl(_params: {
      linkResolver: LinkResolver | undefined;
      pageType: string;
      doc?: ApiDocument;
    }): string | undefined | null {
      return "/";
    },
  },
};
