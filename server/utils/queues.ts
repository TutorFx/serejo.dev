import { Queue, Worker, type Processor, type WorkerOptions } from 'bullmq'

export interface ContextualChunkJobData {
  chunkId: string
}

export interface EmbeddingJobData {
  chunkId: string
}

export const QUEUE_NAMES = {
  CONTEXTUAL_CHUNKING: 'contextual-chunking',
  EMBEDDINGS: 'embeddings',
} as const

export function getContextualChunkingQueue(): Queue<ContextualChunkJobData> {
  const connection = useRedis()
  return new Queue<ContextualChunkJobData>(QUEUE_NAMES.CONTEXTUAL_CHUNKING, {
    connection,
    skipVersionCheck: true,
  })
}

export function getEmbeddingsQueue(): Queue<EmbeddingJobData> {
  const connection = useRedis()
  return new Queue<EmbeddingJobData>(QUEUE_NAMES.EMBEDDINGS, {
    connection,
    skipVersionCheck: true,
  })
}

export function createQueueWorker<T>(
  queueName: string,
  processor: Processor<T>,
  opts?: Partial<WorkerOptions>,
): Worker<T> {
  const connection = useRedis()
  return new Worker<T>(queueName, processor, {
    connection,
    skipVersionCheck: true,
    ...opts,
  })
}
