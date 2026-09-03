import { defineTransformer } from '@nuxt/content'
import type { MinimarkTree } from '@nuxt/content'
import { extractTreeText, getLocaleFromPath, textToSeconds } from '../shared/utils/cms/cms.functions'
import { LOCALE_KEYS } from '../shared/utils/constants'

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
