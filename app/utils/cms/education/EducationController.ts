import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import type { EducationEntry } from '../types'
import { EducationEntrySchema } from '../schemas'
import CmsController from '../CmsController'
import User from '~~/utils/chat/entities/Agent/User'
import Message from '~/utils/chat/entities/Message'

export default class extends CmsController {
  org: string

  start: string
  end: string | null

  constructor(education: EducationEntry) {
    super(education)
    EducationEntrySchema.parse(education)
    this.org = education.org

    this.start = education.start
    this.end = education?.end
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
    On ${this.getDateToLocaleString().join('-')}, I studied at ${this.org} ${this.title}.
    ${this.getBodyAsPlain()}.`
    return new Message(new User(), message)
  }
}
