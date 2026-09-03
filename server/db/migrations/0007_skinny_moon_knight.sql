ALTER TABLE "document_chunk" RENAME TO "document_chunks";--> statement-breakpoint
ALTER TABLE "document_chunks" DROP CONSTRAINT "document_chunk_document_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;