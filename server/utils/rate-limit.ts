import type { H3Event } from 'h3'
import type Redis from 'ioredis'
import { MemoryStore } from './security/memory-store'

/**
 * Security counters, locks and flags backed by Redis.
 *
 * When Redis is unavailable every operation falls back to a per-instance memory store with
 * half the limits ("degrade, never open") and the event is logged as `ratelimit-degraded`.
 */

const KEY_PREFIX = 'sec:'
/** Per-command budget once connected */
const REDIS_TIMEOUT_MS = 600
/** A cold serverless instance has to open the connection first */
const REDIS_CONNECT_TIMEOUT_MS = 2500
/** After a failure Redis is skipped for a while, so an outage does not add latency to every operation */
const REDIS_RETRY_AFTER_MS = 15_000

const memory = new MemoryStore()
let lastDegradedLog = 0
let redisUnavailableUntil = 0

function waitForReady(client: Redis, timeoutMs: number): Promise<void> {
  if (client.status === 'ready') return Promise.resolve()

  return new Promise((resolve, reject) => {
    const onReady = () => {
      clearTimeout(timer)
      resolve()
    }
    const timer = setTimeout(() => {
      client.off('ready', onReady)
      reject(new Error('Redis connect timeout'))
    }, timeoutMs)
    client.once('ready', onReady)
  })
}

// INCRBY + expiry on the first hit (or when a key somehow lost its TTL). Works on any Redis version
const INCREMENT_SCRIPT = `
local current = redis.call('INCRBY', KEYS[1], ARGV[1])
local ttl = redis.call('PTTL', KEYS[1])
if ttl < 0 then
  redis.call('PEXPIRE', KEYS[1], ARGV[2])
  ttl = tonumber(ARGV[2])
end
return { current, ttl }
`

