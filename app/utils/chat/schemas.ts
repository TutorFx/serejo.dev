import { z } from 'zod'

export enum AgentType {
  User = 'user',
  Ai = 'model',
}

export const AbstractAgentSchema = z.object({
  name: z.string(),
  role: z.nativeEnum(AgentType),
})

export const MessageSchema = z.object(
  { agent: AbstractAgentSchema, message: z.string() },
)

export const ChatSchema = z.object({
  messageRepository: z.object({ messages: z.array(MessageSchema) }),
})
