import { describe, expect, it } from 'vitest'
import { getChatRedirect } from '../../server/middleware/chat-redirect'

const ID = '0b6f4a52-5d3c-4f0e-9a71-2f8f3c1d7e90'

describe('getChatRedirect', () => {
  it.each([
    ['/chat', '/'],
    ['/chat/', '/'],
    [`/chat/${ID}`, `/?chat=${ID}`],
    [`/chat/${ID}/`, `/?chat=${ID}`],
    ['/pt-BR/chat', '/pt-BR/inicio'],
    ['/pt-BR/chat/', '/pt-BR/inicio'],
    [`/pt-BR/chat/${ID}`, `/pt-BR/inicio?chat=${ID}`],
  ])('redirects %o to %o', (path, expected) => {
    expect(getChatRedirect(path)).toBe(expected)
  })

  it('accepts any casing of the locale prefix and of the page', () => {
    expect(getChatRedirect(`/pt-br/chat/${ID}`)).toBe(`/pt-BR/inicio?chat=${ID}`)
    expect(getChatRedirect('/PT-BR/Chat')).toBe('/pt-BR/inicio')
    expect(getChatRedirect(`/Chat/${ID}`)).toBe(`/?chat=${ID}`)
  })

  it('keeps the rest of the query string', () => {
    expect(getChatRedirect(`/chat/${ID}?utm_source=linkedin`)).toBe(
      `/?utm_source=linkedin&chat=${ID}`
    )
    expect(getChatRedirect('/pt-BR/chat?utm_source=linkedin')).toBe(
      '/pt-BR/inicio?utm_source=linkedin'
    )
  })

  it('lets the id in the path win over a `chat` query parameter', () => {
    expect(getChatRedirect(`/chat/${ID}?chat=other`)).toBe(`/?chat=${ID}`)
  })

  it.each(['/chat/not%20an%20id', `/chat/${'a'.repeat(65)}`, '/chat/<script>'])(
    'drops the malformed id in %o',
    path => {
      expect(getChatRedirect(path)).toBe('/')
    }
  )

  it.each([
    '/',
    '/pt-BR/inicio',
    '/blog',
    '/chats',
    '/chatbot',
    '/api/chats',
    `/api/chats/${ID}`,
    `/chat/${ID}/extra`,
    '/en-US/chat',
    '/pt-BR/blog/chat',
    '/_nuxt/chat.js',
  ])('keeps %o', path => {
    expect(getChatRedirect(path)).toBeNull()
  })
})
