import process from 'node:process'
import { defineNuxtModule, useLogger } from '@nuxt/kit'
import { parseFrontMatter } from 'remark-mdc'

import { Index } from '@upstash/vector'

export default defineNuxtModule({
  meta: {
    name: 'embedding-generator',
  },
  async setup(options, nuxt) {
    const frontMatterWithDividersRegex = /---.*?---/gs

    const logger = useLogger('embedding-generator', { formatOptions: {
      date: true,
    } })

    if (process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN) {
      const index = new Index({
        url: process.env.UPSTASH_VECTOR_REST_URL,
        token: process.env.UPSTASH_VECTOR_REST_TOKEN,
      })

      // We'll store simple document chunks mapped to their sources
      let documents: { id: string, data: string, metadata: any }[] = []

      nuxt.hooks.hook('content:file:afterParse', async (ctx) => {
        const { file } = ctx

        const { data: headerData } = parseFrontMatter(frontMatterWithDividersRegex.exec(file.body)?.at(0) ?? '')
        const body = file.body.replace(frontMatterWithDividersRegex, '')

        if (!body)
          return

        // Simple text splitting by double line breaks (paragraphs)
        const texts = body.split('\n\n').map(t => t.trim()).filter(t => t.length > 0)

        documents = documents.concat(texts.map((text, index) => {
          return {
            id: `${file.id}:${index}`,
            data: text, // upstash accepts raw text and embeds it automatically if configured
            metadata: {
              ...headerData,
              source: file.id,
            },
          }
        }))
      })

      nuxt.hooks.hook('ready', async (_ctx) => {
        logger.log('🦜 Documentos a serem analizados:', documents.length)

        // Batch upload to upstash
        if (documents.length > 0) {
          try {
            await index.upsert(documents)
            logger.log('✅ Documentos inseridos no Upstash Vector')
          }
          catch (e) {
            logger.error('❌ Falha ao inserir no Upstash Vector', e)
          }
        }
      })
    }
  },
})
