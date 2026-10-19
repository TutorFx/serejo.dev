import { describe, expect, it } from 'vitest'
import { getChatErrorKey } from '../../app/utils/ai/errors'

describe('getChatErrorKey', () => {
  it('maps codes from chat transport errors (JSON body as message)', () => {
    const error = new Error(
      JSON.stringify({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
        message: 'RATE_LIMITED',
      })
    )
    expect(getChatErrorKey(error)).toBe('chat.errors.rate_limited')
  })

  it('maps codes from $fetch errors (body in data)', () => {
    const error = Object.assign(new Error('[POST] "/api/chats": 503'), {
      statusCode: 503,
      data: { message: 'CHAT_DISABLED' },
    })
    expect(getChatErrorKey(error)).toBe('chat.errors.chat_disabled')
  })

  it('detects CSRF rejections', () => {
    const error = Object.assign(new Error('403'), {
      statusCode: 403,
      data: { statusMessage: 'CSRF Token Mismatch', message: 'CSRF Token not found' },
    })
    expect(getChatErrorKey(error)).toBe('chat.errors.session_expired')
  })

  it('maps stream error chunks', () => {
    expect(getChatErrorKey(new Error('STREAM_ERROR'))).toBe('chat.errors.stream_error')
  })

  it('never surfaces raw messages', () => {
    expect(getChatErrorKey(new Error('connect ECONNREFUSED 10.0.0.3:5432'))).toBe(
      'chat.errors.generic'
    )
    expect(getChatErrorKey(new Error('{"message":"Google API: invalid_grant"}'))).toBe(
      'chat.errors.generic'
    )
    expect(getChatErrorKey(undefined)).toBe('chat.errors.generic')
  })

  it('falls back to the HTTP status', () => {
    expect(getChatErrorKey(Object.assign(new Error('x'), { statusCode: 413 }))).toBe(
      'chat.errors.payload_too_large'
    )
  })
})
