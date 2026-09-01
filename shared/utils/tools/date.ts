/**
 * @fileoverview Ferramentas de cálculo de datas e resolução de dias da semana para o agente de IA.
 * Utiliza o date-fns com suporte a fuso horário (@date-fns/tz) e validação matemática precisa com Zod v4.
 */

import { tool } from 'ai'
import { z } from 'zod/v4'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  isSameDay,
  nextDay,
  previousDay,
  setDay,
  subWeeks,
} from 'date-fns'
import type { Day } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'
import { TZDate } from '@date-fns/tz'
import type { UIToolInvocation } from 'ai'
import {
  DATE_UNITS_ARRAY,
  DEFAULT_DATE_UNIT,
  DAYS_OF_WEEK_ARRAY,
  WEEKDAY_OCCURRENCES_ARRAY,
  DEFAULT_WEEKDAY_OCCURRENCE,
} from '../constants/chat.constants'
import type { DayOfWeek } from '../constants/chat.constants'

// ============================================================================
// 1. CÁLCULO DE DATAS RELATIVAS (CALCULATE DATE)
// ============================================================================

/**
 * Schema Zod v4 para a unidade de tempo de cálculo relativo.
 */
export const dateUnitSchema = z.enum(DATE_UNITS_ARRAY)

/**
 * Schema de entrada da ferramenta `calculateDate`.
 */
export const calculateDateInputSchema = z.object({
  amount: z.number().int().describe('Quantidade inteira a ser calculada. Use números positivos para datas futuras (ex: 1 para amanhã com unit "days", 7 para daqui a 1 semana, 45 para daqui a 45 dias) ou negativos para o passado (ex: -1 para ontem).'),
  unit: dateUnitSchema.default(DEFAULT_DATE_UNIT).describe('Unidade temporal: "days" (dias), "weeks" (semanas), "months" (meses) ou "years" (anos).'),
  baseDate: z.iso.date().optional().describe('Data base de referência no formato yyyy-MM-dd. Se não informada, utiliza automaticamente a data atual da sessão do usuário.'),
})

/** Tipo inferido dos parâmetros de entrada para cálculo relativo de data. */
export type CalculateDateInput = z.infer<typeof calculateDateInputSchema>

/**
 * Schema de saída da ferramenta `calculateDate` com formatações localizadas e metadados.
 */
export const calculateDateOutputSchema = z.object({
  date: z.iso.date().describe('Data calculada no formato yyyy-MM-dd.'),
  iso: z.iso.datetime().describe('Data calculada em formato ISO completo.'),
  dayOfWeek: z.string().describe('Nome do dia da semana em português.'),
  formattedPtBR: z.string().describe('Data formatada por extenso em português.'),
  formattedEnUS: z.string().describe('Data formatada por extenso em inglês.'),
  timeZone: z.string().describe('Fuso horário considerado no cálculo.'),
})

/**
 * Schema de validação do contexto para ferramentas de cálculo de data.
 */
export const dateToolContextSchema = z.object({
  timeZone: z.enum(Intl.supportedValuesOf('timeZone')).describe('Fuso horário IANA válido do usuário.'),
})

/** Tipo inferido do contexto das ferramentas de cálculo de data. */
export type DateToolContext = z.infer<typeof dateToolContextSchema>

/** Tipo inferido do resultado de cálculo relativo de data. */
export type CalculateDateOutput = z.infer<typeof calculateDateOutputSchema>

/** Tipo de invocação de UI para a ferramenta `calculateDate`. */
export type CalculateDateUIToolInvocation = UIToolInvocation<ReturnType<typeof calculateDateTool>>

/**
 * Cria a ferramenta de IA para cálculo de datas relativas com precisão matemática.
 *
 * @param args - Configuração de contexto contendo o `timeZone` da sessão validado via Zod.
 * @returns Ferramenta pronta para registro no Vercel AI SDK.
 */
export const calculateDateTool = (args: DateToolContext) => {
  const { timeZone } = dateToolContextSchema.parse(args)

  return tool({
    description: 'Calcula datas com precisão matemática a partir de deslocamentos temporais (dias, semanas, meses, anos) em relação à data atual ou a uma data de referência.',
    inputSchema: calculateDateInputSchema,
    outputSchema: calculateDateOutputSchema,
    strict: true,
    execute: async ({ amount, unit, baseDate }) => {
      const base = baseDate
        ? new TZDate(`${baseDate}T12:00:00`, timeZone)
        : new TZDate(new Date(), timeZone)

      let targetDate: Date

      switch (unit) {
        case 'days':
          targetDate = addDays(base, amount)
          break
        case 'weeks':
          targetDate = addWeeks(base, amount)
          break
        case 'months':
          targetDate = addMonths(base, amount)
          break
        case 'years':
          targetDate = addYears(base, amount)
          break
      }

      const output: CalculateDateOutput = {
        date: format(targetDate, 'yyyy-MM-dd'),
        iso: targetDate.toISOString(),
        dayOfWeek: format(targetDate, 'EEEE', { locale: ptBR }),
        formattedPtBR: format(targetDate, 'dd \'de\' MMMM \'de\' yyyy (EEEE)', { locale: ptBR }),
        formattedEnUS: format(targetDate, 'MMMM do, yyyy (EEEE)', { locale: enUS }),
        timeZone,
      }

      return output
    },
  })
}

// ============================================================================
// 2. RESOLUÇÃO DE DIAS DA SEMANA (GET WEEKDAY)
// ============================================================================

