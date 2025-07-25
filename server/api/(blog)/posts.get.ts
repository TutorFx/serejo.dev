export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => postsQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!query.data) {
    return createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid input',
      data: query.error.issues,
    })
  }

  const posts = await queryCollection(event, 'blog').where('id', 'LIKE', `%/${query.data?.lang || LOCALE_KEYS.EN_US}/%`).order('createdAt', 'DESC').all()

  return posts?.map((item) => {
    const { data } = blogSchema.safeParse(item)

    if (!data)
      return null

    const { title, meta, stem, slug } = data
    const { locale, readingTimeInSeconds, reducedBody } = meta

    const readingTimeString = getExtenseShift(readingTimeInSeconds, locale)
    const path = processCmsPath(locale, stem)

    return {
      title,
      locale,
      readingTimeInSeconds,
      readingTimeString: t('time.reading_time', { time: readingTimeString }),
      reducedBody: reducedBody ? truncateString(reducedBody, 200) : undefined,
      path,
      slug,
    }
  }).filter(item => item !== null) ?? [] satisfies BlogPostsDto[]
})
