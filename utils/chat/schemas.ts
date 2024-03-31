import { z } from 'zod'
import { AgentType } from './types'

export const AbstractAgentSchema = z.object({
  image: z.string(),
  name: z.string(),
  role: z.nativeEnum(AgentType),
})
