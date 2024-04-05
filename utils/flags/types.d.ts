import type { FlagSchema } from '@/utils/flags/schemas'

export type Flag = z.infer<typeof FlagSchema>
