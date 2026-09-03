import { z } from 'zod/v4'
import { and, eq } from 'drizzle-orm'

const bodySchema = z.object({
  date: z.iso.date(),
  timeZone: z.enum(Intl.supportedValuesOf('timeZone')),
  chatId: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const db = useDrizzle()

  const chat = await db.query.chats.findFirst({
    where: () => and(
      eq(schema.chats.id, body.chatId),
    )
  })

  if (!chat) throw createError({ statusCode: 404, statusMessage: 'Chat not found' })

  const config = useRuntimeConfig()
  const { calendarId } = googleCalendarEnvSchema.parse({
    calendarId: config.google.calendarId,
  })

  try {
    return await getBusyFree({ ...body, calendarId })
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({ statusCode: 500, statusMessage: error.message || 'Erro ao consultar a API' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Erro ao consultar a API' })
  }
})
