import type { CalendarToolContext, CreateMeetingInput, CreateMeetingOutput } from '#shared/utils/tools/calendar'
import { createMeetingInputSchema } from '#shared/utils/tools/calendar'
import { ABUSE_LIMITS } from '#shared/utils/constants/chat.constants'
import { PublicToolError } from '../chat/tool-errors'
import { assertMeetingPolicy } from './policy'

const DAY_SEC = 24 * 60 * 60

/** Write target and availability sources, from runtimeConfig */
export function readCalendarConfig() {
  const { google } = useRuntimeConfig()
  return googleCalendarEnvSchema.parse({
    calendarId: google.calendarId,
    availabilityCalendarId: google.availabilityCalendarId
  })
}

/**
 * Creates a meeting request after re-validating every rule on the server:
 * business window, live availability, one request per chat and daily quotas.
 * Attendees are written only in the description, so Google never e-mails third parties.
 */
export async function requestMeeting(rawInput: CreateMeetingInput, context: CalendarToolContext): Promise<CreateMeetingOutput> {
  const { schedulingEnabled } = await getChatAvailability()
  if (!schedulingEnabled) {
    throw new PublicToolError('O agendamento pelo assistente está temporariamente indisponível. Sugira ao visitante o link de agendamento do site.')
  }

  // An approved call runs with the input stored in the approval request, which history validation does not
  // check: parse it again so a request persisted before the hardening cannot bypass the schema
  const parsed = createMeetingInputSchema.safeParse(rawInput)
  if (!parsed.success) {
    throw new PublicToolError('Os dados da solicitação de reunião são inválidos. Colete novamente nome, e-mail e motivo e gere uma nova solicitação.')
  }
  const input = parsed.data

  const window = assertMeetingPolicy(input, { timeZone: context.timeZone })
  const { calendarId, availabilityCalendarIds } = readCalendarConfig()

  const { free } = await getBusyFree({ date: window.date, timeZone: context.timeZone, calendarIds: availabilityCalendarIds })
  const isAvailable = free.some(block => block.start <= window.startWallClock && block.end >= window.endWallClock)
  if (!isAvailable) {
    throw new PublicToolError('O horário selecionado não está mais disponível. Por favor, escolha outro horário.')
  }

  // Atomic reservation: a second approval (or a parallel request) for the same chat fails here
  const chatKey = `meet:chat:${context.chatId}`
  if (!await securityStore.reserve(chatKey, ABUSE_LIMITS.meetings.perChatTtlSec)) {
    logSecurityEvent('meeting-limit', { scope: 'chat', owner: context.ownerHash })
    throw new PublicToolError('Já existe uma solicitação de reunião enviada nesta conversa. O Gabriel responderá por e-mail.')
  }

  try {
    const perSession = await securityStore.consume(`meet:s:${context.ownerHash}`, ABUSE_LIMITS.meetings.perSessionPerDay, DAY_SEC)
    if (!perSession.allowed) {
      logSecurityEvent('meeting-limit', { scope: 'session', owner: context.ownerHash })
      throw new PublicToolError('O limite diário de solicitações de reunião foi atingido. Tente novamente amanhã.')
    }

    const global = await securityStore.consume('meet:global', ABUSE_LIMITS.meetings.globalPerDay, DAY_SEC)
    if (!global.allowed) {
      logSecurityEvent('meeting-limit', { scope: 'global' })
      throw new PublicToolError('A agenda atingiu o limite diário de novas solicitações. Tente novamente amanhã.')
    }

    return await createMeeting({
      calendarId,
      summary: input.summary,
      // Audit trail: the request came from the site assistant and its content was typed by the visitor
      description: `[Solicitação via assistente do site | chat ${context.chatId} | conteúdo informado pelo visitante, não verificado]\n\n${input.description}`,
      startTime: input.startTime,
      endTime: input.endTime,
      timeZone: context.timeZone,
      attendees: input.attendees
    })
  } catch (error) {
    await securityStore.release(chatKey)
    throw error
  }
}
