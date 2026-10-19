import { describe, expect, it } from 'vitest'
import { maskEmails, redactPartsForPublicView } from '../../server/utils/chat/redact'

describe('maskEmails', () => {
  it('masks e-mail addresses', () => {
    expect(maskEmails('Write to ana.silva+jobs@acme.com.br or bob@x.io')).toBe('Write to [e-mail] or [e-mail]')
  })
})

describe('redactPartsForPublicView', () => {
  it('removes reasoning and scheduling parts and masks e-mails in text', () => {
    const parts = redactPartsForPublicView([
      { type: 'reasoning', text: 'internal thoughts' },
      { type: 'text', text: 'My e-mail is ana@acme.com' },
      { type: 'tool-createMeeting', state: 'output-available', input: { attendees: ['ana@acme.com'] } },
      { type: 'tool-calendar', state: 'output-available', output: { busy: [] } },
      { type: 'tool-searchContent', state: 'output-available', output: { results: [] } }
    ])

    expect(parts).toEqual([
      { type: 'text', text: 'My e-mail is [e-mail]' },
      { type: 'tool-searchContent', state: 'output-available', output: { results: [] } }
    ])
  })

  it('returns an empty list for malformed parts', () => {
    expect(redactPartsForPublicView(null)).toEqual([])
    expect(redactPartsForPublicView([null, 'x', { text: 'no type' }])).toEqual([])
  })
})
