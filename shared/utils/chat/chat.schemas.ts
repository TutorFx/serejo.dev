import { z } from 'zod/v4'

const defaultMessageSchema = {
  message: z.string(),
}

const AiMessageSchema = z.object({
  agentType: z.literal(AGENT_TYPE.AI),
  agent: z.enum(AI_AGENT),
}).extend(defaultMessageSchema)

const UserMessageSchema = z.object({
  agentType: z.literal(AGENT_TYPE.USER),
}).extend(defaultMessageSchema)

export const MessageSchema = z.discriminatedUnion('agentType', [
  AiMessageSchema,
  UserMessageSchema,
])

export const ChatPostSchema = z.object({
  history: z.array(MessageSchema),
  agent: z.enum(AI_AGENT),
  lang: z.enum(LOCALE_KEYS),
}).extend(defaultMessageSchema)
