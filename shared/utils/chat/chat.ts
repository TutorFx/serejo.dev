import type z from "zod/v4";

export type AgentTypes = typeof AGENT_TYPE[keyof typeof AGENT_TYPE];
export type AiAgentTypes = typeof AI_AGENT[keyof typeof AI_AGENT];

export type AiAgentMeta = { personality: string }

export type MessageType = z.infer<typeof MessageSchema>
export type ChatPostDto = z.infer<typeof ChatPostSchema>