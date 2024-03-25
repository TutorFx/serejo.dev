import type { MarkdownRoot } from '@nuxt/content/types'

import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { visit } from 'unist-util-visit'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { HistoryEntry } from '../types'
import { HistoryEntrySchema } from '../schemas'

import 'dayjs/locale/pt'
import 'dayjs/locale/fr'
import 'dayjs/locale/es'

function hasValueProperty(node: any): node is { value: string } {
  return typeof node === 'object' && node !== null && 'value' in node
}

export default class {
  org: string
  title: string
  location: string

  start: string
  end: string | null

  body: MarkdownRoot | null
  _id: string

  constructor(history: HistoryEntry) {
    HistoryEntrySchema.parse(history)
    this.org = history.org
    this.title = history.title
    this.location = history.location

    this.start = history.start
    this.end = history?.end

    this.body = history.body
    this._id = history._id
  }

  toJSON() {
    return this.toObject()
  }

  toObject() {
    return { ...this }
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

  getBodyAsPlain() {
    let plainText = ''

    if (!this.body)
      return ''

    visit(this.body, 'text', (node: any) => {
      if (hasValueProperty(node))
        plainText += node.value
    })

    return plainText
  }

  getReadingTime() {
    if (!this.body)
      return 0

    let seconds = 0

    visit(this.body, 'text', () => {
      seconds += 4
    })

    return seconds
  }

  getLocaleReadingTime() {
    dayjs.extend(duration)
    dayjs.extend(relativeTime)
    return dayjs.duration(this.getReadingTime(), "seconds").locale(useLocale()).humanize();
  }

  getTruncatedDescription(maxLength: number = 60) {
    const description = this.getBodyAsPlain()
    if (description.length <= maxLength)
      return description // No need to truncate

    return `${description.substring(0, maxLength)}...`
  }
}
