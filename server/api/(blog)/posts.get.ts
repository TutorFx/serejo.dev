import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async event => {
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

  const posts = await queryCollection(event, 'blog')
    .where('id', 'LIKE', `%/${query.data?.lang || LOCALE_KEYS.EN_US}/%`)
    .order('createdAt', 'DESC')
    .all()

  return posts.map(item => {
    const { body, ...post } = toBlogPostDto(item, t)

    return {
      ...post,
      reducedBody: truncateString(post.reducedBody, 200),
    } satisfies BlogPostsDto
  })
})
