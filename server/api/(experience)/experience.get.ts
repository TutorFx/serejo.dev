import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async event => {
  const query = await getValidatedQuery(event, data => experienceQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!query.data)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid input',
      data: query.error.issues,
    })

  const item = await queryCollection(event, 'history')
    .where('id', '=', query.data.contentPath)
    .first()

  if (!item) throw createError({ statusCode: 404, statusMessage: 'Experience not found' })

  const experience = toExperienceDto(item, t)

  return {
    ...experience,
    reducedBody: truncateString(experience.reducedBody, 200),
  } satisfies ExperienceDto
})
