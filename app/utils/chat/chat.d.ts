export type ChatVariant = (typeof CHAT_VARIANTS)[keyof typeof CHAT_VARIANTS]
export type MessageStatus = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS]

export interface ChatVariantContract {
  rounded: BooleanKeyDefinition
  border: BooleanKeyDefinition
  variant: GenericVariantKeyDefinition<ChatVariant>
}

export interface ChatMessageVariantContract {
  variant: GenericVariantKeyDefinition<AgentTypes>
}
