"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { DataProvider } from "@prisma/client";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";

type ComparisonColumnProps = {
  id: string;
  type: DataProvider;
  userId: string;
  onRemove: () => void;
  photos: string[];
  onUpdatePhotos: (photos: string[]) => void;
};

// Define max photos per app type
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

// Define app colors
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

// Define app header colors
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

export function ComparisonColumn({
  id,
  type,
  userId,
  onRemove,
  photos,
  onUpdatePhotos,
}: ComparisonColumnProps) {
  const [uploading, setUploading] = useState(false);

  const maxPhotos = MAX_PHOTOS[type] || 6;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0]!;
    setUploading(true);

    try {
      // Generate a unique filename
      const filename = `${Date.now()}-${file.name}`;

      // Upload to Vercel Blob directly from the client
      const blob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: "/api/file/upload",
        clientPayload: JSON.stringify({ appType: type }),
      });

      // Add the new photo URL to the list
      const updatedPhotos = [...photos, blob.url];
      onUpdatePhotos(updatedPhotos);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload image");
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onUpdatePhotos(updatedPhotos);
  };

  return (
    <Card.Container
      className={cn("w-72 flex-shrink-0 border-2", APP_COLORS[type])}
    >
      <CardHeader className={cn("py-3", APP_HEADER_COLORS[type])}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{type}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-white hover:bg-black/20 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {photos.map((photo, index) => (
            <div key={index} className="group relative">
              <Image
                src={photo || "/placeholder.svg"}
                alt={`Photo ${index + 1}`}
                width={240}
                height={320}
                className="h-auto w-full rounded-md object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removePhoto(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {photos.length < maxPhotos && (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4">
              <input
                type="file"
                id={`photo-upload-${id}`}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <label
                htmlFor={`photo-upload-${id}`}
                className="flex cursor-pointer flex-col items-center"
              >
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {uploading
                    ? "Uploading..."
                    : `Add photo (${photos.length}/${maxPhotos})`}
                </span>
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card.Container>
  );
}
