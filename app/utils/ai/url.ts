export function getFileName(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop() || 'file'
    return decodeURIComponent(filename)
  } catch {
    return 'file'
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function getFaviconUrl(url: string): string {
  return `https://www.google.com/s2/favicons?sz=32&domain=${encodeURIComponent(getDomain(url))}`
}

const MAX_URL_LENGTH = 2048

/**
 * Returns the normalized URL only when it is an absolute `https:` URL.
 * Used for links that come from model output, where anything else (javascript:, data:, http:) is dropped.
 */
export function toSafeExternalUrl(url: unknown): string | null {
  if (typeof url !== 'string' || !url || url.length > MAX_URL_LENGTH) return null

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? parsed.href : null
  } catch {
    return null
  }
}

export interface SafeLink {
  href: string
  external: boolean
}

const SAFE_LINK_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:'])

/**
 * Validates an `href` before it reaches the DOM.
 * Relative paths and anchors stay internal; absolute URLs must use a safe protocol; everything else is rejected.
 */
export function resolveSafeLink(href: unknown, siteOrigin?: string): SafeLink | null {
  if (typeof href !== 'string') return null

  const value = href.trim()
  if (!value || value.length > MAX_URL_LENGTH) return null

  // Protocol-relative URLs (`//host`) point to another origin
  if (value.startsWith('//')) {
    return resolveSafeLink(`https:${value}`, siteOrigin)
  }

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    // Not an absolute URL: relative path, query or anchor
    return { href: value, external: false }
  }

  if (!SAFE_LINK_PROTOCOLS.has(parsed.protocol)) return null

  const isWeb = parsed.protocol === 'https:' || parsed.protocol === 'http:'
  const external = isWeb && (!siteOrigin || parsed.origin !== siteOrigin)

  return { href: parsed.href, external }
}
