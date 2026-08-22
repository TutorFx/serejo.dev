UPDATE "documents"
SET "collection" = CASE
  WHEN "id" LIKE '%blog%' THEN 'blog'
  WHEN "id" LIKE '%education%' THEN 'education'
  WHEN "id" LIKE '%history%' THEN 'history'
  WHEN "id" LIKE '%project%' THEN 'projects'
  ELSE 'pages'
END
WHERE "collection" IS NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "collection" SET NOT NULL;