import process from 'node:process'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../../server/db/schema'

export { sql, eq, and, or, desc } from 'drizzle-orm'

export { schema }

export function useDrizzle() {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOSTNAME,
    POSTGRES_PORT,
    POSTGRES_DB,
  } = process.env
  return drizzle({
    connection: {
      connectionString: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DB}`,
    },
    schema,
  })
}
