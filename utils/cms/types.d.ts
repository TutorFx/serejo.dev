import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { z } from 'zod'
import type { BlogEntrySchema, CmsEntrySchema, EducationEntrySchema, HistoryEntrySchema, ProjectEntrySchema } from './schemas'

type ICmsEntry = z.infer<typeof CmsEntrySchema>
type IHistoryEntry = z.infer<typeof HistoryEntrySchema>
type IProjectEntry = z.infer<typeof ProjectEntrySchema>
type IBlogEntry = z.infer<typeof BlogEntrySchema>
type IEducationEntry = z.infer<typeof EducationEntrySchema>

export type CmsEntry = ParsedContent & ICmsEntry

export type HistoryEntry = ParsedContent & IHistoryEntry & CmsEntry

export type ProjectEntry = ParsedContent & IProjectEntry & CmsEntry

export type BlogEntry = ParsedContent & IBlogEntry & CmsEntry

export type EducationEntry = ParsedContent & IEducationEntry & CmsEntry
