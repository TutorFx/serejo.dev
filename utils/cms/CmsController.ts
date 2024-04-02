import type { MarkdownRoot } from '@nuxt/content/types'
import dayjs from 'dayjs'
import { visit } from 'unist-util-visit'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'

import type { CmsEntry } from './types'
import { CmsEntrySchema } from './schemas'

import 'dayjs/locale/pt'
import 'dayjs/locale/fr'
import 'dayjs/locale/es'

function hasValueProperty(node: any): node is { value: string } {
  return typeof node === 'object' && node !== null && 'value' in node
}

export default class {
  title: string
  body: MarkdownRoot | null
  _id: string

  constructor(cms: CmsEntry) {
    CmsEntrySchema.parse(cms)

    this.title = cms.title
    this.body = cms.body
    this._id = cms._id
  }

  toJSON() {
    return this.toObject()
  }

  toObject() {
    return { ...this }
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

  getDayjs() {
    dayjs.extend(duration)
    dayjs.extend(relativeTime)
    return dayjs
  }

  getLocaleReadingTime() {
    return this.getDayjs().duration(this.getReadingTime(), 'seconds').locale(useLocale()).humanize()
  }

  getTruncatedDescription(maxLength: number = 60) {
    const description = this.getBodyAsPlain()
    if (description.length <= maxLength)
      return description // No need to truncate

    return `${description.substring(0, maxLength)}...`
  }
}
