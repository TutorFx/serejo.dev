import {
  Queue,
  Worker,
  type Processor,
  type QueueOptions,
  type WorkerOptions,
} from 'bullmq'

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

export const DEFAULT_QUEUE_OPTIONS: Partial<QueueOptions> = {
  skipVersionCheck: true,
  streams: {
    events: {
      maxLen: 50,
    },
  },
  defaultJobOptions: {
    removeOnComplete: {
      count: 20,
      age: 3600,
    },
    removeOnFail: {
      count: 50,
      age: 86400,
    },
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
}

let contextualChunkingQueue: Queue<ContextualChunkJobData> | null = null
let embeddingsQueue: Queue<EmbeddingJobData> | null = null

export function getContextualChunkingQueue(): Queue<ContextualChunkJobData> {
  if (!contextualChunkingQueue) {
    const connection = useRedis()
    contextualChunkingQueue = new Queue<ContextualChunkJobData>(QUEUE_NAMES.CONTEXTUAL_CHUNKING, {
      connection,
      ...DEFAULT_QUEUE_OPTIONS,
    })
  }
  return contextualChunkingQueue
}

export function getEmbeddingsQueue(): Queue<EmbeddingJobData> {
  if (!embeddingsQueue) {
    const connection = useRedis()
    embeddingsQueue = new Queue<EmbeddingJobData>(QUEUE_NAMES.EMBEDDINGS, {
      connection,
      ...DEFAULT_QUEUE_OPTIONS,
    })
  }
  return embeddingsQueue
}

export async function closeQueues(): Promise<void> {
  const closePromises: Promise<void>[] = []
  if (contextualChunkingQueue) {
    closePromises.push(contextualChunkingQueue.close())
    contextualChunkingQueue = null
  }
  if (embeddingsQueue) {
    closePromises.push(embeddingsQueue.close())
    embeddingsQueue = null
  }
  await Promise.all(closePromises)
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
    drainDelay: 10,
    stalledInterval: 120000,
    lockDuration: 60000,
    ...opts,
  })
}
