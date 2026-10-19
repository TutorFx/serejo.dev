import type { getToolName } from 'ai'
import { toSafeExternalUrl } from './url'

export interface Source {
  url: string
  title?: string
}

interface GoogleGroundingChunk {
  web?: { uri?: string; title?: string }
}

interface SearchOutput {
  sources?: { url: string; type?: string }[]
  groundingChunks?: GoogleGroundingChunk[]
  groundingMetadata?: { groundingChunks?: GoogleGroundingChunk[] }
}

type ToolPart = Parameters<typeof getToolName>[0]

export function getSearchQuery(part: ToolPart): string | undefined {
  return (part.input as { query?: string } | undefined)?.query
}

/** Keeps only sources with an absolute `https:` URL; tool output is untrusted */
function toSafeSources(sources: Array<{ url?: string; title?: string }>): Source[] {
  return sources.flatMap(source => {
    const url = toSafeExternalUrl(source.url)
    return url ? [{ url, title: typeof source.title === 'string' ? source.title : undefined }] : []
  })
}

export function getSources(part: ToolPart): Source[] {
  const output = part.output
  if (!output) return []

  // Anthropic: array of { url, title }
  if (Array.isArray(output)) {
    return toSafeSources(output as Source[])
  }

  const typed = output as SearchOutput

  // OpenAI: { sources: [{ type: 'url', url }] }
  if (typed.sources) {
    return toSafeSources(typed.sources.map(s => ({ url: s.url })))
  }

  // Google: grounding chunks with { web: { uri, title } }
  const chunks = typed.groundingChunks ?? typed.groundingMetadata?.groundingChunks
  if (chunks) {
    return toSafeSources(chunks.map(c => ({ url: c.web?.uri, title: c.web?.title })))
  }

  return []
}

export function sourceToInlineComark(url: string): string {
  // `new URL().href` percent-encodes quotes, so the value cannot break out of the attribute
  const safeUrl = toSafeExternalUrl(url)
  if (!safeUrl) return ''

  // SourceLink derives favicon and label from the URL itself
  return ` :source-link{url="${safeUrl}"}`
}
