import { describe, expect, it } from 'vitest'
import { resolveSafeLink, toSafeExternalUrl } from '../../app/utils/ai/url'

const SITE = 'https://serejo.dev'

describe('toSafeExternalUrl', () => {
  it('accepts absolute https URLs', () => {
    expect(toSafeExternalUrl('https://nuxt.com/docs')).toBe('https://nuxt.com/docs')
  })

  it.each([
    'javascript:alert(1)',
    ' javascript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'http://example.com',
    '/relative',
    '',
    undefined,
    42,
  ])('rejects %o', value => {
    expect(toSafeExternalUrl(value)).toBeNull()
  })

  it('percent-encodes quotes so the value cannot break out of an attribute', () => {
    expect(toSafeExternalUrl('https://a.com/"x"?q="y"')).not.toContain('"')
  })
})

describe('resolveSafeLink', () => {
  it('keeps relative paths and anchors internal', () => {
    expect(resolveSafeLink('/blog/post', SITE)).toEqual({ href: '/blog/post', external: false })
    expect(resolveSafeLink('#section', SITE)).toEqual({ href: '#section', external: false })
  })

  it('marks other origins as external', () => {
    expect(resolveSafeLink('https://github.com/x', SITE)).toEqual({
      href: 'https://github.com/x',
      external: true,
    })
    expect(resolveSafeLink('//evil.example/x', SITE)).toEqual({
      href: 'https://evil.example/x',
      external: true,
    })
  })

  it('treats the site origin as internal', () => {
    expect(resolveSafeLink('https://serejo.dev/chat', SITE)).toEqual({
      href: 'https://serejo.dev/chat',
      external: false,
    })
  })

  it('allows mailto and tel without opening a new tab', () => {
    expect(resolveSafeLink('mailto:hi@serejo.dev', SITE)).toEqual({
      href: 'mailto:hi@serejo.dev',
      external: false,
    })
  })

  it.each([
    'javascript:alert(1)',
    'JAVASCRIPT:alert(1)',
    '  javascript:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,x',
    'file:///etc/passwd',
  ])('rejects %o', value => {
    expect(resolveSafeLink(value, SITE)).toBeNull()
  })
})
