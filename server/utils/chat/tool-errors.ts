import { MeetingPolicyError } from '../calendar/policy'

/**
 * Error whose message was written for the model (it says what to do next) and can be forwarded.
 * Any other error (Google API, Postgres, network) is logged and replaced by a generic message,
 * so internal details never reach the model or the client.
 */
export class PublicToolError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PublicToolError'
  }
}

export function isPublicToolError(error: unknown): error is PublicToolError | MeetingPolicyError {
  return error instanceof PublicToolError || error instanceof MeetingPolicyError
}

/**
 * Runs a tool body and maps unexpected errors to `fallbackMessage`.
 */
export async function runTool<T>(
  toolName: string,
  fallbackMessage: string,
  body: () => Promise<T>
): Promise<T> {
  try {
    return await body()
  } catch (error) {
    if (isPublicToolError(error)) {
      if (error instanceof MeetingPolicyError) {
        logSecurityEvent('meeting-policy', { tool: toolName, reason: error.reason })
      }
      throw new Error(error.message)
    }

    console.error(`[tool:${toolName}] failed:`, error)
    logSecurityEvent('tool-error', { tool: toolName })
    throw new Error(fallbackMessage)
  }
}
