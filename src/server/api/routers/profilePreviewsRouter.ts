import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { DataProvider } from "@prisma/client";

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
            mediaAssets: true,
            prompts: { orderBy: { order: "asc" } },
          },
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
              mediaAssets: true,
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
        description: z.string().optional(),
        public: z.boolean().default(false),
        // Default profile info
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        age: z.number().optional(),
        defaultBio: z.string().optional(),
        fromCity: z.string().optional(),
        fromCountry: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.profilePreview.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Update profile preview metadata
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        public: z.boolean().optional(),
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        age: z.number().optional(),
        defaultBio: z.string().optional(),
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
        bio: z.string().optional(),
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        age: z.number().optional(),
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

  // Update column
  updateColumn: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        bio: z.string().optional(),
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        school: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        age: z.number().optional(),
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

      // Use Prisma's connect to link the photo to the column
      return ctx.db.previewColumn.update({
        where: { id: columnId },
        data: {
          mediaAssets: {
            connect: { id: mediaAssetId },
          },
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

      // Use Prisma's disconnect to unlink the photo from the column
      return ctx.db.previewColumn.update({
        where: { id: columnId },
        data: {
          mediaAssets: {
            disconnect: { id: mediaAssetId },
          },
        },
      });
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
      });

      if (!column) {
        throw new Error("Column not found or not owned by user");
      }

      // Create photo in media library and connect to column in one operation
      return ctx.db.previewColumn.update({
        where: { id: columnId },
        data: {
          mediaAssets: {
            create: {
              ...photoData,
              userId: ctx.session.user.id,
              tags: [], // Default empty tags
              rating: 0, // Default rating
            },
          },
        },
      });
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
