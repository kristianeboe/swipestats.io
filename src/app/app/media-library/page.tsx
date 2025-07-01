"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Badge } from "@/app/_components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { api } from "@/trpc/react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Search,
  Filter,
  Star,
  Eye,
  MoreHorizontal,
  Edit3,
  Trash2,
  Plus,
  X,
  MapPin,
  Calendar,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ResponsiveDialog } from "@/app/_components/ui/compound/ResponsiveDialog";
import { type MediaAsset } from "@prisma/client";
import { type RouterOutputs } from "@/trpc/react";
import { MultiSelect } from "@/app/_components/ui/multi-select";
import { CountryDropdown } from "@/app/_components/ui/compound/CountryRegionSelect";

// Asset types and additional tags with emojis
const ASSET_TYPES = [
  { value: "main", emoji: "⭐" },
  { value: "headshot", emoji: "👤" },
  { value: "full_body", emoji: "🧍" },
  { value: "activity", emoji: "🏃" },
  { value: "travel", emoji: "✈️" },
  { value: "group", emoji: "👥" },
  { value: "formal", emoji: "👔" },
  { value: "casual", emoji: "👕" },
];

const ADDITIONAL_TAGS = [
  { value: "thirst_trap", emoji: "🔥" },
  { value: "city", emoji: "🏙️" },
  { value: "outdoors", emoji: "🌲" },
  { value: "sport", emoji: "⚽" },
  { value: "fish", emoji: "🎣" },
  { value: "sunglasses", emoji: "🕶️" },
];

const ALL_TAG_OPTIONS = [...ASSET_TYPES, ...ADDITIONAL_TAGS];

// Priority countries for better UX in country selection
const PRIORITY_COUNTRIES = ["US", "NO", "CA", "GB", "AU", "DE", "FR"];

