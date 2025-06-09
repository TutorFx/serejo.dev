import { z } from 'zod'

export const MessageSchema = z.object(
  { agent: z.nativeEnum(AGENT_TYPES), message: z.string() },
)

export const ChatSchema = z.object({
  messageRepository: z.object({ messages: z.array(MessageSchema) }),
})
