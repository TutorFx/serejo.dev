import type { MarkdownRoot } from "@nuxt/content"
import z from "zod/v4"

export const cmsEntrySchema = {
  meta: z.object({
    reducedBody: z.string().optional(),
    readingTimeInSeconds: z.number(),
    locale: z.enum(LOCALE_KEYS)
  }),
  title: z.string().min(1),
  id: z.string(),
  stem: z.string(),
}

export const withBody = {
  body: z.custom<MarkdownRoot>()
}

export const dateObjectSchema = {
  start: z.coerce.date(),
  end: z.coerce.date().nullable(),
}

export const blogSchema = z.object({
  createdAt: z.coerce.date(),
  slug: z.string().nullable(),
}).extend(cmsEntrySchema)

export const blogSchemaWithBody = blogSchema.extend(withBody)

export const historySchema = z.object({
  org: z.string().min(1),
  image: z.string(),
  location: z.string().min(1),
}).extend(cmsEntrySchema).extend(dateObjectSchema)

export const historyWithBodySchema = historySchema.extend(withBody)

export const projectSchema = z.object({
  url: z.url(),
  github: z.url().optional(),
  scroller: z.string(),
})

export const educationSchema = z.object({
  org: z.string(),
}).extend(cmsEntrySchema).extend(dateObjectSchema)

export const educationWithBodySchema = educationSchema.extend(withBody)