/**
 * @fileoverview Ferramentas de IA para integração com Google Calendar (verificação de horários livres e agendamento).
 * Utiliza schemas Zod v4 com validação estrita de ISO datetime e tipos documentados via TSDoc.
 */

import { tool } from 'ai'
import { z } from 'zod/v4'
import type { UIToolInvocation } from 'ai'

// ============================================================================
// 1. SCHEMAS DE DISPONIBILIDADE (CALENDAR)
// ============================================================================

/**
 * Schema de validação dos parâmetros de entrada da ferramenta `calendar`.
 */
export const calendarInputSchema = z.object({
  date: z.iso.date().describe('Data no formato yyyy-MM-dd para verificar a disponibilidade de horários.'),
})

/** Tipo inferido dos parâmetros de entrada para consulta de agenda. */
export type CalendarInput = z.infer<typeof calendarInputSchema>

/**
 * Schema de um bloco de horário retornado pela API do Google Calendar.
 */
export const calendarTimeSlotSchema = z.object({
  start: z.string().describe('Horário inicial do bloco no formato yyyy-MM-ddTHH:mm:ss.'),
  end: z.string().describe('Horário final do bloco no formato yyyy-MM-ddTHH:mm:ss.'),
})

/** Tipo inferido de um bloco de horário. */
export type CalendarTimeSlot = z.infer<typeof calendarTimeSlotSchema>

/**
 * Schema de saída da ferramenta `calendar` com blocos ocupados, livres e sobreposição de fuso.
 */
export const calendarOutputSchema = z.object({
  busy: z.array(calendarTimeSlotSchema).describe('Lista de blocos de horários ocupados no dia.'),
  free: z.array(calendarTimeSlotSchema).describe('Lista de blocos de horários livres no expediente.'),
  overlap: z.number().describe('Diferença em horas entre o fuso horário da sessão e o de Gabriel Serejo.'),
})

/** Tipo inferido do resultado da consulta de disponibilidade. */
export type CalendarOutput = z.infer<typeof calendarOutputSchema>

/**
 * Schema de validação dos argumentos de contexto da fábrica de ferramentas de calendário.
 */
export const calendarToolContextSchema = z.object({
  chatId: z.string().min(1).describe('Identificador único do chat.'),
  timeZone: z.enum(Intl.supportedValuesOf('timeZone')).describe('Fuso horário IANA válido do usuário.'),
})

/** Tipo inferido dos argumentos de contexto para ferramentas de calendário. */
export type CalendarToolContext = z.infer<typeof calendarToolContextSchema>

/** Tipo de invocação de UI para a ferramenta `calendar`. */
export type CalendarUIToolInvocation = UIToolInvocation<ReturnType<typeof calendarTool>>

/**
 * Cria a ferramenta de IA para consulta de agenda e disponibilidade do Gabriel Serejo.
 *
 * @param args - Contexto da requisição contendo `chatId` e `timeZone` da sessão validados via Zod.
 * @returns Instância de ferramenta compatível com Vercel AI SDK.
 */
export const calendarTool = (args: CalendarToolContext) => {
  const { chatId, timeZone } = calendarToolContextSchema.parse(args)

  return tool({
    description: 'Busca a disponibilidade na agenda de Gabriel Serejo para uma data específica, retornando os blocos livres onde é possível agendar um compromisso.',
    inputSchema: calendarInputSchema,
    outputSchema: calendarOutputSchema,
    strict: true,
    execute: async ({ date }) => {
      return await $fetch<CalendarOutput>('/api/calendar/freebusy', {
        method: 'POST',
        body: {
          date,
          timeZone,
          chatId
        }
      })
    }
  })
}

// ============================================================================
// 2. SCHEMAS DE CRIAÇÃO DE REUNIÃO (CREATE MEETING)
// ============================================================================

/**
 * Schema de validação dos parâmetros de entrada para criação de reunião (`createMeeting`).
 */
export const createMeetingInputSchema = z.object({
  summary: z.string().trim().min(3).max(120).describe('Título da reunião (ex: "Reunião: Processo Seletivo - Nome do Visitante").'),
  description: z.string().trim().min(5).describe('Descrição detalhada do motivo da reunião, contendo o contexto abordado na conversa.'),
  startTime: z.iso.datetime({ local: true, offset: true }).describe('Data e hora de início no formato ISO (ex: 2026-09-07T14:00:00).'),
  endTime: z.iso.datetime({ local: true, offset: true }).describe('Data e hora de término no formato ISO (ex: 2026-09-07T15:00:00).'),
  attendees: z.array(z.email()).min(1).describe('Lista contendo estritamente o e-mail do visitante/usuário. NUNCA adicione o e-mail do Gabriel aqui, pois ele é inserido automaticamente no backend.')
})

/** Tipo inferido dos parâmetros de criação de reunião. */
export type CreateMeetingInput = z.infer<typeof createMeetingInputSchema>

/**
 * Schema de saída após a solicitação de criação de reunião no Google Calendar.
 */
export const createMeetingOutputSchema = z.object({
  id: z.string().nullable().optional().describe('Identificador único do evento no Google Calendar.'),
  summary: z.string().nullable().optional().describe('Título confirmado do evento.'),
  start: z.string().nullable().optional().describe('Data e hora inicial confirmada.'),
  end: z.string().nullable().optional().describe('Data e hora final confirmada.'),
})

/** Tipo inferido do resultado da criação de reunião. */
export type CreateMeetingOutput = z.infer<typeof createMeetingOutputSchema>

/** Tipo de invocação de UI para a ferramenta `createMeeting`. */
export type CreateMeetingUIToolInvocation = UIToolInvocation<ReturnType<typeof createMeetingTool>>

/**
 * Cria a ferramenta de IA para solicitação formal de agendamento de reunião com Gabriel Serejo.
 *
 * @param args - Contexto da requisição contendo `chatId` e `timeZone` da sessão validados via Zod.
 * @returns Instância de ferramenta com fluxo de aprovação interativo (`needsApproval: true`).
 */
export const createMeetingTool = (args: CalendarToolContext) => {
  const { chatId, timeZone } = calendarToolContextSchema.parse(args)

  return tool({
    description: 'Envia uma solicitação formal de reunião para a agenda do Gabriel Serejo.',
    inputSchema: createMeetingInputSchema,
    outputSchema: createMeetingOutputSchema,
    strict: true,
    execute: async ({ summary, description, startTime, endTime, attendees }) => {
      return await $fetch<CreateMeetingOutput>('/api/calendar/meet', {
        method: 'POST',
        body: {
          summary,
          description,
          startTime,
          endTime,
          timeZone,
          attendees,
          chatId
        }
      })
    },
    needsApproval: true
  })
}
