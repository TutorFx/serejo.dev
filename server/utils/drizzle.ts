import type { z } from 'zod/v4'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../../server/db/schema'
import { databaseEnvSchema } from './env.schemas'

export { and, desc, eq, or, sql } from 'drizzle-orm'

export { schema }

type DrizzleConfig = Partial<z.infer<typeof databaseEnvSchema>>

let poolInstance: Pool | null = null
let drizzleInstance: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDrizzle(runtimeConfig?: DrizzleConfig) {
  if (drizzleInstance && !runtimeConfig) {
    return drizzleInstance
  }

  const config = runtimeConfig ?? useRuntimeConfig()
  const { databaseUrl } = databaseEnvSchema.parse({
    databaseUrl: config.databaseUrl,
  })

  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  }

  const instance = drizzle(poolInstance, { schema })

  if (!runtimeConfig) {
    drizzleInstance = instance
  }

  return instance
}
