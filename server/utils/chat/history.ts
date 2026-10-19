import type { UIMessage } from 'ai'
import { z } from 'zod'
import { CHAT_LIMITS } from '../../../shared/utils/constants/chat.constants'

/**
 * Builds the conversation sent to the model from the database, never from the client.
 *
 * The client only sends (a) the text of a new user message or (b) the decisions for pending
 * tool approvals. Tool inputs, tool outputs and assistant messages always come from storage.
 * Pure module (explicit relative imports) so it can be unit tested with `bun test`.
 */

const textPartSchema = z.object({
  type: z.literal('text'),
  text: z.string().trim().min(1).max(CHAT_LIMITS.maxMessageChars)
})

export const userMessageSchema = z.object({
  id: z.string().min(1).max(CHAT_LIMITS.maxIdLength),
  role: z.literal('user'),
  parts: z.array(textPartSchema).min(1).max(CHAT_LIMITS.maxTextPartsPerMessage)
})

export type IncomingUserMessage = z.infer<typeof userMessageSchema>

export const approvalDecisionSchema = z.object({
  toolCallId: z.string().min(1).max(CHAT_LIMITS.maxIdLength),
  approvalId: z.string().min(1).max(CHAT_LIMITS.maxIdLength),
  approved: z.boolean()
})

/**
 * The denial reason reaches the model as the tool result (Gemini receives only this text),
 * so it is fixed on the server: a client-provided reason would be an injection channel.
 */
export const DENIED_BY_VISITOR = 'The visitor denied this meeting request in the interface. Nothing was sent.'
export const DENIED_BY_NEW_MESSAGE = 'The visitor sent a new message instead of approving this meeting request. Nothing was sent.'

export type ApprovalDecision = z.infer<typeof approvalDecisionSchema>

export const chatRequestBodySchema = z.object({
  trigger: z.enum(['submit-message', 'regenerate-message']),
  messageId: z.string().max(CHAT_LIMITS.maxIdLength).optional(),
  timeZone: z.enum(Intl.supportedValuesOf('timeZone')),
  message: userMessageSchema.optional(),
  approvals: z.array(approvalDecisionSchema).min(1).max(CHAT_LIMITS.maxApprovalsPerRequest).optional()
}).refine(
  body => body.trigger === 'regenerate-message'
    ? !body.message && !body.approvals
    : Boolean(body.message) !== Boolean(body.approvals),
  { message: 'Send either a user message or approval decisions' }
)

export type ChatRequestBody = z.infer<typeof chatRequestBodySchema>

export type ChatRequestErrorCode = 'approval-invalid' | 'regenerate-invalid'

export class ChatRequestError extends Error {
  constructor(public readonly code: ChatRequestErrorCode, message: string) {
    super(message)
    this.name = 'ChatRequestError'
  }
}

export interface StoredMessageRow {
  id: string
  role: string
  parts: unknown
}

/**
 * Keeps only user/assistant rows with a parts array. `system` rows may exist from the period when
 * the server persisted whatever the client sent, and must never reach the model.
 */
export function toStoredHistory(rows: readonly StoredMessageRow[]): UIMessage[] {
  return rows.flatMap((row) => {
    if ((row.role !== 'user' && row.role !== 'assistant') || !Array.isArray(row.parts)) return []
    return [{ id: row.id, role: row.role, parts: row.parts as UIMessage['parts'] }]
  })
}

interface ApprovalPart {
  type: string
  toolCallId: string
  state: string
  approval?: { id: string, approved?: boolean, reason?: string }
}

function isPendingApproval(part: unknown, approvalToolTypes: ReadonlySet<string>): part is ApprovalPart {
  if (typeof part !== 'object' || part === null) return false
  const candidate = part as Partial<ApprovalPart>
  return typeof candidate.type === 'string'
    && approvalToolTypes.has(candidate.type)
    && candidate.state === 'approval-requested'
    && typeof candidate.toolCallId === 'string'
    && typeof candidate.approval?.id === 'string'
}

export interface MergeResult {
  kind: 'message' | 'approval' | 'regenerate'
  messages: UIMessage[]
  /** New user message to persist before streaming */
  userMessage?: UIMessage
  /** Assistant message whose stored parts changed (stale approvals denied) and must be persisted */
  updatedAssistantMessage?: UIMessage
}

