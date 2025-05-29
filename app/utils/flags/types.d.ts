import type { FlagSchema } from '~/app/utils/flags/schemas'

export type Flag = z.infer<typeof FlagSchema>
