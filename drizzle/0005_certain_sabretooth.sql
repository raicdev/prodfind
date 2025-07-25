ALTER TABLE "products" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "deleted_by" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "deletion_reason" text;