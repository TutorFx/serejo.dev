import { TZDate, tz } from '@date-fns/tz'
import { addDays, addMinutes, differenceInMinutes, format, isBefore, parseISO } from 'date-fns'
import { CALENDAR_CONFIG, MEETING_POLICY } from '../../../shared/utils/constants/chat.constants'

/**
 * Business rules for meeting requests, enforced in code regardless of what the model sends.
 * Pure module (explicit relative imports) so it can be unit tested with `bun test`.
 */

export type MeetingPolicyViolation
  = | 'invalid-date'
    | 'invalid-range'
    | 'duration'
    | 'too-soon'
    | 'too-far'
    | 'past-date'
    | 'outside-work-hours'

/** Error whose message is safe to forward to the model (it explains what to fix) */
export class MeetingPolicyError extends Error {
  constructor(public readonly reason: MeetingPolicyViolation, message: string) {
    super(message)
    this.name = 'MeetingPolicyError'
  }
}

const WALL_CLOCK = 'yyyy-MM-dd\'T\'HH:mm:ss'

/** Offset-less ISO strings are wall-clock time in `timeZone`; strings with an offset keep their instant */
function parseIn(iso: string, timeZone: string) {
  return parseISO(iso, { in: tz(timeZone) })
}

export interface ValidatedMeetingWindow {
  start: Date
  end: Date
  /** Day of the meeting in the visitor's time zone (input of the availability check) */
  date: string
  /** Wall-clock strings in the visitor's time zone, comparable with `getBusyFree` blocks */
  startWallClock: string
  endWallClock: string
}

export function assertMeetingPolicy(
  input: { startTime: string, endTime: string },
  options: { timeZone: string, now?: Date }
): ValidatedMeetingWindow {
  const { timeZone } = options
  const now = new TZDate(options.now ?? new Date(), timeZone)

  const start = parseIn(input.startTime, timeZone)
  const end = parseIn(input.endTime, timeZone)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new MeetingPolicyError('invalid-date', 'Datas inválidas: use o formato ISO yyyy-MM-ddTHH:mm:ss.')
  }

  if (!isBefore(start, end)) {
    throw new MeetingPolicyError('invalid-range', 'O horário de término deve ser posterior ao de início.')
  }

  if (differenceInMinutes(end, start) !== CALENDAR_CONFIG.defaultMeetingDurationMinutes) {
    throw new MeetingPolicyError('duration', `A reunião deve durar exatamente ${CALENDAR_CONFIG.defaultMeetingDurationMinutes} minutos.`)
  }

  if (isBefore(start, addMinutes(now, CALENDAR_CONFIG.minAdvanceMinutes))) {
    throw new MeetingPolicyError('too-soon', `Não é possível agendar reuniões no passado ou com menos de ${CALENDAR_CONFIG.minAdvanceMinutes} minutos de antecedência.`)
  }

  if (isBefore(addDays(now, MEETING_POLICY.maxDaysAhead), start)) {
    throw new MeetingPolicyError('too-far', `Só é possível solicitar reuniões com até ${MEETING_POLICY.maxDaysAhead} dias de antecedência.`)
  }

  // Same semantics as `getBusyFree`: business hours are compared as wall-clock time in the visitor's zone
  const startWallClock = format(new TZDate(start, timeZone), WALL_CLOCK)
  const endWallClock = format(new TZDate(end, timeZone), WALL_CLOCK)
  const date = startWallClock.slice(0, 10)

  if (
    endWallClock.slice(0, 10) !== date
    || startWallClock < `${date}T${CALENDAR_CONFIG.workHoursStart}`
    || endWallClock > `${date}T${CALENDAR_CONFIG.workHoursEnd}`
  ) {
    throw new MeetingPolicyError('outside-work-hours', 'O horário solicitado está fora do expediente disponível.')
  }

  return { start, end, date, startWallClock, endWallClock }
}

/**
 * Limits availability lookups to the booking horizon, so the calendar cannot be scraped for arbitrary dates.
 */
export function assertAvailabilityDate(date: string, options: { timeZone: string, now?: Date }) {
  const now = new TZDate(options.now ?? new Date(), options.timeZone)
  const today = format(now, 'yyyy-MM-dd')
  const lastDay = format(addDays(now, MEETING_POLICY.maxDaysAhead), 'yyyy-MM-dd')

  if (date < today) {
    throw new MeetingPolicyError('past-date', 'Não é possível consultar a disponibilidade de datas passadas.')
  }

  if (date > lastDay) {
    throw new MeetingPolicyError('too-far', `Só é possível consultar a disponibilidade com até ${MEETING_POLICY.maxDaysAhead} dias de antecedência.`)
  }
}
