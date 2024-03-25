import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { z } from 'zod'
import type { CmsEntrySchema, HistoryEntrySchema } from './schemas'

type ICmsEntry = z.infer<typeof CmsEntrySchema>
type IHistoryEntry = z.infer<typeof HistoryEntrySchema>


export type CmsEntry = ParsedContent & ICmsEntry

export type HistoryEntry = ParsedContent & IHistoryEntry & CmsEntry
