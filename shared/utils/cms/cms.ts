import type { PageCollections } from '@nuxt/content'
import type { StaticRouteDocument } from '../routes/routes.constants'
import type { LOCALE_KEYS } from './cms.constants'

export type LocaleKey = (typeof LOCALE_KEYS)[keyof typeof LOCALE_KEYS]

export type ContentDocument = PageCollections[keyof PageCollections] | StaticRouteDocument
