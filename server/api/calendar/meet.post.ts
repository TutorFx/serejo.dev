import { z } from 'zod/v4'
import { and, eq } from 'drizzle-orm'
import { TZDate } from '@date-fns/tz'
import { isBefore, addMinutes, format } from 'date-fns'

const bodySchema = z.object({
  startTime: z.iso.datetime({ local: true, offset: true }),
  endTime: z.iso.datetime({ local: true, offset: true }),
  summary: z.string().trim().min(3).max(120),
  description: z.string().trim().min(5),
  timeZone: z.enum(Intl.supportedValuesOf('timeZone')),
  chatId: z.string().min(1),
  attendees: z.array(z.email()).min(1),
}).refine(data => data.endTime > data.startTime, {
  message: 'O horário de término (endTime) deve ser posterior ao horário de início (startTime).',
  path: ['endTime'],
})

export default defineEventHandler(async (event) => {
  const { summary, description, startTime, endTime, timeZone, attendees, chatId } = await readValidatedBody(event, bodySchema.parse)

  const start = new TZDate(startTime, timeZone)
  const end = new TZDate(endTime, timeZone)
  const now = new TZDate(new Date(), timeZone)
  const minimumStartTime = addMinutes(now, CALENDAR_CONFIG.minAdvanceMinutes)

  if (isBefore(start, minimumStartTime)) {
    throw createError({ statusCode: 400, statusMessage: `Não é possível agendar reuniões no passado ou com menos de ${CALENDAR_CONFIG.minAdvanceMinutes} minutos de antecedência.` })
  }

  const db = useDrizzle()

  const chat = await db.query.chats.findFirst({
    where: () => and(
      eq(schema.chats.id, chatId),
    )
  })

  if (!chat) throw createError({ statusCode: 404, statusMessage: 'Chat not found' })

  const config = useRuntimeConfig()
  const { calendarId } = googleCalendarEnvSchema.parse({
    calendarId: config.google.calendarId,
  })

  // Checar disponibilidade exata com o getBusyFree antes de agendar
  const dateStr = format(start, 'yyyy-MM-dd')
  const requestedStartStr = format(start, 'yyyy-MM-dd\'T\'HH:mm:ss')
  const requestedEndStr = format(end, 'yyyy-MM-dd\'T\'HH:mm:ss')

  const { free } = await getBusyFree({ date: dateStr, timeZone, calendarId })

  const isAvailable = free.some(block =>
    block.start <= requestedStartStr && block.end >= requestedEndStr
  )

  if (!isAvailable) {
    throw createError({ statusCode: 409, statusMessage: 'O horário selecionado não está mais disponível. Por favor, escolha outro horário.' })
  }

  try {
    return await createMeeting({
      summary,
      description,
      startTime,
      endTime,
      timeZone,
      attendees,
      calendarId
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({ statusCode: 500, statusMessage: error.message || 'Erro ao criar evento na API do Google Calendar' })
    }

    throw createError({ statusCode: 500, statusMessage: 'Erro ao criar evento na API do Google Calendar' })
  }
})
