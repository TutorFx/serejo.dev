import { z } from 'zod'

export const BlogEntrySchema = z.object({
  createdAt: z.string().datetime(),
  _id: z.string(),
})

export const HistoryEntrySchema = z.object({
  org: z.string().min(1),
  location: z.string().min(1),
  start: z.string({ invalid_type_error: 'HistoryEntry without start' }).date('Invalid START datetime'),
  end: z.string({ invalid_type_error: 'HistoryEntry without end' }).date('Invalid END datetime').nullable(),
})

export const ProjectEntrySchema = z.object({
  url: z.string().url(),
  github: z.string().url().optional(),
  scroller: z.string(),
})

export const EducationEntrySchema = z.object({
  org: z.string(),
  start: z.string({ invalid_type_error: 'HistoryEntry without start' }).date('Invalid START datetime'),
  end: z.string({ invalid_type_error: 'HistoryEntry without end' }).date('Invalid END datetime').nullable(),
})

export const CmsEntrySchema = z.object({
  title: z.string().min(1),
})
