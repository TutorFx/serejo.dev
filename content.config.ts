import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod/v4'
// With the extension: modules/content-validation.ts imports this file through the native loader
import { LOCALES } from './shared/utils/cms/cms.constants.ts'

// Written by transformers/reading-time.ts: declared so they become typed columns instead of `meta`
const computedFields = {
  locale: z.enum(LOCALES),
  readingTimeInSeconds: z.number(),
  reducedBody: z.string(),
}

// Stored as DATE columns: the generated types (and the rows) carry them as strings
const periodFields = {
  start: z.coerce.date(),
  end: z.coerce.date().nullable(),
}

// The only declaration of each collection. Nuxt Content generates the tables and the `Collections`
// types from these schemas, and modules/content-validation.ts checks every file against them
export const collectionSchemas = {
  blog: z.object({
    title: z.string().min(1),
    createdAt: z.coerce.date(),
    slug: z.string().optional(),
    ...computedFields,
  }),
  education: z.object({
    title: z.string().min(1),
    org: z.string(),
    location: z.string().min(1),
    ...periodFields,
    ...computedFields,
  }),
  history: z.object({
    title: z.string().min(1),
    org: z.string().min(1),
    image: z.string(),
    location: z.string().min(1),
    delivered: z.array(z.string().min(1)).optional(),
    ...periodFields,
    ...computedFields,
  }),
  projects: z.object({
    url: z.url(),
    github: z.url().optional(),
    scroller: z.string().optional(),
  }),
}

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: collectionSchemas.blog,
    }),
    education: defineCollection({
      type: 'page',
      source: 'education/**/*.md',
      schema: collectionSchemas.education,
    }),
    history: defineCollection({
      type: 'page',
      source: 'history/**/*.md',
      schema: collectionSchemas.history,
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: collectionSchemas.projects,
    }),
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
    }),
  },
})
