import { z } from 'zod'

export const FlagSchema = z.object({
  name: z.string(),
  active: z.boolean(),
  defaultvalue: z.boolean(),
})
