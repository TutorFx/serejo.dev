export const AGENT_TYPE_USER = 'user' as const;
export const AGENT_TYPE_AI = 'model' as const;

export const AGENT_TYPES = {
  AI: AGENT_TYPE_AI,
  USER: AGENT_TYPE_USER,
} as const;