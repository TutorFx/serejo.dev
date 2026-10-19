import type { z } from 'zod/v4'
import Redis from 'ioredis'
import { redisEnvSchema } from './env.schemas'

type RedisConfig = Partial<z.infer<typeof redisEnvSchema>>

let redisInstance: Redis | null = null

export function useRedis(runtimeConfig?: RedisConfig): Redis {
  if (redisInstance && !runtimeConfig) {
    return redisInstance
  }

  const config = runtimeConfig ?? useRuntimeConfig()
  const { redisUrl } = redisEnvSchema.parse({
    redisUrl: config.redisUrl,
  })

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: false,
  })

  if (!runtimeConfig) {
    redisInstance = client
  }

  return client
}

let rateLimitInstance: Redis | null = null
let lastRateLimitErrorLog = 0

/**
 * Dedicated client for request-path security checks (rate limits, locks, budgets).
 * The shared client uses `maxRetriesPerRequest: null` (required by BullMQ), which would make
 * requests hang while Redis is down; this one fails fast so callers can fall back.
 */
export function useRateLimitRedis(): Redis {
  if (rateLimitInstance) {
    return rateLimitInstance
  }

  const { redisUrl } = redisEnvSchema.parse({
    redisUrl: useRuntimeConfig().redisUrl,
  })

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    commandTimeout: 500,
    lazyConnect: false,
  })

  // Without a listener ioredis reports every reconnection failure as an unhandled error event
  client.on('error', (error: Error) => {
    const now = Date.now()
    if (now - lastRateLimitErrorLog > 60_000) {
      lastRateLimitErrorLog = now
      console.warn('[security] rate-limit Redis unavailable:', error.message)
    }
  })

  rateLimitInstance = client
  return client
}
