interface FetchErrorLike {
  message?: string
  data?: { message?: string, statusMessage?: string }
}

/**
 * Mensagem legível de um erro do `$fetch`: prefere o `message` do corpo JSON enviado por
 * `createError`, depois o `statusMessage`, e por fim a mensagem genérica do erro.
 */
export function getFetchErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const { data, message } = error as FetchErrorLike
    return data?.message || data?.statusMessage || message || 'Unknown error'
  }

  return String(error)
}
