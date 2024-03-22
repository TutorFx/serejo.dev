import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { z } from 'zod'
import type { HistoryEntrySchema } from './schemas'

type IHistoryEntry = z.infer<typeof HistoryEntrySchema>

export type HistoryEntry = ParsedContent & IHistoryEntry
