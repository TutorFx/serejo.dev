import { boolean, index, json, pgTable, primaryKey, text, timestamp, uniqueIndex, vector, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

const timestamps = {
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email'),
  name: text('name'),
  username: text('username'),

  provider: text('provider', { enum: ['github'] }).notNull(),
  providerId: text('provider_id').notNull(),
  ...timestamps,
}, table => [
  uniqueIndex('users_provider_id_idx').on(table.provider, table.providerId),
])

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats),
}))

export const chats = pgTable('chats', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title'),
  userId: text('user_id').notNull(),
  visibility: text('visibility', { enum: ['public', 'private'] }).notNull().default('private'),
  ...timestamps,
}, table => [
  index('chats_user_id_idx').on(table.userId),
])

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}))

export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  parts: json(),
  ...timestamps,
}, table => [
  index('messages_chat_id_idx').on(table.chatId),
])

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}))

export const votes = pgTable('votes', {
  chatId: text('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  messageId: text('message_id').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  isUpvoted: boolean().notNull(),
}, table => [
  primaryKey({ columns: [table.chatId, table.messageId] }),
])

export const votesRelations = relations(votes, ({ one }) => ({
  chat: one(chats, {
    fields: [votes.chatId],
    references: [chats.id],
  }),
  message: one(messages, {
    fields: [votes.messageId],
    references: [messages.id],
  }),
}))

export const document = pgTable('documents', {
  id: text('id').primaryKey(),
  collection: text('collection').notNull(),
  route: text('route'),
  hashMd5: text('hash_md5').notNull(),
}, table => [
  index('documents_collection_idx').on(table.collection),
])

export const documentChunks = pgTable('document_chunks', {
  id: text('id').primaryKey(),
  index: integer('index').notNull(),
  documentId: text('document_id').notNull().references(() => document.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  context: text('context'),
  embedding: vector('embedding', { dimensions: 2000 }),
}, table => [
  index('document_chunks_document_id_idx').on(table.documentId),
  index('document_chunks_doc_index_idx').on(table.documentId, table.index),
])

export const documentChunkRelations = relations(documentChunks, ({ one }) => ({
  document: one(document, {
    fields: [documentChunks.documentId],
    references: [document.id],
  }),
}))
