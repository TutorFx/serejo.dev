import { TZDate } from '@date-fns/tz'
import { format, addMinutes } from 'date-fns'
import type { calendar_v3 } from 'googleapis'

export async function getBusyFree(args: { date: string, timeZone: string, calendarId: string }) {
  const calendarService = createCalendarService(createGoogleAuth())
  const busyIntervals = await calendarService.checkAvailability(
    args.calendarId,
    new TZDate(`${args.date}T00:00:00`, 'America/Sao_Paulo').toISOString(),
    new TZDate(`${args.date}T23:59:59.999`, 'America/Sao_Paulo').toISOString(),
    args.timeZone
  )

  const workStartStr = `${args.date}T08:00:00`
  const workEndStr = `${args.date}T20:00:00`

  const now = new TZDate(new Date(), args.timeZone)
  const minimumStartTime = addMinutes(now, 45)
  const minStartStr = format(minimumStartTime, 'yyyy-MM-dd\'T\'HH:mm:ss')
  const nowStr = format(now, 'yyyy-MM-dd\'T\'HH:mm:ss')

  const busy = busyIntervals.reduce((acc: { start: string, end: string }[], interval: calendar_v3.Schema$TimePeriod) => {
    const s = format(new TZDate(interval.start as string, args.timeZone), 'yyyy-MM-dd\'T\'HH:mm:ss')
    const e = format(new TZDate(interval.end as string, args.timeZone), 'yyyy-MM-dd\'T\'HH:mm:ss')
    const start = s > workStartStr ? s : workStartStr
    const end = e < workEndStr ? e : workEndStr

    // Filtra o bloco se já passou do horário ATUAL
    if (start < end && end > nowStr) acc.push({ start, end })
    return acc
  }, []).sort((a, b) => a.start.localeCompare(b.start))

  let curr = workStartStr
  // Se a restrição de "agora + 45min" for maior que o início do expediente, avança o ponteiro
  if (minStartStr > curr) {
    curr = minStartStr
  }

  const free = busyIntervals.reduce((acc, interval) => {
    const s = format(new TZDate(interval.start as string, args.timeZone), 'yyyy-MM-dd\'T\'HH:mm:ss')
    const e = format(new TZDate(interval.end as string, args.timeZone), 'yyyy-MM-dd\'T\'HH:mm:ss')

    if (curr < s && curr < workEndStr) {
      const endFree = s < workEndStr ? s : workEndStr
      acc.push({ start: curr, end: endFree })
    }
    if (curr < e) {
      curr = e
    }
    return acc
  }, [] as { start: string, end: string }[])

  if (curr < workEndStr) {
    free.push({ start: curr, end: workEndStr })
  }

  const overlap = (new TZDate(`${args.date}T12:00:00`, 'America/Sao_Paulo').getTimezoneOffset()
    - new TZDate(`${args.date}T12:00:00`, args.timeZone).getTimezoneOffset()) / 60

  return { busy, free, overlap }
}

export async function createMeeting(args: {
  calendarId: string
  summary: string
  description: string
  startTime: string
  endTime: string
  timeZone: string
  attendees: string[]
}) {
  const calendarService = createCalendarService(createGoogleAuth())

  const contextDescription = args.description ? `${args.description}\n\n` : ''
  const attendeesDescription = args.attendees && args.attendees.length > 0
    ? `E-mails para convidar:\n${args.attendees.join('\n')}`
    : ''

  const finalDescription = contextDescription + attendeesDescription

  const event = await calendarService.createMeetEvent(args.calendarId, {
    summary: args.summary,
    description: finalDescription,
    startTime: args.startTime,
    endTime: args.endTime,
    timeZone: args.timeZone,
  })

  return {
    id: event.id,
    summary: event.summary,
    start: event.start?.dateTime,
    end: event.end?.dateTime
  }
}
