import { D_LOCALE, LOCALE_KEYS, LOCALES } from '#shared/utils/cms/cms.constants'
import { CHAT_ID_PATTERN, CHAT_SHARE_QUERY } from '#shared/utils/constants/chat.constants'

/** Home of each locale, as declared with `defineI18nRoute` in `app/pages/index.vue` */
const HOME_PATHS: Record<(typeof LOCALES)[number], string> = {
  [LOCALE_KEYS.EN_US]: '/',
  [LOCALE_KEYS.PT_BR]: '/pt-BR/inicio',
}

/**
 * The `/chat` pages were removed: the chat lives in the popup of every page. Their links (bookmarks, search results
 * and every conversation shared as `/chat/<id>`) land on the home of the same locale, where `?chat=<id>` opens the
 * popup on that conversation. The rest of the query string (UTM tags) is kept.
 *
 * @returns the redirect target, or `null` when the path is not one of the old chat routes
 */
export function getChatRedirect(path: string): string | null {
  const queryStart = path.indexOf('?')
  const pathname = queryStart === -1 ? path : path.slice(0, queryStart)
  const segments = pathname.split('/').filter(Boolean)

  // Any casing of the prefix, like `locale-prefix.ts` (which runs after this middleware): one redirect instead of two
  const prefix = segments[0]?.toLowerCase()
  const locale = LOCALES.find(code => code !== D_LOCALE && code.toLowerCase() === prefix)
  if (locale) segments.shift()

  const [page, id, ...rest] = segments
  if (page?.toLowerCase() !== 'chat' || rest.length > 0) return null

  const query = new URLSearchParams(queryStart === -1 ? '' : path.slice(queryStart + 1))
  // A malformed id is dropped: the visitor still lands on the home instead of a 404
  if (id && CHAT_ID_PATTERN.test(id)) query.set(CHAT_SHARE_QUERY, id)

  const search = query.toString()
  return search ? `${HOME_PATHS[locale ?? D_LOCALE]}?${search}` : HOME_PATHS[locale ?? D_LOCALE]
}

export default defineEventHandler(event => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return

  const target = getChatRedirect(event.path)
  if (target) {
    return sendRedirect(event, target, 301)
  }
})
