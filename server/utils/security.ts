import type { H3Event } from 'h3'
import { createHash } from 'node:crypto'
import { consola } from 'consola'

const logger = consola.withTag('security')

export type SecurityEventType
  = | 'ratelimit'
    | 'ratelimit-degraded'
    | 'payload-too-large'
    | 'history-invalid'
    | 'approval-invalid'
    | 'regenerate-invalid'
    | 'message-conflict'
    | 'concurrent-stream'
    | 'budget-exceeded'
    | 'chat-disabled'
    | 'meeting-policy'
    | 'meeting-limit'
    | 'tool-error'
    | 'csrf'

/**
 * Error codes returned in `error.message` so the client can show a translated message.
 */
export const SECURITY_ERROR = {
  rateLimited: 'RATE_LIMITED',
  budgetExceeded: 'BUDGET_EXCEEDED',
  chatDisabled: 'CHAT_DISABLED',
  chatBusy: 'CHAT_BUSY',
  payloadTooLarge: 'PAYLOAD_TOO_LARGE',
  invalidRequest: 'INVALID_REQUEST',
  approvalInvalid: 'APPROVAL_INVALID'
} as const

/** Short, non-reversible identifier for logs (never log raw session ids, IPs or user text) */
export function hashIdentifier(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 12)
}

export function logSecurityEvent(type: SecurityEventType, details: Record<string, string | number | boolean | undefined> = {}) {
  logger.warn(`[${type}]`, details)
}

export interface RequestIdentity {
  /** Logged-in user id or anonymous session id: the owner of the chats */
  ownerId: string
  ip: string
  ownerHash: string
  ipHash: string
}

export async function getRequestIdentity(event: H3Event): Promise<RequestIdentity> {
  const session = await getUserSession(event)
  const ownerId = session.user?.id || session.id

  if (!ownerId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: SECURITY_ERROR.invalidRequest })
  }

  // On Vercel `x-forwarded-for` is overwritten by the edge with the real client IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  return {
    ownerId,
    ip,
    ownerHash: hashIdentifier(ownerId),
    ipHash: hashIdentifier(ip)
  }
}

/**
 * Rejects oversized bodies before they are parsed.
 * `readRawBody` caches the body, so a following `readValidatedBody` does not read it again.
 */
export async function assertBodySize(event: H3Event, maxBytes: number) {
  const declared = Number(getRequestHeader(event, 'content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) {
    logSecurityEvent('payload-too-large', { declared })
    throw createError({ statusCode: 413, statusMessage: 'Payload Too Large', message: SECURITY_ERROR.payloadTooLarge })
  }

  const raw = await readRawBody(event, false)
  if (raw && raw.length > maxBytes) {
    logSecurityEvent('payload-too-large', { actual: raw.length })
    throw createError({ statusCode: 413, statusMessage: 'Payload Too Large', message: SECURITY_ERROR.payloadTooLarge })
  }
}
