import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { products } from "./products";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const recommendations = pgTable("recommendations", {
    id: text('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
    user: one(users, {
        fields: [recommendations.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [recommendations.productId],
        references: [products.id],
    }),
})); 