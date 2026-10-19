import type { RequestIdentity } from './security'

/**
 * Token budgets per session, per IP and global, over a rolling 24h window (`ABUSE_LIMITS.tokens`).
 * Usage is recorded after every model step, so aborted streams are still accounted for.
 */

function budgetKeys(identity: Pick<RequestIdentity, 'ownerHash' | 'ipHash'>) {
  return {
    session: `tok:s:${identity.ownerHash}`,
    ip: `tok:ip:${identity.ipHash}`,
    global: 'tok:global',
  }
}

/** Throws 429 before calling the model when any budget is already spent */
export async function assertTokenBudget(identity: RequestIdentity) {
  const keys = budgetKeys(identity)
  const limits = ABUSE_LIMITS.tokens

  const [session, ip, global] = await Promise.all([
    securityStore.read(keys.session),
    securityStore.read(keys.ip),
    securityStore.read(keys.global),
  ])

  if (global >= limits.global) {
    await securityStore.setFlag(CHAT_FLAGS.chatDisabled, limits.windowSec)
    logSecurityEvent('budget-exceeded', { scope: 'global' })
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: SECURITY_ERROR.chatDisabled,
    })
  }

  if (session >= limits.session || ip >= limits.ip) {
    logSecurityEvent('budget-exceeded', {
      scope: session >= limits.session ? 'session' : 'ip',
      owner: identity.ownerHash,
    })
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: SECURITY_ERROR.budgetExceeded,
    })
  }
}

/**
 * Adds the tokens of a step to every budget. Returns true when a budget was exceeded,
 * so the caller stops the agent loop. Exceeding the global budget switches the chat off.
 */
export async function recordTokenUsage(
  identity: Pick<RequestIdentity, 'ownerHash' | 'ipHash'>,
  tokens: number | undefined
): Promise<boolean> {
  const amount = Math.max(0, Math.round(tokens ?? 0))
  if (amount === 0) return false

  const keys = budgetKeys(identity)
  const limits = ABUSE_LIMITS.tokens

  const [session, ip, global] = await Promise.all([
    securityStore.consume(keys.session, limits.session, limits.windowSec, amount),
    securityStore.consume(keys.ip, limits.ip, limits.windowSec, amount),
    securityStore.consume(keys.global, limits.global, limits.windowSec, amount),
  ])

  if (!global.allowed) {
    await securityStore.setFlag(CHAT_FLAGS.chatDisabled, global.retryAfterSec)
    logSecurityEvent('budget-exceeded', { scope: 'global' })
  }

  if (!session.allowed || !ip.allowed) {
    logSecurityEvent('budget-exceeded', {
      scope: !session.allowed ? 'session' : 'ip',
      owner: identity.ownerHash,
    })
  }

  return !session.allowed || !ip.allowed || !global.allowed
}
