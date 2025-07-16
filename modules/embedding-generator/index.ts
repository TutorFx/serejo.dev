import { defineNuxtModule, createResolver, addServerHandler, addPrerenderRoutes, addServerImports, useLogger } from '@nuxt/kit'
import type { Document } from "@langchain/core/documents";
import { parseFrontMatter } from 'remark-mdc'

import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { FakeEmbeddings } from "@langchain/core/utils/testing";
import { Index } from "@upstash/vector";

export default defineNuxtModule({
  meta: {
    name: 'embedding-generator',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const frontMatterWithDividersRegex = /---.*?---/gs

    const logger = useLogger('embedding-generator', { formatOptions: {
      date: true
    }})

    const indexWithEmbeddings = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    });

    const vectorStore = new UpstashVectorStore(new FakeEmbeddings(), {
      index: indexWithEmbeddings,
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    let documents: Document[] = []

    nuxt.hooks.hook('content:file:afterParse', async (ctx) => {
      const { file } = ctx;

      const { data: headerData } = parseFrontMatter(frontMatterWithDividersRegex.exec(file.body)?.at(0) ?? '')
      const body = file.body.replace(frontMatterWithDividersRegex, '')
      
      if (!body) return;

      const texts = await textSplitter.splitText(body);


      documents = documents.concat(texts.map((text, index) => {
        return {
          pageContent: text,
          metadata: { 
            ...headerData,
            source: file.id,
          },
          id: file.id + ':' + index
        } satisfies Document
      }))
    })

    nuxt.hooks.hook('ready', async (ctx) => {
      logger.log('🦜 Documentos a serem analizados:', documents.length)
      await vectorStore.addDocuments(documents);
    })
  }
})