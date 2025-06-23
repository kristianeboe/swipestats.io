"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { Progress } from "@/app/_components/ui/progress";
import { api } from "@/trpc/react";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  FolderIcon,
  X,
  Star,
  Tag,
  Upload,
  Camera,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Types for File System API (same as before)
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

type PhotoPreview = {
  file: File;
  preview: string;
  name: string;
  description: string;
  location: string;
  assetType: string;
  tags: string[];
  rating: number;
  originalSize: number;
  compressedSize?: number;
  isProcessing?: boolean;
};

const ASSET_TYPES = [
  "main",
  "full_body",
  "headshot",
  "activity",
  "travel",
  "group",
  "formal",
  "casual",
  "outdoor",
  "indoor",
  "professional",
  "hobby",
];

const COMMON_TAGS = [
  "smile",
  "formal",
  "casual",
  "outdoor",
  "indoor",
  "professional",
  "travel",
  "beach",
  "city",
  "nature",
  "fitness",
  "hobby",
  "friends",
  "pet",
  "car",
  "food",
  "selfie",
  "group",
  "event",
  "party",
];

// Supported image formats
const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

// Video formats to filter out
const VIDEO_TYPES = [
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/wmv",
  "video/quicktime",
];

export default function MediaLibraryUploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [processingFiles, setProcessingFiles] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentlyUploading, setCurrentlyUploading] = useState<string>("");
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);

  const addPhotos = api.mediaLibrary.addPhotos.useMutation({
    onSuccess: () => {
      toast.success("Photos uploaded successfully!");
      setUploadComplete(true);
      setTimeout(() => {
        router.push("/app/media-library");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload photos");
      setIsUploading(false);
    },
  });

  const isImageFile = (file: File): boolean => {
    return !!(
      SUPPORTED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
      /\.(jpg|jpeg|png|webp|heic|heif)$/.exec(file.name.toLowerCase())
    );
  };

  const isVideoFile = (file: File): boolean => {
    return !!(
      VIDEO_TYPES.includes(file.type.toLowerCase()) ||
      /\.(mp4|mov|avi|wmv)$/.exec(file.name.toLowerCase())
    );
  };

  // Client-side image compression using Canvas API
  const compressImage = (
    file: File,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original
            }
          },
          "image/jpeg",
          quality,
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback to original
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const processFiles = async (files: File[]) => {
    setProcessingFiles(true);
    const newPhotos: PhotoPreview[] = [];
    const rejected: string[] = [];

    for (const file of files) {
      // Filter out videos
      if (isVideoFile(file)) {
        rejected.push(`${file.name} (video files not supported yet)`);
        continue;
      }

      // Only process images
      if (isImageFile(file)) {
        try {
          const preview = URL.createObjectURL(file);

          // Add to photos array first
          const photoPreview: PhotoPreview = {
            file,
            preview,
            name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
            description: "",
            location: "",
            assetType: "",
            tags: [],
            rating: 0,
            originalSize: file.size,
            isProcessing: true,
          };

          newPhotos.push(photoPreview);

          // Compress large files in background
          if (file.size > 5 * 1024 * 1024) {
            // > 5MB
            compressImage(file)
              .then((compressedFile) => {
                setPhotos((prev) =>
                  prev.map((p) =>
                    p.preview === preview
                      ? {
                          ...p,
                          file: compressedFile,
                          compressedSize: compressedFile.size,
                          isProcessing: false,
                        }
                      : p,
                  ),
                );
              })
              .catch((error) => {
                console.error("Compression error:", error);
                toast.error("Failed to compress photo");
              });
          } else {
            photoPreview.isProcessing = false;
          }
        } catch (error) {
          rejected.push(`${file.name} (processing failed)`);
        }
      } else {
        rejected.push(`${file.name} (unsupported format)`);
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setRejectedFiles(rejected);
    setProcessingFiles(false);

    if (rejected.length > 0) {
      toast.warning(`${rejected.length} files were skipped`);
    }
  };

  // Helper function to read directory contents
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
                  readEntries();
                }
              });
            } else {
              pendingFiles--;
              if (pendingFiles === 0) {
                readEntries();
              }
            }
          }
        });
      };

      readEntries();
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      void processFiles(acceptedFiles);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic", ".heif"],
    },
    disabled: isUploading || uploadComplete,
  });

  const updatePhoto = (index: number, updates: Partial<PhotoPreview>) => {
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, ...updates } : photo)),
    );
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const photo = prev[index];
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const addTag = (photoIndex: number, tag: string) => {
    if (!tag.trim()) return;

    setPhotos((prev) =>
      prev.map((photo, i) =>
        i === photoIndex
          ? {
              ...photo,
              tags: [...new Set([...photo.tags, tag.trim().toLowerCase()])],
            }
          : photo,
      ),
    );
  };

  const removeTag = (photoIndex: number, tagToRemove: string) => {
    setPhotos((prev) =>
      prev.map((photo, i) =>
        i === photoIndex
          ? {
              ...photo,
              tags: photo.tags.filter((tag) => tag !== tagToRemove),
            }
          : photo,
      ),
    );
  };

  const handleUpload = async () => {
    if (photos.length === 0) {
      toast.error("Please add some photos first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload photos to storage first (in batches for better performance)
      const batchSize = 3; // Upload 3 at a time
      const uploadedPhotos = [];

      for (let i = 0; i < photos.length; i += batchSize) {
        const batch = photos.slice(i, i + batchSize);

        const batchPromises = batch.map(async (photo, batchIndex) => {
          const actualIndex = i + batchIndex;
          setCurrentlyUploading(`Uploading ${photo.name}...`);

          const formData = new FormData();
          formData.append("file", photo.file);
          // No dataProvider needed for media library uploads

          const response = await fetch("/api/upload/photo", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload ${photo.name}`);
          }

          const result = (await response.json()) as { url: string };

          setUploadProgress(((actualIndex + 1) / photos.length) * 100);

          return {
            url: result.url,
            name: photo.name,
            description: photo.description || undefined,
            location: photo.location || undefined,
            assetType: photo.assetType || undefined,
            tags: photo.tags,
            rating: photo.rating,
          };
        });

        const batchResults = await Promise.all(batchPromises);
        uploadedPhotos.push(...batchResults);

        // Small delay between batches to avoid overwhelming the server
        if (i + batchSize < photos.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      setCurrentlyUploading("Saving to database...");

      // Add to database
      await addPhotos.mutateAsync({ photos: uploadedPhotos });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photos");
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentlyUploading("");
    }
  };

  const clearAll = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    setPhotos([]);
    setRejectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const totalOriginalSize = photos.reduce(
    (sum, photo) => sum + photo.originalSize,
    0,
  );
  const totalCompressedSize = photos.reduce(
    (sum, photo) => sum + (photo.compressedSize || photo.originalSize),
    0,
  );
  const compressionSavings = totalOriginalSize - totalCompressedSize;

  if (uploadComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-xl font-semibold">Upload Complete!</h2>
            <p className="text-muted-foreground mb-4 text-center">
              Your photos have been added to your library
            </p>
            {compressionSavings > 0 && (
              <p className="mb-4 text-sm text-green-600">
                Saved {formatFileSize(compressionSavings)} through compression!
              </p>
            )}
            <Button asChild>
              <Link href="/app/media-library">View Library</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Upload Photos</h1>
          <p className="text-muted-foreground">
            Add photos to your library with tags and ratings
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Select Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-all ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <FolderIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Drop photos or folders here
            </h3>
            <p className="mb-4 text-gray-500">
              Supports JPG, PNG, WebP, HEIC formats. Large files will be
              automatically compressed.
            </p>
            <div className="mb-4 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">
                Auto-compression enabled
              </span>
            </div>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Select Files
            </Button>
          </div>

          {processingFiles && (
            <div className="flex items-center justify-center py-4">
              <div className="mr-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              <span className="text-sm text-gray-600">
                Processing photos...
              </span>
            </div>
          )}

          {/* Rejected Files Warning */}
          {rejectedFiles.length > 0 && (
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {rejectedFiles.length} files were skipped:
                </span>
              </div>
              <ul className="space-y-1 text-xs text-yellow-700">
                {rejectedFiles.slice(0, 5).map((file, idx) => (
                  <li key={idx}>• {file}</li>
                ))}
                {rejectedFiles.length > 5 && (
                  <li>• ... and {rejectedFiles.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Upload Progress</span>
                <span className="text-muted-foreground text-sm">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-muted-foreground text-sm">
                {currentlyUploading}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Photos to Upload ({photos.length})</CardTitle>
                {totalOriginalSize > 0 && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    Total size: {formatFileSize(totalOriginalSize)}
                    {compressionSavings > 0 && (
                      <span className="ml-2 text-green-600">
                        → {formatFileSize(totalCompressedSize)} (saved{" "}
                        {formatFileSize(compressionSavings)})
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || photos.some((p) => p.isProcessing)}
                >
                  {isUploading ? "Uploading..." : "Upload Photos"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo, index) => (
                <PhotoEditCard
                  key={index}
                  photo={photo}
                  index={index}
                  onUpdate={(updates) => updatePhoto(index, updates)}
                  onRemove={() => removePhoto(index)}
                  onAddTag={(tag) => addTag(index, tag)}
                  onRemoveTag={(tag) => removeTag(index, tag)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PhotoEditCard({
  photo,
  index,
  onUpdate,
  onRemove,
  onAddTag,
  onRemoveTag,
}: {
  photo: PhotoPreview;
  index: number;
  onUpdate: (updates: Partial<PhotoPreview>) => void;
  onRemove: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Card className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
        <img
          src={photo.preview}
          alt={photo.name}
          className="h-full w-full object-cover"
        />

        {/* Processing indicator */}
        {photo.isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="text-xs">Compressing...</span>
            </div>
          </div>
        )}

        <Button
          variant="destructive"
          size="sm"
          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* File size info */}
        <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          {formatFileSize(photo.compressedSize || photo.originalSize)}
          {photo.compressedSize &&
            photo.compressedSize < photo.originalSize && (
              <span className="ml-1 text-green-300">↓</span>
            )}
        </div>
      </div>

      <CardContent className="space-y-4 p-4">
        {/* Name */}
        <Input
          placeholder="Photo name"
          value={photo.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
        />

        {/* Description */}
        <Textarea
          placeholder="Description (optional)"
          value={photo.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={2}
        />

        {/* Location & Photo Type */}
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Location"
            value={photo.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
          />
          <Select
            value={photo.assetType}
            onValueChange={(value) => onUpdate({ assetType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Photo type" />
            </SelectTrigger>
            <SelectContent>
              {ASSET_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rating:</span>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onUpdate({ rating })}
              className={`p-1 ${
                rating <= photo.rating
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            >
              <Star className="h-4 w-4" fill="currentColor" />
            </button>
          ))}
          <span className="text-muted-foreground ml-2 text-sm">
            {photo.rating}/5
          </span>
        </div>

        {/* Tags */}
        <div>
          <div className="mb-2 flex flex-wrap gap-1">
            {photo.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              className="text-xs"
            />
            <Button size="sm" onClick={handleAddTag}>
              <Tag className="h-3 w-3" />
            </Button>
          </div>

          {/* Common tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {COMMON_TAGS.filter((tag) => !photo.tags.includes(tag))
              .slice(0, 6)
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => onAddTag(tag)}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  +{tag}
                </button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
