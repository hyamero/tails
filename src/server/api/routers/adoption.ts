import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { animals } from "~/server/db/schema";
import { nanoid } from "nanoid";

export const adoptionRouter = createTRPCRouter({
  addAnimal: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        breed: z.string(),
        species: z.string(),
        imgUrl: z.string(),
        ownerUsername: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(animals).values({
        id: nanoid(11),
        name: input.name,
        imgUrl: input.imgUrl,
        breed: input.breed,
        species: input.species,
        ownerUsername: input.ownerUsername,
      });
    }),

  getAnimals: protectedProcedure
    .input(
      z.object({
        ownerUsername: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.animals.findMany({
        where: eq(animals.ownerUsername, input.ownerUsername),
        limit: 10,
        columns: {
          id: true,
          name: true,
          imgUrl: true,
          breed: true,
          species: true,
          ownerUsername: true,
        },
      });
    }),
});
