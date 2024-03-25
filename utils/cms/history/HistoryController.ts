import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import type { HistoryEntry } from '../types'
import { HistoryEntrySchema } from '../schemas'
import CmsController from '../CmsController'

export default class extends CmsController {
  org: string
  location: string

  start: string
  end: string | null

  constructor(history: HistoryEntry) {
    super(history);
    HistoryEntrySchema.parse(history)
    this.org = history.org
    this.location = history.location

    this.start = history.start
    this.end = history?.end
  }

  getDateToLocaleString(locale: string = 'en') {
    // console.log(locale)

    const dates = []
    const dateToString = (date: Dayjs) => date.locale(locale).format('MMM, YYYY')

    dates.push(dayjs(this.start))
    if (this.end)
      dates.push(dayjs(this.end))

    return dates.map(dateToString)
  }

}
