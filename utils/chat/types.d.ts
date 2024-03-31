import type { z } from 'zod'
import type { AbstractAgentSchema } from './schemas'

type IAbstractAgent = z.irfer<typeof AbstractAgentSchema>

export enum AgentType {
    User = 'user',
    Ai = 'model'
}
