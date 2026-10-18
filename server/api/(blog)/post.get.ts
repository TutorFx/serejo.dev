import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const requestQuery = await getValidatedQuery(event, data => postQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!requestQuery.data)
    throw new Error('400')

  const posts = await queryCollection(event, 'blog').orWhere(query => query.where('id', '=', requestQuery.data.contentPath).where('slug', '=', requestQuery.data.path)).all()
  // The same slug may exist in several locales: prefer the requested one
  const post = posts.find(item => getLocaleFromPath(item.id, LOCALE_KEYS) === requestQuery.data.lang) ?? posts[0]

  if (!post)
    throw new Error('404')

  const { data } = blogSchemaWithBody.safeParse(post)

  if (!data)
    return null

  const { title, meta, stem, body, slug, createdAt } = data
  const { locale, readingTimeInSeconds, reducedBody } = meta

  const readingTimeString = getExtenseShift(readingTimeInSeconds, locale)
  const path = processCmsPath(locale, stem)

  // Same file stem in each locale, e.g. blog/en-US/hello-world and blog/pt-BR/hello-world
  const translations = await queryCollection(event, 'blog')
    .where('stem', 'IN', LOCALES.map(item => stem.replace(`/${locale}/`, `/${item}/`)))
    .select('stem', 'slug')
    .all()

  const alternates: Partial<Record<LocaleKey, string>> = {}

  for (const translation of translations) {
    const translationLocale = getLocaleFromPath(translation.stem, LOCALE_KEYS)

    if (translationLocale)
      alternates[translationLocale] = translation.slug || path
  }

  return {
    title,
    locale,
    readingTimeInSeconds,
    readingTimeString: t('time.reading_time', { time: readingTimeString }, { locale }),
    reducedBody,
    path,
    slug,
    body,
    createdAt,
    alternates,
  } satisfies BlogPostDto
})
