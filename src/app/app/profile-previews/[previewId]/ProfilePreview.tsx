"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { ResponsiveDialog } from "@/app/_components/ui/compound/ResponsiveDialog";
import {
  Plus,
  Settings,
  Eye,
  Heart,
  X,
  MessageCircle,
  Star,
} from "lucide-react";
import type {
  DataProvider,
  ProfilePreview,
  PreviewColumn,
  MediaAsset,
  PreviewPrompt,
} from "@prisma/client";

// Extended types with relations
export type PreviewColumnWithRelations = PreviewColumn & {
  mediaAssets: MediaAsset[];
  prompts: PreviewPrompt[];
};

type ProfilePreviewData = ProfilePreview & {
  columns: PreviewColumnWithRelations[];
};

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

// Component for comparison mode (main view)
function ComparisonView({
  preview,
  onEditColumn,
  onAddColumn,
}: ProfilePreviewProps) {
  const [selectedColumn, setSelectedColumn] =
    useState<PreviewColumnWithRelations | null>(null);

  return (
    <div>
      <ScrollArea className="w-full">
        <div className="flex gap-6 pb-4" style={{ width: "max-content" }}>
          {preview.columns.map((column) => (
            <Card key={column.id} className="w-80 shrink-0 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className={getAppColor(column.type)}>
                    {getAppIcon(column.type)} {column.type}
                  </Badge>
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
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={column.mediaAssets[0]?.url} />
                    <AvatarFallback>
                      {((column.jobTitle || preview.jobTitle) ?? "User")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      Profile, {column.age || preview.age || "??"}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {column.city || preview.city}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {column.jobTitle || preview.jobTitle}{" "}
                      {(column.company || preview.company) &&
                        `at ${column.company || preview.company}`}
                    </p>
                  </div>
                </div>

                {/* Photos Preview - Vertical Layout */}
                <div className="space-y-2">
                  {Array.from(
                    {
                      length: Math.min(getMaxPhotosForProvider(column.type), 6),
                    },
                    (_, index) => {
                      const photo = column.mediaAssets[index];
                      return (
                        <div
                          key={index}
                          className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100"
                        >
                          {photo ? (
                            <img
                              src={photo.url || getPlaceholderImage(index)}
                              alt={`Photo ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-muted-foreground flex h-full w-full items-center justify-center bg-gray-50 text-sm">
                              {index === 0
                                ? "Main Photo"
                                : `Photo ${index + 1}`}
                            </div>
                          )}
                          {index === 0 && photo && (
                            <div className="absolute left-2 top-2">
                              <span className="rounded bg-black/70 px-2 py-1 text-xs text-white">
                                Main
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>

                {/* Bio Preview */}
                {(column.bio || preview.defaultBio) && (
                  <div>
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {column.bio || preview.defaultBio}
                    </p>
                  </div>
                )}

                {/* Prompts Count */}
                {column.prompts.length > 0 && (
                  <div className="text-muted-foreground text-xs">
                    {column.prompts.length} prompt
                    {column.prompts.length !== 1 ? "s" : ""}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add Column Card */}
          <Card className="flex w-80 shrink-0 items-center justify-center border-2 border-dashed">
            <Button
              variant="outline"
              className="flex-col gap-2"
              onClick={onAddColumn}
            >
              <Plus className="h-8 w-8" />
              Add App Variation
            </Button>
          </Card>
        </div>
      </ScrollArea>

      {/* Full Provider Preview Dialog */}
      {selectedColumn && (
        <ResponsiveDialog
          open={!!selectedColumn}
          onOpenChange={(open) => !open && setSelectedColumn(null)}
          title={`${selectedColumn.type} Preview`}
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
  const displayName = "Profile"; // Could be extracted from user or made configurable
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
          src={column.mediaAssets[0]?.url || getPlaceholderImage(0)}
          alt="Main profile photo"
          className="h-full w-full object-cover"
        />

        {/* Profile Info Overlay (Tinder style) */}
        {column.type === "TINDER" && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <h2 className="text-xl font-bold">
              {displayName}, {displayAge}
            </h2>
            <p className="text-sm opacity-90">{displayCity}</p>
            {displayJobTitle && (
              <p className="text-sm opacity-75">
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
            <p className="text-sm text-gray-600">{displayCity}</p>
            {displayJobTitle && (
              <p className="text-sm text-gray-600">
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
          <p className="text-sm leading-relaxed">{displayBio}</p>
        </div>
      )}

      {/* Prompts (Hinge style) */}
      {column.prompts.length > 0 && (
        <div className="space-y-3">
          {column.prompts.slice(0, 3).map((prompt) => (
            <div key={prompt.id} className="rounded-lg border p-3">
              <p className="text-muted-foreground mb-1 text-sm font-medium">
                {prompt.question}
              </p>
              <p className="text-sm">{prompt.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Additional Photos */}
      {column.mediaAssets.length > 1 && (
        <div className="grid grid-cols-2 gap-2">
          {column.mediaAssets.slice(1, 5).map((photo, index) => (
            <div
              key={photo.id}
              className="aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={photo.url || getPlaceholderImage(index + 1)}
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
