import { describe, expect, it } from 'bun:test'
import { limitAdjacentSearchOutput, limitHybridSearchOutput, truncateText } from '../../server/utils/chat/truncate'

describe('truncateText', () => {
  it('keeps short text and cuts long text with an ellipsis', () => {
    expect(truncateText('abc', 5)).toBe('abc')
    expect(truncateText('abcdefgh', 5)).toBe('abcd…')
    expect(truncateText('abcdefgh', 5).length).toBe(5)
  })
})

describe('limitHybridSearchOutput', () => {
  const result = (content: string) => ({ documentId: 'd', collection: 'blog' as const, index: 1, route: '/blog/x', content })

  it('truncates each chunk and stops at the total budget', () => {
    const output = limitHybridSearchOutput(
      { query: 'q', collection: null, count: 3, results: [result('a'.repeat(50)), result('b'.repeat(50)), result('c'.repeat(50))] },
      { maxChunkChars: 30, maxTotalChars: 70 }
    )

    expect(output.results.map(r => r.content.length)).toEqual([30, 30])
    expect(output.count).toBe(2)
  })

  it('is idempotent', () => {
    const limits = { maxChunkChars: 30, maxTotalChars: 70 }
    const once = limitHybridSearchOutput({ query: 'q', collection: null, count: 1, results: [result('x'.repeat(100))] }, limits)
    expect(limitHybridSearchOutput(once, limits)).toEqual(once)
  })
})

describe('limitAdjacentSearchOutput', () => {
  it('truncates chunks and the combined content', () => {
    const chunk = { id: '1', index: 1, documentId: 'd', content: 'x'.repeat(100) }
    const output = limitAdjacentSearchOutput(
      { targetChunk: { ...chunk, collection: 'blog', context: null, route: null }, previous: [chunk], next: [], combinedContent: 'y'.repeat(500) },
      { maxChunkChars: 20, maxTotalChars: 100 }
    )

    expect(output.targetChunk?.content.length).toBe(20)
    expect(output.previous[0]?.content.length).toBe(20)
    expect(output.combinedContent.length).toBe(100)
  })
})
