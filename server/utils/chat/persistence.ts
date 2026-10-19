import type { UIMessage } from 'ai'
import { and, eq } from 'drizzle-orm'

type Database = ReturnType<typeof useDrizzle>

/**
 * Message writes are always scoped to the chat: a message id that already belongs to another chat
 * is never updated (message ids are visible in public chats).
 */

/** Returns false when the id is taken by a message of another chat */
export async function saveUserMessage(db: Database, chatId: string, message: UIMessage): Promise<boolean> {
  const rows = await db.insert(schema.messages)
    .values({ id: message.id, chatId, role: 'user', parts: message.parts })
    .onConflictDoUpdate({
      target: schema.messages.id,
      set: { parts: message.parts },
      setWhere: and(eq(schema.messages.chatId, chatId), eq(schema.messages.role, 'user'))
    })
    .returning({ id: schema.messages.id })

  return rows.length > 0
}

/**
 * Inserts or updates an assistant message. Updates are needed for continuations
 * (a stream that resumes after an approval keeps the same message id).
 */
export async function saveAssistantMessage(db: Database, chatId: string, message: UIMessage): Promise<boolean> {
  const rows = await db.insert(schema.messages)
    .values({ id: message.id, chatId, role: 'assistant', parts: message.parts })
    .onConflictDoUpdate({
      target: schema.messages.id,
      set: { parts: message.parts },
      setWhere: and(eq(schema.messages.chatId, chatId), eq(schema.messages.role, 'assistant'))
    })
    .returning({ id: schema.messages.id })

  return rows.length > 0
}
