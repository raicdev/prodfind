import { z } from 'zod'
import { createTRPCRouter, authedProcedure } from '@/trpc/init'
import { db } from '@/lib/db';
import { and, eq } from 'drizzle-orm';
import { sessions as sessionsTable } from '@/lib/db/schema';

export const sessionRouter = createTRPCRouter({
  getSessions: authedProcedure.query(async ({ ctx }) => {
    const sessions = await db.query.sessions.findMany({
      where: eq(sessionsTable.userId, ctx.session?.user.id ?? ''),
    });
    return sessions;
  }),
  endSession: authedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(sessionsTable).where(
        and(
          eq(sessionsTable.id, input.sessionId),
          eq(sessionsTable.userId, ctx.session?.user.id ?? '')
        )
      );
    }),
}); 