import type { AlternativeEntry, SitemapUrl } from '#sitemap/types'

interface LocalizedRoute {
  locale: LocaleKey
  /** File stem shared by the translations of the same document */
  path: string
  loc: string
}

function toRoute(locale: LocaleKey, pattern: string, item: string) {
  return getStaticRouteUrl(pattern.replace('[item]', item), locale)
}

function toAlternatives(routes: LocalizedRoute[]) {
  const alternatives: AlternativeEntry[] = routes.map(route => ({
    hreflang: route.locale,
    href: route.loc,
  }))
  const defaultRoute = routes.find(route => route.locale === D_LOCALE)

  if (defaultRoute) {
    alternatives.push({ hreflang: 'x-default', href: defaultRoute.loc })
  }

  return alternatives
}

// OG images are generated from encoded page props (`/_og/d/...`), so they cannot be listed here
export default defineSitemapEventHandler(async () => {
  const [posts, experiences] = await Promise.all([
    Promise.all(
      LOCALES.map(async locale => ({
        locale,
        items: await $fetch<BlogPostsDto[]>('/api/posts', { query: { lang: locale } }),
      }))
    ),
    Promise.all(
      LOCALES.map(async locale => ({
        locale,
        items: await $fetch<ExperiencesDto[]>('/api/experiences', { query: { lang: locale } }),
      }))
    ),
  ])

  const postRoutes = posts.flatMap(({ locale, items }) =>
    items.map(post => ({
      locale,
      path: post.path,
      loc: toRoute(locale, CMS_ROUTE_LIST[locale].post, post.slug || post.path),
      post,
    }))
  )

  const experienceRoutes = experiences.flatMap(({ locale, items }) =>
    items.map(experience => ({
      locale,
      path: experience.path,
      loc: toRoute(locale, CMS_ROUTE_LIST[locale].experience, experience.path),
    }))
  )

  const postUrls = postRoutes.map(
    ({ locale, path, loc, post }) =>
      ({
        _sitemap: locale,
        loc,
        lastmod: post.createdAt,
        alternatives: toAlternatives(postRoutes.filter(route => route.path === path)),

        news: {
          title: post.title,
          publication_date: post.createdAt,

          publication: {
            name: 'Serejo DEV',
            language: locale.slice(0, 2),
          },
        },
      }) satisfies SitemapUrl
  )

  const experienceUrls = experienceRoutes.map(
    ({ locale, path, loc }) =>
      ({
        _sitemap: locale,
        loc,
        alternatives: toAlternatives(experienceRoutes.filter(route => route.path === path)),
      }) satisfies SitemapUrl
  )

  return [...postUrls, ...experienceUrls]
})
