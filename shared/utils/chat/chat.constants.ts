export const AGENT_TYPE_USER = 'user' as const
export const AGENT_TYPE_AI = 'model' as const

export const AGENT_TYPE = {
  AI: AGENT_TYPE_AI,
  USER: AGENT_TYPE_USER,
} as const

export const AI_AGENT_FELINA = 'felina' as const

export const AI_AGENT = {
  FELINA: AI_AGENT_FELINA,
} as const
