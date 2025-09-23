"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { PlusCircle, Trash2, ExternalLink } from "lucide-react";
import { DataProvider } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileComparisonsList() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: comparisons, isLoading } =
    api.profileCompare.getComparisons.useQuery();

  const deleteComparisonMutation =
    api.profileCompare.deleteComparison.useMutation({
      onSuccess: () => {
        utils.profileCompare.getComparisons.invalidate();
        setDeletingId(null);
      },
    });

  const utils = api.useUtils();

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteComparisonMutation.mutate({ id });
  };

  const handleCreate = () => {
    router.push("/app/profile-compare/new");
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">Loading your saved comparisons...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Profile Comparisons</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Comparison
        </Button>
      </div>

      {comparisons && comparisons.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((comparison) => (
            <Card key={comparison.id}>
              <CardHeader>
                <CardTitle>
                  {comparison.name || "Untitled Comparison"}
                </CardTitle>
                <CardDescription>
                  Created on{" "}
                  {new Date(comparison.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {comparison.columns.map((column) => (
                    <div
                      key={column.id}
                      className="rounded-full px-3 py-1 text-xs text-white"
                      style={{
                        backgroundColor: getAppColor(column.type),
                      }}
                    >
                      {column.type}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {comparison.columns.reduce(
                    (total, column) => total + column.photos.length,
                    0,
                  )}{" "}
                  photos · {comparison.isPublic ? "Public" : "Private"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(comparison.id)}
                  disabled={
                    deleteComparisonMutation.isPending &&
                    deletingId === comparison.id
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Link href={`/app/profile-compare/${comparison.id}`} passHref>
                  <Button variant="outline" size="sm" asChild>
                    <div>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </div>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">
            You haven't created any comparisons yet.
          </p>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Comparison
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to get app color
function getAppColor(appType: DataProvider): string {
  switch (appType) {
    case DataProvider.TINDER:
      return "#FF6B6B";
    case DataProvider.HINGE:
      return "#FF85A1";
    case DataProvider.BUMBLE:
      return "#FFD166";
    case DataProvider.GRINDER:
      return "#FF9F1C";
    case DataProvider.BADOO:
      return "#9381FF";
    case DataProvider.BOO:
      return "#4EA8DE";
    case DataProvider.OK_CUPID:
      return "#06D6A0";
    case DataProvider.FEELD:
      return "#748CAB";
    default:
      return "#CCCCCC";
  }
}
