"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Switch } from "@/app/_components/ui/switch";
import { Label } from "@/app/_components/ui/label";
import { Share, Pencil, PlusCircle, Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DataProvider,
  type ComparisonColumn,
  type ProfileComparison,
} from "@prisma/client";
import { Input } from "@/app/_components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { ComparisonColumn as ComparisonColumnComponent } from "./comparison-column";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/app/_components/ui/carousel";
import { LayoutGrid, SlidersHorizontal } from "lucide-react";

// Re-using styles from comparison-column.tsx
const APP_COLORS = {
  [DataProvider.TINDER]:
    "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  [DataProvider.HINGE]:
    "bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800",
  [DataProvider.BUMBLE]:
    "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  [DataProvider.GRINDER]:
    "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
  [DataProvider.BADOO]:
    "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
  [DataProvider.BOO]:
    "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  [DataProvider.OK_CUPID]:
    "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  [DataProvider.FEELD]:
    "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800",
};

const APP_HEADER_COLORS = {
  [DataProvider.TINDER]: "bg-red-500 text-white",
  [DataProvider.HINGE]: "bg-pink-500 text-white",
  [DataProvider.BUMBLE]: "bg-yellow-500 text-black",
  [DataProvider.GRINDER]: "bg-orange-500 text-white",
  [DataProvider.BADOO]: "bg-purple-500 text-white",
  [DataProvider.BOO]: "bg-blue-500 text-white",
  [DataProvider.OK_CUPID]: "bg-green-500 text-white",
  [DataProvider.FEELD]: "bg-gray-500 text-white",
};

// Add MAX_PHOTOS constant
const MAX_PHOTOS = {
  [DataProvider.TINDER]: 9,
  [DataProvider.HINGE]: 6,
  [DataProvider.BUMBLE]: 6,
  [DataProvider.GRINDER]: 6,
  [DataProvider.BADOO]: 6,
  [DataProvider.BOO]: 6,
  [DataProvider.OK_CUPID]: 6,
  [DataProvider.FEELD]: 6,
};

type ComparisonDetailProps = {
  comparison: ProfileComparison & {
    columns: (ComparisonColumn & {
      photos: { id: string; url: string; order: number }[];
    })[];
  };
};

// Add ProfileComparisonColumn component before the main ComparisonDetail component
type ProfileComparisonColumnProps = {
  column: ComparisonColumn & {
    photos: { id: string; url: string; order: number }[];
  };
  addPhotoMutation: ReturnType<
    typeof api.profileCompare.addPhotoToColumn.useMutation
  >;
};

