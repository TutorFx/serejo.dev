import { GoogleAuth } from 'googleapis-common'

export function createGoogleAuth() {
  const config = useRuntimeConfig()
  const credentials = googleAuthEnvSchema.parse({
    clientEmail: config.google.clientEmail,
    privateKey: config.google.privateKey,
  })

  return new GoogleAuth({
    credentials: {
      client_email: credentials.clientEmail,
      private_key: credentials.privateKey,
    },
    // Least privilege: write events (dedicated calendar) and read only free/busy (main calendar).
    // `freebusy.query` accepts either freebusy scope, so `calendar.readonly` (full event details) is not needed
    scopes: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.events.freebusy',
      'https://www.googleapis.com/auth/calendar.freebusy'
    ],
  })
}
