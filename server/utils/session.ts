import type { H3Event } from 'h3'
import { randomUUID } from 'crypto'

declare module 'h3' {
  interface H3EventContext {
    guest: { id: string }
  }
}

export async function setupGuest(event: H3Event) {
  let id = getCookie(event, COOKIE_KEYS.GUEST)

  if (!id) {
    id = randomUUID()
    setCookie(event, COOKIE_KEYS.GUEST, id)
  }

  return { id }
}
