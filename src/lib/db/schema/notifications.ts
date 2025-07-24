import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";
import { products } from "./products";

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  read: boolean("read").default(false).notNull(),
  actorId: text("actor_id"),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  actor: one(users, {
    fields: [notifications.actorId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [notifications.target],
    references: [products.id],
  }),
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
})); 