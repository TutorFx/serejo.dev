import { z } from 'zod/v4'

export const cohereEnvSchema = z.object({
  apiKey: z.string().optional(),
})

export const geminiEnvSchema = z.object({
  apiKey: z.string().min(1, 'NUXT_GEMINI_API_KEY / runtimeConfig.gemini.apiKey is required'),
})

export const googleAuthEnvSchema = z.object({
  clientEmail: z.email('Invalid or missing NUXT_GOOGLE_CLIENT_EMAIL / runtimeConfig.google.clientEmail'),
  privateKey: z.string().min(1, 'Missing NUXT_GOOGLE_PRIVATE_KEY / runtimeConfig.google.privateKey').transform(key => key.replace(/\\n/g, '\n')),
})

export const googleCalendarEnvSchema = z.object({
  /** Dedicated calendar where the agent writes meeting requests */
  calendarId: z.string().min(1, 'NUXT_GOOGLE_CALENDAR_ID / runtimeConfig.google.calendarId is required'),
  /** Main calendar, read only as free/busy (optional: defaults to the dedicated calendar only) */
  availabilityCalendarId: z.string().optional().transform(value => value?.trim() || undefined),
}).transform(({ calendarId, availabilityCalendarId }) => ({
  calendarId,
  // Busy slots come from both calendars, so pending requests also block the slot
  availabilityCalendarIds: [...new Set([availabilityCalendarId, calendarId].filter((id): id is string => Boolean(id)))],
}))

export const upstashVectorEnvSchema = z.object({
  url: z.url('Invalid or missing NUXT_UPSTASH_VECTOR_REST_URL / runtimeConfig.upstash.vectorRestUrl'),
  token: z.string().min(1, 'NUXT_UPSTASH_VECTOR_REST_TOKEN / runtimeConfig.upstash.vectorRestToken is required'),
})

export const databaseEnvSchema = z.object({
  databaseUrl: z.string().min(1, 'NUXT_DATABASE_URL / runtimeConfig.databaseUrl is required'),
})

export const redisEnvSchema = z.object({
  redisUrl: z.string().min(1, 'NUXT_REDIS_URL / runtimeConfig.redisUrl is required'),
})
