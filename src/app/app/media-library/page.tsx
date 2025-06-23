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
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { type MediaAsset } from "@prisma/client";
import { type RouterOutputs } from "@/trpc/react";

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
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
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
                <SelectItem value="">Any rating</SelectItem>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating}+ stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Photo type filter */}
            <Select
              value={selectedAssetType}
              onValueChange={(value) =>
                setSelectedAssetType(value || undefined)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any type</SelectItem>
                {availableAssetTypes?.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("_", " ")}
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
            <Upload className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No photos found</h3>
            <p className="text-muted-foreground mb-4 text-center">
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
}: {
  photo: PhotoWithRelations;
  onDelete: () => void;
  onTagClick: (tag: string) => void;
}) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={photo.url}
          alt={photo.name || "Photo"}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20">
          <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Rating badge */}
        {photo.rating && photo.rating > 0 && (
          <div className="absolute left-2 top-2">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Star className="mr-1 h-3 w-3" fill="currentColor" />
              {photo.rating}
            </Badge>
          </div>
        )}

        {/* Usage indicator */}
        {photo._count.previewColumns > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Eye className="mr-1 h-3 w-3" />
              {photo._count.previewColumns}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Name and type */}
          <div>
            <h3 className="truncate text-sm font-medium">
              {photo.name || "Untitled"}
            </h3>
            {photo.assetType && (
              <p className="text-muted-foreground text-xs">
                {photo.assetType.replace("_", " ")}
              </p>
            )}
          </div>

          {/* Location */}
          {photo.location && (
            <p className="text-muted-foreground truncate text-xs">
              📍 {photo.location}
            </p>
          )}

          {/* Tags */}
          {photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {photo.tags.slice(0, 3).map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 hover:bg-gray-200"
                >
                  {tag}
                </button>
              ))}
              {photo.tags.length > 3 && (
                <span className="text-muted-foreground text-xs">
                  +{photo.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Usage info */}
          {photo.previewColumns.length > 0 && (
            <div className="text-muted-foreground text-xs">
              Used in:{" "}
              {photo.previewColumns
                .map((column) => column.preview.name)
                .join(", ")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
