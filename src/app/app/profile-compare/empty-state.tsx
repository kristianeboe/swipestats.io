"use client";

import { PlusCircle, ImageIcon } from "lucide-react";
import { DataProvider } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";

type EmptyStateProps = {
  onAddColumn: (type: DataProvider) => void;
};

export function EmptyState({ onAddColumn }: EmptyStateProps) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="bg-primary/10 mb-4 rounded-full p-4">
          <ImageIcon className="text-primary h-10 w-10" />
        </div>
        <h3 className="mb-2 text-2xl font-bold">
          Compare Your Dating App Photos
        </h3>
        <p className="text-muted-foreground mb-6">
          Create side-by-side comparisons of different photo combinations to see
          which performs best across dating apps.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="default"
            onClick={() => onAddColumn(DataProvider.TINDER)}
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tinder Column
          </Button>
          <Button
            variant="default"
            onClick={() => onAddColumn(DataProvider.HINGE)}
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Hinge Column
          </Button>
          <Button
            variant="default"
            onClick={() => onAddColumn(DataProvider.BUMBLE)}
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Bumble Column
          </Button>
        </div>
      </div>
    </div>
  );
}
