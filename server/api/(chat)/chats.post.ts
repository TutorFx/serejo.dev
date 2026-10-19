import { z } from 'zod'
import { ABUSE_LIMITS, CHAT_LIMITS } from '#shared/utils/constants/chat.constants'
import { userMessageSchema } from '~~/server/utils/chat/history'

const bodySchema = z.object({
  // Same rules as the chat endpoint: one user message with text parts only. The id is generated here
  message: userMessageSchema.omit({ id: true }),
})

export default defineEventHandler(async event => {
  await assertBodySize(event, CHAT_LIMITS.maxBodyBytes)
  await assertChatEnabled()
  const identity = await getRequestIdentity(event)
  await assertRateLimits(event, buildRateLimitChecks('chat', identity, ABUSE_LIMITS.chats), {
    route: 'chat:create',
  })

  const { message } = await readValidatedBody(event, bodySchema.parse)
  const db = useDrizzle()

  const [chat] = await db
    .insert(schema.chats)
    .values({
      title: '',
      userId: identity.ownerId,
    })
    .returning()

  if (!chat) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create chat' })
  }

  await db.insert(schema.messages).values({
    id: crypto.randomUUID(),
    chatId: chat.id,
    role: 'user',
    parts: message.parts.map(part => ({ type: 'text', text: part.text })),
  })

  const { userId: _, ...rest } = chat
  return rest
})
