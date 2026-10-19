import { DefaultChatTransport, isToolUIPart } from 'ai'
import type { UIMessage } from 'ai'

/**
 * Chat transport that never sends the conversation history: the server rebuilds it from the database.
 *
 * - new message: only the text parts of the last user message
 * - approval turn (`addToolApprovalResponse` updates the last assistant message in place):
 *   only the decisions, identified by approval id and tool call id
 * - regenerate: nothing besides the trigger
 */
export function createChatTransport(chatId: string) {
  return new DefaultChatTransport<UIMessage>({
    api: `/api/chats/${chatId}`,
    headers: () => {
      const { csrf, headerName } = useCsrf()
      const headers: Record<string, string> = {}
      if (csrf && headerName) headers[headerName] = csrf
      return headers
    },
    prepareSendMessagesRequest: ({ messages, trigger, messageId }) => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

      if (trigger === 'regenerate-message') {
        return { body: { trigger, messageId, timeZone } }
      }

      const last = messages.at(-1)

      if (last?.role === 'assistant') {
        const approvals = last.parts.flatMap(part =>
          isToolUIPart(part) && part.state === 'approval-responded'
            ? [
                {
                  toolCallId: part.toolCallId,
                  approvalId: part.approval.id,
                  approved: part.approval.approved,
                },
              ]
            : []
        )
        return { body: { trigger, messageId, timeZone, approvals } }
      }

      return {
        body: {
          trigger,
          messageId,
          timeZone,
          message: last && {
            id: last.id,
            role: last.role,
            parts: last.parts.flatMap(part =>
              part.type === 'text' ? [{ type: 'text', text: part.text }] : []
            ),
          },
        },
      }
    },
  })
}
