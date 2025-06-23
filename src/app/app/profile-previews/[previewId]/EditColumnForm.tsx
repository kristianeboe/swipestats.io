"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Badge } from "@/app/_components/ui/badge";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { type DataProvider } from "@prisma/client";
import {
  useDropzone,
  type FileRejection,
  type DropEvent,
} from "react-dropzone";
import { X, Upload, Plus, FolderIcon, Star } from "lucide-react";
import { type PreviewColumnWithRelations } from "./ProfilePreview";

// Types for File System API
interface FileSystemEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
}

interface FileSystemFileEntry extends FileSystemEntry {
  isFile: true;
  file(callback: (file: File) => void): void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  isDirectory: true;
  createReader(): FileSystemDirectoryReader;
}

interface FileSystemDirectoryReader {
  readEntries(callback: (entries: FileSystemEntry[]) => void): void;
}

interface DataTransferItem {
  webkitGetAsEntry?: () => FileSystemEntry | null;
  getAsFile(): File | null;
}

// Types
type PreviewPhoto = {
  id: string;
  url: string;
  name?: string | null;
  description?: string | null;
  location?: string | null;
  assetType?: string | null;
  tags: string[];
  rating?: number | null;
};

type PreviewColumn = {
  id: string;
  type: DataProvider;
  order: number;
  bio?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  school?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  age?: number | null;
  fromCity?: string | null;
  fromCountry?: string | null;
  media: PreviewPhoto[];
};

type ProfilePreviewData = {
  id: string;
  name?: string | null;
  description?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  school?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  age?: number | null;
  defaultBio?: string | null;
  fromCity?: string | null;
  fromCountry?: string | null;
};

// Bulk upload types
type BulkPhotoPreview = {
  file: File;
  preview: string;
  name: string;
  assigned?: number; // which slot it's assigned to
};

const editColumnSchema = z.object({
  bio: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  school: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  age: z.coerce.number().optional(),
  fromCity: z.string().optional(),
  fromCountry: z.string().optional(),
});

type EditColumnForm = z.infer<typeof editColumnSchema>;

