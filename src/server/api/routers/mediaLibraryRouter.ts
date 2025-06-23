import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type Prisma } from "@prisma/client";

export const mediaLibraryRouter = createTRPCRouter({
  // Get all photos in user's library
  getAll: protectedProcedure
    .input(
      z.object({
        tags: z.array(z.string()).optional(),
        rating: z.number().min(0).max(5).optional(),
        assetType: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.MediaAssetWhereInput = {
        userId: ctx.session.user.id,
      };

      if (input.tags && input.tags.length > 0) {
        where.tags = {
          hasSome: input.tags,
        };
      }

      if (input.rating !== undefined) {
        where.rating = {
          gte: input.rating,
        };
      }

      if (input.assetType) {
        where.assetType = input.assetType;
      }

      const photos = await ctx.db.mediaAsset.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          previewColumns: {
            include: {
              preview: {
                select: { name: true },
              },
            },
          },
          _count: {
            select: {
              previewColumns: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (photos.length > input.limit) {
        const nextItem = photos.pop();
        nextCursor = nextItem!.id;
      }

      return {
        photos,
        nextCursor,
      };
    }),

  // Get library stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalPhotos, averageRating, tagCounts] = await Promise.all([
      ctx.db.mediaAsset.count({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.mediaAsset.aggregate({
        where: { userId: ctx.session.user.id },
        _avg: { rating: true },
      }),
      ctx.db.mediaAsset.findMany({
        where: { userId: ctx.session.user.id },
        select: { tags: true },
      }),
    ]);

    // Count tag frequencies
    const tagFrequency: Record<string, number> = {};
    tagCounts.forEach((photo) => {
      photo.tags.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    return {
      totalPhotos,
      averageRating: averageRating._avg.rating || 0,
      topTags: Object.entries(tagFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count })),
    };
  }),

  // Add photos to library (bulk upload)
  addPhotos: protectedProcedure
    .input(
      z.object({
        photos: z.array(
          z.object({
            url: z.string(),
            name: z.string().optional(),
            description: z.string().optional(),
            location: z.string().optional(),
            assetType: z.string().optional(),
            tags: z.array(z.string()).default([]),
            rating: z.number().min(0).max(5).default(0),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const photos = await ctx.db.mediaAsset.createMany({
        data: input.photos.map((photo) => ({
          ...photo,
          userId: ctx.session.user.id,
        })),
      });

      return photos;
    }),

  // Update photo
  updatePhoto: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        assetType: z.string().optional(),
        tags: z.array(z.string()).optional(),
        rating: z.number().min(0).max(5).optional(),
        isPrivate: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.mediaAsset.update({
        where: {
          id,
          userId: ctx.session.user.id, // ensure user owns this photo
        },
        data: updateData,
      });
    }),

  // Delete photo from library
  deletePhoto: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.mediaAsset.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Get available tags (for autocomplete)
  getTags: protectedProcedure.query(async ({ ctx }) => {
    const photos = await ctx.db.mediaAsset.findMany({
      where: { userId: ctx.session.user.id },
      select: { tags: true },
    });

    const allTags = photos.flatMap((photo) => photo.tags);
    const uniqueTags = [...new Set(allTags)].sort();

    return uniqueTags;
  }),

  // Get asset types (for filtering)
  getAssetTypes: protectedProcedure.query(async ({ ctx }) => {
    const photos = await ctx.db.mediaAsset.findMany({
      where: {
        userId: ctx.session.user.id,
        assetType: { not: null },
      },
      select: { assetType: true },
      distinct: ["assetType"],
    });

    return photos.map((p) => p.assetType).filter(Boolean) as string[];
  }),
});
