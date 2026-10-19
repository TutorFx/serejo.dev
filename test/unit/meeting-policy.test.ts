import { describe, expect, it } from 'bun:test'
import { assertAvailabilityDate, assertMeetingPolicy, MeetingPolicyError } from '../../server/utils/calendar/policy'

const timeZone = 'America/Sao_Paulo'
// Monday 2026-10-19 09:00 in São Paulo (UTC-3)
const now = new Date('2026-10-19T12:00:00Z')

function violation(fn: () => unknown): string | undefined {
  try {
    fn()
    return undefined
  } catch (error) {
    if (error instanceof MeetingPolicyError) return error.reason
    throw error
  }
}

describe('assertMeetingPolicy', () => {
  it('accepts a one-hour slot inside business hours', () => {
    const result = assertMeetingPolicy({ startTime: '2026-10-20T14:00:00', endTime: '2026-10-20T15:00:00' }, { timeZone, now })

    expect(result.date).toBe('2026-10-20')
    expect(result.startWallClock).toBe('2026-10-20T14:00:00')
    expect(result.endWallClock).toBe('2026-10-20T15:00:00')
  })

  it('reads offsets as absolute instants', () => {
    const result = assertMeetingPolicy({ startTime: '2026-10-20T17:00:00Z', endTime: '2026-10-20T18:00:00Z' }, { timeZone, now })
    expect(result.startWallClock).toBe('2026-10-20T14:00:00')
  })

  it.each([
    [{ startTime: '2026-10-20T15:00:00', endTime: '2026-10-20T14:00:00' }, 'invalid-range'],
    [{ startTime: '2026-10-20T14:00:00', endTime: '2026-10-20T14:30:00' }, 'duration'],
    [{ startTime: '2026-10-20T14:00:00', endTime: '2026-10-20T18:00:00' }, 'duration'],
    [{ startTime: '2026-10-19T09:30:00', endTime: '2026-10-19T10:30:00' }, 'too-soon'],
    [{ startTime: '2026-10-18T14:00:00', endTime: '2026-10-18T15:00:00' }, 'too-soon'],
    [{ startTime: '2027-01-20T14:00:00', endTime: '2027-01-20T15:00:00' }, 'too-far'],
    [{ startTime: '2026-10-20T07:00:00', endTime: '2026-10-20T08:00:00' }, 'outside-work-hours'],
    [{ startTime: '2026-10-20T19:30:00', endTime: '2026-10-20T20:30:00' }, 'outside-work-hours'],
    [{ startTime: '2026-10-20T23:30:00', endTime: '2026-10-21T00:30:00' }, 'outside-work-hours']
  ])('rejects %p as %s', (input, reason) => {
    expect(violation(() => assertMeetingPolicy(input, { timeZone, now }))).toBe(reason)
  })
})

describe('assertAvailabilityDate', () => {
  it('accepts today and dates inside the horizon', () => {
    expect(violation(() => assertAvailabilityDate('2026-10-19', { timeZone, now }))).toBeUndefined()
    expect(violation(() => assertAvailabilityDate('2026-12-01', { timeZone, now }))).toBeUndefined()
  })

  it('rejects past dates and dates beyond the horizon', () => {
    expect(violation(() => assertAvailabilityDate('2026-10-18', { timeZone, now }))).toBe('past-date')
    expect(violation(() => assertAvailabilityDate('2027-06-01', { timeZone, now }))).toBe('too-far')
  })
})
