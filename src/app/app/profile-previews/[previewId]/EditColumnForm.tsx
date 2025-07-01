"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { heicTo } from "heic-to";
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
import { type DataProvider, Gender } from "@prisma/client";
import {
  useDropzone,
  type FileRejection,
  type DropEvent,
} from "react-dropzone";
import {
  X,
  Upload,
  Plus,
  FolderIcon,
  Star,
  Search,
  Camera,
  Grid3X3,
  Library,
  Trash2,
} from "lucide-react";
import {
  getMaxPhotosForProvider,
  type PreviewColumnWithRelations,
} from "./ProfilePreview";
import { type RouterOutputs } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { Switch } from "@/app/_components/ui/switch";

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

// Use RouterOutputs for exact types from tRPC queries
type ProfilePreviewData = RouterOutputs["profilePreviews"]["getById"];
type MediaAssetWithRelations =
  RouterOutputs["mediaLibrary"]["getAll"]["photos"][number];

// Bulk upload types
type BulkPhotoPreview = {
  file: File;
  preview: string;
  name: string;
  assigned?: number; // which slot it's assigned to
};

const editColumnSchema = z.object({
  // Bio and basic info (moved to top)
  bio: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  age: z.coerce.number().optional(),
  heightCm: z.coerce.number().optional(),
  // Location
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  hometown: z.string().optional(),
  nationality: z.string().optional(),
  fromCity: z.string().optional(),
  fromCountry: z.string().optional(),
  // Work & Education
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  school: z.string().optional(),
  // UI Settings
  hideUnusedPhotoSlots: z.boolean().optional(),
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
      return "🔒";
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
  const [addingFromLibrary, setAddingFromLibrary] = useState<Set<string>>(
    new Set(),
  );
  const [removingFromColumn, setRemovingFromColumn] = useState<Set<string>>(
    new Set(),
  );
  const [reorderMode, setReorderMode] = useState(false);
  const [selectedForReorder, setSelectedForReorder] = useState<string | null>(
    null,
  );
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    photoId: string;
    photoName: string;
  } | null>(null);

  const [swappingPhotos, setSwappingPhotos] = useState<{
    photoId1: string;
    photoId2: string;
  } | null>(null);

  const maxPhotos = getMaxPhotosForProvider(column.type);
  const hasPhotos = column.mediaAssets.length > 0;

  // Grid is always default, but show hints when no photos
  const [photoManagementTab, setPhotoManagementTab] = useState<
    "grid" | "library" | "upload"
  >("grid");

  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryFilter, setLibraryFilter] = useState<{
    rating?: number;
    assetType?: string;
    tags?: string[];
  }>({});

  const form = useForm<EditColumnForm>({
    resolver: zodResolver(editColumnSchema),
    defaultValues: {
      bio: column.bio || "",
      gender: column.gender || undefined,
      age: column.age || undefined,
      heightCm: column.heightCm || undefined,
      jobTitle: column.jobTitle || "",
      company: column.company || "",
      school: column.school || "",
      city: column.city || "",
      state: column.state || "",
      country: column.country || "",
      hometown: column.hometown || "",
      nationality: column.nationality || "",
      fromCity: column.fromCity || "",
      fromCountry: column.fromCountry || "",
      hideUnusedPhotoSlots: column.hideUnusedPhotoSlots ?? false,
    },
  });

  const utils = api.useUtils();

  // Fetch media library photos
  const {
    data: libraryPhotosData,
    fetchNextPage: fetchNextLibraryPage,
    hasNextPage: hasNextLibraryPage,
    isFetchingNextPage: isFetchingNextLibraryPage,
  } = api.mediaLibrary.getAll.useInfiniteQuery(
    {
      rating: libraryFilter.rating,
      assetType: libraryFilter.assetType,
      tags: libraryFilter.tags,
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const libraryPhotos =
    libraryPhotosData?.pages.flatMap((page) => page.photos) ?? [];

  // Filter library photos by search term
  const filteredLibraryPhotos = libraryPhotos.filter((photo) => {
    if (!librarySearch) return true;
    const search = librarySearch.toLowerCase();
    return (
      photo.name?.toLowerCase().includes(search) ||
      photo.description?.toLowerCase().includes(search) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  });

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
      // Exit reorder mode when deleting
      if (reorderMode) {
        setReorderMode(false);
        setSelectedForReorder(null);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete photo");
    },
  });

  const addPhotoToColumn = api.profilePreviews.addPhotoToColumn.useMutation({
    onSuccess: () => {
      void utils.profilePreviews.getById.invalidate();
      toast.success("Photo added to profile!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add photo");
    },
    onSettled: (_, __, variables) => {
      // Remove from loading state
      setAddingFromLibrary((prev) => {
        const newSet = new Set(prev);
        newSet.delete(variables.mediaAssetId);
        return newSet;
      });
    },
  });

  const removePhotoFromColumn =
    api.profilePreviews.removePhotoFromColumn.useMutation({
      onSuccess: () => {
        void utils.profilePreviews.getById.invalidate();
        toast.success("Photo removed from profile");
        // Exit reorder mode when removing
        if (reorderMode) {
          setReorderMode(false);
          setSelectedForReorder(null);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove photo");
      },
      onSettled: (_, __, variables) => {
        // Remove from loading state
        setRemovingFromColumn((prev) => {
          const newSet = new Set(prev);
          newSet.delete(variables.mediaAssetId);
          return newSet;
        });
      },
    });

  const swapPhotosMutation = api.profilePreviews.swapPhotos.useMutation({
    onSuccess: () => {
      void utils.profilePreviews.getById.invalidate();
      toast.success("Photos swapped successfully!");
      // Exit reorder mode and clear swapping state
      setReorderMode(false);
      setSelectedForReorder(null);
      setSwappingPhotos(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to swap photos");
      // Clear swapping state on error but don't exit reorder mode
      setSwappingPhotos(null);
    },
  });

  const addPhotosToLibrary = api.mediaLibrary.addPhotos.useMutation({
    onSuccess: () => {
      void utils.mediaLibrary.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add photos to library");
    },
  });

  const deletePhotoFromLibrary = api.mediaLibrary.deletePhoto.useMutation({
    onSuccess: () => {
      void utils.mediaLibrary.getAll.invalidate();
      void utils.profilePreviews.getById.invalidate();
      toast.success("Photo deleted from library");
      setDeleteConfirmation(null);
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
    form.setValue("gender", preview.gender || undefined);
    form.setValue("age", preview.age || undefined);
    form.setValue("heightCm", preview.heightCm || undefined);
    form.setValue("jobTitle", preview.jobTitle || "");
    form.setValue("company", preview.company || "");
    form.setValue("school", preview.school || "");
    form.setValue("city", preview.city || "");
    form.setValue("state", preview.state || "");
    form.setValue("country", preview.country || "");
    form.setValue("hometown", preview.hometown || "");
    form.setValue("nationality", preview.nationality || "");
    form.setValue("fromCity", preview.fromCity || "");
    form.setValue("fromCountry", preview.fromCountry || "");
    form.setValue("hideUnusedPhotoSlots", false); // Default to false
  };

  const clearAll = () => {
    form.setValue("bio", "");
    form.setValue("gender", undefined);
    form.setValue("age", undefined);
    form.setValue("heightCm", undefined);
    form.setValue("jobTitle", "");
    form.setValue("company", "");
    form.setValue("school", "");
    form.setValue("city", "");
    form.setValue("state", "");
    form.setValue("country", "");
    form.setValue("hometown", "");
    form.setValue("nationality", "");
    form.setValue("fromCity", "");
    form.setValue("fromCountry", "");
    form.setValue("hideUnusedPhotoSlots", false);
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

  // Delete photo entirely from user's library (removes from ALL columns)
  const handleDeletePhoto = (photoId: string) => {
    deletePhoto.mutate({ id: photoId });
  };

  const handleAddLibraryPhotoToColumn = async (mediaAssetId: string) => {
    try {
      // Add to loading state
      setAddingFromLibrary((prev) => new Set(prev).add(mediaAssetId));

      await addPhotoToColumn.mutateAsync({
        columnId: column.id,
        mediaAssetId,
      });
    } catch (error) {
      // Remove from loading state on error
      setAddingFromLibrary((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mediaAssetId);
        return newSet;
      });
      // Error handled by mutation
    }
  };

  // Remove photo from this specific column only (keeps it in library and other columns)
  const handleRemovePhotoFromColumn = async (mediaAssetId: string) => {
    try {
      // Add to loading state
      setRemovingFromColumn((prev) => new Set(prev).add(mediaAssetId));

      await removePhotoFromColumn.mutateAsync({
        columnId: column.id,
        mediaAssetId,
      });
    } catch (error) {
      // Remove from loading state on error
      setRemovingFromColumn((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mediaAssetId);
        return newSet;
      });
      // Error handled by mutation
    }
  };

  // Reorder functionality
  const handleReorderClick = (photoId: string) => {
    if (!reorderMode) {
      setReorderMode(true);
      setSelectedForReorder(photoId);
    } else if (selectedForReorder === photoId) {
      // Cancel reorder mode
      setReorderMode(false);
      setSelectedForReorder(null);
    } else if (selectedForReorder) {
      // Swap photos
      void swapPhotos(selectedForReorder, photoId);
      setReorderMode(false);
      setSelectedForReorder(null);
    }
  };

  const swapPhotos = async (photoId1: string, photoId2: string) => {
    try {
      // Set swapping state to show loading on both photos
      setSwappingPhotos({ photoId1, photoId2 });

      await swapPhotosMutation.mutateAsync({
        columnId: column.id,
        photoId1,
        photoId2,
      });
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  // Get next available slot index
  const getNextAvailableSlot = () => {
    for (let i = 0; i < maxPhotos; i++) {
      if (!column.mediaAssets[i]) {
        return i;
      }
    }
    return -1;
  };

  // Check if a photo from library is already in this column
  const isPhotoInColumn = (mediaAssetId: string) => {
    return column.mediaAssets.some(
      (connection) => connection.mediaAsset.id === mediaAssetId,
    );
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

  const isHeicFile = (file: File): boolean => {
    return (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    );
  };

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    try {
      const jpegBlob = await heicTo({
        blob: file,
        type: "image/jpeg",
        quality: 0.9,
      });

      const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");

      return new File([jpegBlob], newFileName, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("HEIC conversion failed:", error);
      throw new Error("Failed to convert HEIC file");
    }
  };

  const processFiles = async (files: File[]) => {
    setProcessingBulk(true);
    const newPhotos: BulkPhotoPreview[] = [];

    for (const file of files) {
      if (isImageFile(file)) {
        let processedFile = file;

        // Convert HEIC files to JPEG
        if (isHeicFile(file)) {
          try {
            toast.info(`Converting ${file.name} from HEIC to JPEG...`);
            processedFile = await convertHeicToJpeg(file);
            toast.success(`${file.name} converted successfully!`);
          } catch (error) {
            toast.error(
              `Failed to convert ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
            continue; // Skip this file
          }
        }

        // Create preview URL for images
        const preview = URL.createObjectURL(processedFile);
        newPhotos.push({
          file: processedFile,
          preview,
          name: processedFile.name,
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
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic", ".heif"],
      "application/json": [".json"],
    },
    disabled: processingBulk,
  });

  // Add photo to profile (upload to library and link to column)
  const addPhotoToProfile = async (photo: BulkPhotoPreview) => {
    if (column.mediaAssets.length >= maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed for ${column.type}`);
      return;
    }

    try {
      // Upload the file
      const formData = new FormData();
      formData.append("file", photo.file);
      formData.append("dataProvider", column.type);

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = (await response.json()) as { url: string };

      // Add photo to library and column
      await addPhoto.mutateAsync({
        columnId: column.id,
        url: result.url,
        name: photo.name,
      });

      // Remove the photo from bulk photos and clean up preview URL
      setBulkPhotos((prev) => {
        const newPhotos = prev.filter((p) => p !== photo);
        URL.revokeObjectURL(photo.preview);
        return newPhotos;
      });

      toast.success("Photo added to profile!");
    } catch (error) {
      toast.error("Failed to add photo to profile");
    }
  };

  // Add all photos to profile (respecting grid limits)
  const addAllPhotosToProfile = async () => {
    if (bulkPhotos.length === 0) return;

    const availableSlots = maxPhotos - column.mediaAssets.length;
    const photosToGrid = bulkPhotos.slice(0, availableSlots);
    const photosToLibraryOnly = bulkPhotos.slice(availableSlots);

    setProcessingBulk(true);

    try {
      // Add photos to grid first
      for (const photo of photosToGrid) {
        await addPhotoToProfile(photo);
      }

      // Add remaining photos to library only
      for (const photo of photosToLibraryOnly) {
        await addPhotoToLibraryOnly(photo);
      }

      toast.success(
        `Added ${photosToGrid.length} photos to profile${photosToLibraryOnly.length > 0 ? ` and ${photosToLibraryOnly.length} to library` : ""}!`,
      );
    } catch (error) {
      toast.error("Failed to add photos");
    } finally {
      setProcessingBulk(false);
    }
  };

  // Add photos to library only (no grid connection)
  const addPhotoToLibraryOnly = async (photo: BulkPhotoPreview) => {
    try {
      // Upload the file
      const formData = new FormData();
      formData.append("file", photo.file);
      formData.append("dataProvider", column.type);

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = (await response.json()) as { url: string };

      // Add photo to library only (using media library router)
      await addPhotosToLibrary.mutateAsync({
        photos: [
          {
            url: result.url,
            name: photo.name,
          },
        ],
      });

      // Remove the photo from bulk photos and clean up preview URL
      setBulkPhotos((prev) => {
        const newPhotos = prev.filter((p) => p !== photo);
        URL.revokeObjectURL(photo.preview);
        return newPhotos;
      });
    } catch (error) {
      throw error; // Re-throw to be handled by calling function
    }
  };

  // Add all photos to library only
  const addAllPhotosToLibrary = async () => {
    if (bulkPhotos.length === 0) return;

    setProcessingBulk(true);

    try {
      for (const photo of bulkPhotos) {
        await addPhotoToLibraryOnly(photo);
      }

      toast.success(`Added ${bulkPhotos.length} photos to library!`);
    } catch (error) {
      toast.error("Failed to add photos to library");
    } finally {
      setProcessingBulk(false);
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

  // Handle toggle change for hiding unused slots (only updates form state)
  const handleToggleHideUnusedSlots = (checked: boolean) => {
    form.setValue("hideUnusedPhotoSlots", checked);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (photoId: string, photoName: string) => {
    setDeleteConfirmation({ photoId, photoName });
  };

  const handleDeleteLibraryPhoto = () => {
    if (deleteConfirmation) {
      deletePhotoFromLibrary.mutate({ id: deleteConfirmation.photoId });
    }
  };

  // Calculate grid vs library distribution
  const availableSlots = maxPhotos - column.mediaAssets.length;
  const photosToGrid = Math.min(bulkPhotos.length, availableSlots);
  const photosToLibrary = Math.max(0, bulkPhotos.length - availableSlots);

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className={getAppColor(column.type)}>
            {getAppIcon(column.type)} {column.type}
          </Badge>
          <h2 className="text-lg font-semibold">Edit Column</h2>
        </div>
      </div>

      {/* Photo Management Section - Top */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photo Management
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {column.mediaAssets.length}/{maxPhotos} photos
            </p>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.watch("hideUnusedPhotoSlots")}
                onCheckedChange={handleToggleHideUnusedSlots}
                disabled={updateColumn.isPending}
              />
              <label className="text-sm text-muted-foreground">
                Hide empty slots
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={photoManagementTab}
            onValueChange={(value) =>
              setPhotoManagementTab(value as "grid" | "library" | "upload")
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Photo Grid
                {hasPhotos && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {column.mediaAssets.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                Library
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="mt-6 space-y-4">
              <div className="relative">
                {/* Library Search and Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search your photo library..."
                      value={librarySearch}
                      onChange={(e) => setLibrarySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={libraryFilter.rating?.toString() || "all"}
                      onValueChange={(value) =>
                        setLibraryFilter((prev) => ({
                          ...prev,
                          rating: value === "all" ? undefined : parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All ratings</SelectItem>
                        <SelectItem value="4">4+ stars</SelectItem>
                        <SelectItem value="3">3+ stars</SelectItem>
                        <SelectItem value="2">2+ stars</SelectItem>
                        <SelectItem value="1">1+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Library Photos Grid */}
                <ScrollArea className="h-96">
                  {filteredLibraryPhotos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Library className="mb-4 h-12 w-12 text-gray-400" />
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        No photos in your library yet
                      </h3>
                      <p className="mb-4 text-sm text-gray-500">
                        Upload some photos to your library first, then you can
                        easily add them to any profile variation.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setPhotoManagementTab("upload")}
                      >
                        Go to Upload
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 pr-4">
                      {filteredLibraryPhotos.map((photo) => {
                        const isInColumn = isPhotoInColumn(photo.id);
                        const isThisPhotoLoading = addingFromLibrary.has(
                          photo.id,
                        );
                        return (
                          <div
                            key={photo.id}
                            className={`group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                              isInColumn
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-blue-300"
                            } ${isThisPhotoLoading ? "opacity-50" : ""}`}
                            onClick={() => {
                              if (isThisPhotoLoading) return; // Prevent clicking while loading
                              if (isInColumn) {
                                void handleRemovePhotoFromColumn(photo.id);
                              } else {
                                void handleAddLibraryPhotoToColumn(photo.id);
                              }
                            }}
                          >
                            <img
                              src={photo.url}
                              alt={photo.name || "Library photo"}
                              className="h-full w-full object-cover"
                            />

                            {/* Loading spinner overlay for individual photo */}
                            {isThisPhotoLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20">
                              <div className="absolute right-2 top-2 flex gap-1">
                                {isInColumn ? (
                                  <div className="rounded-full bg-green-500 p-1">
                                    <div className="h-3 w-3 rounded-full bg-white" />
                                  </div>
                                ) : (
                                  <div className="rounded-full bg-white/80 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Plus className="h-3 w-3" />
                                  </div>
                                )}
                                <button
                                  className="rounded-full bg-red-500/80 p-1 opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteConfirmation(
                                      photo.id,
                                      photo.name || "Untitled",
                                    );
                                  }}
                                  disabled={deletePhotoFromLibrary.isPending}
                                >
                                  <Trash2 className="h-3 w-3 text-white" />
                                </button>
                              </div>
                              {photo.rating && photo.rating > 0 && (
                                <div className="absolute left-2 top-2">
                                  <div className="flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5">
                                    <Star
                                      className="h-3 w-3 text-yellow-400"
                                      fill="currentColor"
                                    />
                                    <span className="text-xs text-white">
                                      {photo.rating}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="truncate rounded bg-black/70 px-2 py-1 text-xs text-white">
                                {photo.name || "Untitled"}
                              </p>
                            </div>

                            {/* Delete confirmation overlay */}
                            {deleteConfirmation &&
                              photo.id === deleteConfirmation.photoId && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                  <div className="rounded-lg bg-white p-4 shadow-lg">
                                    <h4 className="mb-2 text-sm font-semibold">
                                      Delete photo?
                                    </h4>
                                    <p className="mb-4 text-xs text-gray-600">
                                      This will permanently delete &quot;
                                      {deleteConfirmation.photoName}&quot; from
                                      your library and remove it from all
                                      profiles.
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          setDeleteConfirmation(null)
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleDeleteLibraryPhoto}
                                        disabled={
                                          deletePhotoFromLibrary.isPending
                                        }
                                      >
                                        {deletePhotoFromLibrary.isPending
                                          ? "Deleting..."
                                          : "Delete"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {hasNextLibraryPage && (
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => fetchNextLibraryPage()}
                        disabled={isFetchingNextLibraryPage}
                      >
                        {isFetchingNextLibraryPage ? "Loading..." : "Load More"}
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="grid" className="mt-6 space-y-4">
              {!hasPhotos && (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <Library className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> Browse your{" "}
                      <button
                        onClick={() => setPhotoManagementTab("library")}
                        className="underline hover:no-underline"
                      >
                        photo library
                      </button>{" "}
                      to quickly add existing photos to this profile variation.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {Array.from(
                  {
                    length: form.watch("hideUnusedPhotoSlots")
                      ? Math.max(column.mediaAssets.length, 1)
                      : maxPhotos,
                  },
                  (_, index) => {
                    const photoConnection = column.mediaAssets[index];
                    const photo = photoConnection?.mediaAsset;
                    const isUploading = uploadingPhotos.has(index);
                    const nextSlot = getNextAvailableSlot();
                    const isNextSlotLoading =
                      index === nextSlot && addingFromLibrary.size > 0;
                    const isSelected =
                      reorderMode && selectedForReorder === photo?.id;
                    const isOtherPhotoInReorderMode =
                      reorderMode && photo && !isSelected;
                    const isRemoving =
                      photo && removingFromColumn.has(photo.id);
                    const isBeingSwapped =
                      photo &&
                      swappingPhotos &&
                      (swappingPhotos.photoId1 === photo.id ||
                        swappingPhotos.photoId2 === photo.id);

                    return (
                      <div
                        key={index}
                        className={`relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all ${
                          photo
                            ? `border-solid ${
                                isSelected
                                  ? "border-orange-500 ring-2 ring-orange-200"
                                  : isOtherPhotoInReorderMode
                                    ? "cursor-pointer border-blue-300 shadow-md hover:border-blue-500 hover:shadow-lg"
                                    : "border-gray-200"
                              }`
                            : "border-dashed border-gray-200"
                        } bg-gray-50 hover:border-gray-300`}
                        onClick={
                          photo &&
                          reorderMode &&
                          !swapPhotosMutation.isPending &&
                          !isRemoving &&
                          !isBeingSwapped
                            ? () => handleReorderClick(photo.id)
                            : undefined
                        }
                      >
                        {photo ? (
                          <>
                            <img
                              src={photo.url}
                              alt={`Photo ${index + 1}`}
                              className={`h-full w-full object-cover transition-all ${
                                isSelected
                                  ? "opacity-75"
                                  : isOtherPhotoInReorderMode
                                    ? "opacity-90"
                                    : isRemoving || isBeingSwapped
                                      ? "opacity-50"
                                      : ""
                              }`}
                            />

                            {/* Loading spinner overlay for swapping photos */}
                            {isBeingSwapped && (
                              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                                  <span className="text-xs font-medium text-blue-800">
                                    Swapping...
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Loading spinner overlay for removing photo */}
                            {isRemoving && !isBeingSwapped && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              </div>
                            )}

                            {/* Reorder mode overlay for clickable photos */}
                            {isOtherPhotoInReorderMode && !isBeingSwapped && (
                              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                                <div className="rounded-full bg-blue-500 p-2 shadow-lg">
                                  <div className="text-sm font-medium text-white">
                                    {swapPhotosMutation.isPending
                                      ? "Swapping..."
                                      : "Click to swap"}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action buttons - only show when not in reorder mode or for selected photo */}
                            {(!reorderMode || isSelected) &&
                              !isRemoving &&
                              !isBeingSwapped && (
                                <div className="group absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20">
                                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    {column.mediaAssets.length > 1 && (
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleReorderClick(photo.id);
                                        }}
                                        className={
                                          isSelected
                                            ? "bg-orange-500 text-white"
                                            : ""
                                        }
                                        disabled={isRemoving}
                                      >
                                        {isSelected ? "Cancel" : "Reorder"}
                                      </Button>
                                    )}
                                    {!reorderMode && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          void handleRemovePhotoFromColumn(
                                            photo.id,
                                          );
                                        }}
                                        disabled={removingFromColumn.has(
                                          photo.id,
                                        )}
                                      >
                                        {removingFromColumn.has(photo.id) ? (
                                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                          <X className="h-4 w-4" />
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}

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
                                  <Star
                                    className="mr-1 h-3 w-3"
                                    fill="currentColor"
                                  />
                                  {photo.rating}
                                </Badge>
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-500 transition-colors hover:bg-blue-50/50 hover:text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isNextSlotLoading) {
                                setPhotoManagementTab("library");
                              }
                            }}
                          >
                            {isNextSlotLoading ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                <span className="text-xs">Adding photo...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                {index === 0 ? (
                                  <Camera className="h-8 w-8" />
                                ) : (
                                  <Plus className="h-8 w-8" />
                                )}
                                <span className="text-xs">
                                  {index === 0
                                    ? "Main Photo"
                                    : `Photo ${index + 1}`}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Click to browse library
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>

              {/* Reorder mode info box - moved below grid */}
              {reorderMode && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {swapPhotosMutation.isPending ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                      ) : (
                        <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                      )}
                      <p className="text-sm text-orange-800">
                        <strong>Reorder mode:</strong>{" "}
                        {swapPhotosMutation.isPending
                          ? "Swapping photos..."
                          : "Click another photo to swap positions, or click the selected photo again to cancel"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={swapPhotosMutation.isPending}
                      onClick={() => {
                        setReorderMode(false);
                        setSelectedForReorder(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="mt-6 space-y-4">
              {/* Bulk Upload Drop Zone */}
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-all ${
                  isBulkDragActive
                    ? "cursor-pointer border-blue-500 bg-blue-50"
                    : "cursor-pointer border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                {...getBulkRootProps()}
              >
                <input {...getBulkInputProps()} />
                <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-4 text-lg font-semibold text-gray-900">
                  Drop folder or select multiple photos
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Upload multiple photos at once, or drop a folder containing
                  images and JSON files
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Supports: JPG, PNG, WebP, HEIC/HEIF images and JSON files with
                  photo URLs
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  HEIC files will be automatically converted to JPEG
                </p>
              </div>

              {/* Bulk Photos Preview */}
              {bulkPhotos.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">
                        Photos to Upload ({bulkPhotos.length})
                      </h4>
                      {photosToLibrary > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {photosToLibrary} will go to library only
                        </Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllBulkPhotos}
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {bulkPhotos.map((photo, idx) => (
                      <div key={idx} className="group relative">
                        <img
                          src={photo.preview}
                          alt={photo.name}
                          className="aspect-[3/4] w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/20">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => removeBulkPhoto(photo)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="absolute bottom-1 left-1 right-1">
                          <p className="truncate rounded bg-black/70 px-1 py-0.5 text-xs text-white">
                            {photo.name}
                          </p>
                        </div>
                        {/* Show grid/library indicator */}
                        <div className="absolute right-1 top-1">
                          {idx < photosToGrid ? (
                            <Badge className="bg-green-500 text-xs text-white">
                              Grid
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Library
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Centralized Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={addAllPhotosToProfile}
                      disabled={processingBulk || bulkPhotos.length === 0}
                      className="flex-1"
                    >
                      {processingBulk ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          Add to Profile
                          {photosToGrid > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-white/20 text-white"
                            >
                              {photosToGrid}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={addAllPhotosToLibrary}
                      disabled={processingBulk || bulkPhotos.length === 0}
                    >
                      Library Only
                    </Button>
                  </div>

                  {/* Helper text */}
                  {photosToLibrary > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {photosToGrid} photo{photosToGrid !== 1 ? "s" : ""} will
                      be added to this profile,
                      {photosToLibrary} will go to your library for use in other
                      profiles.
                    </p>
                  )}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Profile Information Section - Bottom */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
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

          {/* Bio Section - Moved to Top */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bio & Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Love exploring new places, trying different cuisines, and having great conversations..."
                        className="min-h-[120px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      This bio will be used for this specific app variation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Gender.MALE}>Male</SelectItem>
                          <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                          <SelectItem value={Gender.OTHER}>Other</SelectItem>
                          <SelectItem value={Gender.MORE}>Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="25"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heightCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="175"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>Height in centimeters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hometown"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hometown</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Where you grew up"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="United States"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Work & Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Work & Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Marketing Manager"
                          {...field}
                          value={field.value || ""}
                        />
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
                        <Input
                          placeholder="Acme Inc"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="University of California"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

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
