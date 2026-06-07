import { tool } from 'ai'
import { z } from 'zod'
import type { UIToolInvocation } from 'ai'

export type CalendarUIToolInvocation = UIToolInvocation<ReturnType<typeof calendarTool>>

export const calendarTool = (args: { chatId: string, timeZone: string }) => tool({
  description: 'Busca a disponibilidade na agenda de Gabriel Serejo para uma data específica, retornando os blocos livres onde é possível agendar um compromisso.',
  inputSchema: z.object({
    date: z.iso.date().describe('Data no formato yyyy-MM-dd.'),
  }),
  strict: true,
  execute: async ({ date }) => {
    const { chatId, timeZone } = args
    return await $fetch('/api/calendar/freebusy', {
      method: 'POST',
      body: {
        date,
        timeZone,
        chatId
      }
    })
  }
})

export type CreateMeetingUIToolInvocation = UIToolInvocation<ReturnType<typeof createMeetingTool>>

export const createMeetingTool = (args: { chatId: string, timeZone: string }) => tool({
  description: 'Envia uma solicitação formal de reunião para a agenda do Gabriel Serejo.',
  inputSchema: z.object({
    summary: z.string().describe('Título da reunião'),
    description: z.string().describe('Descrição detalhada do motivo da reunião, contendo o contexto abordado na conversa.'),
    startTime: z.string().describe('Data e hora de início no formato ISO (ex: 2026-06-06T14:00:00)'),
    endTime: z.string().describe('Data e hora de término no formato ISO (ex: 2026-06-06T15:00:00)'),
    attendees: z.array(z.email()).describe('Lista de e-mails dos convidados')
  }),
  strict: true,
  execute: async ({ summary, description, startTime, endTime, attendees }) => {
    const { chatId, timeZone } = args
    return await $fetch('/api/calendar/meet', {
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
