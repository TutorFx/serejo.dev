import { CHAT_LIMITS } from '../../../shared/utils/constants/chat.constants'
import type { AdjacentSearchOutput, HybridSearchOutput } from '../../../shared/utils/tools/search'

/**
 * Bounds the RAG content returned to the model (and to the UI).
 * Pure module so it can be unit tested with `bun test`.
 */

export function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  return `${text.slice(0, Math.max(0, maxChars - 1))}…`
}

export function limitHybridSearchOutput(
  output: HybridSearchOutput,
  limits: { maxChunkChars: number, maxTotalChars: number } = { maxChunkChars: CHAT_LIMITS.maxChunkChars, maxTotalChars: CHAT_LIMITS.maxToolResultChars }
): HybridSearchOutput {
  const results: HybridSearchOutput['results'] = []
  let total = 0

  for (const result of output.results) {
    const content = truncateText(result.content, limits.maxChunkChars)
    if (total + content.length > limits.maxTotalChars) break

    total += content.length
    results.push({ ...result, content })
  }

  return { ...output, count: results.length, results }
}

export function limitAdjacentSearchOutput(
  output: AdjacentSearchOutput,
  limits: { maxChunkChars: number, maxTotalChars: number } = { maxChunkChars: CHAT_LIMITS.maxChunkChars, maxTotalChars: CHAT_LIMITS.maxToolResultChars }
): AdjacentSearchOutput {
  const limitChunk = <T extends { content: string }>(chunk: T): T => ({ ...chunk, content: truncateText(chunk.content, limits.maxChunkChars) })

  return {
    targetChunk: output.targetChunk ? limitChunk(output.targetChunk) : null,
    previous: output.previous.map(limitChunk),
    next: output.next.map(limitChunk),
    combinedContent: truncateText(output.combinedContent, limits.maxTotalChars)
  }
}
