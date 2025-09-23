import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { DataProvider } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { put } from "@vercel/blob";

export const profileCompareRouter = createTRPCRouter({
  getComparisons: protectedProcedure.query(async ({ ctx }) => {
    const comparisons = await ctx.db.profileComparison.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        columns: {
          include: {
            photos: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return comparisons;
  }),

  getComparison: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const comparison = await ctx.db.profileComparison.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          columns: {
            include: {
              photos: {
                orderBy: {
                  order: "asc",
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      if (!comparison) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comparison not found",
        });
      }

      return comparison;
    }),

  getPublicComparison: protectedProcedure
    .input(z.object({ shareKey: z.string() }))
    .query(async ({ ctx, input }) => {
      const comparison = await ctx.db.profileComparison.findUnique({
        where: {
          shareKey: input.shareKey,
          isPublic: true,
        },
        include: {
          columns: {
            include: {
              photos: {
                orderBy: {
                  order: "asc",
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      if (!comparison) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comparison not found",
        });
      }

      return comparison;
    }),

  createComparison: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        age: z.number().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        defaultBio: z.string().optional(),
        columns: z.array(
          z.object({
            type: z.nativeEnum(DataProvider),
            photos: z.array(z.string()), // URLs of uploaded photos
            bio: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Generate share key
      const shareKey = Math.random().toString(36).substring(2, 10);

      const comparison = await ctx.db.profileComparison.create({
        data: {
          name: input.name,
          age: input.age,
          city: input.city,
          state: input.state,
          country: input.country,
          defaultBio: input.defaultBio,
          userId: ctx.session.user.id,
          shareKey,
          columns: {
            create: input.columns.map((column, columnIndex) => ({
              type: column.type,
              order: columnIndex,
              bio: column.bio,
              photos: {
                create: column.photos.map((photoUrl, photoIndex) => ({
                  url: photoUrl,
                  order: photoIndex,
                })),
              },
            })),
          },
        },
        include: {
          columns: {
            include: {
              photos: true,
            },
          },
        },
      });

      return comparison;
    }),

  updateComparison: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        age: z.number().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        defaultBio: z.string().optional(),
        isPublic: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const comparison = await ctx.db.profileComparison.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
          age: input.age,
          city: input.city,
          state: input.state,
          country: input.country,
          defaultBio: input.defaultBio,
          isPublic: input.isPublic,
        },
      });

      return comparison;
    }),

  deleteComparison: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.profileComparison.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      return { success: true };
    }),

  uploadPhoto: protectedProcedure
    .input(
      z.object({
        file: z.custom<File>((val) => val instanceof File, {
          message: "Expected a File object",
        }),
        appType: z.nativeEnum(DataProvider),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { file, appType } = input;

      // Generate a unique filename
      const filename = `profile-compare/${appType.toLowerCase()}/${
        ctx.session.user.id
      }/${Date.now()}-${file.name}`;

      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
      });

      return blob.url;
    }),

  addPhotoToColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, url } = input;

      // First, check if the column belongs to the user
      const column = await ctx.db.comparisonColumn.findFirst({
        where: {
          id: columnId,
          comparison: {
            userId: ctx.session.user.id,
          },
        },
        include: {
          photos: {
            orderBy: {
              order: "desc",
            },
            take: 1,
          },
        },
      });

      if (!column) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Column not found",
        });
      }

      // Get the highest order number for existing photos
      const order = column.photos.length > 0 ? column.photos[0]!.order + 1 : 0;

      // Create the photo
      const photo = await ctx.db.comparisonPhoto.create({
        data: {
          url,
          order,
          columnId,
        },
      });

      return photo;
    }),

  addColumn: protectedProcedure
    .input(
      z.object({
        comparisonId: z.string(),
        type: z.nativeEnum(DataProvider),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { comparisonId, type, bio } = input;

      // Get the highest order number for existing columns
      const existingColumns = await ctx.db.comparisonColumn.findMany({
        where: { comparisonId },
        orderBy: { order: "desc" },
        take: 1,
      });

      const order =
        existingColumns.length > 0 ? existingColumns[0]!.order + 1 : 0;

      const column = await ctx.db.comparisonColumn.create({
        data: {
          type,
          order,
          bio,
          comparisonId,
        },
      });

      return column;
    }),

  deletePhoto: protectedProcedure
    .input(
      z.object({
        photoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { photoId } = input;

      // First check if the photo belongs to a column owned by the user
      const photo = await ctx.db.comparisonPhoto.findFirst({
        where: {
          id: photoId,
          column: {
            comparison: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      if (!photo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Photo not found or you don't have permission to delete it",
        });
      }

      // Delete the photo
      await ctx.db.comparisonPhoto.delete({
        where: {
          id: photoId,
        },
      });

      return { success: true };
    }),

  reorderPhotos: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        photoOrders: z.array(
          z.object({
            id: z.string(),
            order: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, photoOrders } = input;

      // Check if the column belongs to the user
      const column = await ctx.db.comparisonColumn.findFirst({
        where: {
          id: columnId,
          comparison: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!column) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Column not found or you don't have permission to modify it",
        });
      }

      // Update the order of each photo
      const updatePromises = photoOrders.map((photoOrder) => {
        return ctx.db.comparisonPhoto.update({
          where: {
            id: photoOrder.id,
            columnId: columnId, // Ensure the photo belongs to this column
          },
          data: {
            order: photoOrder.order,
          },
        });
      });

      await Promise.all(updatePromises);

      return { success: true };
    }),
});
