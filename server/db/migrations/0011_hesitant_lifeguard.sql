ALTER TABLE "documents" ADD COLUMN "collection" text;--> statement-breakpoint
CREATE INDEX "documents_collection_idx" ON "documents" USING btree ("collection");