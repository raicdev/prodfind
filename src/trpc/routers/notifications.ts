import { createTRPCRouter, authedProcedure } from "@/trpc/init";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

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
    .input(z.object({ id: z.uuid() }))
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