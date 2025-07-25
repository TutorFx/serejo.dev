import { defineTransformer } from '@nuxt/content'
import type { MinimarkTree } from '@nuxt/content'
import { LOCALE_KEYS } from '../shared/utils/constants'
import { extractTreeText, getLocaleFromPath, textToSeconds } from '../shared/utils/functions'

export default defineTransformer({
  name: 'reading-time',
  extensions: ['.md'],
  transform(file) {
    const reducedBody = extractTreeText(file.body as MinimarkTree)
    const readingTimeInSeconds = textToSeconds(reducedBody)
    const locale = getLocaleFromPath(file.id as string, LOCALE_KEYS)

    return {
      ...file,
      reducedBody,
      readingTimeInSeconds,
      locale,
    }
  },
})
