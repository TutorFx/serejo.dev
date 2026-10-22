import { CHAT_ID_PATTERN, CHAT_SHARE_QUERY } from '#shared/utils/constants'

/**
 * Link that opens the chat popup on a conversation: the home of the sharer's locale plus `?chat=<id>`.
 * `server/middleware/chat-redirect.ts` sends the old `/chat/<id>` links to the same place.
 */
export function getChatShareUrl(origin: string, homePath: string, chatId: string): string {
  const url = new URL(homePath, origin)
  url.searchParams.set(CHAT_SHARE_QUERY, chatId)
  return url.href
}

/**
 * Reads the conversation requested with `?chat=<id>` from a route query.
 *
 * @returns the id, or `null` when the parameter is missing or is not a chat id
 */
export function readSharedChatId(query: Record<string, unknown>): string | null {
  const value = query[CHAT_SHARE_QUERY]
  const id = Array.isArray(value) ? value[0] : value
  return typeof id === 'string' && CHAT_ID_PATTERN.test(id) ? id : null
}
