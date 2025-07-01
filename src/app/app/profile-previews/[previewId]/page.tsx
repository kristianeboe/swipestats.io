"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { ResponsiveDialog } from "@/app/_components/ui/compound/ResponsiveDialog";
import { ArrowLeft, Settings, Share, Plus, Sparkles } from "lucide-react";
import { api } from "@/trpc/react";
import { ProfilePreview } from "./ProfilePreview";
import { CreateColumnForm } from "./CreateColumnForm";
import { EditColumnForm } from "./EditColumnForm";
import { CreatePreviewForm } from "../CreatePreviewForm";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/app/_components/ui/card";

export default function ProfilePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const previewId = params.previewId as string;

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [isCreatePreviewOpen, setIsCreatePreviewOpen] = useState(false);

  // Fetch preview data
  const {
    data: preview,
    isLoading,
    error,
  } = api.profilePreviews.getById.useQuery(
    { id: previewId },
    { enabled: !!previewId },
  );

  const utils = api.useUtils();

  const deletePreview = api.profilePreviews.delete.useMutation({
    onSuccess: () => {
      toast.success("Preview deleted successfully");
      router.push("/app/profile-previews");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete preview");
    },
  });

  const handleDeletePreview = () => {
    if (confirm("Are you sure you want to delete this preview?")) {
      deletePreview.mutate({ id: previewId });
    }
  };

  const handleAddColumn = () => {
    setIsAddColumnOpen(true);
  };

  const handleEditColumn = (columnId: string) => {
    setEditingColumnId(columnId);
  };

  const handleAddColumnSuccess = () => {
    setIsAddColumnOpen(false);
    void utils.profilePreviews.getById.invalidate({ id: previewId });
  };

  const handleEditColumnSuccess = () => {
    setEditingColumnId(null);
    void utils.profilePreviews.getById.invalidate({ id: previewId });
  };

  const handleCreatePreviewSuccess = (newPreviewId: string) => {
    setIsCreatePreviewOpen(false);
    router.push(`/app/profile-previews/${newPreviewId}`);
  };

  const editingColumn = editingColumnId
    ? preview?.columns.find((col) => col.id === editingColumnId)
    : null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/profile-previews">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Previews
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/profile-previews">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Previews
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">
              {error?.message || "Preview not found"}
            </p>
            <Button asChild>
              <Link href="/app/profile-previews">Go back to previews</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if this preview has no columns (empty state)
  const hasNoColumns = preview.columns.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/profile-previews">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Previews
          </Link>
        </Button>

        {/* Add New Preview CTA */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreatePreviewOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Preview
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{preview.name}</h1>
          {preview.description && (
            <p className="text-muted-foreground">{preview.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeletePreview}
            disabled={deletePreview.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Empty State or Profile Preview */}
      {hasNoColumns ? (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="max-w-md space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
                <Sparkles className="h-10 w-10 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Ready to create magic? ✨
                </h2>
                <p className="text-lg text-gray-600">
                  Start building your perfect dating profile variations
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Compare how your profile looks across different dating apps
                  like Tinder, Hinge, and Bumble
                </p>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-xl"
                  onClick={handleAddColumn}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First App Variation
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="mb-1 text-2xl">🔥</div>
                  <p className="text-xs text-gray-500">Tinder</p>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl">🔒</div>
                  <p className="text-xs text-gray-500">Hinge</p>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl">🐝</div>
                  <p className="text-xs text-gray-500">Bumble</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ProfilePreview
          preview={preview}
          onEditColumn={handleEditColumn}
          onAddColumn={handleAddColumn}
        />
      )}

      {/* Create New Preview Dialog */}
      <ResponsiveDialog
        open={isCreatePreviewOpen}
        onOpenChange={setIsCreatePreviewOpen}
        title="Create New Profile Preview"
        description="Start a new profile comparison"
        className="max-w-2xl"
        scrollable={true}
      >
        <CreatePreviewForm
          onSuccess={handleCreatePreviewSuccess}
          onCancel={() => setIsCreatePreviewOpen(false)}
        />
      </ResponsiveDialog>

      {/* Add Column Dialog */}
      <ResponsiveDialog
        open={isAddColumnOpen}
        onOpenChange={setIsAddColumnOpen}
        title="Add App Variation"
        description="Create a new profile variation for a different dating app"
        className="max-w-2xl"
        scrollable={true}
      >
        <CreateColumnForm
          previewId={previewId}
          preview={preview}
          onSuccess={handleAddColumnSuccess}
          onCancel={() => setIsAddColumnOpen(false)}
        />
      </ResponsiveDialog>

      {/* Edit Column Dialog */}
      {editingColumn && (
        <ResponsiveDialog
          open={!!editingColumnId}
          onOpenChange={(open) => !open && setEditingColumnId(null)}
          title="Edit App Variation"
          description="Modify this profile variation"
          className="max-w-6xl"
          scrollable={true}
        >
          <EditColumnForm
            column={editingColumn}
            preview={preview}
            onSuccess={handleEditColumnSuccess}
            onCancel={() => setEditingColumnId(null)}
          />
        </ResponsiveDialog>
      )}
    </div>
  );
}
