import type { z } from 'zod/v4'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../../server/db/schema'
import { databaseEnvSchema } from './env.schemas'

export { and, desc, eq, or, sql } from 'drizzle-orm'

export { schema }

type DrizzleConfig = Partial<z.infer<typeof databaseEnvSchema>>

export function useDrizzle(runtimeConfig?: DrizzleConfig) {
  const config = runtimeConfig ?? useRuntimeConfig()
  const { databaseUrl } = databaseEnvSchema.parse({
    databaseUrl: config.databaseUrl,
  })

  return drizzle({
    connection: {
      connectionString: databaseUrl,
    },
    schema,
  })
}
