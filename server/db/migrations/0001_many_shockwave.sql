CREATE TABLE "votes" (
	"chat_id" text NOT NULL,
	"message_id" text NOT NULL,
	"isUpvoted" boolean NOT NULL,
	CONSTRAINT "votes_chat_id_message_id_pk" PRIMARY KEY("chat_id","message_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_provider_id_idx" ON "users" USING btree ("provider","provider_id");