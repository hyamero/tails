import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, and, desc, lte, ne, isNull } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { likes, posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  inifiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
        author: z.string().optional(),
        postId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const condition = input.author
        ? and(
            eq(posts.authorId, input.author),
            lte(posts.createdAt, input.cursor?.createdAt ?? new Date()),
            ne(posts.id, input.cursor?.id ?? ""),
          )
        : input.postId
          ? and(
              eq(posts.parentId, input.postId ?? ""),
              lte(posts.createdAt, input.cursor?.createdAt ?? new Date()),
              ne(posts.id, input.cursor?.id ?? ""),
            )
          : and(
              lte(posts.createdAt, input.cursor?.createdAt ?? new Date()),
              ne(posts.id, input.cursor?.id ?? ""),
              isNull(posts.parentId),
            );

      const data = await ctx.db.query.posts.findMany({
        orderBy: [desc(posts.createdAt)],
        limit: input.limit + 1,
        where: condition,
        with: {
          author: true,
          likes: true,
          replies: true,
        },
      });

      let nextPageCursor: typeof input.cursor | undefined;

      if (data.length > input.limit) {
        const pointerItem = data[data.length - 1];

        if (pointerItem !== null && pointerItem !== undefined) {
          nextPageCursor = {
            id: pointerItem.id,
            createdAt: pointerItem.createdAt,
          };
        }
      }

      return {
        posts: data.map((post) => {
          return {
            ...post,
            replies: post.replies.length ?? 0,
            likes: post.likes.length ?? 0,
            likedByUser: post.likes.some(
              (like) => like.userId === ctx.session?.user.id,
            ),
          };
        }),
        nextPageCursor,
      };
    }),

  getPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
        with: {
          author: true,
          likes: true,
          replies: true,
        },
      });

      return (
        data && {
          ...data,
          replies: data.replies.length ?? 0,
          likes: data.likes.length ?? 0,
          likedByUser: data.likes.some(
            (like) => like.userId === ctx.session?.user.id,
          ),
        }
      );
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        imgUrl: z.string().optional(),
        params: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        authorId: ctx.session.user.id,
        content: input.content,
        imgUrl: input.imgUrl,
        params: input.params,
        id: nanoid(11),
      });

      return await ctx.db.query.posts.findFirst({
        where: eq(posts.authorId, ctx.session.user.id),
        orderBy: [desc(posts.createdAt)],
        with: {
          author: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.postId));
    }),

  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const condition = and(
        eq(likes.postId, input.postId),
        eq(likes.userId, ctx.session.user.id),
      );

      const existingLike = await ctx.db.query.likes.findFirst({
        where: condition,
      });

      if (existingLike == undefined || existingLike == null) {
        await ctx.db.insert(likes).values({
          userId: ctx.session.user.id,
          postId: input.postId,
        });
      } else {
        await ctx.db.delete(likes).where(condition);
      }
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1),
        imgUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        authorId: ctx.session.user.id,
        content: input.content,
        parentId: input.postId,
        imgUrl: input.imgUrl,
        id: nanoid(11),
      });

      return await ctx.db.query.posts.findFirst({
        where: eq(posts.authorId, ctx.session.user.id),
        orderBy: [desc(posts.createdAt)],
      });
    }),

  viewLikes: publicProcedure.input(z.object({ postId: z.string() })).query(
    async ({ ctx, input }) =>
      await ctx.db.query.likes.findMany({
        where: eq(likes.postId, input.postId),
        with: {
          user: true,
        },
      }),
  ),
});
