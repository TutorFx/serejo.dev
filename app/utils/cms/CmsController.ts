import type { MarkdownRoot } from '@nuxt/content'
import dayjs from 'dayjs'
import { visit } from 'unist-util-visit'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import type { CmsEntry } from './types'
import { CmsEntrySchema } from './schemas'

import 'dayjs/locale/pt'
import 'dayjs/locale/fr'
import 'dayjs/locale/es'


function hasValueProperty(node: any): boolean {
  return typeof node === 'object' && node !== null && 'value' in node && typeof node.value === 'string'
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

  get id() {
    return this._id.match(/([a-z]{2}):([a-z]+):([a-z-]+)\.md/i)?.splice(1)
  }

  get filename() {
    return this.id?.at(-1)
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
        plainText += `${node.value}. `
    })

    return plainText
  }

  getReadingTime() {
    if (!this.body)
      return 0

    let seconds = 0

    visit(this.body, 'text', (node: any) => {
      if (hasValueProperty(node)) {
        const words = node.value.split(' ')
        seconds += 0.5 * words.length
      }
    })

    return seconds
  }

  getDayjs() {
    dayjs.extend(duration)
    dayjs.extend(relativeTime)
    return dayjs
  }

  getLocaleReadingTime() {
    // @ts-expect-error: For some reason, the DayJS 2.0 have some issues with the types on ESM
    return this.getDayjs().duration(this.getReadingTime(), 'seconds').locale(useLocale()).humanize()
  }

  getTruncatedDescription(maxLength: number = 60) {
    const description = this.getBodyAsPlain()
    if (description.length <= maxLength)
      return description // No need to truncate

    return `${description.substring(0, maxLength)}...`
  }

  getSafeTruncatedDescription(maxLength?: number) {
    return this.getTruncatedDescription(maxLength).replace(/([\u2700-\u27BF\uE000-\uF8FF\u2011-\u26FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF])/g, '')
  }
}
