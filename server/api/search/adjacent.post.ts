import { z } from 'zod/v4'
import { and, eq } from 'drizzle-orm'

const bodySchema = adjacentSearchOptionsSchema.extend({
  chatId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const db = useDrizzle()

  if (body.chatId) {
    const chat = await db.query.chats.findFirst({
      where: () => and(
        eq(schema.chats.id, body.chatId!),
      ),
    })

    if (!chat) {
      throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
    }
  }

  try {
    const adjacent = await getAdjacentChunks(db, {
      documentId: body.documentId,
      chunkIndex: body.chunkIndex,
      direction: body.direction,
      limit: body.limit,
    })

    return adjacent
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Erro ao buscar chunks adjacentes',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar chunks adjacentes',
    })
  }
})
