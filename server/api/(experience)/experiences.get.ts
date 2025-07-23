export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (data) => experiencesQuerySchema.safeParse(data));
  const t = await useTranslation(event)

  if (!query.data) return createError({
    statusCode: 400,
    statusMessage: "Bad Request",
    message: "Invalid input",
    data: query.error.issues
  })

  const experiences = await queryCollection(event, 'history').where('id', 'LIKE', `%/${query.data.lang || LOCALE_KEYS.EN_US}/%`).order("start", "DESC").all()

  return experiences?.map((item) => {
    console.log(query)
    const hasBody = query.data?.includeBody === true

    const { data, error } = historyWithBodySchema.safeParse(item)
    
    if (!data) return null

    const { title, start, end, location, meta, org, stem, body, image } = data
    const { locale, readingTimeInSeconds, reducedBody } = meta

    const readingTimeString = getExtenseShift(readingTimeInSeconds, locale)
    const path = processCmsPath(locale, stem)
    
    return {
      title,
      org,
      image,
      start: formatCardDate(start, locale),
      end: end ? formatCardDate(end, locale) : t('time.the_moment'),
      location,
      locale,
      readingTimeInSeconds,
      readingTimeString: t('time.reading_time', { time: readingTimeString }),
      reducedBody,
      path,
      body: hasBody ? body : null
    }
  }).filter((item) => item !== null) satisfies ExperiencesDto[] ?? []
})