/**
 * Schema Zod v4 dos dias da semana permitidos.
 */
export const dayOfWeekSchema = z.enum(DAYS_OF_WEEK_ARRAY)

/**
 * Schema Zod v4 das ocorrências de dia da semana permitidas.
 */
export const weekdayOccurrenceSchema = z.enum(WEEKDAY_OCCURRENCES_ARRAY)

/** Mapeamento de dia da semana para índice numérico de 0 a 6 compatível com o date-fns. */
const DAY_OF_WEEK_MAP: Record<DayOfWeek, Day> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

/**
 * Schema de entrada da ferramenta `getWeekday`.
 */
export const getWeekdayInputSchema = z.object({
  day: dayOfWeekSchema.describe('Dia da semana a ser consultado: "sunday" (domingo), "monday" (segunda), "tuesday" (terça), "wednesday" (quarta), "thursday" (quinta), "friday" (sexta), "saturday" (sábado).'),
  occurrence: weekdayOccurrenceSchema.default(DEFAULT_WEEKDAY_OCCURRENCE).describe('Ocorrência desejada: "next" (próxima ocorrência do dia), "previous" (ocorrência anterior) ou "this_week" (o dia correspondente na semana atual, considerando segunda a domingo).'),
  offsetWeeks: z.number().int().min(0).default(0).describe('Deslocamento adicional de semanas. 0 para a ocorrência imediata, 1 para dali a mais uma semana (ex: "na sexta-feira da outra semana").'),
  baseDate: z.iso.date().optional().describe('Data base de referência no formato yyyy-MM-dd. Se não informada, utiliza automaticamente a data atual da sessão do usuário.'),
})

/** Tipo inferido dos parâmetros de entrada para consulta de dia da semana. */
export type GetWeekdayInput = z.infer<typeof getWeekdayInputSchema>

/**
 * Schema de saída da ferramenta `getWeekday`.
 */
export const getWeekdayOutputSchema = z.object({
  date: z.iso.date().describe('Data exata calculada no formato yyyy-MM-dd.'),
  iso: z.iso.datetime().describe('Data calculada em formato ISO completo.'),
  dayOfWeek: dayOfWeekSchema.describe('Identificador do dia da semana consultado.'),
  dayOfWeekPtBR: z.string().describe('Nome do dia da semana por extenso em português.'),
  formattedPtBR: z.string().describe('Data formatada por extenso em português.'),
  formattedEnUS: z.string().describe('Data formatada por extenso em inglês.'),
  isToday: z.boolean().describe('Indica se a data calculada corresponde ao dia de hoje na sessão.'),
  timeZone: z.string().describe('Fuso horário considerado no cálculo.'),
})

/** Tipo inferido do resultado de consulta de dia da semana. */
export type GetWeekdayOutput = z.infer<typeof getWeekdayOutputSchema>

/** Tipo de invocação de UI para a ferramenta `getWeekday`. */
export type GetWeekdayUIToolInvocation = UIToolInvocation<ReturnType<typeof getWeekdayTool>>

/**
 * Cria a ferramenta de IA para resolução exata de dias da semana usando enum e cálculo matemático.
 *
 * @param args - Configuração de contexto contendo o `timeZone` da sessão validado via Zod.
 * @returns Ferramenta pronta para registro no Vercel AI SDK.
 */
export const getWeekdayTool = (args: DateToolContext) => {
  const { timeZone } = dateToolContextSchema.parse(args)

  return tool({
    description: 'Calcula com precisão matemática a data exata de um dia da semana (ex: "próxima quarta-feira", "sexta-feira que vem", "segunda passada", "terça desta semana") usando um enum de dias da semana.',
    inputSchema: getWeekdayInputSchema,
    outputSchema: getWeekdayOutputSchema,
    strict: true,
    execute: async ({ day, occurrence, offsetWeeks, baseDate }) => {
      const base = baseDate
        ? new TZDate(`${baseDate}T12:00:00`, timeZone)
        : new TZDate(new Date(), timeZone)

      const targetDayIndex = DAY_OF_WEEK_MAP[day]
      let targetDate: Date

      switch (occurrence) {
        case 'next': {
          targetDate = nextDay(base, targetDayIndex)
          if (offsetWeeks > 0) {
            targetDate = addWeeks(targetDate, offsetWeeks)
          }
          break
        }
        case 'previous': {
          targetDate = previousDay(base, targetDayIndex)
          if (offsetWeeks > 0) {
            targetDate = subWeeks(targetDate, offsetWeeks)
          }
          break
        }
        case 'this_week': {
          targetDate = setDay(base, targetDayIndex, { weekStartsOn: 1 })
          if (offsetWeeks > 0) {
            targetDate = addWeeks(targetDate, offsetWeeks)
          }
          break
        }
      }

      const output: GetWeekdayOutput = {
        date: format(targetDate, 'yyyy-MM-dd'),
        iso: targetDate.toISOString(),
        dayOfWeek: day,
        dayOfWeekPtBR: format(targetDate, 'EEEE', { locale: ptBR }),
        formattedPtBR: format(targetDate, 'dd \'de\' MMMM \'de\' yyyy (EEEE)', { locale: ptBR }),
        formattedEnUS: format(targetDate, 'MMMM do, yyyy (EEEE)', { locale: enUS }),
        isToday: isSameDay(targetDate, base),
        timeZone,
      }

      return output
    },
  })
}
