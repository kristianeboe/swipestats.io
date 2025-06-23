"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { ResponsiveDialog } from "@/app/_components/ui/compound/ResponsiveDialog";
import { ArrowLeft, Settings, Share } from "lucide-react";
import { api } from "@/trpc/react";
import { ProfilePreview } from "./ProfilePreview";
import { CreateColumnForm } from "./CreateColumnForm";
import { EditColumnForm } from "./EditColumnForm";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const previewId = params.previewId as string;

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

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
            <p className="text-muted-foreground mb-4">
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

      {/* Profile Preview Component */}
      <ProfilePreview
        preview={preview}
        onEditColumn={handleEditColumn}
        onAddColumn={handleAddColumn}
      />

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
          className="max-w-4xl"
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
