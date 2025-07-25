export default defineEventHandler(async (event) => {
  const requestQuery = await getValidatedQuery(event, data => postQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!requestQuery.data)
    throw new Error('400')

  const post = await queryCollection(event, 'blog').orWhere(query => query.where('id', '=', requestQuery.data.contentPath).where('slug', '=', requestQuery.data.path)).first()

  if (!post)
    throw new Error('404')

  const { data } = blogSchemaWithBody.safeParse(post)

  if (!data)
    return null

  const { title, meta, stem, body, slug } = data
  const { locale, readingTimeInSeconds, reducedBody } = meta

  const readingTimeString = getExtenseShift(readingTimeInSeconds, locale)
  const path = processCmsPath(locale, stem)

  return {
    title,
    locale,
    readingTimeInSeconds,
    readingTimeString: t('time.reading_time', { time: readingTimeString }),
    reducedBody,
    path,
    slug,
    body,
  } satisfies BlogPostDto
})
