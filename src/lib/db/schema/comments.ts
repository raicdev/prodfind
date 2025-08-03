import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { products } from "./products";
import { sql } from "drizzle-orm";

export const comments = pgTable("comments", {
    id: text('id').primaryKey().default(sql`gen_random_uuid()`),
    productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    deletedAt: timestamp('deleted_at'),
    deletedBy: text('deleted_by'),
    deletionReason: text('deletion_reason')
});