import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { DataProvider, Gender } from "@prisma/client";

export const profilePreviewsRouter = createTRPCRouter({
  // Get all previews for the authenticated user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.profilePreview.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: {
            mediaAssets: {
              orderBy: { order: "asc" },
              include: {
                mediaAsset: true,
              },
            },
            prompts: { orderBy: { order: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get all previews for dropdown (simplified)
  getAllForDropdown: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.profilePreview.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        columns: {
          select: {
            id: true,
            type: true,
            order: true,
            _count: {
              select: {
                mediaAssets: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get specific preview by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const preview = await ctx.db.profilePreview.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          columns: {
            orderBy: { order: "asc" },
            include: {
              mediaAssets: {
                orderBy: { order: "asc" },
                include: {
                  mediaAsset: true,
                },
              },
              prompts: { orderBy: { order: "asc" } },
            },
          },
        },
      });

      if (!preview) {
        throw new Error("Profile preview not found");
      }

      return preview;
    }),

  // Create new profile preview
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        public: z.boolean().default(false),
        // Basic info
        gender: z.nativeEnum(Gender).optional(),
        age: z.number().optional(),
        heightCm: z.number().optional(),
        defaultBio: z.string().optional(),
        // Work & Education
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        // Location
        country: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        nationality: z.string().optional(),
        hometown: z.string().optional(),
        fromCity: z.string().optional(),
        fromCountry: z.string().optional(),
        // Photo copying options
        sourceColumnId: z.string().optional(),
        targetColumnTypes: z.array(z.nativeEnum(DataProvider)).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { sourceColumnId, targetColumnTypes, ...previewData } = input;

      return ctx.db.$transaction(async (tx) => {
        // Create the preview first
        const preview = await tx.profilePreview.create({
          data: {
            ...previewData,
            userId: ctx.session.user.id,
          },
        });

        // If photo copying is requested, create columns and copy photos
        if (
          sourceColumnId &&
          targetColumnTypes &&
          targetColumnTypes.length > 0
        ) {
          // Verify the user owns the source column
          const sourceColumn = await tx.previewColumn.findFirst({
            where: {
              id: sourceColumnId,
              preview: { userId: ctx.session.user.id },
            },
            include: {
              mediaAssets: {
                orderBy: { order: "asc" },
                include: {
                  mediaAsset: true,
                },
              },
            },
          });

          if (!sourceColumn) {
            throw new Error("Source column not found or not owned by user");
          }

          // Create columns for each target type and copy photos
          for (let i = 0; i < targetColumnTypes.length; i++) {
            const columnType = targetColumnTypes[i]!;

            // Create the new column
            const newColumn = await tx.previewColumn.create({
              data: {
                type: columnType,
                order: i,
                previewId: preview.id,
                // Copy profile data from source column if available
                gender: sourceColumn.gender,
                age: sourceColumn.age,
                heightCm: sourceColumn.heightCm,
                bio: sourceColumn.bio,
                jobTitle: sourceColumn.jobTitle,
                company: sourceColumn.company,
                school: sourceColumn.school,
                city: sourceColumn.city,
                state: sourceColumn.state,
                country: sourceColumn.country,
                hometown: sourceColumn.hometown,
                nationality: sourceColumn.nationality,
                fromCity: sourceColumn.fromCity,
                fromCountry: sourceColumn.fromCountry,
              },
            });

            // Copy photo connections from source column
            for (const sourcePhotoConnection of sourceColumn.mediaAssets) {
              await tx.previewColumnMediaAsset.create({
                data: {
                  columnId: newColumn.id,
                  mediaAssetId: sourcePhotoConnection.mediaAsset.id,
                  order: sourcePhotoConnection.order,
                },
              });
            }
          }
        }

        return preview;
      });
    }),

  // Update profile preview metadata
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        public: z.boolean().optional(),
        // Basic info
        gender: z.nativeEnum(Gender).optional(),
        age: z.number().optional(),
        heightCm: z.number().optional(),
        defaultBio: z.string().optional(),
        // Work & Education
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        // Location
        country: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        nationality: z.string().optional(),
        hometown: z.string().optional(),
        fromCity: z.string().optional(),
        fromCountry: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.profilePreview.update({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data: updateData,
      });
    }),

  // Delete profile preview
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.profilePreview.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Create new column
  createColumn: protectedProcedure
    .input(
      z.object({
        previewId: z.string(),
        type: z.nativeEnum(DataProvider),
        gender: z.nativeEnum(Gender).optional(),
        age: z.number().optional(),
        heightCm: z.number().optional(),
        bio: z.string().optional(),
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        hometown: z.string().optional(),
        nationality: z.string().optional(),
        fromCity: z.string().optional(),
        fromCountry: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { previewId, ...columnData } = input;

      // Get the next order number
      const lastColumn = await ctx.db.previewColumn.findFirst({
        where: { previewId },
        orderBy: { order: "desc" },
      });

      const order = (lastColumn?.order ?? 0) + 1;

      return ctx.db.previewColumn.create({
        data: {
          ...columnData,
          previewId,
          order,
        },
      });
    }),

  // Create new column with photos copied from source column
  createColumnWithPhotos: protectedProcedure
    .input(
      z.object({
        previewId: z.string(),
        sourceColumnId: z.string(),
        type: z.nativeEnum(DataProvider),
        gender: z.nativeEnum(Gender).optional(),
        age: z.number().optional(),
        heightCm: z.number().optional(),
        bio: z.string().optional(),
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        hometown: z.string().optional(),
        nationality: z.string().optional(),
        fromCity: z.string().optional(),
        fromCountry: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { previewId, sourceColumnId, ...columnData } = input;

      return ctx.db.$transaction(async (tx) => {
        // Verify the user owns both the preview and the source column
        const [preview, sourceColumn] = await Promise.all([
          tx.profilePreview.findFirst({
            where: {
              id: previewId,
              userId: ctx.session.user.id,
            },
          }),
          tx.previewColumn.findFirst({
            where: {
              id: sourceColumnId,
              preview: { userId: ctx.session.user.id },
            },
            include: {
              mediaAssets: {
                orderBy: { order: "asc" },
                include: {
                  mediaAsset: true,
                },
              },
            },
          }),
        ]);

        if (!preview) {
          throw new Error("Preview not found or not owned by user");
        }

        if (!sourceColumn) {
          throw new Error("Source column not found or not owned by user");
        }

        // Get the next order number for the new column
        const lastColumn = await tx.previewColumn.findFirst({
          where: { previewId },
          orderBy: { order: "desc" },
        });

        const order = (lastColumn?.order ?? 0) + 1;

        // Create the new column
        const newColumn = await tx.previewColumn.create({
          data: {
            ...columnData,
            previewId,
            order,
          },
        });

        // Copy photo connections from source column
        for (const sourcePhotoConnection of sourceColumn.mediaAssets) {
          await tx.previewColumnMediaAsset.create({
            data: {
              columnId: newColumn.id,
              mediaAssetId: sourcePhotoConnection.mediaAsset.id,
              order: sourcePhotoConnection.order,
            },
          });
        }

        return newColumn;
      });
    }),

  // Update column
  updateColumn: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        // UI preferences
        hideUnusedPhotoSlots: z.boolean().optional(),
        // Profile info
        gender: z.nativeEnum(Gender).optional(),
        age: z.number().optional(),
        heightCm: z.number().optional(),
        bio: z.string().optional(),
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        hometown: z.string().optional(),
        nationality: z.string().optional(),
        fromCity: z.string().optional(),
        fromCountry: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.previewColumn.update({
        where: { id },
        data: updateData,
      });
    }),

  // Delete column
  deleteColumn: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.previewColumn.delete({
        where: { id: input.id },
      });
    }),

  // Add photo from library to column
  addPhotoToColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        mediaAssetId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, mediaAssetId } = input;

      // Verify the user owns both the column and the photo
      const [column, mediaAsset] = await Promise.all([
        ctx.db.previewColumn.findFirst({
          where: {
            id: columnId,
            preview: { userId: ctx.session.user.id },
          },
          include: {
            mediaAssets: { orderBy: { order: "desc" }, take: 1 }, // Get highest order
          },
        }),
        ctx.db.mediaAsset.findFirst({
          where: {
            id: mediaAssetId,
            userId: ctx.session.user.id,
          },
        }),
      ]);

      if (!column) {
        throw new Error("Column not found or not owned by user");
      }

      if (!mediaAsset) {
        throw new Error("Photo not found or not owned by user");
      }

      // Check if photo is already in this column
      const existingConnection = await ctx.db.previewColumnMediaAsset.findFirst(
        {
          where: {
            columnId,
            mediaAssetId,
          },
        },
      );

      if (existingConnection) {
        throw new Error("Photo is already in this column");
      }

      // Get the next order number (highest + 1, or 0 if no photos)
      const nextOrder =
        column.mediaAssets.length > 0 ? column.mediaAssets[0]!.order + 1 : 0;

      // Create the connection with proper order
      return ctx.db.previewColumnMediaAsset.create({
        data: {
          columnId,
          mediaAssetId,
          order: nextOrder,
        },
      });
    }),

  // Remove photo from column
  removePhotoFromColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        mediaAssetId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, mediaAssetId } = input;

      // Verify the user owns the column
      const column = await ctx.db.previewColumn.findFirst({
        where: {
          id: columnId,
          preview: { userId: ctx.session.user.id },
        },
      });

      if (!column) {
        throw new Error("Column not found or not owned by user");
      }

      // Find the connection to delete
      const connection = await ctx.db.previewColumnMediaAsset.findFirst({
        where: {
          columnId,
          mediaAssetId,
        },
      });

      if (!connection) {
        throw new Error("Photo not found in this column");
      }

      // Delete the connection
      await ctx.db.previewColumnMediaAsset.delete({
        where: { id: connection.id },
      });

      // Reorder remaining photos to fill the gap
      const remainingConnections =
        await ctx.db.previewColumnMediaAsset.findMany({
          where: { columnId },
          orderBy: { order: "asc" },
        });

      // Update orders to be sequential (0, 1, 2, ...)
      for (let i = 0; i < remainingConnections.length; i++) {
        const connection = remainingConnections[i]!;
        if (connection.order !== i) {
          await ctx.db.previewColumnMediaAsset.update({
            where: { id: connection.id },
            data: { order: i },
          });
        }
      }

      return { success: true };
    }),

  // Legacy: Add photo directly (for bulk upload)
  addPhoto: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        url: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        assetType: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, ...photoData } = input;

      // Verify the user owns the column
      const column = await ctx.db.previewColumn.findFirst({
        where: {
          id: columnId,
          preview: { userId: ctx.session.user.id },
        },
        include: {
          mediaAssets: { orderBy: { order: "desc" }, take: 1 }, // Get highest order
        },
      });

      if (!column) {
        throw new Error("Column not found or not owned by user");
      }

      // Create the media asset first
      const mediaAsset = await ctx.db.mediaAsset.create({
        data: {
          ...photoData,
          userId: ctx.session.user.id,
          tags: [], // Default empty tags
          rating: 0, // Default rating
        },
      });

      // Get the next order number
      const nextOrder =
        column.mediaAssets.length > 0 ? column.mediaAssets[0]!.order + 1 : 0;

      // Create the connection with proper order
      await ctx.db.previewColumnMediaAsset.create({
        data: {
          columnId,
          mediaAssetId: mediaAsset.id,
          order: nextOrder,
        },
      });

      return mediaAsset;
    }),

  // Update photo
  updatePhoto: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        url: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        assetType: z.string().optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.mediaAsset.update({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data: updateData,
      });
    }),

  // Delete photo
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

  // Swap photos in column
  swapPhotos: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        photoId1: z.string(),
        photoId2: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, photoId1, photoId2 } = input;

      // Verify the user owns the column
      const column = await ctx.db.previewColumn.findFirst({
        where: {
          id: columnId,
          preview: { userId: ctx.session.user.id },
        },
      });

      if (!column) {
        throw new Error("Column not found or not owned by user");
      }

      // Find both photo connections
      const [connection1, connection2] = await Promise.all([
        ctx.db.previewColumnMediaAsset.findFirst({
          where: { columnId, mediaAssetId: photoId1 },
        }),
        ctx.db.previewColumnMediaAsset.findFirst({
          where: { columnId, mediaAssetId: photoId2 },
        }),
      ]);

      if (!connection1 || !connection2) {
        throw new Error("One or both photos not found in column");
      }

      // Swap the order values directly
      await Promise.all([
        ctx.db.previewColumnMediaAsset.update({
          where: { id: connection1.id },
          data: { order: connection2.order },
        }),
        ctx.db.previewColumnMediaAsset.update({
          where: { id: connection2.id },
          data: { order: connection1.order },
        }),
      ]);

      return { success: true };
    }),

  // Add prompt to column (create new prompt and link to column)
  addPrompt: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        question: z.string(),
        answer: z.string(),
        promptType: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, ...promptData } = input;

      // Verify the user owns the column
      const column = await ctx.db.previewColumn.findFirst({
        where: {
          id: columnId,
          preview: { userId: ctx.session.user.id },
        },
      });

      if (!column) {
        throw new Error("Column not found or not owned by user");
      }

      // Get the next order number for this user's prompts
      const lastPrompt = await ctx.db.previewPrompt.findFirst({
        where: { userId: ctx.session.user.id },
        orderBy: { order: "desc" },
      });

      const order = (lastPrompt?.order ?? 0) + 1;

      // Create prompt and connect to column in one operation
      return ctx.db.previewPrompt.create({
        data: {
          ...promptData,
          promptType: promptData.promptType || "general",
          order,
          userId: ctx.session.user.id,
          columns: {
            connect: { id: columnId },
          },
        },
        include: {
          columns: true,
        },
      });
    }),

  // Add existing prompt to column
  addPromptToColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        promptId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, promptId } = input;

      // Verify the user owns both the column and the prompt
      const [column, prompt] = await Promise.all([
        ctx.db.previewColumn.findFirst({
          where: {
            id: columnId,
            preview: { userId: ctx.session.user.id },
          },
        }),
        ctx.db.previewPrompt.findFirst({
          where: {
            id: promptId,
            userId: ctx.session.user.id,
          },
        }),
      ]);

      if (!column) {
        throw new Error("Column not found or not owned by user");
      }

      if (!prompt) {
        throw new Error("Prompt not found or not owned by user");
      }

      // Use Prisma's connect to link the prompt to the column
      return ctx.db.previewColumn.update({
        where: { id: columnId },
        data: {
          prompts: {
            connect: { id: promptId },
          },
        },
      });
    }),

  // Remove prompt from column
  removePromptFromColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        promptId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, promptId } = input;

      // Verify the user owns the column
      const column = await ctx.db.previewColumn.findFirst({
        where: {
          id: columnId,
          preview: { userId: ctx.session.user.id },
        },
      });

      if (!column) {
        throw new Error("Column not found or not owned by user");
      }

      // Use Prisma's disconnect to unlink the prompt from the column
      return ctx.db.previewColumn.update({
        where: { id: columnId },
        data: {
          prompts: {
            disconnect: { id: promptId },
          },
        },
      });
    }),

  // Update prompt
  updatePrompt: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        question: z.string().optional(),
        answer: z.string().optional(),
        promptType: z.string().optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.previewPrompt.update({
        where: {
          id,
          userId: ctx.session.user.id, // ensure user owns this prompt
        },
        data: updateData,
      });
    }),

  // Delete prompt (removes from all columns and deletes the prompt)
  deletePrompt: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.previewPrompt.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Get all prompts for the authenticated user (for reuse)
  getAllPrompts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.previewPrompt.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        columns: {
          include: {
            preview: {
              select: { name: true },
            },
          },
        },
        _count: {
          select: {
            columns: true,
          },
        },
      },
      orderBy: [{ promptType: "asc" }, { createdAt: "desc" }],
    });
  }),

  // Get prompts by type (for filtering/organization)
  getPromptsByType: protectedProcedure
    .input(z.object({ promptType: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.previewPrompt.findMany({
        where: {
          userId: ctx.session.user.id,
          promptType: input.promptType,
        },
        include: {
          _count: {
            select: {
              columns: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get available prompt types for the user
  getPromptTypes: protectedProcedure.query(async ({ ctx }) => {
    const prompts = await ctx.db.previewPrompt.findMany({
      where: {
        userId: ctx.session.user.id,
        promptType: { not: "" }, // not null??
      },
      select: { promptType: true },
      distinct: ["promptType"],
    });

    return prompts.map((p) => p.promptType).filter(Boolean);
  }),
});
