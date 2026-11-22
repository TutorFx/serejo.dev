import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async event => {
  const query = await getValidatedQuery(event, data => experiencesQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!query.data) {
    return createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid input',
      data: query.error.issues,
    })
  }

  const { lang, includeBody } = query.data

  const experiences = await queryCollection(event, 'history')
    .where('id', 'LIKE', `%/${lang || LOCALE_KEYS.EN_US}/%`)
    .order('start', 'DESC')
    .all()

  return experiences.map(item => {
    const experience = toExperienceDto(item, t)

    return {
      ...experience,
      body: includeBody ? experience.body : null,
    } satisfies ExperiencesDto
  })
})
