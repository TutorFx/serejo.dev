import type { Message, Prisma } from '@prisma/client'
import { AgentType } from '@prisma/client'
import { defu } from 'defu'

export function messageToDb(from: MessageType, id: string, many: true): Prisma.MessageCreateManyInput
export function messageToDb(from: MessageType, id: string, many?: false): Prisma.MessageCreateInput
export function messageToDb(from: MessageType, id: string, many?: boolean): Prisma.MessageCreateInput | Prisma.MessageCreateManyInput {
  const idSettings = many ? { chatId: id } : { chat: { connect: { id } } }
  const shared = defu({ message: from.message, chat: many ? undefined : { connect: { id } }, chatId: many ? id : undefined }, idSettings)
  if (from.agentType === AGENT_TYPE.AI) {
    return defu({
      agent: from.agent,
      agentType: AgentType.MODEL,
    }, shared)
  }
  else if (from.agentType === AGENT_TYPE.USER) {
    return defu({
      agentType: AgentType.USER,
    }, shared)
  }
  else {
    throw new Error('Error casting DB Message')
  }
}

export function dbToMessage(from: Message): MessageType {
  const shared = { message: from.message }
  if (from.agentType === AgentType.MODEL) {
    return defu({
      agentType: AGENT_TYPE.AI,
      agent: from.agent as AiAgentTypes,
    }, shared)
  }
  else if (from.agentType === AgentType.USER) {
    return defu({
      agentType: AGENT_TYPE.USER,
    }, shared)
  }
  else {
    throw new Error('Error casting Message')
  }
}