// Deletes the lock only if it still holds our token
const RELEASE_LOCK_SCRIPT = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
`

type RedisAttempt<T> = { ok: true, value: T } | { ok: false }

async function tryRedis<T>(operation: (client: Redis) => Promise<T>): Promise<RedisAttempt<T>> {
  if (Date.now() < redisUnavailableUntil) return { ok: false }

  try {
    const client = useRateLimitRedis()
    await waitForReady(client, REDIS_CONNECT_TIMEOUT_MS)

    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Redis timeout')), REDIS_TIMEOUT_MS)
    })

    try {
      return { ok: true, value: await Promise.race([operation(client), timeout]) }
    } finally {
      clearTimeout(timer)
    }
  } catch (error) {
    const now = Date.now()
    redisUnavailableUntil = now + REDIS_RETRY_AFTER_MS
    if (now - lastDegradedLog > 60_000) {
      lastDegradedLog = now
      logSecurityEvent('ratelimit-degraded', { reason: error instanceof Error ? error.message : 'unknown' })
    }
    return { ok: false }
  }
}

export interface RateLimitResult {
  allowed: boolean
  count: number
  limit: number
  retryAfterSec: number
  degraded: boolean
}

async function consume(key: string, limit: number, windowSec: number, amount = 1): Promise<RateLimitResult> {
  const fullKey = KEY_PREFIX + key
  const windowMs = windowSec * 1000

  const attempt = await tryRedis(async client =>
    await client.eval(INCREMENT_SCRIPT, 1, fullKey, amount, windowMs) as [number, number]
  )

  if (attempt.ok) {
    const [count, ttlMs] = attempt.value
    return { allowed: count <= limit, count, limit, retryAfterSec: Math.max(1, Math.ceil(ttlMs / 1000)), degraded: false }
  }

  const degradedLimit = Math.max(1, Math.floor(limit / 2))
  const { value, ttlMs } = memory.increment(fullKey, amount, windowMs)
  return { allowed: value <= degradedLimit, count: value, limit: degradedLimit, retryAfterSec: Math.max(1, Math.ceil(ttlMs / 1000)), degraded: true }
}

async function read(key: string): Promise<number> {
  const fullKey = KEY_PREFIX + key
  const attempt = await tryRedis(async client => Number(await client.get(fullKey) ?? 0))
  return attempt.ok ? attempt.value : memory.peek(fullKey)
}

/** SET NX: returns true only for the first caller while the key lives */
async function reserve(key: string, ttlSec: number): Promise<boolean> {
  const fullKey = KEY_PREFIX + key
  const attempt = await tryRedis(async client => await client.set(fullKey, '1', 'EX', ttlSec, 'NX'))
  return attempt.ok ? attempt.value === 'OK' : memory.setIfAbsent(fullKey, ttlSec * 1000)
}

async function release(key: string) {
  const fullKey = KEY_PREFIX + key
  const attempt = await tryRedis(async client => await client.del(fullKey))
  if (!attempt.ok) memory.delete(fullKey)
}

async function acquireLock(key: string, ttlMs: number): Promise<string | null> {
  const fullKey = KEY_PREFIX + key
  const token = crypto.randomUUID()
  const attempt = await tryRedis(async client => await client.set(fullKey, token, 'PX', ttlMs, 'NX'))

  if (attempt.ok) return attempt.value === 'OK' ? token : null
  return memory.setIfAbsent(fullKey, ttlMs) ? token : null
}

async function releaseLock(key: string, token: string) {
  const fullKey = KEY_PREFIX + key
  const attempt = await tryRedis(async client => await client.eval(RELEASE_LOCK_SCRIPT, 1, fullKey, token))
  if (!attempt.ok) memory.delete(fullKey)
}

async function setFlag(key: string, ttlSec: number) {
  const fullKey = KEY_PREFIX + key
  const attempt = await tryRedis(async client => await client.set(fullKey, '1', 'EX', Math.max(1, Math.ceil(ttlSec))))
  if (!attempt.ok) memory.set(fullKey, ttlSec * 1000)
}

async function isFlagSet(key: string): Promise<boolean> {
  const fullKey = KEY_PREFIX + key
  const attempt = await tryRedis(async client => await client.exists(fullKey))
  return attempt.ok ? attempt.value === 1 : memory.peek(fullKey) > 0
}

export const securityStore = {
  consume,
  read,
  reserve,
  release,
  acquireLock,
  releaseLock,
  setFlag,
  isFlagSet
}

export interface RateLimitCheck {
  key: string
  limit: number
  windowSec: number
}

/**
 * Consumes every check and throws 429 (with `Retry-After`) on the first one over its limit.
 */
export async function assertRateLimits(event: H3Event, checks: RateLimitCheck[], context: Record<string, string> = {}) {
  for (const check of checks) {
    const result = await consume(check.key, check.limit, check.windowSec)
    if (!result.allowed) {
      // The key embeds hashed identifiers only
      logSecurityEvent('ratelimit', { ...context, key: check.key.split(':').slice(0, 2).join(':'), limit: result.limit, degraded: result.degraded })
      setResponseHeader(event, 'Retry-After', result.retryAfterSec)
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
        message: SECURITY_ERROR.rateLimited,
        data: { retryAfter: result.retryAfterSec }
      })
    }
  }
}

/**
 * Builds the checks for a resource from `ABUSE_LIMITS` (per session and per IP, several windows).
 */
export function buildRateLimitChecks(
  resource: string,
  identity: { ownerHash: string, ipHash: string },
  limits: { session: readonly { limit: number, windowSec: number }[], ip: readonly { limit: number, windowSec: number }[] }
): RateLimitCheck[] {
  return [
    ...limits.session.map(rule => ({ key: `${resource}:s:${identity.ownerHash}:${rule.windowSec}`, ...rule })),
    ...limits.ip.map(rule => ({ key: `${resource}:ip:${identity.ipHash}:${rule.windowSec}`, ...rule }))
  ]
}
