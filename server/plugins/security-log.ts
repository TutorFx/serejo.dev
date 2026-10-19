/**
 * nuxt-csurf rejects requests in its own middleware without logging them.
 * Nitro reports every request error through the `error` hook, so CSRF rejections are logged here
 * next to the other `security` events (path only: no query string, no body).
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    if (!event) return

    const { statusMessage } = error as { statusMessage?: string }
    if (statusMessage === 'CSRF Token Mismatch') {
      logSecurityEvent('csrf', { method: event.method, path: event.path.split('?')[0] })
    }
  })
})