interface EditColumnFormProps {
  column: PreviewColumnWithRelations;
  preview: ProfilePreviewData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const getAppIcon = (type: DataProvider) => {
  switch (type) {
    case "TINDER":
      return "🔥";
    case "HINGE":
      return "💝";
    case "BUMBLE":
      return "🐝";
    case "GRINDER":
      return "🟡";
    default:
      return "❤️";
  }
};

const getAppColor = (type: DataProvider) => {
  switch (type) {
    case "TINDER":
      return "bg-red-100 text-red-800 border-red-200";
    case "HINGE":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "BUMBLE":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "GRINDER":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPlaceholderImage = (index: number) => {
  const colors = ["e74c3c", "3498db", "2ecc71", "f39c12", "9b59b6", "1abc9c"];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/300x400/${color}/ffffff?text=Photo+${index + 1}`;
};

const getMaxPhotosForProvider = (provider: DataProvider): number => {
  switch (provider) {
    case "TINDER":
      return 9;
    case "HINGE":
      return 6;
    case "BUMBLE":
      return 6;
    case "GRINDER":
      return 6;
    case "BADOO":
      return 8;
    case "OK_CUPID":
      return 9;
    case "FEELD":
      return 6;
    default:
      return 6;
  }
};

export function EditColumnForm({
  column,
  preview,
  onSuccess,
  onCancel,
}: EditColumnFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState<Set<number>>(
    new Set(),
  );
  const [bulkPhotos, setBulkPhotos] = useState<BulkPhotoPreview[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [processingBulk, setProcessingBulk] = useState(false);
  const maxPhotos = getMaxPhotosForProvider(column.type);

  const form = useForm<EditColumnForm>({
    resolver: zodResolver(editColumnSchema),
    defaultValues: {
      bio: column.bio || "",
      jobTitle: column.jobTitle || "",
      company: column.company || "",
      school: column.school || "",
      city: column.city || "",
      state: column.state || "",
      country: column.country || "",
      age: column.age || undefined,
      fromCity: column.fromCity || "",
      fromCountry: column.fromCountry || "",
    },
  });

  const utils = api.useUtils();

  const updateColumn = api.profilePreviews.updateColumn.useMutation({
    onSuccess: () => {
      toast.success("Column updated successfully!");
      void utils.profilePreviews.getById.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update column");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const addPhoto = api.profilePreviews.addPhoto.useMutation({
    onSuccess: () => {
      void utils.profilePreviews.getById.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add photo");
    },
  });

  const deletePhoto = api.profilePreviews.deletePhoto.useMutation({
    onSuccess: () => {
      void utils.profilePreviews.getById.invalidate();
      toast.success("Photo deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete photo");
    },
  });

  const onSubmit = async (data: EditColumnForm) => {
    setIsSubmitting(true);
    updateColumn.mutate({
      id: column.id,
      ...data,
    });
  };

  const fillWithDefaults = () => {
    form.setValue("bio", preview.defaultBio || "");
    form.setValue("jobTitle", preview.jobTitle || "");
    form.setValue("company", preview.company || "");
    form.setValue("school", preview.school || "");
    form.setValue("city", preview.city || "");
    form.setValue("state", preview.state || "");
    form.setValue("country", preview.country || "");
    form.setValue("age", preview.age || undefined);
    form.setValue("fromCity", preview.fromCity || "");
    form.setValue("fromCountry", preview.fromCountry || "");
  };

  const clearAll = () => {
    form.setValue("bio", "");
    form.setValue("jobTitle", "");
    form.setValue("company", "");
    form.setValue("school", "");
    form.setValue("city", "");
    form.setValue("state", "");
    form.setValue("country", "");
    form.setValue("age", undefined);
    form.setValue("fromCity", "");
    form.setValue("fromCountry", "");
  };

  const uploadPhoto = async (file: File, index: number) => {
    try {
      setUploadingPhotos((prev) => new Set(prev).add(index));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("dataProvider", column.type);

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = (await response.json()) as { url: string };

      // Add photo to column
      await addPhoto.mutateAsync({
        columnId: column.id,
        url: result.url,
        name: file.name,
      });

      toast.success("Photo uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhotos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], _: FileRejection[], event: DropEvent) => {
      // For individual photo drops, we need to find the index from the DOM
      let dropIndex = 0;
      if ("target" in event && event.target) {
        const target = event.target as HTMLElement;
        dropIndex = parseInt(target.dataset?.index || "0");
      }
      if (acceptedFiles.length > 0 && acceptedFiles[0]) {
        void uploadPhoto(acceptedFiles[0], dropIndex);
      }
    },
    [column.id],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled: isSubmitting,
  });

  const handleDeletePhoto = (photoId: string) => {
    deletePhoto.mutate({ id: photoId });
  };

  // Bulk upload functions
  const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  const isJsonFile = (file: File): boolean => {
    return (
      file.type === "application/json" ||
      file.name.toLowerCase().endsWith(".json")
    );
  };

  const processFiles = async (files: File[]) => {
    setProcessingBulk(true);
    const newPhotos: BulkPhotoPreview[] = [];

    for (const file of files) {
      if (isImageFile(file)) {
        // Create preview URL for images
        const preview = URL.createObjectURL(file);
        newPhotos.push({
          file,
          preview,
          name: file.name,
        });
      } else if (isJsonFile(file)) {
        // TODO: Handle JSON files that might contain photo URLs
        // For now, just log that we found a JSON file
        console.log(
          "Found JSON file:",
          file.name,
          "- URL processing not implemented yet",
        );
      }
    }

    setBulkPhotos((prev) => [...prev, ...newPhotos]);
    setProcessingBulk(false);
  };

  // Helper function to read directory contents (same as HingeGuidedUploadArea)
  const readDirectory = (
    directoryEntry: FileSystemDirectoryEntry,
  ): Promise<File[]> => {
    return new Promise((resolve) => {
      const files: File[] = [];
      const reader = directoryEntry.createReader();

      const readEntries = () => {
        reader.readEntries((entries: FileSystemEntry[]) => {
          if (entries.length === 0) {
            resolve(files);
            return;
          }

          let pendingFiles = entries.length;
          for (const entry of entries) {
            if (entry.isFile) {
              (entry as FileSystemFileEntry).file((file) => {
                files.push(file);
                pendingFiles--;
                if (pendingFiles === 0) {
                  readEntries(); // Continue reading
                }
              });
            } else {
              pendingFiles--;
              if (pendingFiles === 0) {
                readEntries(); // Continue reading
              }
            }
          }
        });
      };

      readEntries();
    });
  };

  // Bulk upload drop handler
  const onBulkDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent,
    ) => {
      let allFiles: File[] = [];

      // Check if this is a proper drag event with dataTransfer
      if ("dataTransfer" in event && event.dataTransfer?.items) {
        const items = event.dataTransfer.items;

        // Handle folder drops
        const handleFolderDrop = async () => {
          for (const item of Array.from(items) as DataTransferItem[]) {
            if (item.webkitGetAsEntry) {
              const entry = item.webkitGetAsEntry();
              if (entry?.isDirectory) {
                const folderFiles = await readDirectory(
                  entry as FileSystemDirectoryEntry,
                );
                allFiles = [...allFiles, ...folderFiles];
              } else if (entry?.isFile) {
                const file = item.getAsFile();
                if (file) allFiles.push(file);
              }
            }
          }

          // If no folder files found, use the regular accepted files
          if (allFiles.length === 0) {
            allFiles = acceptedFiles;
          }

          await processFiles(allFiles);
        };

        // Execute async handling
        void handleFolderDrop();
      } else {
        // If no drag event items, just process the accepted files
        void processFiles(acceptedFiles);
      }
    },
    [],
  );

  const {
    getRootProps: getBulkRootProps,
    getInputProps: getBulkInputProps,
    isDragActive: isBulkDragActive,
  } = useDropzone({
    onDrop: onBulkDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "application/json": [".json"],
    },
    disabled: processingBulk,
  });

  const assignPhotoToSlot = async (
    photo: BulkPhotoPreview,
    slotIndex: number,
  ) => {
    if (column.mediaAssets[slotIndex]) {
      toast.error(`Slot ${slotIndex + 1} already has a photo`);
      return;
    }

    try {
      await uploadPhoto(photo.file, slotIndex);

      // Remove the photo from bulk photos and clean up preview URL
      setBulkPhotos((prev) => {
        const newPhotos = prev.filter((p) => p !== photo);
        URL.revokeObjectURL(photo.preview);
        return newPhotos;
      });
    } catch (error) {
      toast.error("Failed to assign photo");
    }
  };

  const removeBulkPhoto = (photo: BulkPhotoPreview) => {
    setBulkPhotos((prev) => prev.filter((p) => p !== photo));
    URL.revokeObjectURL(photo.preview);
  };

  const clearAllBulkPhotos = () => {
    bulkPhotos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    setBulkPhotos([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className={getAppColor(column.type)}>
            {getAppIcon(column.type)} {column.type}
          </Badge>
          <h2 className="text-lg font-semibold">Edit Column</h2>
        </div>
      </div>

      {/* Bulk Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium">Photo Upload</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowBulkUpload(!showBulkUpload)}
          >
            {showBulkUpload ? "Hide" : "Show"} Bulk Upload
          </Button>
        </div>

        {showBulkUpload && (
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            {/* Bulk Upload Drop Zone */}
            <div
              className={`rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                isBulkDragActive
                  ? "cursor-pointer border-blue-500 bg-blue-50"
                  : "cursor-pointer border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
              {...getBulkRootProps()}
            >
              <input {...getBulkInputProps()} />
              <FolderIcon className="mx-auto h-8 w-8 text-gray-400" />
              <h4 className="mt-2 text-sm font-semibold text-gray-900">
                Drop folder or select multiple photos
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Upload multiple photos at once, or drop a folder containing
                images and JSON files
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Supports: JPG, PNG, WebP images and JSON files with photo URLs
              </p>
            </div>

            {/* Bulk Photos Preview */}
            {bulkPhotos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    Photos to Assign ({bulkPhotos.length})
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearAllBulkPhotos}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {bulkPhotos.map((photo, idx) => (
                    <div key={idx} className="group relative">
                      <img
                        src={photo.preview}
                        alt={photo.name}
                        className="aspect-[3/4] w-full rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/50">
                        <div className="space-y-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Select
                            onValueChange={(value) =>
                              assignPhotoToSlot(photo, parseInt(value))
                            }
                          >
                            <SelectTrigger className="h-8 w-32 bg-white text-xs">
                              <SelectValue placeholder="Assign to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: maxPhotos }, (_, i) => (
                                <SelectItem
                                  key={i}
                                  value={i.toString()}
                                  disabled={!!column.mediaAssets[i]}
                                >
                                  Slot {i + 1} {i === 0 ? "(Main)" : ""}{" "}
                                  {column.mediaAssets[i] ? "(Occupied)" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 w-full text-xs"
                            onClick={() => removeBulkPhoto(photo)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="absolute bottom-1 left-1 right-1">
                        <p className="truncate rounded bg-black/70 px-1 py-0.5 text-xs text-white">
                          {photo.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {processingBulk && (
              <div className="flex items-center justify-center py-4">
                <div className="mr-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                <span className="text-sm text-gray-600">
                  Processing photos...
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium">Photo Slots</h3>
          <p className="text-muted-foreground text-sm">
            {column.mediaAssets.length}/{maxPhotos} photos
          </p>
        </div>

        <div
          className={`grid gap-4 ${maxPhotos === 9 ? "grid-cols-3" : "grid-cols-2"}`}
        >
          {Array.from({ length: maxPhotos }, (_, index) => {
            const photo = column.mediaAssets[index];
            const isUploading = uploadingPhotos.has(index);

            return (
              <div
                key={index}
                className="relative aspect-[3/4] overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-gray-300"
              >
                {photo ? (
                  <>
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="group absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {index === 0 && (
                      <div className="absolute left-2 top-2">
                        <span className="rounded bg-black/70 px-2 py-1 text-xs text-white">
                          Main
                        </span>
                      </div>
                    )}
                    {/* Show photo rating if available */}
                    {photo.rating && photo.rating > 0 && (
                      <div className="absolute right-2 top-2">
                        <Badge
                          variant="secondary"
                          className="bg-black/70 text-xs text-white"
                        >
                          <Star className="mr-1 h-3 w-3" fill="currentColor" />
                          {photo.rating}
                        </Badge>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    {...getRootProps()}
                    data-index={index}
                    className={`flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-500 transition-colors ${
                      isDragActive ? "border-blue-500 bg-blue-50" : ""
                    } ${isUploading ? "pointer-events-none" : ""}`}
                  >
                    <input {...getInputProps()} />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                        <span className="text-xs">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {index === 0 ? (
                          <Upload className="h-8 w-8" />
                        ) : (
                          <Plus className="h-8 w-8" />
                        )}
                        <span className="text-xs">
                          {index === 0 ? "Main Photo" : `Photo ${index + 1}`}
                        </span>
                        <span className="text-xs text-gray-400">
                          Click or drag to upload
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2 py-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillWithDefaults}
            >
              Use Default Values
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              Clear All
            </Button>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Profile Information</h4>
            <p className="text-muted-foreground text-sm">
              Leave fields blank to use the preview defaults
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Marketing Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Love exploring new places, trying different cuisines, and having great conversations..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This bio will be used for this specific app variation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Column"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