function ProfileComparisonColumn({
  column,
  addPhotoMutation,
}: ProfileComparisonColumnProps) {
  const [isCarouselMode, setIsCarouselMode] = useState(false);
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Track current slide
  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", handleSelect);

    // Initialize
    handleSelect();

    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi]);

  // Add delete photo mutation
  const deletePhotoMutation = api.profileCompare.deletePhoto.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Photo deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
    },
  });

  const handleDeletePhoto = (photoId: string) => {
    deletePhotoMutation.mutate({ photoId });
  };

  return (
    <div
      className={cn(
        "w-72 flex-shrink-0 overflow-hidden rounded-lg border-2",
        APP_COLORS[column.type],
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2",
          APP_HEADER_COLORS[column.type],
        )}
      >
        <h3 className="font-semibold">{column.type}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCarouselMode(!isCarouselMode)}
          className="h-6 w-6 text-white hover:bg-black/20 hover:text-white"
          title={
            isCarouselMode ? "Switch to grid view" : "Switch to carousel view"
          }
        >
          {isCarouselMode ? (
            <LayoutGrid className="h-3 w-3" />
          ) : (
            <SlidersHorizontal className="h-3 w-3" />
          )}
        </Button>
      </div>
      <div className="space-y-3 p-3">
        {column.bio && (
          <div className="rounded-md bg-white p-2 text-sm shadow-sm dark:bg-gray-700">
            {column.bio}
          </div>
        )}

        {isCarouselMode && column.photos.length > 0 ? (
          <Carousel className="w-full" setApi={setCarouselApi}>
            <CarouselContent>
              {column.photos.map((photo) => (
                <CarouselItem key={photo.id}>
                  <div className="group relative">
                    <Image
                      src={photo.url}
                      alt="Profile photo"
                      width={240}
                      height={320}
                      className="h-auto w-full rounded-md object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleDeletePhoto(photo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Dot indicators */}
            {column.photos.length > 1 && (
              <div className="mt-2 flex items-center justify-center gap-1">
                {Array.from({ length: column.photos.length }).map(
                  (_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                        currentSlide === index
                          ? "bg-gray-800 dark:bg-gray-200"
                          : "bg-gray-300 dark:bg-gray-600",
                      )}
                      onClick={() => carouselApi?.scrollTo(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ),
                )}
              </div>
            )}

            <div className="mt-1 flex items-center justify-center">
              <span className="text-xs text-gray-500">
                {column.photos.length > 0
                  ? `Photo ${currentSlide + 1}/${column.photos.length}`
                  : "No photos"}
              </span>
            </div>

            {column.photos.length > 1 && (
              <>
                <CarouselPrevious className="-left-3" />
                <CarouselNext className="-right-3" />
              </>
            )}
          </Carousel>
        ) : (
          <>
            {column.photos.map((photo) => (
              <div key={photo.id} className="group relative">
                <Image
                  src={photo.url}
                  alt="Profile photo"
                  width={240}
                  height={320}
                  className="h-auto w-full rounded-md object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleDeletePhoto(photo.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </>
        )}

        {column.photos.length < (MAX_PHOTOS[column.type] || 6) && (
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-300 p-4">
            <div className="flex flex-col items-center">
              <input
                type="file"
                id={`photo-upload-${column.id}`}
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files || e.target.files.length === 0) return;

                  const file = e.target.files[0]!;

                  try {
                    // Generate a unique filename
                    const filename = `${Date.now()}-${file.name}`;

                    // Upload to Vercel Blob directly from the client
                    const blob = await upload(filename, file, {
                      access: "public",
                      handleUploadUrl: "/api/file/upload",
                      clientPayload: JSON.stringify({
                        appType: column.type,
                      }),
                    });

                    // Call API to add the photo to the column
                    addPhotoMutation.mutate({
                      columnId: column.id,
                      url: blob.url,
                    });
                  } catch (error) {
                    console.error("Error uploading photo:", error);
                    toast.error("Failed to upload photo");
                  }
                }}
              />
              <label
                htmlFor={`photo-upload-${column.id}`}
                className="flex cursor-pointer flex-col items-center"
              >
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Add photo ({column.photos.length}/
                  {MAX_PHOTOS[column.type] || 6})
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparisonDetail({
  comparison,
}: ComparisonDetailProps) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(comparison.isPublic);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [name, setName] = useState(comparison.name || "Untitled Comparison");

  // For adding new columns
  const [selectedAppType, setSelectedAppType] = useState<DataProvider | null>(
    null,
  );
  const [columnBio, setColumnBio] = useState(comparison.defaultBio || "");
  const [isAddingColumnLoading, setIsAddingColumnLoading] = useState(false);

  const updateMutation = api.profileCompare.updateComparison.useMutation({
    onSuccess: () => {
      toast.success("Comparison updated successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Failed to update comparison: " + error.message);
    },
  });

  const addColumnMutation = api.profileCompare.addColumn.useMutation({
    onSuccess: () => {
      toast.success("Column added successfully!");
      setIsAddingColumn(false);
      setSelectedAppType(null);
      setColumnBio(comparison.defaultBio || "");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to add column: " + error.message);
      setIsAddingColumnLoading(false);
    },
  });

  const addPhotoMutation = api.profileCompare.addPhotoToColumn.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Photo uploaded successfully");
    },
    onError: (error) => {
      console.error("Error adding photo:", error);
      toast.error("Failed to add photo");
    },
  });

  const handleTogglePublic = () => {
    const newValue = !isPublic;
    setIsPublic(newValue);
    updateMutation.mutate({
      id: comparison.id,
      isPublic: newValue,
    });
  };

  const handleNameChange = () => {
    if (name.trim() === "") {
      setName("Untitled Comparison");
    }

    updateMutation.mutate({
      id: comparison.id,
      name,
    });
  };

  const handleAddColumn = () => {
    if (!selectedAppType) {
      toast.error("Please select an app type");
      return;
    }

    setIsAddingColumnLoading(true);
    addColumnMutation.mutate({
      comparisonId: comparison.id,
      type: selectedAppType,
      bio: columnBio || undefined,
    });
  };

  const handleShare = async () => {
    if (!isPublic) {
      toast.error("Make the comparison public first to share it");
      return;
    }

    const shareUrl = `${window.location.origin}/share/profile-compare/${comparison.shareKey}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Card.Container>
        <CardHeader>
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-md"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleNameChange();
                  }}
                  disabled={updateMutation.isPending}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setName(comparison.name || "Untitled Comparison");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CardTitle>{name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="public-mode"
                  checked={isPublic}
                  onCheckedChange={handleTogglePublic}
                  disabled={updateMutation.isPending}
                />
                <Label htmlFor="public-mode">Public</Label>
              </div>
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={!isPublic}
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          <CardDescription>
            Created on {new Date(comparison.createdAt).toLocaleDateString()}
            {comparison.age && <> • Age: {comparison.age}</>}
            {comparison.city && <> • {comparison.city}</>}
            {comparison.state && <>, {comparison.state}</>}
            {comparison.country && <>, {comparison.country}</>}
          </CardDescription>
          {comparison.defaultBio && (
            <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-800">
              <strong>Default Bio:</strong> {comparison.defaultBio}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {comparison.columns.map((column) => (
              <ProfileComparisonColumn
                key={column.id}
                column={column}
                addPhotoMutation={addPhotoMutation}
              />
            ))}

            <Dialog open={isAddingColumn} onOpenChange={setIsAddingColumn}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-full min-h-[200px] min-w-[240px] flex-shrink-0"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add App
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Dating App</DialogTitle>
                  <DialogDescription>
                    Select which dating app you want to add to your comparison
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="app-type" className="text-right">
                      App
                    </Label>
                    <Select
                      value={selectedAppType || undefined}
                      onValueChange={(value) =>
                        setSelectedAppType(value as DataProvider)
                      }
                    >
                      <SelectTrigger id="app-type" className="col-span-3">
                        <SelectValue placeholder="Select an app" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={DataProvider.TINDER}>
                          Tinder
                        </SelectItem>
                        <SelectItem value={DataProvider.HINGE}>
                          Hinge
                        </SelectItem>
                        <SelectItem value={DataProvider.BUMBLE}>
                          Bumble
                        </SelectItem>
                        <SelectItem value={DataProvider.GRINDER}>
                          Grindr
                        </SelectItem>
                        <SelectItem value={DataProvider.BADOO}>
                          Badoo
                        </SelectItem>
                        <SelectItem value={DataProvider.BOO}>Boo</SelectItem>
                        <SelectItem value={DataProvider.OK_CUPID}>
                          OkCupid
                        </SelectItem>
                        <SelectItem value={DataProvider.FEELD}>
                          Feeld
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bio" className="text-right">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      className="col-span-3"
                      placeholder="Optional bio for this app"
                      value={columnBio}
                      onChange={(e) => setColumnBio(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingColumn(false)}
                    disabled={isAddingColumnLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddColumn}
                    disabled={isAddingColumnLoading || !selectedAppType}
                  >
                    {isAddingColumnLoading ? "Adding..." : "Add"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500">
            Share this comparison to get feedback on which profile photos work
            best.
          </div>
        </CardFooter>
      </Card.Container>
    </div>
  );
}
