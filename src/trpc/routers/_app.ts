import { z } from 'zod'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { db } from '@/lib/db';
import { eq, sql, desc, getTableColumns, and } from 'drizzle-orm';
import {
  products as productsTable,
  users as usersTable,
  bookmarks as bookmarksTable,
  recommendations as recommendationsTable,
  notifications as notificationsTable,
} from '@/lib/db/schema';
import {
  ProductSchema,
  ProductWithAuthor,
  Products,
  ProductLinkSchema,
  ProductImageSchema,
} from '@/types/product';
import { checkBotId } from 'botid/server';
import { sessionRouter } from './session';
import { notificationsRouter } from './notifications';
import { TRPCError } from '@trpc/server';

const CreateProductSchema = ProductSchema.omit({
  id: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Api Router definition
 */
export const appRouter = createTRPCRouter({
  session: sessionRouter,
  notifications: notificationsRouter,
  /**
   * Get products
   */
  getProducts: baseProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const verification = await checkBotId();

      if (verification.isBot) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      const recommendationCounts = db
        .select({
          productId: recommendationsTable.productId,
          count: sql<number>`count(${recommendationsTable.id})`
            .mapWith(Number)
            .as("count"),
        })
        .from(recommendationsTable)
        .groupBy(recommendationsTable.productId)
        .as("recommendationCounts");

      let qb = db
        .select({
          ...getTableColumns(productsTable),
          recommendationCount: recommendationCounts.count,
        })
        .from(productsTable)
        .leftJoin(
          recommendationCounts,
          eq(productsTable.id, recommendationCounts.productId)
        )
        .$dynamic();

      if (input.userId) {
        qb = qb.where(eq(productsTable.authorId, input.userId));
      }

      const products = await qb.orderBy(
        desc(recommendationCounts.count)
      );

      return products.map((p) => ({
        ...p,
        recommendationCount: p.recommendationCount || 0,
      }));
    }),
  /**
   * Create product
   */
  createProduct: baseProcedure.input(CreateProductSchema).mutation(async ({ ctx, input }) => {
    const verification = await checkBotId();

    if (verification.isBot) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }
    const product = await db.insert(productsTable).values({
      ...input,
      authorId: ctx.session?.user?.id ?? "unknown",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return product;
  }),
  /**
   * Get single product by ID
   */
  getProduct: baseProcedure.input(z.object({
    productId: z.string(),
  })).query(async ({ input }) => {
    const verification = await checkBotId();

    if (verification.isBot) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const product = await db.select()
      .from(productsTable)
      .where(eq(productsTable.id, input.productId))
      .limit(1);

    if (!product[0]) {
      throw new Error("Product not found");
    }

    const productData = product[0];

    const author = await db.select().from(usersTable).where(eq(usersTable.id, productData.authorId));

    const recommendationCount = await db
      .select({
        count: sql<number>`count(${recommendationsTable.id})`.mapWith(Number),
      })
      .from(recommendationsTable)
      .where(eq(recommendationsTable.productId, input.productId));

    return {
      ...productData,
      author: author[0],
      recommendationCount: recommendationCount[0].count || 0,
    } as ProductWithAuthor;
  }),
  /**
   * Update product
   */
  updateProduct: baseProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        category: z.array(z.string()).optional(),
        links: z.array(ProductLinkSchema.omit({ id: true })).optional(),
        images: z.array(ProductImageSchema.omit({ id: true })).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const verification = await checkBotId();

      if (verification.isBot) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      if (!ctx.session?.user?.id) {
        throw new Error("Unauthorized - no session");
      }

      const product = await db.select()
        .from(productsTable)
        .where(eq(productsTable.id, input.productId))
        .limit(1);

      if (!product[0]) {
        throw new Error("Product not found");
      }

      if (product[0].authorId !== ctx.session.user.id) {
        throw new Error("Unauthorized - not product owner");
      }

      const { productId, ...updateData } = input;

      await db.update(productsTable)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(productsTable.id, productId));

      return { success: true };
    }),
  /**
   * Delete product
   */
  deleteProduct: baseProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      const product = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, input.productId))
        .limit(1);

      if (!product[0]) {
        throw new Error("Product not found");
      }

      if (product[0].authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      await db.delete(productsTable).where(eq(productsTable.id, input.productId));

      return { success: true };
    }),

  addBookmark: baseProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }
      await db.insert(bookmarksTable).values({
        productId: input.productId,
        userId: ctx.session.user.id,
        createdAt: new Date(),
      });

      const product = await db.query.products.findFirst({
        where: eq(productsTable.id, input.productId),
        columns: {
          authorId: true,
        },
      });

      if (product && product.authorId !== ctx.session.user.id) {
        await db.insert(notificationsTable).values({
          userId: product.authorId,
          action: "bookmark",
          target: input.productId,
          read: false,
          createdAt: new Date(),
          actorId: ctx.session.user.id,
        });
      }

      return { success: true };
    }),

  removeBookmark: baseProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }
      await db
        .delete(bookmarksTable)
        .where(
          and(
            eq(bookmarksTable.productId, input.productId),
            eq(bookmarksTable.userId, ctx.session.user.id)
          )
        );
      return { success: true };
    }),

  getBookmarkStatus: baseProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        return { isBookmarked: false };
      }
      const bookmark = await db
        .select()
        .from(bookmarksTable)
        .where(
          and(
            eq(bookmarksTable.productId, input.productId),
            eq(bookmarksTable.userId, ctx.session.user.id)
          )
        )
        .limit(1);
      return { isBookmarked: !!bookmark[0] };
    }),

  addRecommendation: baseProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }
      await db.insert(recommendationsTable).values({
        productId: input.productId,
        userId: ctx.session.user.id,
        createdAt: new Date(),
      });

      const product = await db.query.products.findFirst({
        where: eq(productsTable.id, input.productId),
        columns: {
          authorId: true,
        },
      });

      if (product && product.authorId !== ctx.session.user.id) {
        await db.insert(notificationsTable).values({
          userId: product.authorId,
          action: "recommendation",
          target: input.productId,
          read: false,
          createdAt: new Date(),
          actorId: ctx.session.user.id,
        });
      }

      return { success: true };
    }),

  removeRecommendation: baseProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }
      await db
        .delete(recommendationsTable)
        .where(
          and(
            eq(recommendationsTable.productId, input.productId),
            eq(recommendationsTable.userId, ctx.session.user.id)
          )
        );
      return { success: true };
    }),

  getRecommendationStatus: baseProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        return { isRecommended: false };
      }
      const recommendation = await db
        .select()
        .from(recommendationsTable)
        .where(
          and(
            eq(recommendationsTable.productId, input.productId),
            eq(recommendationsTable.userId, ctx.session.user.id)
          )
        )
        .limit(1);
      return { isRecommended: !!recommendation[0] };
    }),

  getBookmarkedProducts: baseProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const bookmarked = await db
      .select({ product: productsTable })
      .from(bookmarksTable)
      .leftJoin(productsTable, eq(bookmarksTable.productId, productsTable.id))
      .where(eq(bookmarksTable.userId, ctx.session.user.id));

    return bookmarked
      .map((item) => item.product)
      .filter(Boolean) as Products;
  }),

  getRecommendedProducts: baseProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const recommended = await db
      .select({ product: productsTable })
      .from(recommendationsTable)
      .leftJoin(
        productsTable,
        eq(recommendationsTable.productId, productsTable.id)
      )
      .where(eq(recommendationsTable.userId, ctx.session.user.id));

    return recommended
      .map((item) => item.product)
      .filter(Boolean) as Products;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
