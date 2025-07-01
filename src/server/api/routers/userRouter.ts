import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { UnitSystem } from "@prisma/client";

export const userRouter = createTRPCRouter({
  // Get current user data
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        city: true,
        hometown: true,
        nationality: true,
        dateOfBirth: true,
        timeZone: true,
      },
    });
  }),

  // Update user location data
  updateLocation: protectedProcedure
    .input(
      z.object({
        country: z.string().optional(),
        city: z.string().optional(),
        hometown: z.string().optional(),
        nationality: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Only update fields that have values
      const updateData: Record<string, string> = {};

      if (input.country && input.country.trim() !== "") {
        updateData.country = input.country;
      }

      if (input.city && input.city.trim() !== "") {
        updateData.city = input.city;
      }

      if (input.hometown && input.hometown.trim() !== "") {
        updateData.hometown = input.hometown;
      }

      if (input.nationality && input.nationality.trim() !== "") {
        updateData.nationality = input.nationality;
      }

      // Only update if there's at least one field to update
      if (Object.keys(updateData).length === 0) {
        return null;
      }

      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: updateData,
      });
    }),

  // Get user profile/settings
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        heightCm: true,
        unitPreference: true,
        dateOfBirth: true,
        city: true,
        country: true,
        hometown: true,
        nationality: true,
      },
    });
  }),

  // Update user profile/settings
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        heightCm: z.number().min(50).max(300).optional(), // Reasonable height limits in cm
        unitPreference: z.nativeEnum(UnitSystem).optional(),
        dateOfBirth: z.date().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        hometown: z.string().optional(),
        nationality: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),

  // Helper to convert height between units
  convertHeight: protectedProcedure
    .input(
      z.object({
        heightCm: z.number(),
        toUnit: z.nativeEnum(UnitSystem),
      }),
    )
    .query(({ input }) => {
      const { heightCm, toUnit } = input;

      if (toUnit === UnitSystem.IMPERIAL) {
        const totalInches = heightCm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return {
          feet,
          inches,
          totalInches: Math.round(totalInches),
          display: `${feet}'${inches}"`,
        };
      } else {
        return {
          cm: Math.round(heightCm),
          display: `${Math.round(heightCm)} cm`,
        };
      }
    }),
});
