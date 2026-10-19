import { calendar_v3 } from 'googleapis'

export function createCalendarService(authClient: ReturnType<typeof createGoogleAuth>) {
  const calendar = new calendar_v3.Calendar({ auth: authClient })

  return {
    /**
     * Busy intervals of every calendar, merged and sorted by start.
     */
    async checkAvailability(
      calendarIds: string[],
      timeMin: string,
      timeMax: string,
      timeZone = 'America/Sao_Paulo'
    ) {
      try {
        const response = await calendar.freebusy.query({
          requestBody: {
            timeMin,
            timeMax,
            timeZone,
            items: calendarIds.map(id => ({ id })),
          },
        })

        const calendars = response.data.calendars ?? {}
        const busy: calendar_v3.Schema$TimePeriod[] = []

        for (const calendarId of calendarIds) {
          const entry = calendars[calendarId]
          if (!entry || entry.errors?.length) {
            throw new Error('Calendário não encontrado ou sem permissão na requisição de freebusy')
          }
          busy.push(...(entry.busy ?? []))
        }

        return busy.sort((a, b) => String(a.start).localeCompare(String(b.start)))
      } catch (error) {
        console.error('Erro na Service ao verificar disponibilidade:', error)
        throw error
      }
    },

    async createMeetEvent(
      calendarId: string,
      event: {
        summary: string
        description: string
        startTime: string
        endTime: string
        timeZone: string
      }
    ) {
      try {
        const response = await calendar.events.insert({
          calendarId,
          conferenceDataVersion: 1,
          requestBody: {
            summary: event.summary,
            description: event.description,
            start: {
              dateTime: event.startTime,
              timeZone: event.timeZone,
            },
            end: {
              dateTime: event.endTime,
              timeZone: event.timeZone,
            },
          },
        })
        return response.data
      } catch (error) {
        console.error('Erro na Service ao criar evento:', error)
        throw error
      }
    },
  }
}
