import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async event => {
  const requestQuery = await getValidatedQuery(event, data => postQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!requestQuery.data)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid input',
      data: requestQuery.error.issues,
    })

  const posts = await queryCollection(event, 'blog')
    .orWhere(query =>
      query
        .where('id', '=', requestQuery.data.contentPath)
        .where('slug', '=', requestQuery.data.path)
    )
    .all()
  // The same slug may exist in several locales: prefer the requested one
  const item = posts.find(post => post.locale === requestQuery.data.lang) ?? posts[0]

  if (!item) throw createError({ statusCode: 404, statusMessage: 'Post not found' })

  const post = toBlogPostDto(item, t)
  const { locale, stem, path } = post

  // Same file stem in each locale, e.g. blog/en-US/hello-world and blog/pt-BR/hello-world
  const translations = await queryCollection(event, 'blog')
    .where(
      'stem',
      'IN',
      LOCALES.map(translationLocale => stem.replace(`/${locale}/`, `/${translationLocale}/`))
    )
    .select('locale', 'slug')
    .all()

  const alternates: BlogPostDto['alternates'] = {}

  for (const translation of translations) {
    alternates[translation.locale] = translation.slug || path
  }

  return { ...post, alternates } satisfies BlogPostDto
})
