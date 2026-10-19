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

  const experience = await queryCollection(event, 'history')
    .where('id', '=', query.data.contentPath)
    .first()

  if (!experience) throw createError({ statusCode: 404, statusMessage: 'Experience not found' })

  const parsed = historyWithBodySchema.safeParse(experience)

  if (!parsed.success)
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid experience content',
      data: parsed.error.issues,
    })

  const { title, start, end, location, meta, org, stem, body, image, delivered } = parsed.data
  const { locale, readingTimeInSeconds, reducedBody } = meta

  const readingTimeString = getExtenseShift(readingTimeInSeconds, locale)
  const path = processCmsPath(locale, stem)

  return {
    title,
    image,
    org,
    start: formatCardDate(start, locale),
    end: end ? formatCardDate(end, locale) : t('time.the_moment', {}, { locale }),
    location,
    locale,
    readingTimeInSeconds,
    readingTimeString: t('time.reading_time', { time: readingTimeString }, { locale }),
    reducedBody: reducedBody ? truncateString(reducedBody, 200) : '',
    path,
    delivered,
    body,
  } satisfies ExperienceDto
})
