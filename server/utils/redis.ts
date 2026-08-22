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
