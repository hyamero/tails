import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { donations } from "~/server/db/schema";
import { nanoid } from "nanoid";

export const transactionRouter = createTRPCRouter({
  createDonation: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        recipientId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(donations).values({
        donorId: ctx.session.user.id,
        recipientId: ctx.session.user.id,
        amount: input.amount,
        id: nanoid(11),
      });

      return await ctx.db.query.donations.findFirst({
        where: eq(donations.donorId, ctx.session.user.id),
        orderBy: [desc(donations.createdAt)],
      });
    }),
});
