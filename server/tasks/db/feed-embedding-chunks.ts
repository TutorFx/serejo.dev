import { consola } from 'consola'
import { and, isNotNull, isNull, sql } from 'drizzle-orm'
import { getEmbeddingsQueue } from '~~/server/utils/queues'

interface FeedTaskResult {
  enqueued?: number
  error?: string
}

export default defineTask<FeedTaskResult>({
  meta: {
    name: 'db:feed-embedding-chunks',
    description: 'Enfileira chunks pendentes de embedding (embedding IS NULL e context preenchido) no BullMQ',
  },
  async run() {
    const logger = consola.withTag('feed-embedding-chunks')

    try {
      const db = useDrizzle()
      const embeddingsQueue = getEmbeddingsQueue()

      const pendingEmbeddingChunks = await db
        .select({
          id: schema.documentChunks.id,
        })
        .from(schema.documentChunks)
        .where(
          and(
            isNull(schema.documentChunks.embedding),
            isNotNull(schema.documentChunks.context),
            sql`trim(${schema.documentChunks.context}) != ''`,
          ),
        )
        .limit(15)

      if (pendingEmbeddingChunks.length > 0) {
        await embeddingsQueue.addBulk(
          pendingEmbeddingChunks.map(chunk => ({
            name: 'process-embedding',
            data: {
              chunkId: chunk.id,
            },
            opts: {
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 3000,
              },
              removeOnComplete: true,
              removeOnFail: true,
            },
          })),
        )
        logger.info(`Enqueued ${pendingEmbeddingChunks.length} chunk(s) for embeddings`)
      }

      return {
        result: {
          enqueued: pendingEmbeddingChunks.length,
        },
      }
    } catch (error) {
      logger.error('Error feeding embedding chunks:', error)
      return {
        result: {
          error: error instanceof Error ? error.message : String(error),
        },
      }
    }
  },
})
