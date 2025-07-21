import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc } from "drizzle-orm";

const authedProcedure = baseProcedure.use(async (opts) => {
    const { session } = await opts.ctx;
    if (!session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return opts.next({
        ctx: {
            ...opts.ctx,
            user: session.user,
        },
    });
});

export const notificationsRouter = createTRPCRouter({
  get: authedProcedure.query(async ({ ctx }) => {
    const data = await db.query.notifications.findMany({
      where: eq(notifications.userId, ctx.user.id),
      with: {
        actor: true,
        product: true,
      },
      orderBy: [desc(notifications.createdAt)],
    });
    return data;
  }),

  markAsRead: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(notifications)
        .set({ read: true })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id)
          )
        );
      return true;
    }),

  markAllAsRead: authedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, ctx.user.id));
    return true;
  }),
}); 