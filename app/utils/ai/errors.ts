/**
 * Maps server error codes (see `SECURITY_ERROR` in `server/utils/security.ts`) to i18n keys,
 * so the UI never shows raw server or provider messages.
 */

const ERROR_KEYS: Record<string, string> = {
  RATE_LIMITED: 'chat.errors.rate_limited',
  BUDGET_EXCEEDED: 'chat.errors.budget_exceeded',
  CHAT_DISABLED: 'chat.errors.chat_disabled',
  CHAT_BUSY: 'chat.errors.chat_busy',
  PAYLOAD_TOO_LARGE: 'chat.errors.payload_too_large',
  INVALID_REQUEST: 'chat.errors.invalid_request',
  APPROVAL_INVALID: 'chat.errors.approval_invalid',
  STREAM_ERROR: 'chat.errors.stream_error',
}

const STATUS_KEYS: Record<number, string> = {
  413: 'chat.errors.payload_too_large',
  429: 'chat.errors.rate_limited',
  503: 'chat.errors.chat_disabled',
}

/** nuxt-csurf rejects requests without a valid token with this status message */
const CSRF_STATUS_MESSAGE = 'CSRF Token Mismatch'

interface ErrorPayload {
  statusCode?: number
  statusMessage?: string
  message?: string
}

function parsePayload(value: string): ErrorPayload {
  if (!value.startsWith('{')) return { message: value }

  try {
    const parsed = JSON.parse(value) as ErrorPayload
    return typeof parsed === 'object' && parsed !== null ? parsed : { message: value }
  } catch {
    return { message: value }
  }
}

function toPayload(error: unknown): ErrorPayload {
  if (typeof error === 'string') return parsePayload(error)
  if (typeof error !== 'object' || error === null) return {}

  // `$fetch` (ofetch) errors carry the h3 error body in `data`
  const { data, statusCode, message } = error as {
    data?: unknown
    statusCode?: number
    message?: unknown
  }
  if (typeof data === 'object' && data !== null) {
    return { statusCode, ...(data as ErrorPayload) }
  }

  // Chat transport errors carry the response body as the message
  return typeof message === 'string' ? { statusCode, ...parsePayload(message) } : { statusCode }
}

export function getChatErrorKey(error: unknown): string {
  const payload = toPayload(error)

  if (payload.statusMessage === CSRF_STATUS_MESSAGE) return 'chat.errors.session_expired'
  if (payload.message && ERROR_KEYS[payload.message]) return ERROR_KEYS[payload.message]!
  if (payload.statusCode && STATUS_KEYS[payload.statusCode]) return STATUS_KEYS[payload.statusCode]!

  return 'chat.errors.generic'
}
