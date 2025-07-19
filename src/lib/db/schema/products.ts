import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const products = pgTable("products", {
    id: text('id').primaryKey(),
    authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    price: text('price').notNull(),
    images: jsonb('images'),
    icon: text('icon'),
    links: jsonb('links'),
    category: jsonb('category').array(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});