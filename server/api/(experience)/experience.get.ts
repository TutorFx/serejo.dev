export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => experienceQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!query.data)
    throw new Error('400')

  const experiences = await queryCollection(event, 'history').where('id', '=', query.data.contentPath).first()

  const { data } = historyWithBodySchema.safeParse(experiences)

  if (!data)
    return null

  const { title, start, end, location, meta, org, stem, body, image, delivered } = data
  const { locale, readingTimeInSeconds, reducedBody } = meta

  const readingTimeString = getExtenseShift(readingTimeInSeconds, locale)
  const path = processCmsPath(locale, stem)

  return {
    title,
    image,
    org,
    start: formatCardDate(start, locale),
    end: end ? formatCardDate(end, locale) : t('time.the_moment'),
    location,
    locale,
    readingTimeInSeconds,
    readingTimeString: t('time.reading_time', { time: readingTimeString }),
    reducedBody: reducedBody ? truncateString(reducedBody, 200) : '',
    path,
    delivered,
    body,
  } satisfies ExperienceDto
})
