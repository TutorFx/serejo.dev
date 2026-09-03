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
    scopes: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ],
  })
}
