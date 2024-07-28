/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { type Metadata } from "next";
import { type SharedSlice } from "@prismicio/types";

import { SliceLibrary } from "./SliceLibrary";

export interface SliceLibrary {
  name: string;
  slices: SliceWithMocks[];
}

type SharedSliceContent = SharedSlice["variations"][number]["content"];

interface SliceWithMocks {
  model: SharedSlice;
  mocks: Partial<Record<string, SharedSliceContent>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Slice Library",
    description: "Slice Library",
  };
}

export const dynamic = "force-static";

export default async function SliceLibraryPage() {
  const libraries = await loadSliceLibraries();

  return <SliceLibrary libraries={libraries} />;
}

// Load all the slice libraries defined for this Prismic project
async function loadSliceLibraries(): Promise<SliceLibrary[]> {
  try {
    const file = await fs.readFile(
      process.cwd() + "/slicemachine.config.json",
      "utf8",
    );
    const config = JSON.parse(file);

    const libraries = await Promise.all(
      (config.libraries || []).map(loadSliceLibrary),
    );

    return libraries;
  } catch {
    throw new Error(
      "Issue when reading local slice libraries listed in slicemachine.config.json",
    );
  }
}

// Load all slices and their associated mocks for the given slice library
async function loadSliceLibrary(library: string): Promise<SliceLibrary> {
  const libraryPath = path.join(process.cwd(), library);
  const entries = await fs.readdir(libraryPath, {
    recursive: true,
    withFileTypes: true,
  });

  const slices: SliceWithMocks[] = [];

  // Order slices alphabetically in each library
  entries.sort((a, b) => (a.path > b.path ? 1 : -1));

  for (const entry of entries) {
    if (entry.name !== "model.json" || entry.isDirectory()) {
      continue;
    }

    const modelPath = path.join(entry.path, entry.name);
    const mocksPath = path.join(entry.path, "mocks.json");

    const modelContents = await fs.readFile(modelPath, "utf8");
    const model = JSON.parse(modelContents) as SharedSlice;
    const mocks: SliceWithMocks["mocks"] = {};

    // Read mocks for the given slice – if mocks are not present, ignore that;
    // the Slice Library components will display an empty placeholder in that case
    try {
      const mocksContents = await fs.readFile(mocksPath, "utf-8");
      const mocksJson = JSON.parse(mocksContents) as SharedSliceContent[];

      // Create a map from variation name to it's mocks for easy access in components
      for (const { id } of model.variations) {
        const mock = mocksJson.find(({ variation }) => variation === id);

        mocks[id] = mock;
      }
    } catch (e) {}

    slices.push({ model, mocks });
  }

  return {
    name: library,
    slices,
  };
}
