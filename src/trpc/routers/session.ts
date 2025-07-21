import { z } from 'zod'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { db } from '@/lib/db';
import { and, eq } from 'drizzle-orm';
import { sessions as sessionsTable } from '@/lib/db/schema';
import { TRPCError } from '@trpc/server';

export const sessionRouter = createTRPCRouter({
  getSessions: baseProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED'
      });
    }
    const sessions = await db.query.sessions.findMany({
      where: eq(sessionsTable.userId, ctx.session.user.id),
    });
    return sessions;
  }),
  endSession: baseProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED'
        });
      }
      await db.delete(sessionsTable).where(
        and(
          eq(sessionsTable.id, input.sessionId),
          eq(sessionsTable.userId, ctx.session.user.id)
        )
      );
    }),
}); 