export default function MediaLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>();
  const [selectedAssetType, setSelectedAssetType] = useState<string>();

  // Fetch photos with filters
  const {
    data: photosData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.mediaLibrary.getAll.useInfiniteQuery(
    {
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      rating: selectedRating,
      assetType: selectedAssetType,
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  // Fetch available tags and photo types for filters
  const { data: availableTags } = api.mediaLibrary.getTags.useQuery();
  const { data: availableAssetTypes } =
    api.mediaLibrary.getAssetTypes.useQuery();

  // Get stats
  const { data: stats } = api.mediaLibrary.getStats.useQuery();

  const deletePhoto = api.mediaLibrary.deletePhoto.useMutation({
    onSuccess: () => {
      toast.success("Photo deleted successfully");
      // Invalidate and refetch
      void utils.mediaLibrary.getAll.invalidate();
      void utils.mediaLibrary.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete photo");
    },
  });

  const utils = api.useUtils();

  const allPhotos = photosData?.pages.flatMap((page) => page.photos) ?? [];

  // Filter photos by search term on client side (since server filtering is by tags/rating/type)
  const filteredPhotos = allPhotos.filter((photo) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      photo.name?.toLowerCase().includes(search) ||
      photo.description?.toLowerCase().includes(search) ||
      photo.location?.toLowerCase().includes(search) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  });

  const addTagFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTagFilter = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedRating(undefined);
    setSelectedAssetType(undefined);
    setSearchTerm("");
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhoto.mutate({ id: photoId });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-muted-foreground">
              Loading your photo library...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/app">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Photo Library</h1>
            <p className="text-muted-foreground">
              {stats?.totalPhotos || 0} photos • Avg rating:{" "}
              {stats?.averageRating?.toFixed(1) || "0.0"}
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href="/app/media-library/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search photos by name, description, location, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap gap-4">
            {/* Rating filter */}
            <Select
              value={selectedRating?.toString()}
              onValueChange={(value) =>
                setSelectedRating(value ? parseInt(value) : undefined)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Min rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating}+ stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Photo type filter */}
            <Select
              value={selectedAssetType || "none"}
              onValueChange={(value) =>
                setSelectedAssetType(value === "none" ? undefined : value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any type</SelectItem>
                {ASSET_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.emoji} {type.value.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          {/* Selected tag filters */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Tags:</span>
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button
                    onClick={() => removeTagFilter(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Available tags for quick filtering */}
          {stats?.topTags && stats.topTags.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Popular tags:</span>
              <div className="flex flex-wrap gap-1">
                {stats.topTags.slice(0, 10).map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => addTagFilter(tag)}
                    disabled={selectedTags.includes(tag)}
                    className={`rounded px-2 py-1 text-xs ${
                      selectedTags.includes(tag)
                        ? "cursor-not-allowed bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag} ({count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No photos found</h3>
            <p className="mb-4 text-center text-muted-foreground">
              {allPhotos.length === 0
                ? "Upload your first photos to get started"
                : "Try adjusting your search filters"}
            </p>
            <Button asChild>
              <Link href="/app/media-library/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredPhotos.length} of {allPhotos.length} photos
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onDelete={() => handleDeletePhoto(photo.id)}
                onTagClick={addTagFilter}
                availableTags={availableTags || []}
              />
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type PhotoWithRelations =
  RouterOutputs["mediaLibrary"]["getAll"]["photos"][number];

function PhotoCard({
  photo,
  onDelete,
  onTagClick,
  availableTags,
}: {
  photo: PhotoWithRelations;
  onDelete: () => void;
  onTagClick: (tag: string) => void;
  availableTags: string[];
}) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isUpdatingRating, setIsUpdatingRating] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const utils = api.useUtils();

  const updatePhoto = api.mediaLibrary.updatePhoto.useMutation({
    onSuccess: () => {
      toast.success("Photo updated successfully");
      void utils.mediaLibrary.getAll.invalidate();
      void utils.mediaLibrary.getStats.invalidate();
      setIsUpdatingRating(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update photo");
      setIsUpdatingRating(false);
    },
  });

  const handleEditStart = (field: string, currentValue: string) => {
    setIsEditing(field);
    setEditValue(currentValue);
  };

  const handleEditSave = async (field: string) => {
    if (editValue.trim() === (photo[field as keyof typeof photo] || "")) {
      setIsEditing(null);
      return;
    }

    try {
      await updatePhoto.mutateAsync({
        id: photo.id,
        [field]: editValue.trim() || undefined,
      });
      setIsEditing(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEditCancel = () => {
    setIsEditing(null);
    setEditValue("");
  };

  const handleRatingChange = async (rating: number) => {
    const newRating = photo.rating === rating ? 0 : rating;
    setIsUpdatingRating(true);
    try {
      await updatePhoto.mutateAsync({
        id: photo.id,
        rating: newRating,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleTagsChange = async (newTags: string[]) => {
    try {
      await updatePhoto.mutateAsync({
        id: photo.id,
        tags: newTags,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeletePhoto = () => {
    onDelete();
    setDeleteConfirmation(false);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Get all available tag options with emojis
  const allTagOptions = [
    ...ALL_TAG_OPTIONS.map((tag) => ({
      label: `${tag.emoji} ${tag.value.replace("_", " ")}`,
      value: tag.value,
      icon: undefined,
    })),
    ...availableTags
      .filter((tag) => !ALL_TAG_OPTIONS.some((t) => t.value === tag))
      .map((tag) => ({
        label: tag.replace("_", " "),
        value: tag,
        icon: undefined,
      })),
  ];

  return (
    <>
      <Card className="group overflow-hidden pt-0">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={photo.url}
            alt={photo.name || "Photo"}
            className="h-full w-full cursor-pointer object-cover transition-transform group-hover:scale-105"
            onClick={() => setShowDetailDialog(true)}
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20">
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDetailDialog(true)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteConfirmation(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Usage indicator */}
          {photo._count.previewColumns > 0 && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <Eye className="mr-1 h-3 w-3" />
                {photo._count.previewColumns}
              </Badge>
            </div>
          )}

          {/* Delete confirmation overlay */}
          {deleteConfirmation && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="rounded-lg bg-white p-4 shadow-lg">
                <h4 className="mb-2 text-sm font-semibold">Delete photo?</h4>
                <p className="mb-4 text-xs text-gray-600">
                  This will permanently delete this photo from your library.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteConfirmation(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeletePhoto}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <CardContent className="space-y-3 px-3 pt-3">
          {/* Editable Name with loading state */}
          <div className="relative">
            {isEditing === "name" ? (
              <div className="flex gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleEditSave("name");
                    if (e.key === "Escape") handleEditCancel();
                  }}
                  onBlur={() => handleEditSave("name")}
                  autoFocus
                  className="text-sm font-medium"
                  disabled={updatePhoto.isPending}
                />
                {updatePhoto.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  </div>
                )}
              </div>
            ) : (
              <h3
                className={`cursor-pointer truncate text-sm font-medium transition-opacity hover:text-blue-600 ${
                  updatePhoto.isPending && isEditing === "name"
                    ? "opacity-50"
                    : ""
                }`}
                onClick={() => handleEditStart("name", photo.name || "")}
                title="Click to edit"
              >
                {photo.name || "Untitled"}
              </h3>
            )}
          </div>

          {/* Rating with loading animation - fixed overlap */}
          <div className="relative">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  disabled={isUpdatingRating}
                  className={`p-0.5 transition-colors disabled:cursor-not-allowed ${
                    rating <= (photo.rating || 0)
                      ? "text-yellow-400 hover:text-yellow-500"
                      : "text-gray-300 hover:text-yellow-200"
                  } ${isUpdatingRating ? "opacity-50" : ""}`}
                  title={`Rate ${rating} star${rating !== 1 ? "s" : ""}`}
                >
                  <Star className="h-3 w-3" fill="currentColor" />
                </button>
              ))}
              {!isUpdatingRating && (
                <span className="ml-1 text-xs text-muted-foreground">
                  {photo.rating || 0}/5
                </span>
              )}
            </div>
            {isUpdatingRating && (
              <div className="absolute right-0 top-0 flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            )}
          </div>

          {/* Location - click to open details */}
          <div
            className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-blue-600"
            onClick={() => setShowDetailDialog(true)}
            title="Click to edit in details"
          >
            <MapPin className="h-3 w-3" />
            <span className="truncate">
              {photo.location || "Add location..."}
            </span>
          </div>

          {/* Usage info - grouped by preview, then columns */}
          {photo.previewColumns.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Used in:{" "}
              {Object.entries(
                photo.previewColumns.reduce(
                  (groups, col) => {
                    const previewName = col.column.preview.name;
                    if (!groups[previewName]) {
                      groups[previewName] = [];
                    }
                    groups[previewName].push(col.column.type);
                    return groups;
                  },
                  {} as Record<string, string[]>,
                ),
              ).map(([previewName, columnTypes], index) => (
                <span key={previewName}>
                  {index > 0 && ", "}
                  <span className="font-medium">{previewName}</span>
                  {", in "}
                  {columnTypes.join(", ")}
                </span>
              ))}
            </div>
          )}

          {/* Tag Management - Always visible MultiSelect */}
          <div className="space-y-2">
            <MultiSelect
              options={allTagOptions}
              onValueChange={handleTagsChange}
              defaultValue={photo.tags}
              placeholder="Add tags..."
              maxCount={2}
              showSelectAll={false}
              className="text-xs"
              variant="secondary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <ResponsiveDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        className="max-w-2xl"
        scrollable
      >
        <PhotoDetailView
          photo={photo}
          onClose={() => setShowDetailDialog(false)}
          onDelete={onDelete}
          availableTags={availableTags}
        />
      </ResponsiveDialog>
    </>
  );
}

function PhotoDetailView({
  photo,
  onClose,
  onDelete,
  availableTags,
}: {
  photo: PhotoWithRelations;
  onClose: () => void;
  onDelete: () => void;
  availableTags: string[];
}) {
  const [editData, setEditData] = useState({
    name: photo.name || "",
    description: photo.description || "",
    location: photo.location || "",
    tags: photo.tags,
    rating: photo.rating || 0,
  });

  const utils = api.useUtils();

  const updatePhoto = api.mediaLibrary.updatePhoto.useMutation({
    onSuccess: () => {
      toast.success("Photo updated successfully");
      void utils.mediaLibrary.getAll.invalidate();
      void utils.mediaLibrary.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update photo");
    },
  });

  const handleSave = async () => {
    try {
      await updatePhoto.mutateAsync({
        id: photo.id,
        name: editData.name.trim() || undefined,
        description: editData.description.trim() || undefined,
        location: editData.location.trim() || undefined,
        tags: editData.tags,
        rating: editData.rating,
      });
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRatingChange = (rating: number) => {
    const newRating = editData.rating === rating ? 0 : rating;
    setEditData((prev) => ({ ...prev, rating: newRating }));
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Get all available tag options with emojis
  const allTagOptions = [
    ...ALL_TAG_OPTIONS.map((tag) => ({
      label: `${tag.emoji} ${tag.value.replace("_", " ")}`,
      value: tag.value,
      icon: undefined,
    })),
    ...availableTags
      .filter((tag) => !ALL_TAG_OPTIONS.some((t) => t.value === tag))
      .map((tag) => ({
        label: tag.replace("_", " "),
        value: tag,
        icon: undefined,
      })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Photo Details</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updatePhoto.isPending}>
            {updatePhoto.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Single column layout */}
      <div className="space-y-6">
        {/* Photo Preview */}
        <div className="flex justify-center">
          <div className="relative aspect-[3/4] w-80 overflow-hidden rounded-lg border">
            <img
              src={photo.url}
              alt={photo.name || "Photo"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Photo name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Photo description"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <CountryDropdown
                  value={editData.location}
                  onChange={(value) =>
                    setEditData((prev) => ({
                      ...prev,
                      location: value,
                    }))
                  }
                  placeholder="Select country..."
                  priorityOptions={PRIORITY_COUNTRIES}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="text-lg font-medium">Rating</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`p-1 transition-colors ${
                    rating <= editData.rating
                      ? "text-yellow-400 hover:text-yellow-500"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                >
                  <Star className="h-6 w-6" fill="currentColor" />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {editData.rating}/5
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tags using MultiSelect */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="text-lg font-medium">Tags</h3>
            <MultiSelect
              options={allTagOptions}
              onValueChange={(values) =>
                setEditData((prev) => ({ ...prev, tags: values }))
              }
              defaultValue={editData.tags}
              placeholder="Select tags..."
              maxCount={5}
              showSelectAll={false}
            />
            <p className="text-xs text-muted-foreground">
              Asset types and special categories include emojis for easy
              identification
            </p>
          </CardContent>
        </Card>

        {/* File Information */}
        <Card>
          <CardContent className="space-y-3 p-6">
            <h3 className="text-lg font-medium">File Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4 text-muted-foreground" />
                <span>Size: {formatFileSize(photo.fileSize || 0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Uploaded: {new Date(photo.createdAt).toLocaleDateString()}
                </span>
              </div>
              {photo._count.previewColumns > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Used in {photo._count.previewColumns} preview
                    {photo._count.previewColumns !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage Information */}
        {photo.previewColumns.length > 0 && (
          <Card>
            <CardContent className="space-y-3 p-6">
              <h3 className="text-lg font-medium">Usage</h3>
              <div className="space-y-2">
                {Object.entries(
                  photo.previewColumns.reduce(
                    (groups, col) => {
                      const previewName = col.column.preview.name;
                      if (!groups[previewName]) {
                        groups[previewName] = [];
                      }
                      groups[previewName].push(col.column.type);
                      return groups;
                    },
                    {} as Record<string, string[]>,
                  ),
                ).map(([previewName, columnTypes]) => (
                  <div
                    key={previewName}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="font-medium">{previewName}</span>
                    <span className="text-muted-foreground">in:</span>
                    <div className="flex gap-1">
                      {columnTypes.map((type, index) => (
                        <Badge key={index} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardContent className="space-y-4 p-6">
            <h3 className="text-lg font-medium text-red-800">Danger Zone</h3>
            <Button
              variant="destructive"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to delete this photo? This action cannot be undone.",
                  )
                ) {
                  onDelete();
                  onClose();
                }
              }}
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Photo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
