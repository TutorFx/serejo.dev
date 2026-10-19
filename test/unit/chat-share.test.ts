import { describe, expect, it } from 'vitest'
import { getChatShareUrl, readSharedChatId } from '../../app/utils/ai/share'

const ID = '0b6f4a52-5d3c-4f0e-9a71-2f8f3c1d7e90'

describe('getChatShareUrl', () => {
  it('points to the home of the locale with the chat id', () => {
    expect(getChatShareUrl('https://serejo.dev', '/', ID)).toBe(`https://serejo.dev/?chat=${ID}`)
    expect(getChatShareUrl('https://serejo.dev', '/pt-BR/inicio', ID)).toBe(
      `https://serejo.dev/pt-BR/inicio?chat=${ID}`
    )
  })

  it('keeps the origin it is given (previews, local dev)', () => {
    expect(getChatShareUrl('http://localhost:3000', '/', ID)).toBe(
      `http://localhost:3000/?chat=${ID}`
    )
  })
})

describe('readSharedChatId', () => {
  it('reads the id from the query', () => {
    expect(readSharedChatId({ chat: ID })).toBe(ID)
    expect(readSharedChatId({ chat: ID, utm_source: 'linkedin' })).toBe(ID)
  })

  it('takes the first value of a repeated parameter', () => {
    expect(readSharedChatId({ chat: [ID, 'other'] })).toBe(ID)
  })

  it.each([
    ['missing', {}],
    ['empty', { chat: '' }],
    ['null (`?chat`)', { chat: null }],
    ['markup', { chat: '<script>' }],
    ['a path', { chat: '../api/chats' }],
    ['too long', { chat: 'a'.repeat(65) }],
    ['not a string', { chat: 42 }],
  ])('returns null when the id is %s', (_, query) => {
    expect(readSharedChatId(query)).toBeNull()
  })

  it('round-trips the link built by getChatShareUrl', () => {
    const url = new URL(getChatShareUrl('https://serejo.dev', '/pt-BR/inicio', ID))
    expect(readSharedChatId(Object.fromEntries(url.searchParams))).toBe(ID)
  })
})