/**
 * Merges the client request into the stored history.
 *
 * - `message`: appended. Approvals still pending in the last assistant message are closed as denied,
 *   so they cannot be approved later and no tool call is left without a result.
 * - `approvals`: each decision must match a pending request (same approval id and tool call id)
 *   in the last stored assistant message, and every pending request must be answered.
 *   The decision is applied to the stored part: the tool input never comes from the client.
 * - `regenerate`: only when the last stored message is from the user (first response of a new chat).
 */
export function mergeIncoming(
  history: readonly UIMessage[],
  body: Pick<ChatRequestBody, 'trigger' | 'message' | 'approvals'>,
  options: { approvalToolTypes: readonly string[] }
): MergeResult {
  const approvalToolTypes = new Set(options.approvalToolTypes)
  const last = history.at(-1)

  if (body.trigger === 'regenerate-message') {
    if (last?.role !== 'user') {
      throw new ChatRequestError('regenerate-invalid', 'Only the first response of a conversation can be regenerated')
    }
    return { kind: 'regenerate', messages: [...history] }
  }

  if (body.approvals) {
    if (last?.role !== 'assistant') {
      throw new ChatRequestError('approval-invalid', 'There is no pending approval')
    }

    const decisions = new Map<string, ApprovalDecision>()
    for (const decision of body.approvals) {
      if (decisions.has(decision.approvalId)) {
        throw new ChatRequestError('approval-invalid', 'Duplicated approval decision')
      }
      decisions.set(decision.approvalId, decision)
    }

    const pending = last.parts.filter(part => isPendingApproval(part, approvalToolTypes)) as ApprovalPart[]
    if (pending.length === 0 || pending.length !== decisions.size) {
      throw new ChatRequestError('approval-invalid', 'Every pending approval must be answered')
    }

    for (const part of pending) {
      const decision = decisions.get(part.approval!.id)
      if (!decision || decision.toolCallId !== part.toolCallId) {
        throw new ChatRequestError('approval-invalid', 'Unknown approval request')
      }
    }

    const parts = last.parts.map((part) => {
      if (!isPendingApproval(part, approvalToolTypes)) return part
      const decision = decisions.get(part.approval!.id)!
      return {
        ...part,
        state: 'approval-responded',
        approval: decision.approved
          ? { id: decision.approvalId, approved: true }
          : { id: decision.approvalId, approved: false, reason: DENIED_BY_VISITOR }
      }
    }) as UIMessage['parts']

    const updated: UIMessage = { ...last, parts }
    return { kind: 'approval', messages: [...history.slice(0, -1), updated] }
  }

  const userMessage: UIMessage = {
    id: body.message!.id,
    role: 'user',
    parts: body.message!.parts.map(part => ({ type: 'text', text: part.text }))
  }

  let updatedAssistantMessage: UIMessage | undefined
  let base = [...history]

  if (last?.role === 'assistant' && last.parts.some(part => isPendingApproval(part, approvalToolTypes))) {
    const parts = last.parts.map(part => isPendingApproval(part, approvalToolTypes)
      ? { ...part, state: 'output-denied', approval: { id: part.approval!.id, approved: false, reason: DENIED_BY_NEW_MESSAGE } }
      : part
    ) as UIMessage['parts']

    updatedAssistantMessage = { ...last, parts }
    base = [...history.slice(0, -1), updatedAssistantMessage]
  }

  return { kind: 'message', messages: [...base, userMessage], userMessage, updatedAssistantMessage }
}

/**
 * Last `size` messages, always starting at a user message so tool call/result pairs stay intact.
 */
export function selectContextWindow<T extends { role: string }>(messages: readonly T[], size: number): T[] {
  if (messages.length <= size) return [...messages]

  let start = messages.length - size
  while (start < messages.length - 1 && messages[start]?.role !== 'user') {
    start++
  }
  return messages.slice(start)
}

/** Plain text of the first user message, bounded, for the title generator */
export function firstUserText(messages: readonly UIMessage[], maxChars: number): string {
  const first = messages.find(message => message.role === 'user')
  if (!first) return ''

  const text = first.parts
    .map(part => (part.type === 'text' ? part.text : ''))
    .join(' ')
    .trim()

  return text.slice(0, maxChars)
}
