"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { heicTo } from "heic-to";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Badge } from "@/app/_components/ui/badge";
import { Progress } from "@/app/_components/ui/progress";
import { api } from "@/trpc/react";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  FolderIcon,
  X,
  Upload,
  Camera,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";

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
  originalFileName: string; // Keep original for fingerprinting
  displayName: string; // Editable display name
  originalSize: number;
  compressedSize?: number;
  isProcessing?: boolean;
  isDuplicate?: boolean;
};

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

// LocalStorage key for uploaded images
const UPLOADED_IMAGES_KEY = "swipestats_uploaded_images";

// Duplicate detection utilities
const createFingerprint = (
  originalFileName: string,
  fileSize: number,
): string => {
  return `${originalFileName}_${fileSize}`;
};

const getUploadedImages = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(UPLOADED_IMAGES_KEY);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveUploadedImage = (fingerprint: string) => {
  if (typeof window === "undefined") return;
  try {
    const existing = getUploadedImages();
    existing[fingerprint] = new Date().toISOString().split("T")[0]!;
    localStorage.setItem(UPLOADED_IMAGES_KEY, JSON.stringify(existing));
  } catch (error) {
    console.warn("Failed to save uploaded image to localStorage:", error);
  }
};

export default function MediaLibraryUploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [processingFiles, setProcessingFiles] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentlyUploading, setCurrentlyUploading] = useState<string>("");
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);

  // Duplicate detection state
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [duplicateCount, setDuplicateCount] = useState(0);

  const addPhotos = api.mediaLibrary.addPhotos.useMutation({
    onSuccess: (data) => {
      // Save fingerprints of successfully uploaded photos
      photos.forEach((photo) => {
        if (!photo.isDuplicate) {
          const fingerprint = createFingerprint(
            photo.originalFileName,
            photo.originalSize,
          );
          saveUploadedImage(fingerprint);
        }
      });

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

  const checkForDuplicates = (
    files: File[],
  ): { duplicates: File[]; unique: File[] } => {
    const uploadedImages = getUploadedImages();
    const duplicates: File[] = [];
    const unique: File[] = [];

    files.forEach((file) => {
      const fingerprint = createFingerprint(file.name, file.size);
      if (uploadedImages[fingerprint]) {
        duplicates.push(file);
      } else {
        unique.push(file);
      }
    });

    return { duplicates, unique };
  };

  const processFiles = async (files: File[], filterDuplicates = false) => {
    setProcessingFiles(true);
    const newPhotos: PhotoPreview[] = [];
    const rejected: string[] = [];

    // Check for duplicates if not already filtered
    let filesToProcess = files;
    if (!filterDuplicates) {
      const { duplicates, unique } = checkForDuplicates(files);
      if (duplicates.length > 0) {
        setDuplicateCount(duplicates.length);
        setPendingFiles(files);
        setShowDuplicateDialog(true);
        setProcessingFiles(false);
        return;
      }
      filesToProcess = unique;
    }

    for (const file of filesToProcess) {
      // Filter out videos
      if (isVideoFile(file)) {
        rejected.push(`${file.name} (video files not supported yet)`);
        continue;
      }

      // Only process images
      if (isImageFile(file)) {
        try {
          let processedFile = file;

          // Convert HEIC files to JPEG
          if (isHeicFile(file)) {
            try {
              toast.info(`Converting ${file.name} from HEIC to JPEG...`);
              processedFile = await convertHeicToJpeg(file);
              toast.success(`${file.name} converted successfully!`);
            } catch (error) {
              rejected.push(
                `${file.name} (HEIC conversion failed: ${error instanceof Error ? error.message : "Unknown error"})`,
              );
              continue; // Skip this file
            }
          }

          const preview = URL.createObjectURL(processedFile);
          const fingerprint = createFingerprint(
            processedFile.name,
            processedFile.size,
          );
          const uploadedImages = getUploadedImages();

          // Add to photos array first
          const photoPreview: PhotoPreview = {
            file: processedFile,
            preview,
            originalFileName: processedFile.name,
            displayName: processedFile.name.replace(/\.[^/.]+$/, ""), // remove extension for display
            originalSize: processedFile.size,
            isProcessing: true,
            isDuplicate: !!uploadedImages[fingerprint],
          };

          newPhotos.push(photoPreview);

          // Compress large files in background
          if (processedFile.size > 5 * 1024 * 1024) {
            // > 5MB
            compressImage(processedFile)
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
          console.error("Processing error:", error);
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

  const handleDuplicateDecision = (filterOut: boolean) => {
    setShowDuplicateDialog(false);

    if (filterOut) {
      const { unique } = checkForDuplicates(pendingFiles);
      void processFiles(unique, true);
      if (unique.length === 0) {
        toast.info("All files were duplicates and have been filtered out");
      } else {
        toast.info(
          `Filtered out ${duplicateCount} duplicates, processing ${unique.length} new files`,
        );
      }
    } else {
      void processFiles(pendingFiles, true);
    }

    setPendingFiles([]);
    setDuplicateCount(0);
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
          setCurrentlyUploading(`Uploading ${photo.displayName}...`);

          const formData = new FormData();
          formData.append("file", photo.file);

          const response = await fetch("/api/upload/photo", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload ${photo.displayName}`);
          }

          const result = (await response.json()) as { url: string };

          setUploadProgress(((actualIndex + 1) / photos.length) * 100);

          return {
            url: result.url,
            name: photo.displayName,
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
            <p className="mb-4 text-center text-muted-foreground">
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
      {/* Duplicate Detection Dialog */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-orange-500" />
              Duplicate Photos Detected
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Found{" "}
              <span className="font-semibold text-orange-600">
                {duplicateCount}
              </span>{" "}
              photos that appear to be duplicates based on filename and file
              size.
            </p>
            <p className="mt-2 text-muted-foreground">
              What would you like to do?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => handleDuplicateDecision(true)}
            >
              Filter Out Duplicates
            </Button>
            <Button onClick={() => handleDuplicateDecision(false)}>
              Upload Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            Preview and upload photos to your library
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
              Supports JPG, PNG, WebP, HEIC/HEIF formats. Large files will be
              automatically compressed.
            </p>
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                HEIC → JPEG conversion
              </div>
            </div>
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
                <span className="text-sm text-muted-foreground">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
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
                  <p className="mt-1 text-sm text-muted-foreground">
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {photos.map((photo, index) => (
                <PhotoPreviewCard
                  key={index}
                  photo={photo}
                  index={index}
                  onUpdate={(updates) => updatePhoto(index, updates)}
                  onRemove={() => removePhoto(index)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PhotoPreviewCard({
  photo,
  index,
  onUpdate,
  onRemove,
}: {
  photo: PhotoPreview;
  index: number;
  onUpdate: (updates: Partial<PhotoPreview>) => void;
  onRemove: () => void;
}) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Card
      className={`group relative ${photo.isDuplicate ? "bg-orange-50/50 ring-2 ring-orange-200" : ""}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
        <img
          src={photo.preview}
          alt={photo.displayName}
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

        {/* Duplicate indicator */}
        {photo.isDuplicate && (
          <div className="absolute left-2 top-2">
            <Badge
              variant="secondary"
              className="border-orange-200 bg-orange-100 text-orange-800"
            >
              <Copy className="mr-1 h-3 w-3" />
              Duplicate
            </Badge>
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

      <CardContent className="space-y-3 p-4">
        {/* Editable display name */}
        <div>
          <Input
            placeholder="Photo name"
            value={photo.displayName}
            onChange={(e) => onUpdate({ displayName: e.target.value })}
            className={
              photo.isDuplicate
                ? "border-orange-200 focus:border-orange-400"
                : ""
            }
          />
          {photo.originalFileName !== photo.displayName && (
            <p className="mt-1 text-xs text-muted-foreground">
              Original: {photo.originalFileName}
            </p>
          )}
        </div>

        {/* Duplicate warning */}
        {photo.isDuplicate && (
          <div className="rounded-md border border-orange-200 bg-orange-100 p-2">
            <p className="text-xs text-orange-800">
              This file appears to be a duplicate based on filename and size.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
