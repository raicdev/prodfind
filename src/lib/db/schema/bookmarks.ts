import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const bookmarks = pgTable("bookmarks", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
    user: one(users, {
        fields: [bookmarks.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [bookmarks.productId],
        references: [products.id],
    }),
})); 