/**
 * Vue Router matches paths case-insensitively, so `/pt-br/blog` renders the same page as `/pt-BR/blog`.
 * Search engines treat them as different URLs: every casing other than the canonical one is redirected.
 * Pure module so it can be unit tested with `bun test`.
 *
 * @returns the redirect target, or `null` when the path already uses the canonical prefix
 */
export function normalizeLocalePrefix(path: string, prefixes: readonly string[]): string | null {
  const match = /^\/([^/?#]+)(.*)$/s.exec(path)
  if (!match) return null

  const [, segment = '', rest = ''] = match
  const canonical = prefixes.find(prefix => prefix.toLowerCase() === segment.toLowerCase())

  if (!canonical || canonical === segment) return null
  return `/${canonical}${rest}`
}
