import { consola } from 'consola'
import { isNull } from 'drizzle-orm'
import { getContextualChunkingQueue } from '~~/server/utils/queues'

interface FeedTaskResult {
  enqueued?: number
  error?: string
}

export default defineTask<FeedTaskResult>({
  meta: {
    name: 'db:feed-contextual-chunks',
    description: 'Enfileira chunks pendentes de contextualização (context IS NULL) no BullMQ',
  },
  async run() {
    const logger = consola.withTag('feed-contextual-chunks')

    try {
      const db = useDrizzle()
      const contextualQueue = getContextualChunkingQueue()

      const pendingContextChunks = await db
        .select({
          id: schema.documentChunks.id,
        })
        .from(schema.documentChunks)
        .where(isNull(schema.documentChunks.context))
        .limit(15)

      if (pendingContextChunks.length > 0) {
        await contextualQueue.addBulk(
          pendingContextChunks.map(chunk => ({
            name: 'process-context',
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
        logger.info(`Enqueued ${pendingContextChunks.length} chunk(s) for contextual processing`)
      }

      return {
        result: {
          enqueued: pendingContextChunks.length,
        },
      }
    } catch (error) {
      logger.error('Error feeding contextual chunks:', error)
      return {
        result: {
          error: error instanceof Error ? error.message : String(error),
        },
      }
    }
  },
})
