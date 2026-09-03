import { embed, generateText } from 'ai'
import { consola } from 'consola'
import { asc, eq } from 'drizzle-orm'
import {
  closeQueues,
  createQueueWorker,
  getEmbeddingsQueue,
  QUEUE_NAMES,
  type ContextualChunkJobData,
  type EmbeddingJobData,
} from '~~/server/utils/queues'

export default defineNitroPlugin(async (nitro) => {
  if (import.meta.prerender) {
    return
  }

  const logger = consola.withTag('bullmq')
  const contextualChunkLogger = logger.withTag('ContextualChunking')
  const embeddingsLogger = logger.withTag('Embeddings')

  let contextualWorker: ReturnType<typeof createQueueWorker<ContextualChunkJobData>> | null = null
  let embeddingsWorker: ReturnType<typeof createQueueWorker<EmbeddingJobData>> | null = null

  try {
    const db = useDrizzle()
    const ai = useAi()

    // 1. Worker para Contextual Chunking (Gemini 2.5 Flash)
    contextualWorker = createQueueWorker<ContextualChunkJobData>(
      QUEUE_NAMES.CONTEXTUAL_CHUNKING,
      async (job) => {
        const { chunkId } = job.data

        const currentChunk = await db.query.documentChunks.findFirst({
          where: (chunks, { eq }) => eq(chunks.id, chunkId),
        })
        if (!currentChunk) {
          logger.warn(`[ContextualChunking] Chunk not found: ${chunkId}`)
          return
        }

        // Reconstrói o documento completo a partir de todos os seus chunks no banco
        const docChunks = await db
          .select({
            content: schema.documentChunks.content,
          })
          .from(schema.documentChunks)
          .where(eq(schema.documentChunks.documentId, currentChunk.documentId))
          .orderBy(asc(schema.documentChunks.index))

        const wholeDocument = docChunks.length > 0
          ? docChunks.map(c => c.content).join('\n\n')
          : currentChunk.content

        const prompt = `<document>
 ${wholeDocument}
</document>

Here is the chunk we want to situate within the whole document:
<chunk>
 ${currentChunk.content}
</chunk>

Please provide a short, succinct context to situate this chunk within the overall document for the purposes of improving search retrieval of the chunk.

CRITICAL RULES:
- Focus ONLY on describing where this chunk fits in the broader document (e.g., its topic, section, or relation to the overall narrative).
- DO NOT explain, expand, or guess the meaning of acronyms, abbreviations, or technical terms. If an acronym is not expanded in the text, leave it as is.
- Base your context STRICTLY on the provided document. Do not introduce outside knowledge.
- Answer only with the succinct context and nothing else.`

        const { text: context } = await generateText({
          model: ai.llm,
          prompt,
        })

        const cleanedContext = context.trim()

        await db
          .update(schema.documentChunks)
          .set({ context: cleanedContext })
          .where(eq(schema.documentChunks.id, chunkId))

        contextualChunkLogger.log(`Processed chunk ${chunkId}`)

        if (!import.meta.prerender) {
          const embeddingsQueue = getEmbeddingsQueue()
          await embeddingsQueue.add('process-embedding', { chunkId })
        }
      },
      { concurrency: 3 },
    )

    // 2. Worker para Embeddings
    embeddingsWorker = createQueueWorker<EmbeddingJobData>(
      QUEUE_NAMES.EMBEDDINGS,
      async (job) => {
        const { chunkId } = job.data

        const currentChunk = await db.query.documentChunks.findFirst({
          where: (chunks, { eq }) => eq(chunks.id, chunkId),
        })
        if (!currentChunk) {
          embeddingsLogger.warn(`Chunk not found: ${chunkId}`)
          return
        }

        // Regra estrita: NUNCA embedar texto sem contexto válido
        if (!currentChunk.context || !currentChunk.context.trim()) {
          embeddingsLogger.warn(`Skipped chunk ${chunkId}: missing valid context.`)
          return
        }

        const textToEmbed = `${currentChunk.context.trim()}\n\n${currentChunk.content}`

        const { embedding } = await embed({
          model: ai.embeddingModel,
          value: textToEmbed,
          providerOptions: {
            google: {
              outputDimensionality: 2000,
            },
          },
        })

        await db
          .update(schema.documentChunks)
          .set({ embedding })
          .where(eq(schema.documentChunks.id, chunkId))

        embeddingsLogger.log(`Generated embedding for chunk ${chunkId}`)
      },
      { concurrency: 5 },
    )

    contextualWorker.on('failed', (job, err) => {
      contextualChunkLogger.error(`Job ${job?.id} failed:`, err)
    })

    embeddingsWorker.on('failed', (job, err) => {
      embeddingsLogger.error(`Job ${job?.id} failed:`, err)
    })

    logger.success('BullMQ workers initialized successfully.')
  } catch (error) {
    logger.error('Failed to initialize BullMQ workers:', error)
  }

  // Graceful shutdown
  nitro.hooks.hook('close', async () => {
    logger.info('Shutting down BullMQ workers and queues...')
    if (contextualWorker) {
      await contextualWorker.close()
    }
    if (embeddingsWorker) {
      await embeddingsWorker.close()
    }
    await closeQueues()
  })
})
