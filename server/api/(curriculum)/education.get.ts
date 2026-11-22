import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async event => {
  const query = await getValidatedQuery(event, data => educationQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!query.data) {
    return createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid input',
      data: query.error.issues,
    })
  }

  const education = await queryCollection(event, 'education')
    .where('id', 'LIKE', `%/${query.data.lang || LOCALE_KEYS.EN_US}/%`)
    .order('end', 'DESC')
    .all()

  return education.map(item => toEducationDto(item, t)) satisfies EducationDto[]
})
