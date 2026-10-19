import { describe, expect, it } from 'bun:test'
import { normalizeLocalePrefix } from '../../server/utils/seo/locale-prefix'

const PREFIXES = ['pt-BR']

describe('normalizeLocalePrefix', () => {
  it.each([
    ['/pt-br', '/pt-BR'],
    ['/pt-br/', '/pt-BR/'],
    ['/pt-br/blog', '/pt-BR/blog'],
    ['/PT-BR/curriculum?print', '/pt-BR/curriculum?print'],
    ['/Pt-Br/post/ola-mundo#intro', '/pt-BR/post/ola-mundo#intro'],
    ['/pt-br?x=1', '/pt-BR?x=1']
  ])('redirects %p to %p', (path, expected) => {
    expect(normalizeLocalePrefix(path, PREFIXES)).toBe(expected)
  })

  it.each([
    '/pt-BR',
    '/pt-BR/blog',
    '/',
    '/blog',
    '/pt-brx/blog',
    '/api/chats',
    '/_nuxt/BljGyQLa2.js'
  ])('keeps %p', (path) => {
    expect(normalizeLocalePrefix(path, PREFIXES)).toBeNull()
  })
})
