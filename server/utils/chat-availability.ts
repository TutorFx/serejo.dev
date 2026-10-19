/**
 * Kill switches for the agent.
 * - `runtimeConfig.chat.enabled` / `schedulingEnabled` (env `NUXT_CHAT_ENABLED`, `NUXT_CHAT_SCHEDULING_ENABLED`): need a redeploy
 * - Redis flags `sec:chat:disabled` / `sec:chat:scheduling-disabled`: take effect immediately.
 *   The global token budget sets `chat:disabled` automatically until its window expires.
 */

export const CHAT_FLAGS = {
  chatDisabled: 'chat:disabled',
  schedulingDisabled: 'chat:scheduling-disabled'
} as const

export interface ChatAvailability {
  chatEnabled: boolean
  schedulingEnabled: boolean
}

export async function getChatAvailability(): Promise<ChatAvailability> {
  const config = useRuntimeConfig().chat

  const [chatFlag, schedulingFlag] = await Promise.all([
    securityStore.isFlagSet(CHAT_FLAGS.chatDisabled),
    securityStore.isFlagSet(CHAT_FLAGS.schedulingDisabled)
  ])

  const chatEnabled = config.enabled !== false && !chatFlag
  return {
    chatEnabled,
    schedulingEnabled: chatEnabled && config.schedulingEnabled !== false && !schedulingFlag
  }
}

/** Throws 503 when the chat is switched off */
export async function assertChatEnabled(): Promise<ChatAvailability> {
  const availability = await getChatAvailability()
  if (!availability.chatEnabled) {
    logSecurityEvent('chat-disabled')
    throw createError({ statusCode: 503, statusMessage: 'Service Unavailable', message: SECURITY_ERROR.chatDisabled })
  }
  return availability
}
