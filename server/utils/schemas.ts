import z from "zod/v4";

export * from './ai/tool.schemas'

export const queryLanguage = {
  lang: z.enum(LOCALE_KEYS).optional(),
}

export const postsQuerySchema = z.object({}).extend(queryLanguage)
export const experiencesQuerySchema = z.object({
  includeBody: z.preprocess((val) => val === 'true', z.boolean()).default(false),
}).extend(queryLanguage)
export const educationQuerySchema = z.object({}).extend(queryLanguage)

export const postQuerySchema = z.object({
  path: z.string(),
}).extend(queryLanguage).transform((item) => {
  const contentPath = `blog/blog/${item.lang}/${item.path}.md`
  return {
    ...item,
    contentPath,
  }
})

export const experienceQuerySchema = z.object({
  path: z.string(),
}).extend(queryLanguage).transform((item) => {
  const contentPath = `history/history/${item.lang}/${item.path}.md`

  return {
    ...item,
    contentPath,
  }
})
