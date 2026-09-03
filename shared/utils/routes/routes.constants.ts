import type { LOCALES } from '../cms/cms.constants'

export type AppLocale = (typeof LOCALES)[number]

export interface RouteMeta {
  path: string
  title: string
  description: string
  keywords?: string
  summary?: string
}

export type StaticRouteDocument = {
  id: string
  collection: 'routes'
  route: string
  locale: AppLocale
  name: string
  title: string
  description: string
  keywords: string
  summary: string
  content: string
  hashMd5: string
}
