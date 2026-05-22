import highlight from '@comark/vue/plugins/highlight'
import html from '@shikijs/langs/html'
import css from '@shikijs/langs/css'
import python from '@shikijs/langs/python'
import sql from '@shikijs/langs/sql'
import diff from '@shikijs/langs/diff'
import dockerfile from '@shikijs/langs/dockerfile'
import xml from '@shikijs/langs/xml'
import toml from '@shikijs/langs/toml'
import markdown from '@shikijs/langs/markdown'
import SourceLink from './SourceLink.vue'

export default defineComarkComponent({
  name: 'ChatComark',
  plugins: [
    highlight({
      languages: [html, css, python, sql, diff, dockerfile, xml, toml, markdown],
    }),
  ],
  components: {
    'source-link': SourceLink,
  },
  class: '*:first:mt-0 *:last:mb-0',
})
