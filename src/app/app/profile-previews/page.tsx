"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { ResponsiveDialog } from "@/app/_components/ui/compound/ResponsiveDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Plus, Eye, Share, Edit, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { CreatePreviewForm } from "@/app/app/profile-previews/CreatePreviewForm";
import { toast } from "sonner";

export default function ProfilePreviewsPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch previews data
  const {
    data: previews = [],
    isLoading,
    error,
  } = api.profilePreviews.getAll.useQuery();

  const utils = api.useUtils();

  const deletePreview = api.profilePreviews.delete.useMutation({
    onSuccess: () => {
      toast.success("Preview deleted successfully");
      void utils.profilePreviews.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete preview");
    },
  });

  const handleDeletePreview = (previewId: string, previewName: string) => {
    if (confirm(`Are you sure you want to delete "${previewName}"?`)) {
      deletePreview.mutate({ id: previewId });
    }
  };

  const handleCreateSuccess = (previewId: string) => {
    setIsCreateModalOpen(false);
    void utils.profilePreviews.getAll.invalidate();
    router.push(`/app/profile-previews/${previewId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Profile Previews
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create and compare dating app profile variations
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-muted-foreground">Loading previews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Profile Previews
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create and compare dating app profile variations
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">
              Failed to load previews: {error.message}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Previews
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create and compare dating app profile variations
          </p>
        </div>

        <ResponsiveDialog
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          title="Create New Profile Preview"
          description="Start building a new profile comparison to test different approaches"
          className="max-w-3xl"
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Preview
            </Button>
          }
          scrollable={true}
        >
          <CreatePreviewForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </ResponsiveDialog>
      </div>

      {previews.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-muted-foreground">
            <Eye className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg">No profile previews yet</p>
            <p>
              Create your first preview to start comparing profile variations
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Preview
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previews.map((preview) => (
            <Card
              key={preview.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {preview.name || "Untitled Preview"}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {preview.description || "No description"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {preview.public && (
                      <div className="flex items-center gap-1">
                        <Share className="h-3 w-3" />
                        <span>Public</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {preview.columns.length} variation
                    {preview.columns.length !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {preview.viewCount || 0} view
                    {(preview.viewCount || 0) !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Show column types */}
                {preview.columns.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1">
                    {preview.columns.map((column) => (
                      <span
                        key={column.id}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                      >
                        {column.type}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/app/profile-previews/${preview.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDeletePreview(
                        preview.id,
                        preview.name || "this preview",
                      )
                    }
                    disabled={deletePreview.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
