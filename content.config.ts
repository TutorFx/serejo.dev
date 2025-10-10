import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export const cmsEntrySchema = {
  title: z.string().min(1),
  _id: z.string(),
}

export const dateObjectSchema = {
  start: z.date(),
  end: z.date().nullable(),
}

export const blogSchema = z.object({
  createdAt: z.date(),
  slug: z.string().nullable(),
}).extend(cmsEntrySchema)

export const historySchema = z.object({
  image: z.string(),
  org: z.string().min(1),
  location: z.string().min(1),
}).extend(cmsEntrySchema).extend(dateObjectSchema)

export const projectSchema = z.object({
  url: z.string().url(),
  github: z.string().url(),
  scroller: z.string(),
})

export const educationSchema = z.object({
  org: z.string(),
}).extend(cmsEntrySchema).extend(dateObjectSchema)

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: blogSchema,
    }),
    education: defineCollection({
      type: 'page',
      source: 'education/**/*.md',
      schema: educationSchema,
    }),
    history: defineCollection({
      type: 'page',
      source: 'history/**/*.md',
      schema: historySchema,
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: projectSchema,
    }),
    pages: defineCollection({
      type: 'page',
      source: '**/*.md'
    })
  },
})
