"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { api } from "@/trpc/react";
import Link from "next/link";
import { Plus, Eye, Calendar, Camera, Upload, Image, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AppPage() {
  const {
    data: previews,
    isLoading: previewsLoading,
    error: previewsError,
  } = api.profilePreviews.getAll.useQuery();

  const { data: mediaStats, isLoading: mediaLoading } =
    api.mediaLibrary.getStats.useQuery();

  if (previewsLoading || mediaLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasPhotos = mediaStats && mediaStats.totalPhotos > 0;
  const hasPreviews = previews && previews.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your dating profile previews and photo library
        </p>
      </div>

      {/* Photo Library CTA - Show if no photos */}
      {!hasPhotos && (
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-blue-900">
                  Build Your Photo Library
                </CardTitle>
                <p className="text-sm text-blue-700">
                  Start by uploading your photos to create a centralized library
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Upload multiple photos at once</li>
                  <li>• Tag and rate your photos</li>
                  <li>• Use photos across different dating app profiles</li>
                  <li>• Get feedback from the community (coming soon)</li>
                </ul>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/app/media-library/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Photos</CardTitle>
            <Image className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mediaStats?.totalPhotos || 0}
            </div>
            <p className="text-muted-foreground text-xs">in your library</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mediaStats?.averageRating
                ? mediaStats.averageRating.toFixed(1)
                : "0.0"}
            </div>
            <p className="text-muted-foreground text-xs">self-rated photos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previews</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{previews?.length || 0}</div>
            <p className="text-muted-foreground text-xs">
              profile previews created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Tags</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mediaStats?.topTags?.[0]?.tag || "None"}
            </div>
            <p className="text-muted-foreground text-xs">
              {mediaStats?.topTags?.[0]?.count || 0} photos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/app/media-library/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/app/media-library">
            <Image className="mr-2 h-4 w-4" />
            View Library
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/app/profile-previews">
            <Plus className="mr-2 h-4 w-4" />
            Create Preview
          </Link>
        </Button>
      </div>

      {/* Recent Previews */}
      {hasPreviews && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Previews</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/profile-previews">View All</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {previews?.slice(0, 6).map((preview) => (
              <Card
                key={preview.id}
                className="group transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{preview.name}</CardTitle>
                    <Badge variant="secondary">
                      {preview.columns.length} app
                      {preview.columns.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {preview.description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {preview.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(preview.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/app/profile-previews/${preview.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Previews */}
      {!hasPreviews && hasPhotos && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Eye className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">
              No Profile Previews Yet
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              Create your first profile preview to see how your photos look
              across different dating apps
            </p>
            <Button asChild>
              <Link href="/app/profile-previews">
                <Plus className="mr-2 h-4 w-4" />
                Create First Preview
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
