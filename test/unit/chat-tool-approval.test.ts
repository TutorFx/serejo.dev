import { simulateReadableStream, streamText, toUIMessageStream } from 'ai'
import type { ModelMessage } from 'ai'
import { MockLanguageModelV4 } from 'ai/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CHAT_TOOL } from '../../shared/utils/constants/chat.constants'
import { buildChatTools, CHAT_TOOL_APPROVAL } from '../../server/utils/chat/tools'

const { requestMeeting } = vi.hoisted(() => ({
  requestMeeting: vi.fn(async (_input: unknown, _context: unknown) => ({
    id: 'event-1',
    summary: 'Interview',
  })),
}))

vi.mock('../../server/utils/calendar/meeting', () => ({
  requestMeeting,
  readCalendarConfig: vi.fn(),
}))

const meetingInput = {
  summary: 'Interview with the visitor',
  description: 'Talk about the open position',
  startTime: '2026-12-01T14:00:00',
  endTime: '2026-12-01T15:00:00',
  attendees: ['visitor@example.com'],
}

/** A model whose only step asks for a meeting */
function modelCallingCreateMeeting() {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          {
            type: 'tool-call',
            toolCallId: 'call-1',
            toolName: CHAT_TOOL.createMeeting,
            input: JSON.stringify(meetingInput),
          },
          {
            type: 'finish',
            finishReason: { unified: 'tool-calls', raw: undefined },
            logprobs: undefined,
            usage: {
              inputTokens: { total: 3, noCache: 3, cacheRead: undefined, cacheWrite: undefined },
              outputTokens: { total: 10, text: 10, reasoning: undefined },
            },
          },
        ],
      }),
    }),
  })
}

/** The stored history of a chat whose last request for a meeting got this decision from the visitor */
function historyWithDecision(approved: boolean): ModelMessage[] {
  return [
    { role: 'user', content: 'Schedule a meeting' },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: 'call-0',
          toolName: CHAT_TOOL.createMeeting,
          input: meetingInput,
        },
        { type: 'tool-approval-request', approvalId: 'approval-0', toolCallId: 'call-0' },
      ],
    },
    {
      role: 'tool',
      content: [{ type: 'tool-approval-response', approvalId: 'approval-0', approved }],
    },
  ]
}

async function chunkTypes(
  toolApproval?: typeof CHAT_TOOL_APPROVAL,
  messages: ModelMessage[] = [{ role: 'user', content: 'Schedule a meeting' }]
) {
  const tools = buildChatTools({
    chatId: 'chat-1',
    ownerHash: 'owner-1',
    timeZone: 'America/Sao_Paulo',
  })
  const result = streamText({
    model: modelCallingCreateMeeting(),
    messages,
    tools,
    toolApproval,
  })

  const types: string[] = []
  const reader = toUIMessageStream({ stream: result.stream, tools }).getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    types.push(value.type)
  }

  return types
}

// Since AI SDK 7 the approval is an option of the `streamText` call instead of the tool definition
describe('createMeeting approval', () => {
  beforeEach(() => {
    requestMeeting.mockClear()
  })

  it('asks the visitor instead of requesting the meeting', async () => {
    const types = await chunkTypes(CHAT_TOOL_APPROVAL)

    expect(types).toContain('tool-approval-request')
    expect(types).not.toContain('tool-output-available')
    expect(requestMeeting).not.toHaveBeenCalled()
  })

  it('requests the meeting once the visitor approves', async () => {
    await chunkTypes(CHAT_TOOL_APPROVAL, historyWithDecision(true))

    expect(requestMeeting).toHaveBeenCalledOnce()
    expect(requestMeeting.mock.calls[0]?.[0]).toEqual(meetingInput)
  })

  it('does not request the meeting when the visitor denies', async () => {
    await chunkTypes(CHAT_TOOL_APPROVAL, historyWithDecision(false))

    expect(requestMeeting).not.toHaveBeenCalled()
  })

  it('is what holds the tool back: without it the meeting is requested right away', async () => {
    const types = await chunkTypes()

    expect(types).not.toContain('tool-approval-request')
    expect(requestMeeting).toHaveBeenCalledOnce()
  })
})
