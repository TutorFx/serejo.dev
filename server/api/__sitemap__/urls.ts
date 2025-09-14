import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  const sitemaps = LOCALES.map(async (locale) => {
    const localePath = LOCALE_KEYS.EN_US === locale ? '' : `/${locale}`

    const localeRequests = await Promise.all([
      $fetch<BlogPostDto[]>('/api/posts').then((item) => {
        return item.map(post => ({
          _sitemap: locale,
          loc: `${localePath}${CMS_ROUTE_LIST[locale].post.replace('[item]', post.slug || post.path)}`,
          lastmod: post.createdAt,

          news: {
            title: post.title,
            publication_date: post.createdAt,

            publication: {
              name: 'Serejo DEV',
              language: locale,
            },
          },

          images: [
            {
              loc: `/__og-image__/image/${localePath}post/${post.slug || post.path}/og.png`,
              title: post.title,
            },
          ],
        }) satisfies SitemapUrl)
      }),
      $fetch<BlogPostDto[]>('/api/experiences').then((item) => {
        return item.map(experience => ({
          _sitemap: locale,
          loc: `${localePath}${CMS_ROUTE_LIST[locale].experience.replace('[item]', experience.slug || experience.path)}`,
          lastmod: experience.createdAt,

          images: [
            {
              loc: `/__og-image__/image/${localePath}experience/${experience.slug || experience.path}/og.png`,
              title: experience.title,
            },
          ],
        }
      ) satisfies SitemapUrl)
      }),
    ])

    return localeRequests
  })

  return (await Promise.all(sitemaps)).flat(2)
})
