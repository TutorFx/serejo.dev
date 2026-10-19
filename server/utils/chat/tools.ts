import { tool } from 'ai'
import type { InferUITools, UIDataTypes, UIMessage } from 'ai'
import { CHAT_TOOL } from '#shared/utils/constants/chat.constants'
import type { CalendarToolContext } from '#shared/utils/tools/calendar'
import {
  calendarInputSchema,
  calendarOutputSchema,
  createMeetingInputSchema,
  createMeetingOutputSchema,
} from '#shared/utils/tools/calendar'
import { calculateDateTool, getWeekdayTool } from '#shared/utils/tools/date'
import {
  adjacentSearchInputSchema,
  adjacentSearchOutputSchema,
  hybridSearchInputSchema,
  hybridSearchOutputSchema,
} from '#shared/utils/tools/search'
import { assertAvailabilityDate } from '../calendar/policy'
import { readCalendarConfig, requestMeeting } from '../calendar/meeting'
import { runTool } from './tool-errors'
import { limitAdjacentSearchOutput, limitHybridSearchOutput } from './truncate'

/**
 * Server-only tool set. Every `execute` calls server functions directly with a trusted context
 * built by the route handler (chat id, owner hash, visitor time zone): there is no HTTP hop and
 * no public endpoint behind the tools.
 */
export function buildChatTools(context: CalendarToolContext) {
  return {
    [CHAT_TOOL.calculateDate]: calculateDateTool({ timeZone: context.timeZone }),
    [CHAT_TOOL.getWeekday]: getWeekdayTool({ timeZone: context.timeZone }),

    [CHAT_TOOL.calendar]: tool({
      description:
        'Busca a disponibilidade na agenda de Gabriel Serejo para uma data específica, retornando os blocos livres onde é possível agendar um compromisso.',
      inputSchema: calendarInputSchema,
      outputSchema: calendarOutputSchema,
      strict: true,
      execute: async ({ date }) =>
        runTool(
          CHAT_TOOL.calendar,
          'Não foi possível consultar a agenda agora. Tente novamente em instantes.',
          async () => {
            assertAvailabilityDate(date, { timeZone: context.timeZone })
            const { availabilityCalendarIds } = readCalendarConfig()
            return await getBusyFree({
              date,
              timeZone: context.timeZone,
              calendarIds: availabilityCalendarIds,
            })
          }
        ),
    }),

    [CHAT_TOOL.createMeeting]: tool({
      description:
        'Envia uma solicitação formal de reunião para a agenda do Gabriel Serejo. Requer a aprovação explícita do visitante na interface.',
      inputSchema: createMeetingInputSchema,
      outputSchema: createMeetingOutputSchema,
      strict: true,
      needsApproval: true,
      execute: async input =>
        runTool(
          CHAT_TOOL.createMeeting,
          'Não foi possível enviar a solicitação agora. Tente novamente mais tarde.',
          async () => await requestMeeting(input, context)
        ),
    }),

    [CHAT_TOOL.searchContent]: tool({
      description:
        'Realiza uma busca híbrida inteligente (vetorial densa + busca lexical textual combinadas via Reciprocal Rank Fusion) no acervo de conteúdos, artigos, projetos, histórico e páginas do portfólio de Gabriel Serejo. Suporta filtro opcional por coleção do Nuxt Content.',
      inputSchema: hybridSearchInputSchema,
      outputSchema: hybridSearchOutputSchema,
      strict: true,
      execute: async ({ query, collection, limit, includeAdjacent, distinctByDocument }) =>
        runTool(
          CHAT_TOOL.searchContent,
          'Não foi possível consultar a base de conhecimento agora.',
          async () => {
            const results = await performHybridSearch(useDrizzle(), useAi(), {
              query,
              collection,
              limit,
              includeAdjacent,
              distinctByDocument,
            })

            return limitHybridSearchOutput({
              query,
              collection: collection ?? null,
              count: results.length,
              results: results.map(result => ({
                documentId: result.documentId,
                collection: result.collection,
                index: result.index,
                route: result.route,
                content:
                  result.adjacent?.expandedContent
                  || (result.context
                    ? `[Contexto: ${result.context}]\n${result.content}`
                    : result.content),
              })),
            })
          }
        ),
      // Also applied to outputs replayed from history (stored before these limits existed)
      toModelOutput: ({ output }) => ({ type: 'json', value: limitHybridSearchOutput(output) }),
    }),

    [CHAT_TOOL.adjacentContent]: tool({
      description:
        'Busca os chunks adjacentes (anteriores e/ou posteriores) de um trecho/documento para expandir o contexto de leitura para frente e para trás.',
      inputSchema: adjacentSearchInputSchema,
      outputSchema: adjacentSearchOutputSchema,
      strict: true,
      execute: async ({ documentId, chunkIndex, direction, limit }) =>
        runTool(
          CHAT_TOOL.adjacentContent,
          'Não foi possível expandir o conteúdo agora.',
          async () => {
            const adjacent = await getAdjacentChunks(useDrizzle(), {
              documentId,
              chunkIndex,
              direction,
              limit,
            })
            return limitAdjacentSearchOutput(adjacent)
          }
        ),
      toModelOutput: ({ output }) => ({ type: 'json', value: limitAdjacentSearchOutput(output) }),
    }),
  }
}

export type ChatTools = ReturnType<typeof buildChatTools>

/** UI message typed with the agent tools, used to validate stored history against the tool schemas */
export type ChatUIMessage = UIMessage<unknown, UIDataTypes, InferUITools<ChatTools>>

/** Tools the model may call when scheduling is switched off (history validation still knows all of them) */
export const SCHEDULING_TOOLS = [CHAT_TOOL.calendar, CHAT_TOOL.createMeeting] as const
