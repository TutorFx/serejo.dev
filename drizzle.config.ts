import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOSTNAME,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=require`,
  },
})
