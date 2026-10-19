import highlight from '@comark/vue/plugins/highlight'
import security from '@comark/vue/plugins/security'
import html from '@shikijs/langs/html'
import css from '@shikijs/langs/css'
import python from '@shikijs/langs/python'
import sql from '@shikijs/langs/sql'
import diff from '@shikijs/langs/diff'
import dockerfile from '@shikijs/langs/dockerfile'
import xml from '@shikijs/langs/xml'
import toml from '@shikijs/langs/toml'
import markdown from '@shikijs/langs/markdown'
import { SITE_URL } from '#shared/utils/constants'
import { chatAllowlist, chatSecurityOptions } from '~/utils/ai/comark-allowlist'
import SourceLink from './SourceLink.vue'

/**
 * Renderer for model output (assistant text and reasoning). Everything here is untrusted:
 * - `html: false` keeps raw HTML as text instead of turning it into elements
 * - `security` drops dangerous tags, `on*` attributes and unsafe link/image protocols
 * - `chatAllowlist` runs last and keeps only plain markdown elements, so the model cannot
 *   instantiate global components (Prose cards, callouts, images) or swap them with `as`
 */
export default defineComarkComponent({
  name: 'ChatComark',
  html: false,
  plugins: [
    highlight({
      languages: [html, css, python, sql, diff, dockerfile, xml, toml, markdown],
    }),
    security(chatSecurityOptions(SITE_URL)),
    chatAllowlist(),
  ],
  components: {
    'source-link': SourceLink,
  },
  class: '*:first:mt-0 *:last:mb-0',
})
