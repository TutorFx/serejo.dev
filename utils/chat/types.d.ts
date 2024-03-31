import type { z } from 'zod'
import type { AbstractAgentSchema, MessageSchema } from './schemas'

type IAbstractAgent = z.infer<typeof AbstractAgentSchema>
type IMessage = z.infer<typeof MessageSchema>
