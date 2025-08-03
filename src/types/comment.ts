import { z } from 'zod';
import { SafeUserSchema } from './user';

export const CommentSchema = z.object({
    id: z.string(),
    productId: z.string(),
    authorId: z.string(),
    parentId: z.string().nullable(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    deletedBy: z.string().nullable(),
    deletionReason: z.string().nullable(),
});

export const CommentWithAuthorSchema: z.ZodType<any> = CommentSchema.extend({
    author: SafeUserSchema,
    replies: z.array(z.lazy(() => CommentWithAuthorSchema)).optional(),
});

export type Comment = z.infer<typeof CommentSchema>;
export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>;