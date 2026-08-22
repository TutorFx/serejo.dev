import { LOCALE_KEYS } from '../shared/utils/cms/cms.constants'

function resolveSupportedLocale(val: unknown): string | null {
  if (!val) return null
  const str = String(val).toLowerCase()
  if (str.startsWith('pt')) return LOCALE_KEYS.PT_BR
  if (str.startsWith('en')) return LOCALE_KEYS.EN_US
  return null
}

export default defineI18nLocaleDetector((event, config) => {
  // try to get locale from query
  const query = tryQueryLocale(event, { lang: '' })
  const queryLocale = resolveSupportedLocale(query)
  if (queryLocale) {
    return queryLocale
  }

  // try to get locale from cookie
  const cookie = tryCookieLocale(event, { lang: '', name: 'i18n_redirected' })
  const cookieLocale = resolveSupportedLocale(cookie)
  if (cookieLocale) {
    return cookieLocale
  }

  // try to get locale from header (`accept-header`)
  const header = tryHeaderLocale(event, { lang: '' })
  const headerLocale = resolveSupportedLocale(header)
  if (headerLocale) {
    return headerLocale
  }

  // If the locale cannot be resolved up to this point, it is resolved with defaultLocale
  return config.defaultLocale
})
