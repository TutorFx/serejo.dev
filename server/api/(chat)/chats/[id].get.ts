import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { CHAT_LIMITS } from '#shared/utils/constants/chat.constants'
import { redactPartsForPublicView } from '~~/server/utils/chat/redact'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const db = useDrizzle()

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string().min(1).max(CHAT_LIMITS.maxIdLength)
  }).parse)

  const chat = await db.query.chats.findFirst({
    where: () => eq(schema.chats.id, id),
    with: {
      messages: {
        orderBy: () => asc(schema.messages.createdAt)
      }
    }
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  const userId = session.user?.id || session.id
  const isOwner = chat.userId === userId

  if (chat.visibility === 'private' && !isOwner) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  const { userId: _, ...rest } = chat

  // `system` rows may exist from before the hardening and are never shown
  const messages = rest.messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => isOwner ? message : { ...message, parts: redactPartsForPublicView(message.parts) })

  return { ...rest, messages, isOwner }
})
