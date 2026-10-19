/**
 * Redaction for chats opened by someone other than the owner (public link).
 *
 * - reasoning parts are removed (they may echo internal instructions)
 * - scheduling parts are removed: they hold the visitor's name and e-mail and Gabriel's busy slots
 * - e-mail addresses in text are masked
 */

const EMAIL_PATTERN = /[\w.%+-]+@[\w-]+(?:\.[\w-]+)+/g
const PRIVATE_PART_TYPES = new Set(['reasoning', 'tool-createMeeting', 'tool-calendar'])

export const REDACTED_EMAIL = '[e-mail]'

export function maskEmails(text: string): string {
  return text.replace(EMAIL_PATTERN, REDACTED_EMAIL)
}

export function redactPartsForPublicView(parts: unknown): unknown[] {
  if (!Array.isArray(parts)) return []

  return parts.flatMap(part => {
    if (typeof part !== 'object' || part === null) return []

    const { type, text } = part as { type?: unknown; text?: unknown }
    if (typeof type !== 'string' || PRIVATE_PART_TYPES.has(type)) return []

    if (type === 'text' && typeof text === 'string') {
      return [{ ...part, text: maskEmails(text) }]
    }

    return [part]
  })
}
