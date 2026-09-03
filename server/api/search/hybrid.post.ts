import { z } from 'zod/v4'
import { and, eq } from 'drizzle-orm'
import { consola } from 'consola'

const logger = consola.withTag('api:search:hybrid')

const bodySchema = hybridSearchOptionsSchema.extend({
  chatId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const reqStart = performance.now()
  const body = await readValidatedBody(event, bodySchema.parse)

  const db = useDrizzle()
  const ai = useAi()

  if (body.chatId) {
    const chatStart = performance.now()
    const chat = await db.query.chats.findFirst({
      where: () => and(
        eq(schema.chats.id, body.chatId!),
      ),
    })

    if (!chat) {
      throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
    }
    logger.info(`Chat check for ${body.chatId} took ${(performance.now() - chatStart).toFixed(2)}ms`)
  }

  try {
    const results = await performHybridSearch(db, ai, {
      query: body.query,
      collection: body.collection,
      limit: body.limit,
      includeAdjacent: body.includeAdjacent,
      distinctByDocument: body.distinctByDocument,
      maxChunksPerDocument: body.maxChunksPerDocument,
    })

    const totalDuration = (performance.now() - reqStart).toFixed(2)
    logger.success(`POST /api/search/hybrid finished in ${totalDuration}ms for query "${body.query}" (${results.length} results)`)

    return {
      query: body.query,
      collection: body.collection ?? null,
      count: results.length,
      results: results.map(r => ({
        documentId: r.documentId,
        collection: r.collection,
        index: r.index,
        route: r.route,
        content: r.adjacent?.expandedContent || (r.context ? `[Contexto: ${r.context}]\n${r.content}` : r.content),
      })),
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Erro ao realizar a busca híbrida',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao realizar a busca híbrida',
    })
  }
})
