import { normalizeLocalePrefix } from '../utils/seo/locale-prefix'

/** Prefixed locales (the default one has no prefix) */
const PREFIXES = LOCALES.filter(locale => locale !== D_LOCALE)

/**
 * Redirects any casing of a locale prefix (`/pt-br/...`, `/PT-BR/...`) to the canonical one (`/pt-BR/...`),
 * so each page has a single URL for search engines.
 */
export default defineEventHandler(event => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return

  const target = normalizeLocalePrefix(event.path, PREFIXES)
  if (target) {
    return sendRedirect(event, target, 301)
  }
})
