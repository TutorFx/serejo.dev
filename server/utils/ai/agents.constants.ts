import felina from './agents/felina.meta'

export const AGENT_META = {
  [AI_AGENT.FELINA]: felina,
} as const satisfies Record<AiAgentTypes, AiAgentMeta>
