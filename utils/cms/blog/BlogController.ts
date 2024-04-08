import dayjs from 'dayjs'

import type { BlogEntry } from '../types'
import { BlogEntrySchema } from '../schemas'
import CmsController from '../CmsController'

export default class extends CmsController {
  createdAt: string

  constructor(post: BlogEntry) {
    super(post)
    BlogEntrySchema.parse(post)
    this.createdAt = post.createdAt
  }

  getDateToLocaleString(locale: string = 'en') {
    return dayjs(this.createdAt).locale(locale).format('MMM DD, YYYY')
  } 
}
