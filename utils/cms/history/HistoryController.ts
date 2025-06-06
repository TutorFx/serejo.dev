import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import User from '@/utils/chat/entities/Agent/User'
import Message from '@/utils/chat/entities/Message'
import CmsController from '~/utils/cms/CmsController'
import { HistoryEntrySchema } from '~/utils/cms/schemas'
import type { HistoryEntry } from '~/utils/cms/types'

export default class extends CmsController {
  org: string
  location: string

  start: string
  end: string | null

  constructor(history: HistoryEntry) {
    super(history)
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

  toMessage() {
    const message = `
    On ${this.getDateToLocaleString().join('-')}, I worked at ${this.org} in ${this.location} as a ${this.title}.
    ${this.getBodyAsPlain()}.`
    return new Message(new User(), message)
  }
}
