import { z } from 'zod'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { products as productsTable } from '@/lib/db/schema';
import { ProductSchema, Products } from '@/types/product';
import { checkBotId } from 'botid/server';

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
  /**
   * Get products
   */
  getProducts: baseProcedure.input(z.object({
    userId: z.string().optional(),
  })).query(async ({ ctx, input }) => {
    const verification = await checkBotId();

    if (verification.isBot) {
      throw new Error("Unauthorized");
    }
    const qb = db.select().from(productsTable);

    if (input.userId) {
      qb.where(eq(productsTable.authorId, input.userId));
    }

    const products = await qb;

    return products as Products;
  }),
  /**
   * Create product
   */
  createProduct: baseProcedure.input(CreateProductSchema).mutation(async ({ ctx, input }) => {
    const verification = await checkBotId();

    if (verification.isBot) {
      throw new Error("Unauthorized");
    }
    const product = await db.insert(productsTable).values({
      ...input,
      id: crypto.randomUUID(),
      authorId: ctx.session?.user?.id ?? "unknown",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return product;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter
