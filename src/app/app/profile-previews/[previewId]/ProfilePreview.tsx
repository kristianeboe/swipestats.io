"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";
import { ResponsiveDialog } from "@/app/_components/ui/compound/ResponsiveDialog";
import {
  Plus,
  Settings,
  Edit,
  Eye,
  Heart,
  X,
  MessageCircle,
  Star,
  Camera,
  Sparkles,
} from "lucide-react";
import type { DataProvider } from "@prisma/client";
import { type RouterOutputs } from "@/trpc/react";

// Use RouterOutputs for exact type from tRPC queries
export type PreviewColumnWithRelations =
  RouterOutputs["profilePreviews"]["getById"]["columns"][number];
type ProfilePreviewData = RouterOutputs["profilePreviews"]["getById"];

interface ProfilePreviewProps {
  preview: ProfilePreviewData;
  onEditColumn?: (columnId: string) => void;
  onAddColumn?: () => void;
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
    case "RAYA":
      return "💎";
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

export const getMaxPhotosForProvider = (provider: DataProvider): number => {
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
    case "RAYA":
      return 16;
    default:
      return 6;
  }
};

// Component for comparison mode (main view)
function ComparisonView({
  preview,
  onEditColumn,
  onAddColumn,
}: ProfilePreviewProps) {
  const [selectedColumn, setSelectedColumn] =
    useState<PreviewColumnWithRelations | null>(null);

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          App Variations ({preview.columns.length})
        </h2>
        <Button
          onClick={onAddColumn}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add App Variation
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex w-max items-start gap-6 pb-4">
          {preview.columns.map((column) => (
            <Card
              key={column.id}
              className="w-96 shrink-0 overflow-hidden transition-shadow hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {column.label || `${column.type} Profile`}
                    </h3>
                    <Badge className={getAppColor(column.type)}>
                      {getAppIcon(column.type)} {column.type}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedColumn(column)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditColumn?.(column.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Main Photo */}
                {column.mediaAssets[0] ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                    <img
                      src={
                        column.mediaAssets[0].mediaAsset.url ||
                        getPlaceholderImage(0)
                      }
                      alt="Main photo"
                      className="h-full w-full object-cover"
                    />

                    {column.mediaAssets[0].mediaAsset.rating &&
                      column.mediaAssets[0].mediaAsset.rating > 0 && (
                        <div className="absolute right-2 top-2">
                          <div className="flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5">
                            <Star
                              className="h-3 w-3 text-yellow-400"
                              fill="currentColor"
                            />
                            <span className="text-xs text-white">
                              {column.mediaAssets[0].mediaAsset.rating}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div
                    className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 transition-colors hover:from-blue-50 hover:to-purple-50"
                    onClick={() => onEditColumn?.(column.id)}
                  >
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      <div className="space-y-2 text-center">
                        <Camera className="mx-auto h-6 w-6 text-gray-400 transition-colors group-hover:text-purple-500" />
                        <div>
                          <p className="font-medium">Main Photo</p>
                          <p className="text-xs text-gray-400 group-hover:text-purple-400">
                            Click to add
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Info */}
                <div className="min-w-0 space-y-1">
                  <h4 className="break-words text-lg font-semibold">
                    {column.firstName || preview.firstName || "Your Name"},{" "}
                    {column.age || preview.age || "??"}
                  </h4>
                  <p className="break-words text-sm text-muted-foreground">
                    {column.city || preview.city}
                  </p>
                  {(column.jobTitle || preview.jobTitle) && (
                    <p className="break-words text-sm leading-relaxed text-muted-foreground">
                      {column.jobTitle || preview.jobTitle}
                      {(column.company || preview.company) &&
                        ` at ${column.company || preview.company}`}
                    </p>
                  )}
                  {(column.school || preview.school) && (
                    <p className="break-words text-sm leading-relaxed text-muted-foreground">
                      {column.school || preview.school}
                    </p>
                  )}
                </div>

                {/* Bio */}
                {(column.bio || preview.defaultBio) && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="break-words text-sm leading-relaxed text-muted-foreground">
                      {column.bio || preview.defaultBio}
                    </p>
                  </div>
                )}

                {/* Remaining Photos */}
                {column.mediaAssets.length > 1 && (
                  <div className="space-y-2">
                    {column.mediaAssets
                      .slice(1)
                      .map((photoConnection, index) => (
                        <div
                          key={photoConnection.mediaAsset.id}
                          className="relative aspect-[4/3] overflow-hidden rounded-md border border-gray-200 bg-gray-100"
                        >
                          <img
                            src={
                              photoConnection.mediaAsset.url ||
                              getPlaceholderImage(index + 1)
                            }
                            alt={`Photo ${index + 2}`}
                            className="h-full w-full object-cover"
                          />
                          {photoConnection.mediaAsset.rating &&
                            photoConnection.mediaAsset.rating > 0 && (
                              <div className="absolute right-2 top-2">
                                <div className="flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5">
                                  <Star
                                    className="h-3 w-3 text-yellow-400"
                                    fill="currentColor"
                                  />
                                  <span className="text-xs text-white">
                                    {photoConnection.mediaAsset.rating}
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
                )}

                {/* Empty Photo Slots - only show a few if user wants to add more */}
                {!column.hideUnusedPhotoSlots &&
                  column.mediaAssets.length <
                    getMaxPhotosForProvider(column.type) && (
                    <div className="space-y-2">
                      {Array.from(
                        {
                          length: Math.min(
                            3,
                            getMaxPhotosForProvider(column.type) -
                              column.mediaAssets.length,
                          ),
                        },
                        (_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 transition-colors hover:from-blue-50 hover:to-purple-50"
                            onClick={() => onEditColumn?.(column.id)}
                          >
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                              <div className="space-y-2 text-center">
                                <Camera className="mx-auto h-6 w-6 text-gray-400 transition-colors group-hover:text-purple-500" />
                                <div>
                                  <p className="font-medium">
                                    Photo{" "}
                                    {column.mediaAssets.length + index + 1}
                                  </p>
                                  <p className="text-xs text-gray-400 group-hover:text-purple-400">
                                    Click to add
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                {/* Stats */}
                <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span>
                    {column.mediaAssets.length}/
                    {getMaxPhotosForProvider(column.type)} photos
                  </span>
                  {column.prompts.length > 0 && (
                    <span>
                      {column.prompts.length} prompt
                      {column.prompts.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Full Provider Preview Dialog */}
      {selectedColumn && (
        <ResponsiveDialog
          open={!!selectedColumn}
          onOpenChange={(open) => !open && setSelectedColumn(null)}
          title={`${selectedColumn.label || selectedColumn.type} Preview`}
          className="max-w-md"
        >
          <FullProviderPreview
            column={selectedColumn}
            preview={preview}
            onClose={() => setSelectedColumn(null)}
          />
        </ResponsiveDialog>
      )}
    </div>
  );
}

// Component for full provider preview (in dialog)
function FullProviderPreview({
  column,
  preview,
  onClose,
}: {
  column: PreviewColumnWithRelations;
  preview: ProfilePreviewData;
  onClose: () => void;
}) {
  const displayName = column.firstName || preview.firstName || "Your Name";
  const displayAge = column.age || preview.age || 25;
  const displayCity = column.city || preview.city || "City";
  const displayJobTitle = column.jobTitle || preview.jobTitle;
  const displayCompany = column.company || preview.company;
  const displayBio = column.bio || preview.defaultBio;

  // Provider-specific styling
  const providerStyles = {
    TINDER: {
      cardClass: "bg-gradient-to-b from-red-500 to-pink-600 text-white",
      actionColors: {
        pass: "text-gray-400 hover:text-gray-300",
        like: "text-green-400 hover:text-green-300",
        superLike: "text-blue-400 hover:text-blue-300",
      },
    },
    HINGE: {
      cardClass: "bg-white border-2 border-purple-200",
      actionColors: {
        pass: "text-gray-500 hover:text-gray-400",
        like: "text-purple-500 hover:text-purple-400",
        comment: "text-blue-500 hover:text-blue-400",
      },
    },
    BUMBLE: {
      cardClass: "bg-gradient-to-b from-yellow-400 to-yellow-500 text-black",
      actionColors: {
        pass: "text-gray-600 hover:text-gray-500",
        like: "text-green-600 hover:text-green-500",
      },
    },
  } as const;

  const currentStyle =
    providerStyles[column.type as keyof typeof providerStyles] ||
    providerStyles.TINDER;

  return (
    <div className="space-y-4">
      {/* Main Photo */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <img
          src={column.mediaAssets[0]?.mediaAsset.url || getPlaceholderImage(0)}
          alt="Main profile photo"
          className="h-full w-full object-cover"
        />

        {/* Profile Info Overlay (Tinder style) */}
        {column.type === "TINDER" && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <h2 className="text-xl font-bold">
              {displayName}, {displayAge}
            </h2>
            <p className="break-words text-sm opacity-90">{displayCity}</p>
            {displayJobTitle && (
              <p className="break-words text-sm opacity-75">
                {displayJobTitle}
                {displayCompany && ` at ${displayCompany}`}
              </p>
            )}
          </div>
        )}

        {/* Profile Info Below (Hinge/Bumble style) */}
        {column.type !== "TINDER" && (
          <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/90 p-3 backdrop-blur-sm">
            <h2 className="font-bold text-gray-900">
              {displayName}, {displayAge}
            </h2>
            <p className="break-words text-sm text-gray-600">{displayCity}</p>
            {displayJobTitle && (
              <p className="break-words text-sm text-gray-600">
                {displayJobTitle}
                {displayCompany && ` at ${displayCompany}`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bio */}
      {displayBio && (
        <div className="rounded-lg border p-3">
          <p className="break-words text-sm leading-relaxed">{displayBio}</p>
        </div>
      )}

      {/* Prompts (Hinge style) */}
      {column.prompts.length > 0 && (
        <div className="space-y-3">
          {column.prompts.slice(0, 3).map((prompt) => (
            <div key={prompt.id} className="rounded-lg border p-3">
              <p className="mb-1 break-words text-sm font-medium text-muted-foreground">
                {prompt.question}
              </p>
              <p className="break-words text-sm">{prompt.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Additional Photos */}
      {column.mediaAssets.length > 1 && (
        <div className="grid grid-cols-2 gap-2">
          {column.mediaAssets.slice(1, 5).map((photoConnection, index) => (
            <div
              key={photoConnection.mediaAsset.id}
              className="aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={
                  photoConnection.mediaAsset.url ||
                  getPlaceholderImage(index + 1)
                }
                alt={`Photo ${index + 2}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Button variant="outline" size="sm" className="h-12 w-12 rounded-full">
          <X className={`h-5 w-5 ${currentStyle.actionColors.pass}`} />
        </Button>

        {column.type === "TINDER" && (
          <Button
            variant="outline"
            size="sm"
            className="h-12 w-12 rounded-full"
          >
            <Star
              className={`h-5 w-5 ${
                "superLike" in currentStyle.actionColors
                  ? currentStyle.actionColors.superLike
                  : "text-blue-400 hover:text-blue-300"
              }`}
            />
          </Button>
        )}

        <Button variant="outline" size="sm" className="h-12 w-12 rounded-full">
          <Heart className={`h-5 w-5 ${currentStyle.actionColors.like}`} />
        </Button>

        {column.type === "HINGE" && (
          <Button
            variant="outline"
            size="sm"
            className="h-12 w-12 rounded-full"
          >
            <MessageCircle
              className={`h-5 w-5 ${
                "comment" in currentStyle.actionColors
                  ? currentStyle.actionColors.comment
                  : "text-blue-500 hover:text-blue-400"
              }`}
            />
          </Button>
        )}
      </div>
    </div>
  );
}

export function ProfilePreview({
  preview,
  onEditColumn,
  onAddColumn,
}: ProfilePreviewProps) {
  return (
    <div className="space-y-6">
      <ComparisonView
        preview={preview}
        onEditColumn={onEditColumn}
        onAddColumn={onAddColumn}
      />
    </div>
  );
}
