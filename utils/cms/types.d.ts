import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { HistoryEntrySchema } from './schemas'
import { z } from 'zod'

type IHistoryEntry = z.infer<typeof HistoryEntrySchema>;

export type HistoryEntry = ParsedContent & IHistoryEntry;