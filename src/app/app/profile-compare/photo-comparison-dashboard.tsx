"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "./empty-state";
import { ComparisonColumn } from "./comparison-column";
import { DataProvider } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PhotoComparisonDashboardProps = {
  userId: string;
};

export default function PhotoComparisonDashboard({
  userId,
}: PhotoComparisonDashboardProps) {
  const [columns, setColumns] = useState<
    Array<{ id: string; type: DataProvider; photos: string[] }>
  >([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const createComparisonMutation =
    api.profileCompare.createComparison.useMutation({
      onSuccess: (data) => {
        toast.success("Comparison saved successfully!");
        router.push(`/app/profile-compare/${data.id}`);
        setSaving(false);
      },
      onError: (error) => {
        toast.error("Failed to save comparison: " + error.message);
        setSaving(false);
      },
    });

  const addColumn = (type: DataProvider) => {
    setColumns([...columns, { id: crypto.randomUUID(), type, photos: [] }]);
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter((column) => column.id !== id));
  };

  const updateColumnPhotos = (columnId: string, photos: string[]) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId ? { ...column, photos } : column,
      ),
    );
  };

  const saveComparison = async () => {
    if (columns.length === 0) {
      toast.error("Please add at least one column");
      return;
    }

    setSaving(true);
    createComparisonMutation.mutate({
      columns: columns.map((column) => ({
        type: column.type,
        photos: column.photos,
      })),
    });
  };

  return (
    <div className="space-y-6">
      {columns.length === 0 ? (
        <EmptyState onAddColumn={addColumn} />
      ) : (
        <>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <ComparisonColumn
                key={column.id}
                id={column.id}
                type={column.type}
                userId={userId}
                onRemove={() => removeColumn(column.id)}
                onUpdatePhotos={(photos) =>
                  updateColumnPhotos(column.id, photos)
                }
                photos={column.photos}
              />
            ))}
            <div className="flex h-[600px] w-72 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex flex-col items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => addColumn(DataProvider.TINDER)}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Tinder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addColumn(DataProvider.HINGE)}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Hinge
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addColumn(DataProvider.BUMBLE)}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Bumble
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={saveComparison}
              disabled={saving || createComparisonMutation.isPending}
            >
              {saving || createComparisonMutation.isPending
                ? "Saving..."
                : "Save Comparison"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
